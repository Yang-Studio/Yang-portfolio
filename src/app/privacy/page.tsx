import type { Metadata } from 'next'
import PrivacyControls from '@/components/analytics/PrivacyControls'

export const metadata: Metadata = {
  title: 'Privacy -- Yang Studio',
  description: 'How Yang Studio handles visitor analytics.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
      <p className="mono text-[11px] uppercase tracking-[0.16em] text-accent">Privacy / 隐私说明</p>
      <h1 className="mt-5 text-[clamp(44px,9vw,84px)] leading-none">访问统计</h1>

      <div className="copy-safe mt-10 space-y-7 text-lg text-ink-soft">
        <p>
          本网站默认记录访问明细。你可以随时在下方选择“拒绝”，明细记录会立即停止；拒绝不会影响游戏、App、摄影或其他公开内容的使用。
        </p>
        <p>
          默认记录的内容包括：你的原始 IP 地址、由 IP 推断的国家/地区/城市/洲与时区（城市级，仅为粗略估计，可能不准确）、访问页面、访问时间、设备类别和来源网站。
          为便于汇总，系统同时保存 IP 与匿名访客 ID 的哈希值；这些数据存储在仅管理员可见的数据库中。
        </p>
        <p>
          即使你选择拒绝，本站仍会保留一个匿名总浏览量计数（按日期与页面累计），但其中不包含任何个人标识——不记录 IP、IP 哈希、访客 ID 或地理位置。该计数无法用于识别或追踪个人。
        </p>
        <p>
          IP 地理定位只能精确到城市级，本站无法借此获取你的家庭住址、精确经纬度、姓名、邮箱或登录账号。
        </p>
        <p>
          访问记录保留 180 天后自动删除。统计数据仅在管理员登录后的后台中可见，不向第三方出售或公开。
        </p>
        <p>
          By default this site records your raw IP address, an approximate IP-based location (city level), the pages you view,
          timestamps, device type, and referrer. Hashes of the IP and an anonymous visitor id are also stored for aggregation.
          You can decline below at any time, after which only an anonymous page-view count (no IP, hash, visitor id, or location)
          is kept. IP geolocation is approximate and cannot reveal a home address, precise coordinates, name, email, or account.
        </p>
      </div>
      <PrivacyControls />
    </article>
  )
}
