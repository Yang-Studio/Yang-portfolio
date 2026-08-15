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
  'pubg-signal-wheel': {
    focus: {
      en: 'A tactical-system design proposal focused on fast team communication, precise marker logic, and match-health safeguards.',
      zh: '一个战术系统策划案，重点是快速团队沟通、精准标点逻辑和局内生态保护。',
    },
    evidence: {
      en: 'Closed the system loop from input flow and raycast placement to anti-spam cooldowns, downed-state restrictions, and season-driven DataTable configuration.',
      zh: '从输入流、射线标点到反刷屏、倒地状态限制和赛季化 DataTable 配置，完整闭合系统逻辑。',
    },
    notes: [
      {
        en: 'Turns a common battle royale ping feature into a documented ruleset with edge cases.',
        zh: '把常见战术竞技报点功能拆成包含边界情况的规则集。',
      },
      {
        en: 'Balances combat usability with information accuracy and abuse prevention.',
        zh: '在战斗可用性、信息准确度和防滥用之间做平衡。',
      },
      {
        en: 'Uses data-driven thinking so live-ops text, audio, and icons can change without code rewrites.',
        zh: '用数据驱动思维支持运营更换文本、语音和图标，而不需要改代码。',
      },
    ],
  },
  'bubono-bumperland': {
    focus: {
      en: 'Build and refine a cohesive game experience across Gameplay, Enemy AI, Rendering, and Performance, centered around vehicle collision combat.',
      zh: '围绕车辆碰撞战斗，构建并完善 Gameplay、Enemy AI、Rendering 与 Performance 之间的完整游戏体验。',
    },
    evidence: {
      en: 'Served as a **Systems & Enemy Programmer / Technical Artist** on the UE5 project.',
      zh: '在 UE5 项目中负责担任系统与敌人程序/技术美术',
    },
    notes: [
      {
        en: 'Built a vehicle collision-based combat system, balancing impactful physics with gameplay control and predictability.',
        zh: '构建以车辆碰撞为核心的战斗系统，在物理碰撞的冲击感与 Gameplay 可控性之间取得平衡。',
      },
      {
        en: 'Built enemy AI around vehicle movement and collision mechanics, using Behavior Trees to handle targeting, alignment, charging, and recovery.',
        zh: '构建适配车辆运动与碰撞机制的敌人 AI，通过行为树实现追踪、对齐、冲撞与恢复等行为。',
      },
      {
        en: 'Implemented and optimized shaders, post-processing effects, and technical meshes while improving overall performance and runtime smoothness.',
        zh: '实现并优化 Shader、Post Processing 与技术 Mesh，在保持视觉效果的同时提升整体性能与运行流畅度。',
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
