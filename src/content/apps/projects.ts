import type { Project } from '@/content/projects/types'

export const appProjects: Project[] = [
  {
    slug: 'cheetah',
    tag: 'App Development',
    title: 'Cheetah',
    blurb:
      'Leo Ledger — a fully local, privacy-first money tracker with a cheetah companion, built to log a transaction in seconds and read your finances at a glance.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'React · esbuild · localStorage',
    cover: '/assets/projects/cheetah/cheetah-cover.webp',
    banner: '/assets/projects/cheetah/cheetah-cover.webp',
    moneyshot: '/assets/projects/cheetah/cheetah-cover.webp',
    demo: '/embedded-apps/cheetah/index.html',
    hideDownload: true,
    status: 'Working web app (v1.0)',
    overview: {
      goal: 'Can accounting stay a habit without an account, the cloud, or friction? Leo Ledger targets a transaction in three seconds and a clear monthly picture in thirty — kept entirely on-device.',
      team: 'Independent product',
      timeline: '2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'People drop budgeting apps that are slow to log, demand a cloud account, or bury structure under dense screens.',
      },
      {
        title: 'Approach',
        body: 'A Robinhood-style dark interface around four tabs and a floating add button, with Leo the cheetah turning consistency into a game.',
      },
      {
        title: 'Working Build',
        body: 'A single-file React + esbuild app on localStorage: multi-account wallets, expense/income/transfer, a category tree, budgets, planned payments, goals, and exports.',
      },
    ],
    technical: [
      {
        title: 'Local-first & Private',
        description:
          'No backend and no account; data lives in localStorage and the whole app embeds in one file, with CSV export and JSON backup/restore.',
        media: '/assets/projects/cheetah/cheetah-cover.webp',
      },
      {
        title: 'One Planning Model',
        description:
          'Budgets, ratio-based income allocation, savings goals, and recurring payments share one model; due bills auto-post on the date and roll to the next period.',
        media: '/assets/projects/cheetah/cheetah-planning.webp',
      },
      {
        title: 'Insights & Leo Growth',
        description:
          'Category breakdowns, six-month trends, and cash flow sit beside Leo’s mood, level, streaks, and achievements that reward sticking with it.',
        media: '/assets/projects/cheetah/cheetah-insights.webp',
      },
    ],
    results: {
      summary:
        'Leo Ledger covers the full loop — log, plan, review — entirely on-device, with a mascot that keeps the habit going.',
      highlights: ['Fully local, no account', 'One connected planning model', 'Gamified habit with Leo'],
    },
  },
  {
    slug: 'yinyang',
    tag: 'App Development',
    title: 'Tianji Pavilion',
    blurb:
      'Tianji Pavilion is a privacy-first traditional calendar and BaZi analysis web app: precise solar-term charting, visible rule logic, and readable outputs that stay on-device.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'Vanilla JS · lunar-javascript · SVG / Canvas',
    cover: '/assets/projects/yinyang/yinyang-chart.webp',
    banner: '/assets/projects/yinyang/yinyang-home.webp',
    moneyshot: '/assets/projects/yinyang/yinyang-poster.webp',
    demo: '/embedded-apps/yinyang/index.html',
    hideDownload: true,
    status: 'Working web app (v1.0)',
    overview: {
      goal: 'Most traditional charting tools feel either like dense lookup tables or black-box fortune telling. Tianji Pavilion reframes BaZi as a transparent data interface: calendar calculation first, interpretation second, with every sensitive interaction kept local.',
      team: 'Independent product',
      timeline: 'v1.0 · 2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Conventional BaZi tools are cluttered, jargon-heavy, and often hide the calculation path behind fixed conclusions.',
      },
      {
        title: 'Approach',
        body: 'Rebuild the chart as a structured product interface: birth data, calendar conversion, five-element structure, and interpretation are separated into clear layers.',
      },
      {
        title: 'Trust',
        body: 'The web app runs without accounts or a backend; readings explain their basis and keep user data inside the browser.',
      },
    ],
    technical: [
      {
        title: 'Accurate Charting',
        description:
          'Four pillars are calculated from solar-term boundaries, with lunar leap-month conversion and optional true-solar-time correction.',
        media: '/assets/projects/yinyang/yinyang-chart.webp',
      },
      {
        title: 'Five-Element Structure',
        description:
          'Heavenly stems, earthly branches, and hidden stems are converted into a normalized five-element structure, then shown through bars and radar charts.',
        media: '/assets/projects/yinyang/yinyang-poster.webp',
      },
      {
        title: 'Auditable Interpretation',
        description:
          'Day-master strength, favourable elements, and structural notes are generated from explicit rules instead of opaque text templates.',
        media: '/assets/projects/yinyang/yinyang-analysis.webp',
      },
      {
        title: 'Inference with Basis',
        description:
          'Career, wealth, relationships, study, health, and timing sections each state their reasoning limits; health content is clearly non-medical.',
        media: '/assets/projects/yinyang/yinyang-analysis.webp',
      },
      {
        title: 'Interactive & Embeddable',
        description:
          'The app supports daily outlooks, compatibility checks, history, preferences, share posters, and iframe embedding through a postMessage host API.',
        media: '/assets/projects/yinyang/yinyang-today.webp',
      },
    ],
    results: {
      summary:
        'Tianji Pavilion turns a dense traditional chart into a usable web product: calculation is transparent, interpretation is bounded, and private data stays local.',
      highlights: ['Precise solar-term charting', 'Transparent rule-based analysis', 'Offline-friendly, embeddable, no account'],
    },
  },
  {
    slug: 'lote',
    tag: 'App Development',
    title: 'Lote',
    blurb:
      'A local-first Markdown knowledge workspace for Windows: open any folder as a vault, write plain .md notes, connect ideas with backlinks, graph, canvas, kanban, calendar tasks, and NAS backup sync.',
    year: '2026',
    role: 'Product Designer / Electron Developer',
    tools: 'Electron · Vanilla JS · D3 · CodeMirror · Mermaid · KaTeX',
    cover: '/assets/projects/lote/lote-editor.webp',
    banner: '/assets/projects/lote/lote-home.webp',
    moneyshot: '/assets/projects/lote/lote-graph.webp',
    download: '/downloads/Lote.exe',
    status: 'Windows desktop app (v3.0)',
    overview: {
      goal: 'Turn a normal folder into a private writing and knowledge-management workspace, without accounts, cloud lock-in, or a database that hides the user’s files.',
      team: 'Independent product',
      timeline: 'v3.0 · 2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Most polished note apps push users toward accounts, proprietary sync, or opaque databases; local-first tools often require a long plugin setup before they feel complete.',
      },
      {
        title: 'Approach',
        body: 'Build the core knowledge workflow into one desktop shell: file tree, Markdown editor, live preview, backlinks, tags, graph, database table, daily notes, kanban, canvas, templates, and export.',
      },
      {
        title: 'Working Build',
        body: 'The current Electron build opens a local or NAS folder directly through the file system, saves notes as standard files, and ships as a Windows desktop app.',
      },
    ],
    technical: [
      {
        title: 'Folder-based Local Storage',
        description:
          'Lote reads and writes the folder the user chooses. Markdown notes, attachments, canvas files, and kanban boards stay visible on disk, so the file system remains the source of truth.',
        media: '/assets/projects/lote/lote-home.webp',
      },
      {
        title: 'Backlinks, Tags & Graph',
        description:
          'The app parses [[links]], #tags, frontmatter, headings, and outgoing references to build backlinks, outline views, global/local D3 graph maps, and quick navigation.',
        media: '/assets/projects/lote/lote-graph.webp',
      },
      {
        title: 'Database, Calendar & Kanban',
        description:
          'The same notes can be viewed as a database table, daily-note calendar, task list, or Trello-style kanban board, with the board state still stored as Markdown.',
        media: '/assets/projects/lote/lote-database.webp',
      },
      {
        title: 'Export, History & NAS Sync',
        description:
          'Full-text search, web clips, note lifecycle states, local version history, PDF/PNG/JPG export, ZIP import/export, and manual local-to-NAS backup sync are built in.',
        media: '/assets/projects/lote/lote-webclip.webp',
      },
    ],
    results: {
      summary:
        'Lote packages a personal knowledge workspace into a local Windows app while keeping the user’s notes portable, inspectable, and independent from any hosted service.',
      highlights: ['Folder-based local vaults', 'Backlinks, graph, canvas & kanban', 'NAS backup sync and export tools'],
    },
  },
]
