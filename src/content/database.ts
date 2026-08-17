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
  title: string
  blurb: string
  role: string
  year: string
  tag: ProjectTag
  tools: string
  cover: string
  banner?: string
  moneyshot?: string
  logo?: string
  status?: string
  hidden?: boolean
  hideDownload?: boolean
  demo?: string
  download?: string
  reel?: string
  overview: { goal: string; team: string; timeline: string }
  process: ProjectProcess[]
  technical: ProjectTechnical[]
  results: { summary: string; highlights: string[]; media?: string }
}

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

export type LocalizedText = { en: string; zh: string }

export type ProjectHighlight = {
  focus: LocalizedText
  evidence: LocalizedText
  notes: LocalizedText[]
}

export type ProjectDatabaseEntry = {
  project: Project
  translation?: ProjectTranslation
  highlight?: ProjectHighlight
  gallery: string[]
}

// Each project is one complete record: English copy, Chinese copy, evidence, and gallery.
export const projectEntries = [
  {
    "project": {
      "slug": "bubono-bumperland",
      "tag": "Technical",
      "title": "Bubono's Bumperland",
      "blurb": "Drive your bumper car, drift, ram, and crash your way through Bubono’s chaotic amusement park! Battle unique enemies, collect parts to upgrade your ride, and explore three distinct zones—the Castle, the Abyss, and Space—as you uncover the secrets hidden beneath the fun and chaos.",
      "year": "2024 - 2025",
      "role": "Systems & Enemy Programmer / Technical Artist",
      "tools": "UE5",
      "cover": "https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000",
      "banner": "/assets/projects/bubono-bumperland/bubono-3.webp",
      "logo": "https://drive.google.com/thumbnail?id=1GGYWbyH34Xtk_azVj9GI-MOM09PXlndh&sz=w2000",
      "moneyshot": "https://drive.google.com/thumbnail?id=15LqVQCsOw_E80VFA-82sT1C8w-BO8uid&sz=w2000",
      "download": "https://drive.google.com/uc?export=download&id=1KxNmUpR7WxtmeoNkNUFc9yG1SJ4E_uT3",
      "overview": {
        "goal": "Developed and iterated on core gameplay systems and enemy AI.Implemented and refined post-processing effects and shaders.Collaborated with the art team to create and adjust meshes for shaders, VFX, and gameplay.Profiled and optimized game performance to improve frame rate, rendering efficiency, and overall smoothness.Helped resolve technical issues across art assets, rendering, and gameplay systems.",
        "team": "5-person squad",
        "timeline": "5 Month"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "The project’s biggest challenge was balancing physics-based collision gameplay, visual quality, and performance. High-speed vehicle collisions needed to feel chaotic and impactful while remaining controllable, and each of the three themed zones required distinct shaders and post-processing effects without placing excessive strain on performance."
        },
        {
          "title": "Solution",
          "body": "Built controlled collision and gameplay logic on top of UE5’s physics system and redesigned enemy AI around vehicle movement. I also contributed to shaders, post-processing, and technical meshes, collaborated with artists to refine assets, and continuously used profiling tools to identify and optimize rendering and runtime performance bottlenecks."
        },
        {
          "title": "Result",
          "body": "Built a stable core gameplay loop around **vehicle collision combat and enemy AI**, while improving overall performance without compromising the distinct visual identity of the three themed zones, achieving a solid balance between **gameplay, visual quality, and performance**."
        }
      ],
      "technical": [
        {
          "title": "When relying entirely on UE’s default physics collisions, vehicle impacts could feel inconsistent and difficult to control, making it hard to deliver clear and reliable combat feedback.",
          "description": "Instead of relying solely on default physics results, the collision system calculates impact responses based on both vehicles’ speeds, collision direction, and relative positions. Additional control is applied to knockback and hit feedback, while abnormal speeds and excessive impact forces are constrained to preserve the physical feel while keeping the gameplay predictable and controllable.",
          "media": "https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000"
        },
        {
          "title": "Traditional Character AI logic—“Move to Target → Attack”—doesn’t work well for bumper cars. The AI must account for vehicle orientation, speed, turning radius, and impact angle.",
          "description": "I divided enemy behavior into Targeting → Approach → Alignment → Charge → Recovery states and implemented them in a Behavior Tree. Instead of directly chasing the player’s current position, the AI determines its attack direction based on the player’s movement, then repositions after a missed collision to prevent enemies from getting stuck against walls, spinning in place, or clustering together.",
          "media": "https://drive.google.com/thumbnail?id=15LqVQCsOw_E80VFA-82sT1C8w-BO8uid&sz=w2000"
        },
        {
          "title": "To give the Castle, Abyss, and Space zones distinct visual identities, the project relied on shaders and post-processing effects, but these complex visuals could quickly increase GPU cost.",
          "description": "I used Unreal Engine’s profiling tools to identify GPU bottlenecks and optimized shader complexity, overdraw, post-processing, and expensive material nodes. Some real-time calculations were replaced with simpler material solutions or precomputed assets, while effects were prioritized based on their visual impact to maintain a balance between visual quality and performance.",
          "media": "https://drive.google.com/thumbnail?id=1RJtaZ2_J6p8XXwMxtfE1XMlYnnS5ar5C&sz=w2000"
        },
        {
          "title": "Some visual effects could not be achieved through shaders alone, requiring close coordination between mesh topology, UVs, vertex data, and material logic. Existing art assets did not always meet these technical requirements.",
          "description": "I worked backward from the shader implementation to define the required mesh structure, topology, UV layout, and material slots, then communicated those requirements with the art team. For simpler technical meshes, I created and tested them directly, reducing unnecessary iteration between art and programming.",
          "media": "/assets/projects/bubono-bumperland/bubono-windmill-arena.webp"
        }
      ],
      "results": {
        "summary": "Bubono’s Bumperland delivers a combat experience centered around vehicle collisions, integrating enemy AI, visual effects, and vehicle upgrades into a complete gameplay loop.Throughout the project, I was responsible not only for core gameplay systems and enemy development, but also contributed to shaders, post-processing, technical mesh creation, and performance optimization.",
        "highlights": [
          "Completed a full gameplay loop centered around vehicle collision combat.",
          "Built an enemy AI system designed around vehicle movement and collision mechanics.",
          "Implemented and optimized shaders, post-processing effects, and technical meshes.",
          "Balanced visual quality and runtime efficiency to improve overall performance and smoothness.",
          "Established an effective workflow across Gameplay, Rendering, and the Art Pipeline.",
          "Strengthened problem-solving and rapid iteration across programming, art, and technical art disciplines."
        ]
      }
    },
    "translation": {
      "title": "Bubono 的碰碰车乐园",
      "blurb": "驾驶你的碰碰车，漂移，冲撞，在bubono疯狂的游乐园中一路横冲直撞！挑战各具特色的敌人，收集零件并升级碰碰车，穿越城堡，深渊和宇宙三大园区，揭开隐藏在欢乐与混沌之下的秘密",
      "role": "系统与敌人程序/技术美术",
      "overviewGoal": "负责核心玩法系统与敌人 AI 的开发与迭代，后期渲染效果与 Shader 的实现和调整，与美术团队协作，制作和调整 Shader、特效及 Gameplay 所需的 Mesh，游戏性能分析与优化，改善帧率、渲染开销与整体运行流畅度。协助解决美术资产、渲染效果与 Gameplay 系统之间的技术问题。",
      "overviewTeam": "5 人团队",
      "overviewTimeline": "5个月",
      "process": [
        {
          "title": "挑战",
          "body": "项目最大的挑战是在物理碰撞玩法、视觉表现与运行性能之间取得平衡。高速车辆碰撞需要足够混乱和有冲击力，同时又必须保持可控；三个主题区域需要不同的 Shader 与后期效果，但复杂的视觉表现也会增加性能压力"
        },
        {
          "title": "方案",
          "body": "在 UE5 的基础物理系统之上加入可控的碰撞与 Gameplay 逻辑，并针对车辆运动重新设计敌人 AI。同时参与 Shader、Post Processing 与技术 Mesh 的制作，与美术协作调整资产，并通过 Profiling 持续定位和优化渲染与运行时瓶颈。"
        },
        {
          "title": "结果",
          "body": "最终建立了一套稳定的车辆碰撞战斗 + Enemy AI 核心循环，并在保留三个区域视觉特色的同时改善整体运行性能，使 Gameplay、视觉效果和性能能够在同一套系统中稳定运行。"
        }
      ],
      "technical": [
        {
          "title": "完全依赖 UE 物理碰撞时，车辆容易出现撞击反馈不稳定、力度不可控的问题，难以保证每次碰撞都有清晰的战斗反馈",
          "description": "碰撞系统上没有完全依赖默认物理结果，而是在碰撞发生后，根据双方速度、碰撞方向和相对位置计算撞击效果，并对击退与反馈进行额外控制。同时限制异常的速度和冲击结果，让碰撞既保留物理感，又具有可预测的游戏性"
        },
        {
          "title": "传统 Character AI 的“移动到目标 → 攻击”逻辑并不适合碰碰车。AI 需要考虑车辆朝向、速度、转弯半径和撞击角度",
          "description": "将敌人行为拆分为 Targeting → Approach → Alignment → Charge → Recovery 几个状态并写入到行为树中，AI 不直接追踪玩家当前位置，而是根据玩家运动状态选择攻击方向，并在撞击失败后重新调整位置，避免敌人持续贴墙、原地旋转或堆积。"
        },
        {
          "title": "为了让 Castle、Abyss、Space 三个区域拥有明显不同的视觉效果，需要使用 Shader 与 Post Processing，但复杂效果会快速增加 GPU 开销",
          "description": "使用 Unreal 的性能分析工具定位 GPU 瓶颈，并针对 Shader Complexity、Overdraw、Post Process 和高成本材质节点逐项优化。将部分实时计算转移到更简单的材质方案或预计算资源，同时根据视觉重要程度决定哪些效果值得保留。"
        },
        {
          "title": "部分视觉效果无法仅靠 Shader 完成，需要 Mesh 的拓扑、UV、Vertex 信息与材质逻辑相互配合，而现有美术资产并不一定满足技术需求",
          "description": "先从 Shader 的实现方式反推 Mesh Requirements，再与美术沟通需要的拓扑、UV、材质槽和模型结构。对于简单的技术 Mesh，则直接制作并快速验证效果，减少程序与美术之间反复修改的成本。"
        }
      ],
      "results": {
        "summary": "Bubono’s Bumperland 最终完成了以车辆碰撞为核心的战斗体验，并将敌人 AI、视觉效果与车辆升级整合进完整的 Gameplay Loop。在项目中，我不仅负责核心系统与敌人开发，也参与了 Shader、后期渲染、技术 Mesh 制作以及性能优化。",
        "highlights": [
          "完成以车辆碰撞为核心的战斗玩法与完整 Gameplay Loop",
          "构建适配车辆运动与碰撞机制的敌人 AI 系统",
          "实现并优化 Shader、Post Processing 与技术 Mesh",
          "在视觉质量与运行效率之间取得平衡，提升整体性能与流畅度",
          "打通 Gameplay、Rendering 与 Art Pipeline 之间的协作流程",
          "提升跨程序、美术与技术美术的问题定位与快速迭代能力"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "Build and refine a cohesive game experience across Gameplay, Enemy AI, Rendering, and Performance, centered around vehicle collision combat.",
        "zh": "围绕车辆碰撞战斗，构建并完善 Gameplay、Enemy AI、Rendering 与 Performance 之间的完整游戏体验。"
      },
      "evidence": {
        "en": "Served as a **Systems & Enemy Programmer / Technical Artist** on the UE5 project.",
        "zh": "在 UE5 项目中负责担任系统与敌人程序/技术美术"
      },
      "notes": [
        {
          "en": "Built a vehicle collision-based combat system, balancing impactful physics with gameplay control and predictability.",
          "zh": "构建以车辆碰撞为核心的战斗系统，在物理碰撞的冲击感与 Gameplay 可控性之间取得平衡。"
        },
        {
          "en": "Built enemy AI around vehicle movement and collision mechanics, using Behavior Trees to handle targeting, alignment, charging, and recovery.",
          "zh": "构建适配车辆运动与碰撞机制的敌人 AI，通过行为树实现追踪、对齐、冲撞与恢复等行为。"
        },
        {
          "en": "Implemented and optimized shaders, post-processing effects, and technical meshes while improving overall performance and runtime smoothness.",
          "zh": "实现并优化 Shader、Post Processing 与技术 Mesh，在保持视觉效果的同时提升整体性能与运行流畅度。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/bubono-bumperland/bubono-3.webp",
      "/assets/projects/bubono-bumperland/bubono-windmill-arena.webp",
      "/assets/projects/bubono-bumperland/bubono-1.webp",
      "/assets/projects/bubono-bumperland/bubono-2.webp",
      "/assets/projects/bubono-bumperland/bubono-5.webp",
      "/assets/projects/bubono-bumperland/bubono-7.webp",
      "/assets/projects/bubono-bumperland/bubono-11.webp",
      "/assets/projects/bubono-bumperland/bubono-asset-logo.webp",
      "/assets/projects/bubono-bumperland/bubono-prop-bomb.webp",
      "/assets/projects/bubono-bumperland/bubono-enemy-worm.webp"
    ]
  },
  {
    "project": {
      "slug": "ink",
      "tag": "Prototype",
      "title": "Ink",
      "blurb": "A 48-hour Game Jam project: a hand-drawn, ink-wash 2D platformer built and shipped within the jam window.",
      "year": "Jan 2025",
      "role": "Hand-drawn",
      "tools": "UE",
      "cover": "https://drive.google.com/thumbnail?id=1csW4phIgAJX3eKsRAHhZe5hvyUDUagd-&sz=w2000",
      "banner": "/assets/projects/ink/ScreenShot00007.webp",
      "logo": "https://drive.google.com/thumbnail?id=1UhCuWYxYqAQa-EZJmccfpZvXz4rZbris&sz=w2000",
      "moneyshot": "https://drive.google.com/thumbnail?id=1UsQNSbJ6patVl-M4YzuSKJjnPnARhUIy&sz=w2000",
      "reel": "https://drive.google.com/file/d/1QyDyQLHd1Vm5EaYH6l1sh5ZLbBvKJCq9/preview",
      "download": "https://drive.google.com/uc?export=download&id=1OXrf93ZZOZgMpkfbs7E2iYnq03n-twEm",
      "overview": {
        "goal": "Ship a readable hand-drawn 2D platformer with a consistent ink-wash look inside a 48-hour game jam.",
        "team": "Game Jam team",
        "timeline": "48 hours"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "Produce and integrate a full hand-drawn art set across multiple levels with no pipeline in place at the start of the jam."
        },
        {
          "title": "Solution",
          "body": "Split work across hand-drawn character, enemy, and parallax background layers that fed straight into three pre-blocked levels."
        },
        {
          "title": "Result",
          "body": "A complete, playable three-level build with a unified ink-wash style delivered on the deadline."
        }
      ],
      "technical": [
        {
          "title": "Hand-Drawn Asset Pipeline",
          "description": "Drew and imported character, enemy, and environment art as sprite layers, keeping the ink-wash style cohesive across every scene.",
          "media": "https://drive.google.com/thumbnail?id=1UsQNSbJ6patVl-M4YzuSKJjnPnARhUIy&sz=w2000"
        },
        {
          "title": "Layered Parallax Stages",
          "description": "Composited cloud, background, and ground layers for depth across three escalating levels, each with its own UI pass.",
          "media": "https://drive.google.com/thumbnail?id=1GO2T3zlddiAo2sJYgl8IrCIbfgDIBZiF&sz=w2000"
        },
        {
          "title": "Character & Enemy Sheets",
          "description": "Added the idle character art and boss creature artwork from the jam asset folder to show the source drawings behind the playable sprites.",
          "media": "/assets/projects/ink/ink-character-idle.webp"
        },
        {
          "title": "UI & Level Paint Pass",
          "description": "Integrated the ink-mark UI art and level-one paint pass alongside screenshots so the page shows the hand-drawn production path, not only the final build.",
          "media": "/assets/projects/ink/ink-ui-mark.webp"
        }
      ],
      "results": {
        "summary": "Finished a playable three-level hand-drawn platformer within the 48-hour jam window.",
        "highlights": [
          "Three complete levels",
          "Cohesive hand-drawn look",
          "Shipped within 48 hours"
        ]
      }
    },
    "translation": {
      "title": "Ink",
      "blurb": "一款 48 小时 Game Jam 项目：手绘水墨风格的 2D 横版平台游戏，在限时内完成并交付。",
      "role": "手绘视觉",
      "overviewGoal": "在 48 小时 Game Jam 内做出一款风格统一、读图清晰的手绘水墨 2D 平台游戏。",
      "overviewTeam": "Game Jam 团队",
      "overviewTimeline": "48 小时",
      "process": [
        {
          "title": "挑战",
          "body": "在 Jam 开始时尚无美术管线的情况下，跨多个关卡产出并整合完整的手绘素材。"
        },
        {
          "title": "方案",
          "body": "将手绘角色、敌人与视差背景层分工产出，直接接入三个预先搭好的关卡。"
        },
        {
          "title": "结果",
          "body": "按时交付了风格统一的水墨风、可玩的三关卡完整版本。"
        }
      ],
      "technical": [
        {
          "title": "手绘素材管线",
          "description": "手绘并以精灵分层导入角色、敌人与场景美术，保持各场景水墨风格一致。"
        },
        {
          "title": "分层视差关卡",
          "description": "将云层、背景与地面分层合成营造纵深，覆盖三个逐步升级的关卡，并各自配有 UI。"
        },
        {
          "title": "角色与敌人图集",
          "description": "加入 Jam 资源文件夹中的待机角色图和 Boss 生物图，展示可玩精灵背后的原始手绘素材。"
        },
        {
          "title": "UI 与关卡上色稿",
          "description": "把水墨 UI 标识与第一关上色稿接入页面，让项目不仅展示最终截图，也呈现手绘制作路径。"
        }
      ],
      "results": {
        "summary": "在 48 小时 Jam 时限内完成了一款可玩的三关卡手绘平台游戏。",
        "highlights": [
          "三个完整关卡",
          "统一的手绘风格",
          "48 小时内交付"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A 48-hour hand-drawn platformer about fast scope control and art-to-build integration.",
        "zh": "一个 48 小时手绘平台游戏，重点是快速范围控制和美术到可玩版本的整合。"
      },
      "evidence": {
        "en": "Delivered three playable levels with character, enemy, UI, and scene layers under jam constraints.",
        "zh": "在 Game Jam 限制下完成三关卡可玩版本，包含角色、敌人、UI 和场景分层。"
      },
      "notes": [
        {
          "en": "Scoped aggressively under deadline pressure.",
          "zh": "在强时间限制下做清晰取舍。"
        },
        {
          "en": "Made art-pipeline choices based on playability.",
          "zh": "根据可玩性决定美术管线取舍。"
        },
        {
          "en": "Integrated usable assets directly into a playable build.",
          "zh": "把可用素材直接接入可玩版本。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/ink/ScreenShot00005.webp",
      "/assets/projects/ink/ScreenShot00006.webp",
      "/assets/projects/ink/ScreenShot00007.webp",
      "/assets/projects/ink/ScreenShot00008.webp",
      "/assets/projects/ink/ScreenShot00009.webp",
      "/assets/projects/ink/ScreenShot00010.webp",
      "/assets/projects/ink/ink-level-l1.webp",
      "/assets/projects/ink/ink-character-idle.webp",
      "/assets/projects/ink/ink-boss.webp",
      "/assets/projects/ink/ink-ui-mark.webp",
      "/assets/projects/ink/ink-thumbnail.webp"
    ]
  },
  {
    "project": {
      "slug": "shanhe",
      "tag": "Game",
      "title": "Shanhe",
      "blurb": "Wuxia",
      "year": "2024",
      "role": "Creative Director",
      "tools": "Unreal, Blueprints, RPG",
      "cover": "https://drive.google.com/thumbnail?id=1uO6XHF9NXmsHltvswhwHtEpWUhMGHJOi&sz=w2000",
      "banner": "https://drive.google.com/thumbnail?id=1fziWjRrdu7PaTwRei4jY1-jQDoD3Aj0K&sz=w2000",
      "logo": "https://drive.google.com/thumbnail?id=1TH71UCTKr9qJJLJN9jgWYPN6YrjvJ8RS&sz=w2000",
      "moneyshot": "https://drive.google.com/thumbnail?id=1m76CP25rwHpVIXbLWPKcQncGv3AzpVLs&sz=w2000",
      "download": "https://drive.google.com/uc?export=download&id=1my4uhdvPEr4Xv3KOCFAYIJtHk7Gw7yP2",
      "overview": {
        "goal": "Build a solo wuxia action demo connecting combat outcomes, collectible shards, and the quest system.",
        "team": "Solo",
        "timeline": "Mar 2024 - May 2024 / 10 weeks"
      },
      "process": [],
      "technical": [
        {
          "title": "Shard System",
          "description": "Collectible shards trigger narrative and terrain changes; data-table hot reloads.",
          "media": "https://drive.google.com/thumbnail?id=1rM2DaDsjBCWoBnQQHyHr1QwCFBAgr0Pv&sz=w2000"
        },
        {
          "title": "NPC & Quest UI Polish",
          "description": "Integrated the local NPC conversation frames and quest-accept UI so the page documents the role-playing layer behind the combat pacing.",
          "media": "/assets/projects/shanhe/shanhe-quest-ui.webp"
        }
      ],
      "results": {
        "summary": "Template level that unifies narrative and combat pacing for future chapters.",
        "highlights": [
          "Full concept story",
          "Boss pacing validated"
        ],
        "media": "https://drive.google.com/thumbnail?id=1owiEu9EGj9dPUbw6xTiDoQlKdpxIjtbp&sz=w2000"
      }
    },
    "translation": {
      "title": "山河",
      "blurb": "武侠动作 Demo，围绕战斗节奏、处决反馈与任务系统之间的事件联动展开。",
      "role": "独立设计与开发",
      "overviewGoal": "构建独立武侠动作 Demo，验证战斗结果、碎片收集与任务系统之间的事件联动。",
      "overviewTeam": "个人项目",
      "overviewTimeline": "2024.03 - 2024.05 / 10 周",
      "process": [],
      "technical": [
        {
          "title": "碎片系统",
          "description": "可收集碎片触发叙事与空间变化，数据表支持快速调整。"
        },
        {
          "title": "NPC 与任务 UI 打磨",
          "description": "接入本地 NPC 对话帧与任务接受 UI，让页面同时展示战斗节奏背后的角色扮演层。"
        }
      ],
      "results": {
        "summary": "一个用于统一叙事节奏和战斗节奏的关卡模板。",
        "highlights": [
          "完整概念故事",
          "Boss 节奏验证"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A solo wuxia vertical slice centered on combat rhythm, mission hooks, and systemic RPG structure.",
        "zh": "一个独立完成的武侠垂直切片，核心是战斗节奏、任务触发和系统化 RPG 结构。"
      },
      "evidence": {
        "en": "Designed a 10-week prototype around combat states, weapon feedback, narrative pacing, and sprint-based iteration.",
        "zh": "用 10 周围绕战斗状态、武器反馈、叙事节奏和 Sprint 迭代完成原型。"
      },
      "notes": [
        {
          "en": "Carried the loop from concept to playable prototype.",
          "zh": "从概念到可玩原型完整推进核心循环。"
        },
        {
          "en": "Connected combat feel with mission structure and story beats.",
          "zh": "把战斗手感、任务结构和叙事节奏连在一起。"
        },
        {
          "en": "Kept the process visible through readable design documentation.",
          "zh": "通过清晰设计文档记录过程和判断。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/shanhe/ITGM405.webp",
      "/assets/projects/shanhe/ITGM405_s1_milestone.webp",
      "/assets/projects/shanhe/ITGM405_s2_milestone.webp",
      "/assets/projects/shanhe/ITGM405_s3_milestone.webp",
      "/assets/projects/shanhe/ITGM405_s4_milestone.webp",
      "/assets/projects/shanhe/ITGM405_s5_milestone.webp",
      "/assets/projects/shanhe/ITGM405_s6_milestone.webp",
      "/assets/projects/shanhe/shanhe-npc.webp",
      "/assets/projects/shanhe/shanhe-npc-2.webp",
      "/assets/projects/shanhe/shanhe-quest-ui.webp",
      "/assets/projects/shanhe/ITGM405_MoneyShot_4.webp"
    ]
  },
  {
    "project": {
      "slug": "aukadyssey",
      "tag": "Game",
      "title": "AukAdyssey",
      "blurb": "Third-person facility-escape action game starring Pip, a test-subject penguin, with melee combat and guided exploration.",
      "year": "2024",
      "role": "UI & Systems",
      "tools": "UE",
      "cover": "https://drive.google.com/thumbnail?id=1dTNcjdEGbMvsI8Ewp6yXSl1L4Wx5XZhY&sz=w2000",
      "banner": "/assets/projects/aukadyssey/ITGM356-1.webp",
      "logo": "https://drive.google.com/thumbnail?id=15Hd8odth6E4izyGXiDBoJ6Xtbu3PsKk1&sz=w2000",
      "moneyshot": "https://drive.google.com/thumbnail?id=1EFRZf-AOchFJdKelyZa3cYZ239CpWwRj&sz=w2000",
      "download": "https://drive.google.com/uc?export=download&id=112LLeYtYTa0O7vkOBUQxhxwmtiBv9wOs",
      "overview": {
        "goal": "Build the interaction, dialogue, and UI framework that keeps the escape readable while combat and pacing stay clear.",
        "team": "4-person team",
        "timeline": "Prototype - 6 weeks"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "Maintain readability and pacing across layered scenes."
        },
        {
          "title": "Solution",
          "body": "UI guidance bound to beat maps; iterated character feel."
        },
        {
          "title": "Result",
          "body": "Stable demo with consistent tone."
        }
      ],
      "technical": [
        {
          "title": "Conversation & Objective UI",
          "description": "Built the conversation-box dialogue system and on-screen objective prompts that steer the player toward the exit without breaking immersion.",
          "media": "/assets/projects/aukadyssey/ITGM356.webp"
        },
        {
          "title": "Combat Feedback & Hand-Switching",
          "description": "Wired melee attacks with switchable hands and a roll-dodge, layering punch and taking-damage audio with screen feedback so every exchange reads clearly.",
          "media": "/assets/projects/aukadyssey/ITGM356-1.webp"
        },
        {
          "title": "Interaction & HUD Systems",
          "description": "Implemented context interactions, pickups, and a HUD that ties movement, attack, and interact inputs into one readable control loop.",
          "media": "/assets/projects/aukadyssey/ITGM356-2.webp"
        },
        {
          "title": "Pip Character Art Pass",
          "description": "Added the transparent Pip character art and illustrated background from the project folder to connect the systems writeup with the game visual identity.",
          "media": "/assets/projects/aukadyssey/aukadyssey-pip.webp"
        },
        {
          "title": "Level Planning Maps",
          "description": "Included the graybox floor plan and route map to show how the escape path, rooms, and interaction beats were planned before implementation.",
          "media": "/assets/projects/aukadyssey/aukadyssey-level-plan.webp"
        }
      ],
      "results": {
        "summary": "A game demo about a lab-experiment penguin fighting through the levels to finally escape the laboratory.",
        "highlights": [
          "Playable final build delivered",
          "Dialogue and objective UI system",
          "Readable melee combat feedback"
        ]
      }
    },
    "translation": {
      "title": "AukAdyssey",
      "blurb": "第三人称逃脱动作游戏，主角是实验体企鹅 Pip，包含近战战斗与引导式探索。",
      "role": "UI 与系统",
      "overviewGoal": "搭建交互、对话与 UI 框架，让 Pip 的逃脱清晰可读，同时保持战斗与节奏明确。",
      "overviewTeam": "4 人团队",
      "overviewTimeline": "原型 - 8 周",
      "process": [
        {
          "title": "挑战",
          "body": "在分层场景中维持可读性和节奏。"
        },
        {
          "title": "方案",
          "body": "将 UI 引导绑定到节奏节点，并持续打磨角色手感。"
        },
        {
          "title": "结果",
          "body": "形成基调稳定的可玩 Demo。"
        }
      ],
      "technical": [
        {
          "title": "对话与目标 UI",
          "description": "构建对话框系统与屏幕目标提示，在不打断沉浸感的前提下引导玩家走向出口。"
        },
        {
          "title": "战斗反馈与换手",
          "description": "为近战攻击实现可切换的手部与翻滚闪避，叠加出拳与受击音效及画面反馈，让每次交锋都清晰可读。"
        },
        {
          "title": "交互与 HUD 系统",
          "description": "实现情境交互、拾取与 HUD，将移动、攻击与交互输入整合为一套可读的操作循环。"
        },
        {
          "title": "Pip 角色美术整理",
          "description": "加入透明背景的 Pip 角色图与手绘背景，让系统说明和游戏视觉身份连接起来。"
        },
        {
          "title": "关卡规划图",
          "description": "补充灰盒平面图与路线图，展示逃脱路径、房间关系和交互节奏在实现前的规划方式。"
        }
      ],
      "results": {
        "summary": "实验体企鹅在关卡内进行战斗、最终逃出实验室的游戏 Demo。",
        "highlights": [
          "交付可玩最终版本",
          "对话与目标 UI 系统",
          "可读的近战战斗反馈"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A third-person escape prototype focused on UI systems, combat readability, and guided interaction.",
        "zh": "一个第三人称逃脱原型，重点是 UI 系统、战斗可读性和引导式交互。"
      },
      "evidence": {
        "en": "Implemented dialogue, objective prompts, interaction handling, HUD structure, melee feedback, and level-planning artifacts.",
        "zh": "实现对话、目标提示、交互、HUD、近战反馈，并保留关卡规划材料。"
      },
      "notes": [
        {
          "en": "Built player-facing systems that reduce confusion during exploration.",
          "zh": "搭建降低探索困惑的面向玩家系统。"
        },
        {
          "en": "Balanced implementation with visual and level-design context.",
          "zh": "在实现、视觉和关卡语境之间保持平衡。"
        },
        {
          "en": "Shows practical support work inside a small team prototype.",
          "zh": "体现小团队原型中的实用支持工作。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/aukadyssey/ITGM356.webp",
      "/assets/projects/aukadyssey/ITGM356-1.webp",
      "/assets/projects/aukadyssey/ITGM356-2.webp",
      "/assets/projects/aukadyssey/ITGM356-3.webp",
      "/assets/projects/aukadyssey/ITGM356-4.webp",
      "/assets/projects/aukadyssey/ITGM356-5.webp",
      "/assets/projects/aukadyssey/aukadyssey-pip.webp",
      "/assets/projects/aukadyssey/aukadyssey-background.webp",
      "/assets/projects/aukadyssey/aukadyssey-level-plan.webp",
      "/assets/projects/aukadyssey/aukadyssey-map.webp"
    ]
  },
  {
    "project": {
      "slug": "terradotta",
      "tag": "Art",
      "title": "Terra Dotta × SCADpro",
      "blurb": "UX research sprint mapping the student and advisor study-abroad journey for the global-education platform Terra Dotta.",
      "year": "2024",
      "role": "UX Researcher",
      "tools": "Figma · FigJam",
      "cover": "/assets/projects/terradotta/cover.webp",
      "banner": "/assets/projects/terradotta/banner.webp",
      "moneyshot": "/assets/projects/terradotta/research.webp",
      "hideDownload": true,
      "overview": {
        "goal": "Understand how students, advisors, and staff experience study-abroad programs to surface opportunities for Terra Dotta to improve its global-engagement platform.",
        "team": "SCADpro team",
        "timeline": "Sept 9 - Oct 2, 2024"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "Terra Dotta supports study-abroad programs across hundreds of institutions, but the team needed grounded insight into how students and advisors actually move through the journey before proposing directions."
        },
        {
          "title": "Solution",
          "body": "Ran a structured research sprint: pre-kickoff framing, a customer journey map, secondary and primary research through observation, cultural probes, interviews, and sensory questions, then affinitization and brainstorming toward a midpoint synthesis."
        },
        {
          "title": "Result",
          "body": "A clustered set of insight themes and solution directions delivered at the midpoint review to guide the next design phase."
        }
      ],
      "technical": [
        {
          "title": "Customer Journey Map",
          "description": "Mapped the end-to-end study-abroad journey for students and advisors to locate friction points and opportunities before primary research.",
          "media": "/assets/projects/terradotta/journey.webp"
        },
        {
          "title": "Primary & Secondary Research",
          "description": "Combined desk research with observation, cultural probes, interviews, and sensory questions to capture how students and advisors experience the study-abroad process.",
          "media": "/assets/projects/terradotta/research.webp"
        },
        {
          "title": "Affinitization",
          "description": "Clustered hundreds of raw notes into themes and patterns to make the research actionable.",
          "media": "/assets/projects/terradotta/affinity.webp"
        },
        {
          "title": "Brainstorming & Synthesis",
          "description": "Translated insight themes into solution directions, sketched a first Terra Dotta testing website, and consolidated everything for the midpoint review.",
          "media": "/assets/projects/terradotta/brainstorm.webp"
        }
      ],
      "results": {
        "summary": "Delivered a research-backed problem framing, affinity-mapped insight themes, and early solution directions, including a first Terra Dotta testing website concept, for the midpoint review.",
        "highlights": [
          "Customer journey map",
          "Mixed-method primary research",
          "Affinity-mapped insight themes",
          "Tested website concept for midpoint"
        ]
      }
    },
    "translation": {
      "title": "Terra Dotta × SCADpro",
      "blurb": "SCADpro 用户研究冲刺，为全球教育平台 Terra Dotta 梳理学生与顾问的留学旅程。",
      "role": "用户研究",
      "overviewGoal": "理解学生、顾问与教职员工在留学项目中的体验，为 Terra Dotta 改进其全球互联平台找到机会点。",
      "overviewTeam": "SCADpro 团队",
      "overviewTimeline": "2024.09.09 - 2024.10.02",
      "process": [
        {
          "title": "挑战",
          "body": "Terra Dotta 服务着数百所院校的留学项目，团队需要在提出方向之前，真正理解学生与顾问在整个旅程中的体验。"
        },
        {
          "title": "方案",
          "body": "开展结构化研究冲刺：前期立项、绘制客户旅程图、二手与一手研究（观察、文化探针、访谈、感官问题），再做亲和图归类与头脑风暴，走向中期综合。"
        },
        {
          "title": "结果",
          "body": "在中期评审上交付归类好的洞察主题与方案方向，指导下一阶段设计。"
        }
      ],
      "technical": [
        {
          "title": "客户旅程图",
          "description": "在一手研究之前，绘制学生与顾问端到端的留学旅程，定位痛点与机会点。"
        },
        {
          "title": "一手与二手研究",
          "description": "将桌面研究与观察、文化探针、访谈、感官问题结合，捕捉学生与顾问在留学流程中的真实体验。"
        },
        {
          "title": "亲和图归类",
          "description": "把数百条原始笔记归类为主题与模式，让研究变得可落地。"
        },
        {
          "title": "头脑风暴与综合",
          "description": "把洞察主题转化为方案方向，绘制了第一版 Terra Dotta 测试网站，并在中期评审前完成整合。"
        }
      ],
      "results": {
        "summary": "在项目中期为 Terra Dotta 交付了基于研究的问题界定、亲和图洞察主题，以及包含第一版测试网站概念的初步方案方向。",
        "highlights": [
          "客户旅程图",
          "多方法一手研究",
          "亲和图归类的洞察主题",
          "面向中期评审的测试网站概念"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A UX research project about study-abroad journeys, synthesis, and stakeholder-ready communication.",
        "zh": "一个 UX 研究项目，围绕留学旅程、洞察整合和面向客户的表达展开。"
      },
      "evidence": {
        "en": "Mapped the study-abroad journey through mixed-method research, affinity mapping, and midpoint synthesis for SCADpro.",
        "zh": "在 SCADpro 项目中通过多方法研究、亲和图和中期综合梳理留学旅程。"
      },
      "notes": [
        {
          "en": "Turned ambiguous human data into design decisions.",
          "zh": "把模糊的人群数据转化为设计判断。"
        },
        {
          "en": "Built artifacts that teams and clients could act on.",
          "zh": "制作团队和客户都能执行的研究产物。"
        },
        {
          "en": "Adds UX maturity to the broader interactive portfolio.",
          "zh": "为整个互动作品集补充 UX 维度。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/terradotta/journey.webp",
      "/assets/projects/terradotta/prekickoff.webp",
      "/assets/projects/terradotta/research.webp",
      "/assets/projects/terradotta/affinity.webp",
      "/assets/projects/terradotta/brainstorm.webp",
      "/assets/projects/terradotta/midpoint.webp"
    ]
  },
  {
    "project": {
      "slug": "eshaver",
      "tag": "Art",
      "title": "E. Shaver Bookseller",
      "blurb": "UX redesign of a historic Savannah bookstore, rebuilding the home, product, and gallery pages around easier browsing and a stronger brand.",
      "year": "2025",
      "role": "UX & UI Designer",
      "tools": "Figma · FigJam",
      "cover": "/assets/projects/eshaver/es-home.webp",
      "banner": "/assets/projects/eshaver/es-home.webp",
      "moneyshot": "/assets/projects/eshaver/es-product.webp",
      "hideDownload": true,
      "overview": {
        "goal": "Improve usability, browsing, and visual appeal of the E. Shaver Bookseller site while preserving its 1975 indie-bookstore charm.",
        "team": "4-person team",
        "timeline": "UXDG 360 - Winter 2025"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "The original site made book discovery and checkout hard to navigate and underused the store strong local brand."
        },
        {
          "title": "Solution",
          "body": "Ran observation, interviews, and cultural-probe research, clustered findings through affinitization, then built information architecture and wireframes before redesigning the home, product, and gallery pages in Figma."
        },
        {
          "title": "Result",
          "body": "A clickable prototype that makes browsing intuitive while keeping the bookstore warm and local in character."
        }
      ],
      "technical": [
        {
          "title": "Home Page",
          "description": "Refined layout with simplified navigation, featured-book visuals, and clear calls to action to popular categories and offers.",
          "media": "/assets/projects/eshaver/es-home.webp"
        },
        {
          "title": "Product Page",
          "description": "Larger high-resolution imagery with zoom, streamlined descriptions and reviews, and a related-products section to aid discovery.",
          "media": "/assets/projects/eshaver/es-product.webp"
        },
        {
          "title": "Gallery & Signed Editions",
          "description": "Grid-based browsing with search and filters by genre, author, and theme, plus optimized images for fast loads.",
          "media": "/assets/projects/eshaver/es-cards.webp"
        },
        {
          "title": "Prototype Mockups",
          "description": "Placed the redesigned pages into desktop and laptop mockups to show how the bookstore experience reads in realistic presentation contexts.",
          "media": "/assets/projects/eshaver/mockup-floating-macbook.webp"
        }
      ],
      "results": {
        "summary": "Delivered a full redesign package: research, process book, executive summary, and a Figma prototype of the rebuilt home, product, and gallery pages.",
        "highlights": [
          "Home, product, and gallery redesigned",
          "Figma clickable prototype",
          "Research-backed IA and wireframes"
        ]
      }
    },
    "translation": {
      "title": "E. Shaver 书店",
      "blurb": "为萨凡纳一家历史悠久的独立书店做 UX 改版，围绕更顺畅的浏览与更鲜明的品牌重做首页、商品页与画廊页。",
      "role": "UX 与 UI 设计",
      "overviewGoal": "在保留 1975 年独立书店气质的同时，提升 E. Shaver 书店网站的易用性、浏览体验与视觉表现。",
      "overviewTeam": "4 人团队",
      "overviewTimeline": "UXDG 360 - 2025 冬季学期",
      "process": [
        {
          "title": "挑战",
          "body": "原网站让选书与结账难以导航，也没有充分利用书店本地化的品牌特色。"
        },
        {
          "title": "方案",
          "body": "通过观察、访谈与文化探针开展研究，用亲和图归类发现，再完成信息架构与线框图，最后在 Figma 中重做首页、商品页与画廊页。"
        },
        {
          "title": "结果",
          "body": "产出可点击原型，让浏览更直观，同时保留书店温暖、在地的气质。"
        }
      ],
      "technical": [
        {
          "title": "首页",
          "description": "精炼布局、简化导航，突出主打书籍视觉，并提供通往热门分类与优惠的清晰入口。"
        },
        {
          "title": "商品页",
          "description": "更大的高清图片与缩放、精简的描述与评价，以及帮助发现的相关商品模块。"
        },
        {
          "title": "画廊与签名版",
          "description": "网格化浏览，支持按类型、作者与主题搜索筛选，并优化图片以加快加载。"
        },
        {
          "title": "原型 Mockup",
          "description": "将重做后的页面放入桌面与笔记本设备 mockup 中，展示书店体验在真实展示场景里的阅读效果。"
        }
      ],
      "results": {
        "summary": "交付完整的改版成果：用户研究、过程手册、执行摘要，以及重做首页、商品页与画廊页的 Figma 原型。",
        "highlights": [
          "重做首页、商品页与画廊页",
          "Figma 可点击原型",
          "基于研究的信息架构与线框图"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A UI/UX redesign project about information architecture, browsing flow, and polished presentation.",
        "zh": "一个 UI/UX 改版项目，重点是信息架构、浏览流程和高完成度展示。"
      },
      "evidence": {
        "en": "Redesigned a bookstore experience across home, product, gallery, signed-edition, and realistic presentation mockups.",
        "zh": "围绕首页、商品页、画廊、签名版和设备 mockup 完成书店体验改版。"
      },
      "notes": [
        {
          "en": "Modernized a real brand without erasing its character.",
          "zh": "现代化真实品牌，同时保留原有气质。"
        },
        {
          "en": "Clarified page hierarchy, browsing logic, and product-detail flow.",
          "zh": "梳理页面层级、浏览逻辑和商品详情流程。"
        },
        {
          "en": "Presentation quality supports a complete case-study read.",
          "zh": "展示完成度可以支撑完整案例阅读。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/eshaver/es-home.webp",
      "/assets/projects/eshaver/es-product.webp",
      "/assets/projects/eshaver/es-product2.webp",
      "/assets/projects/eshaver/es-product3.webp",
      "/assets/projects/eshaver/es-cards.webp",
      "/assets/projects/eshaver/mockup-floating-macbook.webp",
      "/assets/projects/eshaver/mockup-imac-silver.webp",
      "/assets/projects/eshaver/mockup-retina-imac.webp",
      "/assets/projects/eshaver/mockup-imac-pro.webp"
    ]
  },
  {
    "project": {
      "slug": "pubg-signal-wheel",
      "hidden": true,
      "tag": "Technical",
      "title": "PUBG Signal Wheel Analysis",
      "blurb": "A tactical-communication system design case study for a PUBG-style signal wheel, covering interaction flow, raycast marker logic, anti-spam rules, downed-state restrictions, and season-driven DataTable configuration.",
      "year": "2026",
      "role": "System Designer",
      "tools": "System Design · DataTable · UX Flow",
      "cover": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg",
      "banner": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg",
      "moneyshot": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg",
      "hideDownload": true,
      "overview": {
        "goal": "Design a fast, accurate, and abuse-resistant in-match signal wheel for tactical battle royale communication.",
        "team": "Solo planning analysis",
        "timeline": "System proposal - V1.0"
      },
      "process": [
        {
          "title": "Challenge",
          "body": "Battle royale teams need fast non-voice communication, but the system must stay usable during combat, avoid vague markers, and prevent teammates from spamming alerts."
        },
        {
          "title": "Solution",
          "body": "Built a closed-loop system around press-drag-release input, crosshair raycast placement, automatic item identification, distance-aware 3D UI, frequency control, and state-machine restrictions."
        },
        {
          "title": "Result",
          "body": "A complete system plan that connects player input, HUD customization, world marker logic, network broadcast limits, and season-driven content configuration."
        }
      ],
      "technical": [
        {
          "title": "Input Flow & HUD Placement",
          "description": "Defined a press-to-open, drag-to-select, release-to-send flow. On mobile, the wheel sits near the fire-control area and supports custom size, position, and opacity; high-frequency signals can be split into one-tap shortcuts.",
          "media": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg"
        },
        {
          "title": "Raycast Marker & Item Recognition",
          "description": "World markers use a camera-to-crosshair raycast. Enemy and location pings use the first blocking collider, while item-sharing pings read the hit object ItemID and resolve the display name through an Item_Table instead of printing raw asset names.",
          "media": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg"
        },
        {
          "title": "Team Visibility & Anti-Spam Control",
          "description": "Teammates receive minimap markers plus 3D icons with distance labels. Icon scale remains 100% from 0-50m, shrinks to 40% from 50-200m, then clamps at 40%; players sending 3 or more signals in 5 seconds enter a 10-second self-only mute state.",
          "media": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg"
        },
        {
          "title": "DataTable & Player State Rules",
          "description": "Separated slot logic from seasonal text and audio assets through Signal_Slot_Config and Signal_Asset_Table keyed by Season_ID and Action_Type. Knocked players are downgraded to a single Help signal with raycast distance forced to 0; dead players lose all signal functions.",
          "media": "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg"
        }
      ],
      "results": {
        "summary": "Completed a V1.0 system design proposal for a tactical signal wheel that balances quick input, precise information, configurable live-ops content, and match-health safeguards.",
        "highlights": [
          "Press-drag-release signal flow",
          "Raycast and ItemID marker logic",
          "Frequency-control mute state",
          "Season-driven DataTable design"
        ]
      }
    },
    "translation": {
      "title": "PUBG 策划分析",
      "blurb": "一份面向 PUBG 类战术竞技的局内信号轮盘系统策划案，覆盖交互流、射线标点、反刷屏、倒地状态限制与赛季化配置表。",
      "role": "系统策划",
      "overviewGoal": "设计一个快速、准确、可防滥用的局内信号轮盘，让不开麦玩家也能完成高频战术沟通。",
      "overviewTeam": "个人策划分析",
      "overviewTimeline": "系统案 - V1.0",
      "process": [
        {
          "title": "问题",
          "body": "战术竞技需要快速非语音沟通，但系统必须在战斗中足够顺手，标点必须准确，同时还要防止队友恶意刷屏破坏体验。"
        },
        {
          "title": "方案",
          "body": "围绕按下呼出、拖拽选择、松开触发建立操作闭环，并加入准星射线标点、物资自动识别、距离自适应 3D UI、频控限制和状态机降级。"
        },
        {
          "title": "结果",
          "body": "形成一份闭环系统案，将玩家输入、HUD 自定义、世界坐标标点、网络同步限制和赛季化内容配置串成完整逻辑。"
        }
      ],
      "technical": [
        {
          "title": "输入流与 HUD 布局",
          "description": "采用“按下呼出 - 拖拽选择 - 松开触发”的三步流。移动端默认靠近开火键区域，并允许调整大小、位置和透明度；高频信号可拆成独立快捷键。"
        },
        {
          "title": "Raycast 标点与物资识别",
          "description": "标点从玩家相机沿准星方向发射射线，敌人和位置标记取第一个 Block 碰撞点；物资提醒读取命中物体绑定的 ItemID，再从 Item_Table 中取 Item_Name，避免直接显示模型名。"
        },
        {
          "title": "队友可见性与反刷屏",
          "description": "队友可在小地图与 3D 画面看到标点和距离。图标 0-50 米保持 100%，50-200 米线性缩到 40%，200 米外保底 40%；5 秒内发送 3 次以上信号会进入 10 秒仅自己可见的禁言状态。"
        },
        {
          "title": "配置表与状态机限制",
          "description": "用 Signal_Slot_Config 管理格子动作，用 Signal_Asset_Table 通过 Season_ID 和 Action_Type 联合索引文本与音频。倒地玩家只保留“请求救援”，并将射线距离强制设为 0，死亡后禁用全部信号。"
        }
      ],
      "results": {
        "summary": "完成一份 V1.0 局内信号轮盘系统策划案，在操作效率、信息准确度、赛季运营配置和局内生态保护之间建立清晰规则。",
        "highlights": [
          "按住拖拽释放的轮盘交互",
          "Raycast 与 ItemID 标点逻辑",
          "频控禁言机制",
          "赛季化 DataTable 配置"
        ]
      }
    },
    "highlight": {
      "focus": {
        "en": "A tactical-system design proposal focused on fast team communication, precise marker logic, and match-health safeguards.",
        "zh": "一个战术系统策划案，重点是快速团队沟通、精准标点逻辑和局内生态保护。"
      },
      "evidence": {
        "en": "Closed the system loop from input flow and raycast placement to anti-spam cooldowns, downed-state restrictions, and season-driven DataTable configuration.",
        "zh": "从输入流、射线标点到反刷屏、倒地状态限制和赛季化 DataTable 配置，完整闭合系统逻辑。"
      },
      "notes": [
        {
          "en": "Turns a common battle royale ping feature into a documented ruleset with edge cases.",
          "zh": "把常见战术竞技报点功能拆成包含边界情况的规则集。"
        },
        {
          "en": "Balances combat usability with information accuracy and abuse prevention.",
          "zh": "在战斗可用性、信息准确度和防滥用之间做平衡。"
        },
        {
          "en": "Uses data-driven thinking so live-ops text, audio, and icons can change without code rewrites.",
          "zh": "用数据驱动思维支持运营更换文本、语音和图标，而不需要改代码。"
        }
      ]
    },
    "gallery": [
      "/assets/projects/pubg-signal-wheel/pubg-signal-wheel.svg"
    ]
  }
] satisfies ProjectDatabaseEntry[]

export const projectDatabase = Object.fromEntries(
  projectEntries.map((entry) => [entry.project.slug, entry]),
) as Record<string, ProjectDatabaseEntry>

export const projects = projectEntries.map((entry) => entry.project)
export const getProjectEntry = (slug: string) => projectDatabase[slug]
export const getProject = (slug: string) => getProjectEntry(slug)?.project
export const getLocalizedText = (text: LocalizedText, language: 'en' | 'zh') => text[language]

// Shared labels used by the language provider.
export const siteDictionary: Record<string, string> = {
  "Work": "作品",
  "Plate 01": "图版 01",
  "Plate 02": "图版 02",
  "Plate 03": "图版 03",
  "Plate 04": "图版 04",
  "Plate 05": "图版 05",
  "Plate 02 / Index": "图版 02 / 索引",
  "Project Plate": "项目图版",
  "Featured Work / Game Systems": "精选作品 / 游戏系统",
  "Projects / Complete Archive": "项目 / 完整索引",
  "Project notes": "项目记录",
  "Creative Focus / Evidence": "创作重点 / 项目证据",
  "Personal Development Path": "个人发展路径",
  "Tools / Methods": "工具 / 方法",
  "Process / Decisions": "过程 / 决策",
  "Gallery / Artifacts": "图像 / 过程素材",
  "Results / Reflection": "结果 / 复盘",
  "Creative focus": "创作重点",
  "Project evidence": "项目证据",
  "Note": "记录",
  "Featured Work / Selected Projects": "精选作品 / 代表项目",
  "Three core pieces: a team production, a solo vertical slice, and a player-facing systems prototype.": "三个核心作品：一个团队制作、一个独立垂直切片、一个面向玩家的系统原型。",
  "Explore featured work": "查看精选作品",
  "Personal path": "个人路径",
  "Now showing": "当前展示",
  "Personal archive": "个人档案",
  "Entered SCAD for BFA Game Development and Interactive Design; built breadth across game design, programming, UX, and visual production.": "进入 SCAD 游戏开发与交互设计 BFA，建立游戏设计、程序、UX 和视觉制作的综合基础。",
  "Developed early prototypes and scene studies, building the habit of explaining design intent through playable or visual evidence.": "制作早期原型和场景练习，形成用可玩或视觉证据解释设计意图的习惯。",
  "Built the Shanhe demo, and served as implementation planner, systems designer, and enemy programmer on the Bubono capstone team project.": "开发 Shanhe Demo，并在毕设团队 Bubono 中担任执行策划、系统策划与敌人程序。",
  "Location": "位置",
  "Elsewhere": "链接",
  "Colophon": "制作说明",
  "Rincon, Georgia": "佐治亚州 Rincon",
  "United States": "美国",
  "Copyright": "版权所有",
  "Next project": "下一个项目",
  "Back to index": "返回索引",
  "Download Demo": "下载 Demo",
  "Role": "职责",
  "Engine": "引擎",
  "Tools": "工具",
  "Mode": "模式",
  "Status": "状态",
  "Archive": "归档",
  "Playable demo": "可玩 Demo",
  "Interactive Demo": "交互演示",
  "Playable Build": "可玩版本",
  "Open the playable build in a new window.": "在新窗口中打开可玩版本。",
  "Open Demo": "打开演示",
  "Project archive": "项目归档",
  "System": "系统",
  "Learned": "复盘",
  "Project": "项目",
  "Index": "索引",
  "Bubono's Bumperland": "Bubono 的碰碰车乐园",
  "Shanhe": "山河",
  "Ink": "Ink",
  "Wuxia": "武侠",
  "Hand-drawn": "手绘",
  "Unreal, Blueprints, RPG": "Unreal、蓝图、RPG",
  "UE5": "UE5",
  "UE": "UE",
  "Solo": "个人项目",
  "4-person team": "4 人团队",
  "5-person squad": "5 人小队",
  "Prototype - 6 weeks": "原型 - 6 周",
  "48 hours": "48 小时",
  "Mar 2024 - May 2024 / 10 weeks": "2024.03 - 2024.05 / 10 周",
  "Home": "首页",
  "About": "关于",
  "Game": "游戏",
  "Technical": "技术",
  "Art": "艺术",
  "Prototype": "原型",
  "Team": "团队",
  "Timeline": "时间轴",
  "Technical Breakdown": "技术拆解",
  "Creative Director": "创意总监",
  "Systems Design": "系统设计",
  "Implementation Planning": "执行策划",
  "Core Skills": "核心能力",
  "System decomposition": "系统拆解",
  "Player behavior analysis": "玩家行为分析",
  "MDA framework": "MDA Framework",
  "GDD writing": "GDD 编写",
  "Wireframe design": "Wireframe 设计",
  "Git / Perforce version control": "Git / Perforce 版本管理",
  "UE5 Blueprint development": "UE5 Blueprint 开发",
  "Stress testing": "压力测试",
  "Git / Perforce collaborative development": "Git / Perforce 协作开发",
  "Demo Reel": "演示集锦",
  "Email": "邮箱",
  "Bluesky": "Bluesky",
  "Instagram": "Instagram",
  "GitHub": "GitHub",
  "Find Yang across the web": "在各个平台找到 Yang",
  "View resume": "查看简历",
  "Gameplay systems and technical design practice": "玩法系统与技术设计练习",
  "Solo prototypes with design and implementation ownership": "独立负责设计与实现的原型",
  "Personal projects that connect prototypes, readable feedback, and cross-discipline communication": "连接原型、清晰反馈和跨领域表达的个人项目",
  "Always happy to connect and talk games.": "随时欢迎交流游戏相关的想法。",
  "Graduated from the Savannah College of Art and Design (SCAD), majoring in Interactive Design & Game Development with a minor in Game UX. I work across game systems design, gameplay design, and prototyping, and I am fast at standing up playable prototypes to validate core mechanics — taking a concept from requirements analysis through systems design to working features in a short cycle.": "毕业于萨凡纳艺术与设计学院（SCAD），主修互动设计与游戏开发（Interactive Design & Game Development），辅修游戏用户体验设计（Game UX）。具备游戏系统设计、玩法设计与原型开发能力，擅长快速搭建游戏原型并验证核心玩法，能够在短周期内完成从需求分析、系统设计到功能落地的完整流程。",
  "I work fluently with Unreal Engine 5, Blueprint, Unity, Python, Git, Perforce, and Figma, turning design proposals into playable content efficiently and iterating on the experience through test feedback. Most projects in this portfolio went from concept to a validated prototype within seven weeks.": "熟悉 Unreal Engine 5、Blueprint、Unity、Python、Git、Perforce 及 Figma 等开发工具，能够高效将设计方案转化为可试玩内容，并通过测试反馈持续迭代优化体验。作品集中多数项目均在 7 周内完成从概念设计到原型验证的开发流程。",
  "Connect": "联系",
  "Privacy": "隐私设置"
}

// All non-project public-page copy and metadata.
export const siteContent = {
  "identity": {
    "brand": "Yang Studio",
    "name": "Yang Liu",
    "email": "yangliu.gmdev@gmail.com",
    "githubUrl": "https://github.com/Yang-Studio",
    "location": "Rincon, Georgia",
    "country": "United States"
  },
  "seo": {
    "site": {
      "url": "https://yang-portfolio-rose.vercel.app",
      "title": "Yang Studio Monograph",
      "description": "A digital portfolio treated as a museum catalogue for game systems work.",
      "openGraphDescription": "Game systems, selected work, and technical case studies by Yang Liu.",
      "image": "/assets/projects/bubono-bumperland/bubono-1.webp"
    },
    "games": {
      "title": "Game Development -- Yang Studio",
      "description": "Game systems, gameplay engineering, prototypes, and selected production work by Yang Liu."
    },
    "projects": {
      "title": "Projects -- Yang Studio",
      "description": "Project evidence for gameplay systems, enemy AI, UI feedback, prototypes, UX research, and environment art."
    },
    "photography": {
      "title": "Photography -- Yang Studio",
      "description": "A film photography archive of portraits, landscapes, street scenes, and architecture by Yang Liu."
    },
    "about": {
      "title": "About -- Yang Studio",
      "description": "Gameplay systems designer and technical designer focused on playable implementation, AI behavior, UI feedback, and prototypes."
    },
    "privacy": {
      "title": "Privacy -- Yang Studio",
      "description": "How Yang Studio handles visitor analytics."
    }
  },
  "landing": {
    "brand": "Yang Liu · Game Systems Portfolio",
    "status": "Available for opportunities",
    "monogram": "Y",
    "areaCount": "02",
    "areaTitle": "PORTFOLIO AREAS",
    "languageTitleZh": "选择语言",
    "languageTitleEn": "Select language",
    "areaLabel": "选择作品方向 / Choose an area",
    "gameEyebrow": "Primary portfolio",
    "gameLabel": "游戏系统 / Game Systems",
    "photographyEyebrow": "Film Archive",
    "photographyLabel": "摄影 / Photography",
    "languageZh": "中文",
    "languageEn": "English",
    "privacyLink": "隐私设置 / Privacy"
  },
  "hero": {
    "name": [
      "Yang",
      "Liu"
    ],
    "watermark": "Y",
    "coordinates": [
      "41.0728 N",
      "-81.5151 W"
    ],
    "positioning": {
      "en": "A personal archive of game systems, interaction feedback, and playable prototypes shaped from rules, states, and player-facing feel.",
      "zh": "围绕游戏系统、交互反馈和可玩原型展开创作，把模糊想法拆成规则、状态与玩家能感受到的体验。"
    }
  },
  "homeTimeline": [
    {
      "year": "2021",
      "en": "Entered SCAD for BFA Game Development and Interactive Design; built a foundation across design, programming, UX, and production.",
      "zh": "进入 SCAD 游戏开发与交互设计专业，建立设计、程序、UX 与制作基础。"
    },
    {
      "year": "2023",
      "en": "Started proving solo ownership through environment studies, small systems prototypes, and readable design documentation.",
      "zh": "通过环境练习、小型系统原型与清晰设计文档，开始证明独立负责能力。"
    },
    {
      "year": "2024",
      "en": "Built Shanhe as a solo vertical slice and contributed systems, AI, and feedback design to the UE5 team project Bubono’s Bumperland.",
      "zh": "完成《山河》独立垂直切片，并在 UE5 团队项目 Bubono 中负责系统、AI 与反馈设计。"
    },
    {
      "year": "NOW",
      "en": "Continuing to build game systems, playable prototypes, and clear implementation evidence.",
      "zh": "持续制作游戏系统、可玩原型与清晰的实现证据。"
    }
  ],
  "tools": {
    "primary": [
      "Unity",
      "C#",
      "Behavior Trees",
      "Event Bus",
      "Shadergraph",
      "Git",
      "Perforce",
      "Jira",
      "Playtest",
      "State Machines"
    ],
    "secondary": [
      "Blender",
      "Maya",
      "Figma",
      "After Effects",
      "Procreate",
      "Scriptable Objects",
      "Coroutines",
      "Timeline",
      "Cinemachine",
      "Post-Processing"
    ]
  },
  "about": {
    "hero": {
      "kicker": {
        "en": "About",
        "zh": "关于"
      },
      "title": {
        "en": "Yang Liu | systems designer / implementation planner",
        "zh": "刘杨｜系统设计师 / 执行策划"
      },
      "description": {
        "en": "I build and validate game prototypes fast, taking a concept from requirements analysis through systems design to working features within a short cycle. I turn design ideas into playable builds, verify the gameplay, and refine the experience through iterative testing.",
        "zh": "擅长快速搭建并验证游戏原型，在短周期内完成从需求分析、系统设计到功能落地；将设计想法转化为可试玩版本，并通过迭代测试持续优化体验。"
      }
    },
    "biography": {
      "headline": "Gameplay systems designer with implementation ownership.",
      "body": [
        "Graduated from the Savannah College of Art and Design (SCAD), majoring in Interactive Design & Game Development with a minor in Game UX. I work across game systems design, gameplay design, and prototyping, and I am fast at standing up playable prototypes to validate core mechanics — taking a concept from requirements analysis through systems design to working features in a short cycle.",
        "I work fluently with Unreal Engine 5, Blueprint, Unity, Python, Git, Perforce, and Figma, turning design proposals into playable content efficiently and iterating on the experience through test feedback. Most projects in this portfolio went from concept to a validated prototype within seven weeks."
      ],
      "now": [
        "Gameplay systems and technical design practice",
        "Solo prototypes with design and implementation ownership",
        "Personal projects that connect prototypes, readable feedback, and cross-discipline communication"
      ],
      "resumeUrl": "https://drive.google.com/file/d/1BFqy3TR7uMUm-4KcGh4al2vgEWXbj985/view?usp=drive_link",
      "resumeUrlZh": "/resume-zh.pdf"
    },
    "coreSkills": [
      {
        "label": "Systems Design",
        "items": [
          "System decomposition",
          "Player behavior analysis",
          "MDA framework"
        ]
      },
      {
        "label": "Implementation Planning",
        "items": [
          "GDD writing",
          "Wireframe design",
          "Git / Perforce version control"
        ]
      },
      {
        "label": "Core Skills",
        "items": [
          "UE5 Blueprint development",
          "Stress testing",
          "Git / Perforce collaborative development"
        ]
      }
    ],
    "timeline": [
      {
        "year": "2021",
        "blurb": "Entered SCAD for BFA Game Development and Interactive Design; built breadth across game design, programming, UX, and visual production."
      },
      {
        "year": "2023",
        "blurb": "Developed early prototypes and scene studies, building the habit of explaining design intent through playable or visual evidence."
      },
      {
        "year": "2024",
        "blurb": "Built the Shanhe demo, and served as implementation planner, systems designer, and enemy programmer on the Bubono capstone team project."
      },
      {
        "year": "NOW",
        "blurb": "Continuing to build game systems, playable prototypes, and clear implementation evidence."
      }
    ],
    "socialLinks": [
      {
        "platform": "Email",
        "handle": "Yangliu.gmdev@gmail.com",
        "href": "mailto:Yangliu.gmdev@gmail.com",
        "description": ""
      },
      {
        "platform": "Bluesky",
        "handle": "@yangl-04.bsky.social",
        "href": "https://bsky.app/profile/yangl-04.bsky.social",
        "description": ""
      },
      {
        "platform": "Instagram",
        "handle": "@yangliu_leric",
        "href": "https://www.instagram.com/yangliu_leric/",
        "description": ""
      },
      {
        "platform": "GitHub",
        "handle": "yang-studio",
        "href": "https://github.com/Yang-Studio",
        "description": ""
      }
    ]
  },
  "footer": {
    "privacyNotice": "本站默认记录访问明细，包含原始 IP 及由 IP 推断的大致位置（城市级）。可随时在隐私设置中拒绝；拒绝后仅保留不含个人标识的匿名总浏览量。"
  },
  "adminLogin": {
    "open": "管理员登录 / Admin login",
    "close": "关闭管理员登录 / Close admin login",
    "passwordLabel": "管理员密码",
    "passwordPlaceholder": "密码 / Password",
    "pending": "登录中",
    "submit": "登录",
    "privacyLink": "隐私设置 / Privacy",
    "loginFailed": "登录失败。",
    "connectionFailed": "无法连接登录服务。"
  },
  "protectedProject": {
    "eyebrow": "Protected case study",
    "passwordLabel": "项目访问密码",
    "passwordPlaceholder": "输入项目密码 / Password",
    "pending": "验证中...",
    "submit": "进入项目",
    "openFailed": "无法打开项目页面。",
    "connectionFailed": "无法连接项目访问服务。",
    "setupTitle": "Setup required",
    "setupDescription": "请在服务器环境变量中配置 TERRADOTTA_PASSWORD。"
  },
  "ui": {
    "toggleLanguage": "Toggle language",
    "closeLightbox": "Close lightbox",
    "downloadDemo": "Download demo"
  },
  "privacy": {
    "eyebrow": "Privacy / 隐私说明",
    "title": "访问统计",
    "paragraphs": [
      "本网站默认记录访问明细。你可以随时在下方选择“拒绝”，明细记录会立即停止；拒绝不会影响游戏、摄影或其他公开内容的使用。",
      "默认记录的内容包括：你的原始 IP 地址、由 IP 推断的国家/地区/城市/洲与时区（城市级，仅为粗略估计，可能不准确）、访问页面、访问时间、设备类别和来源网站。为便于汇总，系统同时保存 IP 与匿名访客 ID 的哈希值；这些数据存储在仅管理员可见的数据库中。",
      "即使你选择拒绝，本站仍会保留一个匿名总浏览量计数（按日期与页面累计），但其中不包含任何个人标识——不记录 IP、IP 哈希、访客 ID 或地理位置。该计数无法用于识别或追踪个人。",
      "IP 地理定位只能精确到城市级，本站无法借此获取你的家庭住址、精确经纬度、姓名、邮箱或登录账号。",
      "访问记录保留 180 天后自动删除。统计数据仅在管理员登录后的后台中可见，不向第三方出售或公开。",
      "By default this site records your raw IP address, an approximate IP-based location (city level), the pages you view, timestamps, device type, and referrer. Hashes of the IP and an anonymous visitor id are also stored for aggregation. You can decline below at any time, after which only an anonymous page-view count without personal identifiers is kept."
    ],
    "controls": {
      "eyebrow": "Privacy controls",
      "title": "统计偏好",
      "statusAccepted": "当前状态：已允许匿名统计",
      "statusDeclined": "当前状态：已拒绝匿名统计",
      "statusUnset": "当前状态：尚未选择",
      "accept": "允许匿名统计",
      "decline": "拒绝并清除匿名标识"
    }
  }
} as const
