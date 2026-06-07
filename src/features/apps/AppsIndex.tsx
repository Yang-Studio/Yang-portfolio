import { appProjects } from '@/content/apps/projects'
import ProjectsArchive from '@/features/projects/ProjectsArchive'

export default function AppsIndex() {
  return (
    <ProjectsArchive
      items={appProjects}
      basePath="/apps"
      plate="App / Index"
      label="Software / Complete Archive"
      titleTop="Software"
      titleBottom="Index"
    />
  )
}
