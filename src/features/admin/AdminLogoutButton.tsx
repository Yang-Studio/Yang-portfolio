'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const logout = async () => {
    setPending(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="focus-ring border border-paper/30 px-4 py-2 text-xs uppercase tracking-[0.16em] text-paper/70 transition hover:border-accent hover:text-accent disabled:opacity-40"
    >
      {pending ? '退出中...' : '退出登录'}
    </button>
  )
}
