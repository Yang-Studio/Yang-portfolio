'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isDetail = pathname !== '/apps'
  const shellClass = isDetail ? 'border-white/10 bg-[#0a0a0a] text-white' : 'border-black/10 bg-white text-black'
  const softClass = isDetail ? 'text-white/55' : 'text-black/50'

  return (
    <div className={isDetail ? 'min-h-dvh bg-ink text-paper' : 'min-h-dvh bg-white text-black'}>
      <header className={`sticky top-0 z-[200] border-b ${shellClass}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8 md:px-14">
          <Link href="/apps" className="focus-ring mono text-[12px] uppercase tracking-[0.16em]">
            Yang / App Lab
          </Link>
          <div className={`mono flex items-center gap-5 text-[10px] uppercase tracking-[0.12em] ${softClass}`}>
            <Link href="/apps" className="transition hover:text-accent">
              App Index
            </Link>
            <a href="/yinyang/index.html" target="_blank" rel="noreferrer" className="transition hover:text-accent">
              Launch YinYang
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className={`border-t px-5 py-6 sm:px-8 md:px-14 ${shellClass}`}>
        <div className={`mono mx-auto flex max-w-[1440px] justify-between gap-4 text-[10px] uppercase ${softClass}`}>
          <span>Independent App Development</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  )
}
