import Hero from '@/components/Hero'
import HomeMotion from '@/components/HomeMotion'
import MonographAbout from '@/components/MonographAbout'
import SelectedWork from '@/components/SelectedWork'
import ToolsMarquee from '@/components/ToolsMarquee'

export default function Home() {
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
