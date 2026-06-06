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
    slug: 'bubono-bumperland',
    tag: 'Technical',
    title: "Bubono's Bumperland",
    blurb: 'Collision-first bumper buggy arenas across Burg, Abyss, and Big Bang with adaptive AI and upgradeable modules.',
    year: '2024 - 2025',
    role: 'Systems & Enemy Programmer',
    tools: 'UE5',
    cover: 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000',
    banner: '/assets/ITGM475/bubono-3.png',
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
      { title: 'Branch-Aware Enemy AI', description: 'Built data-driven behavior trees per branch: a timing-gated breaking-wheel, an arcing dunking-stool shooter, pitchfork imps, and a bulldozer boss that leads its coal shots based on the player speed.', media: 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000' },
      { title: 'Extensible Systems Framework', description: 'Designed a modular enemy and ability framework backed by data tables for fast tuning, plus scroll-wheel ability selection with per-ability timers and cooldowns.', media: 'https://drive.google.com/thumbnail?id=15LqVQCsOw_E80VFA-82sT1C8w-BO8uid&sz=w2000' },
      { title: 'Three-Tier Speed Feedback', description: 'Tied destruction to an orange/yellow/green collision-speed system feeding the monetary-loss scoring, reinforced with a slipstream effect, camera action lines, screen shake, and a reactive 3D scoreboard so every hit reads clearly.', media: 'https://drive.google.com/thumbnail?id=1RJtaZ2_J6p8XXwMxtfE1XMlYnnS5ar5C&sz=w2000' },
      { title: 'Arena & Prop Art Integration', description: 'Folded in the windmill arena shot, Jucc branding, bomb prop, and worm enemy artwork so the project page shows both the playable space and the supporting asset set.', media: '/assets/ITGM475/bubono-windmill-arena.jpg' },
    ],
    results: {
      summary: 'Delivered a playable vertical slice spanning the Burg, Abyss, and Big Bang branches with adaptive enemies, a tunable upgrade path, and a custom sound and VFX pass.',
      highlights: ['Branch-specific enemy AI', 'Readable three-tier speed feedback', 'Data-table-driven systems', 'Custom sound and VFX integration'],
    },
  },
  {
    slug: 'eshaver',
    tag: 'Art',
    title: 'E. Shaver Bookseller',
    blurb: 'UX redesign of a historic Savannah bookstore, rebuilding the home, product, and gallery pages around easier browsing and a stronger brand.',
    year: '2025',
    role: 'UX & UI Designer',
    tools: 'Figma · FigJam',
    cover: '/assets/UXDG360/es-home.png',
    banner: '/assets/UXDG360/es-home.png',
    moneyshot: '/assets/UXDG360/es-product.png',
    hideDownload: true,
    overview: {
      goal: 'Improve usability, browsing, and visual appeal of the E. Shaver Bookseller site while preserving its 1975 indie-bookstore charm.',
      team: '4-person team',
      timeline: 'UXDG 360 - Winter 2025',
    },
    process: [
      { title: 'Challenge', body: 'The original site made book discovery and checkout hard to navigate and underused the store strong local brand.' },
      { title: 'Solution', body: 'Ran observation, interviews, and cultural-probe research, clustered findings through affinitization, then built information architecture and wireframes before redesigning the home, product, and gallery pages in Figma.' },
      { title: 'Result', body: 'A clickable prototype that makes browsing intuitive while keeping the bookstore warm and local in character.' },
    ],
    technical: [
      { title: 'Home Page', description: 'Refined layout with simplified navigation, featured-book visuals, and clear calls to action to popular categories and offers.', media: '/assets/UXDG360/es-home.png' },
      { title: 'Product Page', description: 'Larger high-resolution imagery with zoom, streamlined descriptions and reviews, and a related-products section to aid discovery.', media: '/assets/UXDG360/es-product.png' },
      { title: 'Gallery & Signed Editions', description: 'Grid-based browsing with search and filters by genre, author, and theme, plus optimized images for fast loads.', media: '/assets/UXDG360/es-cards.png' },
      { title: 'Prototype Mockups', description: 'Placed the redesigned pages into desktop and laptop mockups to show how the bookstore experience reads in realistic presentation contexts.', media: '/assets/UXDG360/mockup-floating-macbook.png' },
    ],
    results: {
      summary: 'Delivered a full redesign package: research, process book, executive summary, and a Figma prototype of the rebuilt home, product, and gallery pages.',
      highlights: ['Home, product, and gallery redesigned', 'Figma clickable prototype', 'Research-backed IA and wireframes'],
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
    banner: '/assets/Ink/ScreenShot00007.png',
    logo: 'https://drive.google.com/thumbnail?id=1UhCuWYxYqAQa-EZJmccfpZvXz4rZbris&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1UsQNSbJ6patVl-M4YzuSKJjnPnARhUIy&sz=w2000',
    reel: 'https://drive.google.com/file/d/1QyDyQLHd1Vm5EaYH6l1sh5ZLbBvKJCq9/preview',
    download: 'https://drive.google.com/uc?export=download&id=1OXrf93ZZOZgMpkfbs7E2iYnq03n-twEm',
    overview: {
      goal: 'Ship a readable hand-drawn 2D platformer with a consistent ink-wash look inside a 48-hour game jam.',
      team: 'Game Jam team',
      timeline: '48 hours',
    },
    process: [
      { title: 'Challenge', body: 'Produce and integrate a full hand-drawn art set across multiple levels with no pipeline in place at the start of the jam.' },
      { title: 'Solution', body: 'Split work across hand-drawn character, enemy, and parallax background layers that fed straight into three pre-blocked levels.' },
      { title: 'Result', body: 'A complete, playable three-level build with a unified ink-wash style delivered on the deadline.' },
    ],
    technical: [
      { title: 'Hand-Drawn Asset Pipeline', description: 'Drew and imported character, enemy, and environment art as sprite layers, keeping the ink-wash style cohesive across every scene.', media: 'https://drive.google.com/thumbnail?id=1UsQNSbJ6patVl-M4YzuSKJjnPnARhUIy&sz=w2000' },
      { title: 'Layered Parallax Stages', description: 'Composited cloud, background, and ground layers for depth across three escalating levels, each with its own UI pass.', media: 'https://drive.google.com/thumbnail?id=1GO2T3zlddiAo2sJYgl8IrCIbfgDIBZiF&sz=w2000' },
      { title: 'Character & Enemy Sheets', description: 'Added the idle character art and boss creature artwork from the jam asset folder to show the source drawings behind the playable sprites.', media: '/assets/Ink/ink-character-idle.png' },
      { title: 'UI & Level Paint Pass', description: 'Integrated the ink-mark UI art and level-one paint pass alongside screenshots so the page shows the hand-drawn production path, not only the final build.', media: '/assets/Ink/ink-ui-mark.png' },
    ],
    results: {
      summary: 'Finished a playable three-level hand-drawn platformer within the 48-hour jam window.',
      highlights: ['Three complete levels', 'Cohesive hand-drawn look', 'Shipped within 48 hours'],
    },
  },
  {
    slug: 'terradotta',
    tag: 'Art',
    title: 'Terra Dotta \u00d7 SCADpro',
    blurb: 'UX research sprint mapping the student and advisor study-abroad journey for the global-education platform Terra Dotta.',
    year: '2024',
    role: 'UX Researcher',
    tools: 'Figma · FigJam',
    cover: '/assets/TerraDotta/cover.png',
    banner: '/assets/TerraDotta/banner.png',
    moneyshot: '/assets/TerraDotta/research.png',
    hideDownload: true,
    overview: {
      goal: 'Understand how students, advisors, and staff experience study-abroad programs to surface opportunities for Terra Dotta to improve its global-engagement platform.',
      team: 'SCADpro team',
      timeline: 'Sept 9 - Oct 2, 2024',
    },
    process: [
      { title: 'Challenge', body: 'Terra Dotta supports study-abroad programs across hundreds of institutions, but the team needed grounded insight into how students and advisors actually move through the journey before proposing directions.' },
      { title: 'Solution', body: 'Ran a structured research sprint: pre-kickoff framing, a customer journey map, secondary and primary research through observation, cultural probes, interviews, and sensory questions, then affinitization and brainstorming toward a midpoint synthesis.' },
      { title: 'Result', body: 'A clustered set of insight themes and solution directions delivered at the midpoint review to guide the next design phase.' },
    ],
    technical: [
      { title: 'Customer Journey Map', description: 'Mapped the end-to-end study-abroad journey for students and advisors to locate friction points and opportunities before primary research.', media: '/assets/TerraDotta/journey.png' },
      { title: 'Primary & Secondary Research', description: 'Combined desk research with observation, cultural probes, interviews, and sensory questions to capture how students and advisors experience the study-abroad process.', media: '/assets/TerraDotta/research.png' },
      { title: 'Affinitization', description: 'Clustered hundreds of raw notes into themes and patterns to make the research actionable.', media: '/assets/TerraDotta/affinity.png' },
      { title: 'Brainstorming & Synthesis', description: 'Translated insight themes into solution directions, sketched a first Terra Dotta testing website, and consolidated everything for the midpoint review.', media: '/assets/TerraDotta/brainstorm.png' },
    ],
    results: {
      summary: 'Delivered a research-backed problem framing, affinity-mapped insight themes, and early solution directions, including a first Terra Dotta testing website concept, for the midpoint review.',
      highlights: ['Customer journey map', 'Mixed-method primary research', 'Affinity-mapped insight themes', 'Tested website concept for midpoint'],
    },
  },
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
      { title: 'NPC & Quest UI Polish', description: 'Integrated the local NPC conversation frames and quest-accept UI so the page documents the role-playing layer behind the combat pacing.', media: '/assets/ITGM405/shanhe-quest-ui.png' },
    ],
    results: {
      summary: 'Template level that unifies narrative and combat pacing for future chapters.',
      highlights: ['Full concept story', 'Multi-phase mood curve', 'Boss pacing validated'],
      media: 'https://drive.google.com/thumbnail?id=1owiEu9EGj9dPUbw6xTiDoQlKdpxIjtbp&sz=w2000',
    },
  },
  {
    slug: 'aukadyssey',
    tag: 'Game',
    title: 'AukAdyssey',
    blurb: 'Third-person facility-escape action game starring Pip, a test-subject penguin, with melee combat and guided exploration.',
    year: '2024',
    role: 'UI & Systems',
    tools: 'UE',
    cover: 'https://drive.google.com/thumbnail?id=1dTNcjdEGbMvsI8Ewp6yXSl1L4Wx5XZhY&sz=w2000',
    banner: '/assets/ITGM356/ITGM356-1.png',
    logo: 'https://drive.google.com/thumbnail?id=15Hd8odth6E4izyGXiDBoJ6Xtbu3PsKk1&sz=w2000',
    moneyshot: 'https://drive.google.com/thumbnail?id=1EFRZf-AOchFJdKelyZa3cYZ239CpWwRj&sz=w2000',
    download: 'https://drive.google.com/uc?export=download&id=112LLeYtYTa0O7vkOBUQxhxwmtiBv9wOs',
    overview: {
      goal: 'Build the interaction, dialogue, and UI framework that keeps the escape readable while combat and pacing stay clear.',
      team: '4-person team',
      timeline: 'Prototype - 6 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Maintain readability and pacing across layered scenes.' },
      { title: 'Solution', body: 'UI guidance bound to beat maps; iterated character feel.' },
      { title: 'Result', body: 'Stable demo with consistent tone.' },
    ],
    technical: [
      { title: 'Conversation & Objective UI', description: 'Built the conversation-box dialogue system and on-screen objective prompts that steer the player toward the exit without breaking immersion.', media: '/assets/ITGM356/ITGM356.png' },
      { title: 'Combat Feedback & Hand-Switching', description: 'Wired melee attacks with switchable hands and a roll-dodge, layering punch and taking-damage audio with screen feedback so every exchange reads clearly.', media: '/assets/ITGM356/ITGM356-1.png' },
      { title: 'Interaction & HUD Systems', description: 'Implemented context interactions, pickups, and a HUD that ties movement, attack, and interact inputs into one readable control loop.', media: '/assets/ITGM356/ITGM356-2.png' },
      { title: 'Pip Character Art Pass', description: 'Added the transparent Pip character art and illustrated background from the project folder to connect the systems writeup with the game visual identity.', media: '/assets/ITGM356/aukadyssey-pip.png' },
      { title: 'Level Planning Maps', description: 'Included the graybox floor plan and route map to show how the escape path, rooms, and interaction beats were planned before implementation.', media: '/assets/ITGM356/aukadyssey-level-plan.png' },
    ],
    results: {
      summary: 'Shipped a playable final build of AukOdyssey: a third-person facility escape starring Pip, the test-subject penguin, with combat, traversal, and a guided dialogue layer.',
      highlights: ['Playable final build delivered', 'Dialogue and objective UI system', 'Readable melee combat feedback'],
    },
  },
  {
    slug: 'bio-lab',
    tag: 'Art',
    title: 'Bio-Lab',
    blurb: 'Pure biolab environment modeling scene focused on sci-fi laboratory layout, props, lighting, and atmosphere.',
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
      goal: 'Create a complete sci-fi biolab scene that presents a believable laboratory space through modeling, composition, materials, and lighting.',
      team: 'Solo scene build',
      timeline: 'Environment study - 4 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Make a compact laboratory scene feel complete and functional through modeling detail instead of gameplay systems.' },
      { title: 'Solution', body: 'Built the space around readable lab zones, sci-fi equipment silhouettes, controlled lighting, and staged camera angles.' },
      { title: 'Result', body: 'A focused environment-modeling study that emphasizes spatial composition, prop density, and atmosphere.' },
    ],
    technical: [
      { title: 'Laboratory Layout', description: 'Modeled the scene around clear room structure, work areas, containment equipment, and circulation space so the environment reads as a functional biolab.', media: 'https://drive.google.com/thumbnail?id=1YG62TLXBIErn6AAwMpl4fBqyudK4pBfL&sz=w2000' },
      { title: 'Props & Equipment', description: 'Built and arranged lab props, tanks, terminals, and industrial details to give the scene enough visual density without losing the main composition.', media: 'https://drive.google.com/thumbnail?id=161Sg3C2TZ2cywWP2cNEkzxfKzEvfbnKP&sz=w2000' },
      { title: 'Material & Lighting Pass', description: 'Used sci-fi material contrast, emissive accents, and controlled lighting to separate focal areas and reinforce the sterile laboratory mood.', media: 'https://drive.google.com/thumbnail?id=1ba6qTK5NyVKPHmVzb1oc62PHKyYYg-Gb&sz=w2000' },
    ],
    results: {
      summary: 'Finished a pure environment-modeling scene for a sci-fi biolab, focused on layout, props, lighting, and final presentation shots.',
      highlights: ['Complete biolab scene model', 'Sci-fi prop and equipment pass', 'Material and lighting presentation'],
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
      goal: 'Build tension beats with stairs, occlusion, and spatial reveals while practicing low-poly environment composition.',
      team: 'Solo build',
      timeline: 'Prototype - 5 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Make a minimal forest-stairs scene feel tense without depending on combat or heavy scripted action.' },
      { title: 'Solution', body: 'Used occlusion, sightline breaks, lighting contrast, and slow reveal timing to make each return to the stairs feel different.' },
      { title: 'Result', body: 'A compact horror study focused on atmosphere, route memory, and environmental unease.' },
    ],
    technical: [
      { title: 'Spatial Pacing', description: 'Designed the staircase as a repeated landmark, then varied approach angles, visibility, and reveal timing to build dread through navigation.', media: 'https://drive.google.com/thumbnail?id=1OwzwHoIYtFThl5p1Ee4Su38DXczQcYn-&sz=w2000' },
      { title: 'Light & Shadow Pass', description: 'Tuned forest contrast, stair silhouettes, and occlusion pockets so the player reads safe and unsafe spaces through the environment.', media: 'https://drive.google.com/thumbnail?id=1IIPLNuUsfvHcDY8dMvEU17MNF3Q5J65h&sz=w2000' },
      { title: 'Reveal Loop', description: 'Built slow reveal beats around turns, vertical changes, and return paths to support horror pacing without adding complex mechanics.', media: 'https://drive.google.com/thumbnail?id=1O5-caECe9dL2Q_-u7Qk-Z1L9mvNXkhh2&sz=w2000' },
    ],
    results: {
      summary: 'Completed a focused environmental horror prototype that validates staircase repetition, forest occlusion, and low-poly spatial mood.',
      highlights: ['Environmental tension study', 'Repeated landmark pacing', 'Light/shadow readability'],
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
      goal: 'Build a compact tower-defense mini game with clear lanes, readable placement decisions, and quick retry pacing.',
      team: 'Solo R&D',
      timeline: 'R&D - 2 weeks',
    },
    process: [
      { title: 'Challenge', body: 'Keep the defense loop understandable in a small Processing prototype with limited visual complexity.' },
      { title: 'Solution', body: 'Centered the design on simple lanes, direct enemy feedback, and readable tower placement rules.' },
      { title: 'Result', body: 'A short-session defense prototype that communicates core tower-defense tradeoffs quickly.' },
    ],
    technical: [
      { title: 'Lane & Wave Logic', description: 'Structured enemy waves around predictable lane movement so difficulty can rise through timing and count rather than visual clutter.', media: 'https://drive.google.com/thumbnail?id=1iRz1n3k14Pl7So9Z639bcMF3bTXxu21g&sz=w2000' },
      { title: 'Tower Placement Rules', description: 'Kept placement, range, and firing feedback direct so the player can understand why a defense succeeds or leaks.', media: 'https://drive.google.com/thumbnail?id=1Km8T5iAP_y_jTkzFoQYPFavDvmEz1BhC&sz=w2000' },
    ],
    results: {
      summary: 'Delivered a lightweight tower-defense prototype that captures wave pressure, placement choices, and quick replay loops.',
      highlights: ['Readable lane defense', 'Short-session loop', 'Processing gameplay prototype'],
    },
  },
]
