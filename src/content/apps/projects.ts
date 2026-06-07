import type { Project } from '@/content/projects/types'

export const appProjects: Project[] = [
  {
    slug: 'yinyang',
    tag: 'App Development',
    title: 'YinYang',
    blurb:
      'A modern BaZi data dashboard combining deterministic local chart calculation, structured interpretation, and privacy-conscious AI synthesis.',
    year: '2026',
    role: 'Full-stack App Developer',
    tools: 'JavaScript · Node.js · OpenAI API',
    cover: '/assets/projects/yinyang/yinyang-cover.webp',
    banner: '/assets/projects/yinyang/yinyang-cover.webp',
    moneyshot: '/assets/projects/yinyang/yinyang-cover.webp',
    demo: '/embedded-apps/yinyang/index.html',
    hideDownload: true,
    status: 'Live web app',
    overview: {
      goal: 'Turn a dense traditional BaZi chart into a clear, responsive data product without mixing deterministic calculation with generative interpretation.',
      team: 'Solo app development',
      timeline: '2026',
    },
    process: [
      {
        title: 'Challenge',
        body: 'Present a large amount of calendrical and symbolic data clearly while keeping every calculated value traceable.',
      },
      {
        title: 'Solution',
        body: 'Separate the local calculation engine, rule-based analysis, interface rendering, and optional AI synthesis into distinct layers.',
      },
      {
        title: 'Result',
        body: 'A responsive web app that produces complete charts locally and lets users request a structured AI reading only when needed.',
      },
    ],
    technical: [
      {
        title: 'Deterministic Chart Engine',
        description:
          'Calculates pillars, five elements, ten gods, hidden stems, twelve growth stages, luck cycles, and annual timing in the browser with lunar-javascript.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
      {
        title: 'Privacy-conscious AI Layer',
        description:
          'Only calculated chart data and the selected birth date, time, and gender are sent for synthesis; name and birthplace stay out of the AI request.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
      {
        title: 'Embeddable App Architecture',
        description:
          'Supports standalone and iframe modes, URL-driven setup, responsive height messaging, light and dark themes, and host-page event callbacks.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
    ],
    results: {
      summary:
        'Delivered a deployable BaZi application with local calculation, structured analysis, optional AI synthesis, and a reusable embed interface.',
      highlights: ['Local-first calculation', 'Structured AI output', 'Responsive standalone and embed modes'],
    },
  },
]
