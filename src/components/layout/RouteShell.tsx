'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Cursor from '@/components/layout/Cursor'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import LanguageToggle from '@/components/layout/LanguageToggle'
import SiteShell from '@/components/layout/SiteShell'

export default function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAppSection = pathname?.startsWith('/apps')
  const isAdminSection = pathname?.startsWith('/admin')

  if (pathname === '/' || isAdminSection) {
    return <main className="min-h-dvh bg-ink">{children}</main>
  }

  if (isAppSection) {
    const isAppDetail = pathname !== '/apps'
    return <div className={isAppDetail ? 'min-h-dvh bg-ink' : 'min-h-dvh bg-paper'}>{children}</div>
  }

  return (
    <SiteShell>
      <Cursor />
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
      <LanguageToggle />
    </SiteShell>
  )
}
