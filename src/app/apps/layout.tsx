import type { ReactNode } from 'react'
import AppShell from '@/features/apps/AppShell'

export default function AppsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
