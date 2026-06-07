'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Consent = 'accepted' | 'declined' | undefined

const CONSENT_KEY = 'yang-analytics-consent-v1'
const VISITOR_KEY = 'yang-anonymous-visitor-v1'
const CONSENT_EVENT = 'yang-analytics-consent-change'

function getVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_KEY)
  if (existing) return existing

  const generated =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`
  window.localStorage.setItem(VISITOR_KEY, generated)
  return generated
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<Consent>()
  const lastTracked = useRef('')

  useEffect(() => {
    const syncConsent = () => {
      const saved = window.localStorage.getItem(CONSENT_KEY)
      queueMicrotask(() => setConsent(saved === 'accepted' || saved === 'declined' ? saved : undefined))
    }

    syncConsent()
    window.addEventListener('storage', syncConsent)
    window.addEventListener(CONSENT_EVENT, syncConsent)
    return () => {
      window.removeEventListener('storage', syncConsent)
      window.removeEventListener(CONSENT_EVENT, syncConsent)
    }
  }, [])

  useEffect(() => {
    if (consent !== 'accepted' || pathname.startsWith('/admin')) return

    const path = pathname
    if (lastTracked.current === path) return
    lastTracked.current = path

    void fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        consent: true,
        visitorId: getVisitorId(),
        path,
        referrer: document.referrer,
      }),
    }).catch(() => undefined)
  }, [consent, pathname])

  if (consent || pathname.startsWith('/admin')) return null

  const choose = (value: Exclude<Consent, undefined>) => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setConsent(value)
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] border border-rule bg-paper p-4 text-ink shadow-2xl sm:left-auto sm:max-w-xl md:bottom-6 md:right-6 md:p-5">
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-accent">Anonymous analytics / 匿名统计</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        是否允许记录匿名访问数据？系统保存页面路径、设备类型、IP 哈希及 IP 推断的国家/地区/城市，不保存原始 IP
        或精确地址。
      </p>
      <Link href="/privacy" className="mono mt-2 inline-block text-[10px] uppercase text-ink-soft underline underline-offset-4">
        隐私说明 / Privacy details
      </Link>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="focus-ring border border-ink bg-ink px-4 py-2 text-xs text-paper"
        >
          同意统计 / Accept
        </button>
        <button
          type="button"
          onClick={() => choose('declined')}
          className="focus-ring border border-rule px-4 py-2 text-xs text-ink-soft"
        >
          拒绝 / Decline
        </button>
      </div>
    </aside>
  )
}
