export type ProjectTranslation = {
  title: string
  blurb: string
  overviewGoal: string
  role?: string
  overviewTeam?: string
  overviewTimeline?: string
  process?: { title: string; body: string }[]
  technical?: { title: string; description: string }[]
  results?: { summary: string; highlights: string[] }
}

export const projectTranslations: Record<string, ProjectTranslation> = {
  shanhe: {
    title: '山河',
    blurb: '武侠动作 Demo，围绕战斗节奏、处决反馈与任务系统之间的事件联动展开。',
    role: '独立设计与开发',
    overviewGoal: '建立从冷静探索到高压战斗的情绪曲线，并验证战斗结果如何通过事件系统影响任务层。',
    overviewTeam: '个人项目',
    overviewTimeline: '2024.03 - 2024.05 / 10 周',
    process: [
      { title: '挑战', body: '让战斗节奏服务情绪节点，而不是只依赖数值成长。' },
      { title: '方案', body: '用 Boss 情绪阶段、碎片线索与半开放区域串联关卡节奏。' },
      { title: '结果', body: '剧情和战斗可以同步推进，玩家能感到每一次状态转折。' },
    ],
    technical: [
      { title: '情绪驱动 AI', description: '状态机绑定情绪节点，在不同阶段切换动画、音频与特效反馈。' },
      { title: '碎片系统', description: '可收集碎片触发叙事与空间变化，数据表支持快速调整。' },
    ],
    results: {
      summary: '一个用于统一叙事节奏和战斗节奏的关卡模板。',
      highlights: ['完整概念故事', '多阶段情绪曲线', 'Boss 节奏验证'],
    },
  },
  'bubono-bumperland': {
    title: 'Bubono 的碰碰车乐园',
    blurb: '以碰撞为核心的碰碰车竞技场，包含 Burg、Abyss、Big Bang 三个主题分支和自适应敌人。',
    role: '系统与敌人程序',
    overviewGoal: '制作主题化的碰撞战斗和敌人行为，同时保持每次撞击清晰可读。',
    overviewTeam: '5 人团队',
    overviewTimeline: '2024.09 - 2025.05',
    process: [
      { title: '挑战', body: '整合三个主题分支，同时保证碰撞反馈和 AI 行为仍然清晰。' },
      { title: '方案', body: '通过行为驱动敌人与模块化碰撞/升级系统维持玩法一致性。' },
      { title: '结果', body: '乐园循环在混乱感、可读性和成长路径之间取得平衡。' },
    ],
    technical: [
      { title: '行为驱动敌人', description: '分支感知的行为树会响应玩家移动、路线与战斗节奏。' },
      { title: '碰撞与升级模块', description: '以物理反馈为核心的碰撞处理，以及面向碰碰车的模块升级。' },
    ],
    results: {
      summary: '碰撞优先的乐园构建已验证，敌人具备适应性，升级路径保持灵活。',
      highlights: ['分支特定 AI', '可读的碰撞反馈', '可升级碰碰车'],
    },
  },
  'stairs-in-the-woods': {
    title: '林中阶梯',
    blurb: '恐怖节奏练习，围绕森林阶梯、光影遮挡与慢速揭示建立紧张感。',
    role: '沉浸式体验',
    overviewGoal: '用阶梯、遮挡和空间转场练习低多边形环境中的紧张节奏。',
    overviewTeam: '个人项目',
    overviewTimeline: '原型 - 5 周',
    process: [],
    technical: [],
    results: { summary: '', highlights: [] },
  },
  'castle-defense': {
    title: '城堡防御',
    blurb: '一个轻量塔防小游戏。',
    role: '塔防设计',
    overviewGoal: '制作一个短周期、易上手的塔防原型。',
    overviewTeam: '个人研发',
    overviewTimeline: '研发 - 2 周',
    process: [],
    technical: [],
    results: { summary: '', highlights: [] },
  },
  'bio-lab': {
    title: 'Bio-Lab',
    blurb: '带有谜题、QTE 与潜行 AI 的生化实验室关卡，强调完整情绪曲线。',
    role: '场景建模',
    overviewGoal: '练习从平静、紧张、高潮、QTE、冷却、解谜到逃离的关卡节奏。',
    overviewTeam: '个人项目',
    overviewTimeline: '原型 - 4 周',
    process: [],
    technical: [],
    results: { summary: '', highlights: [] },
  },
  aukadyssey: {
    title: 'AukAdyssey',
    blurb: '第一人称动作游戏原型，包含高速战斗和电影化移动。',
    role: 'UI 与系统',
    overviewGoal: '搭建交互与 UI 框架，同时保持美术基调和节奏清晰。',
    overviewTeam: '4 人团队',
    overviewTimeline: '原型 - 6 周',
    process: [
      { title: '挑战', body: '在分层场景中维持可读性和节奏。' },
      { title: '方案', body: '将 UI 引导绑定到节奏节点，并持续打磨角色手感。' },
      { title: '结果', body: '形成基调稳定的可玩 Demo。' },
    ],
    technical: [],
    results: { summary: '', highlights: [] },
  },
  ink: {
    title: 'Ink',
    blurb: '手绘 2D 平台游戏，包含分层场景和手绘交互框架。',
    role: '手绘视觉',
    overviewGoal: '制作一个围绕手绘输入和平台移动展开的 2D 原型。',
    overviewTeam: 'Game Jam 项目',
    overviewTimeline: '48 小时',
    process: [],
    technical: [],
    results: { summary: '', highlights: [] },
  },
}
