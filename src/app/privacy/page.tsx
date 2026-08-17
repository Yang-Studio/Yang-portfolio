import type { Metadata } from 'next'
import PrivacyControls from '@/components/analytics/PrivacyControls'
import { siteContent } from '@/content/database'

export const metadata: Metadata = siteContent.seo.privacy

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
      <p className="mono text-[11px] uppercase tracking-[0.16em] text-accent">{siteContent.privacy.eyebrow}</p>
      <h1 className="mt-5 text-[clamp(44px,9vw,84px)] leading-none">{siteContent.privacy.title}</h1>

      <div className="copy-safe mt-10 space-y-7 text-lg text-ink-soft">
        {siteContent.privacy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <PrivacyControls />
    </article>
  )
}
