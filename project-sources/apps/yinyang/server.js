import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const ENV = await loadEnv(join(ROOT, '.env.local'));
const HOST = process.env.HOST || ENV.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || ENV.PORT || 4173);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ENV.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || ENV.OPENAI_MODEL || 'gpt-5.2';
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;
const requestsByIp = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'headline',
    'overall',
    'pillar_conclusions',
    'special_factors',
    'key_findings',
    'domains',
    'timing',
    'actions',
    'limits'
  ],
  properties: {
    headline: { type: 'string' },
    overall: { type: 'string' },
    pillar_conclusions: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'conclusion', 'evidence'],
        properties: {
          label: { type: 'string', enum: ['年柱', '月柱', '日柱', '时柱'] },
          conclusion: { type: 'string' },
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } }
        }
      }
    },
    special_factors: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'conclusion', 'weight', 'evidence'],
        properties: {
          name: { type: 'string', enum: ['纳音', '神煞', '空亡', '胎元', '命宫'] },
          conclusion: { type: 'string' },
          weight: { type: 'string', enum: ['主要信号', '辅助信号', '弱信号'] },
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } }
        }
      }
    },
    key_findings: {
      type: 'array',
      minItems: 3,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'conclusion', 'evidence'],
        properties: {
          title: { type: 'string' },
          conclusion: { type: 'string' },
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } }
        }
      }
    },
    domains: {
      type: 'array',
      minItems: 7,
      maxItems: 7,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'conclusion', 'strengths', 'risks', 'advice', 'evidence'],
        properties: {
          name: { type: 'string', enum: ['性格', '事业', '财富', '关系', '学习', '健康', '迁移'] },
          conclusion: { type: 'string' },
          strengths: { type: 'array', maxItems: 4, items: { type: 'string' } },
          risks: { type: 'array', maxItems: 4, items: { type: 'string' } },
          advice: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
          evidence: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string' } }
        }
      }
    },
    timing: {
      type: 'object',
      additionalProperties: false,
      required: ['current_cycle', 'current_year', 'interaction', 'focus'],
      properties: {
        current_cycle: { type: 'string' },
        current_year: { type: 'string' },
        interaction: { type: 'string' },
        focus: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } }
      }
    },
    actions: { type: 'array', minItems: 3, maxItems: 8, items: { type: 'string' } },
    limits: { type: 'string' }
  }
};

const instructions = [
  '你是一名严谨的中国传统历法与八字结构分析助手。',
  '你只根据输入的确定性排盘数据推理，不重新计算四柱，不编造缺失信息。',
  '必须把四柱、月令、日主旺衰、五行比例、十神及其柱位、藏干、十二长生、纳音、神煞、空亡、胎元、命宫、大运和流年联合起来判断。',
  '输出必须直接给出对这个人的具体结论，不要复述“某天干属某五行”之类的基础定义。',
  '年柱、月柱、日柱、时柱必须各写一条落到本人经历与行为模式上的结论，不能只解释柱位定义。',
  '纳音、神煞、空亡、胎元、命宫必须各写一条实际影响，并标注它在全盘判断中的权重；信号弱时直接说明弱在哪里。',
  '性格、事业、财富、关系、学习、健康、迁移七个领域必须全部覆盖，结论要体现本盘组合，而不是通用描述。',
  '每个结论必须附输入数据中的证据；证据不足时明确说信号有限。',
  '避免宿命论、恐吓和绝对预测。不得断言具体疾病、死亡、灾祸、违法、投资收益或必然发生的婚姻事件。',
  '健康内容只能给生活方式层面的提醒，并说明不能替代医疗诊断。',
  '财富内容不能构成投资建议。关系内容不能替代当事人沟通。',
  '语言使用简体中文，专业但通俗，结论优先，避免空泛套话。'
].join('\n');

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'POST' && url.pathname === '/api/ai-analysis') {
      await handleAiAnalysis(req, res);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }
    await serveStatic(url.pathname, req.method === 'HEAD', res);
  } catch (error) {
    console.error('[server]', safeError(error));
    if (!res.headersSent) sendJson(res, 500, { error: '服务器处理失败，请稍后重试。' });
    else res.end();
  }
});

async function handleAiAnalysis(req, res) {
  if (!OPENAI_API_KEY) {
    sendJson(res, 503, { error: '服务器尚未配置 OPENAI_API_KEY。' });
    return;
  }
  const ip = req.socket.remoteAddress || 'unknown';
  if (!allowRequest(ip)) {
    sendJson(res, 429, { error: '请求过于频繁，请一分钟后重试。' });
    return;
  }

  let body;
  try {
    body = JSON.parse(await readBody(req, 220_000));
  } catch (error) {
    sendJson(res, error.code === 'BODY_TOO_LARGE' ? 413 : 400, { error: '请求数据无效。' });
    return;
  }
  if (!body || typeof body.chart !== 'object' || typeof body.analysis !== 'object') {
    sendJson(res, 400, { error: '缺少命盘分析数据。' });
    return;
  }

  const payload = buildChartPayload(body.chart, body.analysis, body.year);
  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 600) : '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70_000);

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: { effort: 'medium' },
        max_output_tokens: 8000,
        store: false,
        instructions,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: [
                  '请对以下已经计算完成的命盘数据做联合推理。',
                  question ? `用户特别关注：${question}` : '用户没有指定额外问题，请完成全面综合分析。',
                  '命盘数据：',
                  JSON.stringify(payload)
                ].join('\n')
              }
            ]
          }
        ],
        text: {
          verbosity: 'high',
          format: {
            type: 'json_schema',
            name: 'bazi_ai_analysis',
            strict: true,
            schema: responseSchema
          }
        }
      })
    });

    const responseBody = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      console.error('[openai]', apiResponse.status, responseBody?.error?.code || 'request_failed');
      sendJson(res, mapOpenAiStatus(apiResponse.status), {
        error: openAiMessage(apiResponse.status, responseBody?.error?.code)
      });
      return;
    }

    const outputText = getOutputText(responseBody);
    if (!outputText) {
      const refusal = getRefusal(responseBody);
      if (refusal) {
        sendJson(res, 422, { error: `AI 无法完成这次分析：${refusal}` });
        return;
      }
      sendJson(res, 502, { error: 'AI 未返回可用内容，请重试。' });
      return;
    }
    const result = JSON.parse(outputText);
    sendJson(res, 200, {
      result,
      meta: {
        model: OPENAI_MODEL,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error.name === 'AbortError') sendJson(res, 504, { error: 'AI 推理超时，请稍后重试。' });
    else {
      console.error('[ai-analysis]', safeError(error));
      sendJson(res, 502, { error: '无法连接 AI 服务，请检查网络后重试。' });
    }
  } finally {
    clearTimeout(timeout);
  }
}

function buildChartPayload(chart, analysis, year) {
  return {
    birth: {
      date: chart.input?.rawDate || '',
      time: chart.input?.rawTime || '',
      gender: chart.input?.gender || '',
      trueSolarTime: Boolean(chart.input?.trueSolarTime)
    },
    lunarDate: chart.lunarDate,
    dayMaster: chart.dayMaster,
    pillars: (chart.pillars || []).map((p) => ({
      label: p.label,
      ganzhi: p.ganzhi,
      ganElement: p.ganElement,
      ganYinYang: p.ganYinYang,
      ganShiShen: p.ganShiShen,
      hidden: p.hidden,
      diShi: p.diShi
    })),
    fiveElements: chart.fiveElements,
    tenGods: chart.tenGods,
    luckStart: chart.luckStart,
    luckCycle: chart.luckCycle,
    hidden: chart.hidden,
    computedAnalysis: {
      strength: analysis.strength,
      yongShen: analysis.yongShen,
      geJu: analysis.geJu,
      balance: analysis.balance,
      personality: analysis.personality,
      career: analysis.career,
      luck: analysis.luck,
      inferences: analysis.inferences
    },
    selectedYear: year || new Date().getFullYear()
  };
}

async function serveStatic(pathname, headOnly, res) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    sendJson(res, 400, { error: 'Invalid path' });
    return;
  }
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const segments = relative.split(/[\\/]/);
  const privateFiles = new Set(['server.js', 'package.json', 'package-lock.json']);
  if (segments.some((segment) => segment.startsWith('.')) || privateFiles.has(relative.toLowerCase())) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }
  const filePath = resolve(ROOT, normalize(relative));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }
  try {
    const info = await stat(filePath);
    const target = info.isDirectory() ? join(filePath, 'index.html') : filePath;
    const data = await readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(headOnly ? undefined : data);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

async function loadEnv(path) {
  try {
    const content = await readFile(path, 'utf8');
    const env = {};
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const index = line.indexOf('=');
      if (index < 1) continue;
      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

function readBody(req, limit) {
  return new Promise((resolveBody, rejectBody) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        const error = new Error('Body too large');
        error.code = 'BODY_TOO_LARGE';
        rejectBody(error);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    req.on('error', rejectBody);
  });
}

function allowRequest(ip) {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  requestsByIp.set(ip, recent);
  return true;
}

function getOutputText(response) {
  if (typeof response.output_text === 'string') return response.output_text;
  for (const item of response.output || []) {
    if (item.type !== 'message') continue;
    for (const content of item.content || []) {
      if (content.type === 'output_text' && typeof content.text === 'string') return content.text;
    }
  }
  return '';
}

function getRefusal(response) {
  for (const item of response.output || []) {
    if (item.type !== 'message') continue;
    for (const content of item.content || []) {
      if (content.type === 'refusal' && typeof content.refusal === 'string') return content.refusal;
    }
  }
  return '';
}

function mapOpenAiStatus(status) {
  if (status === 401 || status === 403) return 503;
  if (status === 429) return 429;
  return 502;
}

function openAiMessage(status, code) {
  if (status === 401 || status === 403) return 'OpenAI API 密钥无效或没有模型权限。';
  if (status === 429 && code === 'insufficient_quota') return 'OpenAI API 额度不足，请检查项目余额。';
  if (status === 429) return 'AI 请求达到速率限制，请稍后重试。';
  return 'OpenAI API 请求失败，请稍后重试。';
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function safeError(error) {
  return {
    name: error?.name || 'Error',
    message: String(error?.message || error).slice(0, 300)
  };
}

server.listen(PORT, HOST, () => {
  console.log(`BaZi server: http://${HOST}:${PORT}`);
  console.log(`AI model: ${OPENAI_MODEL}`);
  console.log(`API key configured: ${Boolean(OPENAI_API_KEY)}`);
});
