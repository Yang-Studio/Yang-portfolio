'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export default function AdminLoginPanel() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setStatus('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setStatus(result.error || '登录失败。')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setStatus('无法连接登录服务。')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="border-t border-paper/20 pt-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring text-[10px] uppercase tracking-[0.16em] text-paper/45 transition hover:text-accent"
        aria-expanded={open}
      >
        {open ? '关闭管理员登录 / Close admin login' : '管理员登录 / Admin login'}
      </button>

      {open ? (
        <form onSubmit={submit} className="mt-5 grid max-w-md gap-3 sm:grid-cols-[1fr_auto]">
          <label>
            <span className="sr-only">管理员密码</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring min-h-12 w-full border border-paper/25 bg-transparent px-4 text-sm text-paper outline-none placeholder:text-paper/30"
              placeholder="密码 / Password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="focus-ring min-h-12 border border-accent px-5 text-xs uppercase text-accent transition hover:bg-accent hover:text-paper disabled:opacity-40"
          >
            {pending ? '登录中' : '登录'}
          </button>
          {status ? <p className="text-xs text-accent sm:col-span-2">{status}</p> : null}
        </form>
      ) : null}
      <Link
        href="/privacy"
        className="focus-ring mt-4 inline-block text-[10px] uppercase tracking-[0.12em] text-paper/35 underline underline-offset-4 transition hover:text-accent"
      >
        隐私设置 / Privacy
      </Link>
    </div>
  )
}
