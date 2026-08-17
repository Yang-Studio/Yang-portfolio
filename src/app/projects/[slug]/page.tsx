import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProject } from '@/content/database'
import ProjectDetail from '@/features/projects/ProjectDetail'
import ProjectPasswordGate from '@/features/projects/ProjectPasswordGate'
import { canViewTerradottaProject, isTerradottaLockConfigured } from '@/lib/server/projectAccess'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found — Yang Studio' }
  return {
    title: project.title + ' — Yang Studio',
    description: project.blurb,
    openGraph: {
      title: project.title,
      description: project.blurb,
      images: [project.cover],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  if (slug === 'terradotta' && !(await canViewTerradottaProject())) {
    return (
      <ProjectPasswordGate
        title={project.title}
        description="这个项目页面已加锁。请输入项目访问密码后继续查看完整案例。"
        configured={isTerradottaLockConfigured()}
      />
    )
  }

  return <ProjectDetail project={project} siblings={projects} />
}
