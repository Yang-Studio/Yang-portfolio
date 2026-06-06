'use client'

import Image from 'next/image'
import Link from 'next/link'
import PlateLabel from '@/components/PlateLabel'
import { useLanguage } from '@/components/LanguageProvider'
import { appProjects } from '@/content/appProjects'
import { projectTranslations } from '@/content/projectTranslations'

export default function AppDevelopmentHome() {
  const { language, t } = useLanguage()

  return (
    <div className="bg-paper text-ink">
      <section className="border-b border-rule px-5 py-16 sm:px-8 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[300px_1fr]">
          <PlateLabel plate="App / 01" label={language === 'zh' ? 'App 开发作品集' : 'App Development Portfolio'} active />
          <div>
            <h1 className="display-safe text-[clamp(48px,13vw,120px)] italic leading-[0.92]">App Development</h1>
            <p className="copy-safe mt-8 max-w-3xl text-[clamp(20px,5vw,34px)] leading-[1.2] text-ink-soft">
              {language === 'zh'
                ? '聚焦独立 Web App、数据计算、交互界面、服务端 API 与 AI 功能集成。'
                : 'Independent web apps combining data computation, interface design, server APIs, and AI integration.'}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-16 md:py-20 lg:px-24">
        <div className="mx-auto max-w-[1280px]">
          {appProjects.map((project, index) => {
            const translation = language === 'zh' ? projectTranslations[project.slug] : undefined
            return (
              <article key={project.slug} className="grid gap-8 border-y border-rule py-8 lg:grid-cols-[100px_1fr_1fr] lg:items-center">
                <p className="mono text-[clamp(42px,9vw,76px)] leading-none text-accent">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <Link href={`/apps/${project.slug}`} className="group overflow-hidden border border-rule bg-paper-deep">
                  <Image
                    src={project.cover}
                    alt={project.title}
                    width={1200}
                    height={800}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </Link>
                <div>
                  <p className="mono text-[11px] uppercase text-accent">{t(project.tag)} / {project.year}</p>
                  <h2 className="mt-5 text-[clamp(42px,10vw,82px)] italic leading-none">
                    {translation?.title ?? project.title}
                  </h2>
                  <p className="copy-safe mt-6 text-[clamp(18px,4vw,26px)] leading-snug text-ink-soft">
                    {translation?.blurb ?? project.blurb}
                  </p>
                  <Link
                    href={`/apps/${project.slug}`}
                    className="focus-ring mono mt-8 inline-flex border border-accent px-5 py-3 text-[11px] uppercase text-accent transition hover:bg-accent hover:text-paper"
                  >
                    {language === 'zh' ? '查看 App 项目' : 'View app project'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
