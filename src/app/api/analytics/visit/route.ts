import { NextRequest } from 'next/server'
import { AnalyticsConfigError, recordVisit } from '@/lib/server/analyticsStore'
import { isSameOrigin, jsonNoStore } from '@/lib/server/requestSecurity'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonNoStore({ error: 'Invalid origin.' }, { status: 403 })

  try {
    let body: { consent?: unknown; visitorId?: unknown; path?: unknown; referrer?: unknown }
    try {
      body = (await request.json()) as typeof body
    } catch {
      return jsonNoStore({ recorded: false, error: 'Invalid JSON.' }, { status: 400 })
    }

    if (body.consent !== true) return jsonNoStore({ recorded: false })

    const result = await recordVisit(request, body)
    return jsonNoStore(result)
  } catch (error) {
    if (error instanceof AnalyticsConfigError) {
      return jsonNoStore({ recorded: false, configured: false }, { status: 503 })
    }
    console.error('[portfolio-analytics]', error)
    return jsonNoStore({ recorded: false }, { status: 500 })
  }
}
