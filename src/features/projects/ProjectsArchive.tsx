'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import PlateLabel from '@/components/ui/PlateLabel'
import { projects } from '@/content/games/projects'
import { getLocalizedText, projectRecruitingHighlights } from '@/content/games/recruitingHighlights'
import { projectTranslations } from '@/content/projects/translations'
import type { Project } from '@/content/projects/types'
import { gsap } from '@/lib/motion'

type Props = {
  items?: Project[]
  basePath?: string
  plate?: string
  label?: string
  titleTop?: string
  titleBottom?: string
}

export default function ProjectsArchive({
  items = projects,
  basePath = '/projects',
  plate = 'Plate 02 / Index',
  label = 'Projects / Complete Archive',
  titleTop = 'Evidence',
  titleBottom = 'Index',
}: Props) {
  const { t, language } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.fromTo(
        '.projects-hero-copy > *',
        { opacity: 0, y: 42, rotateX: -18 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out' },
      )

      gsap.fromTo(
        '.projects-hero-title span',
        { yPercent: 120, rotate: 5 },
        { yPercent: 0, rotate: 0, stagger: 0.07, duration: 1.2, ease: 'expo.out', delay: 0.1 },
      )

      const rows = gsap.utils.toArray<HTMLElement>('.project-index-row')
      const activateRow = (activeRow: HTMLElement) => {
        rows.forEach((candidate) => candidate.classList.toggle('is-active', candidate === activeRow))
      }

      rows.forEach((row, index) => {
        const image = row.querySelector('.project-index-image-inner')
        const number = row.querySelector('.project-index-number')
        const content = row.querySelectorAll('.project-index-copy > *')
        const signal = row.querySelector('.project-index-signal')

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 76%',
            end: 'bottom 34%',
            toggleActions: 'play none none reverse',
            onEnter: () => activateRow(row),
            onEnterBack: () => activateRow(row),
            onLeave: () => row.classList.remove('is-active'),
            onLeaveBack: () => row.classList.remove('is-active'),
          },
        })

        reveal
          .fromTo(row, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' })
          .fromTo(row, { '--rule-progress': 0 }, { '--rule-progress': 1, duration: 0.7 }, '<')
          .fromTo(number, { x: -96, scale: 0.72, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: 1, ease: 'expo.out' }, '<')
          .fromTo(
            image,
            { clipPath: 'inset(0 100% 0 0)', scale: 1.18 },
            { clipPath: 'inset(0 0% 0 0)', scale: 1.02, duration: 1.15, ease: 'expo.out' },
            '<0.1',
          )
          .fromTo(content, { x: 54, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.85, ease: 'expo.out' }, '<0.12')

        if (!reducedMotion) {
          gsap.fromTo(
            signal,
            { xPercent: -115, opacity: 0 },
            {
              xPercent: 115,
              opacity: 0.16,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )

          gsap.to(number, {
            scale: 1.35,
            y: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        gsap.fromTo(
          image,
          { yPercent: index % 2 === 0 ? -12 : 12, scale: 1.12 },
          {
            yPercent: index % 2 === 0 ? 12 : -12,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-paper text-ink">
      <section className="border-b border-rule px-5 py-14 sm:px-8 md:px-16 md:py-20 lg:px-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:gap-16 lg:grid-cols-[320px_1fr]">
          <PlateLabel plate={t(plate)} label={t(label)} active />
          <div className="projects-hero-copy">
            <p className="mono mb-6 text-[11px] uppercase text-ink-soft">
              {language === 'zh' ? `收录 ${items.length} 个项目` : `${items.length} projects on record`}
            </p>
            <h1 className="projects-hero-title display-safe max-w-5xl overflow-hidden text-[clamp(44px,12vw,104px)] leading-[1.0] tracking-tight md:leading-[0.95]">
              <span className="inline-block">{t(titleTop)}</span>
              <br />
              <span className="inline-block">{t(titleBottom)}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:px-16 md:py-16 lg:px-24">
        <div className="mx-auto max-w-[1280px] border-t border-rule">
          {items.map((project, index) => {
            const translation = language === 'zh' ? projectTranslations[project.slug] : undefined
            const image = project.banner ?? project.cover ?? project.moneyshot
            const highlight = projectRecruitingHighlights[project.slug]

            return (
              <article key={project.slug} className="project-index-row relative isolate overflow-hidden border-b border-rule py-9 md:py-12">
                <div className="project-index-signal" aria-hidden="true" />
                <Link
                  href={`${basePath}/${project.slug}`}
                  className="group grid gap-6 md:gap-8 lg:grid-cols-[92px_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start"
                  data-cursor="card"
                >
                  <div className="mono flex items-start justify-between text-accent lg:block">
                    <span className="project-index-number inline-block text-[clamp(32px,12vw,72px)] leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="red-dot mt-3 inline-block lg:mt-6" aria-hidden="true" />
                  </div>

                  <div className="overflow-hidden border border-rule bg-paper-deep">
                    <div className="project-index-image-inner">
                      <Image
                        src={image}
                        alt={translation?.title ?? project.title}
                        width={1200}
                        height={900}
                        priority={index === 0}
                        className="aspect-[4/3] w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                      />
                    </div>
                  </div>

                  <div className="project-index-copy grid min-h-full gap-8">
                    <div>
                      <p className="mono mb-5 text-[11px] uppercase text-ink-soft">
                        {t(project.tag)} / {project.year}
                      </p>
                      <h2 className="display-safe text-[clamp(34px,12vw,78px)] italic leading-[1] tracking-normal md:leading-[0.96]">
                        {translation?.title ?? t(project.title)}
                      </h2>
                      <p className="copy-safe mt-5 max-w-2xl text-[clamp(18px,5.2vw,26px)] leading-[1.28] text-ink-soft md:mt-6 md:leading-[1.22]">
                        {translation?.blurb ?? t(project.blurb)}
                      </p>
                      {highlight && (
                        <div className="mt-6 grid gap-4 border-t border-rule pt-5 md:grid-cols-[0.85fr_1.15fr]">
                          <div>
                            <p className="mono text-[11px] uppercase text-accent">{t('Hiring fit')}</p>
                            <p className="mt-2 text-lg leading-snug text-ink">{getLocalizedText(highlight.fit, language)}</p>
                          </div>
                          <div>
                            <p className="mono text-[11px] uppercase text-ink-soft">{t('Proof')}</p>
                            <p className="mt-2 leading-snug text-ink-soft">{getLocalizedText(highlight.proof, language)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 border-t border-rule pt-5 md:grid-cols-3">
                      <Meta label={t('Role')} value={translation?.role ?? t(project.role)} />
                      <Meta label={t('Tools')} value={t(project.tools)} />
                      <Meta label={t('Mode')} value={translation?.overviewTeam ?? t(project.overview.team)} />
                    </div>
                    {highlight && (
                      <div className="grid gap-3 border-t border-rule pt-5 md:grid-cols-3">
                        {highlight.bullets.map((bullet, bulletIndex) => (
                          <Meta
                            key={bullet.en}
                            label={`${t('Signal')} ${String(bulletIndex + 1).padStart(2, '0')}`}
                            value={getLocalizedText(bullet, language)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono text-[11px] uppercase text-ink-soft">{label}</p>
      <p className="mt-1 text-lg leading-snug">{value}</p>
    </div>
  )
}
