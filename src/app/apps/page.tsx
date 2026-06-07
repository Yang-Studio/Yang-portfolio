import type { Metadata } from 'next'
import AppsIndex from '@/features/apps/AppsIndex'

export const metadata: Metadata = {
  title: 'App Development -- Yang Studio',
  description: 'Independent web apps, data tools, interface systems, and AI integrations by Yang Liu.',
}

export default function AppsPage() {
  return <AppsIndex />
}
