'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { siteContent } from '@/content/database'

export default function Footer() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isDarkProject = pathname?.startsWith('/projects/')

  const shellClass = isDarkProject ? 'border-paper/20 bg-ink text-paper' : 'border-rule bg-paper text-ink'
  const softClass = isDarkProject ? 'text-paper/50' : 'text-ink-soft'

  return (
    <footer className={`border-t ${shellClass}`}>
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-14 sm:px-8 md:px-16 md:py-20 lg:gap-16 lg:px-24">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[0.9fr_1.45fr_1fr] lg:gap-x-14">
          <div>
            <p className={`mono mb-4 text-[11px] uppercase tracking-normal ${softClass}`}>{t('Location')}</p>
            <p className="copy-safe zh-footer-copy">
              {t(siteContent.identity.location)}
              <br />
              {t(siteContent.identity.country)}
            </p>
          </div>
          <div>
            <p className={`mono mb-4 text-[11px] uppercase tracking-normal ${softClass}`}>{t('Elsewhere')}</p>
            <div className="flex flex-col items-start gap-2">
              <a
                className="max-w-full break-all text-[15px] underline decoration-accent underline-offset-4 sm:text-base"
                href={`mailto:${siteContent.identity.email}`}
              >
                {siteContent.identity.email}
              </a>
              <a className="underline decoration-accent underline-offset-4" href={siteContent.identity.githubUrl}>
                GitHub
              </a>
              <Link className="underline decoration-accent underline-offset-4" href="/privacy">
                {t('Privacy')} / 隐私设置
              </Link>
            </div>
          </div>
          <div>
            <p className={`mono mb-4 text-[11px] uppercase tracking-normal ${softClass}`}>{t('Colophon')}</p>
            <p className="copy-safe zh-footer-copy">
              {t('Copyright')} {new Date().getFullYear()} {siteContent.identity.name}.
            </p>
            <p className={`mt-4 text-[12px] leading-relaxed ${softClass}`}>
              {siteContent.footer.privacyNotice}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
