'use client'

import { createContext, useContext, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { projects } from '@/content/games/projects'
import { getLocalizedText, projectHighlights } from '@/content/games/projectHighlights'

type Sprint = {
  id: string
  label: string
  title: string
  summary: string
  media: string
  showcaseLabel: string
}

type Feature = {
  id: string
  title: string
  description: string
  media: string
}

const HIGHLIGHTS = [
  {
    title: 'Data-Driven Approach',
    body: 'Tables drive missions, combos, and shard states so we could iterate without rebuilding levels.',
  },
  {
    title: 'Animation & Blueprint Integration',
    body: 'Animation Montages, Motion Warping, and root-motion-aware Blueprints keep the combat loop fluid.',
  },
  {
    title: 'User Experience',
    body: 'Interaction polish from weapon wheel materials to mission status cues keeps combat readable.',
  },
]

const SPRINT1_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=1iBubD4p8G_3d0yOpl2h5lmnTMJRi-sm1&sz=w2000',
  coreLoop: 'https://drive.google.com/thumbnail?id=1lfjZs3BpPvinIox0X8TUoNsnr8MYes0k&sz=w2000',
  video: 'https://www.youtube.com/embed/eOY8pPk8b6Y',
  moodboard: [
    { label: 'Combat', images: ['https://drive.google.com/thumbnail?id=1N_M0H6-6UAygpqawWc2sTrouic9pphR_&sz=w2000', 'https://drive.google.com/thumbnail?id=1R4GrYGUk6sX-Jhqx1YoYbTbNTVoEHcEp&sz=w2000', 'https://drive.google.com/thumbnail?id=1y0EKYK9dEhR_vvTlKFnhb1zHgOVhr18y&sz=w2000'] },
    { label: 'Enemy', images: ['https://drive.google.com/thumbnail?id=1ZriIKW65MSYLw_qcrsDBxWNuwpm9r9yi&sz=w2000', 'https://drive.google.com/thumbnail?id=1oOUXg6wlat_pRS-ZwEMLDDRhvBVN8FKs&sz=w2000', 'https://drive.google.com/thumbnail?id=1o7Qe6J3tLOXqxojv2fixU-TOVxU-J00a&sz=w2000', 'https://drive.google.com/thumbnail?id=18C0gA-WBbc9F4slfcT4dvavRyr8aA0MF&sz=w2000'] },
    { label: 'Environment', images: ['https://drive.google.com/thumbnail?id=1Q9oHD-uUFJOjGX-vs7h89X4XrkiUYhut&sz=w2000', 'https://drive.google.com/thumbnail?id=1_ZBRQ277RadP7ubJ-GQ5LXVBgxX01DnU&sz=w2000', 'https://drive.google.com/thumbnail?id=11r44J1qsRek8thmmkXTd4Ke0vs49z_L_&sz=w2000'] },
    { label: 'Level Design', images: ['https://drive.google.com/thumbnail?id=1IRXoNr0pjwoO289HkgMHH4ZVXQMCeysW&sz=w2000', 'https://drive.google.com/thumbnail?id=1R9oPNwMD1121bdIbJNhHfd_595kFbP8x&sz=w2000', 'https://drive.google.com/thumbnail?id=1oaA_6REY0a0NUohlvAxgOXDQF8uj3s3w&sz=w2000'] },
  ],
}

const SPRINT2_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=1YZzdm8XTvJJqZunjILQbnGzyTZUmuDDN&sz=w2000',
  stylize: 'https://drive.google.com/thumbnail?id=12Q9Bc4C_htBJVMt4M1x4QLble-f1716s&sz=w2000',
  videos: [
    { title: 'Combat Clip 1', url: 'https://www.youtube.com/embed/hoagvhlAWVU' },
    { title: 'Combat Clip 2', url: 'https://www.youtube.com/embed/aZQvYqHEz4k' },
    { title: 'Combat Clip 3', url: 'https://www.youtube.com/embed/40I0EaTYJZU' },
    { title: 'Combat Clip 4', url: 'https://www.youtube.com/embed/z-uenarsLRw' },
    { title: 'Combat Clip 5', url: 'https://www.youtube.com/embed/W52PfEUAjuQ' },
  ],
  redoLevels: ['https://drive.google.com/thumbnail?id=154E8qkkZrKba8YMs81_pmgBP4w-d2cUW&sz=w2000', 'https://drive.google.com/thumbnail?id=1X4uKn1gILvryi6EgKQv38STjDYky50aq&sz=w2000'],
}

const SPRINT3_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=11FKZMaphFUtL9qSIZYqGOoloAAvDd2l6&sz=w2000',
  gameplay: 'https://www.youtube.com/embed/AN4AtcImpOY',
  specialAbility: 'https://www.youtube.com/embed/9WEfbAVvLRs',
  levels: [
    'https://drive.google.com/thumbnail?id=1ovqPqzREHhFqjRoIBKAH9HSmFpmkcVdM&sz=w2000',
    'https://drive.google.com/thumbnail?id=1pBvul5GS5XTm1y7SX7PbhkD_JB8XjDIO&sz=w2000',
    'https://drive.google.com/thumbnail?id=1HGZcBuOXOxsfZdZCiF0k3_1fkvxST0m4&sz=w2000',
  ],
  gametest: {
    text: [
      'Goal: Need more guidance to make the goal clear.',
      'Short-term goal: finish the first task and open the gate.',
      'Game control: core mechanics are combo combat and execution. Players need to use combat to complete the task. Missing: not enough sound effects.',
      "Main issues: 1) Secondary weapons sometimes fail to deal damage to enemies. 2) Kill quests are sometimes buggy. 3) NPC dialogue needs to be completed.",
      'Unfinished items: sound, menus, NPC dialogue text, environment.',
      'Plan change: I will shorten the playthrough so it ends after the first battle. If this section is finished before the end of the semester, I will add the level design section.',
    ],
    images: [
      'https://drive.google.com/thumbnail?id=1zEj3Hp3USv0JZFsQndW0zJ7Iu5vWqCXS&sz=w2000',
      'https://drive.google.com/thumbnail?id=1ROJwWcP0uk8a5H4xT3u1pM-4CcYFExR3&sz=w2000',
      'https://drive.google.com/thumbnail?id=1E703KZ_qO4v6qm08j3v1cr1zDQMuhRrM&sz=w2000',
    ],
  },
}

const SPRINT4_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=1YtkN-HNCUuzG-m6ckKamVtD0r5kaGSiS&sz=w2000',
  gameplay: 'https://www.youtube.com/embed/M5y6jh-2y2M',
  quest: {
    image: 'https://drive.google.com/thumbnail?id=1squ17aw9DjOZiYfh4sArgc10qw1fCV-w&sz=w2000',
    tasks: ['Task 1 - Destroy evil spirits: A recent storm damaged an ancient tomb near the village, causing a group of evil spirits to escape and enter the village. The village elders have noticed the unusual activity and need your help to find and destroy all the evil spirits that have infested the village.', 'Task 2 - Collect artifact fragments: The elders analyzed the strange symbols and confirmed that they were part of an ancient phylactery, pieces of which were scattered in and around the village. These phylacteries are believed to have powerful purifying abilities and are vital in the fight against evil spirits.', 'Task 3 - Activate the remaining spells: You have acquired a more powerful weapon and now need to activate the spells in various locations in the village. Each activation will trigger a wave of evil spirits. These evil spirits attempt to prevent the player from completing the ritual.', 'Task 4 - Clear the village: Once the spell is fully restored, it will be powerful enough to cleanse the entire village of evil. Remove all remaining evil spirits from the village. With peace restored, your mission is complete.'],
  },
}

const SPRINT5_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=1yCXO9I_a1ZcUlf-B6OoBDMfzRjRFCzUX&sz=w2000',
  showFunction: 'https://www.youtube.com/embed/C6gsJxjsAQk',
  gameplay: 'https://www.youtube.com/embed/AhiOhE_B5ic',
  gametest: {
    improve: ['Quests make the game feel uninteresting.', 'Want a boss fight.', "The UI doesn't seem to match."],
    highlights: ['Combat feels good', 'Weapon switching surprised players.', 'The finisher animation switch is awesome.'],
    images: ['https://drive.google.com/thumbnail?id=1UBVDnH2rcB7jSBbmv_dLIFHs1JQW60PD&sz=w2000', 'https://drive.google.com/thumbnail?id=1c54MQTMbhdEwkl93mTWLiq-1UyRj2oSV&sz=w2000'],
  },
}

const SPRINT6_MEDIA = {
  milestone: 'https://drive.google.com/thumbnail?id=1fuezlGVdSl6_qNIHfP9t4Csy3fBoC65h&sz=w2000',
  finalPolish: ['https://drive.google.com/thumbnail?id=1xwcRhaBMcU0zvrsC157ulXnlAtmoP6RD&sz=w2000', 'https://drive.google.com/thumbnail?id=1y_aiVAdx9nwmQxAOwqF32lq0scYKGLlD&sz=w2000'],
  screenshots: ['https://drive.google.com/thumbnail?id=1eDoQ9fgUZAiXTvd9MP8BaSJNnwjL-bn7&sz=w2000', 'https://drive.google.com/thumbnail?id=1BpzfThE6FQRQHOZdq8tWiEMHDgCNX5AC&sz=w2000'],
  showReel: 'https://www.youtube.com/embed/7Lbgw9pMwPo',
  postmortem:
    'We locked pacing, readability, and camera feel. Remaining risks: longer sessions need more enemy variety and sharper telegraphs. Next steps focus on mission density and performance sweeps.',
}

const SPRINTS: Sprint[] = [
  {
    id: 's1',
    label: 'Sprint 1',
    title: 'Sprint 1: Project Setup & Gameplay Level Plan',
    summary:
      'Highlighted the milestone vision, captured the core gameplay loop, gathered mood boards, and framed the initial greybox.',
    media: SPRINT1_MEDIA.milestone,
    showcaseLabel: 'Sprint 1 Milestone',
  },
  {
    id: 's2',
    label: 'Sprint 2',
    title: 'Sprint 2: Data Tables & Combat Hooks',
    summary:
      'Captured milestone render, stylized pass, five combat clips, skill tree, camera tuning, mission system shots, AI behavior, and two reworked level renders.',
    media: SPRINT2_MEDIA.milestone,
    showcaseLabel: 'Stylization & Systems',
  },
  {
    id: 's3',
    label: 'Sprint 3',
    title: 'Sprint 3: Boss Phase & Telegraphing',
    summary:
      'Captured milestone, gameplay and special ability clips, three level renders, and a gametest section with notes and captures.',
    media: SPRINT3_MEDIA.milestone,
    showcaseLabel: 'Boss Emotion Nodes',
  },
  {
    id: 's4',
    label: 'Sprint 4',
    title: 'Sprint 4: Level Dressing & Pacing',
    summary: 'Milestone render, gameplay clip, and quest section covering shard trail, UI cues, pacing, and rewards.',
    media: SPRINT4_MEDIA.milestone,
    showcaseLabel: 'Route + Lighting Pass',
  },
  {
    id: 's5',
    label: 'Sprint 5',
    title: 'Sprint 5: UX Polish & Weapon Wheel',
    summary: 'Milestone plus feature showcase and gameplay clips. Gametest notes captured with improvement points and highlights.',
    media: SPRINT5_MEDIA.milestone,
    showcaseLabel: 'UX Feedback Layer',
  },
  {
    id: 's6',
    label: 'Sprint 6',
    title: 'Sprint 6: Final Integration & Demo',
    summary:
      'Milestone, final polish shots, two screenshots, the first showreel, and a postmortem report on pacing/readability/performance.',
    media: SPRINT6_MEDIA.milestone,
    showcaseLabel: 'Vertical Slice Build',
  },
]

const OVERVIEW_CARDS = [
  { title: 'Development Cycle', items: ['Mar 2024 - May 2024 / 10 weeks', 'Mixed sprint + demo cadence'] },
  {
    title: 'Development Tools',
    items: ['Unreal Engine 5.3 + Blueprints', 'Autodesk Maya / Substance 3D Painter', 'FMOD + in-engine audio cues'],
  },
  {
    title: 'Credit',
    items: ['Asian Canal Environment + ULAT', 'LanFang Character kit', 'Marketplace animations + custom polish'],
  },
]

const FEATURES: Feature[] = [
  {
    id: 'execution',
    title: 'Execution System',
    description:
      'A tight parry/deflect window that feeds back into shard buffs. Executions trigger mood shifts, altering camera and VFX.',
    media: 'https://www.youtube.com/embed/I1ZnAsrXzbM',
  },
  {
    id: 'lock',
    title: 'Lock-On System',
    description:
      'Lock-on respects terrain height and enemy state, with motion warping to keep strikes grounded and readable.',
    media: '',
  },
  {
    id: 'mission',
    title: 'Mission System',
    description:
      'Data-driven mission steps tie shard collection, boss states, and narrative reveals together without hard-coding flows.',
    media: 'https://drive.google.com/thumbnail?id=1rbzzNQE7adROBhIfoNQCJC_QwESK_pJp&sz=w2000',
  },
  {
    id: 'wheel',
    title: 'Weapon Wheel',
    description:
      'Material-driven weapon wheel with hover, select, and cooldown states. Supports rapid swaps while keeping stamina readable.',
    media: 'https://drive.google.com/thumbnail?id=1sVBKio9OqmnqWi9VkyekUqX-4JvMx639&sz=w2000',
  },
  {
    id: 'combo',
    title: 'Combo System',
    description:
      'Structured combo management with light/heavy branches and time-window judgments. Each weapon owns a unique combo table and VFX flavor.',
    media: '',
  },
  {
    id: 'hit',
    title: 'Hit Feedback',
    description:
      'Layered hit reactions with camera kick, material swaps, and FMOD cues to sell weight while keeping timing precise.',
    media: '',
  },
]

const SHANHE_TRANSLATIONS: Record<string, string> = {
  'Case Study': '案例研究',
  'Shanhe - mood-locked Wuxia combat': '山河——情绪锁定的武侠战斗',
  'A side-scrolling action prototype where soul shards and boss emotions drive the pacing. Built to keep narrative beats and combat rhythm in sync.':
    '横版动作原型，尸魂碎片与 Boss 情绪驱动节奏，让叙事与战斗节拍同步。',
  Role: '角色',
  'Creative Director': '创意总监',
  Timeline: '时间线',
  Tools: '工具',
  'Unreal Engine 5.3 · Blueprints · Maya': 'Unreal Engine 5.3 · 蓝图 · Maya',
  'Project Overview': '项目概览',
  'Sprint Development Process': '冲刺开发流程',
  'This project was developed over a 10-week period, divided into 6 sprints. Each sprint focused on different aspects of the game development process.':
    '项目历时 10 周，分为 6 个冲刺，每个冲刺聚焦不同制作环节。',
  'Core Features & Showcase': '核心特性与展示',
  'Development Highlights': '开发亮点',
  'Data-driven combat built with animation-first polish': '数据驱动的战斗框架，优先打磨动画与表现',
  'Media coming soon.': '媒体内容即将上线。',
  'Back to projects': '返回项目列表',
  'Explore more worlds from Yang Studio.': '探索杨工作室的更多世界。',
  'View all projects': '查看全部项目',
  Close: '关闭',
  'Enlarged view': '放大预览',
  'Download Demo': '下载演示',
  'Development Cycle': '开发周期',
  'Mar 2024 - May 2024 / 10 weeks': '2024.03 - 2024.05 / 10 周',
  'Mixed sprint + demo cadence': '冲刺与演示交替节奏',
  'Development Tools': '开发工具',
  'Unreal Engine 5.3 + Blueprints': 'Unreal Engine 5.3 + 蓝图',
  'Autodesk Maya / Substance 3D Painter': 'Autodesk Maya / Substance 3D Painter',
  'FMOD + in-engine audio cues': 'FMOD + 引擎内音频提示',
  Credit: '素材来源',
  'Asian Canal Environment + ULAT': 'Asian Canal 场景 + ULAT',
  'LanFang Character kit': 'LanFang 角色包',
  'Marketplace animations + custom polish': '商城动画 + 自定义打磨',
  'Data-Driven Approach': '数据驱动方法',
  'Tables drive missions, combos, and shard states so we could iterate without rebuilding levels.': '用数据表驱动任务、连招和碎片状态，无需重建关卡即可迭代。',
  'Animation & Blueprint Integration': '动画与蓝图整合',
  'Animation Montages, Motion Warping, and root-motion-aware Blueprints keep the combat loop fluid.': '动画蒙太奇、Motion Warping 和识别根运动的蓝图让战斗循环更流畅。',
  'User Experience': '用户体验',
  'Interaction polish from weapon wheel materials to mission status cues keeps combat readable.': '从武器轮材质到任务状态提示的交互打磨，保持战斗可读性。',
  'Execution System': '处决系统',
  'A tight parry/deflect window that feeds back into shard buffs. Executions trigger mood shifts, altering camera and VFX.':
    '紧凑的弹反窗口为碎片增益供能，处决触发情绪切换，影响镜头与特效。',
  'Lock-On System': '锁定系统',
  'Lock-on respects terrain height and enemy state, with motion warping to keep strikes grounded and readable.':
    '锁定会考虑地形高度与敌人状态，并用 motion warping 让打击更贴地、更易读。',
  'Mission System': '任务系统',
  'Data-driven mission steps tie shard collection, boss states, and narrative reveals together without hard-coding flows.':
    '数据驱动的任务步骤，把碎片收集、Boss 状态与叙事揭示串起来，无需硬编码流程。',
  'Weapon Wheel': '武器轮盘',
  'Material-driven weapon wheel with hover, select, and cooldown states. Supports rapid swaps while keeping stamina readable.':
    '材质驱动的武器轮盘包含悬停、选择、冷却状态，支持快速切换并保持体力可读。',
  'Combo System': '连招系统',
  'Structured combo management with light/heavy branches and time-window judgments. Each weapon owns a unique combo table and VFX flavor.':
    '轻/重分支与时间窗口判定的组合管理，每把武器拥有独立连招表与特效风味。',
  'Hit Feedback': '打击反馈',
  'Layered hit reactions with camera kick, material swaps, and FMOD cues to sell weight while keeping timing precise.':
    '多层次受击：镜头震动、材质切换、FMOD 音效，既有重量感又保持节奏精确。',
  'Sprint 1': '冲刺 1',
  'Sprint 1: Project Setup & Gameplay Level Plan': '冲刺 1：项目搭建与玩法关卡规划',
  'Highlighted the milestone vision, captured the core gameplay loop, gathered mood boards, and framed the initial greybox.':
    '明确里程碑愿景，记录核心玩法循环，整理情绪板，并搭好首版灰盒。',
  'Sprint 1 Milestone': '冲刺 1 里程碑',
  'Sprint 2': '冲刺 2',
  'Sprint 2: Data Tables & Combat Hooks': '冲刺 2：数据表与战斗钩子',
  'Captured milestone render, stylized pass, five combat clips, skill tree, camera tuning, mission system shots, AI behavior, and two reworked level renders.':
    '完成里程碑渲染、风格化、5 段战斗剪辑、技能树、镜头调校、任务系统、AI 行为以及两版关卡重做图。',
  'Stylization & Systems': '风格化与系统',
  'Sprint 3': '冲刺 3',
  'Sprint 3: Boss Phase & Telegraphing': '冲刺 3：Boss 阶段与前摇提示',
  'Captured milestone, gameplay and special ability clips, three level renders, and a gametest section with notes and captures.':
    '完成里程碑、玩法与特技视频、三张关卡渲染，以及包含反馈记录的自测区。',
  'Boss Emotion Nodes': 'Boss 情绪节点',
  'Sprint 4': '冲刺 4',
  'Sprint 4: Level Dressing & Pacing': '冲刺 4：关卡装饰与节奏',
  'Milestone render, gameplay clip, and quest section covering shard trail, UI cues, pacing, and rewards.':
    '里程碑渲染、玩法视频，以及覆盖碎片路径、UI 提示、节奏与奖励的任务板块。',
  'Route + Lighting Pass': '路线与灯光调校',
  'Sprint 5': '冲刺 5',
  'Sprint 5: UX Polish & Weapon Wheel': '冲刺 5：UX 打磨与武器轮',
  'Milestone plus feature showcase and gameplay clips. Gametest notes captured with improvement points and highlights.':
    '里程碑、展示功能与玩法视频；记录测试反馈、改进要点与亮点。',
  'UX Feedback Layer': 'UX 反馈层',
  'Sprint 6': '冲刺 6',
  'Sprint 6: Final Integration & Demo': '冲刺 6：最终整合与演示',
  'Milestone, final polish shots, two screenshots, the first showreel, and a postmortem report on pacing/readability/performance.':
    '里程碑、最终打磨截图、两张截屏、首版展示片与关于节奏/可读性/性能的复盘。',
  'Vertical Slice Build': '垂直切片版本',
  'Milestone Photo': '里程碑截图',
  'Core Gameplay Loop': '核心玩法循环',
  'Core gameplay loop': '核心玩法循环',
  'Sprint 1 Video': '冲刺 1 视频',
  'Sprint 1 milestone': '冲刺 1 里程碑',
  'Mood Board': '情绪板',
  Combat: '战斗',
  Enemy: '敌人',
  Environment: '环境',
  'Level Design': '关卡设计',
  'Sprint 2 milestone': '冲刺 2 里程碑',
  'Sprint 3 milestone': '冲刺 3 里程碑',
  'Sprint 3 gameplay': '冲刺 3 玩法视频',
  Milestone: '里程碑',
  'Stylize Rendering': '风格化渲染',
  'Videos (5)': '视频（5）',
  'Redo Levels (2)': '重做关卡（2）',
  'Combat Clip 1': '战斗片段 1',
  'Combat Clip 2': '战斗片段 2',
  'Combat Clip 3': '战斗片段 3',
  'Combat Clip 4': '战斗片段 4',
  'Combat Clip 5': '战斗片段 5',
  'Redo level 1': '重做关卡 1',
  'Redo level 2': '重做关卡 2',
  'Gameplay Video': '玩法视频',
  'Special ability gameplay': '特技演示',
  'Special Ability Gameplay': '特技演示',
  'Level Showcase (3)': '关卡展示（3）',
  'Level 1': '关卡 1',
  'Level 2': '关卡 2',
  'Level 3': '关卡 3',
  'Gametest 1': '测试 1',
  'Gametest 2': '测试 2',
  'Gametest 3': '测试 3',
  'Gametest photo 1': '测试照片 1',
  'Gametest photo 2': '测试照片 2',
  'Gametest photo 3': '测试照片 3',
  'Self Gametest': '自我测试',
  'Goal: Need more guidance to make the goal clear.': '目标：需要更多指引提示让目标更清晰。',
  'Short-term goal: finish the first task and open the gate.': '短期目标：完成第一个任务并打开大门。',
  'Game control: core mechanics are combo combat and execution. Players need to use combat to complete the task. Missing: not enough sound effects.':
    '操作：核心机制为连招战斗与处决，玩家需用战斗推进任务；缺失：音效不足。',
  "Main issues: 1) Secondary weapons sometimes fail to deal damage to enemies. 2) Kill quests are sometimes buggy. 3) NPC dialogue needs to be completed.":
    '主要问题：1）副武器有时无法造成伤害；2）击杀任务偶尔异常；3）NPC 对话未完成。',
  'Unfinished items: sound, menus, NPC dialogue text, environment.': '未完成项：音效、菜单、NPC 对话文本、环境。',
  'Plan change: I will shorten the playthrough so it ends after the first battle. If this section is finished before the end of the semester, I will add the level design section.':
    '计划变更：缩短整体流程，只做到第一次战斗结束；若完成则再加入关卡设计部分。',
  Quest: '任务',
  'Quest overview': '任务总览',
  'Task 1 - Destroy evil spirits: A recent storm damaged an ancient tomb near the village, causing a group of evil spirits to escape and enter the village. The village elders have noticed the unusual activity and need your help to find and destroy all the evil spirits that have infested the village.':
    '任务 1 - 消灭恶灵：暴风破坏古墓，恶灵逃入村庄。长老察觉异动，需要你清除所有侵入的恶灵。',
  'Task 2 - Collect artifact fragments: The elders analyzed the strange symbols and confirmed that they were part of an ancient phylactery, pieces of which were scattered in and around the village. These phylacteries are believed to have powerful purifying abilities and are vital in the fight against evil spirits.':
    '任务 2 - 收集法器碎片：长老确认符号来自古代灵匣，碎片散落村内外，需收集以净化恶灵。',
  'Task 3 - Activate the remaining spells: You have acquired a more powerful weapon and now need to activate the spells in various locations in the village. Each activation will trigger a wave of evil spirits. These evil spirits attempt to prevent the player from completing the ritual.':
    '任务 3 - 激活残留法阵：获得更强武器后需在各处激活法阵，每次激活都会引来一波恶灵阻拦仪式。',
  'Task 4 - Clear the village: Once the spell is fully restored, it will be powerful enough to cleanse the entire village of evil. Remove all remaining evil spirits from the village. With peace restored, your mission is complete.':
    '任务 4 - 清理村落：法阵重建后可净化全村，清除剩余恶灵，恢复和平即完成任务。',
  'Feature Showcase Video': '功能演示视频',
  'Sprint 4 milestone': '冲刺 4 里程碑',
  'Sprint 4 gameplay': '冲刺 4 玩法视频',
  'Sprint 5 milestone': '冲刺 5 里程碑',
  'Sprint 5 gameplay': '冲刺 5 玩法视频',
  'Gametest Photos': '测试照片',
  'Gametest — Needs Improvement': '测试——需要改进',
  'Gametest — Highlights': '测试——亮点',
  'Quests make the game feel uninteresting.': '任务让游戏不够有趣。',
  'Want a boss fight.': '想要加入 Boss 战。',
  "The UI doesn't seem to match.": 'UI 似乎不匹配。',
  'Combat feels good': '战斗手感不错。',
  'Weapon switching surprised players.': '切换武器让他们感到惊喜。',
  'The finisher animation switch is awesome.': '处决动画切换很酷。',
  'Show Reel (first)': '首版展示片',
  'Show reel': '展示片',
  'Final Polish': '最终打磨',
  'Final polish 1': '最终打磨 1',
  'Final polish 2': '最终打磨 2',
  'Screenshots (2)': '截图（2）',
  'Screenshot 1': '截图 1',
  'Screenshot 2': '截图 2',
  'Sprint 6 milestone': '冲刺 6 里程碑',
  'Postmortem Report': '复盘报告',
  'We locked pacing, readability, and camera feel. Remaining risks: longer sessions need more enemy variety and sharper telegraphs. Next steps focus on mission density and performance sweeps.':
    '已锁定节奏、可读性与镜头手感。风险：长时间游玩需要更多敌人多样性和更明确的前摇。下一步聚焦任务密度与性能优化。',
}

const SHANHE_DOWNLOAD =
  projects.find((p) => p.slug === 'shanhe')?.download ??
  'mailto:yangliu.gmdev@gmail.com?subject=Shanhe%20Demo%20Request'
const SHANHE_DOWNLOAD_IS_FILE = SHANHE_DOWNLOAD.startsWith('/') || SHANHE_DOWNLOAD.startsWith('./')

const getDriveImageVariants = (url: string) => {
  if (!url.includes('drive.google.com')) return { primary: url, fallback: '' }
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  const idMatch = url.match(/[?&]id=([^&]+)/)
  const id = fileMatch?.[1] ?? idMatch?.[1]
  if (!id) return { primary: url, fallback: '' }
  return {
    primary: `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
    fallback: `https://lh3.googleusercontent.com/d/${id}=w2000`,
  }
}

const handleImageFallback = (event: SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget
  const fallback = target.dataset.fallbackSrc
  if (fallback && target.src !== fallback) {
    target.src = fallback
    delete target.dataset.fallbackSrc
  }
}

type LightboxContextValue = {
  open: (src: string, fallback?: string) => void
}

type LightboxImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  sizes?: string
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

function LightboxImage({ src, alt, width, height, className, sizes }: LightboxImageProps) {
  const lightbox = useContext(LightboxContext)
  const { primary: resolvedSrc, fallback: fallbackSrc } = getDriveImageVariants(src)

  if (!lightbox) {
    throw new Error('LightboxImage must be rendered inside LightboxContext')
  }

  return (
    <button
      type="button"
      onClick={() => lightbox.open(resolvedSrc, fallbackSrc)}
      className="group block h-full w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
    >
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        data-fallback-src={fallbackSrc || undefined}
        onError={handleImageFallback}
        referrerPolicy="no-referrer"
        className={`block h-full w-full cursor-zoom-in object-cover transition group-hover:brightness-105 ${className ?? ''}`}
        loading="lazy"
      />
    </button>
  )
}

type LightboxImageComponent = typeof LightboxImage

function useShanheTranslation() {
  const { language, t } = useLanguage()
  const translate = (text: string) => (language === 'zh' ? SHANHE_TRANSLATIONS[text] ?? t(text) : text)
  return { language, translate }
}

export default function ShanheClient() {
  const { language, translate } = useShanheTranslation()
  const [activeSprint, setActiveSprint] = useState<Sprint>(SPRINTS[0])
  const [activeFeature, setActiveFeature] = useState<Feature>(FEATURES.find((f) => f.id === 'combo') ?? FEATURES[0])
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [lightboxFallback, setLightboxFallback] = useState<string | null>(null)
  const projectHighlight = projectHighlights.shanhe
  const sprintSectionRef = useRef<HTMLDivElement | null>(null)
  const activeFeatureIsEmbed =
    activeFeature.media.includes('youtube.com/embed') ||
    (activeFeature.media.includes('drive.google.com/file/d/') && activeFeature.media.includes('/preview'))

  const handleSprintSelect = (sprint: Sprint) => {
    setActiveSprint(sprint)
    sprintSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <LightboxContext.Provider
      value={{
        open: (src, fallback) => {
          setLightboxSrc(src)
          setLightboxFallback(fallback || null)
        },
      }}
    >
      <div className="project-monograph-custom min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-5 py-8 sm:px-6 md:space-y-12 md:px-10 md:py-12 lg:px-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900/80 to-neutral-900">
          <div
            role="button"
            tabIndex={0}
            aria-label={translate('Shanhe mood')}
            className="absolute inset-0 cursor-zoom-in outline-none focus:ring-2 focus:ring-sky-500"
            onClick={() => {
              const { primary, fallback } = getDriveImageVariants('/assets/projects/shanhe/ITGM405_MoneyShot_4.webp')
              setLightboxSrc(primary)
              setLightboxFallback(fallback || null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                const { primary, fallback } = getDriveImageVariants('/assets/projects/shanhe/ITGM405_MoneyShot_4.webp')
                setLightboxSrc(primary)
                setLightboxFallback(fallback || null)
              }
            }}
          >
            <Image
              src="/assets/projects/shanhe/ITGM405_MoneyShot_4.webp"
              alt="Shanhe mood"
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 p-5 sm:p-8 md:flex-row md:items-end md:justify-between md:p-10">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">{translate('Case Study')}</p>
              <h1 className="font-display text-4xl md:text-5xl">{translate('Shanhe - mood-locked Wuxia combat')}</h1>
              <p className="text-lg text-neutral-200">
                {translate(
                  'A side-scrolling action prototype where soul shards and boss emotions drive the pacing. Built to keep narrative beats and combat rhythm in sync.',
                )}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                {[
                  { label: translate('Role'), value: translate('Creative Director') },
                  { label: translate('Timeline'), value: translate('Mar 2024 - May 2024 / 10 weeks') },
                  { label: translate('Tools'), value: translate('Unreal Engine 5.3 · Blueprints · Maya') },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">{item.label}</p>
                    <p className="mt-2 text-sm text-neutral-100">{item.value}</p>
                  </div>
                ))}
              </div>
              <DownloadCta href={SHANHE_DOWNLOAD} download={SHANHE_DOWNLOAD_IS_FILE} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">{translate('Project notes')}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">{translate('Creative focus')}</p>
              <h2 className="mt-3 font-display text-3xl text-white">{getLocalizedText(projectHighlight.focus, language)}</h2>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">{translate('Project evidence')}</p>
              <p className="mt-3 text-lg leading-relaxed text-neutral-200">{getLocalizedText(projectHighlight.evidence, language)}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {projectHighlight.notes.map((note, index) => (
              <div key={note.en} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-300">{translate('Note')} {String(index + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-neutral-200">{getLocalizedText(note, language)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-3xl">{translate('Project Overview')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {OVERVIEW_CARDS.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-white">{translate(card.title)}</h3>
                <ul className="mt-3 space-y-2 text-neutral-300">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{translate(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6" ref={sprintSectionRef}>
          <div className="space-y-2">
            <h2 className="font-display text-3xl">{translate('Sprint Development Process')}</h2>
            <p className="text-neutral-400">
              {translate(
                'This project was developed over a 10-week period, divided into 6 sprints. Each sprint focused on different aspects of the game development process.',
              )}
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-neutral-900 shadow-soft overflow-hidden">
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <h3 className="font-display text-2xl">{translate(activeSprint.title)}</h3>
                <p className="text-neutral-300">{translate(activeSprint.summary)}</p>
              </div>
              {activeSprint.id === 's1' ? (
                <SprintOneShowcase LightboxImage={LightboxImage} />
              ) : activeSprint.id === 's2' ? (
                <SprintTwoShowcase LightboxImage={LightboxImage} />
              ) : activeSprint.id === 's3' ? (
                <SprintThreeShowcase LightboxImage={LightboxImage} />
              ) : activeSprint.id === 's4' ? (
                <SprintFourShowcase LightboxImage={LightboxImage} />
              ) : activeSprint.id === 's5' ? (
                <SprintFiveShowcase LightboxImage={LightboxImage} />
              ) : activeSprint.id === 's6' ? (
                <SprintSixShowcase LightboxImage={LightboxImage} />
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1.05fr,1fr]">
                  <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
                    <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">
                      {translate(activeSprint.showcaseLabel)}
                    </p>
                    <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
                      <LightboxImage
                        src={activeSprint.media}
                        alt={translate(activeSprint.title)}
                        width={900}
                        height={520}
                        className=""
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-neutral-900/90 px-3 py-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SPRINTS.map((sprint) => (
                  <button
                    key={sprint.id}
                    className={`relative min-w-[90px] px-3 py-2 text-center text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                      activeSprint.id === sprint.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
                    onClick={() => handleSprintSelect(sprint)}
                    aria-current={activeSprint.id === sprint.id ? 'page' : undefined}
                    title={translate(sprint.title)}
                  >
                    <span className="block whitespace-nowrap">{translate(sprint.label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-3xl">{translate('Core Features & Showcase')}</h2>
          <div className="flex flex-wrap gap-3">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFeature.id === feature.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                }`}
                onClick={() => setActiveFeature(feature)}
              >
                {translate(feature.title)}
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
            <div className="space-y-4">
              <h3 className="font-display text-2xl">{translate(activeFeature.title)}</h3>
              <p className="text-neutral-300">{translate(activeFeature.description)}</p>
              {activeFeature.media ? (
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
                  {activeFeatureIsEmbed ? (
                    <iframe
                      src={activeFeature.media}
                      title={translate(activeFeature.title)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <LightboxImage
                      src={activeFeature.media}
                      alt={translate(activeFeature.title)}
                      width={1200}
                      height={640}
                      className=""
                    />
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-neutral-900 px-6 py-12 text-neutral-400">
                  {translate('Media coming soon.')}
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl">{translate('Development Highlights')}</h2>
            <span className="text-sm text-neutral-400">{translate('Data-driven combat built with animation-first polish')}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-600/20"
              >
                <h3 className="text-lg font-semibold text-white">{translate(item.title)}</h3>
                <p className="mt-3 text-neutral-300">{translate(item.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-neutral-100 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl text-white">{translate('Back to projects')}</h3>
              <p className="text-neutral-400">{translate('Explore more worlds from Yang Studio.')}</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <DownloadCta href={SHANHE_DOWNLOAD} download={SHANHE_DOWNLOAD_IS_FILE} />
              <Link
                href="/projects"
                className="focus-ring rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                {translate('View all projects')}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => {
            setLightboxSrc(null)
            setLightboxFallback(null)
          }}
        >
          <div
            className="relative max-h-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
              onClick={() => setLightboxSrc(null)}
            >
              {translate('Close')}
            </button>
            <img
              src={lightboxSrc}
              alt={translate('Enlarged view')}
              width={1600}
              height={900}
              data-fallback-src={lightboxFallback ?? undefined}
              onError={handleImageFallback}
              referrerPolicy="no-referrer"
              className="h-full w-full max-h-[80vh] object-contain block"
              loading="lazy"
            />
          </div>
        </div>
      )}
      </div>
    </LightboxContext.Provider>
  )
}

function SprintOneShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone Photo')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT1_MEDIA.milestone}
              alt={translate('Sprint 1 milestone')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Core Gameplay Loop')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT1_MEDIA.coreLoop}
              alt={translate('Core gameplay loop')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Sprint 1 Video')}</p>
        <div className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
          <iframe
            src={SPRINT1_MEDIA.video}
            title={translate('Sprint 1 Video')}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Mood Board')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPRINT1_MEDIA.moodboard.map((item) => (
            <div key={item.label} className="space-y-2 rounded-xl border border-white/5 bg-neutral-900 p-3">
              <div className="text-sm font-semibold text-neutral-200">{translate(item.label)}</div>
              <div className="grid grid-cols-2 gap-2">
                {item.images.map((src, idx) => (
                  <div
                    key={`${item.label}-${idx}`}
                    className="overflow-hidden rounded-lg border border-white/5 bg-neutral-900"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <LightboxImage
                      src={src}
                      alt={translate(`${item.label} mood ${idx + 1}`)}
                      width={400}
                      height={280}
                      className=""
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SprintTwoShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT2_MEDIA.milestone}
              alt={translate('Sprint 2 milestone')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Stylize Rendering')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT2_MEDIA.stylize}
              alt={translate('Stylize Rendering')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Videos (5)')}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SPRINT2_MEDIA.videos.map((video, idx) => (
            <div key={`vid-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900">
              <div className="aspect-video">
                <iframe
                  src={video.url}
                  title={translate(video.title || `Sprint 2 video ${idx + 1}`)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Redo Levels (2)')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SPRINT2_MEDIA.redoLevels.map((src, idx) => (
            <div key={`redo-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Redo level ${idx + 1}`)} width={900} height={520} className="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SprintThreeShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT3_MEDIA.milestone}
              alt={translate('Sprint 3 milestone')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gameplay Video')}</p>
            <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={SPRINT3_MEDIA.gameplay}
                title={translate('Sprint 3 gameplay')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">
              {translate('Special Ability Gameplay')}
            </p>
            <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={SPRINT3_MEDIA.specialAbility}
                title={translate('Special ability gameplay')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Level Showcase (3)')}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SPRINT3_MEDIA.levels.map((src, idx) => (
            <div key={`lvl-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Level ${idx + 1}`)} width={700} height={420} className="" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/5 bg-neutral-900 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Self Gametest')}</p>
        <div className="space-y-2 text-neutral-300">
          {SPRINT3_MEDIA.gametest.text.map((paragraph, idx) => (
            <p key={`gametest-text-${idx}`}>{translate(paragraph)}</p>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SPRINT3_MEDIA.gametest.images.map((src, idx) => (
            <div key={`gametest-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Gametest ${idx + 1}`)} width={700} height={420} className="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SprintFourShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT4_MEDIA.milestone}
              alt={translate('Sprint 4 milestone')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gameplay Video')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={SPRINT4_MEDIA.gameplay}
              title={translate('Sprint 4 gameplay')}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/5 bg-neutral-900 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Quest')}</p>
        <div className="grid gap-4 lg:grid-cols-[1.1fr,1fr]">
          <div className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT4_MEDIA.quest.image}
              alt={translate('Quest overview')}
              width={1000}
              height={600}
              className=""
            />
          </div>
          <div className="space-y-2">
            {SPRINT4_MEDIA.quest.tasks.map((task) => (
              <div
                key={task}
                className="rounded-lg border border-white/5 bg-neutral-800 px-4 py-3 text-neutral-100 shadow-inner shadow-black/20"
              >
                {translate(task)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SprintFiveShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4 lg:col-span-2">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT5_MEDIA.milestone}
              alt={translate('Sprint 5 milestone')}
              width={1200}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Feature Showcase Video')}</p>
            <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={SPRINT5_MEDIA.showFunction}
                title={translate('Feature Showcase Video')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gameplay Video')}</p>
            <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={SPRINT5_MEDIA.gameplay}
                title={translate('Sprint 5 gameplay')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gametest Photos')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SPRINT5_MEDIA.gametest.images.map((src, idx) => (
            <div key={`s5-gametest-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Gametest photo ${idx + 1}`)} width={900} height={520} className="" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-5">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gametest — Needs Improvement')}</p>
          <ul className="space-y-2 text-neutral-200">
            {SPRINT5_MEDIA.gametest.improve.map((item) => (
              <li key={item} className="rounded-lg border border-white/5 bg-neutral-800 px-3 py-2 shadow-inner shadow-black/20">
                {translate(item)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-5">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Gametest — Highlights')}</p>
          <ul className="space-y-2 text-neutral-200">
            {SPRINT5_MEDIA.gametest.highlights.map((item) => (
              <li key={item} className="rounded-lg border border-white/5 bg-neutral-800 px-3 py-2 shadow-inner shadow-black/20">
                {translate(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SprintSixShowcase({ LightboxImage }: { LightboxImage: LightboxImageComponent }) {
  const { translate } = useShanheTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Milestone')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <LightboxImage
              src={SPRINT6_MEDIA.milestone}
              alt={translate('Sprint 6 milestone')}
              width={900}
              height={520}
              className=""
            />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Show Reel (first)')}</p>
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={SPRINT6_MEDIA.showReel}
              title={translate('Show reel')}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Final Polish')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SPRINT6_MEDIA.finalPolish.map((src, idx) => (
            <div key={`s6-polish-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Final polish ${idx + 1}`)} width={900} height={520} className="" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Screenshots (2)')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SPRINT6_MEDIA.screenshots.map((src, idx) => (
            <div key={`s6-ss-${idx}`} className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
              <LightboxImage src={src} alt={translate(`Screenshot ${idx + 1}`)} width={900} height={520} className="" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/5 bg-neutral-900 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Postmortem Report')}</p>
        <p className="text-neutral-300">{translate(SPRINT6_MEDIA.postmortem)}</p>
      </div>
    </div>
  )
}

function DownloadCta({ href, download }: { href: string; download?: boolean }) {
  const { translate } = useShanheTranslation()
  const isExternal = href.startsWith('http') || href.startsWith('mailto:')
  const classes =
    'focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500'

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} aria-label={translate('Download Demo')}>
        {translate('Download Demo')}
      </a>
    )
  }

  return (
    <Link href={href} download={download} className={classes} aria-label={translate('Download Demo')}>
      {translate('Download Demo')}
    </Link>
  )
}
