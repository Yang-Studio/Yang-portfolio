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
    title: 'YinYang',
    blurb:
      'A modern, auditable BaZi dashboard: accurate calendar math, transparent rules, and a confidence level on every reading — built as a data product, not a fortune-telling app.',
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
      goal: 'Traditional charting sites are dated, overloaded with jargon, and present uncertain inferences as fixed conclusions. YinYang keeps an Eastern character but rebuilds BaZi with the calm of a modern data product.',
      team: 'Independent product',
      timeline: 'v1.0 · 2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Conventional BaZi tools are cluttered and jargon-heavy, and present black-box conclusions that hide how they were produced.',
      },
      {
        title: 'Approach',
        body: 'Reframe the chart as structured data analysis with a calm, modern interface — information first, with calculation kept separate from interpretation.',
      },
      {
        title: 'Trust',
        body: 'Every conclusion shows its rule basis, classical source, and a confidence level, and the whole engine runs offline with no backend.',
      },
    ],
    technical: [
      {
        title: 'Accurate Charting',
        description:
          'Four pillars from lunar-javascript by true solar-term boundaries, with lunar leap-month conversion and optional true-solar-time correction.',
        media: '/assets/projects/yinyang/yinyang-chart.webp',
      },
      {
        title: 'Five-Element Structure',
        description:
          'Stems and hidden stems are weighted and normalised to exactly 100, then shown as animated bars and a radar.',
        media: '/assets/projects/yinyang/yinyang-poster.webp',
      },
      {
        title: 'Auditable Interpretation',
        description:
          'Day-master strength, favourable elements, and structure are deterministic functions, each with its basis and confidence.',
        media: '/assets/projects/yinyang/yinyang-analysis.webp',
      },
      {
        title: 'Inference with Basis',
        description:
          'Career, wealth, relationships, study, health, and timing each carry a stated basis; health is flagged as non-medical.',
        media: '/assets/projects/yinyang/yinyang-analysis.webp',
      },
      {
        title: 'Interactive & Embeddable',
        description:
          'A daily outlook, two-person compatibility, and a share poster; it runs from localStorage with no account and embeds via a postMessage SDK.',
        media: '/assets/projects/yinyang/yinyang-today.webp',
      },
    ],
    results: {
      summary:
        'A dense chart becomes a calm, readable product — without blurring the line between calculation and interpretation. Every claim traces to a rule and a source.',
      highlights: ['Astronomical-grade calendar math', 'Readings with basis & confidence', 'Offline, embeddable, no account'],
    },
  },
  {
    slug: 'lote',
    tag: 'App Development',
    title: 'Lote',
    blurb:
      'A local-first Markdown notes and infinite-canvas desktop app (Obsidian-style): notes are plain .md / .canvas files in your own folder or NAS — fully offline, no account, no lock-in.',
    year: '2026',
    role: 'Independent Developer',
    tools: 'Electron · Vanilla JS · D3 · Canvas',
    cover: '/assets/projects/lote/lote-editor.webp',
    banner: '/assets/projects/lote/lote-home.webp',
    moneyshot: '/assets/projects/lote/lote-graph.webp',
    download: '/downloads/Lote.exe',
    status: 'Desktop app (v3.0)',
    overview: {
      goal: 'Keep writing, linking, and visual organisation in one desktop app, while the notes stay as portable plain-text files you fully own.',
      team: 'Independent product',
      timeline: 'v3.0 · 2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Cloud note apps lock data into proprietary formats and servers, while powerful local tools often need heavy plugin setup to reach the same features.',
      },
      {
        title: 'Approach',
        body: 'Bundle backlinks, graph, canvas, kanban, and database views out of the box, on top of plain .md / .canvas files in a folder you choose — local-first and offline.',
      },
      {
        title: 'Working Build',
        body: 'An Electron desktop app shipped as a single portable Windows exe; it reads and writes a local or NAS folder directly, with manual backup sync.',
      },
    ],
    technical: [
      {
        title: 'Plain-text, Local-first Storage',
        description:
          'Notes are standard Markdown and .canvas JSON in a folder you choose — local disk or a NAS share — so the file system is the database and nothing is locked to the cloud.',
        media: '/assets/projects/lote/lote-home.webp',
      },
      {
        title: 'Bidirectional Links & Graph',
        description:
          'Each note is parsed for [[links]] to build backlinks and a D3 force-directed graph, with first-line renaming rewriting every link that points to it.',
        media: '/assets/projects/lote/lote-graph.webp',
      },
      {
        title: 'Database & Board Views',
        description:
          'The same notes surface as a sortable database table, kanban board, calendar, and outline, reading tags and frontmatter without leaving plain text.',
        media: '/assets/projects/lote/lote-database.webp',
      },
      {
        title: 'Search, Web Clips & Lifecycle',
        description:
          'Full-text, tag:, path:, regex, and fuzzy search, plus saved web clips, a trash bin, and a per-note lifecycle that turns scratch ideas into finished notes.',
        media: '/assets/projects/lote/lote-webclip.webp',
      },
    ],
    results: {
      summary:
        'Lote brings writing, linking, and visual organisation into one offline desktop app, with notes that stay portable plain text under the user’s control.',
      highlights: ['Plain-text, local-first', 'Backlinks, graph & canvas built in', 'Single portable Windows exe'],
    },
  },
]
