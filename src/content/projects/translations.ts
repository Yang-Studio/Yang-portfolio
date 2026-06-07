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
  cheetah: {
    title: 'Cheetah',
    blurb: '一款本地优先的个人财务助手，将日常记账、预算、储蓄目标与计划付款整合为清晰集中的移动端工作流。',
    role: '产品设计 / 前端开发',
    overviewGoal: '无需注册账号、云服务或复杂表格，也能让个人财务记录保持即时、清晰并具有持续使用的动力。',
    overviewTeam: '个人产品开发',
    overviewTimeline: '2026',
    process: [
      { title: '挑战', body: '在移动端界面中同时容纳账单、账户余额、预算、目标、周期付款与趋势，又不让信息变得拥挤。' },
      { title: '方案', body: '围绕四个高频时刻组织产品：查看当前状况、快速记录、规划未来现金流、回顾消费模式。' },
      { title: '结果', body: '完成可在浏览器运行的财务原型，支持本地持久化、分类与账户管理、计划流程以及数据导出。' },
    ],
    technical: [
      {
        title: '本地优先账本',
        description: '账单、账户、分类、预算、目标与偏好都保存在浏览器中；无需登录，也不会把财务数据发送到服务器。',
      },
      {
        title: '综合规划系统',
        description: '周期付款、收入分配、分类预算和储蓄目标集中在同一规划界面，并提供到期处理与预计余额反馈。',
      },
      {
        title: '行为反馈设计',
        description: '通过消费占比、现金流指标、趋势图、预算提醒、连续记录、等级与 Leo 伙伴，将原始账目转化为易读反馈。',
      },
    ],
    results: {
      summary: '交付了覆盖完整财务循环的响应式应用原型，从记录一笔账到查看趋势、规划未来现金流均可直接操作。',
      highlights: ['无需账号的本地存储', '预算与周期付款整合', '响应式可交互原型'],
    },
  },
  yinyang: {
    title: 'YinYang',
    blurb: '现代八字数据仪表盘，将本地确定性排盘、结构化解读与注重隐私的 AI 综合分析整合在同一款 Web App 中。',
    role: '全栈 App 开发',
    overviewGoal: '把信息密集的传统八字命盘转化为清晰、响应式的数据产品，同时严格区分确定性计算与生成式解读。',
    overviewTeam: '个人 App 开发',
    overviewTimeline: '2026',
    process: [
      { title: '挑战', body: '清晰呈现大量历法与象意数据，并让每一项计算结果都有来源可追溯。' },
      { title: '方案', body: '将本地排盘引擎、规则分析、界面渲染和可选 AI 综合推理拆分为独立层。' },
      { title: '结果', body: '完成响应式 Web App：命盘在本地完整生成，用户仅在需要时主动请求结构化 AI 解读。' },
    ],
    technical: [
      {
        title: '确定性排盘引擎',
        description: '基于 lunar-javascript 在浏览器中计算四柱、五行、十神、藏干、十二长生、大运与流年信息。',
      },
      {
        title: '隐私优先的 AI 层',
        description: '仅发送计算后的命盘数据以及所选出生日期、时间和性别；姓名与出生地点不会进入 AI 请求。',
      },
      {
        title: '可嵌入 App 架构',
        description: '支持独立页面与 iframe 模式、URL 参数初始化、响应式高度通信、明暗主题和宿主页面事件回调。',
      },
    ],
    results: {
      summary: '交付了可部署的八字应用，包含本地排盘、结构化规则分析、可选 AI 综合推理与可复用嵌入接口。',
      highlights: ['本地优先计算', '结构化 AI 输出', '响应式独立与嵌入模式'],
    },
  },
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
      { title: 'NPC 与任务 UI 打磨', description: '接入本地 NPC 对话帧与任务接受 UI，让页面同时展示战斗节奏背后的角色扮演层。' },
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
      { title: '分支化敌人 AI', description: '为每个分支构建数据驱动的行为树：计时控制的破轮敌人、抛物线投掷的板凳射手、长枪小鬼，以及会根据玩家当前速度预判落点的推土机 Boss。' },
      { title: '可扩展系统框架', description: '设计模块化的敌人与技能框架，由数据表驱动以便快速调参，并实现滚轮切换技能及各自的计时与冷却。' },
      { title: '三档速度反馈', description: '将破坏与橙/黄/绿三档碰撞速度系统绑定，驱动“扣钱”计分，并配合气流特效、镜头速度线、屏幕震动与可反应的 3D 计分牌，让每次撞击都清晰可读。' },
      { title: '竞技场与道具美术整合', description: '加入风车竞技场截图、Jucc 品牌图、炸弹道具和虫子敌人图，让项目页同时展示可玩场景与支撑它的资产集。' },
    ],
    results: {
      summary: '交付了横跨 Burg、Abyss、Big Bang 三个分支的可玩纵向切片，包含自适应敌人、可调升级路径以及定制音效与特效。',
      highlights: ['分支特定敌人 AI', '可读的三档速度反馈', '数据表驱动的系统', '定制音效与特效集成'],
    },
  },
  'stairs-in-the-woods': {
    title: '林中阶梯',
    blurb: '恐怖节奏练习，围绕森林阶梯、光影遮挡与慢速揭示建立紧张感。',
    role: '沉浸式体验',
    overviewGoal: '用阶梯、遮挡和空间揭示练习低多边形环境中的紧张节奏与恐怖氛围。',
    overviewTeam: '个人项目',
    overviewTimeline: '原型 - 5 周',
    process: [
      { title: '挑战', body: '在没有战斗或复杂脚本动作的前提下，让一个极简森林阶梯场景保持紧张。' },
      { title: '方案', body: '通过遮挡、视线断点、光影对比和慢速揭示节奏，让玩家每次回到阶梯时都有不同感受。' },
      { title: '结果', body: '形成一个专注于氛围、路线记忆和环境不安感的短篇恐怖研究。' },
    ],
    technical: [
      { title: '空间节奏', description: '把阶梯设计成反复出现的地标，再通过进入角度、可见度和揭示时机变化来积累不安感。' },
      { title: '光影调校', description: '调节森林对比、阶梯剪影和遮挡区域，让玩家通过环境判断安全与不安全空间。' },
      { title: '揭示循环', description: '围绕转角、高低变化和返回路径设计慢速揭示，不依赖复杂机制也能支撑恐怖节奏。' },
    ],
    results: { summary: '完成了一个聚焦环境恐怖的原型，验证阶梯重复、森林遮挡和低多边形空间情绪。', highlights: ['环境紧张感研究', '重复地标节奏', '光影可读性'] },
  },
  'castle-defense': {
    title: '城堡防御',
    blurb: '一个轻量塔防小游戏。',
    role: '塔防设计',
    overviewGoal: '制作一个短周期、易上手的塔防原型，强调清晰路径、放置判断和快速重开节奏。',
    overviewTeam: '个人研发',
    overviewTimeline: '研发 - 2 周',
    process: [
      { title: '挑战', body: '在 Processing 原型的有限视觉复杂度下，让防御循环保持易懂。' },
      { title: '方案', body: '围绕简单路线、直接敌人反馈和清晰的塔放置规则搭建玩法。' },
      { title: '结果', body: '形成一个短局制塔防原型，可以快速传达塔防的取舍关系。' },
    ],
    technical: [
      { title: '路线与波次逻辑', description: '用可预测的路线移动组织敌人波次，让难度通过时机和数量提升，而不是依赖视觉堆叠。' },
      { title: '塔放置规则', description: '保持放置、范围和射击反馈直接，让玩家理解一次防守为什么成功或漏怪。' },
    ],
    results: { summary: '交付了轻量塔防原型，覆盖波次压力、放置选择和快速重玩循环。', highlights: ['清晰路线防守', '短局制循环', 'Processing 玩法原型'] },
  },
  'bio-lab': {
    title: 'Bio-Lab',
    blurb: '纯生化实验室场景建模，重点展示科幻实验室空间、道具、灯光与氛围。',
    role: '场景建模',
    overviewGoal: '通过建模、构图、材质和灯光完成一个可信的科幻生化实验室场景。',
    overviewTeam: '个人场景项目',
    overviewTimeline: '环境练习 - 4 周',
    process: [
      { title: '挑战', body: '在不依赖玩法系统的前提下，让一个紧凑实验室场景通过建模细节显得完整且可用。' },
      { title: '方案', body: '围绕清晰的实验室分区、科幻设备轮廓、受控灯光和镜头角度组织场景。' },
      { title: '结果', body: '形成一个聚焦空间构图、道具密度和氛围表现的场景建模练习。' },
    ],
    technical: [
      { title: '实验室空间布局', description: '围绕清晰的房间结构、工作区、容器设备和通行空间建模，让环境读起来像一个可运作的生化实验室。' },
      { title: '道具与设备', description: '制作并摆放实验室道具、培养罐、终端和工业细节，在保持主构图清晰的同时增加视觉密度。' },
      { title: '材质与灯光表现', description: '通过科幻材质对比、自发光点缀和受控灯光区分视觉焦点，强化冷静、洁净的实验室氛围。' },
    ],
    results: { summary: '完成了一个纯科幻生化实验室场景建模项目，重点是空间、道具、灯光和最终展示镜头。', highlights: ['完整生化实验室场景', '科幻道具与设备整理', '材质和灯光展示'] },
  },
  aukadyssey: {
    title: 'AukAdyssey',
    blurb: '第三人称逃脱动作游戏，主角是实验体企鹅 Pip，包含近战战斗与引导式探索。',
    role: 'UI 与系统',
    overviewGoal: '搭建交互、对话与 UI 框架，让 Pip 的逃脱清晰可读，同时保持战斗与节奏明确。',
    overviewTeam: '4 人团队',
    overviewTimeline: '原型 - 6 周',
    process: [
      { title: '挑战', body: '在分层场景中维持可读性和节奏。' },
      { title: '方案', body: '将 UI 引导绑定到节奏节点，并持续打磨角色手感。' },
      { title: '结果', body: '形成基调稳定的可玩 Demo。' },
    ],
    technical: [
      { title: '对话与目标 UI', description: '构建对话框系统与屏幕目标提示，在不打断沉浸感的前提下引导玩家走向出口。' },
      { title: '战斗反馈与换手', description: '为近战攻击实现可切换的手部与翻滚闪避，叠加出拳与受击音效及画面反馈，让每次交锋都清晰可读。' },
      { title: '交互与 HUD 系统', description: '实现情境交互、拾取与 HUD，将移动、攻击与交互输入整合为一套可读的操作循环。' },
      { title: 'Pip 角色美术整理', description: '加入透明背景的 Pip 角色图与手绘背景，让系统说明和游戏视觉身份连接起来。' },
      { title: '关卡规划图', description: '补充灰盒平面图与路线图，展示逃脱路径、房间关系和交互节奏在实现前的规划方式。' },
    ],
    results: { summary: '交付了 AukOdyssey 的可玩最终版本：以实验体企鹅 Pip 为主角的第三人称逃脱，含战斗、移动与引导式对话层。', highlights: ['交付可玩最终版本', '对话与目标 UI 系统', '可读的近战战斗反馈'] },
  },
  ink: {
    title: 'Ink',
    blurb: '手绘 2D 平台游戏，包含分层场景和手绘交互框架。',
    role: '手绘视觉',
    overviewGoal: '在 48 小时 Game Jam 内做出一款风格统一、读图清晰的手绘水墨 2D 平台游戏。',
    overviewTeam: 'Game Jam 团队',
    overviewTimeline: '48 小时',
    process: [
      { title: '挑战', body: '在 Jam 开始时尚无美术管线的情况下，跨多个关卡产出并整合完整的手绘素材。' },
      { title: '方案', body: '将手绘角色、敌人与视差背景层分工产出，直接接入三个预先搭好的关卡。' },
      { title: '结果', body: '按时交付了风格统一的水墨风、可玩的三关卡完整版本。' },
    ],
    technical: [
      { title: '手绘素材管线', description: '手绘并以精灵分层导入角色、敌人与场景美术，保持各场景水墨风格一致。' },
      { title: '分层视差关卡', description: '将云层、背景与地面分层合成营造纵深，覆盖三个逐步升级的关卡，并各自配有 UI。' },
      { title: '角色与敌人图集', description: '加入 Jam 资源文件夹中的待机角色图和 Boss 生物图，展示可玩精灵背后的原始手绘素材。' },
      { title: 'UI 与关卡上色稿', description: '把水墨 UI 标识与第一关上色稿接入页面，让项目不仅展示最终截图，也呈现手绘制作路径。' },
    ],
    results: { summary: '在 48 小时 Jam 时限内完成了一款可玩的三关卡手绘平台游戏。', highlights: ['三个完整关卡', '统一的手绘风格', '48 小时内交付'] },
  },
  eshaver: {
    title: 'E. Shaver 书店',
    blurb: '为萨凡纳一家历史悠久的独立书店做 UX 改版，围绕更顺畅的浏览与更鲜明的品牌重做首页、商品页与画廊页。',
    role: 'UX 与 UI 设计',
    overviewGoal: '在保留 1975 年独立书店气质的同时，提升 E. Shaver 书店网站的易用性、浏览体验与视觉表现。',
    overviewTeam: '4 人团队',
    overviewTimeline: 'UXDG 360 - 2025 冬季学期',
    process: [
      { title: '挑战', body: '原网站让选书与结账难以导航，也没有充分利用书店本地化的品牌特色。' },
      { title: '方案', body: '通过观察、访谈与文化探针开展研究，用亲和图归类发现，再完成信息架构与线框图，最后在 Figma 中重做首页、商品页与画廊页。' },
      { title: '结果', body: '产出可点击原型，让浏览更直观，同时保留书店温暖、在地的气质。' },
    ],
    technical: [
      { title: '首页', description: '精炼布局、简化导航，突出主打书籍视觉，并提供通往热门分类与优惠的清晰入口。' },
      { title: '商品页', description: '更大的高清图片与缩放、精简的描述与评价，以及帮助发现的相关商品模块。' },
      { title: '画廊与签名版', description: '网格化浏览，支持按类型、作者与主题搜索筛选，并优化图片以加快加载。' },
      { title: '原型 Mockup', description: '将重做后的页面放入桌面与笔记本设备 mockup 中，展示书店体验在真实展示场景里的阅读效果。' },
    ],
    results: { summary: '交付完整的改版成果：用户研究、过程手册、执行摘要，以及重做首页、商品页与画廊页的 Figma 原型。', highlights: ['重做首页、商品页与画廊页', 'Figma 可点击原型', '基于研究的信息架构与线框图'] },
  },
  terradotta: {
    title: 'Terra Dotta \u00d7 SCADpro',
    blurb: 'SCADpro 用户研究冲刺，为全球教育平台 Terra Dotta 梳理学生与顾问的留学旅程。',
    role: '用户研究',
    overviewGoal: '理解学生、顾问与教职员工在留学项目中的体验，为 Terra Dotta 改进其全球互联平台找到机会点。',
    overviewTeam: 'SCADpro 团队',
    overviewTimeline: '2024.09.09 - 2024.10.02',
    process: [
      { title: '挑战', body: 'Terra Dotta 服务着数百所院校的留学项目，团队需要在提出方向之前，真正理解学生与顾问在整个旅程中的体验。' },
      { title: '方案', body: '开展结构化研究冲刺：前期立项、绘制客户旅程图、二手与一手研究（观察、文化探针、访谈、感官问题），再做亲和图归类与头脑风暴，走向中期综合。' },
      { title: '结果', body: '在中期评审上交付归类好的洞察主题与方案方向，指导下一阶段设计。' },
    ],
    technical: [
      { title: '客户旅程图', description: '在一手研究之前，绘制学生与顾问端到端的留学旅程，定位痛点与机会点。' },
      { title: '一手与二手研究', description: '将桌面研究与观察、文化探针、访谈、感官问题结合，捕捉学生与顾问在留学流程中的真实体验。' },
      { title: '亲和图归类', description: '把数百条原始笔记归类为主题与模式，让研究变得可落地。' },
      { title: '头脑风暴与综合', description: '把洞察主题转化为方案方向，绘制了第一版 Terra Dotta 测试网站，并在中期评审前完成整合。' },
    ],
    results: { summary: '在项目中期为 Terra Dotta 交付了基于研究的问题界定、亲和图洞察主题，以及包含第一版测试网站概念的初步方案方向。', highlights: ['客户旅程图', '多方法一手研究', '亲和图归类的洞察主题', '面向中期评审的测试网站概念'] },
  },
}
