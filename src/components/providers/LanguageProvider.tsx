'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { siteDictionary } from '@/content/database'

export type Language = 'en' | 'zh'

type LanguageContextValue = {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'yang-language-v2'

const DICTIONARY = siteDictionary

const pseudoTranslate = (text: string, language: Language) => {
  if (language === 'en') return text
  const trimmed = text.trim()
  if (DICTIONARY[trimmed]) return DICTIONARY[trimmed]
  return text
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Language | null) : null
    if (stored) {
      requestAnimationFrame(() => {
        setLanguage(stored)
        document.documentElement.lang = stored
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'zh' : 'en'))
  }

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
      t: (text: string) => pseudoTranslate(text, language),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
