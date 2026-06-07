'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isProject = pathname?.startsWith('/projects/')

  const navClass = isProject ? 'border-paper/20 bg-ink/90 text-paper' : 'border-rule bg-paper/90 text-ink'
  const linkClass =
    'focus-ring mono relative px-1 py-2 text-[11px] uppercase tracking-normal transition duration-300 hover:text-accent'
  const activeClass = 'after:absolute after:-bottom-1 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-accent after:content-[""]'

  return (
    <header className={`sticky top-0 z-[200] border-b backdrop-blur ${navClass}`}>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 md:px-16 md:py-5 lg:px-24">
        <Link
          href="/"
          className="focus-ring mono shrink-0 text-[11px] uppercase tracking-normal transition duration-300 hover:text-accent"
        >
          Yang Studio
        </Link>
        <nav className="flex min-w-0 items-center gap-4 md:gap-10">
          <Link className={`${linkClass} ${pathname === '/games' ? activeClass : ''}`} href="/games">
            {t('Home')}
          </Link>
          <Link className={`${linkClass} ${pathname?.startsWith('/projects') ? activeClass : ''}`} href="/projects">
            {t('Work')}
          </Link>
          <Link className={`${linkClass} ${pathname?.startsWith('/about') ? activeClass : ''}`} href="/about">
            {t('About')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
