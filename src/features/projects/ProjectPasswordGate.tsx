'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { siteContent } from '@/content/database'

export default function ProjectPasswordGate({
  title,
  description,
  configured,
}: {
  title: string
  description: string
  configured: boolean
}) {
  const copy = siteContent.protectedProject
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setStatus('')

    try {
      const response = await fetch('/api/project-access/terradotta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setStatus(result.error || copy.openFailed)
        return
      }

      router.refresh()
    } catch {
      setStatus(copy.connectionFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-10 text-paper sm:px-8 md:px-16 lg:px-24">
      <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[980px] flex-col justify-center">
        <p className="mono text-[11px] uppercase tracking-[0.18em] text-accent">{copy.eyebrow}</p>
        <h1 className="mt-5 text-[clamp(44px,12vw,112px)] italic leading-none">{title}</h1>
        <p className="mt-7 max-w-2xl text-[clamp(18px,4.4vw,28px)] leading-[1.28] text-paper/68">{description}</p>

        {configured ? (
          <form onSubmit={submit} className="mt-10 grid max-w-xl gap-4 sm:grid-cols-[1fr_auto]">
            <label>
              <span className="sr-only">{copy.passwordLabel}</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="focus-ring min-h-14 w-full border border-paper/25 bg-transparent px-4 text-base text-paper outline-none placeholder:text-paper/30"
                placeholder={copy.passwordPlaceholder}
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="focus-ring min-h-14 border border-accent px-6 text-xs uppercase tracking-[0.14em] text-accent transition hover:bg-accent hover:text-paper disabled:opacity-40"
            >
              {pending ? copy.pending : copy.submit}
            </button>
            {status ? <p className="text-sm text-accent sm:col-span-2">{status}</p> : null}
          </form>
        ) : (
          <div className="mt-10 border border-accent/50 bg-accent/10 p-6">
            <p className="mono text-xs uppercase text-accent">{copy.setupTitle}</p>
            <p className="mt-3 text-paper/78">{copy.setupDescription}</p>
          </div>
        )}
      </section>
    </main>
  )
}
