import { NextRequest } from 'next/server'
import {
  adminCookieMaxAge,
  adminCookieName,
  createAdminSession,
  verifyAdminPassword,
} from '@/lib/server/adminAuth'
import { isSameOrigin, jsonNoStore } from '@/lib/server/requestSecurity'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonNoStore({ error: 'Invalid origin.' }, { status: 403 })

  let body: { password?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return jsonNoStore({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    const password = typeof body.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      await new Promise((resolve) => setTimeout(resolve, 450))
      return jsonNoStore({ error: '密码错误。' }, { status: 401 })
    }

    const response = jsonNoStore({ ok: true })
    response.cookies.set(adminCookieName, createAdminSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: adminCookieMaxAge,
      priority: 'high',
    })
    return response
  } catch (error) {
    console.error('[admin-login]', error)
    return jsonNoStore({ error: '请在服务器中配置 ADMIN_PASSWORD。' }, { status: 503 })
  }
}
