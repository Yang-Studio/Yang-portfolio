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
    blurb: '一款注重隐私的个人财务助手，让日常消费清晰可见，并把预算、账单和储蓄目标转化为明确的下一步行动。',
    role: '产品设计 / 前端开发',
    overviewGoal: 'Cheetah 从一个简单的问题出发：财务应用能否在不要求注册账号、不暴露财务记录的前提下，真正帮助用户做出下一步行动？',
    overviewTeam: '独立产品',
    overviewTimeline: '2026',
    process: [
      { title: '产品问题', body: '多数财务工具把记录、规划和复盘拆成彼此分离的功能，用户不得不自己重新拼合“实际花了什么”和“原本打算怎么花”。' },
      { title: '设计决策', body: '界面围绕四个反复发生的动作组织：查看当前状况、记录一笔交易、规划未来现金流、回顾消费模式。' },
      { title: '可用版本', body: '最终形成一款可在浏览器运行的产品，具备本地数据、账户与分类编辑、周期付款、储蓄目标、洞察和数据导出。' },
    ],
    technical: [
      {
        title: '默认保护隐私',
        description: '账本保存在浏览器中，无需注册账号；交易、余额、分类、预算、目标和偏好不会被发送到远程服务。',
      },
      {
        title: '规划优先于报表',
        description: '预算、收入分配、周期付款和储蓄目标共享同一套规划模型，让未来义务始终与当前余额保持关联。',
      },
      {
        title: '推动行动的反馈',
        description: '图表负责说明发生了什么，预算状态、到期提醒、目标进度和 Leo 伙伴则提示接下来最值得关注的事情。',
      },
    ],
    results: {
      summary: 'Cheetah 已覆盖完整的个人财务循环：记录活动、理解现状、准备即将发生的支出，并让数据始终由用户掌控。',
      highlights: ['私密的本地账本', '统一的规划模型', '可运行的响应式产品'],
    },
  },
  yinyang: {
    title: 'YinYang',
    blurb: '一款将计算与解读明确分开的八字工具：浏览器负责排盘，规则负责说明，AI 始终是可选项。',
    role: '全栈 App 开发',
    overviewGoal: '传统排盘工具经常给出密集结果，却没有解释结果如何产生。YinYang 将命盘拆成可追溯的层级，并把生成式解读与确定性计算严格分开。',
    overviewTeam: '独立产品',
    overviewTimeline: '2026',
    process: [
      { title: '信息问题', body: '完整命盘包含多个彼此关联的体系。全部同时展示会难以阅读，隐藏细节又会降低可信度。' },
      { title: '架构决策', body: '排盘计算、规则解读、界面呈现和可选 AI 综合分析被拆成职责不同的独立层。' },
      { title: '可用版本', body: '应用在本地生成完整命盘，展示结构化解读的依据，并只在用户主动请求时调用 AI。' },
    ],
    technical: [
      {
        title: '浏览器端排盘引擎',
        description: '四柱、五行、十神、藏干、十二长生、大运与流年都在浏览器中以确定性规则完成计算。',
      },
      {
        title: '可追溯的结构解读',
        description: '规则结论始终关联命盘依据，让用户能够区分确定的结构数据和解释性的判断。',
      },
      {
        title: '可选的 AI 综合分析',
        description: 'AI 是明确的二次操作，只接收已计算的命盘数据；姓名与出生地点不会被包含在请求中。',
      },
    ],
    results: {
      summary: 'YinYang 把密集命盘转化为可阅读的产品，同时保持计算、解释和生成式内容之间的清晰边界。',
      highlights: ['确定性的本地排盘', '关联依据的结构解读', '仅在请求时使用 AI'],
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
