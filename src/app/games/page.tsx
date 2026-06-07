import type { Metadata } from 'next'
import Hero from '@/features/games/home/Hero'
import HomeMotion from '@/features/games/home/HomeMotion'
import MonographAbout from '@/features/games/home/MonographAbout'
import SelectedWork from '@/features/games/home/SelectedWork'
import ToolsMarquee from '@/features/games/home/ToolsMarquee'

export const metadata: Metadata = {
  title: 'Game Development -- Yang Studio',
  description: 'Game systems, gameplay engineering, prototypes, and selected production work by Yang Liu.',
}

export default function GamesPage() {
  return (
    <>
      <HomeMotion />
      <Hero />
      <SelectedWork />
      <MonographAbout />
      <ToolsMarquee />
    </>
  )
}
