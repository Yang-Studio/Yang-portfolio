import { appProjects } from '@/content/apps/projects'
import ProjectsArchive from '@/features/projects/ProjectsArchive'

export default function AppsIndex() {
  return (
    <ProjectsArchive
      items={appProjects}
      basePath="/apps"
      plate="App / Products"
      label="Independent Tools / Working Builds"
      titleTop="Digital"
      titleBottom="Products"
      description="Focused applications built from product decisions, interface systems, and working code."
    />
  )
}
