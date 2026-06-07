'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { createLenis } from '@/lib/lenis'

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isDarkProject = pathname?.startsWith('/projects/')

  useEffect(() => {
    const lenis = createLenis()
    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const shellClass = isDarkProject ? 'min-h-dvh bg-ink' : 'min-h-dvh bg-paper'

  return <div className={shellClass}>{children}</div>
}
