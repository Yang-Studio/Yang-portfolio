import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Photography -- Yang Studio',
  description: 'A film photography archive of portraits, landscapes, street scenes, and architecture by Yang Liu.',
}

export default async function PhotographyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const params = await searchParams
  const language = params.lang === 'en' ? 'en' : 'zh'

  redirect(`/embedded-sites/film/index.html?direct=1&lang=${language}`)
}
