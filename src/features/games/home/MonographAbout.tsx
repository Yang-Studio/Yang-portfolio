'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import PlateLabel from '@/components/ui/PlateLabel'
import { siteContent } from '@/content/database'

export default function MonographAbout() {
  const { t, language } = useLanguage()

  return (
    <section className="monograph-section px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:gap-16 xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr]">
        <div className="min-w-0 xl:sticky xl:top-28 xl:h-max">
          <PlateLabel plate={t('Plate 03')} label={t('Personal Development Path')} />
        </div>
        <div className="grid gap-0 border-t border-rule">
          {siteContent.homeTimeline.map((entry, index) => (
            <div key={entry.year + '-' + index} className="reveal grid gap-4 border-b border-rule py-8 md:grid-cols-[120px_1fr] md:gap-8 md:py-10">
              <p className={'mono text-[24px] leading-none md:text-[28px] ' + (entry.year === 'NOW' ? 'text-accent' : 'text-ink')}>{entry.year}</p>
              <p className="copy-safe zh-timeline-copy max-w-2xl text-[clamp(22px,2.6vw,34px)] leading-[1.14]">{entry[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
