'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ContentOverrides } from '@/lib/content/overrides'

const ContentOverridesContext = createContext<ContentOverrides>({})

export function ContentOverridesProvider({ value, children }: { value: ContentOverrides; children: ReactNode }) {
  return <ContentOverridesContext.Provider value={value}>{children}</ContentOverridesContext.Provider>
}

export function useContentOverrides() {
  return useContext(ContentOverridesContext)
}
