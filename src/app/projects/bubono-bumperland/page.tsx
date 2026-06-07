import type { Metadata } from 'next'
import { projects } from '@/content/games/projects'
import BubonoBumperlandClient from '@/features/games/project-details/BubonoBumperlandClient'

const project = projects.find((p) => p.slug === 'bubono-bumperland')!

export const metadata: Metadata = {
  title: `${project.title} -- Yang Studio`,
  description: project.blurb,
  openGraph: {
    title: project.title,
    description: project.blurb,
    images: [project.cover],
  },
}

export default function Page() {
  return <BubonoBumperlandClient />
}
