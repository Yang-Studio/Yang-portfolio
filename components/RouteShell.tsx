'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Cursor from '@/components/Cursor'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LanguageToggle from '@/components/LanguageToggle'
import Loader from '@/components/Loader'
import SiteShell from '@/components/SiteShell'

export default function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAppSection = pathname?.startsWith('/apps')

  if (isAppSection) {
    const isAppDetail = pathname !== '/apps'
    return <div className={isAppDetail ? 'min-h-dvh bg-ink' : 'min-h-dvh bg-paper'}>{children}</div>
  }

  return (
    <SiteShell>
      <Loader />
      <Cursor />
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
      <LanguageToggle />
    </SiteShell>
  )
}
