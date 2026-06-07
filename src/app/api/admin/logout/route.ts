import { NextRequest } from 'next/server'
import { adminCookieName } from '@/lib/server/adminAuth'
import { isSameOrigin, jsonNoStore } from '@/lib/server/requestSecurity'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonNoStore({ error: 'Invalid origin.' }, { status: 403 })

  const response = jsonNoStore({ ok: true })
  response.cookies.set(adminCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return response
}
