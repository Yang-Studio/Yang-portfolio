'use client'

import PageHero from '@/components/PageHero'
import { biography, coreSkills, timeline, socialLinks } from '@/content/about'
import { useLanguage } from '@/components/LanguageProvider'

export default function AboutClient() {
  const { t } = useLanguage()
  return (
    <div className="px-5 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <PageHero
          kicker="About"
          title="Yang Liu | systems-focused game designer & engineer"
          description="I turn abstract ideas into testable, iterative gameplay through systems design and engineering."
        />
      </div>

      <section className="relative mx-auto mt-10 w-full max-w-[1200px] rounded-[24px] border border-white/40 bg-white/65 p-5 shadow-soft backdrop-blur sm:p-8 md:mt-16 md:rounded-[48px] md:p-10">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4 text-lg text-slate/80">
            {biography.body.map((paragraph) => (
              <p key={paragraph}>{t(paragraph)}</p>
            ))}
            <a
              href={biography.resumeUrl}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-coral px-4 py-2 text-coral transition hover:border-sage hover:text-sage"
            >
              {t('View resume')}
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
          <aside className="glass rounded-2xl p-5 shadow-soft md:p-6">
            <h3 className="font-display text-xl text-slate">{t("What I'm exploring now")}</h3>
            <ul className="mt-4 space-y-3 text-slate/80">
              {biography.now.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-coral" />
                  {t(item)}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-10 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {coreSkills.map((skill) => (
            <article key={skill.label} className="glass rounded-2xl p-5 shadow-soft md:p-6">
              <h3 className="font-display text-xl text-slate">{t(skill.label)}</h3>
              <ul className="mt-4 space-y-2 text-slate/80">
                {skill.items.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-mist/50 p-5 shadow-soft md:mt-16 md:p-8">
          <h3 className="font-display text-xl text-slate">{t('A warm timeline')}</h3>
          <div className="mt-6 space-y-4">
            {timeline.map((entry) => (
              <div key={entry.year} className="grid gap-2 sm:grid-cols-[88px_1fr] sm:gap-6">
                <span className="font-display text-2xl text-coral">{entry.year}</span>
                <p className="whitespace-pre-line text-slate/80">{t(entry.blurb)}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="connect" className="mt-10 rounded-2xl border border-dashed border-coral/40 bg-white/55 p-5 shadow-soft md:mt-16 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-coral">{t('Connect')}</p>
              <h3 className="mt-2 font-display text-2xl text-slate">{t('Find Yang across the web')}</h3>
              <p className="mt-3 max-w-xl text-slate/70">
                {t('For collaboration or project ideas, feel free to reach out.')}
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-4">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    className="focus-ring group flex items-center justify-between gap-4 rounded-2xl bg-sand/40 px-4 py-4 text-left text-slate/80 transition hover:bg-sage/40 md:px-5"
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-coral">{t(social.platform)}</p>
                      <p className="mt-1 font-display text-lg text-slate">{social.handle}</p>
                      {social.description ? <p className="mt-1 text-sm text-slate/70">{t(social.description)}</p> : null}
                    </div>
                    <span className="text-sm font-semibold text-slate/60 transition group-hover:text-slate">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
