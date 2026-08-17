'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage, type Language } from '@/components/providers/LanguageProvider'
import { siteContent } from '@/content/database'
import AdminLoginPanel from '@/features/admin/AdminLoginPanel'

type Collection = 'games' | 'photography'

export default function CollectionHome() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const [collection, setCollection] = useState<Collection>('games')

  const chooseLanguage = (language: Language) => {
    setLanguage(language)
    document.documentElement.lang = language
    router.push(collection === 'games' ? '/games' : '/photography?lang=' + language)
  }

  return (
    <div className="mono flex min-h-dvh flex-col justify-between gap-7 overflow-y-auto bg-ink p-5 text-paper sm:p-8 md:p-12">
      <div className="flex items-start justify-between gap-6 text-[10px] uppercase text-paper/70 md:text-[11px]">
        <span>{siteContent.landing.brand}</span>
        <span className="text-right">{siteContent.landing.status}</span>
      </div>
      <div className="grid gap-7">
        <div className="h-px bg-paper" />
        <div className="flex items-end justify-between gap-6">
          <span className="font-serif text-[clamp(58px,16vw,160px)] leading-[0.86] text-paper">{siteContent.landing.monogram}</span>
          <div className="text-right">
            <p className="text-[clamp(46px,12vw,112px)] leading-none text-paper/25">{siteContent.landing.areaCount}</p>
            <p className="mt-3 text-accent">{siteContent.landing.areaTitle}</p>
          </div>
        </div>
        <div>
          <p className="text-[clamp(30px,10vw,72px)] font-serif leading-none text-paper">{siteContent.landing.languageTitleZh}</p>
          <p className="mt-2 text-[clamp(20px,7vw,44px)] font-serif italic leading-none text-paper/60">{siteContent.landing.languageTitleEn}</p>
        </div>
        <div>
          <p className="mb-3 text-[10px] uppercase text-paper/50">{siteContent.landing.areaLabel}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setCollection('games')} className={'focus-ring min-h-16 border px-5 py-3 text-left transition ' + (collection === 'games' ? 'border-accent bg-accent/10 text-accent' : 'border-paper/25 text-paper/65')}>
              <span className="block text-[10px] uppercase opacity-60">{siteContent.landing.gameEyebrow}</span>
              <span className="mt-1 block text-lg">{siteContent.landing.gameLabel}</span>
            </button>
            <button type="button" onClick={() => setCollection('photography')} className={'focus-ring min-h-16 border px-5 py-3 text-left transition ' + (collection === 'photography' ? 'border-accent bg-accent/10 text-accent' : 'border-paper/25 text-paper/65')}>
              <span className="block text-[10px] uppercase opacity-60">{siteContent.landing.photographyEyebrow}</span>
              <span className="mt-1 block text-lg">{siteContent.landing.photographyLabel}</span>
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:max-w-xl">
          <button type="button" onClick={() => chooseLanguage('zh')} className="focus-ring min-h-12 border border-paper px-6 py-3 text-left text-paper transition hover:border-accent hover:text-accent">{siteContent.landing.languageZh}</button>
          <button type="button" onClick={() => chooseLanguage('en')} className="focus-ring min-h-12 border border-paper/35 px-6 py-3 text-left text-paper/70 transition hover:border-accent hover:text-accent">{siteContent.landing.languageEn}</button>
        </div>
        <AdminLoginPanel />
      </div>
      <Link href="/privacy" className="fixed bottom-4 right-4 z-50 text-[10px] uppercase text-paper/40 transition hover:text-accent">{siteContent.landing.privacyLink}</Link>
    </div>
  )
}
