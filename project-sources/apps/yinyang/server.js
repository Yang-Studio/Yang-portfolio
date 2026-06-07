import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const ENV = await loadEnv(join(ROOT, '.env.local'));
const HOST = process.env.HOST || ENV.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || ENV.PORT || 4173);

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

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
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
});
