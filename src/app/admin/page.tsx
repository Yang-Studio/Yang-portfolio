import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminLogoutButton from '@/features/admin/AdminLogoutButton'
import { getCurrentAdminSession } from '@/lib/server/adminAuth'
import {
  analyticsDateKey,
  AnalyticsConfigError,
  formatAnalyticsLocation,
  getAnalyticsSummary,
  type AnalyticsSummary,
} from '@/lib/server/analyticsStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; all?: string }>
}) {
  const session = await getCurrentAdminSession()
  if (!session) redirect('/')

  const sp = await searchParams
  const dateParam = typeof sp.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : undefined
  const selectedDate: string | 'all' = sp.all === '1' ? 'all' : (dateParam ?? analyticsDateKey())

  let summary: AnalyticsSummary | undefined
  let configurationError = ''

  try {
    summary = await getAnalyticsSummary({ recentVisitsDate: selectedDate })
  } catch (error) {
    configurationError =
      error instanceof AnalyticsConfigError
        ? '尚未连接统计数据库。请确认 Vercel 已提供 DATABASE_URL，并已配置 ADMIN_PASSWORD。'
        : '统计数据暂时无法读取。'
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-8 text-paper sm:px-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-paper/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-accent">Yang Studio / Admin</p>
            <h1 className="mt-3 text-[clamp(42px,8vw,92px)] leading-none">访客统计</h1>
            <p className="mt-4 max-w-2xl text-paper/60">
              浏览量统计所有访问（含拒绝匿名统计的访客），不含任何个人标识。明细（原始 IP、IP 哈希、来源地区）默认记录，仅在访客主动拒绝后停止；地区为托管平台根据 IP 的粗略推断。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/content" className="mono border border-paper/30 px-4 py-2 text-xs text-paper/80 transition hover:border-accent hover:text-accent">
              编辑项目文本
            </Link>
            <AdminLogoutButton />
          </div>
        </header>

        {configurationError ? (
          <section className="mt-10 border border-accent/50 bg-accent/10 p-6">
            <p className="mono text-xs uppercase text-accent">Backend setup required</p>
            <p className="mt-3 text-xl">{configurationError}</p>
          </section>
        ) : null}

        {summary ? (
          <>
            <section className="grid gap-px bg-paper/15 sm:grid-cols-2">
              <StatCard label="总浏览量（含拒绝匿名统计的访问）" value={summary.totalPageViews} />
              <StatCard label="浏览量 · 过去 7 天" value={summary.last7DaysPageViews} />
            </section>

            <section className="mt-px grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="已同意访问" value={summary.totalVisits} />
              <StatCard label="独立访客" value={summary.uniqueVisitors} />
              <StatCard label="过去 24 小时" value={summary.last24HoursVisits} />
              <StatCard label="过去 7 天" value={summary.last7DaysVisits} />
            </section>

            <DailyVisitorsChart points={summary.dailyVisitors} />

            <section className="grid gap-px border-t border-paper/20 bg-paper/15 lg:grid-cols-3">
              <SummaryPanel
                eyebrow="Popular pages"
                title="热门页面"
                empty="暂无页面数据。"
                items={summary.topPages.map((page) => ({
                  label: page.path,
                  detail: `${page.uniqueVisitors} 人`,
                  value: `${page.visits} 次`,
                }))}
              />
              <SummaryPanel
                eyebrow="Device split"
                title="设备分布"
                empty="暂无设备数据。"
                items={summary.deviceBreakdown.map((device) => ({
                  label: deviceLabel(device.device),
                  detail: `${device.uniqueVisitors} 人`,
                  value: `${device.visits} 次`,
                }))}
              />
              <SummaryPanel
                eyebrow="Location summary"
                title="地区分布"
                empty="暂无地区数据。"
                items={summary.topLocations.map((location) => ({
                  label: location.location,
                  detail: [location.timezone, `${location.uniqueVisitors} 人`].filter(Boolean).join(' · '),
                  value: `${location.visits} 次`,
                }))}
              />
            </section>

            <section className="border-t border-paper/20 py-10">
              <div className="min-w-0">
                <p className="mono text-xs uppercase tracking-[0.16em] text-accent">Recent visits</p>
                <h2 className="mt-3 text-4xl">最近访问</h2>
                <p className="mt-2 text-sm text-paper/55">
                  {selectedDate === 'all'
                    ? '当前显示全部访问记录（最多 80 条）。'
                    : `当前仅显示 ${selectedDate} 当日访问。如需查看其他日期，请在下方选择后查询。`}
                </p>
                <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                    选择日期
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedDate === 'all' ? '' : selectedDate}
                      className="mt-2 block border border-paper/25 bg-transparent px-3 py-2 text-sm text-paper [color-scheme:dark]"
                    />
                  </label>
                  <button type="submit" className="focus-ring border border-paper/30 px-4 py-2 text-xs text-paper">
                    查询
                  </button>
                  <a href="/admin" className="focus-ring border border-paper/20 px-4 py-2 text-xs text-paper/65">
                    今天
                  </a>
                  <a href="/admin?all=1" className="focus-ring border border-paper/20 px-4 py-2 text-xs text-paper/65">
                    全部
                  </a>
                </form>
                <div className="mt-7 overflow-x-auto border-t border-paper/20">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="mono text-[10px] uppercase text-paper/45">
                      <tr>
                        <th className="border-b border-paper/15 py-3 pr-5 font-normal">时间</th>
                        <th className="border-b border-paper/15 py-3 pr-5 font-normal">访客标识 / IP</th>
                        <th className="border-b border-paper/15 py-3 pr-5 font-normal">页面</th>
                        <th className="border-b border-paper/15 py-3 pr-5 font-normal">地区</th>
                        <th className="border-b border-paper/15 py-3 pr-5 font-normal">设备</th>
                        <th className="border-b border-paper/15 py-3 font-normal">来源</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentVisits.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-paper/50">
                            该日暂无访问记录。
                          </td>
                        </tr>
                      ) : (
                        summary.recentVisits.map((visit, index) => (
                        <tr
                          key={`${visit.visitedAt}-${visit.visitorLabel}-${index}`}
                          className="border-b border-paper/10"
                        >
                          <td className="whitespace-nowrap py-4 pr-5 text-paper/55">
                            {new Intl.DateTimeFormat('zh-CN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                              timeZone: 'America/New_York',
                            }).format(new Date(visit.visitedAt))}
                          </td>
                          <td className="mono whitespace-nowrap py-4 pr-5 text-paper/55">
                            <span>{visit.visitorLabel || 'unknown'}</span>
                            <br />
                            <span>{visit.ip || visit.ipLabel || 'unknown'}</span>
                          </td>
                          <td className="max-w-[260px] truncate py-4 pr-5">{visit.path}</td>
                          <td className="py-4 pr-5 text-paper/65">
                            <span>{formatAnalyticsLocation(visit.city, visit.region, visit.country, visit.continent)}</span>
                            {visit.timezone ? (
                              <span className="mono mt-1 block text-[10px] text-paper/40">{visit.timezone}</span>
                            ) : null}
                          </td>
                          <td className="mono py-4 pr-5 text-paper/55">{visit.device || 'unknown'}</td>
                          <td className="max-w-[180px] truncate py-4 text-paper/55">
                            {visit.referrerHost || 'direct'}
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}

function DailyVisitorsChart({ points }: { points: AnalyticsSummary['dailyVisitors'] }) {
  const width = 960
  const height = 300
  const left = 52
  const right = 936
  const top = 32
  const bottom = 240
  const plotHeight = bottom - top
  const slot = (right - left) / Math.max(points.length, 1)
  const barWidth = Math.max(4, slot * 0.52)
  const maxValue = Math.max(1, ...points.flatMap((point) => [point.uniqueVisitors, point.visits]))
  const y = (value: number) => bottom - (value / maxValue) * plotHeight
  const visitLine = points
    .map((point, index) => `${left + slot * index + slot / 2},${y(point.visits)}`)
    .join(' ')
  const labelIndexes = new Set([0, 6, 13, 20, 27, points.length - 1].filter((index) => index >= 0))

  return (
    <section className="border-t border-paper/20 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[0.16em] text-accent">30 day trend</p>
          <h2 className="mt-3 text-4xl">每日访客变化</h2>
        </div>
        <div className="mono flex gap-5 text-[10px] uppercase text-paper/50">
          <span className="flex items-center gap-2">
            <i className="h-3 w-3 bg-accent" aria-hidden="true" />
            独立访客
          </span>
          <span className="flex items-center gap-2">
            <i className="h-px w-5 bg-paper" aria-hidden="true" />
            页面访问
          </span>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto border-y border-paper/20 py-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[720px]"
          role="img"
          aria-labelledby="daily-visitors-chart-title daily-visitors-chart-description"
        >
          <title id="daily-visitors-chart-title">最近 30 天每日访客趋势</title>
          <desc id="daily-visitors-chart-description">橙色柱表示每日独立访客，浅色折线表示每日页面访问次数。</desc>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const gridY = bottom - ratio * plotHeight
            return (
              <g key={ratio}>
                <line x1={left} x2={right} y1={gridY} y2={gridY} stroke="currentColor" opacity="0.12" />
                <text x={left - 10} y={gridY + 4} textAnchor="end" fill="currentColor" opacity="0.45" fontSize="10">
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            )
          })}

          {points.map((point, index) => {
            const x = left + slot * index + (slot - barWidth) / 2
            const barY = y(point.uniqueVisitors)
            return (
              <g key={point.date}>
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={Math.max(0, bottom - barY)}
                  className="fill-accent"
                >
                  <title>{`${point.date}: ${point.uniqueVisitors} 位独立访客，${point.visits} 次页面访问`}</title>
                </rect>
                {labelIndexes.has(index) ? (
                  <text
                    x={left + slot * index + slot / 2}
                    y={bottom + 27}
                    textAnchor="middle"
                    fill="currentColor"
                    opacity="0.5"
                    fontSize="10"
                  >
                    {point.date.slice(5)}
                  </text>
                ) : null}
              </g>
            )
          })}

          {points.length ? (
            <polyline
              points={visitLine}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
        </svg>
      </div>
    </section>
  )
}

function SummaryPanel({
  eyebrow,
  title,
  empty,
  items,
}: {
  eyebrow: string
  title: string
  empty: string
  items: { label: string; detail: string; value: string }[]
}) {
  return (
    <section className="bg-ink px-5 py-8 md:px-8">
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl">{title}</h2>
      <div className="mt-6 border-t border-paper/20">
        {items.length ? (
          items.map((item) => (
            <div
              key={`${item.label}-${item.detail}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-paper/15 py-4 text-sm"
            >
              <span className="truncate">{item.label}</span>
              <span className="mono text-accent">{item.value}</span>
              <span className="mono mt-1 text-[10px] text-paper/45">{item.detail}</span>
            </div>
          ))
        ) : (
          <p className="py-5 text-paper/50">{empty}</p>
        )}
      </div>
    </section>
  )
}

function deviceLabel(device: string) {
  const labels: Record<string, string> = {
    desktop: '桌面端',
    mobile: '移动端',
    tablet: '平板设备',
    bot: '自动程序',
    unknown: '未知设备',
  }
  return labels[device] || device
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-ink px-5 py-9 md:px-8 md:py-12">
      <p className="mono text-[11px] uppercase tracking-[0.16em] text-paper/45">{label}</p>
      <p className="mt-4 text-[clamp(48px,8vw,88px)] leading-none text-paper">{value.toLocaleString()}</p>
    </div>
  )
}
