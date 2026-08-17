import type { Metadata } from 'next'
import AboutClient from '@/features/about/AboutClient'
import { siteContent } from '@/content/database'

export const metadata: Metadata = siteContent.seo.about

export default function AboutPage() {
  return <AboutClient />
}
