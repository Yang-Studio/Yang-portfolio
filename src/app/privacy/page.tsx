import type { Metadata } from 'next'
import PrivacyControls from '@/components/analytics/PrivacyControls'

export const metadata: Metadata = {
  title: 'Privacy -- Yang Studio',
  description: 'How Yang Studio handles optional anonymous visitor analytics.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
      <p className="mono text-[11px] uppercase tracking-[0.16em] text-accent">Privacy / 隐私说明</p>
      <h1 className="mt-5 text-[clamp(44px,9vw,84px)] leading-none">匿名访问统计</h1>

      <div className="copy-safe mt-10 space-y-7 text-lg text-ink-soft">
        <p>
          本网站只在访客明确点击“同意统计”后记录访问。拒绝不会影响游戏、App、摄影或其他公开内容的使用。
        </p>
        <p>
          记录内容包括访问页面、访问时间、设备类别、来源网站，以及由托管平台根据 IP 推断的国家、地区、城市、洲和时区。
          原始 IP 不会写入数据库；服务器会立即使用带私密盐值的 HMAC 对 IP 和匿名访客 ID 进行哈希。
        </p>
        <p>
          本系统不会尝试获取家庭住址、邮编、GPS 经纬度、姓名、邮箱或登录账号。IP 地理位置仅为粗略估计，可能不准确。
        </p>
        <p>
          访问记录保留 180 天后自动删除。统计数据仅在管理员登录后的后台中可见，不向第三方出售或公开。
        </p>
        <p>
          Anonymous analytics are collected only after consent. Raw IP addresses, precise coordinates, names, email addresses,
          and visitor accounts are not stored.
        </p>
      </div>
      <PrivacyControls />
    </article>
  )
}
