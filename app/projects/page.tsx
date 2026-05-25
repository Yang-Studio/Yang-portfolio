import type { Metadata } from 'next'
import ProjectsArchive from '@/components/ProjectsArchive'

export const metadata: Metadata = {
  title: 'Projects -- Yang Studio',
  description: 'Case studies exploring game design, technical art, and prototypes from Yang Studio.',
}

export default function ProjectsPage() {
  return <ProjectsArchive />
}
