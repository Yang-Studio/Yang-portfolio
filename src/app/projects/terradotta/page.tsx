import type { Metadata } from 'next'
import { projects } from '@/content/games/projects'
import ProjectDetail from '@/features/projects/ProjectDetail'
import ProjectPasswordGate from '@/features/projects/ProjectPasswordGate'
import { canViewTerradottaProject, isTerradottaLockConfigured } from '@/lib/server/projectAccess'

const project = projects.find((p) => p.slug === 'terradotta')!

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: `${project.title} -- Yang Studio`,
  description: project.blurb,
  openGraph: {
    title: project.title,
    description: project.blurb,
    images: [project.cover],
  },
}

export default async function Page() {
  const canView = await canViewTerradottaProject()
  if (!canView) {
    return (
      <ProjectPasswordGate
        title={project.title}
        description="这个项目页面已加锁。请输入项目访问密码后继续查看完整案例。"
        configured={isTerradottaLockConfigured()}
      />
    )
  }

  return <ProjectDetail project={project} />
}
