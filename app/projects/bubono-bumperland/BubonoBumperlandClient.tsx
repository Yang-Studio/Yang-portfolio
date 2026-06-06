'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/content/projects'
import { getLocalizedText, projectRecruitingHighlights } from '@/content/recruitingHighlights'
import { useLanguage } from '@/components/LanguageProvider'

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
  "Team Project | Systems & Enemy Programmer": '团队项目 | 系统与敌人程序员',
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
  'Systems & Enemy Programmer': '系统与敌人程序员',
  Focus: '定位',
  'Collision combat + behavior-driven AI': '碰撞战斗 + 行为驱动 AI',
  'Player Loop': '玩家循环',
  'Maintain, optimize, and upgrade bumper buggies': '维护、优化并升级碰碰车',
  'Back to projects': '返回项目列表',
  'Park Branches': '园区分支',
  'Theme-specific arenas tuned for collision-first combat.': '按主题定制的碰撞优先战斗场景。',
  'Medieval fantasy kingdom of ramparts, banners, and jousting lanes.': '充满城墙、旗帜与长枪赛道的中世纪幻想王国。',
  'Shielded jousters and battering-ram carts force tight drift timings.': '持盾骑士与攻城冲车迫使玩家精确漂移时机。',
  'Castle walls and portcullis traps turn every rebound into positioning pressure.': '城墙与吊闸陷阱让每次反弹都变成站位压力。',
  "Behavior nodes favor circling flanks, reacting to the player's braking and feints.": '行为节点偏好绕侧包抄，读取玩家刹车与假动作。',
  'Crowd-control collisions, angled ricochets, and shield-break cues keep Burg arenas legible and loud.':
    '控场碰撞、斜角弹返与破盾提示让城堡园区既清晰又震撼。',
  'Fiery underworld full of volatile machinery and chain-lift hazards.': '炽热的地下世界，充满不稳定机械与链式升降危害。',
  'Heat vents and grinders punish greedy drift lines.': '热风口与粉碎机惩罚贪心的漂移路线。',
  'Enemy buggies swap aggression when players cling to safe lanes for too long.': '玩家在安全车道停留过久时，敌方碰碰车会切换更具侵略性的 AI。',
  'Flame jets and moving platforms demand rhythm-aligned dodges.': '火焰喷射与移动平台要求按节奏闪避。',
  'Volatility modifiers spike physics force and FMOD layers when the arena overheats.': '场景过热时，波动系数会抬高物理冲量并叠加 FMOD 声层。',
  'Cosmic frontier at the edge of reality with anti-grav pockets.': '位于现实边缘的宇宙前沿，遍布反重力泡。',
  'Low-gravity arcs stretch collision windows, rewarding preloaded momentum.': '低重力抛物拉长碰撞窗口，奖励预装动量。',
  'AI reads air time to counter with slam waves or bait parries.': 'AI 读取滞空时间，以冲击波或诱导招架进行反制。',
  'Space dust trails visualize enemy intent as they adapt to player routes.': '宇宙尘尾可视化敌方意图，随玩家路线而调整。',
  'Variable gravity curves and motion-warp assists keep aerial rebounds readable.': '可变重力曲线与运动辅助让空中反弹依然可读。',
  Systems: '系统',
  'Behavior Hooks': '行为切换',
  'Branch Gallery': '分支画廊',
  showcase: '展示',
  'Branch AI reads player movement, environment layout, and combat rhythm to shift from crowding to flanking to punishing overcommits. Telegraphs and VFX keep impacts clear even when arenas get chaotic.':
    '分支 AI 读取玩家移动、场景布局与战斗节奏，在逼近、包抄与惩罚过度进攻之间切换。即使场景混乱，提前告警与特效也能保持撞击清晰。',
  'Key Features': '关键特性',
  'Bumping & Crashing Combat': '碰碰与撞击战斗',
  "Experience high-impact, physics-driven encounters with Bubono's signature Bumper Buggies—vehicles built for chaotic collisions, drifting impacts, and arena-style engagements.":
    '体验 Bubono 代表性的碰碰车高冲击物理战斗——漂移撞击、场馆交锋的车辆生而为撞。',
  'Smart & Stylized Enemies': '聪明且风格化的敌人',
  'Each park branch introduces theme-specific enemy archetypes powered by behavior-driven AI that adapts to player movement, environment layout, and combat rhythm.':
    '每个分园都带来主题化敌人原型，行为驱动 AI 根据玩家移动、场景布局与战斗节奏自适应。',
  'Upgradeable Abilities': '可升级能力',
  'As a mechanic, players collect components from defeated foes, unlocking new vehicle upgrades, special modules, and personalized bumper builds.':
    '作为机械师，玩家从被击败的敌人身上收集组件，解锁车辆升级、特殊模块与个性化碰碰车方案。',
  'Park Mechanic Loop': '乐园机械师循环',
  'Maintain rides and route hazards so arenas stay readable and dangerous.': '维护项目与路线危害，让场景既可读又危险。',
  'Tune bumper buggies with new modules, swapping collision profiles, boosts, and crowd-control tricks.':
    '用新模块调校碰碰车，切换碰撞配置、加速与控场技巧。',
  'Chase down "efficiency protocol" glitches that twist AI priorities mid-match.':
    '追查“效率协议”故障，修正中途被扭曲的 AI 优先级。',
  'Collision Readability': '碰撞可读性',
  'Drifts, crashes, and rebounds carry clear camera kicks and FX to keep timing legible. Arena props react to hits so players always see where momentum went.':
    '漂移、撞击与反弹带有清晰的镜头震动与特效，保障节奏可读；场景道具也会对撞击做出反应，让玩家看清动量去向。',
  'Upgrade Arc': '升级曲线',
  'Components from defeated foes unlock special modules and new bumper builds. Each upgrade shifts collision behavior rather than raw stats, keeping the experience about contact and control.':
    '击败敌人获得的组件可解锁特殊模块与新的碰碰车方案。每次升级改变的是碰撞行为，而非单纯数值，体验始终围绕触碰与掌控。',
  'My Role': '我的职责',
  Contribution: '贡献',
  'Enemy & AI Development': '敌人与 AI 开发',
  'Designed and implemented behavior trees, state-driven movement patterns, and reactive combat logic to create engaging, readable enemy encounters.':
    '设计并实现行为树、状态驱动的移动模式与响应式战斗逻辑，打造易读且有张力的敌人遭遇。',
  'Systems Architecture': '系统架构',
  'Built modular systems enabling upgrades, vehicle enhancements, and dynamic collision responses.':
    '搭建模块化系统，支持升级、车辆强化与动态碰撞响应。',
  'Stylized Rendering Support': '风格化渲染支持',
  'Assisted in creating consistent visual–mechanical coherence across all park branches through shader tuning, rendering behaviors, and thematic effects.':
    '通过着色器调校、渲染表现与主题特效，协助在各分园维持视觉与机制一致性。',
  'Art Book & GDD': '美术设定集与 GDD',
  'Download the visual art book and the full game design document for deeper reference.':
    '下载美术设定集与完整设计文档以作深入参考。',
  'Download Art Book': '下载设定集',
  'Download GDD': '下载 GDD',
  'Demo Reel': '演示视频',
  'Yang serves as a Mechanical Director on the project, responsible for systems design, feature implementation, and AI integration. His work focuses on expanding the mechanical depth of the game while strengthening player immersion through responsive, intelligent interactions.':
    'Yang 担任项目的机械总监，负责系统设计、功能落地与 AI 集成，专注在扩展玩法深度的同时，通过响应迅速且智能的交互加强沉浸感。',
  "Click below to learn more about the studio's technical builds.": '点击下方了解更多技术向项目。',
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
  const recruitingHighlight = projectRecruitingHighlights['bubono-bumperland']

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
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">{translate('Recruiter read')}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">{translate('Hiring fit')}</p>
              <h2 className="mt-3 font-display text-3xl text-white">{getLocalizedText(recruitingHighlight.fit, language)}</h2>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">{translate('Proof')}</p>
              <p className="mt-3 text-lg leading-relaxed text-neutral-200">{getLocalizedText(recruitingHighlight.proof, language)}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {recruitingHighlight.bullets.map((bullet, index) => (
              <div key={bullet.en} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200">{translate('Signal')} {String(index + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-neutral-200">{getLocalizedText(bullet, language)}</p>
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
