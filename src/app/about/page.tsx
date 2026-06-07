import type { Metadata } from 'next'
import AboutClient from '@/features/about/AboutClient'

export const metadata: Metadata = {
  title: 'About -- Yang Studio',
  description: 'Gameplay systems designer and technical designer focused on playable implementation, AI behavior, UI feedback, and prototypes.',
}

export default function AboutPage() {
  return <AboutClient />
}
