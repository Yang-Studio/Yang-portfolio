'use client'

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
    if (pathname.startsWith('/admin')) return

    const path = pathname
    if (lastTracked.current === path) return
    lastTracked.current = path

    // Every visit increments an anonymous page-view counter on the server.
    // Visitors who declined send no visitor id and consent:false, so only the
    // aggregate count is kept — no IP hash, visitor id, or geolocation.
    const declined = consent === 'declined'

    void fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        consent: !declined,
        visitorId: declined ? undefined : getVisitorId(),
        path,
        referrer: document.referrer,
      }),
    }).catch(() => undefined)
  }, [consent, pathname])

  return null
}
