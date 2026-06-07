import type { Project } from '@/content/projects/types'

export const appProjects: Project[] = [
  {
    slug: 'cheetah',
    tag: 'App Development',
    title: 'Cheetah',
    blurb:
      'A private money companion that makes daily spending visible and turns budgets, bills, and savings goals into clear next actions.',
    year: '2026',
    role: 'Product Designer / Front-end Developer',
    tools: 'React / JavaScript / LocalStorage',
    cover: '/assets/projects/cheetah/cheetah-cover.webp',
    banner: '/assets/projects/cheetah/cheetah-cover.webp',
    moneyshot: '/assets/projects/cheetah/cheetah-cover.webp',
    demo: '/embedded-apps/cheetah/index.html',
    hideDownload: true,
    status: 'Working prototype',
    overview: {
      goal: 'Cheetah asks a simple product question: can a finance app help someone act on their money without demanding an account or exposing their financial history?',
      team: 'Independent product',
      timeline: '2026',
    },
    process: [
      {
        title: 'Product Problem',
        body: 'Most finance tools separate recording, planning, and reflection. That forces users to reconstruct the relationship between what they spent and what they intended to do.',
      },
      {
        title: 'Design Decision',
        body: 'The interface is organized around four repeated actions: check the current position, record a transaction, plan upcoming cash flow, and review patterns.',
      },
      {
        title: 'Working Build',
        body: 'The result is a browser-based product with persistent local data, editable accounts and categories, recurring payments, savings goals, insights, and portable exports.',
      },
    ],
    technical: [
      {
        title: 'Private by Default',
        description:
          'The ledger lives in the browser. No account is required, and transactions, balances, categories, budgets, goals, and preferences are not sent to a remote service.',
        media: '/assets/projects/cheetah/cheetah-cover.webp',
      },
      {
        title: 'Planning before Reporting',
        description:
          'Budgets, income allocation, recurring payments, and savings goals share one planning model, so future obligations stay connected to the current balance.',
        media: '/assets/projects/cheetah/cheetah-planning.webp',
      },
      {
        title: 'Feedback that Prompts Action',
        description:
          'Charts explain what changed, while budget states, due reminders, progress, and the Leo companion indicate what deserves attention next.',
        media: '/assets/projects/cheetah/cheetah-insights.webp',
      },
    ],
    results: {
      summary:
        'Cheetah now supports the complete personal-finance loop: capture activity, understand the present, prepare for upcoming obligations, and keep the data under the user’s control.',
      highlights: ['Private local ledger', 'One connected planning model', 'Working responsive product'],
    },
  },
  {
    slug: 'yinyang',
    tag: 'App Development',
    title: 'YinYang',
    blurb:
      'A BaZi charting tool that separates calculation from interpretation: the browser builds the chart, rules explain it, and AI remains optional.',
    year: '2026',
    role: 'Full-stack App Developer',
    tools: 'JavaScript · Node.js · OpenAI API',
    cover: '/assets/projects/yinyang/yinyang-cover.webp',
    banner: '/assets/projects/yinyang/yinyang-cover.webp',
    moneyshot: '/assets/projects/yinyang/yinyang-cover.webp',
    demo: '/embedded-apps/yinyang/index.html',
    hideDownload: true,
    status: 'Working web app',
    overview: {
      goal: 'Traditional charting tools often present dense results without showing how they were produced. YinYang reorganizes the chart into traceable layers and keeps generated interpretation separate from calculation.',
      team: 'Independent product',
      timeline: '2026',
    },
    process: [
      {
        title: 'Information Problem',
        body: 'A complete chart contains many interconnected systems. Showing everything at once makes the result difficult to read, while hiding the details makes it difficult to trust.',
      },
      {
        title: 'Architecture Decision',
        body: 'Calculation, rule-based interpretation, interface presentation, and optional AI synthesis are separate layers with different responsibilities.',
      },
      {
        title: 'Working Build',
        body: 'The app produces a complete chart locally, exposes the reasoning behind its structured reading, and only calls AI when the user explicitly requests a broader synthesis.',
      },
    ],
    technical: [
      {
        title: 'Browser-side Chart Engine',
        description:
          'Pillars, five elements, ten gods, hidden stems, growth stages, luck cycles, and annual timing are calculated deterministically in the browser.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
      {
        title: 'Traceable Interpretation',
        description:
          'Rule-based conclusions remain connected to chart evidence, helping users distinguish calculated structure from explanatory interpretation.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
      {
        title: 'Optional AI Synthesis',
        description:
          'AI is an explicit secondary action. It receives calculated chart data for synthesis while excluding the user’s name and birthplace from the request.',
        media: '/assets/projects/yinyang/yinyang-cover.webp',
      },
    ],
    results: {
      summary:
        'YinYang turns a dense chart into a readable product without blurring the boundary between calculation, interpretation, and generated commentary.',
      highlights: ['Deterministic local charting', 'Evidence-linked interpretation', 'AI only when requested'],
    },
  },
]
