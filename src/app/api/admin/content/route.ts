import { NextRequest } from 'next/server'
import { readAdminSession, adminCookieName } from '@/lib/server/adminAuth'
import { getContentOverrides, setContentOverride } from '@/lib/server/contentStore'
import { isSameOrigin, jsonNoStore } from '@/lib/server/requestSecurity'
import type { EditableContent, ImageOverride, LangOverride } from '@/lib/content/overrides'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authed(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(adminCookieName)?.value))
}

export async function GET(request: NextRequest) {
  if (!authed(request)) return jsonNoStore({ error: 'Unauthorized.' }, { status: 401 })
  return jsonNoStore({ overrides: await getContentOverrides() })
}

const pickEditable = (value: unknown): EditableContent | undefined => {
  if (!value || typeof value !== 'object') return undefined
  return value as EditableContent
}

export async function PUT(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonNoStore({ error: 'Invalid origin.' }, { status: 403 })
  if (!authed(request)) return jsonNoStore({ error: 'Unauthorized.' }, { status: 401 })

  let body: { slug?: unknown; en?: unknown; zh?: unknown; images?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return jsonNoStore({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug : ''
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return jsonNoStore({ error: 'Invalid slug.' }, { status: 400 })

  const value: LangOverride = {}
  const en = pickEditable(body.en)
  const zh = pickEditable(body.zh)
  const images = body.images && typeof body.images === 'object' ? (body.images as ImageOverride) : undefined
  if (en) value.en = en
  if (zh) value.zh = zh
  if (images) value.images = images

  try {
    await setContentOverride(slug, value)
    return jsonNoStore({ ok: true })
  } catch (error) {
    console.error('[admin-content]', error)
    return jsonNoStore({ error: 'Save failed. Is the database configured?' }, { status: 503 })
  }
}
