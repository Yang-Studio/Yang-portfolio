import { redirect } from 'next/navigation'
import ContentEditor from '@/features/admin/ContentEditor'
import { getCurrentAdminSession } from '@/lib/server/adminAuth'
import { getContentOverrides } from '@/lib/server/contentStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminContentPage() {
  const session = await getCurrentAdminSession()
  if (!session) redirect('/')
  const overrides = await getContentOverrides()
  return <ContentEditor initialOverrides={overrides} />
}
