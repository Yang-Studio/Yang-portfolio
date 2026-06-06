import type { Metadata } from 'next'
import ProjectsArchive from '@/components/ProjectsArchive'

export const metadata: Metadata = {
  title: 'Projects -- Yang Studio',
  description: 'Project evidence for gameplay systems, enemy AI, UI feedback, prototypes, UX research, and environment art.',
}

export default function ProjectsPage() {
  return <ProjectsArchive />
}
