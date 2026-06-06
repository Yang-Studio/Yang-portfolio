'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Tags, FlaskConical, Palette } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { projects as allProjects, type ProjectTag } from '@/content/projects'
import { projectTranslations } from '@/content/projectTranslations'

const TAGS = [
  { key: 'All', label: 'All', icon: Tags },
  { key: 'Technical', label: 'Technical', icon: FlaskConical },
  { key: 'Art', label: 'Visual / Art', icon: Palette },
  { key: 'Prototype', label: 'Prototype', icon: FlaskConical },
] as const

type TagKey = (typeof TAGS)[number]['key']

export default function FeaturedTriPanel() {
  const { t, language } = useLanguage()
  const [tag, setTag] = useState<TagKey>('All')
  const list = tag === 'All' ? allProjects : allProjects.filter((project) => project.tag === (tag as ProjectTag))
  const active = list[0] ?? allProjects[0]
  const activeTranslation = language === 'zh' ? projectTranslations[active.slug] : undefined

  return (
    <section className="home-section featured-section relative isolate grid grid-cols-12 items-start gap-4 overflow-hidden py-10">
      <div className="relative z-10 col-span-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="rounded-full bg-mist/60 px-4 py-1 text-lg uppercase tracking-[0.45em] text-slate/70">
            {t('Featured Work')}
          </span>
        </div>
      </div>

      <aside className="relative z-10 col-span-12 flex justify-center md:col-span-1">
        <ul className="glass flex w-max items-center gap-3 rounded-full bg-mist/60 p-3 backdrop-blur md:flex-col md:rounded-3xl md:p-4">
          {TAGS.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setTag(key)}
                className={`focus-ring flex h-14 w-14 items-center justify-center rounded-full transition ${
                  tag === key ? 'bg-coral text-slate shadow-soft' : 'bg-mist/40 text-slate/70 hover:bg-mist/70'
                }`}
              >
                <Icon size={22} className="text-current" />
                <span className="sr-only">{t(label)}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative z-10 col-span-12 md:col-span-8 xl:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[36px] shadow-soft ring-1 ring-white/30"
          >
            <Image
              src={active.cover}
              alt={active.title}
              width={1200}
              height={800}
              priority
              className="h-auto w-full min-h-[360px] object-cover xl:max-h-[680px]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 col-span-12 md:col-span-4">
        <AnimatePresence mode="wait">
          <motion.article
            key={active.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="glass flex h-full flex-col gap-5 rounded-3xl bg-sand/85 p-8 shadow-soft backdrop-blur"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-coral">{t(active.tag)}</span>
            <h3 className="font-display text-3xl font-semibold text-slate">
              {activeTranslation?.title ?? active.title}
            </h3>
            <p className="text-lg text-slate/80">{activeTranslation?.blurb ?? active.blurb}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full bg-mist/80 px-3 py-1 text-sm text-slate">
                {activeTranslation?.role ?? t(active.role)}
              </span>
              <span className="rounded-full bg-mist/80 px-3 py-1 text-sm text-slate">{t(active.tools)}</span>
              <span className="rounded-full bg-mist/80 px-3 py-1 text-sm text-slate">{active.year}</span>
            </div>
            <Link
              href={`/projects/${active.slug}`}
              className="focus-ring mt-auto w-max rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-sage"
            >
              {t('View case study')}
            </Link>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
