'use client'

import PlateLabel from '@/components/PlateLabel'
import { useLanguage } from '@/components/LanguageProvider'

const timeline = [
  ['2021', 'Entered SCAD for BFA Game Development and Interactive Design; built a foundation across design, programming, UX, and production.'],
  ['2023', 'Started proving solo ownership through environment studies, small systems prototypes, and readable design documentation.'],
  ['2024', 'Moved into stronger production evidence: Shanhe as a solo vertical slice and Bubono as a long-running UE5 team project.'],
  ['NOW', 'Target role: gameplay systems designer, technical designer, or junior gameplay programmer on a team that values prototyping and readable player feedback.'],
]

export default function MonographAbout() {
  const { t } = useLanguage()

  return (
    <section className="monograph-section px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:gap-16 xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr]">
        <div className="min-w-0 xl:sticky xl:top-28 xl:h-max">
          <PlateLabel plate={t('Plate 03')} label={t('Candidate Trajectory / Hiring Fit')} />
        </div>

        <div className="grid gap-0 border-t border-rule">
          {timeline.map(([year, entry], index) => (
            <div key={`${year}-${index}`} className="reveal grid gap-4 border-b border-rule py-8 md:grid-cols-[120px_1fr] md:gap-8 md:py-10">
              <p className={`mono text-[24px] leading-none md:text-[28px] ${year === 'NOW' ? 'text-accent' : 'text-ink'}`}>{year}</p>
              <p className="copy-safe zh-timeline-copy max-w-2xl text-[clamp(22px,2.6vw,34px)] leading-[1.14]">
                {t(entry)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
