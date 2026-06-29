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
  'pubg-signal-wheel': {
    title: 'PUBG 策划分析',
    blurb: '一份面向 PUBG 类战术竞技的局内信号轮盘系统策划案，覆盖交互流、射线标点、反刷屏、倒地状态限制与赛季化配置表。',
    role: '系统策划',
    overviewGoal: '设计一个快速、准确、可防滥用的局内信号轮盘，让不开麦玩家也能完成高频战术沟通。',
    overviewTeam: '个人策划分析',
    overviewTimeline: '系统案 - V1.0',
    process: [
      {
        title: '问题',
        body: '战术竞技需要快速非语音沟通，但系统必须在战斗中足够顺手，标点必须准确，同时还要防止队友恶意刷屏破坏体验。',
      },
      {
        title: '方案',
        body: '围绕按下呼出、拖拽选择、松开触发建立操作闭环，并加入准星射线标点、物资自动识别、距离自适应 3D UI、频控限制和状态机降级。',
      },
      {
        title: '结果',
        body: '形成一份闭环系统案，将玩家输入、HUD 自定义、世界坐标标点、网络同步限制和赛季化内容配置串成完整逻辑。',
      },
    ],
    technical: [
      {
        title: '输入流与 HUD 布局',
        description: '采用“按下呼出 - 拖拽选择 - 松开触发”的三步流。移动端默认靠近开火键区域，并允许调整大小、位置和透明度；高频信号可拆成独立快捷键。',
      },
      {
        title: 'Raycast 标点与物资识别',
        description: '标点从玩家相机沿准星方向发射射线，敌人和位置标记取第一个 Block 碰撞点；物资提醒读取命中物体绑定的 ItemID，再从 Item_Table 中取 Item_Name，避免直接显示模型名。',
      },
      {
        title: '队友可见性与反刷屏',
        description: '队友可在小地图与 3D 画面看到标点和距离。图标 0-50 米保持 100%，50-200 米线性缩到 40%，200 米外保底 40%；5 秒内发送 3 次以上信号会进入 10 秒仅自己可见的禁言状态。',
      },
      {
        title: '配置表与状态机限制',
        description: '用 Signal_Slot_Config 管理格子动作，用 Signal_Asset_Table 通过 Season_ID 和 Action_Type 联合索引文本与音频。倒地玩家只保留“请求救援”，并将射线距离强制设为 0，死亡后禁用全部信号。',
      },
    ],
    results: {
      summary: '完成一份 V1.0 局内信号轮盘系统策划案，在操作效率、信息准确度、赛季运营配置和局内生态保护之间建立清晰规则。',
      highlights: ['按住拖拽释放的轮盘交互', 'Raycast 与 ItemID 标点逻辑', '频控禁言机制', '赛季化 DataTable 配置'],
    },
  },
  cheetah: {
    title: 'Cheetah',
    blurb: 'Leo Ledger——一只会帮你存钱的猎豹：完全本地、隐私优先的记账应用，几秒记一笔、随手看清财务结构。',
    role: '产品设计 / 前端开发',
    overviewGoal: '记账能不能不依赖账号与云端、也不费劲就坚持下来？Leo Ledger 追求 3 秒记一笔、30 秒看清当月结构，数据全部留在本机。',
    overviewTeam: '独立产品',
    overviewTimeline: '2026',
    process: [
      { title: '问题', body: '记账慢、要注册云账号、信息又密的应用，用户往往坚持不下来。' },
      { title: '做法', body: 'Robinhood 风格暗色界面，底部四 Tab + 浮动记账按钮，并用猎豹 Leo 把“坚持”做成游戏化成长。' },
      { title: '可用版本', body: '一个 React + esbuild 单文件应用，基于 localStorage：多账户钱包、支出/收入/转账、分类树、预算、计划付款、储蓄目标与数据导出。' },
    ],
    technical: [
      {
        title: '本地优先·隐私',
        description: '无后端、无账号；数据存于 localStorage，整个应用可单文件嵌入，支持 CSV 导出与 JSON 备份/恢复。',
      },
      {
        title: '统一的规划模型',
        description: '预算、收入比例分配、储蓄目标与周期付款共用一套模型；到期账单自动入账并滚动到下一期。',
      },
      {
        title: '洞察与 Leo 成长',
        description: '分类占比、近 6 月趋势与现金流，搭配 Leo 的情绪、等级、连续天数与成就，激励长期坚持。',
      },
    ],
    results: {
      summary: 'Leo Ledger 覆盖记录、规划、复盘的完整闭环，全部在本机完成，并用猎豹 Leo 维持记账习惯。',
      highlights: ['完全本地、无需账号', '统一的规划模型', 'Leo 游戏化坚持'],
    },
  },
  lote: {
    title: 'Lote',
    blurb: '面向 Windows 的本地优先 Markdown 知识工作台：打开任意文件夹作为笔记库，用 .md 记录内容，并通过双链、图谱、画布、看板、日历任务和 NAS 备份同步来组织想法。',
    role: '产品设计 / Electron 开发',
    overviewGoal: '把普通文件夹变成私有写作与知识管理工作区，不依赖账号、云端锁定或隐藏文件的数据库。',
    overviewTeam: '独立产品',
    overviewTimeline: 'v3.0 · 2026',
    process: [
      { title: '问题', body: '成熟笔记应用常把用户推向账号、私有同步或不透明数据库；本地优先工具又往往需要大量插件配置才像一个完整工作台。' },
      { title: '做法', body: '把核心知识工作流内置到一个桌面壳中：文件树、Markdown 编辑器、实时预览、双链、标签、图谱、数据库表、每日笔记、看板、画布、模板与导出。' },
      { title: '可用版本', body: '当前 Electron 构建会直接打开本地或 NAS 文件夹，通过文件系统保存标准笔记文件，并作为 Windows 桌面应用发布。' },
    ],
    technical: [
      {
        title: '基于文件夹的本地存储',
        description: 'Lote 直接读写用户选择的文件夹。Markdown 笔记、附件、画布文件和看板都保留在磁盘上，文件系统就是真实数据源。',
      },
      {
        title: '双链、标签与图谱',
        description: '解析 [[链接]]、#标签、frontmatter、标题和出链，生成反向链接、大纲、全局/局部 D3 关系图与快速跳转。',
      },
      {
        title: '数据库、日历与看板',
        description: '同一批笔记可以作为数据库表、每日笔记日历、任务列表或 Trello 式看板查看，看板状态仍然以 Markdown 保存。',
      },
      {
        title: '导出、历史与 NAS 同步',
        description: '内置全文搜索、网页收藏、笔记寿命、版本历史、PDF/PNG/JPG 导出、ZIP 导入导出，以及本地到 NAS 的手动备份同步。',
      },
    ],
    results: {
      summary: 'Lote 把个人知识工作台打包成本地 Windows 应用，同时让用户的笔记保持可迁移、可检查、独立于任何托管服务。',
      highlights: ['文件夹式本地笔记库', '双链/图谱/画布/看板内置', 'NAS 备份同步与导出工具'],
    },
  },
  yinyang: {
    title: 'YinYang',
    blurb: 'YinYang ／ 天機閣 —— 建立在真实天文历法之上的深色描金八字阅读台：规则化推演、附依据，且明确标注仅供文化参考、非预测。',
    role: '产品设计 / 前端开发',
    overviewGoal: '传统排盘要么陈旧玄虚、要么冷硬如表格。天機閣保留确定性的推演引擎，却把它呈现为一座沉静的描金阅读台——观天时、察气运、顺势而为。',
    overviewTeam: '独立产品',
    overviewTimeline: 'v1.0 · 2026',
    process: [
      { title: '问题', body: '排盘工具往往在"陈旧玄学"和"冷硬数据表"之间二选一，都不够考究、也不够可信。' },
      { title: '做法', body: '保留确定性、带依据的引擎，外面包一层"天機閣"——围绕命宫、今日运势与走势组织的深色描金阅读台。' },
      { title: '可用版本', body: '纯前端、可离线；同一套八字引擎同时驱动天機閣仪表盘与一个干净的可嵌入视图。' },
    ],
    technical: [
      {
        title: '真实历法引擎',
        description: '基于 lunar-javascript 按节气定月推导四柱，含农历闰月换算与可选真太阳时校正。',
      },
      {
        title: '天機閣命盘台',
        description: '深色描金命盘台围绕命宫与主星重新组织，配综合运势指数与近三十日／一季走势。',
      },
      {
        title: '规则化·可审计解读',
        description: '旺衰、用神、格局均为确定性推演，每条都带依据与置信度——标注仅供文化参考、非预测。',
      },
      {
        title: '应用解读',
        description: '幸运色、财神方位、五行补益起名用字，以及双人合盘报告，均由同一命盘推导。',
      },
      {
        title: '天机问答·可嵌入',
        description: '结合命盘的天机问答（接入中），以及把干净视图嵌入任意网站的 postMessage SDK，离线、无需账号。',
      },
    ],
    results: {
      summary: 'YinYang 现以"天機閣"呈现同一套严谨的八字引擎——沉静、附依据的阅读台，并始终如实标注仅供文化参考、非预测。',
      highlights: ['天文级历法引擎', '天機閣命盘台 + 干净可嵌入视图', '附依据 · 文化参考定位'],
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
    results: { summary: '实验体企鹅在关卡内进行战斗、最终逃出实验室的游戏 Demo。', highlights: ['交付可玩最终版本', '对话与目标 UI 系统', '可读的近战战斗反馈'] },
  },
  ink: {
    title: 'Ink',
    blurb: '一款 48 小时 Game Jam 项目：手绘水墨风格的 2D 横版平台游戏，在限时内完成并交付。',
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
