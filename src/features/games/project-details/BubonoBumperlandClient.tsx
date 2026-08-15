'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { projects } from '@/content/games/projects'
import { getLocalizedText, projectHighlights } from '@/content/games/projectHighlights'

type Branch = {
  id: string
  title: string
  theme: string
  threats: string[]
  systems: string
}

const BRANCHES: Branch[] = [
  {
    id: 'burg',
    title: "Bubono's Burg",
    theme: 'Medieval fantasy kingdom of ramparts, banners, and jousting lanes.',
    threats: [
      'Shielded jousters and battering-ram carts force tight drift timings.',
      'Castle walls and portcullis traps turn every rebound into positioning pressure.',
      "Behavior nodes favor circling flanks, reacting to the player's braking and feints.",
    ],
    systems: 'Crowd-control collisions, angled ricochets, and shield-break cues keep Burg arenas legible and loud.',
  },
  {
    id: 'abyss',
    title: "Bubono's Abyss",
    theme: 'Fiery underworld full of volatile machinery and chain-lift hazards.',
    threats: [
      'Heat vents and grinders punish greedy drift lines.',
      'Enemy buggies swap aggression when players cling to safe lanes for too long.',
      'Flame jets and moving platforms demand rhythm-aligned dodges.',
    ],
    systems: 'Volatility modifiers spike physics force and FMOD layers when the arena overheats.',
  },
  {
    id: 'big-bang',
    title: "Bubono's Big Bang",
    theme: 'Cosmic frontier at the edge of reality with anti-grav pockets.',
    threats: [
      'Low-gravity arcs stretch collision windows, rewarding preloaded momentum.',
      'AI reads air time to counter with slam waves or bait parries.',
      'Space dust trails visualize enemy intent as they adapt to player routes.',
    ],
    systems: 'Variable gravity curves and motion-warp assists keep aerial rebounds readable.',
  },
]

const BRANCH_GALLERY: Record<string, string[]> = {
  burg: ['https://drive.google.com/thumbnail?id=15LqVQCsOw_E80VFA-82sT1C8w-BO8uid&sz=w2000', 'https://drive.google.com/thumbnail?id=1w8ySFEHxfFpmxyEOztLpXT2hm5o-4YEa&sz=w2000'],
  abyss: ['https://drive.google.com/thumbnail?id=1RJtaZ2_J6p8XXwMxtfE1XMlYnnS5ar5C&sz=w2000', 'https://drive.google.com/thumbnail?id=1-DcE0UwJvqpxqmLjH11Yh9nLYMV8WMda&sz=w2000'],
  'big-bang': ['https://drive.google.com/thumbnail?id=1GGYWbyH34Xtk_azVj9GI-MOM09PXlndh&sz=w2000', 'https://drive.google.com/thumbnail?id=1bUtT60NSa5T7XbPpqPSKbZ8QR0JxLfod&sz=w2000'],
}

const DEMO_REEL_URL = 'https://bubono-bumperland.github.io/asset/Game%20Trailer.mp4'
const ART_BOOK_URL = 'https://drive.google.com/uc?export=download&id=1k5vRi2izFHrsEnUntEVCUowWiq2KqdnL'
const GDD_URL = 'https://drive.google.com/uc?export=download&id=1iwH6XYeu-4HMkN6A_S3z_0-ffAa1CdHK'

const FEATURE_PILLARS = [
  {
    title: 'Bumping & Crashing Combat',
    body: "Experience high-impact, physics-driven encounters with Bubono's signature Bumper Buggies—vehicles built for chaotic collisions, drifting impacts, and arena-style engagements.",
  },
  {
    title: 'Smart & Stylized Enemies',
    body: 'Each park branch introduces theme-specific enemy archetypes powered by behavior-driven AI that adapts to player movement, environment layout, and combat rhythm.',
  },
  {
    title: 'Upgradeable Abilities',
    body: 'As a mechanic, players collect components from defeated foes, unlocking new vehicle upgrades, special modules, and personalized bumper builds.',
  },
]

const ROLE_CARDS = [
  {
    title: 'Enemy & AI Development',
    body: 'Designed and implemented behavior trees, state-driven movement patterns, and reactive combat logic to create engaging, readable enemy encounters.',
  },
  {
    title: 'Systems Architecture',
    body: 'Built modular systems enabling upgrades, vehicle enhancements, and dynamic collision responses.',
  },
  {
    title: 'Stylized Rendering Support',
    body: 'Assisted in creating consistent visual–mechanical coherence across all park branches through shader tuning, rendering behaviors, and thematic effects.',
  },
]



const BUMPER_TRANSLATIONS: Record<string, string> = {
  "Team Project | Systems & Enemy Programmer / Technical Artist": '团队项目 | 系统与敌人程序员 / 技术美术',
  "Bubono's Bumperland": 'Bubono 的碰碰车乐园',
  "Bubono's Burg": 'Bubono 的城堡园区',
  "Bubono's Abyss": 'Bubono 的深渊园区',
  "Bubono's Big Bang": 'Bubono 的宇宙园区',
  "Bubono's Bumperland mood": 'Bubono 的碰碰车乐园氛围',
  "Bubono's Bumperland mood image": 'Bubono 的碰碰车乐园氛围图',
  "Bubono's Bumperland, overseen by the ever-charismatic Bubono the Rat, is a thriving amusement realm packed with chaos, charm, and collision-based adventures.":
    '由魅力十足的鼠王 Bubono 管理的繁忙乐园，充满混沌、魅力与碰撞冒险。',
  "The park spans three themed branches—Bubono's Burg, a medieval fantasy kingdom; Bubono's Abyss, a fiery underworld of volatile machinery; and Bubono's Big Bang, a cosmic frontier at the edge of reality. Players take on the role of a park mechanic, maintaining rides, optimizing bumper buggies, and keeping visitors safe—until \"efficiency protocols\" hint that something more mysterious is unfolding.":
    '乐园分为三大分园——Bubono 的城堡园区（中世纪幻想）、深渊园区（炽热地下机械）、宇宙园区（现实边缘的科幻前沿）。玩家扮演乐园机械师，维护游乐设施、调校碰碰车并保证游客安全，直到“效率协议”暗示更神秘的事件正在酝酿。',
  'An amusement realm run by Bubono the Rat. Three themed branches—Burg, Abyss, and Big Bang—collide buggies, drifting impacts, and arena hazards into one ride. You play as a park mechanic keeping the rides alive while "efficiency protocols" hint that something stranger is running the show.':
    'Bubono 经营的游乐园。城堡、深渊、宇宙三大分园把碰碰车、漂移撞击和场景危害揉进一场游乐。你是机械师，维持乐园运转；“效率协议”隐约透露有更诡异的东西在操控全局。',
  Role: '角色',
  'Systems & Enemy Programmer / Technical Artist': '系统与敌人程序员 / 技术美术',
  Focus: '定位',
'Collision combat + behavior-driven AI': '碰撞战斗 + 行为驱动 AI',

'Player Loop': '玩家循环',
'Fight, collect, and upgrade bumper buggies': '战斗、收集并升级碰碰车',

'Back to projects': '返回项目列表',

'Park Branches': '园区分支',
'Three themed zones built around collision-based vehicle combat.':
  '围绕车辆碰撞战斗打造的三个主题园区。',

'Medieval fantasy kingdom of ramparts, banners, and jousting lanes.':
  '充满城墙、旗帜与竞技赛道的中世纪幻想王国。',

'Armored enemies turn narrow lanes into high-impact collision encounters.':
  '装甲敌人让狭窄赛道变成高冲击力的碰撞战场。',

'Castle walls and arena hazards make positioning and rebound control essential.':
  '城墙与场景机关让站位和反弹控制变得更加重要。',

'Enemy AI adjusts its approach and attack direction around vehicle movement.':
  '敌人 AI 会根据车辆运动调整接近方式与攻击方向。',

'Clear collision feedback keeps fast-paced Castle encounters readable.':
  '清晰的碰撞反馈让高速城堡战斗依然保持良好可读性。',


'Fiery underworld filled with machinery and environmental hazards.':
  '充满机械装置与环境危害的炽热地下世界。',

'Heat vents and grinders create dangerous routes through the arena.':
  '热风口与粉碎机在竞技场中形成高风险行驶路线。',

'Enemy vehicles reposition and charge based on the player’s movement.':
  '敌方车辆会根据玩家移动重新定位并发动冲撞。',

'Flame jets and moving platforms add pressure to vehicle positioning.':
  '火焰喷射与移动平台进一步增加车辆走位压力。',

'Shaders and post-processing reinforce the intense atmosphere of the Abyss.':
  'Shader 与后期处理进一步强化深渊区域的视觉氛围。',


'Cosmic frontier at the edge of reality with low-gravity environments.':
  '位于现实边缘、拥有低重力环境的宇宙区域。',

'Low-gravity movement changes collision timing and vehicle momentum.':
  '低重力运动改变了碰撞时机与车辆动量控制。',

'Enemy AI adapts its approach to different movement and collision conditions.':
  '敌人 AI 会根据不同运动与碰撞条件调整进攻方式。',

'Visual effects reinforce movement, impacts, and the direction of combat.':
  '视觉效果进一步强化移动、撞击以及战斗方向反馈。',

'Custom shaders and post-processing give the Space zone a distinct identity.':
  '定制 Shader 与后期效果赋予宇宙区域独特的视觉风格。',


Systems: '系统',
'Behavior Hooks': '行为逻辑',
'Branch Gallery': '分支画廊',
showcase: '展示',

'Enemy AI uses vehicle movement, orientation, and collision opportunities to shift between approaching, aligning, charging, and recovering. Clear VFX and impact feedback keep combat readable even when arenas become chaotic.':
  '敌人 AI 根据车辆移动、朝向与碰撞机会，在接近、对齐、冲撞和恢复之间切换。清晰的特效与撞击反馈让混乱战斗依然保持可读性。',


'Key Features': '关键特性',

'Bumping & Crashing Combat': '碰碰与撞击战斗',

"Experience high-impact, physics-driven combat with Bubono's bumper cars, built around drifting, collisions, knockback, and arena control.":
  '体验以物理碰撞为核心的高冲击战斗，通过漂移、撞击、击退与走位控制竞技场。',


'Smart & Stylized Enemies': '车辆敌人 AI',

'Each park zone introduces unique enemies driven by AI designed around vehicle movement, orientation, collision angles, and combat positioning.':
  '每个园区拥有不同的敌人，并通过围绕车辆移动、朝向、碰撞角度与战斗站位设计的 AI 驱动。',


'Upgradeable Abilities': '车辆升级',

'Defeated enemies drop components that allow players to upgrade their bumper car and strengthen their capabilities throughout the game.':
  '击败敌人可以获得组件，用于升级碰碰车并逐步强化车辆能力。',


'Park Mechanic Loop': '乐园机械师循环',

'Battle enemies and navigate hazards across three themed park zones.':
  '在三个主题园区中挑战敌人并穿越不同的场景机关。',

'Collect components and upgrade the bumper car between encounters.':
  '收集敌人掉落的组件，并持续升级自己的碰碰车。',

'Progress through the park while uncovering the secrets behind Bubono’s world.':
  '不断深入乐园，并逐渐揭开 Bubono 世界背后的秘密。',


'Collision Readability': '碰撞可读性',

'Drifts, crashes, and rebounds use clear camera feedback and VFX to communicate impact direction and timing, keeping high-speed encounters readable.':
  '漂移、撞击与反弹通过清晰的镜头反馈和特效传达撞击方向与时机，让高速战斗保持良好可读性。',


'Upgrade Arc': '升级循环',

'Components collected from defeated enemies unlock vehicle upgrades that expand the player’s capabilities and support progression through the park.':
  '从敌人身上获得的组件可以解锁车辆升级，扩展玩家能力并推动乐园探索进程。',


'My Role': '我的职责',
Contribution: '贡献',

'Systems & Enemy Programming': '系统与敌人程序',

'Developed and iterated on core gameplay systems, vehicle collision combat, and enemy AI designed around movement, alignment, charging, and recovery.':
  '负责核心玩法系统、车辆碰撞战斗与敌人 AI 的开发和迭代，包括移动、对齐、冲撞与恢复等行为。',


'Rendering & Technical Art': '渲染与技术美术',

'Implemented and refined shaders, post-processing effects, and technical meshes while collaborating with artists to meet visual and technical requirements.':
  '实现并调整 Shader、后期渲染与技术 Mesh，并与美术协作解决视觉效果与资产的技术需求。',


'Performance Optimization': '性能优化',

'Profiled GPU and runtime performance, optimizing shaders, overdraw, post-processing, and expensive rendering features to improve overall smoothness.':
  '分析 GPU 与运行时性能，优化 Shader、Overdraw、后期处理与高开销渲染效果，提升整体运行流畅度。',


'Art Book & GDD': '美术设定集与 GDD',

'Download the visual art book and full game design document for a deeper look at the project.':
  '下载美术设定集与完整游戏设计文档，进一步了解项目内容。',

'Download Art Book': '下载设定集',
'Download GDD': '下载 GDD',

'Demo Reel': '演示视频',


'Yang served as a Systems & Enemy Programmer / Technical Artist on the project, contributing to core gameplay, enemy AI, shaders, post-processing, technical meshes, and performance optimization. His work focused on connecting gameplay, rendering, and the art pipeline into a cohesive and performant game experience.':
  'Yang 在项目中担任系统与敌人程序 / 技术美术，负责核心玩法、敌人 AI、Shader、后期渲染、技术 Mesh 与性能优化，并推动 Gameplay、Rendering 与 Art Pipeline 形成完整且高效的游戏体验。',

"Click below to learn more about the studio's technical builds.":
  '点击下方了解更多技术向项目。',
  'View all projects': '查看全部项目',
  'Download Demo': '下载 Demo',
}

const project = projects.find((p) => p.slug === 'bubono-bumperland')
const DOWNLOAD_HREF =
  project?.download ?? 'mailto:yangliu.gmdev@gmail.com?subject=Bubono%20Bumperland%20Demo%20Request'
const DOWNLOAD_IS_FILE = DOWNLOAD_HREF.startsWith('/') || DOWNLOAD_HREF.startsWith('./')
const HERO_IMAGE = project?.banner ?? project?.cover ?? 'https://drive.google.com/thumbnail?id=1f6PUGXv-EytcDkTg9Q5CtEPVl5TFto0E&sz=w2000'

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

function useBumperTranslation() {
  const { language, t } = useLanguage()
  const translate = (text: string) => (language === 'zh' ? BUMPER_TRANSLATIONS[text] ?? t(text) : text)
  return { language, translate }
}

export default function BubonoBumperlandClient() {
  const { language, translate } = useBumperTranslation()
  const [activeBranch, setActiveBranch] = useState<Branch>(BRANCHES[0])
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [lightboxFallback, setLightboxFallback] = useState<string | null>(null)
  const projectHighlight = projectHighlights['bubono-bumperland']

  return (
    <div className="project-monograph-custom min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-5 py-8 sm:px-6 md:space-y-12 md:px-10 md:py-12 lg:px-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900/80 to-neutral-900">
          <div
            role="button"
            tabIndex={0}
            aria-label={translate("Bubono's Bumperland mood image")}
            className="absolute inset-0 cursor-zoom-in outline-none focus:ring-2 focus:ring-amber-400"
            onClick={() => {
              const { primary, fallback } = getDriveImageVariants(HERO_IMAGE)
              setLightboxSrc(primary)
              setLightboxFallback(fallback || null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                const { primary, fallback } = getDriveImageVariants(HERO_IMAGE)
                setLightboxSrc(primary)
                setLightboxFallback(fallback || null)
              }
            }}
          >
            <Image
              src={HERO_IMAGE}
              alt={translate("Bubono's Bumperland mood")}
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          </div>
          <div className="relative z-10 grid gap-8 p-5 sm:p-8 md:p-10 lg:grid-cols-[1.5fr,1fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                {translate('Team Project | Systems & Enemy Programmer')}
              </p>
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-300">Sep 2024 - May 2025</p>
              <h1 className="font-display text-4xl md:text-5xl">{translate("Bubono's Bumperland")}</h1>
              <p className="text-lg text-neutral-100">
                {translate(
                  "Bubono's Bumperland, overseen by the ever-charismatic Bubono the Rat, is a thriving amusement realm packed with chaos, charm, and collision-based adventures.",
                )}
              </p>
              <p className="text-lg text-neutral-200">
                {translate(
                  "The park spans three themed branches—Bubono's Burg, a medieval fantasy kingdom; Bubono's Abyss, a fiery underworld of volatile machinery; and Bubono's Big Bang, a cosmic frontier at the edge of reality. Players take on the role of a park mechanic, maintaining rides, optimizing bumper buggies, and keeping visitors safe—until \"efficiency protocols\" hint that something more mysterious is unfolding.",
                )}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-neutral-200">
                {BRANCHES.map((branch) => (
                  <span
                    key={branch.id}
                    className="rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 font-semibold backdrop-blur"
                  >
                    {translate(branch.title)}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: translate('Role'), value: translate('Systems & Enemy Programmer') },
                  { label: translate('Focus'), value: translate('Collision combat + behavior-driven AI') },
                  { label: translate('Player Loop'), value: translate('Maintain, optimize, and upgrade bumper buggies') },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">{item.label}</p>
                    <p className="mt-2 text-sm text-neutral-100">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <DownloadCta translate={translate} href={DOWNLOAD_HREF} download={DOWNLOAD_IS_FILE} />
                <Link
                  href="/projects"
                  className="focus-ring rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-white/20"
                >
                  {translate('Back to projects')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">{translate('Project notes')}</p>
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
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200">{translate('Note')} {String(index + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-neutral-200">{getLocalizedText(note, language)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl">{translate('Park Branches')}</h2>
              <p className="text-neutral-400">{translate('Theme-specific arenas tuned for collision-first combat.')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((branch) => (
                <button
                  key={branch.id}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeBranch.id === branch.id
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  }`}
                  onClick={() => setActiveBranch(branch)}
                >
                  {translate(branch.title)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">{translate(activeBranch.theme)}</p>
              <h3 className="mt-2 font-display text-2xl text-white">{translate(activeBranch.title)}</h3>
              <div className="mt-4 space-y-3 text-neutral-300">
                {activeBranch.threats.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <p>{translate(item)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200/10 bg-amber-50/5 p-5 text-neutral-100 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">{translate('Systems')}</p>
                <p className="mt-2 text-neutral-200">{translate(activeBranch.systems)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Behavior Hooks')}</p>
                <p className="mt-2 text-neutral-200">
                  {translate(
                    'Branch AI reads player movement, environment layout, and combat rhythm to shift from crowding to flanking to punishing overcommits. Telegraphs and VFX keep impacts clear even when arenas get chaotic.',
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Branch Gallery')}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(BRANCH_GALLERY[activeBranch.id] ?? []).map((src, idx) => {
                    const { primary, fallback } = getDriveImageVariants(src)
                    return (
                      <div
                        key={`${activeBranch.id}-img-${idx}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setLightboxSrc(primary)
                          setLightboxFallback(fallback || null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setLightboxSrc(primary)
                            setLightboxFallback(fallback || null)
                          }
                        }}
                        className="overflow-hidden rounded-xl border border-white/10 bg-neutral-800 outline-none ring-offset-2 ring-offset-neutral-900 focus:ring-2 focus:ring-amber-400"
                        style={{ aspectRatio: '16 / 9' }}
                      >
                        <img
                          src={primary}
                          alt={`${translate(activeBranch.title)} ${translate('showcase')} ${idx + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          data-fallback-src={fallback || undefined}
                          onError={handleImageFallback}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-3xl">{translate('Key Features')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURE_PILLARS.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
                <h3 className="font-display text-xl text-white">{translate(item.title)}</h3>
                <p className="mt-3 text-neutral-300">{translate(item.body)}</p>
              </article>
            ))}
          </div>
        </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900/80 to-neutral-900 p-6 shadow-soft">
            <h2 className="font-display text-3xl">{translate('Park Mechanic Loop')}</h2>
            <ul className="mt-4 space-y-3 text-neutral-200">
              {[
                'Maintain rides and route hazards so arenas stay readable and dangerous.',
                'Tune bumper buggies with new modules, swapping collision profiles, boosts, and crowd-control tricks.',
                'Chase down "efficiency protocol" glitches that twist AI priorities mid-match.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-amber-400" />
                  <span>{translate(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Collision Readability')}</p>
              <p className="mt-2 text-neutral-200">
                {translate('Drifts, crashes, and rebounds carry clear camera kicks and FX to keep timing legible. Arena props react to hits so players always see where momentum went.')}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Upgrade Arc')}</p>
              <p className="mt-2 text-neutral-200">
                {translate('Components from defeated foes unlock special modules and new bumper builds. Each upgrade shifts collision behavior rather than raw stats, keeping the experience about contact and control.')}
              </p>
            </div>
          </div>
        </section>
<section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
            <h2 className="font-display text-3xl">{translate('Art Book & GDD')}</h2>
            <p className="mt-3 text-neutral-300">
              {translate('Download the visual art book and the full game design document for deeper reference.')}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={ART_BOOK_URL}
                className="focus-ring rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
              >
                {translate('Download Art Book')}
              </a>
              <a
                href={GDD_URL}
                className="focus-ring rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-soft transition hover:bg-white/20"
              >
                {translate('Download GDD')}
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{translate('Demo Reel')}</p>
            <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <video className="h-full w-full" controls>
                <source src={DEMO_REEL_URL} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-3xl">{translate('My Role')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ROLE_CARDS.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">{translate('Contribution')}</p>
                <h3 className="mt-2 font-display text-xl text-white">{translate(item.title)}</h3>
                <p className="mt-3 text-neutral-300">{translate(item.body)}</p>
              </article>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-neutral-200 shadow-soft">
            <p>
              {translate('Yang serves as a Mechanical Director on the project, responsible for systems design, feature implementation, and AI integration. His work focuses on expanding the mechanical depth of the game while strengthening player immersion through responsive, intelligent interactions.')}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-neutral-100 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl text-white">{translate('Back to projects')}</h3>
              <p className="text-neutral-400">{translate("Click below to learn more about the studio's technical builds.")}</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <DownloadCta translate={translate} href={DOWNLOAD_HREF} download={DOWNLOAD_IS_FILE} />
              <Link
                href="/projects"
                className="focus-ring rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
              >
                {translate('View all projects')}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => {
            setLightboxSrc(null)
            setLightboxFallback(null)
          }}
          role="presentation"
        >
          <button
            onClick={() => {
              setLightboxSrc(null)
              setLightboxFallback(null)
            }}
            className="focus-ring absolute right-6 top-6 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Close
          </button>
          <div className="flex h-full items-center justify-center px-4">
            <img
              src={lightboxSrc}
              alt="Branch gallery enlarged"
              width={1600}
              height={900}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              data-fallback-src={lightboxFallback ?? undefined}
              onError={handleImageFallback}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function DownloadCta({
  href,
  download,
  translate,
}: {
  href: string
  download?: boolean
  translate: (text: string) => string
}) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:')
  const classes =
    'focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black shadow-lg shadow-amber-400/30 transition hover:bg-amber-300'

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} aria-label="Download demo">
        {translate('Download Demo')}
      </a>
    )
  }

  return (
    <Link href={href} download={download} className={classes} aria-label="Download demo">
      {translate('Download Demo')}
    </Link>
  )
}
