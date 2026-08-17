import type { Metadata } from 'next'
import Hero from '@/features/games/home/Hero'
import HomeMotion from '@/features/games/home/HomeMotion'
import MonographAbout from '@/features/games/home/MonographAbout'
import SelectedWork from '@/features/games/home/SelectedWork'
import ToolsMarquee from '@/features/games/home/ToolsMarquee'
import { siteContent } from '@/content/database'

export const metadata: Metadata = siteContent.seo.games

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
