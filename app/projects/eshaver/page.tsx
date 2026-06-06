import type { Metadata } from 'next'
import ProjectClient from '@/app/projects/ProjectClient'
import { projects } from '@/content/projects'

const project = projects.find((p) => p.slug === 'eshaver')!

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
  return <ProjectClient project={project} />
}
