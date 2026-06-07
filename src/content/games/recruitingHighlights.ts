export type LocalizedText = {
  en: string
  zh: string
}

export type ProjectRecruitingHighlight = {
  fit: LocalizedText
  proof: LocalizedText
  bullets: LocalizedText[]
}

export const projectRecruitingHighlights: Record<string, ProjectRecruitingHighlight> = {
  'bubono-bumperland': {
    fit: {
      en: 'Best signal for gameplay systems, enemy AI, and team production.',
      zh: '最能证明玩法系统、敌人 AI 与团队制作能力的项目。',
    },
    proof: {
      en: 'Built branch-specific enemy behaviors, modular ability logic, collision feedback, and data-table tuning inside a long-running UE5 team project.',
      zh: '在长期 UE5 团队项目中负责分支敌人行为、模块化技能逻辑、碰撞反馈和数据表调参。',
    },
    bullets: [
      {
        en: 'Can turn chaotic physics combat into readable player feedback.',
        zh: '能把混乱的物理碰撞战斗整理成玩家可读的反馈。',
      },
      {
        en: 'Understands AI behavior trees as a design tool, not only an implementation detail.',
        zh: '理解行为树不仅是实现方式，也是设计工具。',
      },
      {
        en: 'Has shipped work inside a multi-person pipeline with role ownership.',
        zh: '有多人项目管线中的职责归属和交付经验。',
      },
    ],
  },
  shanhe: {
    fit: {
      en: 'Best signal for solo ownership, combat pacing, and systemic RPG thinking.',
      zh: '最能证明独立负责、战斗节奏与系统化 RPG 思维的项目。',
    },
    proof: {
      en: 'Designed a 10-week wuxia vertical slice around combat states, mission hooks, weapon feedback, and sprint-based iteration.',
      zh: '用 10 周完成武侠垂直切片，覆盖战斗状态、任务触发、武器反馈和 Sprint 迭代。',
    },
    bullets: [
      {
        en: 'Owns the full loop from concept to playable prototype.',
        zh: '能从概念到可玩原型完整负责闭环。',
      },
      {
        en: 'Connects combat feel with mission structure and narrative beats.',
        zh: '能把战斗手感、任务结构和叙事节奏连起来。',
      },
      {
        en: 'Documents process clearly enough for a team to evaluate decisions.',
        zh: '过程记录足够清晰，便于团队评估设计决策。',
      },
    ],
  },
  aukadyssey: {
    fit: {
      en: 'Best signal for UI systems, combat readability, and prototype support.',
      zh: '最能证明 UI 系统、战斗可读性和原型支持能力的项目。',
    },
    proof: {
      en: 'Implemented dialogue, objective prompts, interaction handling, HUD structure, melee feedback, and level-planning artifacts.',
      zh: '实现对话、目标提示、交互、HUD、近战反馈，并保留关卡规划材料。',
    },
    bullets: [
      {
        en: 'Can build player-facing systems that reduce confusion.',
        zh: '能搭建降低玩家困惑的面向玩家系统。',
      },
      {
        en: 'Balances implementation with visual and level-design context.',
        zh: '能在实现、视觉和关卡语境之间保持平衡。',
      },
      {
        en: 'Shows useful support work inside a small team prototype.',
        zh: '体现小团队原型中的实用支持能力。',
      },
    ],
  },
  ink: {
    fit: {
      en: 'Best signal for fast production, hand-drawn asset integration, and jam execution.',
      zh: '最能证明快速制作、手绘资源整合和 Game Jam 执行力的项目。',
    },
    proof: {
      en: 'Delivered a complete three-level hand-drawn platformer in 48 hours with character, enemy, UI, and scene layers.',
      zh: '48 小时内完成三关卡手绘平台游戏，包含角色、敌人、UI 和场景分层。',
    },
    bullets: [
      {
        en: 'Can scope aggressively under deadline pressure.',
        zh: '能在强时间限制下做清晰取舍。',
      },
      {
        en: 'Understands how art pipeline choices affect playability.',
        zh: '理解美术管线选择如何影响可玩性。',
      },
      {
        en: 'Produces usable assets and integrates them into a playable build.',
        zh: '能产出可用素材并接入可玩版本。',
      },
    ],
  },
  terradotta: {
    fit: {
      en: 'Best signal for UX research, synthesis, and stakeholder-ready communication.',
      zh: '最能证明 UX 研究、洞察整合和面向客户沟通能力的项目。',
    },
    proof: {
      en: 'Mapped the study-abroad journey through mixed-method research, affinity mapping, and midpoint synthesis for SCADpro.',
      zh: '在 SCADpro 项目中通过多方法研究、亲和图和中期综合梳理留学旅程。',
    },
    bullets: [
      {
        en: 'Can collect ambiguous human data and turn it into decisions.',
        zh: '能把模糊的人群数据转化为设计判断。',
      },
      {
        en: 'Understands research artifacts that teams and clients can act on.',
        zh: '理解团队和客户能执行的研究产物。',
      },
      {
        en: 'Adds UX maturity to a game or interactive team.',
        zh: '能为游戏或互动团队补充 UX 成熟度。',
      },
    ],
  },
  eshaver: {
    fit: {
      en: 'Best signal for UI/UX redesign, information architecture, and polished mockup presentation.',
      zh: '最能证明 UI/UX 改版、信息架构和高完成度 mockup 展示能力的项目。',
    },
    proof: {
      en: 'Redesigned a bookstore experience across home, product, gallery, signed-edition, and realistic presentation mockups.',
      zh: '围绕首页、商品页、画廊、签名版和设备 mockup 完成书店体验改版。',
    },
    bullets: [
      {
        en: 'Can modernize a real brand without erasing its character.',
        zh: '能现代化真实品牌，同时保留原有气质。',
      },
      {
        en: 'Shows page hierarchy, browsing logic, and product-detail thinking.',
        zh: '体现页面层级、浏览逻辑和商品详情思维。',
      },
      {
        en: 'Presentation quality is strong enough for portfolio review.',
        zh: '展示完成度足够支撑作品集评审。',
      },
    ],
  },
}

export const getLocalizedText = (text: LocalizedText, language: 'en' | 'zh') => text[language]
