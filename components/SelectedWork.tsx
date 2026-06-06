'use client'

import Image from 'next/image'
import Link from 'next/link'
import PlateLabel from '@/components/PlateLabel'
import { projects } from '@/content/projects'
import { getLocalizedText, projectRecruitingHighlights } from '@/content/recruitingHighlights'
import { useLanguage } from '@/components/LanguageProvider'

const selected = [
  {
    slug: 'bubono-bumperland',
    index: '01',
    title: "Bubono's Bumperland",
    meta: ['Role / Sys & gameplay prog.', 'Year / Sep 2024 - May 2025', 'Mode / Team'],
    tagline:
      'Behavior-driven AI and modular systems for a physics-chaos arcade brawler across three themed branches.',
  },
  {
    slug: 'shanhe',
    index: '02',
    title: 'Shanhe',
    meta: ['Role / Solo design code sys', 'Year / Mar 2024 - May 2024', 'Mode / Solo demo'],
    tagline:
      "A solo-developed wuxia action demo built around the rhythm of a fight, where combat outcomes ripple through the world's quest system.",
  },
  {
    slug: 'aukadyssey',
    index: '03',
    title: 'AukAdyssey',
    meta: ['Role / UI and systems', 'Year / 2024', 'Mode / 4-person team'],
    tagline:
      'Dialogue, objective, HUD, interaction, and combat-feedback systems for a third-person facility-escape prototype.',
  },
]

export default function SelectedWork() {
  const { t, language } = useLanguage()

  return (
    <section id="work" className="monograph-section px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-[320px_1fr] lg:gap-12">
          <PlateLabel plate={t('Plate 02')} label={t('Recruiter Shortlist / Proof First')} active />
          <p className="display-safe zh-section-lede max-w-3xl text-[clamp(28px,4vw,56px)] leading-[1.05]">
            {t('The fastest read: team production, solo ownership, and player-facing systems.')}
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {selected.map((item) => {
            const project = projects.find((entry) => entry.slug === item.slug)
            if (!project) return null
            const highlight = projectRecruitingHighlights[item.slug]

            return (
              <article key={item.slug} className="reveal border-t border-rule pt-6 md:pt-8">
                <Link
                  href={`/projects/${item.slug}`}
                  className="group grid gap-6 md:gap-8 lg:grid-cols-[120px_1.1fr_0.9fr]"
                  data-cursor="card"
                >
                  <div className="mono text-[clamp(36px,12vw,96px)] leading-none text-accent">{item.index}</div>
                  <div className="overflow-hidden border border-rule bg-paper-deep">
                    <Image
                      src={project.moneyshot ?? project.cover}
                      alt={item.title}
                      width={1200}
                      height={900}
                      className="aspect-[4/3] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-10">
                    <div>
                      <h3 className="display-safe text-[clamp(38px,12vw,96px)] italic leading-[0.98] tracking-normal md:leading-[0.95]">
                        {t(item.title)}
                      </h3>
                      <p className="copy-safe mt-5 text-[clamp(19px,5.6vw,32px)] leading-[1.24] md:mt-8 md:leading-[1.2]">
                        {t(item.tagline)}
                      </p>
                    </div>
                    <div className="grid gap-3 border-t border-rule pt-5">
                      {item.meta.map((row) => (
                        <p key={row} className="mono text-[11px] uppercase text-ink-soft">
                          {t(row)}
                        </p>
                      ))}
                      {highlight && (
                        <p className="mono text-[11px] uppercase text-ink">
                          {getLocalizedText(highlight.bullets[0], language)}
                        </p>
                      )}
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
