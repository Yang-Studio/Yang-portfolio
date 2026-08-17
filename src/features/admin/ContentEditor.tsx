'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { getProjectEntry, projects } from '@/content/database'
import {
  editableFromProject,
  editableFromTranslation,
  editableImagesFromProject,
  type ContentOverrides,
  type EditableContent,
  type ImageOverride,
} from '@/lib/content/overrides'

type Lang = 'en' | 'zh'
type Form = { en: EditableContent; zh: EditableContent; images: ImageOverride }

function baseFor(slug: string): Form {
  const entry = getProjectEntry(slug)!
  const project = entry.project
  const en = editableFromProject(project)
  const zh = editableFromTranslation(entry.translation, en)
  const images = editableImagesFromProject(project)
  return { en, zh, images }
}

function mergeForm(slug: string, overrides: ContentOverrides): Form {
  const base = baseFor(slug)
  const ov = overrides[slug]
  return {
    en: { ...base.en, ...(ov?.en ?? {}) },
    zh: { ...base.zh, ...(ov?.zh ?? {}) },
    images: { ...base.images, ...(ov?.images ?? {}) },
  }
}

const inputClass =
  'mt-1 w-full rounded border border-paper/20 bg-ink px-3 py-2 text-sm text-paper focus:border-accent focus:outline-none'

export default function ContentEditor({ initialOverrides }: { initialOverrides: ContentOverrides }) {
  const router = useRouter()
  const [overrides, setOverrides] = useState<ContentOverrides>(initialOverrides)
  const [slug, setSlug] = useState(projects[0].slug)
  const [lang, setLang] = useState<Lang>('zh')
  const [form, setForm] = useState<Form>(() => mergeForm(projects[0].slug, initialOverrides))
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const current = form[lang]
  const edited = useMemo(() => Boolean(overrides[slug]?.en || overrides[slug]?.zh), [overrides, slug])

  const selectProject = (next: string) => {
    setSlug(next)
    setForm(mergeForm(next, overrides))
    setStatus('')
  }

  const setField = (key: keyof EditableContent, value: string) => {
    setForm((f) => ({ ...f, [lang]: { ...f[lang], [key]: value } }))
  }
  const setListField = (key: 'resultsHighlights', value: string) => {
    setForm((f) => ({ ...f, [lang]: { ...f[lang], [key]: value.split('\n') } }))
  }
  const setProcess = (index: number, key: 'title' | 'body', value: string) => {
    setForm((f) => {
      const arr = [...(f[lang].process ?? [])]
      arr[index] = { ...arr[index], [key]: value }
      return { ...f, [lang]: { ...f[lang], process: arr } }
    })
  }
  const setTechnical = (index: number, key: 'title' | 'description', value: string) => {
    setForm((f) => {
      const arr = [...(f[lang].technical ?? [])]
      arr[index] = { ...arr[index], [key]: value }
      return { ...f, [lang]: { ...f[lang], technical: arr } }
    })
  }
  const setImage = (key: 'cover' | 'banner' | 'moneyshot' | 'logo', value: string) => {
    setForm((f) => ({ ...f, images: { ...f.images, [key]: value } }))
  }
  const setTechMedia = (index: number, value: string) => {
    setForm((f) => {
      const arr = [...(f.images.technical ?? [])]
      arr[index] = value
      return { ...f, images: { ...f.images, technical: arr } }
    })
  }

  const save = async () => {
    setSaving(true)
    setStatus('保存中…')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, en: form.en, zh: form.zh, images: form.images }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || '保存失败')
      setOverrides((prev) => ({ ...prev, [slug]: { en: form.en, zh: form.zh, images: form.images } }))
      router.refresh()
      setStatus('已保存并同步。打开对应项目页面即可看到更新。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = async () => {
    setSaving(true)
    setStatus('恢复中…')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, en: {}, zh: {}, images: {} }),
      })
      if (!res.ok) throw new Error('恢复失败')
      const next = { ...overrides }
      delete next[slug]
      setOverrides(next)
      setForm(baseFor(slug))
      setStatus('已恢复为默认文本。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '恢复失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-8 text-paper sm:px-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <header className="flex flex-col gap-4 border-b border-paper/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-accent">Yang Studio / Admin</p>
            <h1 className="mt-2 text-4xl">项目文本编辑</h1>
            <p className="mt-3 max-w-2xl text-sm text-paper/60">
              编辑后保存即对所有访客生效。留空的字段会回退到代码中的默认文本。
            </p>
          </div>
          <Link href="/admin" className="mono border border-paper/30 px-4 py-2 text-xs text-paper/70 hover:text-accent">
            ← 返回统计
          </Link>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-[260px_1fr]">
          <select value={slug} onChange={(e) => selectProject(e.target.value)} className={inputClass}>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} ({p.slug})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {(['zh', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`mono border px-4 py-2 text-xs ${
                  lang === l ? 'border-accent bg-accent/10 text-accent' : 'border-paper/25 text-paper/65'
                }`}
              >
                {l === 'zh' ? '中文' : 'English'}
              </button>
            ))}
            {edited ? <span className="mono text-[10px] uppercase text-accent">已自定义</span> : null}
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <Field label="标题 Title" value={current.title ?? ''} onChange={(v) => setField('title', v)} />
          <Field label="简介 Blurb" value={current.blurb ?? ''} onChange={(v) => setField('blurb', v)} textarea />
          <Field label="角色 Role" value={current.role ?? ''} onChange={(v) => setField('role', v)} />
          <Field label="概述 · 目标" value={current.overviewGoal ?? ''} onChange={(v) => setField('overviewGoal', v)} textarea />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="概述 · 团队" value={current.overviewTeam ?? ''} onChange={(v) => setField('overviewTeam', v)} />
            <Field label="概述 · 周期" value={current.overviewTimeline ?? ''} onChange={(v) => setField('overviewTimeline', v)} />
          </div>

          {(current.process ?? []).map((step, i) => (
            <div key={`p${i}`} className="rounded border border-paper/15 p-4">
              <p className="mono mb-3 text-[10px] uppercase text-accent">Process {i + 1}</p>
              <Field label="标题" value={step.title ?? ''} onChange={(v) => setProcess(i, 'title', v)} />
              <div className="mt-3">
                <Field label="正文" value={step.body ?? ''} onChange={(v) => setProcess(i, 'body', v)} textarea />
              </div>
            </div>
          ))}

          {(current.technical ?? []).map((item, i) => (
            <div key={`t${i}`} className="rounded border border-paper/15 p-4">
              <p className="mono mb-3 text-[10px] uppercase text-accent">Technical {i + 1}</p>
              <Field label="标题" value={item.title ?? ''} onChange={(v) => setTechnical(i, 'title', v)} />
              <div className="mt-3">
                <Field label="描述" value={item.description ?? ''} onChange={(v) => setTechnical(i, 'description', v)} textarea />
              </div>
            </div>
          ))}

          <Field
            label="结论 · 摘要"
            value={current.resultsSummary ?? ''}
            onChange={(v) => setField('resultsSummary', v)}
            textarea
          />
          <Field
            label="结论 · 要点（每行一条）"
            value={(current.resultsHighlights ?? []).join('\n')}
            onChange={(v) => setListField('resultsHighlights', v)}
            textarea
          />
        </div>

        <div className="mt-8 rounded border border-paper/15 p-4">
          <p className="mono mb-4 text-[10px] uppercase tracking-[0.16em] text-accent">图片 / Media（不分语言，填入资源路径或 URL）</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="封面 cover" value={form.images.cover ?? ''} onChange={(v) => setImage('cover', v)} />
            <Field label="大图 banner" value={form.images.banner ?? ''} onChange={(v) => setImage('banner', v)} />
            <Field label="结尾大图 moneyshot" value={form.images.moneyshot ?? ''} onChange={(v) => setImage('moneyshot', v)} />
            <Field label="logo（可空）" value={form.images.logo ?? ''} onChange={(v) => setImage('logo', v)} />
          </div>
          {(form.images.technical ?? []).map((media, i) => (
            <div key={`m${i}`} className="mt-4">
              <Field label={`技术点 ${i + 1} 配图 media`} value={media ?? ''} onChange={(v) => setTechMedia(i, v)} />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-4 border-t border-paper/20 bg-ink/95 py-4 backdrop-blur">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="border border-accent bg-accent px-5 py-2 text-sm text-ink disabled:opacity-50"
          >
            保存
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            disabled={saving}
            className="mono border border-paper/30 px-4 py-2 text-xs text-paper/70 disabled:opacity-50"
          >
            恢复默认
          </button>
          {status ? <span className="text-sm text-paper/70">{status}</span> : null}
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  textarea?: boolean
}) {
  return (
    <label className="block">
      <span className="mono text-[10px] uppercase tracking-[0.16em] text-paper/45">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
    </label>
  )
}
