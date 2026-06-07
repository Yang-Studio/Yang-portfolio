'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import LanguageToggle from '@/components/layout/LanguageToggle'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isDetail = pathname !== '/apps'
  const shellClass = isDetail ? 'border-paper/20 bg-ink/90 text-paper' : 'border-rule bg-paper/90 text-ink'
  const footerClass = isDetail ? 'border-paper/20 bg-ink text-paper' : 'border-rule bg-paper text-ink'
  const softClass = isDetail ? 'text-paper/50' : 'text-ink-soft'
  const linkClass =
    'focus-ring mono relative px-1 py-2 text-[11px] uppercase tracking-normal transition duration-300 hover:text-accent'
  const activeClass =
    'after:absolute after:-bottom-1 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-accent after:content-[""]'

  return (
    <div className={isDetail ? 'min-h-dvh bg-ink text-paper' : 'min-h-dvh bg-paper text-ink'}>
      <header className={`sticky top-0 z-[200] border-b backdrop-blur ${shellClass}`}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 md:px-16 md:py-5 lg:px-24">
          <Link href="/" className="focus-ring mono shrink-0 text-[11px] uppercase tracking-normal transition hover:text-accent">
            Yang App Studio
          </Link>
          <nav className="flex min-w-0 items-center gap-4 md:gap-10">
            <Link href="/apps" className={`${linkClass} ${pathname?.startsWith('/apps') ? activeClass : ''}`}>
              {t('Apps')}
            </Link>
            <Link href="/" className={linkClass}>
              {t('Main Index')}
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className={`border-t ${footerClass}`}>
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-5 py-12 sm:px-8 md:px-16 lg:grid-cols-3 lg:px-24">
          <div>
            <p className={`mono mb-3 text-[11px] uppercase ${softClass}`}>Practice</p>
            <p>Independent App Development</p>
          </div>
          <div>
            <p className={`mono mb-3 text-[11px] uppercase ${softClass}`}>Contact</p>
            <a className="underline decoration-accent underline-offset-4" href="mailto:yangliu.gmdev@gmail.com">
              yangliu.gmdev@gmail.com
            </a>
          </div>
          <div>
            <p className={`mono mb-3 text-[11px] uppercase ${softClass}`}>Index</p>
            <Link className="underline decoration-accent underline-offset-4" href="/">
              {t('Back to main index')}
            </Link>
          </div>
        </div>
      </footer>
      <LanguageToggle />
    </div>
  )
}
