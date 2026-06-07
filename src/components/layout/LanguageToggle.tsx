'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="focus-ring mono fixed bottom-4 right-4 z-[300] border border-rule bg-paper px-3 py-2 text-[11px] uppercase text-ink transition hover:border-accent hover:text-accent md:bottom-6 md:right-6 md:px-4"
      aria-label="Toggle language"
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
