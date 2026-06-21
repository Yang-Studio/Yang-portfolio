'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import Lightbox, { type LightboxImage } from '@/components/ui/Lightbox'
import PlateLabel from '@/components/ui/PlateLabel'
import { projects } from '@/content/games/projects'
import { getLocalizedText, projectHighlights } from '@/content/games/projectHighlights'
import { projectAssets } from '@/content/projects/assets'
import { projectTranslations } from '@/content/projects/translations'
import { useContentOverrides } from '@/components/providers/ContentOverridesProvider'
import { applyProjectOverride, applyTranslationOverride } from '@/lib/content/overrides'
import type { Project } from '@/content/projects/types'
import { gsap } from '@/lib/motion'

export default function ProjectDetail({
  project: baseProject,
  siblings = projects,
  backHref = '/projects',
}: {
  project: Project
  siblings?: Project[]
  backHref?: string
}) {
  const { t, language } = useLanguage()
  const overrides = useContentOverrides()
  const project = applyProjectOverride(baseProject, overrides[baseProject.slug])
  const translation =
    language === 'zh' ? applyTranslationOverride(projectTranslations[project.slug], overrides[project.slug]?.zh) : undefined
  const gallery = projectAssets[project.slug] ?? []
  const reelSrc = project.reel ?? (project.results.media?.endsWith('.mp4') ? project.results.media : undefined)
  const reelIsDrivePreview = !!reelSrc && reelSrc.includes('drive.google.com/file/d/') && reelSrc.includes('/preview')
  const reelIsVideo = Boolean(reelSrc && !reelIsDrivePreview && (reelSrc.endsWith('.mp4') || project.reel))
  const downloadHref =
    project.download ??
    `mailto:yangliu.gmdev@gmail.com?subject=${encodeURIComponent(`${project.title} Demo Request`)}`
  const isDownloadFile = downloadHref.startsWith('/') || downloadHref.startsWith('./')
  const navSiblings = siblings.filter((item) => !item.hidden || item.slug === project.slug)
  const projectIndex = navSiblings.findIndex((item) => item.slug === project.slug)
  const nextProject =
    projectIndex >= 0 && navSiblings.length > 1 ? navSiblings[(projectIndex + 1) % navSiblings.length] : undefined
  const heroImage = project.banner ?? project.cover ?? project.moneyshot
  const isAppProject = backHref === '/apps'
  const projectHighlight = projectHighlights[project.slug]
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | undefined>()
  const openLightbox = (image: LightboxImage) => setLightboxImage(image)
  const closeLightbox = () => setLightboxImage(undefined)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.case-label', { opacity: 0, y: 22, duration: 0.75 })
        .from('.case-title span', { opacity: 0, yPercent: 130, rotate: 4, stagger: 0.065, duration: 1.1 }, '-=0.25')
        .from('.case-intro', { opacity: 0.18, y: 28, stagger: 0.08, duration: 0.65 }, '-=0.82')
        .from('.case-hero-media', { clipPath: 'inset(100% 0 0 0)', opacity: 0.45, scale: 1.08, duration: 1.2 }, '-=0.5')
        .from('.case-meta-item', { opacity: 0, y: 18, stagger: 0.06, duration: 0.6 }, '-=0.45')

      gsap.utils.toArray<HTMLElement>('.case-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 72, clipPath: 'inset(18% 0 0 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      if (!reducedMotion) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.case-hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
          .to('.case-title', { x: -90, opacity: 0.2, ease: 'none' }, 0)
          .to('.case-intro', { y: -60, opacity: 0, ease: 'none' }, 0)
          .to('.case-hero-media', { scale: 1.22, y: -80, ease: 'none' }, 0)
          .to('.case-watermark', { scale: 1.35, opacity: 0.09, rotate: -4, ease: 'none' }, 0)
      }

      gsap.utils.toArray<HTMLElement>('.case-parallax').forEach((media, index) => {
        gsap.fromTo(
          media,
          { yPercent: index % 2 === 0 ? -10 : 10, scale: 1.08 },
          {
            yPercent: index % 2 === 0 ? 10 : -10,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: media,
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
    <div className="bg-ink text-paper">
      <section className="case-hero-section relative isolate overflow-hidden border-b border-paper/20 px-5 py-10 sm:px-8 md:px-16 md:py-16 lg:px-24">
        <div className="case-watermark pointer-events-none absolute bottom-[-0.2em] right-[-0.06em] text-[48vw] leading-none text-paper opacity-[0.035]">
          {project.title.slice(0, 1)}
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 md:gap-12 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end 2xl:grid-cols-[minmax(0,1fr)_480px]">
          <div>
            <div className="case-label mb-10 md:mb-14">
              <PlateLabel plate={t('Project Plate')} label={`${t(project.tag)} / ${project.year}`} active tone="paper" />
            </div>
            <h1 className="case-title display-safe overflow-hidden text-[clamp(44px,16vw,124px)] italic leading-[0.98] tracking-normal md:leading-[0.92]">
              {(translation?.title ?? project.title).split(' ').map((word) => (
                <span key={word} className="mr-[0.12em] inline-block">
                  {word}
                </span>
              ))}
            </h1>
            <p className="case-intro copy-safe mt-7 max-w-3xl text-[clamp(20px,5.8vw,36px)] leading-[1.22] text-paper/78 md:mt-10 md:leading-[1.14]">
              {translation?.blurb ?? t(project.blurb)}
            </p>
          </div>

          <button
            type="button"
            className="case-hero-media block cursor-zoom-in border border-paper/20 bg-paper/5 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
            onClick={() => openLightbox({ src: heroImage, alt: translation?.title ?? project.title, title: translation?.title ?? project.title })}
          >
            <Image
              src={heroImage}
              alt={translation?.title ?? project.title}
              width={1100}
              height={900}
              priority
              className="aspect-[4/3] max-h-[420px] w-full object-cover grayscale md:aspect-[4/5] md:max-h-[620px]"
            />
          </button>
        </div>
      </section>

      <section className="border-b border-paper/20 px-5 py-8 sm:px-8 md:px-16 lg:px-24">
        <div className="mx-auto grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Meta label={t('Role')} value={translation?.role ?? t(project.role)} />
          <Meta label={t('Engine')} value={t(project.tools)} />
          <Meta label={t('Team')} value={translation?.overviewTeam ?? t(project.overview.team)} />
          <Meta label={t('Timeline')} value={translation?.overviewTimeline ?? t(project.overview.timeline)} />
          <Meta
            label={t('Status')}
            value={project.status ? t(project.status) : project.year.includes('2025') ? t('Playable demo') : t('Archive')}
          />
        </div>
      </section>

      {projectHighlight && (
        <section className="case-reveal border-b border-paper/20 px-5 py-14 sm:px-8 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr]">
            <PlateLabel plate={t('Project notes')} label={t('Creative Focus / Evidence')} tone="paper" />
            <div className="grid gap-8">
              <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                <div className="border-t border-paper/20 pt-5">
                  <p className="mono text-[11px] uppercase text-accent">{t('Creative focus')}</p>
                  <p className="copy-safe mt-4 text-[clamp(22px,5.4vw,40px)] leading-[1.12] text-paper">
                    {getLocalizedText(projectHighlight.focus, language)}
                  </p>
                </div>
                <div className="border-t border-paper/20 pt-5">
                  <p className="mono text-[11px] uppercase text-paper/50">{t('Project evidence')}</p>
                  <p className="copy-safe mt-4 text-[clamp(18px,4.6vw,28px)] leading-[1.28] text-paper/72">
                    {getLocalizedText(projectHighlight.evidence, language)}
                  </p>
                </div>
              </div>
              <div className="grid gap-0 border-t border-paper/20 md:grid-cols-3">
                {projectHighlight.notes.map((note, index) => (
                  <div key={note.en} className="border-b border-paper/20 py-5 md:border-r md:px-5">
                    <p className="mono text-[11px] uppercase text-accent">{t('Note')} {String(index + 1).padStart(2, '0')}</p>
                    <p className="mt-4 text-paper/72">{getLocalizedText(note, language)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="case-reveal border-b border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto max-w-[980px]">
          <p className="display-safe text-[clamp(24px,7vw,50px)] leading-[1.18] md:leading-[1.1]">
            {translation?.overviewGoal ?? t(project.overview.goal)}
          </p>
        </div>
      </section>

      {project.process.length > 0 && (
        <section className="px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr]">
            <PlateLabel plate={t('Plate 01')} label={t('Process / Decisions')} tone="paper" />
            <div className="grid gap-0 border-t border-paper/20 md:grid-cols-3">
              {project.process.map((step, index) => {
                const translatedStep = translation?.process?.[index]
                return (
                  <article key={step.title} className="case-reveal border-b border-paper/20 py-8 md:border-r md:px-6">
                      <p className="mono mb-8 text-[11px] uppercase text-accent">{String(index + 1).padStart(2, '0')}</p>
                    <h2 className="display-safe text-[clamp(28px,3vw,40px)] leading-[1.04]">{translatedStep?.title ?? t(step.title)}</h2>
                    <p className="copy-safe mt-6 text-paper/68">{translatedStep?.body ?? t(step.body)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {project.demo && (
        <section className="case-reveal border-t border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr] lg:items-end">
            <PlateLabel
              plate={t(isAppProject ? 'Product Build' : 'Live App')}
              label={t(isAppProject ? 'Standalone Application' : 'Interactive Demo')}
              tone="paper"
            />
            <div className="border-t border-paper/20 pt-8">
              <p className="display-safe max-w-4xl text-[clamp(30px,8vw,64px)] italic leading-[1.04]">
                {t('Open the complete app in a new window.')}
              </p>
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mono mt-8 inline-flex w-full items-center justify-between border border-accent px-6 py-5 text-[12px] uppercase text-accent transition hover:bg-accent hover:text-paper sm:w-auto sm:min-w-[280px]"
              >
                <span>{t('Open App')}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {project.technical.length > 0 && (
        <section className="border-t border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr]">
            <PlateLabel plate={t('Plate 02')} label={t('Technical Breakdown')} tone="paper" />
            <div className="grid gap-12">
              {project.technical.map((item, index) => {
                const translatedItem = translation?.technical?.[index]
                return (
                  <article key={item.title} className="case-reveal grid gap-8 border-t border-paper/20 pt-8 lg:grid-cols-[1fr_0.85fr]">
                    <div className="overflow-hidden border border-paper/20 bg-paper/5">
                      <button
                        type="button"
                        className="case-parallax block w-full cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
                        onClick={() =>
                          openLightbox({
                            src: item.media,
                            alt: translatedItem?.title ?? item.title,
                            title: translatedItem?.title ?? item.title,
                            caption: translatedItem?.description ?? t(item.description),
                          })
                        }
                      >
                        <Image
                          src={item.media}
                          alt={translatedItem?.title ?? item.title}
                          width={1200}
                          height={800}
                          className="aspect-[4/3] w-full object-cover grayscale"
                        />
                      </button>
                    </div>
                    <div>
                      <p className="mono mb-8 text-[11px] uppercase text-accent">{t('System')} {String(index + 1).padStart(2, '0')}</p>
                      <h2 className="display-safe text-[clamp(30px,9vw,64px)] italic leading-[1] md:leading-[0.98]">
                        {translatedItem?.title ?? t(item.title)}
                      </h2>
                      <p className="copy-safe mt-6 text-[clamp(18px,5.2vw,26px)] leading-[1.34] text-paper/70 md:mt-8 md:leading-[1.28]">
                        {translatedItem?.description ?? t(item.description)}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {reelSrc && (
        <section className="case-reveal border-t border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto max-w-[1280px]">
            <PlateLabel plate={t('Plate 03')} label={t('Demo Reel')} tone="paper" />
            <div className="mt-12 overflow-hidden border border-paper/20 bg-paper/5">
              {reelIsDrivePreview ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={reelSrc}
                    title={`${project.title} demo reel`}
                    className="h-full w-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : reelIsVideo ? (
                <video className="h-full w-full" controls>
                  <source src={reelSrc} type="video/mp4" />
                </video>
              ) : (
                <button
                  type="button"
                  className="block w-full cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
                  onClick={() => openLightbox({ src: reelSrc, alt: `${project.title} demo reel`, title: t('Demo Reel') })}
                >
                  <Image src={reelSrc} alt={`${project.title} demo reel`} width={1600} height={900} className="w-full object-cover" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="border-t border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr]">
            <PlateLabel plate={t('Plate 04')} label={t('Gallery / Artifacts')} tone="paper" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className="case-reveal block overflow-hidden border border-paper/20 bg-paper/5 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
                  onClick={() =>
                    openLightbox({
                      src,
                      alt: `${project.title} gallery ${index + 1}`,
                      title: `${translation?.title ?? project.title} ${t('Gallery / Artifacts')} ${index + 1}`,
                    })
                  }
                >
                  <Image
                    src={src}
                    alt={`${project.title} gallery ${index + 1}`}
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full cursor-zoom-in object-cover grayscale transition duration-700 hover:grayscale-0"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {(project.results.summary || project.results.highlights.length > 0) && (
        <section className="case-reveal border-t border-paper/20 px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 md:gap-12 lg:grid-cols-[300px_1fr]">
            <PlateLabel plate={t('Plate 05')} label={t('Results / Reflection')} tone="paper" />
            <div>
              {project.results.summary && (
                <p className="display-safe max-w-4xl text-[clamp(24px,7vw,48px)] leading-[1.18] md:leading-[1.1]">
                  {translation?.results?.summary ?? t(project.results.summary)}
                </p>
              )}
              {project.results.highlights.length > 0 && (
                <div className="mt-12 grid gap-0 border-t border-paper/20 md:grid-cols-3">
                  {project.results.highlights.map((highlight, index) => {
                    const translatedHighlight = translation?.results?.highlights?.[index]
                    return (
                      <div key={highlight} className="border-b border-paper/20 py-6 md:border-r md:px-5">
                        <p className="mono text-[11px] uppercase text-accent">{String(index + 1).padStart(2, '0')} {t('Learned')}</p>
                        <p className="mt-4 text-paper/72">{translatedHighlight ?? t(highlight)}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-paper/20 px-5 py-12 sm:px-8 md:px-16 md:py-16 lg:px-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {nextProject ? (
            <div>
              <p className="mono mb-3 text-[11px] uppercase text-paper/50">{t('Next project')}</p>
              <Link href={`${backHref}/${nextProject.slug}`} className="display-safe text-[clamp(32px,12vw,84px)] italic leading-none underline decoration-accent underline-offset-8">
                {applyProjectOverride(nextProject, overrides[nextProject.slug]).title}
              </Link>
            </div>
          ) : (
            <div>
              <p className="mono mb-3 text-[11px] uppercase text-paper/50">{t('App Development')}</p>
              <p className="display-safe text-[clamp(32px,12vw,84px)] italic leading-none">YinYang</p>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {!project.hideDownload && <DownloadButton href={downloadHref} download={isDownloadFile} />}
            <Link className="focus-ring mono border border-paper/30 px-5 py-3 text-[11px] uppercase transition hover:border-accent hover:text-accent" href={backHref}>
              {t('Back to index')}
            </Link>
          </div>
        </div>
      </section>
      <Lightbox open={Boolean(lightboxImage)} image={lightboxImage} onClose={closeLightbox} />
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="case-meta-item border-t border-paper/20 pt-4 md:border-t-0 md:border-l md:pl-5">
      <p className="mono text-[11px] uppercase text-paper/50">{label}</p>
      <p className="mt-2 leading-snug text-paper">{value}</p>
    </div>
  )
}

function DownloadButton({ href, download }: { href: string; download?: boolean }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:')
  const className =
    'focus-ring mono inline-flex items-center justify-center border border-accent px-5 py-3 text-[11px] uppercase text-accent transition hover:bg-accent hover:text-paper'
  const { t } = useLanguage()
  const content = t('Download Demo')

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} aria-label="Download demo">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} download={download} className={className} aria-label="Download demo">
      {content}
    </Link>
  )
}
