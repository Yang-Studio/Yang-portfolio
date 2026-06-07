import type { Project } from '@/content/projects/types'

export const appProjects: Project[] = [
  {
    slug: 'cheetah',
    tag: 'App Development',
    title: 'Cheetah',
    blurb:
      'A local-first personal finance companion that turns daily bookkeeping, budgets, savings goals, and planned payments into one focused mobile workflow.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'React / JavaScript / LocalStorage',
    cover: '/assets/projects/cheetah/cheetah-cover.webp',
    banner: '/assets/projects/cheetah/cheetah-cover.webp',
    moneyshot: '/assets/projects/cheetah/cheetah-cover.webp',
    demo: '/embedded-apps/cheetah/index.html',
    hideDownload: true,
    status: 'Interactive prototype',
    overview: {
      goal: 'Make personal finance tracking feel immediate and encouraging without requiring an account, a cloud service, or a complicated spreadsheet.',
      team: 'Solo product development',
      timeline: '2026',
    },
    process: [
      {
        title: 'Challenge',
        body: 'Combine transaction capture, account balances, budgets, goals, recurring payments, and trends without overwhelming a mobile interface.',
      },
      {
        title: 'Solution',
        body: 'Organize the product around four repeatable moments: check the current position, record activity, plan upcoming cash flow, and review patterns.',
      },
      {
        title: 'Result',
        body: 'A complete browser-based finance prototype with persistent local data, editable categories, account tools, planning workflows, and export options.',
      },
    ],
    technical: [
      {
        title: 'Local-first Ledger',
        description:
          'Transactions, accounts, categories, budgets, goals, and preferences persist in the browser. The prototype requires no sign-in and sends no financial data to a server.',
        media: '/assets/projects/cheetah/cheetah-cover.webp',
      },
      {
        title: 'Planning System',
        description:
          'Recurring payments, income allocation, category budgets, and savings goals share one planning surface with due-state handling and projected balance feedback.',
        media: '/assets/projects/cheetah/cheetah-planning.webp',
      },
      {
        title: 'Behavioral Feedback',
        description:
          'Spending composition, cash-flow metrics, trend charts, budget alerts, streaks, levels, and the Leo companion translate raw entries into readable feedback.',
        media: '/assets/projects/cheetah/cheetah-insights.webp',
      },
    ],
    results: {
      summary:
        'Delivered a responsive finance application prototype that covers the full loop from recording a transaction to reviewing trends and planning future cash flow.',
      highlights: ['No-account local storage', 'Integrated budgeting and recurring payments', 'Responsive interactive prototype'],
    },
  },
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
