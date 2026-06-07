import type { Metadata } from 'next'
import { projects } from '@/content/games/projects'
import ProjectDetail from '@/features/projects/ProjectDetail'

const project = projects.find((p) => p.slug === 'ink')!

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
  return <ProjectDetail project={project} />
}
