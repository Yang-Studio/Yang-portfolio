import { NextRequest } from 'next/server'
import { AnalyticsConfigError, recordPageView, recordVisit } from '@/lib/server/analyticsStore'
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

    // Always count an anonymous page view. This stores no personal identifiers
    // (no IP, no IP hash, no visitor id, no geolocation) and is kept even when
    // the visitor has declined analytics.
    const view = await recordPageView(body)

    // Detailed analytics (IP hash, visitor id, geolocation) only with consent.
    if (body.consent !== true) return jsonNoStore({ recorded: false, counted: view.counted })

    const result = await recordVisit(request, body)
    return jsonNoStore({ ...result, counted: view.counted })
  } catch (error) {
    if (error instanceof AnalyticsConfigError) {
      return jsonNoStore({ recorded: false, configured: false }, { status: 503 })
    }
    console.error('[portfolio-analytics]', error)
    return jsonNoStore({ recorded: false }, { status: 500 })
  }
}
