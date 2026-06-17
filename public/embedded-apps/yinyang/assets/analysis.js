/*
 * BaZi analysis — a transparent, rule-based interpretive engine.
 *
 * This implements the classic 扶抑 (support / suppress) method:
 *   1. Judge day-master strength (旺衰) from season, root, and support vs drain.
 *   2. From strength, derive 用神 / 喜忌 (favorable vs unfavorable elements).
 *   3. Identify 格局 (chart pattern) from the month command.
 *   4. Read tendencies (personality, career/wealth) from 十神 distribution.
 *   5. Score each 大运 / 流年 by how much it brings favorable vs unfavorable element.
 *
 * IMPORTANT: this is a cultural / analytical framework, not a verified forecast.
 * Every conclusion exposes the rule and numbers behind it, so it is auditable.
 */
(function (root) {
  'use strict';

  var GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  var ZHI_WX = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
  var GEN = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };       // X 生 GEN[X]
  var KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };        // X 克 KE[X]
  var EL_EN = { 木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water' };
  var SOURCE_LIBRARY = [
    {
      id: 'ZPZQ',
      title: '《子平真诠》',
      focus: '月令、格局、用神成败',
      url: 'https://www.anhappy.com/share/books/others/books/%E5%9B%BD%E5%AD%A6/%E5%AD%90%E5%B9%B3%E7%9C%9F%E8%AF%A0-%E6%B2%88%E5%AD%9D%E7%9E%BB%E5%8E%9F%E8%91%97.pdf',
      note: '以月令为取格与取用的核心，但仍需配合气候和四柱结构。'
    },
    {
      id: 'DTS',
      title: '《滴天髓》',
      focus: '旺衰、中和、病药与通变',
      url: 'https://zh.wikisource.org/zh-hans/%E6%BB%B4%E5%A4%A9%E9%AB%93',
      note: '强调衰旺真机与中和，不宜只看单一五行数量。'
    },
    {
      id: 'SMTH',
      title: '《三命通会》',
      focus: '十神、神煞、格局与岁运综合',
      url: 'https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83',
      note: '汇集子平法与神煞法，适合作为规则条目的交叉来源。'
    },
    {
      id: 'YHZP',
      title: '《渊海子平》',
      focus: '四柱、十神、纳音、空亡、大运基础规则',
      url: 'https://zh.wikisource.org/zh-hans/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3',
      note: '早期系统整理四柱命法，作为基础名义和神煞表的来源之一。'
    },
    {
      id: 'LUNAR',
      title: 'lunar-javascript',
      focus: '节气、四柱、胎元、命宫等历法计算',
      url: 'https://github.com/6tail/lunar-javascript',
      note: '本产品的排盘计算依赖该开源历法库，解读规则由本地代码实现。'
    }
  ];

  // ten-god *category* of element X relative to day element D
  function relGroup(D, X) {
    if (X === D) return '比劫';
    if (GEN[X] === D) return '印';     // X generates the day master
    if (GEN[D] === X) return '食伤';   // day master generates X
    if (KE[D] === X) return '财';      // day master controls X
    if (KE[X] === D) return '官杀';    // X controls the day master
    return '';
  }
  var SUPPORT = { 比劫: 1, 印: 1 };    // strengthen the day master
  function elementOf(group, D) {
    switch (group) {
      case '比劫': return D;
      case '印': for (var k in GEN) if (GEN[k] === D) return k; break;
      case '食伤': return GEN[D];
      case '财': return KE[D];
      case '官杀': for (var j in KE) if (KE[j] === D) return j; break;
    }
    return null;
  }

  // ---------- 1. day-master strength ----------
  function strength(chart) {
    var D = chart.dayMaster.element;
    var support = 0, drain = 0;
    var reasons = [];

    // 月令 (month command) — weighted most heavily
    var monthZhi = chart.pillars[1].zhi;
    var monthEl = ZHI_WX[monthZhi];
    var monthGroup = relGroup(D, monthEl);
    var deLing = SUPPORT[monthGroup];
    reasons.push('月令为「' + monthZhi + '」(' + monthEl + '，' + monthGroup + ')，日主' +
      (deLing ? '得令（当令受生扶）' : '失令（生于克泄耗之月）') + '。');

    // tally stems (weight 1) and branch hidden stems (weighted), month branch ×2
    chart.pillars.forEach(function (p, idx) {
      var w = idx === 1 ? 2 : 1;                       // 月柱 emphasis
      // stem (skip the day stem itself as "self" reference, but it still anchors the party)
      if (!(idx === 2)) {
        var g = relGroup(D, p.ganElement);
        if (SUPPORT[g]) support += w; else drain += w;
      }
      // hidden stems of the branch
      var hw = [1.0, 0.5, 0.2];
      p.hidden.forEach(function (h, hi) {
        var g2 = relGroup(D, h.element);
        var ww = (hi < hw.length ? hw[hi] : 0.2) * w;
        if (SUPPORT[g2]) support += ww; else drain += ww;
      });
    });
    // the day stem itself belongs to the supporting party
    support += 1;

    // rootedness (通根): branches whose hidden stems include 比劫/印
    var rooted = [];
    chart.pillars.forEach(function (p) {
      var has = p.hidden.some(function (h) { return SUPPORT[relGroup(D, h.element)]; });
      if (has) rooted.push(p.label);
    });
    reasons.push(rooted.length
      ? '日主在 ' + rooted.join('、') + ' 通根得地，根气' + (rooted.length >= 2 ? '较足' : '偏弱') + '。'
      : '四支无本气根，日主无根。');

    var ratio = support / (support + drain);
    reasons.push('生扶力量约占 ' + Math.round(ratio * 100) + '%（生扶 ' + round1(support) + ' ∶ 克泄耗 ' + round1(drain) + '）。');

    var band, key;
    if (ratio < 0.25) { band = '从弱 / 极弱'; key = 'veryWeak'; }
    else if (ratio < 0.42) { band = '身弱（偏弱）'; key = 'weak'; }
    else if (ratio <= 0.58) { band = '中和'; key = 'balanced'; }
    else if (ratio <= 0.75) { band = '身强（偏强）'; key = 'strong'; }
    else { band = '从强 / 极强'; key = 'veryStrong'; }

    var confidence = strengthConfidence(ratio, !!deLing, rooted.length);
    return { element: D, support: round1(support), drain: round1(drain), ratio: ratio,
      percent: Math.round(ratio * 100), band: band, key: key, deLing: !!deLing,
      reasons: reasons, confidence: confidence, sourceIds: ['DTS', 'SMTH', 'YHZP'],
      modelNote: '百分比是本产品将月令、天干、藏干和根气量化后的结构指数，不等同于古籍中的固定分值。' };
  }

  // ---------- 2. 用神 / 喜忌 ----------
  function yongShen(chart, st) {
    var D = st.element;
    var groupsSupport = ['印', '比劫'];
    var groupsDrain = ['食伤', '财', '官杀'];
    var favGroups, unfavGroups, note, extra = [];

    if (st.key === 'weak' || st.key === 'veryWeak') {
      favGroups = groupsSupport; unfavGroups = groupsDrain;
      note = '日主偏弱，宜生扶 —— 喜印星生身、比劫帮身；忌财官食伤继续克泄耗。';
      if (st.key === 'veryWeak') extra.push('生扶力量极弱，若全局顺势，亦可能成「从弱格」（反喜克泄耗），需结合大运细辨。');
    } else if (st.key === 'strong' || st.key === 'veryStrong') {
      favGroups = groupsDrain; unfavGroups = groupsSupport;
      note = '日主偏强，宜克泄耗 —— 喜财星耗身、官杀制身、食伤泄秀；忌印比再添旺气。';
      if (st.key === 'veryStrong') extra.push('生扶力量极强，若印比成势，亦可能成「专旺 / 从强格」（反喜印比），需结合大运细辨。');
    } else {
      // 中和: gently favor flow (食伤 + 财) while keeping balance
      favGroups = ['食伤', '财']; unfavGroups = ['官杀'];
      note = '日主中和，五行流通为上 —— 以食伤、财为喜，调候与流通优先，忌神不重。';
    }

    var fav = uniqEl(favGroups.map(function (g) { return { el: elementOf(g, D), group: g }; }));
    var unfav = uniqEl(unfavGroups.map(function (g) { return { el: elementOf(g, D), group: g }; }));
    return { favorable: fav, unfavorable: unfav, note: note, extra: extra,
      confidence: yongConfidence(st), sourceIds: ['ZPZQ', 'DTS'] };
  }

  // ---------- 3. 格局 ----------
  function geJu(chart) {
    var D = chart.dayMaster.element;
    var monthZhi = chart.pillars[1].zhi;
    var visibleStems = chart.pillars.map(function (p) { return p.gan; });
    var matched = chart.pillars[1].hidden.filter(function (h) {
      return visibleStems.indexOf(h.gan) >= 0;
    });
    var mainHidden = chart.pillars[1].hidden[0];
    var chosen = matched[0] || mainHidden;
    var group = relGroup(D, chosen.element);
    var god = chosen.shishen || '';
    var nameMap = {
      正官: '正官格', 七杀: '七杀格', 正财: '正财格', 偏财: '偏财格',
      正印: '正印格', 偏印: '偏印格', 食神: '食神格', 伤官: '伤官格',
      比肩: '建禄 / 比肩格', 劫财: '月劫格'
    };
    var name = nameMap[god] || (group + '格');
    var note = matched.length
      ? '月令「' + monthZhi + '」藏干中「' + chosen.gan + chosen.element + '」透于天干，十神为「' + god + '」，故暂立「' + name + '」。'
      : '月令「' + monthZhi + '」藏干未见明确透干，暂以本气「' + mainHidden.gan + mainHidden.element + '」取格，十神为「' + god + '」，故为「' + name + '」。';
    return { name: name, god: god, note: note, transparent: !!matched.length,
      chosenGan: chosen.gan, sourceIds: ['ZPZQ', 'SMTH'],
      confidence: matched.length
        ? confidence('high', '月令藏干已透出，格局取法较清晰。')
        : confidence('medium', '月令未透干，按本气取格；需结合全盘和岁运复核。') };
  }

  // ---------- 3b. 地支关系 ----------
  var LIUHE = { 子丑: '六合', 寅亥: '六合', 卯戌: '六合', 辰酉: '六合', 巳申: '六合', 午未: '六合' };
  var CHONG = { 子午: '冲', 丑未: '冲', 寅申: '冲', 卯酉: '冲', 辰戌: '冲', 巳亥: '冲' };
  var HAI = { 子未: '害', 丑午: '害', 寅巳: '害', 卯辰: '害', 申亥: '害', 酉戌: '害' };
  var PO = { 子酉: '破', 丑辰: '破', 寅亥: '破', 卯午: '破', 巳申: '破', 未戌: '破' };
  var XING = { 子卯: '刑', 寅巳: '刑', 巳申: '刑', 寅申: '刑', 丑未: '刑', 未戌: '刑', 丑戌: '刑' };
  var SANHE = [
    { name: '申子辰三合水局', zhis: ['申', '子', '辰'], element: '水' },
    { name: '亥卯未三合木局', zhis: ['亥', '卯', '未'], element: '木' },
    { name: '寅午戌三合火局', zhis: ['寅', '午', '戌'], element: '火' },
    { name: '巳酉丑三合金局', zhis: ['巳', '酉', '丑'], element: '金' }
  ];
  var SANHUI = [
    { name: '寅卯辰三会木方', zhis: ['寅', '卯', '辰'], element: '木' },
    { name: '巳午未三会火方', zhis: ['巳', '午', '未'], element: '火' },
    { name: '申酉戌三会金方', zhis: ['申', '酉', '戌'], element: '金' },
    { name: '亥子丑三会水方', zhis: ['亥', '子', '丑'], element: '水' }
  ];

  function branchRelations(chart) {
    var branches = chart.pillars.map(function (p) { return { label: p.label, zhi: p.zhi }; });
    var items = [];
    for (var i = 0; i < branches.length; i++) {
      for (var j = i + 1; j < branches.length; j++) {
        var a = branches[i], b = branches[j];
        var types = [
          relationType(CHONG, a.zhi, b.zhi),
          relationType(LIUHE, a.zhi, b.zhi),
          relationType(XING, a.zhi, b.zhi),
          relationType(HAI, a.zhi, b.zhi),
          relationType(PO, a.zhi, b.zhi)
        ].filter(Boolean);
        types.forEach(function (type) {
          items.push({ type: type, labels: [a.label, b.label], zhis: [a.zhi, b.zhi],
            text: a.label + a.zhi + ' 与 ' + b.label + b.zhi + ' 形成「' + type + '」' });
        });
      }
    }
    SANHE.concat(SANHUI).forEach(function (group) {
      var hits = group.zhis.filter(function (z) { return branches.some(function (b) { return b.zhi === z; }); });
      if (hits.length >= 2) {
        items.push({ type: hits.length === 3 ? '成局' : '半合/半会', labels: branches.filter(function (b) { return hits.indexOf(b.zhi) >= 0; }).map(function (b) { return b.label; }),
          zhis: hits, element: group.element, text: group.name + (hits.length === 3 ? '成局' : '有半合/半会信号') });
      }
    });
    var self = {};
    branches.forEach(function (b) {
      if (['辰', '午', '酉', '亥'].indexOf(b.zhi) >= 0) {
        self[b.zhi] = self[b.zhi] || [];
        self[b.zhi].push(b.label);
      }
    });
    Object.keys(self).forEach(function (zhi) {
      if (self[zhi].length > 1) items.push({ type: '自刑', labels: self[zhi], zhis: [zhi], text: self[zhi].join('、') + ' 同见' + zhi + '，有「自刑」信号' });
    });
    return {
      items: items,
      summary: items.length ? '本盘地支关系以「' + items.slice(0, 4).map(function (x) { return x.text; }).join('；') + '」为主。' : '本盘未见明显合冲刑害成组关系，判断重心回到月令、旺衰和十神。',
      sourceIds: ['YHZP', 'SMTH'],
      confidence: confidence(items.length ? 'medium' : 'high', items.length ? '合冲刑害会改变五行气势，已作为辅助权重提示；是否化成新局仍需看月令和透干。' : '未见明显地支结构干扰，基础旺衰判断受关系项影响较小。')
    };
  }

  // ---------- 4. five-element balance ----------
  function balance(chart) {
    var fe = chart.fiveElements.slice().sort(function (a, b) { return b.percent - a.percent; });
    var strongest = fe[0], weakest = fe[fe.length - 1];
    var missing = chart.fiveElements.filter(function (f) { return f.percent === 0; }).map(function (f) { return f.element; });
    var note = '最旺为「' + strongest.element + '」(' + strongest.percent + '%)，最弱为「' + weakest.element + '」(' + weakest.percent + '%)。' +
      (missing.length ? ' 命局缺：' + missing.join('、') + '。' : ' 五行齐备，无缺。');
    return { strongest: strongest, weakest: weakest, missing: missing, note: note };
  }

  // ---------- 5. personality & career from 十神 ----------
  var GOD_TRAIT = {
    比肩: '自立、坚定、重义，行动力强，但易固执、不易妥协。',
    劫财: '果敢、敢冲敢拼、社交活跃，但理财需谨慎、易冲动。',
    食神: '温和、有口福才情、表达与审美佳，享受生活、创造力强。',
    伤官: '聪明、才华外露、表现欲强、不拘常规，需留意言语锋芒。',
    正财: '务实、勤俭、重视稳定与责任，理财稳健。',
    偏财: '大方、机敏、善捕捉机会，财源活络但来去较快。',
    正官: '自律、守规、责任感强、重名誉，适合制度化环境。',
    七杀: '魄力、果决、抗压、有领导与开创力，需调和锋锐之气。',
    正印: '仁厚、好学、重视精神与庇护，有贵人缘与学术倾向。',
    偏印: '敏锐、专精、思维独特、偏好冷门专业，略显孤高内省。'
  };
  var GOD_CAREER = {
    比肩: '合伙、自营、体能/竞技、独立专业',
    劫财: '销售、业务、需魄力的开拓型工作',
    食神: '餐饮、文创、艺术、教育、内容产出',
    伤官: '设计、表演、技术、自媒体、专业表达',
    正财: '财务、实业、稳定经营、固定薪资岗位',
    偏财: '贸易、投资、营销、流动性强的生意',
    正官: '行政、管理、公职、法务、制度型组织',
    七杀: '军警、外科、竞争行业、创业与领导岗',
    正印: '教育、研究、文化、咨询、专业资格',
    偏印: '技术研发、玄学/医药、专精冷门领域'
  };
  function personality(chart) {
    var gods = chart.tenGods.slice().sort(function (a, b) { return b.count - a.count; });
    var top = gods.slice(0, 3);
    var traits = top.map(function (g) { return { god: g.name, count: g.count, text: GOD_TRAIT[g.name] || '' }; });
    var elNature = { 木: '仁，主生发、向上、好学；', 火: '礼，主热情、明朗、外向；', 土: '信，主稳重、包容、务实；', 金: '义，主果决、刚毅、重原则；', 水: '智，主灵活、机变、善谋。' };
    var summary = '日主为' + chart.dayMaster.label + '，' + (elNature[chart.dayMaster.element] || '') +
      '主导十神为' + top.map(function (t) { return t.name; }).join('、') + '，性格底色由此而来。';
    return { traits: traits, summary: summary };
  }
  function career(chart) {
    var gods = chart.tenGods.slice().sort(function (a, b) { return b.count - a.count; });
    var top = gods.slice(0, 3);
    var directions = top.map(function (g) { return { god: g.name, text: GOD_CAREER[g.name] || '' }; });
    // wealth read
    var caiCount = sumGods(chart, ['正财', '偏财']);
    var guanCount = sumGods(chart, ['正官', '七杀']);
    var shiCount = sumGods(chart, ['食神', '伤官']);
    var parts = [];
    parts.push(caiCount ? '命见' + (chart.tenGods.find(function (x) { return x.name === '偏财'; }) ? '偏财' : '正财') + '，财星' + (caiCount >= 2 ? '较旺，对财机敏感' : '透出，重视务实回报') + '；'
      : '财星不显，宜以专业/技术立身，财随业进。');
    parts.push(guanCount ? '官杀星现，具备责任与管理/竞争倾向；' : '官杀不显，更适合自主、专业路线而非层级管理；');
    parts.push(shiCount ? '食伤吐秀，才华与表达是事业突破口。' : '食伤偏少，宜借学习印星厚积薄发。');
    return { directions: directions, note: parts.join(''), caiCount: caiCount, guanCount: guanCount, shiCount: shiCount };
  }

  // ---------- 6. luck-cycle favorability ----------
  function favorOfElements(els, ys) {
    var favSet = {}, unfavSet = {};
    ys.favorable.forEach(function (f) { favSet[f.el] = 1; });
    ys.unfavorable.forEach(function (f) { unfavSet[f.el] = 1; });
    var score = 0, hits = [];
    els.forEach(function (e) {
      if (favSet[e]) { score += 1; hits.push('+' + e); }
      else if (unfavSet[e]) { score -= 1; hits.push('-' + e); }
      else hits.push('·' + e);
    });
    var verdict = score > 0 ? '有利' : (score < 0 ? '不利' : '平稳');
    return { score: score, verdict: verdict, hits: hits };
  }
  function luck(chart, ys) {
    var cycles = chart.luckCycle.map(function (dy) {
      var els = [GAN_WX[dy.gan], ZHI_WX[dy.zhi]];
      var f = favorOfElements(els, ys);
      return { startAge: dy.startAge, startYear: dy.startYear, ganzhi: dy.ganzhi,
        score: f.score, verdict: f.verdict, hits: f.hits, elements: els };
    });
    var good = cycles.filter(function (c) { return c.verdict === '有利'; }).map(function (c) { return c.startAge + '岁起(' + c.ganzhi + ')'; });
    var bad = cycles.filter(function (c) { return c.verdict === '不利'; }).map(function (c) { return c.startAge + '岁起(' + c.ganzhi + ')'; });
    var summary = '以喜用「' + ys.favorable.map(function (f) { return f.el; }).join('') + '」为准：' +
      (good.length ? '较顺的大运有 ' + good.join('、') + '；' : '') +
      (bad.length ? '需留意的大运有 ' + bad.join('、') + '。' : (good.length ? '' : '各运起伏平缓。'));
    return { cycles: cycles, summary: summary };
  }
  function annualFavor(chart, ys, year) {
    var a = root.BaZiEngine.annual(chart, year);
    var els = [a.ganElement, a.zhiElement];
    var f = favorOfElements(els, ys);
    return { year: year, ganzhi: a.ganzhi, score: f.score, verdict: f.verdict, hits: f.hits, elements: els };
  }

  // ---------- 7b. inferences (推测) — every point carries its 依据 ----------
  var WX_INDUSTRY = {
    木: '教育、文化、出版、林木、植物、医药、服装',
    火: '能源、电子、传媒、餐饮、照明、互联网、美妆',
    土: '房地产、建筑、农业、陶瓷、保险、仓储',
    金: '金融、机械、五金、法律、汽车、珠宝',
    水: '贸易、物流、旅游、水产、流动服务、传播'
  };
  var WX_ORGAN = {
    木: '肝胆、筋骨、眼目', 火: '心、小肠、血脉、神志', 土: '脾胃、消化',
    金: '肺、大肠、呼吸、皮肤', 水: '肾、膀胱、泌尿、生殖'
  };

  function infer(chart, an) {
    var st = an.strength, ys = an.yongShen, D = chart.dayMaster.element;
    var gender = (chart.input && chart.input.gender) || '男';
    var fav = ys.favorable.map(function (f) { return f.el; });
    var unf = ys.unfavorable.map(function (f) { return f.el; });
    var favSet = {}; fav.forEach(function (e) { favSet[e] = 1; });
    var strongEnough = st.key === 'strong' || st.key === 'veryStrong' || st.key === 'balanced';
    function cnt(names) { return sumGods(chart, names); }
    function hasSS(n) { return chart.hidden && chart.hidden.shensha && chart.hidden.shensha.some(function (s) { return s.name === n; }); }
    function whereSS(n) { var s = (chart.hidden.shensha || []).find(function (x) { return x.name === n; }); return s ? s.pillars.join('、') : ''; }
    function P(text, basis, note) { return { text: text, basis: basis || [], note: !!note }; }

    var guan = cnt(['正官', '七杀']), shi = cnt(['食神', '伤官']), yin = cnt(['正印', '偏印']),
      cai = cnt(['正财', '偏财']), bi = cnt(['比肩', '劫财']);
    var domains = [];

    // —— 事业 ——
    var careerDom = { domain: '事业', points: [] };
    if (guan > 0 && strongEnough)
      careerDom.points.push(P('适合在制度化、有层级的环境发展，具备走管理或专业岗位的潜力。',
        ['命见官杀 ' + guan + ' 个（约束/责任之星），且日主' + st.band + '，足以任官。']));
    if (cnt(['七杀']) > 0 && (st.key === 'strong' || st.key === 'veryStrong'))
      careerDom.points.push(P('有开创与领导特质，适合竞争性行业或自主创业。',
        ['七杀透出且日主偏强，身旺杀显主魄力果决。']));
    if (shi >= 2)
      careerDom.points.push(P('才华与表达是事业突破口，宜走技艺、创作、自媒体等输出型路线。',
        ['食伤合计 ' + shi + ' 个偏旺，主才华外显、不喜拘束。']));
    if (yin >= 2)
      careerDom.points.push(P('在学术、教育、专业资格方向有优势，宜厚积薄发。',
        ['印星 ' + yin + ' 个，主学识、文凭与庇护。']));
    if (!careerDom.points.length)
      careerDom.points.push(P('宜以一技之长立身，循序渐进发展。', ['官杀、食伤、印星均不突出，命局以平稳见长。']));
    careerDom.points.push(P('行业上较契合与「' + fav.join('、') + '」相关的领域，例如：' +
      fav.map(function (e) { return WX_INDUSTRY[e]; }).join('；') + '。',
      ['取喜用神 ' + fav.join('、') + ' 所属五行对应之行业，从事可扶助命局。']));
    domains.push(careerDom);

    // —— 财富 ——
    var wealthDom = { domain: '财富', points: [] };
    if (cai > 0 && strongEnough)
      wealthDom.points.push(P('有担财能力，财来有源，理财可偏积极。',
        ['财星 ' + cai + ' 个且日主' + st.band + '，身能任财。']));
    if (cai > 0 && (st.key === 'weak' || st.key === 'veryWeak'))
      wealthDom.points.push(P('属「财多身弱」，求财较辛苦，宜稳健量力、先固根本。',
        ['财星 ' + cai + ' 个但日主偏弱，财旺反耗身。']));
    if (cai === 0)
      wealthDom.points.push(P('正偏财不显，宜以稳定正职/专业收入为主，不宜重投机。', ['命中未见明显财星。']));
    if (bi >= 2 && cai > 0)
      wealthDom.points.push(P('合伙与借贷需谨慎，留意因人破财。',
        ['比劫 ' + bi + ' 个偏旺，有「劫财夺财」之象。']));
    if (shi > 0 && cai > 0)
      wealthDom.points.push(P('善于把才华/技能转化为收入。', ['命见食伤又见财星，成「食伤生财」之势。']));
    domains.push(wealthDom);

    // —— 感情婚姻 ——
    var relDom = { domain: '感情婚姻', points: [] };
    var spouseGod = gender === '女' ? ['正官', '七杀'] : ['正财', '偏财'];
    var spouseName = gender === '女' ? '官杀（夫星）' : '财星（妻星）';
    var sCount = cnt(spouseGod);
    var dayZhi = chart.pillars[2].zhi, palaceFav = favSet[ZHI_WX[dayZhi]];
    relDom.points.push(palaceFav
      ? P('配偶宫为喜用，婚姻多得助力，另一半对你的运势有帮衬。',
        ['日支（配偶宫）「' + dayZhi + '」(' + ZHI_WX[dayZhi] + ')属喜用神。'])
      : P('配偶宫偏忌，婚姻需多用心经营、彼此包容。',
        ['日支（配偶宫）「' + dayZhi + '」(' + ZHI_WX[dayZhi] + ')非喜用神。']));
    if (sCount === 0)
      relDom.points.push(P('正缘或较晚，或需主动把握。', [spouseName + '在命中不显。']));
    else if (sCount >= 3)
      relDom.points.push(P('感情世界较丰富、选择多，宜专一定心。', [spouseName + ' ' + sCount + ' 个，偏多偏杂。']));
    if (hasSS('桃花'))
      relDom.points.push(P('异性缘佳、有魅力，社交中较受欢迎。', ['命带桃花（' + whereSS('桃花') + '）。']));
    domains.push(relDom);

    // —— 学业才华 ——
    var studyDom = { domain: '学业才华', points: [] };
    if (yin > 0) studyDom.points.push(P('学习吸收力强，与文凭、专业资格有缘。', ['印星 ' + yin + ' 个，主学识。']));
    if (shi > 0) studyDom.points.push(P('思维灵活，具创造与表达天赋。', ['食伤 ' + shi + ' 个，主才华吐秀。']));
    if (hasSS('文昌贵人')) studyDom.points.push(P('利于考试、文书与学术发展。', ['命带文昌贵人（' + whereSS('文昌贵人') + '）。']));
    if (cnt(['伤官']) > 0 && yin > 0)
      studyDom.points.push(P('「伤官配印」，聪明而有节制，宜学术与专业并进。', ['命中伤官与印星并见，相互调和。']));
    if (!studyDom.points.length) studyDom.points.push(P('学业宜稳扎稳打，以勤补拙。', ['印星与食伤均不突出。']));
    domains.push(studyDom);

    // —— 健康养生（提示性，非诊断）——
    var healthDom = { domain: '健康养生', points: [] };
    var weakest = an.balance.weakest, strongest = an.balance.strongest, missing = an.balance.missing;
    if (weakest.percent < 15 || missing.length) {
      var weakEls = missing.length ? missing : [weakest.element];
      healthDom.points.push(P('宜留意与「' + weakEls.join('、') + '」相关部位的保养：' +
        weakEls.map(function (e) { return WX_ORGAN[e]; }).join('；') + '。',
        ['命局五行偏弱/缺：' + weakEls.join('、') + '，对应脏腑能量偏弱。']));
    }
    if (strongest.percent >= 35)
      healthDom.points.push(P('「' + strongest.element + '」偏旺，注意' + WX_ORGAN[strongest.element] + '系统不过亢，劳逸结合。',
        ['五行中' + strongest.element + '占 ' + strongest.percent + '%，明显偏旺。']));
    if (!healthDom.points.length)
      healthDom.points.push(P('五行较均衡，体质平和，规律作息即可。', ['五行分布无明显偏枯。']));
    healthDom.points.push(P('以上仅为传统五行养生提示，非医疗诊断；如有不适请及时就医。', [], true));
    domains.push(healthDom);

    // —— 大运流年时机 ——
    var timingDom = { domain: '大运流年时机', points: [] };
    var good = an.luck.cycles.filter(function (c) { return c.verdict === '有利'; });
    var bad = an.luck.cycles.filter(function (c) { return c.verdict === '不利'; });
    if (good.length)
      timingDom.points.push(P('较顺遂、宜进取的阶段：' + good.map(function (c) { return c.startAge + '岁起(' + c.ganzhi + ')'; }).join('、') + '。',
        ['这些大运五行属喜用「' + fav.join('、') + '」，扶助命局。']));
    if (bad.length)
      timingDom.points.push(P('宜守成、稳健的阶段：' + bad.map(function (c) { return c.startAge + '岁起(' + c.ganzhi + ')'; }).join('、') + '。',
        ['这些大运五行属忌神「' + unf.join('、') + '」，宜避险固本。']));
    timingDom.points.push(P('可在「流年」面板逐年查看吉凶倾向与依据。', [], true));
    domains.push(timingDom);

    return { domains: domains, disclaimer: '以下为依据命局规则推演的倾向性判断，非确定性预测，请理性参考。' };
  }

  // ---------- top-level ----------
  function analyze(chart) {
    var st = strength(chart);
    var ys = yongShen(chart, st);
    var relations = branchRelations(chart);
    var result = {
      strength: st,
      yongShen: ys,
      geJu: geJu(chart),
      balance: balance(chart),
      relations: relations,
      personality: personality(chart),
      career: career(chart),
      luck: luck(chart, ys),
      sources: SOURCE_LIBRARY,
      confidence: overallConfidence(st, ys, relations),
      methodology: methodologyNotes(),
      disclaimer: '以上为传统命理「扶抑法」的规则化推演，属文化与分析框架，非科学预测，仅供参考与自我观照。'
    };
    result.inferences = infer(chart, result);
    return result;
  }

  // helpers
  function round1(n) { return Math.round(n * 10) / 10; }
  function relationType(map, a, b) { return map[a + b] || map[b + a] || ''; }
  function confidence(level, note) {
    var labelMap = { high: '较高', medium: '中等', low: '需复核' };
    return { level: level, label: labelMap[level] || level, note: note };
  }
  function strengthConfidence(ratio, deLing, roots) {
    var distance = Math.min(Math.abs(ratio - 0.42), Math.abs(ratio - 0.58));
    if (distance < 0.04) return confidence('low', '旺衰接近分界线，单靠量化指数不足以定性，需要结合调候、透干和合冲。');
    if ((ratio < 0.42 && !deLing) || (ratio > 0.58 && roots >= 2)) return confidence('high', '月令、根气与生扶比例方向一致，旺衰判断较稳。');
    return confidence('medium', '月令、根气或生扶比例存在拉扯，按中等置信度处理。');
  }
  function yongConfidence(st) {
    if (st.confidence.level === 'high') return confidence('high', '喜忌与旺衰方向一致，可作为主要平衡取向。');
    if (st.key === 'veryWeak' || st.key === 'veryStrong') return confidence('low', '极端强弱可能涉及从格或专旺格，需人工复核。');
    return confidence('medium', '喜忌按扶抑法给出，但仍需结合格局、调候和岁运复核。');
  }
  function overallConfidence(st, ys, relations) {
    var levels = [st.confidence.level, ys.confidence.level, relations.confidence.level];
    if (levels.indexOf('low') >= 0) return confidence('low', '存在接近分界、从格可能或地支关系干扰，结论应作为倾向而非定论。');
    if (levels.every(function (x) { return x === 'high'; })) return confidence('high', '旺衰、喜忌和地支结构方向较一致。');
    return confidence('medium', '核心判断可用，但部分信息需结合岁运和具体问题继续复核。');
  }
  function methodologyNotes() {
    return [
      '本产品以子平法为主线：先定四柱和月令，再看旺衰、格局、喜忌、十神与岁运。',
      '五行百分比是为了可视化而设计的结构指数，并非古籍中的固定算法。',
      '神煞、纳音、空亡、胎元、命宫只作为辅助信号，不覆盖月令、旺衰、喜忌和大运主线。',
      '不同古籍和流派存在取法差异；当信号冲突时，页面会降低置信度或提示需要复核。'
    ];
  }
  function uniqEl(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) { if (x.el && !seen[x.el]) { seen[x.el] = 1; out.push(x); } });
    return out;
  }
  function sumGods(chart, names) {
    return chart.tenGods.reduce(function (a, g) { return a + (names.indexOf(g.name) >= 0 ? g.count : 0); }, 0);
  }

  var api = { analyze: analyze, annualFavor: annualFavor, strength: strength, yongShen: yongShen, sources: SOURCE_LIBRARY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BaZiAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis);
