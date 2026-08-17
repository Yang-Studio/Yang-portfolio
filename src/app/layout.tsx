import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import RouteShell from '@/components/layout/RouteShell'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { ContentOverridesProvider } from '@/components/providers/ContentOverridesProvider'
import { getContentOverrides } from '@/lib/server/contentStore'
import type { ReactNode } from 'react'
import { siteContent } from '@/content/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.seo.site.url),
  title: siteContent.seo.site.title,
  description: siteContent.seo.site.description,
  openGraph: {
    title: siteContent.seo.site.title,
    description: siteContent.seo.site.openGraphDescription,
    images: [siteContent.seo.site.image],
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
