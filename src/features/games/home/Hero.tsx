'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { gsap } from '@/lib/motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useContentOverrides } from '@/components/providers/ContentOverridesProvider'
import PlateLabel from '@/components/ui/PlateLabel'
import { getProjectEntry, siteContent } from '@/content/database'
import { applyProjectOverride, applyTranslationOverride } from '@/lib/content/overrides'
const featuredSlug = 'bubono-bumperland'

export default function Hero() {
  const { t, language } = useLanguage()
  const overrides = useContentOverrides()
  const entry = getProjectEntry(featuredSlug)!
  const baseProject = entry.project
  const project = applyProjectOverride(baseProject, overrides[featuredSlug])
  const translation = language === 'zh'
    ? applyTranslationOverride(entry.translation, overrides[featuredSlug]?.zh)
    : undefined
  const title = translation?.title ?? project.title
  const role = translation?.role ?? t(project.role)
  const positioning = siteContent.hero.positioning[language]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-label', { opacity: 0, y: 18, duration: 0.8, delay: 0.2 })
        .from('.hero-scatter-word', { opacity: 0, yPercent: 110, stagger: 0.08, duration: 1.1 }, '-=0.45')
        .from('.hero-copy', { opacity: 0, y: 24, stagger: 0.12, duration: 0.9 }, '-=0.7')
        .from('.hero-image', { opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.1 }, '-=0.6')
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero relative isolate overflow-hidden border-b border-rule px-5 py-10 sm:px-8 md:min-h-[calc(100dvh-64px)] md:px-16 md:py-12 lg:px-24">
      <div className="hero-watermark pointer-events-none absolute bottom-[-0.16em] right-[-0.06em] z-0 text-[52vw] leading-none text-ink opacity-[0.035]">{siteContent.hero.watermark}</div>
      <div className="mono absolute left-8 top-24 z-10 hidden text-[11px] uppercase text-ink-soft md:block lg:left-24">{siteContent.hero.coordinates[0]}<br />{siteContent.hero.coordinates[1]}</div>
      <div className="mono absolute bottom-12 right-8 z-10 hidden text-right text-[11px] uppercase text-ink-soft md:block lg:right-24">{t('Personal archive')}</div>

      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
        <div className="flex flex-col justify-center md:min-h-[60dvh]">
          <div className="hero-label mb-10 md:mb-12"><PlateLabel plate={t('Plate 01')} label={t('Featured Work / Game Systems')} active /></div>
          <h1 className="overflow-hidden text-[clamp(58px,18vw,150px)] leading-[0.9] tracking-normal md:leading-[0.88]">
            {siteContent.hero.name.map((word) => <span key={word} className="hero-scatter-word mr-[0.12em] inline-block">{word}</span>)}
          </h1>
          <div className="mt-6 max-w-md md:mt-8">
            <div className="hero-copy zh-support-copy flex flex-col justify-end gap-5 text-ink-soft">
              <p className="copy-safe">{positioning}</p>
              <div className="mono flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 text-[11px] uppercase text-ink">
                <Link className="underline decoration-accent underline-offset-4" href="/projects">{t('Explore featured work')}</Link>
                <Link className="underline decoration-accent underline-offset-4" href="/about">{t('Personal path')}</Link>
              </div>
            </div>
          </div>
        </div>

        <Link href={'/projects/' + featuredSlug} className="hero-image group block border border-rule bg-paper-deep" data-cursor="card">
          <div className="mono flex items-center justify-between border-b border-rule px-4 py-3 text-[11px] uppercase text-ink-soft">
            <span>{t('Now showing')}</span><span>{project.year}</span>
          </div>
          <Image src={project.cover} alt={title} width={900} height={1200} priority className="aspect-[4/3] max-h-[360px] w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 sm:aspect-square md:max-h-[520px]" />
          <div className="border-t border-rule px-4 py-4">
            <p className="italic">{title}</p>
            <p className="mono mt-1 text-[11px] uppercase text-ink-soft">{role} / {project.tools}</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
