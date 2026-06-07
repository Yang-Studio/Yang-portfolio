'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'

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
              {t('Rincon, Georgia')}
              <br />
              {t('United States')}
            </p>
          </div>
          <div>
            <p className={`mono mb-4 text-[11px] uppercase tracking-normal ${softClass}`}>{t('Elsewhere')}</p>
            <div className="flex flex-col items-start gap-2">
              <a
                className="max-w-full break-all text-[15px] underline decoration-accent underline-offset-4 sm:text-base"
                href="mailto:yangliu.gmdev@gmail.com"
              >
                yangliu.gmdev@gmail.com
              </a>
              <a className="underline decoration-accent underline-offset-4" href="https://github.com/Yang-Studio">
                GitHub
              </a>
            </div>
          </div>
          <div>
            <p className={`mono mb-4 text-[11px] uppercase tracking-normal ${softClass}`}>{t('Colophon')}</p>
            <p className="copy-safe zh-footer-copy">
              {t('Copyright')} {new Date().getFullYear()} Yang Liu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
