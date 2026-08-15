import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import RouteShell from '@/components/layout/RouteShell'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { ContentOverridesProvider } from '@/components/providers/ContentOverridesProvider'
import { getContentOverrides } from '@/lib/server/contentStore'
import type { ReactNode } from 'react'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

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

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const contentOverrides = await getContentOverrides()

  return (
    <html lang="zh">
      <body
        className={`${fraunces.variable} ${jetbrains.variable} bg-paper text-ink selection:bg-accent selection:text-paper`}
      >
        <LanguageProvider>
          <ContentOverridesProvider value={contentOverrides}>
            <RouteShell>{children}</RouteShell>
          </ContentOverridesProvider>
          <AnalyticsTracker />
        </LanguageProvider>
      </body>
    </html>
  )
}
