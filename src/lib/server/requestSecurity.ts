import { NextRequest, NextResponse } from 'next/server'

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    const requestHost = forwardedHost || request.headers.get('host')
    if (requestHost && originUrl.host === requestHost) return true

    if (process.env.NODE_ENV !== 'production') {
      return ['localhost', '127.0.0.1', '10.0.0.134'].includes(originUrl.hostname)
    }

    return origin === request.nextUrl.origin
  } catch {
    return false
  }
}

export function jsonNoStore(data: unknown, init?: ResponseInit) {
  const response = NextResponse.json(data, init)
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}
