'use client'

import Lenis, { type LenisOptions } from '@studio-freight/lenis'

export const createLenis = (options?: LenisOptions) =>
  new Lenis({
    smoothWheel: true,
    duration: 1.2,
    ...options,
  })

export type LenisInstance = ReturnType<typeof createLenis>
