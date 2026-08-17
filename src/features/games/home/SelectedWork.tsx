'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useContentOverrides } from '@/components/providers/ContentOverridesProvider'
import PlateLabel from '@/components/ui/PlateLabel'
import { getLocalizedText, getProjectEntry } from '@/content/database'
import { applyProjectOverride, applyTranslationOverride } from '@/lib/content/overrides'

const featuredSlugs = ['bubono-bumperland', 'shanhe', 'aukadyssey']

export default function SelectedWork() {
  const { t, language } = useLanguage()
  const overrides = useContentOverrides()

  return (
    <section id="work" className="monograph-section px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-[320px_1fr] lg:gap-12">
          <PlateLabel plate={t('Plate 02')} label={t('Featured Work / Selected Projects')} active />
          <p className="display-safe zh-section-lede max-w-3xl text-[clamp(28px,4vw,56px)] leading-[1.05]">
            {t('Three core pieces: a team production, a solo vertical slice, and a player-facing systems prototype.')}
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {featuredSlugs.map((slug, position) => {
            const entry = getProjectEntry(slug)
            if (!entry) return null
            const baseProject = entry.project
            const project = applyProjectOverride(baseProject, overrides[slug])
            const translation = language === 'zh'
              ? applyTranslationOverride(entry.translation, overrides[slug]?.zh)
              : undefined
            const highlight = entry.highlight
            const title = translation?.title ?? project.title
            const blurb = translation?.blurb ?? t(project.blurb)
            const role = translation?.role ?? t(project.role)
            const team = translation?.overviewTeam ?? t(project.overview.team)

            return (
              <article key={slug} className="reveal border-t border-rule pt-6 md:pt-8">
                <Link href={'/projects/' + slug} className="group grid gap-6 md:gap-8 lg:grid-cols-[120px_1.1fr_0.9fr]" data-cursor="card">
                  <div className="mono text-[clamp(36px,12vw,96px)] leading-none text-accent">
                    {String(position + 1).padStart(2, '0')}
                  </div>
                  <div className="overflow-hidden border border-rule bg-paper-deep">
                    <Image src={project.moneyshot ?? project.cover} alt={title} width={1200} height={900} className="aspect-[4/3] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  </div>
                  <div className="flex flex-col justify-between gap-10">
                    <div>
                      <h3 className="display-safe text-[clamp(38px,12vw,96px)] italic leading-[0.98] tracking-normal md:leading-[0.95]">{title}</h3>
                      <p className="copy-safe mt-5 text-[clamp(19px,5.6vw,32px)] leading-[1.24] md:mt-8 md:leading-[1.2]">{blurb}</p>
                    </div>
                    <div className="grid gap-3 border-t border-rule pt-5">
                      <p className="mono text-[11px] uppercase text-ink-soft">{t('Role')} / {role}</p>
                      <p className="mono text-[11px] uppercase text-ink-soft">{t('Timeline')} / {project.year}</p>
                      <p className="mono text-[11px] uppercase text-ink-soft">{t('Team')} / {team}</p>
                      {highlight ? <p className="mono text-[11px] uppercase text-ink">{getLocalizedText(highlight.notes[0], language)}</p> : null}
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
