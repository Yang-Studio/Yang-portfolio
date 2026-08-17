import type { Project, ProjectTranslation } from '@/content/database'

export type EditableContent = {
  title?: string
  blurb?: string
  role?: string
  overviewGoal?: string
  overviewTeam?: string
  overviewTimeline?: string
  process?: { title?: string; body?: string }[]
  technical?: { title?: string; description?: string }[]
  resultsSummary?: string
  resultsHighlights?: string[]
}

export type ImageOverride = {
  cover?: string
  banner?: string
  moneyshot?: string
  logo?: string
  technical?: (string | undefined)[]
}

export type LangOverride = { en?: EditableContent; zh?: EditableContent; images?: ImageOverride }
export type ContentOverrides = Record<string, LangOverride>

const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value : undefined

const cleanList = (value?: string[]): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const list = value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
  return list.length ? list : undefined
}

export function applyProjectOverride(project: Project, override?: LangOverride): Project {
  const en = override?.en
  const images = override?.images
  if (!en && !images) return project
  return {
    ...project,
    title: str(en?.title) ?? project.title,
    blurb: str(en?.blurb) ?? project.blurb,
    role: str(en?.role) ?? project.role,
    cover: str(images?.cover) ?? project.cover,
    banner: str(images?.banner) ?? project.banner,
    moneyshot: str(images?.moneyshot) ?? project.moneyshot,
    logo: str(images?.logo) ?? project.logo,
    overview: {
      ...project.overview,
      goal: str(en?.overviewGoal) ?? project.overview.goal,
      team: str(en?.overviewTeam) ?? project.overview.team,
      timeline: str(en?.overviewTimeline) ?? project.overview.timeline,
    },
    process: project.process.map((step, index) => ({
      ...step,
      title: str(en?.process?.[index]?.title) ?? step.title,
      body: str(en?.process?.[index]?.body) ?? step.body,
    })),
    technical: project.technical.map((item, index) => ({
      ...item,
      title: str(en?.technical?.[index]?.title) ?? item.title,
      description: str(en?.technical?.[index]?.description) ?? item.description,
      media: str(images?.technical?.[index]) ?? item.media,
    })),
    results: {
      ...project.results,
      summary: str(en?.resultsSummary) ?? project.results.summary,
      highlights: cleanList(en?.resultsHighlights) ?? project.results.highlights,
    },
  }
}

export function editableImagesFromProject(project: Project): ImageOverride {
  return {
    cover: project.cover,
    banner: project.banner,
    moneyshot: project.moneyshot,
    logo: project.logo,
    technical: project.technical.map((item) => item.media),
  }
}

export function applyTranslationOverride(
  base: ProjectTranslation | undefined,
  zh?: EditableContent,
): ProjectTranslation | undefined {
  if (!zh) return base

  const process =
    zh.process && zh.process.length
      ? zh.process.map((ov, index) => ({
          title: str(ov?.title) ?? base?.process?.[index]?.title ?? '',
          body: str(ov?.body) ?? base?.process?.[index]?.body ?? '',
        }))
      : base?.process

  const technical =
    zh.technical && zh.technical.length
      ? zh.technical.map((ov, index) => ({
          title: str(ov?.title) ?? base?.technical?.[index]?.title ?? '',
          description: str(ov?.description) ?? base?.technical?.[index]?.description ?? '',
        }))
      : base?.technical

  const summary = str(zh.resultsSummary) ?? base?.results?.summary
  const highlights = cleanList(zh.resultsHighlights) ?? base?.results?.highlights
  const results = summary || highlights ? { summary: summary ?? '', highlights: highlights ?? [] } : base?.results

  return {
    title: str(zh.title) ?? base?.title ?? '',
    blurb: str(zh.blurb) ?? base?.blurb ?? '',
    overviewGoal: str(zh.overviewGoal) ?? base?.overviewGoal ?? '',
    role: str(zh.role) ?? base?.role,
    overviewTeam: str(zh.overviewTeam) ?? base?.overviewTeam,
    overviewTimeline: str(zh.overviewTimeline) ?? base?.overviewTimeline,
    process,
    technical,
    results,
  }
}

export function editableFromProject(project: Project): EditableContent {
  return {
    title: project.title,
    blurb: project.blurb,
    role: project.role,
    overviewGoal: project.overview.goal,
    overviewTeam: project.overview.team,
    overviewTimeline: project.overview.timeline,
    process: project.process.map((step) => ({ title: step.title, body: step.body })),
    technical: project.technical.map((item) => ({ title: item.title, description: item.description })),
    resultsSummary: project.results.summary,
    resultsHighlights: project.results.highlights,
  }
}

export function editableFromTranslation(
  base: ProjectTranslation | undefined,
  fallback: EditableContent,
): EditableContent {
  return {
    title: base?.title ?? fallback.title,
    blurb: base?.blurb ?? fallback.blurb,
    role: base?.role ?? fallback.role,
    overviewGoal: base?.overviewGoal ?? fallback.overviewGoal,
    overviewTeam: base?.overviewTeam ?? fallback.overviewTeam,
    overviewTimeline: base?.overviewTimeline ?? fallback.overviewTimeline,
    process: (fallback.process ?? []).map((step, index) => ({
      title: base?.process?.[index]?.title ?? step.title,
      body: base?.process?.[index]?.body ?? step.body,
    })),
    technical: (fallback.technical ?? []).map((item, index) => ({
      title: base?.technical?.[index]?.title ?? item.title,
      description: base?.technical?.[index]?.description ?? item.description,
    })),
    resultsSummary: base?.results?.summary ?? fallback.resultsSummary,
    resultsHighlights: base?.results?.highlights ?? fallback.resultsHighlights,
  }
}
