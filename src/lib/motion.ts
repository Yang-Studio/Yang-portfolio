'use client'

import { gsap } from 'gsap'
import { ScrollTrigger, Flip } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger, Flip)

export const float = (selector: string) => {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el, index) => {
    gsap.to(el, {
      y: '+=10',
      repeat: -1,
      yoyo: true,
      duration: 2 + index * 0.2,
      ease: 'sine.inOut',
    })
  })
}

export { gsap, ScrollTrigger, Flip }
