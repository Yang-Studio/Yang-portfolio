import { NextRequest } from 'next/server'
import { readAdminSession, adminCookieName } from '@/lib/server/adminAuth'
import { AnalyticsConfigError, getAnalyticsSummary } from '@/lib/server/analyticsStore'
import { jsonNoStore } from '@/lib/server/requestSecurity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = readAdminSession(request.cookies.get(adminCookieName)?.value)
  if (!session) return jsonNoStore({ error: 'Unauthorized.' }, { status: 401 })

  try {
    return jsonNoStore(await getAnalyticsSummary())
  } catch (error) {
    if (error instanceof AnalyticsConfigError) {
      return jsonNoStore({ error: error.message, configured: false }, { status: 503 })
    }
    console.error('[admin-analytics]', error)
    return jsonNoStore({ error: 'Unable to load analytics.' }, { status: 500 })
  }
}
