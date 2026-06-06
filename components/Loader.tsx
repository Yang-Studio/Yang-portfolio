'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/motion'
import { useLanguage, type Language } from '@/components/LanguageProvider'

const LOADER_KEY = 'yang-monograph-loader-v3'
type Collection = 'games' | 'apps'

export default function Loader() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)
  const [readyForLanguage, setReadyForLanguage] = useState(false)
  const [collection, setCollection] = useState<Collection>('games')
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(LOADER_KEY) === 'seen') {
      requestAnimationFrame(() => setVisible(false))
      return
    }

    const start = performance.now()
    const duration = 1400
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(progress * 100))
      frame = requestAnimationFrame(tick)
      if (progress >= 1) cancelAnimationFrame(frame)
    }

    frame = requestAnimationFrame(tick)

    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' })
      gsap
        .timeline()
        .to('.loader-enter', { opacity: 1, duration: 0.2 }, 1.2)
        .to('.loader-counter', { opacity: 0.25, duration: 0.35 }, 1.45)
        .to('.loader-language', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.65, ease: 'expo.out' }, 1.55)
        .call(() => setReadyForLanguage(true), undefined, 1.55)
    }, rootRef)

    return () => {
      cancelAnimationFrame(frame)
      ctx.revert()
    }
  }, [])

  const chooseLanguage = (language: Language) => {
    if (!rootRef.current || !readyForLanguage) return

    setLanguage(language)
    document.documentElement.lang = language
    sessionStorage.setItem(LOADER_KEY, 'seen')

    gsap
      .timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
          setVisible(false)
          router.push(collection === 'apps' ? '/projects/yinyang' : '/')
        },
      })
      .to('.loader-language', { opacity: 0, y: -24, pointerEvents: 'none', duration: 0.35 })
      .to(rootRef.current, { yPercent: -100, duration: 0.9 }, '-=0.05')
  }

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="monograph-loader mono flex flex-col justify-start gap-7 overflow-y-auto p-5 sm:p-8 md:justify-between md:p-12"
    >
      <div className="flex items-start justify-between gap-6 text-[10px] uppercase tracking-normal text-paper/70 md:text-[11px]">
        <span>Yang Studio Monograph</span>
        <span className="text-right">2026 Build Brief</span>
      </div>
      <div className="grid gap-5 md:gap-7">
        <div className="mb-1 h-px origin-left bg-paper md:mb-3" ref={lineRef} />
        <div className="flex items-end justify-between gap-6">
          <span className="font-serif text-[clamp(58px,16vw,160px)] leading-[0.86] tracking-normal text-paper">
            Y
          </span>
          <div className="loader-counter text-right">
            <p className="text-[clamp(46px,12vw,112px)] leading-none text-paper">{String(count).padStart(2, '0')}</p>
            <p className="loader-enter mt-3 text-accent opacity-0 md:mt-4">ENTER</p>
          </div>
        </div>
        <div className="loader-language pointer-events-none grid translate-y-8 gap-7 opacity-0">
          <div>
            <p className="text-[clamp(30px,10vw,72px)] font-serif leading-none text-paper">选择语言</p>
            <p className="mt-2 text-[clamp(20px,7vw,44px)] font-serif italic leading-none text-paper/60 md:mt-3">
              Select language
            </p>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase text-paper/50">选择分类 / Select collection</p>
            <div className="grid gap-3 sm:grid-cols-2">
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
                <span className="block text-[10px] uppercase opacity-60">YinYang</span>
                <span className="mt-1 block text-lg">App开发 / App Development</span>
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:max-w-xl">
            <button
              type="button"
              onClick={() => chooseLanguage('zh')}
              disabled={!readyForLanguage}
              className="focus-ring min-h-12 border border-paper px-6 py-3 text-left text-paper transition hover:border-accent hover:text-accent disabled:pointer-events-none md:px-8 md:py-4"
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => chooseLanguage('en')}
              disabled={!readyForLanguage}
              className="focus-ring min-h-12 border border-paper/35 px-6 py-3 text-left text-paper/70 transition hover:border-accent hover:text-accent disabled:pointer-events-none md:px-8 md:py-4"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
