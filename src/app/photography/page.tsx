import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { siteContent } from '@/content/database'

export const metadata: Metadata = siteContent.seo.photography

export default async function PhotographyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const params = await searchParams
  const language = params.lang === 'en' ? 'en' : 'zh'

  redirect(`/embedded-sites/film/index.html?direct=1&lang=${language}`)
}
