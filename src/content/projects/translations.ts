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
    blurb: '一个本地优先的记账原型（Electron + React）：几秒记一笔、随手看清当月财务，数据全部留在本机，无需账号与服务器。',
    role: '产品设计 / 前端开发',
    overviewGoal: '记账应用能不能不靠账号与服务器、又快又私密？Cheetah 把数据全部存在本机 localStorage，每记一笔就即时更新仪表盘、预算与统计。',
    overviewTeam: '独立产品',
    overviewTimeline: '2026',
    process: [
      { title: '问题', body: '多数记账工具需要云账号，还把记录、规划、复盘拆到彼此割裂的界面里。' },
      { title: '做法', body: '五个聚焦模块——仪表盘、记一笔、预算、统计、设置——共用一套本地数据模型，每笔录入立即更新余额、预算与图表。' },
      { title: '可用版本', body: '一个 Electron + React(UMD) 原型，基于 localStorage：多账户支出/收入/转账、分类预算、近 6 月统计，以及 CSV / JSON 导出。' },
    ],
    technical: [
      {
        title: '本地优先·无服务器',
        description: '数据存于 localStorage，无后端、无账号；同一套构建既可作桌面应用，也能在浏览器中嵌入运行。',
      },
      {
        title: '统一的数据模型',
        description: '记一笔支出/收入/转账，会一次性更新账户余额、预算消耗与仪表盘。',
      },
      {
        title: '预算·统计·导出',
        description: '分类预算上限与进度、近 6 月收支对比与消费排行，以及 CSV / JSON 导出和可恢复的演示数据。',
      },
    ],
    results: {
      summary: 'Cheetah 覆盖记录、规划、复盘的完整记账闭环，全部在本机完成，是一个快速的本地优先原型。',
      highlights: ['本地优先、无需账号', '统一的数据模型', 'CSV / JSON 导出'],
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
    blurb: '驾驶你的碰碰车，漂移，冲撞，在bubono疯狂的游乐园中一路横冲直撞！挑战各具特色的敌人，收集零件并升级碰碰车，穿越城堡，深渊和宇宙三大园区，揭开隐藏在欢乐与混沌之下的秘密',
    role: '系统与敌人程序/技术美术',
    overviewGoal: '负责核心玩法系统与敌人 AI 的开发与迭代，后期渲染效果与 Shader 的实现和调整，与美术团队协作，制作和调整 Shader、特效及 Gameplay 所需的 Mesh，游戏性能分析与优化，改善帧率、渲染开销与整体运行流畅度。协助解决美术资产、渲染效果与 Gameplay 系统之间的技术问题。',
    overviewTeam: '5 人团队',
    overviewTimeline: '5个月',
    process: [
      { title: '挑战', body: '项目最大的挑战是在物理碰撞玩法、视觉表现与运行性能之间取得平衡。高速车辆碰撞需要足够混乱和有冲击力，同时又必须保持可控；三个主题区域需要不同的 Shader 与后期效果，但复杂的视觉表现也会增加性能压力' },
      { title: '方案', body: '在 UE5 的基础物理系统之上加入可控的碰撞与 Gameplay 逻辑，并针对车辆运动重新设计敌人 AI。同时参与 Shader、Post Processing 与技术 Mesh 的制作，与美术协作调整资产，并通过 Profiling 持续定位和优化渲染与运行时瓶颈。' },
      { title: '结果', body: '最终建立了一套稳定的车辆碰撞战斗 + Enemy AI 核心循环，并在保留三个区域视觉特色的同时改善整体运行性能，使 Gameplay、视觉效果和性能能够在同一套系统中稳定运行。' },
    ],
    technical: [
      { title: '完全依赖 UE 物理碰撞时，车辆容易出现撞击反馈不稳定、力度不可控的问题，难以保证每次碰撞都有清晰的战斗反馈', description: '碰撞系统上没有完全依赖默认物理结果，而是在碰撞发生后，根据双方速度、碰撞方向和相对位置计算撞击效果，并对击退与反馈进行额外控制。同时限制异常的速度和冲击结果，让碰撞既保留物理感，又具有可预测的游戏性' },
      { title: '传统 Character AI 的“移动到目标 → 攻击”逻辑并不适合碰碰车。AI 需要考虑车辆朝向、速度、转弯半径和撞击角度', description: '将敌人行为拆分为 Targeting → Approach → Alignment → Charge → Recovery 几个状态并写入到行为树中，AI 不直接追踪玩家当前位置，而是根据玩家运动状态选择攻击方向，并在撞击失败后重新调整位置，避免敌人持续贴墙、原地旋转或堆积。' },
      { title: '为了让 Castle、Abyss、Space 三个区域拥有明显不同的视觉效果，需要使用 Shader 与 Post Processing，但复杂效果会快速增加 GPU 开销', description: '使用 Unreal 的性能分析工具定位 GPU 瓶颈，并针对 Shader Complexity、Overdraw、Post Process 和高成本材质节点逐项优化。将部分实时计算转移到更简单的材质方案或预计算资源，同时根据视觉重要程度决定哪些效果值得保留。' },
      { title: '部分视觉效果无法仅靠 Shader 完成，需要 Mesh 的拓扑、UV、Vertex 信息与材质逻辑相互配合，而现有美术资产并不一定满足技术需求', description: '先从 Shader 的实现方式反推 Mesh Requirements，再与美术沟通需要的拓扑、UV、材质槽和模型结构。对于简单的技术 Mesh，则直接制作并快速验证效果，减少程序与美术之间反复修改的成本。' },
    ],
    results: {
      summary: 'Bubono’s Bumperland 最终完成了以车辆碰撞为核心的战斗体验，并将敌人 AI、视觉效果与车辆升级整合进完整的 Gameplay Loop。在项目中，我不仅负责核心系统与敌人开发，也参与了 Shader、后期渲染、技术 Mesh 制作以及性能优化。',
      highlights: ['完成以车辆碰撞为核心的战斗玩法与完整 Gameplay Loop', '构建适配车辆运动与碰撞机制的敌人 AI 系统', '实现并优化 Shader、Post Processing 与技术 Mesh', '在视觉质量与运行效率之间取得平衡，提升整体性能与流畅度', '打通 Gameplay、Rendering 与 Art Pipeline 之间的协作流程', '提升跨程序、美术与技术美术的问题定位与快速迭代能力'],
    },
  },
  aukadyssey: {
    title: 'AukAdyssey',
    blurb: '第三人称逃脱动作游戏，主角是实验体企鹅 Pip，包含近战战斗与引导式探索。',
    role: 'UI 与系统',
    overviewGoal: '搭建交互、对话与 UI 框架，让 Pip 的逃脱清晰可读，同时保持战斗与节奏明确。',
    overviewTeam: '4 人团队',
    overviewTimeline: '原型 - 8 周',
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
