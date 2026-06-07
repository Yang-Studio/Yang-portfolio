import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'
import './globals.css'
import RouteShell from '@/components/layout/RouteShell'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import type { ReactNode } from 'react'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const notoSerifSc = Noto_Serif_SC({
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif-sc',
  weight: ['400', '500', '600', '700'],
})
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  metadataBase: new URL('https://yang-portfolio-rose.vercel.app'),
  title: 'Yang Studio Monograph',
  description: 'A digital portfolio treated as a museum catalogue for game systems work.',
  openGraph: {
    title: 'Yang Studio Monograph',
    description: 'Game systems, selected work, and technical case studies by Yang Liu.',
    images: ['/og/yang-studio.jpg'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh">
      <body
        className={`${fraunces.variable} ${notoSerifSc.variable} ${jetbrains.variable} bg-paper text-ink selection:bg-accent selection:text-paper`}
      >
        <LanguageProvider>
          <RouteShell>{children}</RouteShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
