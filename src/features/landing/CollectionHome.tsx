'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage, type Language } from '@/components/providers/LanguageProvider'
import AdminLoginPanel from '@/features/admin/AdminLoginPanel'

type Collection = 'games' | 'apps' | 'photography'

export default function CollectionHome() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const [collection, setCollection] = useState<Collection>('games')

  const chooseLanguage = (language: Language) => {
    setLanguage(language)
    document.documentElement.lang = language
    const routes: Record<Collection, string> = {
      games: '/games',
      apps: '/apps',
      photography: `/photography?lang=${language}`,
    }
    router.push(routes[collection])
  }

  return (
    <div
      className="mono flex min-h-dvh flex-col justify-between gap-7 overflow-y-auto bg-ink p-5 text-paper sm:p-8 md:p-12"
    >
      <div className="flex items-start justify-between gap-6 text-[10px] uppercase tracking-normal text-paper/70 md:text-[11px]">
        <span>Yang Studio Monograph</span>
        <span className="text-right">2026 Build Brief</span>
      </div>
      <div className="grid gap-5 md:gap-7">
        <div className="mb-1 h-px bg-paper md:mb-3" />
        <div className="flex items-end justify-between gap-6">
          <span className="font-serif text-[clamp(58px,16vw,160px)] leading-[0.86] tracking-normal text-paper">
            Y
          </span>
          <div className="text-right">
            <p className="text-[clamp(46px,12vw,112px)] leading-none text-paper/25">03</p>
            <p className="mt-3 text-accent md:mt-4">COLLECTIONS</p>
          </div>
        </div>
        <div className="grid gap-7">
          <div>
            <p className="text-[clamp(30px,10vw,72px)] font-serif leading-none text-paper">选择语言</p>
            <p className="mt-2 text-[clamp(20px,7vw,44px)] font-serif italic leading-none text-paper/60 md:mt-3">
              Select language
            </p>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase text-paper/50">选择分类 / Select collection</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                onClick={() => setCollection('games')}
                className={`focus-ring min-h-16 border px-5 py-3 text-left transition ${
                  collection === 'games'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-paper/25 text-paper/65 hover:border-paper/60 hover:text-paper'
                }`}
              >
                <span className="block text-[10px] uppercase opacity-60">Portfolio</span>
                <span className="mt-1 block text-lg">游戏开发 / Game Development</span>
              </button>
              <button
                type="button"
                onClick={() => setCollection('apps')}
                className={`focus-ring min-h-16 border px-5 py-3 text-left transition ${
                  collection === 'apps'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-paper/25 text-paper/65 hover:border-paper/60 hover:text-paper'
                }`}
              >
                <span className="block text-[10px] uppercase opacity-60">天機閣</span>
                <span className="mt-1 block text-lg">App开发 / App Development</span>
              </button>
              <button
                type="button"
                onClick={() => setCollection('photography')}
                className={`focus-ring min-h-16 border px-5 py-3 text-left transition ${
                  collection === 'photography'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-paper/25 text-paper/65 hover:border-paper/60 hover:text-paper'
                }`}
              >
                <span className="block text-[10px] uppercase opacity-60">Film Archive</span>
                <span className="mt-1 block text-lg">摄影 / Photography</span>
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:max-w-xl">
            <button
              type="button"
              onClick={() => chooseLanguage('zh')}
              className="focus-ring min-h-12 border border-paper px-6 py-3 text-left text-paper transition hover:border-accent hover:text-accent md:px-8 md:py-4"
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => chooseLanguage('en')}
              className="focus-ring min-h-12 border border-paper/35 px-6 py-3 text-left text-paper/70 transition hover:border-accent hover:text-accent md:px-8 md:py-4"
            >
              English
            </button>
          </div>
          <AdminLoginPanel />
        </div>
      </div>
      <Link
        href="/privacy"
        className="fixed bottom-4 right-4 z-50 text-[10px] uppercase tracking-normal text-paper/40 transition hover:text-accent"
      >
        隐私设置 / Privacy
      </Link>
    </div>
  )
}
