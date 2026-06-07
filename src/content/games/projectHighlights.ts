export type LocalizedText = {
  en: string
  zh: string
}

export type ProjectHighlight = {
  focus: LocalizedText
  evidence: LocalizedText
  notes: LocalizedText[]
}

export const projectHighlights: Record<string, ProjectHighlight> = {
  'bubono-bumperland': {
    focus: {
      en: 'A systems-heavy team project about collision combat, enemy AI, and readable player feedback.',
      zh: '一个系统密度较高的团队项目，重点是碰撞战斗、敌人 AI 和清晰玩家反馈。',
    },
    evidence: {
      en: 'Built branch-specific enemy behaviors, modular ability logic, collision feedback, and data-table tuning inside a long-running UE5 project.',
      zh: '在长期 UE5 项目中负责分支敌人行为、模块化技能逻辑、碰撞反馈和数据表调参。',
    },
    notes: [
      {
        en: 'Turned chaotic physics combat into readable moment-to-moment feedback.',
        zh: '把混乱的物理碰撞战斗整理成玩家可读的即时反馈。',
      },
      {
        en: 'Used behavior trees as both implementation structure and design language.',
        zh: '把行为树同时作为实现结构和设计语言使用。',
      },
      {
        en: 'Kept system ownership clear inside a multi-person production pipeline.',
        zh: '在多人制作管线中保持清晰的系统职责。',
      },
    ],
  },
  shanhe: {
    focus: {
      en: 'A solo wuxia vertical slice centered on combat rhythm, mission hooks, and systemic RPG structure.',
      zh: '一个独立完成的武侠垂直切片，核心是战斗节奏、任务触发和系统化 RPG 结构。',
    },
    evidence: {
      en: 'Designed a 10-week prototype around combat states, weapon feedback, narrative pacing, and sprint-based iteration.',
      zh: '用 10 周围绕战斗状态、武器反馈、叙事节奏和 Sprint 迭代完成原型。',
    },
    notes: [
      {
        en: 'Carried the loop from concept to playable prototype.',
        zh: '从概念到可玩原型完整推进核心循环。',
      },
      {
        en: 'Connected combat feel with mission structure and story beats.',
        zh: '把战斗手感、任务结构和叙事节奏连在一起。',
      },
      {
        en: 'Kept the process visible through readable design documentation.',
        zh: '通过清晰设计文档记录过程和判断。',
      },
    ],
  },
  aukadyssey: {
    focus: {
      en: 'A third-person escape prototype focused on UI systems, combat readability, and guided interaction.',
      zh: '一个第三人称逃脱原型，重点是 UI 系统、战斗可读性和引导式交互。',
    },
    evidence: {
      en: 'Implemented dialogue, objective prompts, interaction handling, HUD structure, melee feedback, and level-planning artifacts.',
      zh: '实现对话、目标提示、交互、HUD、近战反馈，并保留关卡规划材料。',
    },
    notes: [
      {
        en: 'Built player-facing systems that reduce confusion during exploration.',
        zh: '搭建降低探索困惑的面向玩家系统。',
      },
      {
        en: 'Balanced implementation with visual and level-design context.',
        zh: '在实现、视觉和关卡语境之间保持平衡。',
      },
      {
        en: 'Shows practical support work inside a small team prototype.',
        zh: '体现小团队原型中的实用支持工作。',
      },
    ],
  },
  ink: {
    focus: {
      en: 'A 48-hour hand-drawn platformer about fast scope control and art-to-build integration.',
      zh: '一个 48 小时手绘平台游戏，重点是快速范围控制和美术到可玩版本的整合。',
    },
    evidence: {
      en: 'Delivered three playable levels with character, enemy, UI, and scene layers under jam constraints.',
      zh: '在 Game Jam 限制下完成三关卡可玩版本，包含角色、敌人、UI 和场景分层。',
    },
    notes: [
      {
        en: 'Scoped aggressively under deadline pressure.',
        zh: '在强时间限制下做清晰取舍。',
      },
      {
        en: 'Made art-pipeline choices based on playability.',
        zh: '根据可玩性决定美术管线取舍。',
      },
      {
        en: 'Integrated usable assets directly into a playable build.',
        zh: '把可用素材直接接入可玩版本。',
      },
    ],
  },
  terradotta: {
    focus: {
      en: 'A UX research project about study-abroad journeys, synthesis, and stakeholder-ready communication.',
      zh: '一个 UX 研究项目，围绕留学旅程、洞察整合和面向客户的表达展开。',
    },
    evidence: {
      en: 'Mapped the study-abroad journey through mixed-method research, affinity mapping, and midpoint synthesis for SCADpro.',
      zh: '在 SCADpro 项目中通过多方法研究、亲和图和中期综合梳理留学旅程。',
    },
    notes: [
      {
        en: 'Turned ambiguous human data into design decisions.',
        zh: '把模糊的人群数据转化为设计判断。',
      },
      {
        en: 'Built artifacts that teams and clients could act on.',
        zh: '制作团队和客户都能执行的研究产物。',
      },
      {
        en: 'Adds UX maturity to the broader interactive portfolio.',
        zh: '为整个互动作品集补充 UX 维度。',
      },
    ],
  },
  eshaver: {
    focus: {
      en: 'A UI/UX redesign project about information architecture, browsing flow, and polished presentation.',
      zh: '一个 UI/UX 改版项目，重点是信息架构、浏览流程和高完成度展示。',
    },
    evidence: {
      en: 'Redesigned a bookstore experience across home, product, gallery, signed-edition, and realistic presentation mockups.',
      zh: '围绕首页、商品页、画廊、签名版和设备 mockup 完成书店体验改版。',
    },
    notes: [
      {
        en: 'Modernized a real brand without erasing its character.',
        zh: '现代化真实品牌，同时保留原有气质。',
      },
      {
        en: 'Clarified page hierarchy, browsing logic, and product-detail flow.',
        zh: '梳理页面层级、浏览逻辑和商品详情流程。',
      },
      {
        en: 'Presentation quality supports a complete case-study read.',
        zh: '展示完成度可以支撑完整案例阅读。',
      },
    ],
  },
}

export const getLocalizedText = (text: LocalizedText, language: 'en' | 'zh') => text[language]
