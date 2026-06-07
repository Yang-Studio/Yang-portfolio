import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type JsonObject = Record<string, unknown>

const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 8
const requestsByIp = new Map<string, number[]>()

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
    'limits',
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
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
        },
      },
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
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
        },
      },
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
          evidence: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
        },
      },
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
          evidence: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string' } },
        },
      },
    },
    timing: {
      type: 'object',
      additionalProperties: false,
      required: ['current_cycle', 'current_year', 'interaction', 'focus'],
      properties: {
        current_cycle: { type: 'string' },
        current_year: { type: 'string' },
        interaction: { type: 'string' },
        focus: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
      },
    },
    actions: { type: 'array', minItems: 3, maxItems: 8, items: { type: 'string' } },
    limits: { type: 'string' },
  },
}

const instructions = [
  '你是一名严谨的中国传统历法与八字结构分析助手。',
  '只根据输入的确定性排盘数据推理，不重新计算四柱，不编造缺失信息。',
  '联合四柱、月令、日主旺衰、五行比例、十神、藏干、十二长生、纳音、神煞、空亡、胎元、命宫、大运和流年判断。',
  '结论优先，必须给出与本人行为和现实经历相关的具体解释，并为每项结论附上输入数据中的证据。',
  '纳音、神煞、空亡、胎元和命宫都要标注权重；信号有限时明确说明。',
  '覆盖性格、事业、财富、关系、学习、健康和迁移七个领域，避免宿命论、恐吓和绝对预测。',
  '不得断言疾病、死亡、灾祸、违法、投资收益或必然发生的婚姻事件。',
  '健康内容仅提供生活方式提醒，财富内容不构成投资建议，关系内容不能替代当事人沟通。',
  '使用简体中文，专业但通俗，避免空泛套话。',
].join('\n')

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-5.2'

  if (!apiKey) return json({ error: '服务器尚未配置 OPENAI_API_KEY。' }, 503)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!allowRequest(ip)) return json({ error: '请求过于频繁，请一分钟后重试。' }, 429)

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 220_000) return json({ error: '请求数据过大。' }, 413)

  let body: JsonObject
  try {
    body = asObject(await request.json())
  } catch {
    return json({ error: '请求数据无效。' }, 400)
  }

  const chart = asObject(body.chart)
  const analysis = asObject(body.analysis)
  if (!Object.keys(chart).length || !Object.keys(analysis).length) {
    return json({ error: '缺少命盘分析数据。' }, 400)
  }

  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 600) : ''
  const payload = buildChartPayload(chart, analysis, body.year)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 70_000)

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
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
                  JSON.stringify(payload),
                ].join('\n'),
              },
            ],
          },
        ],
        text: {
          verbosity: 'high',
          format: { type: 'json_schema', name: 'bazi_ai_analysis', strict: true, schema: responseSchema },
        },
      }),
    })

    const responseBody = asObject(await apiResponse.json().catch(() => ({})))
    if (!apiResponse.ok) {
      const error = asObject(responseBody.error)
      const code = typeof error.code === 'string' ? error.code : ''
      return json({ error: openAiMessage(apiResponse.status, code) }, mapOpenAiStatus(apiResponse.status))
    }

    const outputText = getOutputText(responseBody)
    if (!outputText) {
      const refusal = getRefusal(responseBody)
      return json(
        { error: refusal ? `AI 无法完成这次分析：${refusal}` : 'AI 未返回可用内容，请重试。' },
        refusal ? 422 : 502,
      )
    }

    return json(
      { result: JSON.parse(outputText), meta: { model, generatedAt: new Date().toISOString() } },
      200,
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return json({ error: 'AI 推理超时，请稍后重试。' }, 504)
    }
    console.error('[yinyang-ai-analysis]', error)
    return json({ error: '无法连接 AI 服务，请稍后重试。' }, 502)
  } finally {
    clearTimeout(timeout)
  }
}

function buildChartPayload(chart: JsonObject, analysis: JsonObject, year: unknown) {
  const input = asObject(chart.input)
  return {
    birth: {
      date: input.rawDate || '',
      time: input.rawTime || '',
      gender: input.gender || '',
      trueSolarTime: Boolean(input.trueSolarTime),
    },
    lunarDate: chart.lunarDate,
    dayMaster: chart.dayMaster,
    pillars: asArray(chart.pillars).map((value) => {
      const pillar = asObject(value)
      return {
        label: pillar.label,
        ganzhi: pillar.ganzhi,
        ganElement: pillar.ganElement,
        ganYinYang: pillar.ganYinYang,
        ganShiShen: pillar.ganShiShen,
        hidden: pillar.hidden,
        diShi: pillar.diShi,
      }
    }),
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
      inferences: analysis.inferences,
    },
    selectedYear: year || new Date().getFullYear(),
  }
}

function allowRequest(ip: string) {
  const now = Date.now()
  const recent = (requestsByIp.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) return false
  requestsByIp.set(ip, [...recent, now])
  return true
}

function getOutputText(response: JsonObject) {
  if (typeof response.output_text === 'string') return response.output_text
  for (const itemValue of asArray(response.output)) {
    const item = asObject(itemValue)
    if (item.type !== 'message') continue
    for (const contentValue of asArray(item.content)) {
      const content = asObject(contentValue)
      if (content.type === 'output_text' && typeof content.text === 'string') return content.text
    }
  }
  return ''
}

function getRefusal(response: JsonObject) {
  for (const itemValue of asArray(response.output)) {
    const item = asObject(itemValue)
    if (item.type !== 'message') continue
    for (const contentValue of asArray(item.content)) {
      const content = asObject(contentValue)
      if (content.type === 'refusal' && typeof content.refusal === 'string') return content.refusal
    }
  }
  return ''
}

function mapOpenAiStatus(status: number) {
  if (status === 401 || status === 403) return 503
  if (status === 429) return 429
  return 502
}

function openAiMessage(status: number, code: string) {
  if (status === 401 || status === 403) return 'OpenAI API 密钥无效或没有模型权限。'
  if (status === 429 && code === 'insufficient_quota') return 'OpenAI API 额度不足，请检查项目余额。'
  if (status === 429) return 'AI 请求达到速率限制，请稍后重试。'
  return 'OpenAI API 请求失败，请稍后重试。'
}

function asObject(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function json(value: JsonObject, status: number) {
  return NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  })
}
