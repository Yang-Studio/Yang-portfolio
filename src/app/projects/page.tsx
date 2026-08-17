import type { Metadata } from 'next'
import ProjectsArchive from '@/features/projects/ProjectsArchive'
import { siteContent } from '@/content/database'

export const metadata: Metadata = siteContent.seo.projects

export default function ProjectsPage() {
  return <ProjectsArchive />
}
