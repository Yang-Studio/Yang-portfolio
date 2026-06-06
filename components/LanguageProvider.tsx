'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'zh'

type LanguageContextValue = {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'yang-language-v2'

const DICTIONARY: Record<string, string> = {
  Work: '作品',
  'Yang Studio': 'Yang Studio',
  'Plate 01': '图版 01',
  'Plate 02': '图版 02',
  'Plate 03': '图版 03',
  'Plate 04': '图版 04',
  'Plate 05': '图版 05',
  'Plate 05 / Fin': '图版 05 / 终章',
  'Plate 02 / Index': '图版 02 / 索引',
  'Project Plate': '项目图版',
  'Overture / Game Systems': '序章 / 游戏系统',
  'Hiring Signal / Gameplay Systems': '招聘信号 / 玩法系统',
  'Projects / Complete Archive': '项目 / 完整索引',
  'Project Evidence / Hiring Read': '项目证据 / 招聘速读',
  'Biography / Timeline': '履历 / 时间线',
  'Candidate Trajectory / Hiring Fit': '候选人路径 / 岗位匹配',
  'Tools / Methods': '工具 / 方法',
  'Process / Decisions': '过程 / 决策',
  'Gallery / Artifacts': '图像 / 过程素材',
  'Results / Reflection': '结果 / 复盘',
  'Recruiter read': '招聘速读',
  'Role Fit / Evidence': '岗位匹配 / 证据',
  'What hiring teams can verify': '招聘团队可以验证',
  'Hiring fit': '岗位匹配',
  Proof: '证据',
  Signal: '信号',
  Evidence: '证据',
  'Why it matters': '为什么值得看',
  'Project Index': '项目索引',
  '7 projects on record': '收录 7 个项目',
  '9 projects on record': '收录 9 个项目',
  '10 projects on record': '收录 10 个项目',
  'A technical catalogue of game systems, prototypes, visual studies, and playable worlds.':
    '一份关于游戏系统、原型、视觉实验与可游玩世界的技术目录。',
  'Each project is framed by what a game team can hire from: role fit, proof of ownership, and the strongest production signal.':
    '每个项目都按游戏团队会招聘什么来组织：岗位匹配、负责证据和最强制作信号。',
  'Main projects.': '主要项目。',
  'Main Projects / 2024 - Now': '主要项目 / 2024 至今',
  'Recruiter Shortlist / Proof First': '招聘短名单 / 证据优先',
  'The fastest read: team production, solo ownership, and player-facing systems.':
    '最快速的阅读路径：团队制作、独立负责、面向玩家的系统。',
  'Two project plates. One team system. One solo architecture study.':
    '主要项目。',
  'I make games where the systems talk to each other.': '做会回应的游戏系统。',
  "Currently solo on Shanghe. Systems on Bubono's Bumperland.":
    '仍在开发更多 demo。',
  'Still developing more demos.': '仍在开发更多 demo。',
  'Selected work': '精选作品',
  Biography: '履历',
  'Review project evidence': '查看项目证据',
  'Team production proof': '团队制作证据',
  'Enemy AI + modular gameplay systems / UE5': '敌人 AI + 模块化玩法系统 / UE5',
  'Now showing': '当前展示',
  'Open to full-time roles': '开放全职机会',
  'Open to more opportunities': '开放更多机会',
  'Target roles': '目标岗位',
  'Hiring trajectory': '招聘视角路径',
  'STEM OPT': 'STEM OPT',
  'Sys & gameplay prog. / 2024 - now': '系统与玩法程序 / 2024.09 - 2025.05',
  'Sys & gameplay prog. / Sep 2024 - May 2025': '系统与玩法程序 / 2024.09 - 2025.05',
  'Systems first. Mood second. Cut the rest.': '',
  'SCAD. BFA Game Development and Interactive Design begins.':
    '2021 年进入 SCAD，开始游戏开发与交互设计 BFA 学习。',
  'Entered SCAD for BFA Game Development and Interactive Design.':
    '2021 年进入 SCAD，开始游戏开发与交互设计 BFA 学习。',
  'Entered SCAD for BFA Game Development and Interactive Design; built a foundation across design, programming, UX, and production.':
    '进入 SCAD 游戏开发与交互设计 BFA，建立设计、程序、UX 和制作基础。',
  'Entered SCAD for BFA Game Development and Interactive Design; built breadth across game design, programming, UX, and visual production.':
    '进入 SCAD 游戏开发与交互设计 BFA，建立游戏设计、程序、UX 和视觉制作的综合基础。',
  'Started proving solo ownership through environment studies, small systems prototypes, and readable design documentation.':
    '通过环境练习、小型系统原型和清晰设计文档，开始证明独立负责能力。',
  'Developed early prototypes and scene studies, building the habit of explaining design intent through playable or visual evidence.':
    '制作早期原型和场景练习，形成用可玩或视觉证据解释设计意图的习惯。',
  'Moved into stronger production evidence: Shanhe as a solo vertical slice and Bubono as a long-running UE5 team project.':
    '进入更强的制作证据阶段：Shanhe 是独立垂直切片，Bubono 是长期 UE5 团队项目。',
  'Built Shanhe as a solo UE5 vertical slice and joined Bubono as systems and enemy programmer on a long-running team project.':
    '完成 Shanhe 独立 UE5 垂直切片，并在长期团队项目 Bubono 中担任系统与敌人程序。',
  'Target role: gameplay systems designer, technical designer, or junior gameplay programmer on a team that values prototyping and readable player feedback.':
    '目标岗位：玩法系统设计师、技术设计师，或重视原型与清晰玩家反馈的初级玩法程序。',
  'Open to gameplay systems designer, technical designer, and junior gameplay programmer opportunities.':
    '开放玩法系统设计师、技术设计师和初级玩法程序机会。',
  "First ship. Joins Bubono's Bumperland as Systems and Gameplay Programmer.":
    '2024 年与团队开始开发 Bubono’s Bumperland。',
  "Started Bubono's Bumperland with the team.":
    '2024 年与团队开始开发 Bubono’s Bumperland。',
  'eLogistics. Warehouse simulation prototype as in-house training game.':
    'eLogistics。制作面向内部培训的仓储模拟原型。',
  'Shanghe. Solo wuxia action demo with event-driven combat architecture.':
    '《山河》。独立开发的武侠动作 Demo，采用事件驱动战斗架构。',
  'Open to full-time roles in the U.S. Work-authorized via STEM OPT.':
    '现在正在寻找更多机会。',
  'Currently looking for more opportunities.':
    '现在正在寻找更多机会。',
  'Work together?': '合作？',
  Location: '位置',
  Elsewhere: '链接',
  Colophon: '制作说明',
  'Rincon, Georgia': '佐治亚州 Rincon',
  'United States': '美国',
  'Open to relocation': '可接受搬迁',
  'Set in Fraunces and JetBrains Mono.': '字体：Fraunces / JetBrains Mono。',
  'Built with Next.js and GSAP.': '构建：Next.js / GSAP。',
  'Copyright': '版权所有',
  'Next project': '下一个项目',
  'Back to index': '返回索引',
  'Download Demo': '下载 Demo',
  Role: '职责',
  Engine: '引擎',
  Tools: '工具',
  Mode: '模式',
  Status: '状态',
  Archive: '归档',
  'Playable demo': '可玩 Demo',
  'Live web app': '在线 Web App',
  'Live App': '在线 App',
  'Interactive Demo': '交互演示',
  'Open App': '打开 App',
  'System 01': '系统 01',
  'System 02': '系统 02',
  System: '系统',
  Learned: '复盘',
  Project: '项目',
  Index: '索引',
  'Selected Work / 2024 - Now': '精选作品 / 2024 至今',
  "Bubono's Bumperland": 'Bubono 的碰碰车乐园',
  Shanhe: '山河',
  Shanghe: '山河',
  Ink: 'Ink',
  'Collision-first bumper buggy arenas across Burg, Abyss, and Big Bang with adaptive AI and upgradeable modules.':
    '以碰撞为核心的碰碰车竞技场，覆盖 Burg、Abyss、Big Bang 三个分支，并包含自适应 AI 与升级模块。',
  'Wuxia': '武侠',
  'Behavior-driven AI and modular systems for a physics-chaos arcade brawler across three themed branches.':
    '为三个主题分支搭建行为驱动 AI 与模块化系统，支撑物理混乱型街机战斗。',
  "A solo-developed wuxia action demo built around the rhythm of a fight, where combat outcomes ripple through the world's quest system.":
    '一个独立开发的武侠动作 Demo，围绕战斗节奏展开，并让战斗结果影响世界中的任务系统。',
  'Role / Sys & gameplay prog.': '职责 / 系统与玩法程序',
  'Year / 2024 - now': '年份 / 2024 至今',
  'Year / Sep 2024 - May 2025': '时间 / 2024.09 - 2025.05',
  'Mode / Team': '模式 / 团队',
  'Role / Solo design code sys': '职责 / 独立设计、程序、系统',
  'Year / 2025 - now': '年份 / 2025 至今',
  'Year / Mar 2024 - May 2024': '时间 / 2024.03 - 2024.05',
  'Mode / Solo demo': '模式 / 独立 Demo',
  'Role / UI and systems': '职责 / UI 与系统',
  'Year / 2024': '年份 / 2024',
  'Mode / 4-person team': '模式 / 4 人团队',
  'Dialogue, objective, HUD, interaction, and combat-feedback systems for a third-person facility-escape prototype.':
    '为第三人称设施逃脱原型搭建对话、目标、HUD、交互和战斗反馈系统。',
  'Systems & Enemy Programmer': '系统与敌人程序',
  'Hand-drawn': '手绘',
  'Scene Modeling': '场景建模',
  'Tower Defense': '塔防',
  'Unreal, Blueprints, RPG': 'Unreal、蓝图、RPG',
  'UE5': 'UE5',
  UE: 'UE',
  Processing: 'Processing',
  Solo: '个人项目',
  'Solo build': '个人制作',
  'Solo R&D': '个人研发',
  'Two-person team': '双人团队',
  'Game Jam project': 'Game Jam 项目',
  '4-person team': '4 人团队',
  '5-person squad': '5 人小队',
  'Sprint cycle': 'Sprint 迭代',
  'Prototype - 5 weeks': '原型 - 5 周',
  'Prototype - 4 weeks': '原型 - 4 周',
  'Prototype - 6 weeks': '原型 - 6 周',
  'R&D - 2 weeks': '研发 - 2 周',
  '48 hours': '48 小时',
  'Mar 2024 - May 2024 / 10 weeks': '2024.03 - 2024.05 / 10 周',
  'Sep 2024 - May 2025': '2024.09 - 2025.05',
  'Vertical slice - 10 weeks': '垂直切片 - 10 周',
  '2D platformer with layered scenes and hand-drawn interaction framework.':
    '手绘 2D 平台游戏，包含分层场景和手绘交互框架。',
  'Hand-drawn 2D platformer.': '制作一个手绘 2D 平台游戏原型。',
  Home: '\u9996\u9875',
  Projects: '\u9879\u76ee',
  Devlog: '\u65e5\u5fd7',
  About: '\u5173\u4e8e',
  Game: '\u6e38\u620f',
  'Game Design': '\u6e38\u620f\u8bbe\u8ba1',
  Technical: '\u6280\u672f',
  Art: '\u827a\u672f',
  'UI/UX Design': 'UI/UX \u8bbe\u8ba1',
  Photographer: '\u6444\u5f71\u5e08',
  Prototype: '\u539f\u578b',
  'App Development': 'App 开发',
  'Game Development': '游戏开发',
  'Full-stack App Developer': '全栈 App 开发',
  'Solo app development': '个人 App 开发',
  Goal: '\u76ee\u6807',
  Team: '\u56e2\u961f',
  Timeline: '\u65f6\u95f4\u8f74',
  'Technical Breakdown': '\u6280\u672f\u62c6\u89e3',
  'Case Study': '\u6848\u4f8b\u7814\u7a76',
  Gallery: '\u56fe\u5e93',
  'Playtest observations': '\u8bd5\u73a9\u89c2\u5bdf',
  'Demo shipped': 'Demo \u5df2\u53d1\u5e03',
  'Projects in progress': '\u8fdb\u884c\u4e2d\u7684\u9879\u76ee',
  'Results & Reflection': '\u7ed3\u679c\u4e0e\u53cd\u601d',
  'Creative Director': '\u521b\u610f\u603b\u76d1',
  'Game Designer': '\u6e38\u620f\u8bbe\u8ba1\u5e08',
  'Systems Designer': '\u7cfb\u7edf\u8bbe\u8ba1\u5e08',
  'Gameplay Engineer': '\u73a9\u6cd5\u5de5\u7a0b\u5e08',
  'Creative Technologist': '\u521b\u610f\u6280\u672f',
  'Technical Artist': '\u6280\u672f\u827a\u672f',
  'Level Designer': '\u5173\u5361\u8bbe\u8ba1\u5e08',
  'UI and Systems': '\u754c\u9762\u4e0e\u7cfb\u7edf',
  'AI & Systems': 'AI \u4e0e\u7cfb\u7edf',
  Designer: '\u8bbe\u8ba1\u5e08',
  'Animator and Scripter': '\u52a8\u753b/\u811a\u672c',
  'Digital Atelier': '\u4f5c\u54c1\u96c6',
  "Hi, I'm Yang -- I design and code worlds that feel alive.": '\u4f60\u597d\uff0c\u6211\u662f Yang\u2014\u2014\u6211\u8bbe\u8ba1\u5e76\u7f16\u7801\u5145\u6ee1\u751f\u547d\u529b\u7684\u4e16\u754c\u3002',
  'A personal studio exploring the space where logic meets emotion. I prototype tactile interfaces, adaptive AI, and coral-hued worlds you can feel.':
    '\u4e00\u4e2a\u63a2\u7d22\u903b\u8f91\u4e0e\u60c5\u611f\u4ea4\u6c47\u5904\u7684\u4e2a\u4eba\u5de5\u4f5c\u5ba4\u3002\u6211\u539f\u578b\u5316\u89e6\u611f\u754c\u9762\u3001\u81ea\u9002\u5e94 AI\uff0c\u4ee5\u53ca\u5e26\u6709\u73ca\u745a\u8272\u8c03\u3001\u53ef\u89e6\u53ef\u611f\u7684\u4e16\u754c\u3002',
  'Core practice': '\u6838\u5fc3\u5b9e\u8df5',
  'Systems Design': '系统设计',
  Implementation: '工程实现',
  'Team Fit': '团队匹配',
  'Core loop, rule, state, and feedback definition': '核心循环、规则、状态和反馈定义',
  'Combat, mission, UI, and pacing systems': '战斗、任务、UI 和节奏系统',
  'Prototype-first validation and iteration': '原型优先的验证与迭代',
  'Unreal Engine gameplay systems and Blueprints': 'Unreal Engine 玩法系统与蓝图',
  'Behavior trees, data tables, HUD, and interaction logic': '行为树、数据表、HUD 与交互逻辑',
  'Small tools and production support for faster iteration': '用于加速迭代的小工具与制作支持',
  'Clear documentation of decisions and tradeoffs': '清晰记录决策与取舍',
  'Comfortable moving between design, art, and engineering needs': '能在设计、美术和工程需求之间切换',
  'Reliable scope control for student, jam, and team projects': '在课程、Jam 和团队项目中有可靠范围控制',
  'Systems-driven worlds, emotionally tuned mechanics, and playtesting rituals that invite empathy.':
    '\u4ee5\u7cfb\u7edf\u9a71\u52a8\u4e16\u754c\uff0c\u8c03\u6821\u60c5\u611f\u673a\u5236\uff0c\u5e76\u7528\u6d4b\u8bd5\u4eea\u5f0f\u5f15\u53d1\u5171\u60a6\u3002',
  'Unreal + Blueprints, Unity DOTS, Houdini pipelines, and bespoke tools that keep teams flowing.':
    'Unreal + Blueprints\u3001Unity DOTS\u3001Houdini \u7ba1\u7ebf\uff0c\u8fd8\u6709\u4fdd\u6301\u56e2\u961f\u987a\u7545\u7684\u5b9a\u5236\u5de5\u5177\u3002',
  'Telemetry-driven AI, systemic storytelling, and simulations that honor the unexpected.':
    '\u9065\u6d4b\u9a71\u52a8\u7684 AI\u3001\u7cfb\u7edf\u5316\u53d9\u4e8b\uff0c\u4ee5\u53ca\u62e5\u62b1\u610f\u6599\u4e4b\u5916\u7684\u6a21\u62df\u3002',
  'Programming': '\u7f16\u7a0b',
  'Core gameplay and systems structure design': '\u6838\u5fc3\u73a9\u6cd5\u4e0e\u7cfb\u7edf\u7ed3\u6784\u8bbe\u8ba1',
  'Narrative and level pacing prototyping': '\u53d9\u4e8b\u4e0e\u5173\u5361\u8282\u594f\u539f\u578b',
  'Testable, iterative gameplay frameworks': '\u53ef\u6d4b\u8bd5\u3001\u53ef\u8fed\u4ee3\u7684\u73a9\u6cd5\u6846\u67b6',
  'Unreal Engine (Blueprints + gameplay systems)': 'Unreal Engine\uff08Blueprints + Gameplay \u7cfb\u7edf\uff09',
  'Unity (DOTS / prototyping)': 'Unity\uff08DOTS / \u539f\u578b\u5f00\u53d1\uff09',
  'Immersive Experience': '\u6c89\u6d78\u5f0f\u4f53\u9a8c',
  'Tooling and procedural pipeline setup': '\u5de5\u5177\u5316\u4e0e\u7a0b\u5e8f\u5316\u6d41\u7a0b\u642d\u5efa',
  'Behavior-driven AI design and implementation': '\u884c\u4e3a\u9a71\u52a8\u7684 AI \u8bbe\u8ba1\u4e0e\u5b9e\u73b0',
  'Modular systems architecture': '\u6a21\u5757\u5316\u7cfb\u7edf\u67b6\u6784',
  'Internal tools that serve design': '\u4e3a\u8bbe\u8ba1\u670d\u52a1\u7684\u5185\u90e8\u5de5\u5177',
  'Designer-engineer weaving play, systems, and emotion.': '\u5c06\u73a9\u6cd5\u3001\u7cfb\u7edf\u4e0e\u60c5\u611f\u7ec7\u5408\u7684\u8bbe\u8ba1\u5de5\u7a0b\u5e08\u3002',
  'I am a systems-focused game designer who also handles engineering implementation.':
    '\u6211\u662f\u4e00\u540d\u4ee5\u7cfb\u7edf\u8bbe\u8ba1\u4e3a\u6838\u5fc3\u7684\u6e38\u620f\u8bbe\u8ba1\u5e08\uff0c\u540c\u65f6\u8d1f\u8d23\u5de5\u7a0b\u5b9e\u73b0\u3002',
  'I am strongest where design and implementation meet: gameplay systems, enemy behavior, UI feedback, and prototype structure.':
    '我最强的部分在设计和实现的交界处：玩法系统、敌人行为、UI 反馈和原型结构。',
  'For a game team, the value is practical: I can take an unclear mechanic, define its rules and states, build a playable version, read the feedback, and keep the design moving without waiting for every dependency to be perfect.':
    '对游戏团队来说，我的价值是实用的：能把不清晰的机制定义成规则和状态，做出可玩版本，读取反馈，并在依赖尚未完全到位时继续推进设计。',
  'The portfolio is organized around evidence: team production in Bubono, solo ownership in Shanhe, UI/system support in AukAdyssey, fast art-to-build execution in Ink, and environment presentation in Bio-Lab.':
    '这个作品集按证据组织：Bubono 证明团队制作，Shanhe 证明独立负责，AukAdyssey 证明 UI/系统支持，Ink 证明快速从美术到可玩版本，Bio-Lab 证明环境展示。',
  'Demo Reel': '\u6f14\u793a\u96c6\u9526',
  'My work usually starts with gameplay structure, weaving in narrative, space, and interaction to build systems players can understand and explore repeatedly. I am skilled at breaking fuzzy ideas into clear rules, states, and feedback, then validating quickly through prototypes.':
    '\u6211\u7684\u5de5\u4f5c\u901a\u5e38\u4ece\u73a9\u6cd5\u7ed3\u6784\u51fa\u53d1\uff0c\u7ed3\u5408\u53d9\u4e8b\u3001\u7a7a\u95f4\u4e0e\u4ea4\u4e92\uff0c\u6784\u5efa\u53ef\u4ee5\u88ab\u73a9\u5bb6\u53cd\u590d\u7406\u89e3\u548c\u63a2\u7d22\u7684\u7cfb\u7edf\u3002\u6211\u64c5\u957f\u628a\u6a21\u7cca\u7684\u521b\u610f\u62c6\u89e3\u4e3a\u6e05\u6670\u7684\u89c4\u5219\u3001\u72b6\u6001\u4e0e\u53cd\u9988\uff0c\u5e76\u901a\u8fc7\u539f\u578b\u5feb\u901f\u9a8c\u8bc1\u3002',
  "Bubono's Bumperland\nSystems-driven RPG (core project)\nLed overall gameplay structure and core systems design\nBuilt multi-themed branching worlds (Burg / Abyss / Big Bang)\nDesigned distinct spatial pacing and play experiences under shared rules\nShanhe\nWuxia-themed systems and narrative exploration\nUsed \"jianghu relationships\" instead of numeric growth as the core driver\nDesigned choice-led storylines and branching structure\nExplored how reversal-driven narrative lands within gameplay pacing":
    "Bubono's Bumperland\n\u7cfb\u7edf\u5411 RPG\uff08\u6838\u5fc3\u9879\u76ee\uff09\n\u8d1f\u8d23\u6574\u4f53\u73a9\u6cd5\u7ed3\u6784\u4e0e\u6838\u5fc3\u7cfb\u7edf\u8bbe\u8ba1\n\u6784\u5efa\u591a\u4e3b\u9898\u5206\u652f\u4e16\u754c\uff08Burg / Abyss / Big Bang\uff09\n\u5728\u5171\u4eab\u89c4\u5219\u4e0b\uff0c\u8bbe\u8ba1\u4e0d\u540c\u7a7a\u95f4\u8282\u594f\u4e0e\u6e38\u73a9\u4f53\u9a8c\nShanhe\uff08\u5c71\u6cb3\uff09\n\u6b66\u4fa0\u9898\u6750\u7cfb\u7edf\u4e0e\u53d9\u4e8b\u63a2\u7d22\n\u4ee5\u201c\u6c5f\u6e56\u5173\u7cfb\u201d\u800c\u975e\u6570\u503c\u6210\u957f\u4f5c\u4e3a\u6838\u5fc3\u9a71\u52a8\u529b\n\u8bbe\u8ba1\u9009\u62e9\u5bfc\u5411\u7684\u5267\u60c5\u4e0e\u5206\u652f\u7ed3\u6784\n\u63a2\u7d22\u53cd\u8f6c\u5f0f\u53d9\u4e8b\u5728\u73a9\u6cd5\u8282\u594f\u4e2d\u7684\u843d\u70b9",
  'Stairs in the Woods\nEnvironmental and spatial narrative experiment\nExplored the visual and spatial contrast between a realistic forest and low-poly elements\nUsed spatial transitions and teleport structures to express world shifts\nFocused on mood and spatial experience rather than complex mechanics\nInk\n2D platform action prototype\nUsed "drawing/brushstroke" as the core interaction\nExplored how input methods directly shape combat and movement\nFocused on feedback, feel, and pacing control':
    'Stairs in the Woods\n\u73af\u5883\u4e0e\u7a7a\u95f4\u53d9\u4e8b\u5b9e\u9a8c\n\u56f4\u7ed5\u5199\u5b9e\u68ee\u6797 \u00d7 low-poly \u5143\u7d20\u7684\u89c6\u89c9\u4e0e\u7a7a\u95f4\u51b2\u7a81\n\u901a\u8fc7\u7a7a\u95f4\u8f6c\u573a\u4e0e\u4f20\u9001\u7ed3\u6784\u8868\u8fbe\u4e16\u754c\u5207\u6362\n\u805a\u7126\u60c5\u7eea\u8425\u9020\u4e0e\u7a7a\u95f4\u4f53\u9a8c\uff0c\u800c\u975e\u590d\u6742\u673a\u5236\nInk\n2D \u5e73\u53f0\u52a8\u4f5c\u539f\u578b\n\u4ee5\u201c\u7ed8\u5236/\u7b14\u89e6\u201d\u4f5c\u4e3a\u6838\u5fc3\u4ea4\u4e92\u65b9\u5f0f\n\u63a2\u7d22\u8f93\u5165\u65b9\u5f0f\u5bf9\u6218\u6597\u4e0e\u79fb\u52a8\u7684\u76f4\u63a5\u5f71\u54cd\n\u805a\u7126\u64cd\u4f5c\u53cd\u9988\u3001\u624b\u611f\u4e0e\u8282\u594f\u63a7\u5236',
  'AukAdyssey\nNarrative-driven RPG prototype\nDesigned systems around "escape and growth"\nAligned story progression with player goals\nValidated early levels and narrative pacing':
    'AukAdyssey\n\u53d9\u4e8b\u5411 RPG \u539f\u578b\n\u8bbe\u8ba1\u56f4\u7ed5\u201c\u9003\u79bb\u4e0e\u6210\u957f\u201d\u7684\u7cfb\u7edf\u7ed3\u6784\n\u5bf9\u9f50\u5267\u60c5\u63a8\u8fdb\u4e0e\u73a9\u5bb6\u76ee\u6807\n\u8fdb\u884c\u65e9\u671f\u5173\u5361\u4e0e\u53d9\u4e8b\u8282\u594f\u9a8c\u8bc1',
  Email: '\u90ae\u7bb1',
  Bluesky: 'Bluesky',
  Instagram: 'Instagram',
  GitHub: 'GitHub',
  'View Projects': '\u67e5\u770b\u9879\u76ee',
  'View More Projects': '\u67e5\u770b\u66f4\u591a\u9879\u76ee',
  'Back to Projects': '\u8fd4\u56de\u9879\u76ee\u5217\u8868',
  "Explore the rest of the studio's worlds.": '\u63a2\u7d22\u5de5\u4f5c\u5ba4\u7684\u5176\u4ed6\u4e16\u754c\u3002',
  'About Me': '\u5173\u4e8e\u6211',
  'Explore the work': '\u63a2\u7d22\u4f5c\u54c1',
  'Featured Work': '\u7cbe\u9009\u4f5c\u54c1',
  All: '\u5168\u90e8',
  'Visual / Art': '\u89c6\u89c9 / \u827a\u672f',
  'View case study': '\u67e5\u770b\u6848\u4f8b',
  'Case studies of worlds that move with you': '\u5173\u4e8e\u6d41\u52a8\u4e16\u754c\u7684\u6848\u4f8b\u7814\u7a76',
  'Browse across disciplines and dive into the narrative behind each prototype, installation, and systemic design experiment.':
    '\u8de8\u5b66\u79d1\u6d4f\u89c8\uff0c\u6df1\u5165\u6bcf\u4e2a\u539f\u578b\u3001\u88c5\u7f6e\u4e0e\u7cfb\u7edf\u8bbe\u8ba1\u5b9e\u9a8c\u7684\u8bf4\u4e8b\u7ebf\u3002',
  'View full case study': '\u67e5\u770b\u5b8c\u6574\u6848\u4f8b',
  'Find Yang across the web': '\u5728\u5404\u4e2a\u5e73\u53f0\u627e\u5230 Yang',
  'For collaboration or project ideas, feel free to reach out.': '\u5408\u4f5c\u6216\u9879\u76ee\u60f3\u6cd5\uff0c\u6b22\u8fce\u8054\u7cfb\u3002',
  "What I'm exploring now": '\u6b63\u5728\u63a2\u7d22',
  'A warm timeline': '\u6e29\u6696\u65f6\u95f4\u7ebf',
  'View resume': '\u67e5\u770b\u7b80\u5386',
  'Yang Liu | gameplay systems designer / technical designer': 'Yang Liu｜玩法系统设计师 / 技术设计师',
  'I build the bridge between design intent and playable implementation: rules, states, AI behavior, UI feedback, and prototypes that teams can evaluate.':
    '我连接设计意图与可玩实现：规则、状态、AI 行为、UI 反馈，以及团队可以评估的原型。',
  'Gameplay systems designer / technical designer roles': '玩法系统设计师 / 技术设计师岗位',
  'Junior gameplay programmer roles with design ownership': '带设计职责的初级玩法程序岗位',
  'Teams that need prototypes, readable feedback, and cross-discipline communication':
    '需要原型、清晰反馈和跨职能沟通的团队',
  'Always happy to connect and talk games.':
    '随时欢迎交流游戏相关的想法。',
  'Graduated from the Savannah College of Art and Design (SCAD) in Interactive Design and Game Development, with skills spanning both game design and systems engineering. Independently completed the full development cycle of a wuxia-themed ARPG, and served as mechanics director on a team project, leading the design and implementation of the AI system, collision mechanics, and a modular upgrade system. Brings Game Jam experience and the ability to build prototypes quickly under pressure. Proficient with UE5, Unity, C#, and Figma, balancing technical execution with user experience.':
    '毕业于萨凡纳艺术与设计学院（SCAD）互动设计与游戏开发专业，具备游戏设计与系统开发双向能力。曾独立完成武侠题材 ARPG 的全流程开发，并在团队项目中担任机制总监，主导 AI 系统、碰撞机制与模块化升级系统的设计与实现。有 Game Jam 参赛经历，能在高压环境下快速完成原型。熟悉 UE5、Unity、C# 及 Figma，兼顾技术落地与用户体验。',
  'Yang Liu | systems-focused game designer & engineer': 'Yang Liu \uff5c\u7cfb\u7edf\u5411\u6e38\u620f\u8bbe\u8ba1\u5e08\u517c\u5de5\u7a0b\u5e08',
  'I turn abstract ideas into testable, iterative gameplay through systems design and engineering.':
    '\u6211\u901a\u8fc7\u7cfb\u7edf\u8bbe\u8ba1\u4e0e\u5de5\u7a0b\u5b9e\u73b0\uff0c\u8ba9\u62bd\u8c61\u60f3\u6cd5\u771f\u6b63\u53d8\u6210\u53ef\u6d4b\u8bd5\u3001\u53ef\u8fed\u4ee3\u7684\u73a9\u6cd5\u3002',
  'Contact me': '\u8054\u7cfb\u6211',
  'Design + Code + Emotion': '\u8bbe\u8ba1 + \u4ee3\u7801 + \u60c5\u611f',
  'Yang Studio is a personal playground for experiments that feel tactile and empathetic. Every project blends systems design, expressive motion, and a touch of coral glow.':
    'Yang Studio \u662f\u4e00\u4e2a\u4e2a\u4eba\u5b9e\u9a8c\u573a\uff0c\u4e13\u6ce8\u4e8e\u89e6\u611f\u4e0e\u5171\u9e23\u7684\u4f53\u9a8c\u3002\u6bcf\u4e2a\u9879\u76ee\u90fd\u878d\u5408\u7cfb\u7edf\u8bbe\u8ba1\u3001\u5bcc\u6709\u8868\u73b0\u529b\u7684\u52a8\u6001\uff0c\u4ee5\u53ca\u4e00\u628a\u73ca\u745a\u8272\u5149\u8292\u3002',
  'Narrative Design': '\u53d9\u4e8b\u8bbe\u8ba1',
  'Story-led product narratives that guide every decision.': '\u4ee5\u6545\u4e8b\u9a71\u52a8\u7684\u4ea7\u54c1\u53d9\u4e8b\uff0c\u6307\u5bfc\u6bcf\u6b65\u51b3\u7b56\u3002',
  'UI/UX Audits': 'UI/UX \u68c0\u6d4b',
  'UI/UX audits to spot gaps in flow, accessibility, and feel.': 'UI/UX \u68c0\u6d4b\uff0c\u63a2\u6d4b\u6d41\u7a0b\u3001\u53ef\u8bbf\u6027\u4e0e\u4f53\u611f\u7f3a\u53e3\u3002',
  'Agile Development': '\u654f\u6377\u5f00\u53d1',
  'Agile development loops to ship fast while staying adaptive.': '\u654f\u6377\u8fed\u4ee3\uff0c\u4fdd\u6301\u5feb\u901f\u4ea4\u4ed8\u4e0e\u7075\u6d3b\u8c03\u6574\u3002',
  "Let's collaborate": '\u4e00\u8d77\u5408\u4f5c',
  "If you're hiring a designer who excels at level structure and pacing, please explore my projects and design process.":
    '\u5982\u679c\u4f60\u6b63\u5728\u62db\u8058\u5584\u4e8e\u5173\u5361\u7ed3\u6784\u4e0e\u8282\u594f\u63a7\u5236\u7684\u8bbe\u8ba1\u5e08\uff0c\u6b22\u8fce\u67e5\u770b\u6211\u7684\u9879\u76ee\u4e0e\u8bbe\u8ba1\u8fc7\u7a0b\u3002',
  'Explore social channels': '\u524d\u5f80\u793e\u4ea4\u9891\u9053',
  Connect: '\u8054\u7cfb',
  'No devlog notes under': '\u8be5\u5206\u7c7b\u4e0b\u6682\u65e0\u7b14\u8bb0\uff1a',
  'just yet. Try another filter.': '\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u7b5b\u9009\u3002',
}

const pseudoTranslate = (text: string, language: Language) => {
  if (language === 'en') return text
  const trimmed = text.trim()
  if (DICTIONARY[trimmed]) return DICTIONARY[trimmed]
  return text
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Language | null) : null
    if (stored) {
      requestAnimationFrame(() => {
        setLanguage(stored)
        document.documentElement.lang = stored
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'zh' : 'en'))
  }

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
      t: (text: string) => pseudoTranslate(text, language),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
