import type { Metadata } from 'next'
import { appProjects } from '@/content/apps/projects'
import ProjectDetail from '@/features/projects/ProjectDetail'

const project = appProjects.find((item) => item.slug === 'lote')!

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
  return <ProjectDetail project={project} siblings={appProjects} backHref="/apps" />
}
