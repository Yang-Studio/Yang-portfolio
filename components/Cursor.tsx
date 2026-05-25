'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    const move = (event: PointerEvent) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const updateState = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const cursorTarget = target?.closest<HTMLElement>('a, button, [data-cursor]')
      const state = cursorTarget?.dataset.cursor ?? (cursorTarget ? 'link' : 'default')
      const size = state === 'card' ? 96 : state === 'link' ? 32 : 0

      ring.textContent = state === 'card' ? 'OPEN' : ''
      gsap.to(ring, {
        width: size,
        height: size,
        lineHeight: `${size}px`,
        opacity: size ? 1 : 0,
        duration: 0.28,
        ease: 'power3.out',
      })
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', updateState)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', updateState)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
