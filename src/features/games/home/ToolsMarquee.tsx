'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import PlateLabel from '@/components/ui/PlateLabel'

const rowOne = [
  'Unity',
  'C#',
  'Behavior Trees',
  'Event Bus',
  'Shadergraph',
  'Git',
  'Perforce',
  'Jira',
  'Playtest',
  'State Machines',
]

const rowTwo = [
  'Blender',
  'Maya',
  'Figma',
  'After Effects',
  'Procreate',
  'Scriptable Objects',
  'Coroutines',
  'Timeline',
  'Cinemachine',
  'Post-Processing',
]

function MarqueeRow({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  const repeated = [...items, ...items]

  return (
    <div className="tool-marquee-wrap overflow-hidden border-y border-rule py-4 md:py-5">
      <div className="tool-marquee mono text-[clamp(20px,8vw,48px)] uppercase leading-none" data-direction={direction}>
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`} className="mx-3 whitespace-nowrap md:mx-5">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ToolsMarquee() {
  const { t } = useLanguage()

  return (
    <section className="monograph-section px-0">
      <div className="mx-auto mb-10 max-w-[1280px] px-5 sm:px-8 md:mb-16 md:px-16 lg:px-24">
        <PlateLabel plate={t('Plate 04')} label={t('Tools / Methods')} />
      </div>
      <MarqueeRow items={rowOne} direction="left" />
      <MarqueeRow items={rowTwo} direction="right" />
    </section>
  )
}
