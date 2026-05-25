export type ProjectTag = 'Game' | 'Technical' | 'Art' | 'Prototype'

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
  reel?: string
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

export const projects: Project[] = [
  {
    slug: 'shanhe',
    tag: 'Game',
    title: 'Shanhe',
    blurb: 'Wuxia',
    year: '2024',
    role: 'Creative Director',
    tools: 'Unreal, Blueprints, RPG',
    cover: 'https://drive.google.com/thumbnail?id=1uO6XHF9NXmsHltvswhwHtEpWUhMGHJOi&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1fziWjRrdu7PaTwRei4jY1-jQDoD3Aj0K&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=1TH71UCTKr9qJJLJN9jgWYPN6YrjvJ8RS&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1m76CP25rwHpVIXbLWPKcQncGv3AzpVLs&sz=w2000',
    download: 'https://drive.google.com/uc?export=download&id=1my4uhdvPEr4Xv3KOCFAYIJtHk7Gw7yP2',
    overview: {
      goal: 'Build a mood curve from calm to pressure to demonized to burst to weakened to finale, tied to corpse-soul shards.',
      team: 'Solo',
      timeline: 'Mar 2024 - May 2024 / 10 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Keep combat rhythm aligned with mood beats instead of pure stat scaling.' },
      { title: 'Solution', body: 'Boss emotion nodes and shard clues rewrite spaces; semi-open areas connect the beats.' },
      { title: 'Result', body: 'Players feel each emotional turn; story and combat stay in sync.' },
    ],
    technical: [
      { title: 'Mood-Driven AI', description: 'State machine tied to mood nodes; animation/audio/FX swap per phase.', media: 'https://drive.google.com/thumbnail?id=1fziWjRrdu7PaTwRei4jY1-jQDoD3Aj0K&sz=w2000' },
      { title: 'Shard System', description: 'Collectible shards trigger narrative and terrain changes; data-table hot reloads.', media: 'https://drive.google.com/thumbnail?id=1rM2DaDsjBCWoBnQQHyHr1QwCFBAgr0Pv&sz=w2000' },
    ],
    results: {
      summary: 'Template level that unifies narrative and combat pacing for future chapters.',
      highlights: ['Full concept story', 'Multi-phase mood curve', 'Boss pacing validated'],
      media: 'https://drive.google.com/thumbnail?id=1owiEu9EGj9dPUbw6xTiDoQlKdpxIjtbp&sz=w2000',
    },
  },
  {
    slug: 'bubono-bumperland',
    tag: 'Technical',
    title: "Bubono's Bumperland",
    blurb: 'Collision-first bumper buggy arenas across Burg, Abyss, and Big Bang with adaptive AI and upgradeable modules.',
    year: '2024 - 2025',
    role: 'Systems & Enemy Programmer',
    tools: 'UE5',
    cover: 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1RJtaZ2_J6p8XXwMxtfE1XMlYnnS5ar5C&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=1GGYWbyH34Xtk_azVj9GI-MOM09PXlndh&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=15LqVQCsOw_E80VFA-82sT1C8w-BO8uid&sz=w2000',
    download: 'https://drive.google.com/uc?export=download&id=1KxNmUpR7WxtmeoNkNUFc9yG1SJ4E_uT3',
    overview: {
      goal: 'Deliver branch-themed collision combat with adaptive enemies while keeping every shove readable.',
      team: '5-person squad',
      timeline: 'Sep 2024 - May 2025',
    },
    process: [
      { title: 'Challenge', body: 'Blend three themed branches without losing collision clarity or AI readability.' },
      { title: 'Solution', body: 'Behavior-driven enemies and modular collision/upgrade systems keep arenas coherent.' },
      { title: 'Result', body: 'Park mechanic loop balances chaos, clarity, and progression across the branches.' },
    ],
    technical: [
      { title: 'Behavior-Driven Enemies', description: 'Branch-aware behavior trees react to player movement, routes, and combat rhythm.', media: 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000' },
      { title: 'Collision & Upgrade Modules', description: 'Physics-forward collision handling and modular upgrades tuned for bumper buggies.', media: 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000' },
    ],
    results: {
      summary: 'Collision-first park build validated with adaptive enemies and a flexible upgrade path.',
      highlights: ['Branch-specific AI', 'Readable collision feedback', 'Upgradeable buggies'],
    },
  },
  {
    slug: 'stairs-in-the-woods',
    tag: 'Game',
    title: 'Stairs in the Woods',
    blurb: 'Horror pacing study with forest stairs, light/shadow, and slow reveals.',
    year: '2022',
    role: 'Immersive Experience',
    tools: 'UE5',
    cover: 'https://drive.google.com/thumbnail?id=1OwzwHoIYtFThl5p1Ee4Su38DXczQcYn-&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1IIPLNuUsfvHcDY8dMvEU17MNF3Q5J65h&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1O5-caECe9dL2Q_-u7Qk-Z1L9mvNXkhh2&sz=w2000',
    reel: 'https://drive.google.com/file/d/13j4Lbi6hFs6gwjJiplxO3h4ZRG9bWeRW/preview',
    hideDownload: true,
    overview: {
      goal: 'Build tension beats with stairs and occlusion while practicing low-poly environment building.',
      team: 'Solo build',
      timeline: 'Prototype - 5 weeks',
    },
    process: [],
    technical: [],
    results: {
      summary: '',
      highlights: [],
    },
  },
  {
    slug: 'castle-defense',
    tag: 'Technical',
    title: 'Castle Defense',
    blurb: 'A simple tower-defense mini game.',
    year: '2022',
    role: 'Tower Defense',
    tools: 'Processing',
    cover: 'https://drive.google.com/thumbnail?id=1iRz1n3k14Pl7So9Z639bcMF3bTXxu21g&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1iRz1n3k14Pl7So9Z639bcMF3bTXxu21g&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=1iRz1n3k14Pl7So9Z639bcMF3bTXxu21g&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1Km8T5iAP_y_jTkzFoQYPFavDvmEz1BhC&sz=w2000',
    download: 'https://drive.google.com/uc?export=download&id=1yPK1UTRmNkatRh3IM9tguoKqNn9KXqTc',
    overview: {
      goal: 'A quick, time-killing tower-defense mini game.',
      team: 'Solo R&D',
      timeline: 'R&D - 2 weeks',
    },
    process: [],
    technical: [],
    results: {
      summary: '',
      highlights: [],
    },
  },
  {
    slug: 'bio-lab',
    tag: 'Art',
    title: 'Bio-Lab',
    blurb: 'Biolab level with puzzle, QTE, and stealth AI; full emotion curve.',
    year: '2023',
    role: 'Scene Modeling',
    tools: 'UE5',
    cover: 'https://drive.google.com/thumbnail?id=1YG62TLXBIErn6AAwMpl4fBqyudK4pBfL&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=161Sg3C2TZ2cywWP2cNEkzxfKzEvfbnKP&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=1Mamy5hLfhEcxA480AC48fokRdE4tILoF&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1ba6qTK5NyVKPHmVzb1oc62PHKyYYg-Gb&sz=w2000',
    reel: 'https://drive.google.com/file/d/1B_viULByh0dkX7XjPCFbGAQqw6wl03d6/preview',
    hideDownload: true,
    overview: {
      goal: 'Practice calm -> tension -> climax -> QTE -> cooldown -> puzzle -> escape pacing.',
      team: 'Solo build',
      timeline: 'Prototype - 4 weeks',
    },
    process: [],
    technical: [],
    results: {
      summary: '',
      highlights: [],
    },
  },
  {
    slug: 'aukadyssey',
    tag: 'Game',
    title: 'AukAdyssey',
    blurb: 'First-person action game with kinetic combat and cinematic traversal.',
    year: '2022',
    role: 'UI and Systems',
    tools: 'UE',
    cover: 'https://drive.google.com/thumbnail?id=1dTNcjdEGbMvsI8Ewp6yXSl1L4Wx5XZhY&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1KtIGytEUmXF_UQ5ryX12b_6h5am5DcM8&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=15Hd8odth6E4izyGXiDBoJ6Xtbu3PsKk1&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1EFRZf-AOchFJdKelyZa3cYZ239CpWwRj&sz=w2000',
    download: 'https://drive.google.com/uc?export=download&id=112LLeYtYTa0O7vkOBUQxhxwmtiBv9wOs',
    overview: {
      goal: 'Build interaction and UI framework while keeping art tone and rhythm clear.',
      team: '4-person team',
      timeline: 'Prototype - 6 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Maintain readability and pacing across layered scenes.' },
      { title: 'Solution', body: 'UI guidance bound to beat maps; iterated character feel.' },
      { title: 'Result', body: 'Stable demo with consistent tone.' },
    ],
    technical: [],
    results: {
      summary: '',
      highlights: [],
    },
  },
  {
    slug: 'ink',
    tag: 'Prototype',
    title: 'Ink',
    blurb: '2D platformer with layered scenes and hand-drawn interaction framework.',
    year: 'Jan 2025',
    role: 'Hand-drawn',
    tools: 'UE',
    cover: 'https://drive.google.com/thumbnail?id=1csW4phIgAJX3eKsRAHhZe5hvyUDUagd-&sz=w2000',
    banner: 'https://drive.google.com/thumbnail?id=1GO2T3zlddiAo2sJYgl8IrCIbfgDIBZiF&sz=w2000',
    logo: 'https://drive.google.com/thumbnail?id=1UhCuWYxYqAQa-EZJmccfpZvXz4rZbris&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1UsQNSbJ6patVl-M4YzuSKJjnPnARhUIy&sz=w2000',
    reel: 'https://drive.google.com/file/d/1QyDyQLHd1Vm5EaYH6l1sh5ZLbBvKJCq9/preview',
    download: 'https://drive.google.com/uc?export=download&id=1OXrf93ZZOZgMpkfbs7E2iYnq03n-twEm',
    overview: {
      goal: 'Hand-drawn 2D platformer.',
      team: 'Game Jam project',
      timeline: '48 hours',
    },
    process: [],
    technical: [],
    results: {
      summary: '',
      highlights: [],
    },
  },
]
