'use client'

import { useLanguage } from '@/components/LanguageProvider'
type Props = {
  kicker: string
  title: string
  description?: string
}

export default function PageHero({ kicker, title, description }: Props) {
  const { t } = useLanguage()
  return (
    <header className="mt-10 space-y-4 md:mt-16">
      <span className="font-display text-sm uppercase tracking-[0.2em] text-coral">{t(kicker)}</span>
      <h1 className="display-safe font-display text-[clamp(34px,11vw,48px)] leading-[1.04] text-slate">{t(title)}</h1>
      {description ? <p className="copy-safe max-w-2xl text-lg text-slate/80">{t(description)}</p> : null}
    </header>
  )
}
