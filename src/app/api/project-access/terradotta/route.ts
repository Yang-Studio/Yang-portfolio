import { NextRequest } from 'next/server'
import {
  createTerradottaAccessToken,
  isTerradottaLockConfigured,
  terradottaAccessCookieName,
  terradottaAccessMaxAge,
  verifyTerradottaPassword,
} from '@/lib/server/projectAccess'
import { isSameOrigin, jsonNoStore } from '@/lib/server/requestSecurity'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonNoStore({ error: 'Invalid origin.' }, { status: 403 })
  if (!isTerradottaLockConfigured()) {
    return jsonNoStore({ error: '项目页面锁尚未配置。' }, { status: 503 })
  }

  let body: { password?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return jsonNoStore({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!verifyTerradottaPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 450))
    return jsonNoStore({ error: '密码错误。' }, { status: 401 })
  }

  const response = jsonNoStore({ ok: true })
  response.cookies.set(terradottaAccessCookieName, createTerradottaAccessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: terradottaAccessMaxAge,
    priority: 'high',
  })
  return response
}
