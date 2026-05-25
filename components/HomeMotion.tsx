'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/motion'

export default function HomeMotion() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((section, index) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.03,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.to('.hero-watermark', {
        scale: 1.45,
        opacity: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.hero-scatter-word').forEach((word, index) => {
        gsap.to(word, {
          opacity: 0,
          x: (index % 2 === 0 ? 1 : -1) * (90 + index * 6),
          y: (index % 3 === 0 ? -1 : 1) * (60 + index * 4),
          rotate: index % 2 === 0 ? 12 : -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=70%',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
