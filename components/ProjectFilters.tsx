'use client'

import { LayoutGroup, motion } from 'framer-motion'
import { Tags, Gamepad2, FlaskConical, Palette, Sparkles } from 'lucide-react'
import type { ProjectTag } from '@/content/projects'

export type FilterKey = 'All' | ProjectTag

const FILTERS: Array<{ key: FilterKey; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { key: 'All', label: 'All Projects', icon: Tags },
  { key: 'Game', label: 'Game', icon: Gamepad2 },
  { key: 'Technical', label: 'Technical', icon: FlaskConical },
  { key: 'Art', label: 'Art', icon: Palette },
  { key: 'Prototype', label: 'Prototype', icon: Sparkles },
]

type Props = {
  active: FilterKey
  onChange: (value: FilterKey) => void
}

export default function ProjectFilters({ active, onChange }: Props) {
  return (
    <LayoutGroup id="project-filters">
      <div className="relative inline-flex flex-wrap gap-3 rounded-full bg-mist/40 p-2">
        <span className="sr-only">Filter projects by tag</span>
        {FILTERS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`group focus-ring relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-slate' : 'text-slate/70 hover:text-slate'
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="filter-highlight"
                  className="absolute inset-0 -z-10 rounded-full border border-coral bg-coral shadow-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              ) : null}
              {!isActive ? (
                <span className="absolute inset-0 -z-10 rounded-full border border-transparent bg-transparent transition-colors duration-200 group-hover:bg-mist/70" />
              ) : null}
              <span className="relative flex items-center gap-2">
                <Icon size={16} />
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
