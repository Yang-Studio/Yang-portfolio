'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'yang-analytics-consent-v1'
const VISITOR_KEY = 'yang-anonymous-visitor-v1'
const CONSENT_EVENT = 'yang-analytics-consent-change'

type Consent = 'accepted' | 'declined' | undefined

function readConsent(): Consent {
  const saved = window.localStorage.getItem(CONSENT_KEY)
  return saved === 'accepted' || saved === 'declined' ? saved : undefined
}

export default function PrivacyControls() {
  const [consent, setConsent] = useState<Consent>()

  useEffect(() => {
    queueMicrotask(() => setConsent(readConsent()))
  }, [])

  const updateConsent = (value: Exclude<Consent, undefined>) => {
    window.localStorage.setItem(CONSENT_KEY, value)
    if (value === 'declined') {
      window.localStorage.removeItem(VISITOR_KEY)
    }
    setConsent(value)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  const status =
    consent === 'accepted' ? '当前状态：已允许匿名统计' : consent === 'declined' ? '当前状态：已拒绝匿名统计' : '当前状态：尚未选择'

  return (
    <section className="mt-12 border border-rule p-5 sm:p-7" aria-labelledby="privacy-controls-title">
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-accent">Privacy controls</p>
      <h2 id="privacy-controls-title" className="mt-3 text-3xl">
        统计偏好
      </h2>
      <p className="mt-3 text-sm text-ink-soft" aria-live="polite">
        {status}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => updateConsent('accepted')}
          className="focus-ring border border-ink bg-ink px-5 py-3 text-xs text-paper"
        >
          允许匿名统计
        </button>
        <button
          type="button"
          onClick={() => updateConsent('declined')}
          className="focus-ring border border-rule px-5 py-3 text-xs text-ink"
        >
          拒绝并清除匿名标识
        </button>
      </div>
    </section>
  )
}
