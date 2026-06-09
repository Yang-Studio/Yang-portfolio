import { createHmac } from 'node:crypto'
import { readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'
import type { NextRequest } from 'next/server'

type Sql = ReturnType<typeof neon>

let sqlClient: Sql | undefined
let schemaReady: Promise<void> | undefined
let localWriteQueue = Promise.resolve()

const ANALYTICS_TIME_ZONE = 'America/New_York'
const DAILY_WINDOW_DAYS = 30

type VisitRecord = {
  visitorIdHash: string
  ipHash: string
  ip: string
  continent: string
  country: string
  region: string
  city: string
  timezone: string
  path: string
  referrerHost: string
  device: string
  visitedAt: string
}

export type AnalyticsSummary = {
  totalVisits: number
  totalPageViews: number
  last7DaysPageViews: number
  uniqueVisitors: number
  last24HoursVisits: number
  last7DaysVisits: number
  dailyVisitors: { date: string; visits: number; uniqueVisitors: number }[]
  topPages: { path: string; visits: number; uniqueVisitors: number }[]
  topLocations: { location: string; timezone: string; visits: number; uniqueVisitors: number }[]
  deviceBreakdown: { device: string; visits: number; uniqueVisitors: number }[]
  recentVisits: {
    visitorLabel: string
    ipLabel: string
    ip: string
    visitedAt: string
    path: string
    continent: string
    country: string
    region: string
    city: string
    timezone: string
    device: string
    referrerHost: string
  }[]
}

export class AnalyticsConfigError extends Error {}

function localStoreEnabled() {
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== 'production'
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new AnalyticsConfigError('DATABASE_URL is not configured.')
  sqlClient ??= neon(databaseUrl)
  return sqlClient
}

function analyticsSalt() {
  const salt = process.env.ADMIN_PASSWORD
  if (!salt) throw new AnalyticsConfigError('ADMIN_PASSWORD is not configured.')
  return salt
}

async function ensureSchema() {
  const sql = getSql()
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_visits (
        id BIGSERIAL PRIMARY KEY,
        visitor_id_hash TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        ip TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        continent TEXT,
        timezone TEXT,
        path TEXT NOT NULL,
        referrer_host TEXT,
        device TEXT,
        visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`ALTER TABLE portfolio_visits ADD COLUMN IF NOT EXISTS continent TEXT`
    await sql`ALTER TABLE portfolio_visits ADD COLUMN IF NOT EXISTS timezone TEXT`
    await sql`ALTER TABLE portfolio_visits ADD COLUMN IF NOT EXISTS ip TEXT`
    await sql`CREATE INDEX IF NOT EXISTS portfolio_visits_visited_at_idx ON portfolio_visits (visited_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS portfolio_visits_visitor_idx ON portfolio_visits (visitor_id_hash, visited_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS portfolio_visits_path_idx ON portfolio_visits (path, visited_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS portfolio_visits_device_idx ON portfolio_visits (device, visited_at DESC)`
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_page_views (
        day DATE NOT NULL,
        path TEXT NOT NULL,
        views INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (day, path)
      )
    `
  })()
  return schemaReady
}

function hashPrivateValue(value: string, purpose: string) {
  return createHmac('sha256', analyticsSalt()).update(`${purpose}:${value}`).digest('hex')
}

function decodeHeader(value: string | null) {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function clientIp(request: NextRequest) {
  const forwardedFor =
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    ''
  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}

function cleanHeader(value: string | null, maxLength: number) {
  return decodeHeader(value).trim().slice(0, maxLength)
}

function firstHeader(request: NextRequest, names: string[], maxLength: number) {
  for (const name of names) {
    const value = cleanHeader(request.headers.get(name), maxLength)
    if (value) return value
  }
  return ''
}

function locationFromRequest(request: NextRequest) {
  return {
    continent: firstHeader(request, ['x-vercel-ip-continent', 'cf-ipcontinent'], 20),
    country: firstHeader(request, ['x-vercel-ip-country', 'cf-ipcountry', 'x-appengine-country'], 80),
    region: firstHeader(request, ['x-vercel-ip-country-region', 'cf-region', 'x-appengine-region'], 120),
    city: firstHeader(request, ['x-vercel-ip-city', 'cf-ipcity', 'x-appengine-city'], 120),
    timezone: firstHeader(request, ['x-vercel-ip-timezone', 'cf-timezone'], 80),
  }
}

function referrerHost(referrer: unknown) {
  if (typeof referrer !== 'string' || !referrer) return ''
  try {
    return new URL(referrer).host.slice(0, 180)
  } catch {
    return ''
  }
}

function deviceFromUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()
  if (/bot|crawler|spider|slurp/.test(ua)) return 'bot'
  if (/mobile|iphone|android/.test(ua)) return 'mobile'
  if (/ipad|tablet/.test(ua)) return 'tablet'
  return 'desktop'
}

function cleanPath(path: unknown) {
  if (typeof path !== 'string' || !path.startsWith('/')) return '/'
  return path.slice(0, 240)
}

function rowsOf<T>(result: unknown) {
  return Array.isArray(result) ? (result as T[]) : []
}

function countryName(country: string) {
  if (!/^[A-Z]{2}$/i.test(country)) return country
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(country.toUpperCase()) || country
  } catch {
    return country
  }
}

const usRegionNames: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
}

function regionName(country: string, region: string) {
  if (country.toUpperCase() === 'US') return usRegionNames[region.toUpperCase()] || region
  return region
}

function continentName(continent: string) {
  const names: Record<string, string> = {
    AF: '非洲',
    AN: '南极洲',
    AS: '亚洲',
    EU: '欧洲',
    NA: '北美洲',
    OC: '大洋洲',
    SA: '南美洲',
  }
  return names[continent.toUpperCase()] || continent
}

export function formatAnalyticsLocation(city: string, region: string, country: string, continent = '') {
  const parts = [city, regionName(country || '', region || ''), countryName(country || ''), continentName(continent)].filter(
    Boolean,
  )
  return parts.join(', ') || 'Unknown'
}

function dateKeyInAnalyticsTimezone(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ANALYTICS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type: string) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function dateKeyDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return dateKeyInAnalyticsTimezone(date)
}

export function analyticsDateKey(date: Date = new Date()) {
  return dateKeyInAnalyticsTimezone(date)
}

function resolveRecentVisitsDate(value?: string): string | 'all' {
  if (value === 'all') return 'all'
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return analyticsDateKey()
}

const localAnalyticsPath = () => resolve(process.cwd(), '.analytics.local.json')

async function readLocalVisits() {
  try {
    const parsed = JSON.parse(await readFile(localAnalyticsPath(), 'utf8'))
    return Array.isArray(parsed) ? (parsed as VisitRecord[]) : []
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function writeLocalVisits(visits: VisitRecord[]) {
  const target = localAnalyticsPath()
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(visits, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

function localRecordFromRequest(
  request: NextRequest,
  body: { visitorId?: unknown; path?: unknown; referrer?: unknown },
) {
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId : ''
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(visitorId)) return undefined

  return {
    visitorIdHash: hashPrivateValue(visitorId, 'visitor'),
    ipHash: hashPrivateValue(clientIp(request), 'ip'),
    ip: clientIp(request),
    ...locationFromRequest(request),
    path: cleanPath(body.path),
    referrerHost: referrerHost(body.referrer),
    device: deviceFromUserAgent(request.headers.get('user-agent') || ''),
    visitedAt: new Date().toISOString(),
  } satisfies VisitRecord
}

async function recordLocalVisit(
  request: NextRequest,
  body: { visitorId?: unknown; path?: unknown; referrer?: unknown },
) {
  const record = localRecordFromRequest(request, body)
  if (!record) return { recorded: false }

  let recorded = false
  localWriteQueue = localWriteQueue.then(async () => {
    const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000
    const visits = (await readLocalVisits()).filter((visit) => new Date(visit.visitedAt).getTime() >= cutoff)
    const duplicate = visits.some(
      (visit) =>
        visit.visitorIdHash === record.visitorIdHash &&
        visit.path === record.path &&
        Date.now() - new Date(visit.visitedAt).getTime() < 30_000,
    )
    if (!duplicate) {
      visits.push(record)
      recorded = true
    }
    await writeLocalVisits(visits)
  })
  await localWriteQueue
  return { recorded }
}

// --- Aggregate page-view counter -------------------------------------------
// Counts every page view (including visitors who declined analytics). Stores
// NO personal identifiers: no IP, no IP hash, no visitor id, no geolocation.
// Only an anonymous per-day, per-path tally, which is not personal data.

type PageViewStore = { days: Record<string, Record<string, number>> }

const localPageViewsPath = () => resolve(process.cwd(), '.page-views.local.json')
let pageViewWriteQueue = Promise.resolve()

async function readLocalPageViews(): Promise<PageViewStore> {
  try {
    const parsed = JSON.parse(await readFile(localPageViewsPath(), 'utf8'))
    if (parsed && typeof parsed === 'object' && parsed.days && typeof parsed.days === 'object') {
      return parsed as PageViewStore
    }
    return { days: {} }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { days: {} }
    throw error
  }
}

async function writeLocalPageViews(store: PageViewStore) {
  const target = localPageViewsPath()
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

async function recordLocalPageView(body: { path?: unknown }) {
  const path = cleanPath(body.path)
  const day = dateKeyInAnalyticsTimezone(new Date())
  const cutoff = dateKeyDaysAgo(180)
  pageViewWriteQueue = pageViewWriteQueue.then(async () => {
    const store = await readLocalPageViews()
    const days: Record<string, Record<string, number>> = {}
    for (const [key, paths] of Object.entries(store.days)) {
      if (key >= cutoff) days[key] = paths
    }
    days[day] = days[day] || {}
    days[day][path] = (days[day][path] || 0) + 1
    await writeLocalPageViews({ days })
  })
  await pageViewWriteQueue
  return { counted: true }
}

async function readLocalPageViewTotals() {
  const store = await readLocalPageViews()
  const cutoff7 = dateKeyDaysAgo(6)
  let total = 0
  let last7 = 0
  for (const [day, paths] of Object.entries(store.days)) {
    const dayTotal = Object.values(paths).reduce((sum, value) => sum + (Number(value) || 0), 0)
    total += dayTotal
    if (day >= cutoff7) last7 += dayTotal
  }
  return { totalPageViews: total, last7DaysPageViews: last7 }
}

export async function recordPageView(body: { path?: unknown }) {
  if (localStoreEnabled()) return recordLocalPageView(body)

  await ensureSchema()
  const sql = getSql()
  const path = cleanPath(body.path)
  await sql`
    INSERT INTO portfolio_page_views (day, path, views)
    VALUES ((NOW() AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date, ${path}, 1)
    ON CONFLICT (day, path) DO UPDATE SET views = portfolio_page_views.views + 1
  `
  await sql`DELETE FROM portfolio_page_views WHERE day < (NOW() AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date - INTERVAL '180 days'`
  return { counted: true }
}

export async function recordVisit(
  request: NextRequest,
  body: { visitorId?: unknown; path?: unknown; referrer?: unknown },
) {
  if (localStoreEnabled()) return recordLocalVisit(request, body)

  const visitorId = typeof body.visitorId === 'string' ? body.visitorId : ''
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(visitorId)) return { recorded: false }

  await ensureSchema()
  const sql = getSql()
  const path = cleanPath(body.path)
  const visitorHash = hashPrivateValue(visitorId, 'visitor')
  const ip = clientIp(request)
  const ipHash = hashPrivateValue(ip, 'ip')
  const location = locationFromRequest(request)
  const referrer = referrerHost(body.referrer)
  const device = deviceFromUserAgent(request.headers.get('user-agent') || '')

  const recent = rowsOf<{ id: number }>(await sql`
    SELECT id FROM portfolio_visits
    WHERE visitor_id_hash = ${visitorHash}
      AND path = ${path}
      AND visited_at > NOW() - INTERVAL '30 seconds'
    LIMIT 1
  `)

  if (!recent.length) {
    await sql`
      INSERT INTO portfolio_visits (
        visitor_id_hash, ip_hash, ip, country, region, city, continent, timezone, path, referrer_host, device
      )
      VALUES (
        ${visitorHash},
        ${ipHash},
        ${ip},
        ${location.country},
        ${location.region},
        ${location.city},
        ${location.continent},
        ${location.timezone},
        ${path},
        ${referrer},
        ${device}
      )
    `
  }

  await sql`DELETE FROM portfolio_visits WHERE visited_at < NOW() - INTERVAL '180 days'`
  return { recorded: !recent.length }
}

function summarizeVisits(visits: VisitRecord[], recentVisitsDate: string | 'all' = 'all'): AnalyticsSummary {
  const now = Date.now()
  const uniqueVisitors = new Set(visits.map((visit) => visit.visitorIdHash)).size
  const group = <T extends string>(keyOf: (visit: VisitRecord) => T) => {
    const groups = new Map<T, { visits: number; visitors: Set<string> }>()
    for (const visit of visits) {
      const key = keyOf(visit)
      const current = groups.get(key) || { visits: 0, visitors: new Set<string>() }
      current.visits += 1
      current.visitors.add(visit.visitorIdHash)
      groups.set(key, current)
    }
    return [...groups.entries()].sort((left, right) => right[1].visits - left[1].visits)
  }

  return {
    totalVisits: visits.length,
    totalPageViews: 0,
    last7DaysPageViews: 0,
    uniqueVisitors,
    last24HoursVisits: visits.filter((visit) => now - new Date(visit.visitedAt).getTime() <= 24 * 60 * 60 * 1000).length,
    last7DaysVisits: visits.filter((visit) => now - new Date(visit.visitedAt).getTime() <= 7 * 24 * 60 * 60 * 1000).length,
    dailyVisitors: buildDailyVisitors(visits),
    topPages: group((visit) => visit.path)
      .slice(0, 12)
      .map(([path, value]) => ({ path, visits: value.visits, uniqueVisitors: value.visitors.size })),
    topLocations: group((visit) => formatAnalyticsLocation(visit.city, visit.region, visit.country, visit.continent))
      .slice(0, 12)
      .map(([location, value]) => {
        const firstVisit = visits.find(
          (visit) => formatAnalyticsLocation(visit.city, visit.region, visit.country, visit.continent) === location,
        )
        return { location, timezone: firstVisit?.timezone || '', visits: value.visits, uniqueVisitors: value.visitors.size }
      }),
    deviceBreakdown: group((visit) => visit.device || 'unknown').map(([device, value]) => ({
      device,
      visits: value.visits,
      uniqueVisitors: value.visitors.size,
    })),
    recentVisits: (recentVisitsDate === 'all'
      ? [...visits]
      : visits.filter((visit) => dateKeyInAnalyticsTimezone(new Date(visit.visitedAt)) === recentVisitsDate))
      .sort((left, right) => new Date(right.visitedAt).getTime() - new Date(left.visitedAt).getTime())
      .slice(0, 500)
      .map((visit) => ({
        visitorLabel: visit.visitorIdHash.slice(0, 12),
        ipLabel: visit.ipHash.slice(0, 12),
        ip: visit.ip || '',
        visitedAt: visit.visitedAt,
        path: visit.path,
        continent: visit.continent || '',
        country: visit.country || '',
        region: visit.region || '',
        city: visit.city || '',
        timezone: visit.timezone || '',
        device: visit.device,
        referrerHost: visit.referrerHost,
      })),
  }
}

function buildDailyVisitors(visits: VisitRecord[]) {
  const today = new Date()
  const dates = Array.from({ length: DAILY_WINDOW_DAYS }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (DAILY_WINDOW_DAYS - 1 - index))
    return dateKeyInAnalyticsTimezone(date)
  })
  const grouped = new Map<string, { visits: number; visitors: Set<string> }>()

  for (const visit of visits) {
    const key = dateKeyInAnalyticsTimezone(new Date(visit.visitedAt))
    const current = grouped.get(key) || { visits: 0, visitors: new Set<string>() }
    current.visits += 1
    current.visitors.add(visit.visitorIdHash)
    grouped.set(key, current)
  }

  return dates.map((date) => {
    const value = grouped.get(date)
    return { date, visits: value?.visits || 0, uniqueVisitors: value?.visitors.size || 0 }
  })
}

export async function getAnalyticsSummary(
  options: { recentVisitsDate?: string } = {},
): Promise<AnalyticsSummary> {
  const recentVisitsDate = resolveRecentVisitsDate(options.recentVisitsDate)

  if (localStoreEnabled()) {
    const summary = summarizeVisits(await readLocalVisits(), recentVisitsDate)
    return { ...summary, ...(await readLocalPageViewTotals()) }
  }

  await ensureSchema()
  const sql = getSql()

  const totals = rowsOf<{
    total_visits?: number
    unique_visitors?: number
    last_24_hours_visits?: number
    last_7_days_visits?: number
  }>(await sql`
    SELECT
      COUNT(*)::int AS total_visits,
      COUNT(DISTINCT visitor_id_hash)::int AS unique_visitors,
      COUNT(*) FILTER (WHERE visited_at >= NOW() - INTERVAL '24 hours')::int AS last_24_hours_visits,
      COUNT(*) FILTER (WHERE visited_at >= NOW() - INTERVAL '7 days')::int AS last_7_days_visits
    FROM portfolio_visits
  `)

  const pages = rowsOf<{ path?: string; visits?: number; unique_visitors?: number }>(await sql`
    SELECT
      path,
      COUNT(*)::int AS visits,
      COUNT(DISTINCT visitor_id_hash)::int AS unique_visitors
    FROM portfolio_visits
    GROUP BY path
    ORDER BY visits DESC
    LIMIT 12
  `)

  const locations = rowsOf<{
    continent?: string
    city?: string
    region?: string
    country?: string
    timezone?: string
    visits?: number
    unique_visitors?: number
  }>(await sql`
    SELECT
      COALESCE(NULLIF(continent, ''), '') AS continent,
      COALESCE(NULLIF(city, ''), 'Unknown') AS city,
      COALESCE(NULLIF(region, ''), '') AS region,
      COALESCE(NULLIF(country, ''), '') AS country,
      COALESCE(NULLIF(timezone, ''), '') AS timezone,
      COUNT(*)::int AS visits,
      COUNT(DISTINCT visitor_id_hash)::int AS unique_visitors
    FROM portfolio_visits
    GROUP BY continent, city, region, country, timezone
    ORDER BY visits DESC
    LIMIT 12
  `)

  const daily = rowsOf<{ date?: string; visits?: number; unique_visitors?: number }>(await sql`
    WITH days AS (
      SELECT generate_series(
        ((NOW() AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date - INTERVAL '29 days')::date,
        (NOW() AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date,
        INTERVAL '1 day'
      )::date AS day
    ),
    aggregated AS (
      SELECT
        (visited_at AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date AS day,
        COUNT(*)::int AS visits,
        COUNT(DISTINCT visitor_id_hash)::int AS unique_visitors
      FROM portfolio_visits
      WHERE visited_at >= NOW() - INTERVAL '31 days'
      GROUP BY day
    )
    SELECT
      to_char(days.day, 'YYYY-MM-DD') AS date,
      COALESCE(aggregated.visits, 0)::int AS visits,
      COALESCE(aggregated.unique_visitors, 0)::int AS unique_visitors
    FROM days
    LEFT JOIN aggregated ON aggregated.day = days.day
    ORDER BY days.day ASC
  `)

  const devices = rowsOf<{ device?: string; visits?: number; unique_visitors?: number }>(await sql`
    SELECT
      COALESCE(NULLIF(device, ''), 'unknown') AS device,
      COUNT(*)::int AS visits,
      COUNT(DISTINCT visitor_id_hash)::int AS unique_visitors
    FROM portfolio_visits
    GROUP BY device
    ORDER BY visits DESC
  `)

  const recent = rowsOf<{
    visitor_id_hash?: string
    ip_hash?: string
    ip?: string
    visited_at?: Date | string
    path?: string
    continent?: string
    country?: string
    region?: string
    city?: string
    timezone?: string
    device?: string
    referrer_host?: string
  }>(
    recentVisitsDate === 'all'
      ? await sql`
          SELECT visitor_id_hash, ip_hash, ip, visited_at, path, continent, country, region, city, timezone, device, referrer_host
          FROM portfolio_visits
          ORDER BY visited_at DESC
          LIMIT 80
        `
      : await sql`
          SELECT visitor_id_hash, ip_hash, ip, visited_at, path, continent, country, region, city, timezone, device, referrer_host
          FROM portfolio_visits
          WHERE (visited_at AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date = ${recentVisitsDate}::date
          ORDER BY visited_at DESC
          LIMIT 500
        `,
  )

  const pageViewTotals = rowsOf<{ total?: number; last7?: number }>(await sql`
    SELECT
      COALESCE(SUM(views), 0)::int AS total,
      COALESCE(SUM(views) FILTER (WHERE day >= (NOW() AT TIME ZONE ${ANALYTICS_TIME_ZONE})::date - INTERVAL '6 days'), 0)::int AS last7
    FROM portfolio_page_views
  `)

  const row = totals[0]

  return {
    totalVisits: Number(row?.total_visits || 0),
    totalPageViews: Number(pageViewTotals[0]?.total || 0),
    last7DaysPageViews: Number(pageViewTotals[0]?.last7 || 0),
    uniqueVisitors: Number(row?.unique_visitors || 0),
    last24HoursVisits: Number(row?.last_24_hours_visits || 0),
    last7DaysVisits: Number(row?.last_7_days_visits || 0),
    dailyVisitors: daily.map((typed) => ({
      date: typed.date || '',
      visits: Number(typed.visits || 0),
      uniqueVisitors: Number(typed.unique_visitors || 0),
    })),
    topPages: pages.map((typed) => ({
      path: typed.path || '/',
      visits: Number(typed.visits || 0),
      uniqueVisitors: Number(typed.unique_visitors || 0),
    })),
    topLocations: locations.map((typed) => {
      return {
        location: formatAnalyticsLocation(typed.city || '', typed.region || '', typed.country || '', typed.continent || ''),
        timezone: typed.timezone || '',
        visits: Number(typed.visits || 0),
        uniqueVisitors: Number(typed.unique_visitors || 0),
      }
    }),
    deviceBreakdown: devices.map((typed) => ({
      device: typed.device || 'unknown',
      visits: Number(typed.visits || 0),
      uniqueVisitors: Number(typed.unique_visitors || 0),
    })),
    recentVisits: recent.map((typed) => {
      return {
        visitorLabel: (typed.visitor_id_hash || '').slice(0, 12),
        ipLabel: (typed.ip_hash || '').slice(0, 12),
        ip: typed.ip || '',
        visitedAt: new Date(typed.visited_at || Date.now()).toISOString(),
        path: typed.path || '/',
        continent: typed.continent || '',
        country: typed.country || '',
        region: typed.region || '',
        city: typed.city || '',
        timezone: typed.timezone || '',
        device: typed.device || '',
        referrerHost: typed.referrer_host || '',
      }
    }),
  }
}
