import type { Metadata } from 'next'
import ProjectClient from '@/app/projects/ProjectClient'
import { appProjects } from '@/content/appProjects'

const project = appProjects.find((item) => item.slug === 'yinyang')!

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
