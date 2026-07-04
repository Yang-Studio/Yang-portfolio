import type { Project } from '@/content/projects/types'

export const appProjects: Project[] = [
  {
    slug: 'cheetah',
    tag: 'App Development',
    title: 'Cheetah',
    blurb:
      'A local-first budgeting prototype (Electron + React): log spending in seconds and read your monthly finances at a glance — data stays on-device, no account, no server.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'React (UMD) · Electron · localStorage',
    cover: '/assets/projects/cheetah/cheetah-dashboard.webp',
    banner: '/assets/projects/cheetah/cheetah-promo.webp',
    moneyshot: '/assets/projects/cheetah/cheetah-stats.webp',
    demo: '/embedded-apps/cheetah/index.html',
    hideDownload: true,
    status: 'Working prototype',
    overview: {
      goal: 'Can a budgeting app stay fast and private without an account or a server? Cheetah keeps everything in local storage and turns each entry into an updated dashboard, budget, and stats view.',
      team: 'Independent product',
      timeline: '2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Most budgeting tools need a cloud account and split recording, planning, and review across disconnected screens.',
      },
      {
        title: 'Approach',
        body: 'Five focused sections — dashboard, add-entry, budget, stats, settings — over one local data model, so every entry immediately updates balances, budgets, and charts.',
      },
      {
        title: 'Working Build',
        body: 'An Electron + React (UMD) prototype on localStorage: multi-account expense / income / transfer, category budgets, six-month stats, and CSV / JSON export.',
      },
    ],
    technical: [
      {
        title: 'Local-first, No Server',
        description:
          'Data lives in localStorage with no backend or account; the same build runs as a desktop app or embeds in the browser.',
        media: '/assets/projects/cheetah/cheetah-settings.webp',
      },
      {
        title: 'One Connected Model',
        description:
          'Adding an expense, income, or transfer updates account balances, budget consumption, and the dashboard in a single pass.',
        media: '/assets/projects/cheetah/cheetah-add.webp',
      },
      {
        title: 'Budgets, Stats & Export',
        description:
          'Category budget caps with progress, a six-month income / expense comparison and spending ranking, plus CSV / JSON export and restorable demo data.',
        media: '/assets/projects/cheetah/cheetah-budget.webp',
      },
    ],
    results: {
      summary:
        'Cheetah covers the full budgeting loop — capture, plan, review — entirely on-device, as a fast local-first prototype.',
      highlights: ['Local-first, no account', 'One connected data model', 'CSV / JSON export'],
    },
  },
  {
    slug: 'yinyang',
    tag: 'App Development',
    title: 'YinYang',
    blurb:
      'YinYang / 天機閣 (Tianji Pavilion) — an atmospheric, dark-gold BaZi reading deck built on real astronomical calculation: rule-based, source-cited, and framed as cultural reference, not prediction.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'Vanilla JS · lunar-javascript · SVG / Canvas',
    cover: '/assets/projects/yinyang/yinyang-natal.webp',
    banner: '/assets/projects/yinyang/yinyang-promo.webp',
    moneyshot: '/assets/projects/yinyang/yinyang-daily.webp',
    demo: '/embedded-apps/yinyang/index.html',
    hideDownload: true,
    status: 'Working web app (v1.0)',
    overview: {
      goal: 'Traditional charting sites are either dated and mystical or clinical like a spreadsheet. 天機閣 keeps a rigorous, deterministic engine but presents it as a calm, atmospheric reading deck — observe the heavens, read the energy, move with it.',
      team: 'Independent product',
      timeline: 'v1.0 · 2026',
    },
    process: [
      {
        title: 'Problem',
        body: 'Charting tools force a choice between dated mysticism and a cold data table; neither feels considered or trustworthy.',
      },
      {
        title: 'Approach',
        body: 'Keep a deterministic, source-cited engine, but wrap it in 天機閣 — a dark-gold deck organised around the life palace, the daily fortune index, and trends.',
      },
      {
        title: 'Working Build',
        body: 'A pure front-end app that runs offline; the same BaZi engine drives the Tianji Pavilion dashboard and a clean, embeddable view.',
      },
    ],
    technical: [
      {
        title: 'Accurate Charting Engine',
        description:
          'Four pillars from lunar-javascript by true solar-term boundaries, with lunar leap-month conversion and optional true-solar-time correction.',
        media: '/assets/projects/yinyang/yinyang-natal.webp',
      },
      {
        title: 'Tianji Pavilion Deck',
        description:
          'A dark-gold deck reorganises the chart around the life palace and its main stars, with a combined daily fortune index and 30-day / quarterly trend lines.',
        media: '/assets/projects/yinyang/yinyang-daily.webp',
      },
      {
        title: 'Rule-based, Auditable Reading',
        description:
          'Day-master strength, favourable elements, and structure are deterministic, each shown with its basis and confidence — labelled cultural reference, not prediction.',
        media: '/assets/projects/yinyang/yinyang-hexagram.webp',
      },
      {
        title: 'Applied Readings',
        description:
          'Lucky colour, wealth direction, five-element naming characters, and a two-person compatibility report, all derived from the same chart.',
        media: '/assets/projects/yinyang/yinyang-match.webp',
      },
      {
        title: 'Tianji Q&A & Embedding',
        description:
          'A chart-aware Q&A layer (in progress), plus a postMessage SDK that embeds the clean view in any site — offline and account-free.',
        media: '/assets/projects/yinyang/yinyang-oracle.webp',
      },
    ],
    results: {
      summary:
        'YinYang now presents the same rigorous BaZi engine as 天機閣 — an atmospheric, source-cited reading deck that stays honest about being cultural reference, not prediction.',
      highlights: ['Astronomical-grade engine', 'Tianji Pavilion deck + clean embed', 'Source-cited, cultural-reference framing'],
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
    cover: '/assets/projects/lote/lote-notes.webp',
    banner: '/assets/projects/lote/lote-promo.webp',
    moneyshot: '/assets/projects/lote/lote-map.webp',
    logo: '/assets/projects/lote/lote-logo.webp',
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
        media: '/assets/projects/lote/lote-notes.webp',
      },
      {
        title: 'Backlinks, Tags & Graph',
        description:
          'The app parses [[links]], #tags, frontmatter, headings, and outgoing references to build backlinks, outline views, global/local D3 graph maps, and quick navigation.',
        media: '/assets/projects/lote/lote-map.webp',
      },
      {
        title: 'Database, Calendar & Kanban',
        description:
          'The same notes can be viewed as a database table, daily-note calendar, task list, or Trello-style kanban board, with the board state still stored as Markdown.',
        media: '/assets/projects/lote/lote-db.webp',
      },
      {
        title: 'Export, History & NAS Sync',
        description:
          'Full-text search, web clips, note lifecycle states, local version history, PDF/PNG/JPG export, ZIP import/export, and manual local-to-NAS backup sync are built in.',
        media: '/assets/projects/lote/lote-clips.webp',
      },
    ],
    results: {
      summary:
        'Lote packages a personal knowledge workspace into a local Windows app while keeping the user’s notes portable, inspectable, and independent from any hosted service.',
      highlights: ['Folder-based local vaults', 'Backlinks, graph, canvas & kanban', 'NAS backup sync and export tools'],
    },
  },
]
