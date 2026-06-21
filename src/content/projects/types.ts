export type ProjectTag = 'Game' | 'Technical' | 'Art' | 'Prototype' | 'App Development'

export type ProjectProcess = {
  title: string
  body: string
}

export type ProjectTechnical = {
  title: string
  description: string
  media: string
}

export type Project = {
  slug: string
  tag: ProjectTag
  title: string
  blurb: string
  year: string
  role: string
  tools: string
  cover: string
  banner: string
  logo?: string
  moneyshot?: string
  download?: string
  hideDownload?: boolean
  hidden?: boolean
  reel?: string
  demo?: string
  status?: string
  overview: {
    goal: string
    team: string
    timeline: string
  }
  process: ProjectProcess[]
  technical: ProjectTechnical[]
  results: {
    summary: string
    highlights: string[]
    media?: string
  }
}
