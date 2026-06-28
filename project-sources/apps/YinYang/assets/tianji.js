/* 天機閣 TIANJI PAVILION — dark-gold dashboard.
   Reuses window.BaZiEngine + window.BaZiAnalysis (real calculation) and lunar.js. */
(function () {
  'use strict';

  // ---------- maps ----------
  var GAN_WX = { 甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水' };
  var ZHI_WX = { 子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水' };
  var KE = { 木:'土',土:'水',水:'火',火:'金',金:'木' };
  var EL_CLASS = { 木:'wood',火:'fire',土:'earth',金:'metal',水:'water' };
  var ZODIAC = { 子:'鼠',丑:'牛',寅:'虎',卯:'兔',辰:'龙',巳:'蛇',午:'马',未:'羊',申:'猴',酉:'鸡',戌:'狗',亥:'猪' };
  var SHICHEN = { 子:'子时 23-1',丑:'丑时 1-3',寅:'寅时 3-5',卯:'卯时 5-7',辰:'辰时 7-9',巳:'巳时 9-11',午:'午时 11-13',未:'未时 13-15',申:'申时 15-17',酉:'酉时 17-19',戌:'戌时 19-21',亥:'亥时 21-23' };
  var DIR = { 木:'正东',火:'正南',土:'中宫',金:'正西',水:'正北' };
  var EL_COLOR = { 木:{name:'松柏绿',hex:'#5FB58F'},火:{name:'朱砂红',hex:'#D26A50'},土:{name:'琥珀黄',hex:'#C9A24B'},金:{name:'月白',hex:'#C9CDD6'},水:{name:'黛蓝',hex:'#5B83B8'} };
  var EL_NUM = { 水:'1·6',火:'2·7',木:'3·8',金:'4·9',土:'5·0' };
  var EL_GUA = { 火:{s:'☲',n:'离为火'},水:{s:'☵',n:'坎为水'},木:{s:'☳',n:'震为雷'},金:{s:'☰',n:'乾为天'},土:{s:'☷',n:'坤为地'} };
  var TIANYI = { 甲:'丑未',戊:'丑未',庚:'丑未',乙:'子申',己:'子申',丙:'亥酉',丁:'亥酉',壬:'卯巳',癸:'卯巳',辛:'午寅' };
  var MONTH_ZHI = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

  // trigrams: index→{name,sym,lines bottom→top}
  var TRI = [
    { n:'乾',s:'☰',l:[1,1,1],wx:'金' }, { n:'兑',s:'☱',l:[1,1,0],wx:'金' },
    { n:'离',s:'☲',l:[1,0,1],wx:'火' }, { n:'震',s:'☳',l:[1,0,0],wx:'木' },
    { n:'巽',s:'☴',l:[0,1,1],wx:'木' }, { n:'坎',s:'☵',l:[0,1,0],wx:'水' },
    { n:'艮',s:'☶',l:[0,0,1],wx:'土' }, { n:'坤',s:'☷',l:[0,0,0],wx:'土' }
  ];
  var EL_TRI = { 金:0, 火:2, 木:3, 水:5, 土:7 };
  // King Wen names [upper][lower], order 乾兑离震巽坎艮坤
  var HEX = [
    ['乾为天','天泽履','天火同人','天雷无妄','天风姤','天水讼','天山遁','天地否'],
    ['泽天夬','兑为泽','泽火革','泽雷随','泽风大过','泽水困','泽山咸','泽地萃'],
    ['火天大有','火泽睽','离为火','火雷噬嗑','火风鼎','火水未济','火山旅','火地晋'],
    ['雷天大壮','雷泽归妹','雷火丰','震为雷','雷风恒','雷水解','雷山小过','雷地豫'],
    ['风天小畜','风泽中孚','风火家人','风雷益','巽为风','风水涣','风山渐','风地观'],
    ['水天需','水泽节','水火既济','水雷屯','水风井','坎为水','水山蹇','水地比'],
    ['山天大畜','山泽损','山火贲','山雷颐','山风蛊','山水蒙','艮为山','山地剥'],
    ['地天泰','地泽临','地火明夷','地雷复','地风升','地水师','地山谦','坤为地']
  ];

  // ---------- helpers ----------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0,2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function elc(ch) { return EL_CLASS[GAN_WX[ch] || ZHI_WX[ch]] || ''; }
  function genderLabel(g) { return g === 'female' || g === '女' ? '女' : '男'; }
  function favScore(els, ys) {
    var f = {}, u = {}; ys.favorable.forEach(function (x) { f[x.el] = 1; }); ys.unfavorable.forEach(function (x) { u[x.el] = 1; });
    var s = 0; els.forEach(function (e) { if (f[e]) s++; else if (u[e]) s--; }); return s;
  }
  function verdict(score) {
    return score >= 85 ? '大吉' : score >= 72 ? '中吉' : score >= 60 ? '小吉' : score >= 48 ? '平' : '凶';
  }
  function dayComposite(chart, an, y, m, d) {
    var dd = window.BaZiEngine.daily(chart, y, m, d);
    var f = favScore([dd.ganElement, dd.zhiElement], an.yongShen);
    var jitter = ((y * 73 + m * 31 + d * 17) % 7) - 3;
    return clamp(Math.round(70 + f * 9 + jitter), 32, 98);
  }

  // ---------- state ----------
  var state = {
    route: 'daily',
    chart: null,
    analysis: null,
    birth: { name: '张明远', year: 1990, month: 6, day: 15, hour: 12, minute: 0, gender: 'male', calendar: 'solar', leapMonth: false, place: '上海', trueSolarTime: false, longitude: 121.47, meridian: 120 },
    bzTab: 'bazi',
    accent: 'mojin',
    trendRange: 'month',
    memberPlan: 'free',
    sign: null,
    hexMethod: 'coin',
    hexQuestion: '谋事可成否',
    hexResult: null,
    matchBirth: { year: 1992, month: 8, day: 8, hour: 14, minute: 0, gender: 'female', calendar: 'solar', leapMonth: false, place: '上海', trueSolarTime: false, longitude: 121.47, meridian: 120 },
    matchResult: null,
    chat: null,
    defaultCalendar: 'solar',
    today: new Date()
  };
  function applyAccent() { document.documentElement.setAttribute('data-accent', state.accent); }
  function cycleAccent() {
    var order = ['mojin', 'zhusha', 'shuimo'];
    state.accent = order[(order.indexOf(state.accent) + 1) % 3];
    try { localStorage.setItem('tianji-accent', state.accent); } catch (e) {}
    applyAccent(); renderShell();
    toast('配色 · ' + ({ mojin: '墨金', zhusha: '朱砂', shuimo: '水墨' })[state.accent]);
  }
  function toast(msg) {
    var t = el('div', { class: 'toast' }, [msg]);
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300); }, 2200);
  }

  var CITY_COORDS = {
    上海: [121.47, 120], 北京: [116.41, 120], 广州: [113.26, 120], 深圳: [114.06, 120],
    杭州: [120.15, 120], 南京: [118.80, 120], 成都: [104.07, 120], 重庆: [106.55, 120],
    武汉: [114.30, 120], 西安: [108.94, 120], 台北: [121.56, 120], 香港: [114.17, 120],
    东京: [139.69, 135], 首尔: [126.98, 135], 新加坡: [103.82, 120],
    纽约: [-74.01, -75], 洛杉矶: [-118.24, -120], 伦敦: [-0.13, 0], 巴黎: [2.35, 0]
  };
  function numOr(v, fallback) {
    var n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function coordsFor(place) {
    var p = (place || '').trim();
    return CITY_COORDS[p] || CITY_COORDS[p.replace(/市$/, '')] || null;
  }
  function applyCityCoords(place, lonInput, merInput) {
    var c = coordsFor(place.value || place);
    if (!c) return;
    if (lonInput) lonInput.value = c[0];
    if (merInput) merInput.value = c[1];
  }
  function birthPayload(b, includeName) {
    return {
      name: includeName === false ? undefined : (b.name || '命主'),
      year: +b.year, month: +b.month, day: +b.day,
      hour: +b.hour, minute: +b.minute,
      gender: b.gender || 'male',
      calendar: b.calendar || 'solar',
      leapMonth: !!b.leapMonth,
      place: b.place || '',
      trueSolarTime: !!b.trueSolarTime,
      longitude: numOr(b.longitude, 121.47),
      standardMeridian: numOr(b.meridian, 120)
    };
  }
  function normalizedBirthFromRecord(r) {
    return {
      name: r.name || '',
      year: +r.year, month: +r.month, day: +r.day,
      hour: +r.hour, minute: +r.minute,
      gender: r.gender === '男' ? 'male' : (r.gender === '女' ? 'female' : (r.gender || 'male')),
      calendar: r.calendar || 'solar',
      leapMonth: !!r.leapMonth,
      place: r.place || '',
      trueSolarTime: !!r.trueSolarTime,
      longitude: numOr(r.longitude, 121.47),
      meridian: numOr(r.meridian, 120)
    };
  }

  function recompute() {
    state.chart = window.BaZiEngine.compute(birthPayload(state.birth));
    state.analysis = window.BaZiAnalysis.analyze(state.chart);
  }

  // ---------- nav ----------
  var NAV = [
    { grp: '命 理', items: [
      { id: 'daily', ic: '運', t: '今日运势', en: 'Daily Fortune' },
      { id: 'chart', ic: '盤', t: '排盘命理', en: 'Natal Chart' },
      { id: 'hexagram', ic: '卦', t: '周易起卦', en: 'Hexagram' },
      { id: 'zodiac', ic: '星', t: '星座运势', en: 'Zodiac' },
      { id: 'analytics', ic: '勢', t: '运势分析', en: 'Analytics' },
      { id: 'records', ic: '錄', t: '历史记录', en: 'Records' }
    ]},
    { grp: '智 能', items: [
      { id: 'oracle', ic: '卜', t: '天机问答', en: 'AI Oracle' }
    ]},
    { grp: '个 人', items: [
      { id: 'member', ic: '玄', t: '玄微会员', en: 'Membership' },
      { id: 'match', ic: '緣', t: '缘分配对', en: 'Match' },
      { id: 'settings', ic: '設', t: '偏好设置', en: 'Settings' }
    ]}
  ];
  var TITLES = {
    daily: ['今日运势', '观天时 · 察气运 · 顺势而为'],
    chart: ['排盘命理', '四柱八字 · 紫微斗数 · 命局详断'],
    hexagram: ['周易起卦', '六爻起卦 · 本卦变卦 · 卦辞详解'],
    zodiac: ['星座运势', '十二星座 · 今日 / 本周 / 本月运程'],
    oracle: ['天机问答', '本地规则问答 · 结合命盘为您解惑'],
    analytics: ['运势分析', '流年大运 · 五行强弱 · 吉凶推演'],
    member: ['玄微会员', '高级命盘 · 深度流年 · 合盘报告'],
    records: ['历史记录', '历次占断 · 解读归档'],
    match: ['缘分配对', '双人合盘 · 关系结构分析'],
    settings: ['偏好设置', '主题 · 历法 · 命主管理']
  };

  // ---------- shell ----------
  var root = document.getElementById('app');
  function renderShell() {
    root.innerHTML = '';
    var sb = el('div', { class: 'sidebar' });
    sb.appendChild(el('div', { class: 'brand' }, [
      el('div', { class: 'seal' }, ['機']),
      el('div', {}, [ el('div', { class: 'brand-name' }, ['天機閣']), el('div', { class: 'brand-en' }, ['TIANJI PAVILION']) ])
    ]));
    NAV.forEach(function (g) {
      var grp = el('div', { class: 'nav-group' }, [el('div', { class: 'grp-label' }, [g.grp])]);
      g.items.forEach(function (it) {
        grp.appendChild(el('div', { class: 'nav-item' + (state.route === it.id ? ' active' : ''), onclick: function () { setRoute(it.id); } }, [
          el('div', { class: 'ico' }, [it.ic]),
          el('div', { class: 'nav-text' }, [ el('span', { class: 'nav-tt' }, [it.t]), el('span', { class: 'nav-en' }, [it.en]) ])
        ]));
      });
      sb.appendChild(grp);
    });
    var main = el('div', { class: 'main' });
    var t = TITLES[state.route] || ['', ''];
    var ld = window.Solar ? window.Solar.fromDate(state.today).getLunar() : null;
    var dateText = ld ? (ld.getYearInGanZhi() + '年 ' + ld.getMonthInChinese() + '月' + ld.getDayInChinese() + ' · ' + ld.getDayInGanZhi() + '日') : '';
    var nm = state.birth.name || '命主';
    main.appendChild(el('div', { class: 'topbar' }, [
      el('div', { class: 'topbar-title' }, [
        el('h1', { class: 'page-title' }, [t[0]]),
        el('div', { class: 'page-meta' }, [
          el('span', { class: 'page-sub' }, [t[1]]),
          dateText ? el('span', { class: 'page-date' }, [dateText]) : null
        ])
      ]),
      el('div', { class: 'topbar-right' }, [
        el('button', { class: 'icon-btn', title: '配色切换', onclick: cycleAccent }, ['◑']),
        el('button', { class: 'icon-btn', title: '通知', onclick: function () { toast('暂无新通知 · 今日气运已更新'); } }, [ '鈴', el('span', { class: 'dot' }) ]),
        el('div', { class: 'avatar', title: '切换命主', onclick: openBirthModal }, [
          el('div', { class: 'av' }, [nm.slice(-2, -1) || '張']),
          el('div', {}, [ el('div', { class: 'av-name' }, [nm]), el('div', { class: 'av-sub' }, [state.chart ? state.chart.dayMaster.label + ' · ' + genderLabel(state.chart.input.gender) : '']) ])
        ])
      ])
    ]));
    var content = el('div', { class: 'content', id: 'content' });
    main.appendChild(content);
    root.appendChild(sb);
    root.appendChild(main);
    renderPage(content);
  }

  function setRoute(id) { state.route = id; renderShell(); }

  function renderPage(c) {
    var r = state.route;
    if (r === 'daily') return pageDaily(c);
    if (r === 'chart') return pageChart(c);
    if (r === 'analytics') return pageAnalytics(c);
    if (r === 'records') return pageRecords(c);
    if (r === 'hexagram') return pageHexagram(c);
    if (r === 'zodiac') return pageZodiac(c);
    if (r === 'oracle') return pageOracle(c);
    if (r === 'match') return pageMatch(c);
    if (r === 'member') return pageMember(c);
    if (r === 'settings') return pageSettings(c);
    return placeholder(c, r);
  }

  // ---------- page: 今日运势 ----------
  function pageDaily(c) {
    var chart = state.chart, an = state.analysis, today = state.today;
    var y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();
    var score = dayComposite(chart, an, y, m, d);
    var vd = verdict(score);
    var dd = window.BaZiEngine.daily(chart, y, m, d);
    var fav = favScore([dd.ganElement, dd.zhiElement], an.yongShen);
    var favEls = an.yongShen.favorable.map(function (x) { return x.el; });
    var dmEl = chart.dayMaster.element;

    // info
    var caiEl = KE[dmEl];
    var guiBranch = (TIANYI[chart.dayMaster.gan] || '丑')[0];
    var jiShi = favEls.map(function (e) { for (var z in ZHI_WX) if (ZHI_WX[z] === e) return z; return null; }).filter(Boolean);
    var jiShiZhi = jiShi[0] || '午';
    var colorEl = favEls[0] || dmEl;
    var luckyNum = favEls.slice(0, 2).map(function (e) { return EL_NUM[e].split('·')[0]; }).join(' · ');
    var gua = EL_GUA[dmEl] || EL_GUA['土'];

    function baguaRing(sc) {
      var cx = 130, cy = 130, R = 104, circ = 2 * Math.PI * R, off = circ * (1 - sc / 100);
      var svg = svgEl('svg', { viewBox: '0 0 260 260', width: '240', height: '240', class: 'bagua-ring' });
      svg.appendChild(svgEl('defs', {}, ['<linearGradient id="ggrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5C25"/><stop offset="0.55" stop-color="#C9A24B"/><stop offset="1" stop-color="#F0D38A"/></linearGradient>']));
      svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: R + 18, fill: 'none', stroke: 'rgba(201,162,75,0.10)', 'stroke-width': '1' }));
      svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: R - 24, fill: 'none', stroke: 'rgba(201,162,75,0.08)', 'stroke-width': '1' }));
      ['☰','☱','☲','☳','☴','☵','☶','☷'].forEach(function (gm, i) {
        var a = -Math.PI / 2 + i * Math.PI / 4;
        svg.appendChild(svgEl('text', { x: cx + Math.cos(a) * (R + 18), y: cy + Math.sin(a) * (R + 18) + 5, 'text-anchor': 'middle', class: 'bagua-mark' }, [gm]));
      });
      svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: 'rgba(201,162,75,0.10)', 'stroke-width': '10' }));
      var arc = svgEl('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: 'url(#ggrad)', 'stroke-width': '10', 'stroke-linecap': 'round', 'stroke-dasharray': circ, 'stroke-dashoffset': circ, transform: 'rotate(-90 ' + cx + ' ' + cy + ')' });
      svg.appendChild(arc);
      requestAnimationFrame(function () { setTimeout(function () { arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.32,.72,0,1)'; arc.setAttribute('stroke-dashoffset', off); }, 90); });
      return svg;
    }

    // ---- 综合评分 ----
    var lede = vd === '大吉' || vd === '中吉' ? '紫气东来，诸事顺遂' : vd === '凶' ? '宜守为安，静待时机' : '平和持中，稳步而行';
    var scoreCard = el('div', { class: 'd-card score-card' }, [
      el('div', { class: 'd-kicker' }, ['综合运势 · DAILY INDEX']),
      el('div', { class: 'ring-wrap' }, [ baguaRing(score), el('div', { class: 'ring-center' }, [
        el('div', { class: 'score-num' }, [String(score)]),
        el('div', { class: 'score-grade' }, [vd])
      ]) ]),
      el('div', { class: 'score-lede' }, [lede]),
      el('div', { class: 'score-sub' }, ['日课 ' + dd.ganzhi + ' · 喜用 ' + favEls.join('') + ' · ' + (fav > 0 ? '顺势上行' : fav < 0 ? '收敛守成' : '平稳推进')])
    ]);

    // ---- 今日分析 ----
    var dims = [
      ['事业', dimScore(chart, fav, ['正官','七杀','正印','偏印'])],
      ['财帛', dimScore(chart, fav, ['正财','偏财','食神'])],
      ['姻缘', dimScore(chart, fav, ['正财','偏财','正官','七杀'])],
      ['健康', dimScore(chart, fav, ['比肩','劫财','正印','偏印'])],
      ['人际', dimScore(chart, fav, ['比肩','劫财','食神','伤官'])]
    ];
    var dimStrip = el('div', { class: 'dim-strip' }, dims.map(function (x) {
      var sp = el('span'); sp.setAttribute('data-w', x[1]);
      return el('div', { class: 'dim-cell' }, [ el('div', { class: 'dim-lab' }, [x[0]]), el('div', { class: 'dim-bar' }, [sp]), el('div', { class: 'dim-val' }, [String(x[1])]) ]);
    }));
    var analysisCard = el('div', { class: 'd-card analysis-card' }, [
      el('div', { class: 'd-card-h' }, [ el('h3', {}, ['今日分析']), el('span', { class: 'grade-pill ' + (fav > 0 ? 'up' : fav < 0 ? 'down' : '') }, [fav > 0 ? '有利' : fav < 0 ? '需谨慎' : '平稳']) ]),
      el('p', { class: 'd-body' }, ['今日「' + dd.ganzhi + '」当令，五行偏增 ' + dd.ganElement + '、' + dd.zhiElement + '。相对本盘喜用「' + favEls.join('、') + '」，今日气机' + (fav > 0 ? '相生得力' : fav < 0 ? '克泄耗身' : '中性平衡') + '——' + (fav > 0 ? '宜主动推进重点事项，把握贵人与时机。' : fav < 0 ? '宜降低并行、先理边界，慎做重大决断。' : '按既定节奏稳步推进即可。')]),
      el('div', { class: 'dim-title' }, ['今日运势维度']),
      dimStrip
    ]);

    // ---- 四宫格 ----
    function statCard(lab, val, note, glyph, cls) {
      return el('div', { class: 'd-card stat-card' }, [
        el('div', { class: 'stat-glyph' }, [glyph]),
        el('div', { class: 'stat-lab' }, [lab]),
        el('div', { class: 'stat-val ' + (cls || '') }, [val]),
        el('div', { class: 'stat-note' }, [note])
      ]);
    }
    var statGrid = el('div', { class: 'stat-grid' }, [
      statCard('今日吉时', jiShiZhi + '时', (SHICHEN[jiShiZhi] || '').split(' ')[1] || '宜行事', '時', 'c-' + EL_CLASS[ZHI_WX[jiShiZhi]]),
      statCard('财神方位', DIR[caiEl] || '中宫', caiEl + '为财 · 宜朝此向', '財', 'c-' + EL_CLASS[caiEl]),
      statCard('贵人生肖', '属' + (ZODIAC[guiBranch] || '虎'), '天乙贵人 · 得其助', '貴', 'gold'),
      statCard('本命卦象', gua.s, gua.n + ' · 本命卦', '卦', 'gold')
    ]);

    // ---- 宜 / 忌 ----
    var yiItems = fav >= 0
      ? [['福','祈福纳祥','祭祀祈愿、求安顺'],['契','签约会谈','利合作、定盟约'],['行','出行远动','驿马得用、外出顺']]
      : [['静','静养蓄能','独处养神、固本元'],['学','进修学习','读书、规划、蓄势'],['整','整理复盘','理旧务、清积压']];
    var jiItems = fav >= 0
      ? [['土','动土修造','忌破土、迁移'],['讼','争讼口角','忌冲突、签字纠纷']]
      : [['进','冒进决断','忌重大决策'],['博','投机博弈','忌高风险投入'],['怒','意气用事','忌冲动争执']];
    function yjList(items, kind) {
      return el('div', { class: 'yj-list' }, items.map(function (it) {
        return el('div', { class: 'yj-item' }, [ el('div', { class: 'yj-chip ' + kind }, [it[0]]), el('div', {}, [ el('div', { class: 'yj-name' }, [it[1]]), el('div', { class: 'yj-note' }, [it[2]]) ]) ]);
      }));
    }
    var yiCard = el('div', { class: 'd-card yi-card' }, [ el('div', { class: 'yj-head' }, [ el('span', { class: 'yj-badge yi' }, ['宜']), '今日宜' ]), yjList(yiItems, 'yi') ]);
    var jiCard = el('div', { class: 'd-card ji-card' }, [ el('div', { class: 'yj-head' }, [ el('span', { class: 'yj-badge ji' }, ['忌']), '今日忌' ]), yjList(jiItems, 'ji') ]);

    // assemble core
    c.appendChild(el('div', { class: 'd-hero' }, [scoreCard, analysisCard]));
    c.appendChild(statGrid);
    c.appendChild(el('div', { class: 'yj-grid' }, [yiCard, jiCard]));

    // ---- 今日详情（次级） ----
    c.appendChild(el('div', { class: 'd-divider' }, [el('span', {}, ['今 日 详 情'])]));
    var td = trendData(chart, an, y, m, d, state.trendRange);
    function segBtn(lab, key) { return el('button', { class: state.trendRange === key ? 'on' : '', onclick: function () { state.trendRange = key; setRoute('daily'); } }, [lab]); }
    var trendTitle = state.trendRange === 'month' ? '近三十日运势走势' : state.trendRange === 'quarter' ? '近一季运势走势' : '本年逐月运势走势';
    var trendCard = el('div', { class: 'd-card' }, [
      el('div', { class: 'd-card-h' }, [ el('h3', {}, [trendTitle]), el('div', { class: 'seg' }, [ segBtn('月', 'month'), segBtn('季', 'quarter'), segBtn('年', 'year') ]) ]),
      lineChart(td.vals, td.peak, td.labels, td.meta)
    ]);
    var feOrder = ['金','木','水','火','土'];
    var feMap = {}; chart.fiveElements.forEach(function (f) { feMap[f.element] = f.percent; });
    var feCard = el('div', { class: 'd-card' }, [ el('div', { class: 'd-card-h' }, [ el('h3', {}, ['五行能量']), el('span', { class: 'sub' }, ['喜用 ' + favEls.join('')]) ]) ]);
    feOrder.forEach(function (e) { feCard.appendChild(barRow(e + ' ' + e, feMap[e] || 0, 'f-' + EL_CLASS[e], 'c-' + EL_CLASS[e])); });
    var g = guaOfDay(chart, dd);
    var guaCard = el('div', { class: 'd-card' }, [
      el('div', { class: 'd-card-h' }, [el('h3', {}, ['今日一卦'])]),
      el('div', { style: 'display:flex;gap:20px;align-items:center;margin-bottom:14px' }, [ guaGlyph(g.lines, g.moving), el('div', {}, [ el('div', { class: 'gua-name' }, [g.name]), el('div', { class: 'gua-sub', style: 'margin-top:6px' }, [g.tris + ' · ' + vd]) ]) ]),
      el('p', { class: 'prose' }, [g.text])
    ]);
    var hourCard = hourFlowCard(chart, an);
    var tipCard = el('div', { class: 'd-card' }, [
      el('div', { class: 'd-card-h' }, [el('h3', {}, ['开运锦囊'])]),
      tipRow(EL_COLOR[colorEl].name[0], '佩戴' + EL_COLOR[colorEl].name + ' · ' + (DIR[caiEl] || '正南') + '向', '助旺' + jiShiZhi + '时贵人运', EL_CLASS[colorEl]),
      tipRow((favEls[1] || favEls[0]), '多近' + (favEls[1] || favEls[0]) + ' · 调候命局', '以喜用调候润命局', EL_CLASS[favEls[1] || favEls[0]]),
      tipRow('福', jiShiZhi + '时祈福 · 行善', '积德以厚载福报', 'earth')
    ]);
    var posterCard = el('div', { class: 'd-card' }, [
      el('div', { class: 'd-card-h' }, [el('h3', {}, ['分享海报'])]),
      el('p', { class: 'prose', style: 'margin-bottom:16px' }, ['包含四柱、日主、今日评分、幸运色与五行分布，适合保存或分享。']),
      el('button', { class: 'btn-gold', style: 'width:auto;padding:11px 22px', onclick: function () { createTianjiPoster({ chart: chart, analysis: an, score: score, verdict: vd, daily: dd, luckyColor: EL_COLOR[colorEl], colorEl: colorEl, luckyDir: DIR[caiEl] || '中宫', luckyTime: jiShiZhi + '时' }); } }, ['生成分享海报'])
    ]);
    c.appendChild(el('div', { class: 'd-row2' }, [trendCard, feCard]));
    c.appendChild(el('div', { class: 'd-row3' }, [hourCard, tipCard, guaCard]));
    c.appendChild(el('div', { style: 'margin-top:24px' }, [posterCard]));
    requestAnimationFrame(function () { setTimeout(function () { Array.prototype.forEach.call(c.querySelectorAll('[data-w]'), function (s) { s.style.width = s.getAttribute('data-w') + '%'; }); }, 70); });
  }

  function hourFlowCard(chart, an) {
    var now = new Date();
    var hourIdx = Math.floor((now.getHours() + 1) / 2) % 12;
    var zhi = BR[hourIdx];
    var elx = ZHI_WX[zhi];
    var f = favScore([elx], an.yongShen);
    var nextHour = (hourIdx * 2 + 1) % 24;
    var nextTime = pad(nextHour) + ':00';
    var pct = ((now.getHours() % 2) * 60 + now.getMinutes()) / 120 * 100;
    var title = f > 0 ? '当前时辰顺势' : f < 0 ? '当前时辰宜收敛' : '当前时辰平稳';
    var card = el('div', { class: 'card hour-flow' }, [
      el('div', { class: 'card-h' }, [el('div', {}, [el('h3', {}, ['时辰流转']), el('div', { class: 'sub' }, ['实时按当前时间推演'])])]),
      el('div', { class: 'hour-main c-' + EL_CLASS[elx] }, [zhi + '时']),
      el('div', { class: 'hour-state ' + (f > 0 ? 'joy' : f < 0 ? 'warn' : '') }, [title]),
      el('p', { class: 'prose' }, ['此时五行为「' + elx + '」，对本盘喜用「' + an.yongShen.favorable.map(function (x) { return x.el; }).join('') + '」判断为' + (f > 0 ? '可用之气，适合推进重点事项。' : f < 0 ? '消耗之气，适合复盘、整理与降低冲突。' : '中性之气，适合维持既定节奏。')]),
      el('div', { class: 'hour-progress' }, [el('span', { style: 'width:' + pct.toFixed(1) + '%' })]),
      el('div', { class: 'hour-next' }, ['下一时辰 · ' + nextTime])
    ]);
    return card;
  }

  function createTianjiPoster(data) {
    var canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    var ctx = canvas.getContext('2d');
    var chart = data.chart;
    var fav = data.analysis.yongShen.favorable.map(function (f) { return f.el; }).join('');
    posterBg(ctx);
    posterHeader(ctx, chart);
    posterScore(ctx, data, fav);
    drawPosterPillars(ctx, chart);
    drawPosterElements(ctx, chart.fiveElements);
    drawPosterLuck(ctx, data);
    posterFooter(ctx);
    canvas.toBlob(function (blob) {
      if (!blob) return toast('海报生成失败');
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'tianji-poster-' + chart.input.date.replace(/\./g, '-') + '.png';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
      toast('分享海报已生成');
    }, 'image/png');
  }
  function posterBg(ctx) {
    var bg = ctx.createLinearGradient(0, 0, 0, 1440);
    bg.addColorStop(0, '#181410'); bg.addColorStop(0.56, '#100D09'); bg.addColorStop(1, '#0B0A08');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1440);
    ctx.fillStyle = 'rgba(201,162,75,0.05)'; roundRect(ctx, 54, 54, 972, 1332, 34, true);
    ctx.strokeStyle = 'rgba(201,162,75,0.14)'; ctx.lineWidth = 2; roundRect(ctx, 54, 54, 972, 1332, 34, false);
  }
  function posterHeader(ctx, chart) {
    ctx.fillStyle = '#C9A24B'; ctx.font = '24px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText('天機閣  TIANJI PAVILION', 108, 128);
    ctx.fillStyle = '#ECE4D2'; ctx.font = '700 58px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(chart.input.name || '命主', 108, 218);
    ctx.fillStyle = '#9A917C'; ctx.font = '26px PingFang SC, Microsoft YaHei, sans-serif';
    ctx.fillText(chart.input.rawDate + '  ' + chart.input.time + '  ·  ' + chart.input.gender + '  ·  日主 ' + chart.dayMaster.label, 108, 268);
  }
  function posterScore(ctx, data, fav) {
    ctx.fillStyle = 'rgba(255,255,255,0.035)'; roundRect(ctx, 108, 328, 864, 226, 24, true);
    ctx.strokeStyle = 'rgba(201,162,75,0.12)'; roundRect(ctx, 108, 328, 864, 226, 24, false);
    ctx.fillStyle = '#9A917C'; ctx.font = '24px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText('今日综合运势', 154, 390);
    ctx.fillStyle = '#E8C977'; ctx.font = '700 118px Georgia, "Times New Roman", serif'; ctx.fillText(String(data.score), 150, 504);
    ctx.fillStyle = '#ECE4D2'; ctx.font = '700 44px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(data.verdict, 360, 448);
    ctx.fillStyle = '#9A917C'; ctx.font = '25px PingFang SC, Microsoft YaHei, sans-serif';
    ctx.fillText('今日 ' + data.daily.ganzhi + ' 入局 · 喜用 ' + fav, 360, 492);
  }
  function drawPosterPillars(ctx, chart) {
    var x0 = 108, y = 604, w = 198, gap = 24;
    ctx.font = '24px PingFang SC, Microsoft YaHei, sans-serif';
    chart.pillars.forEach(function (p, i) {
      var x = x0 + i * (w + gap);
      ctx.fillStyle = i === 2 ? 'rgba(201,162,75,0.10)' : 'rgba(255,255,255,0.026)'; roundRect(ctx, x, y, w, 206, 20, true);
      ctx.strokeStyle = i === 2 ? 'rgba(201,162,75,0.42)' : 'rgba(201,162,75,0.12)'; roundRect(ctx, x, y, w, 206, 20, false);
      ctx.fillStyle = '#6C6552'; ctx.fillText(p.label, x + 32, y + 42);
      ctx.fillStyle = '#ECE4D2'; ctx.font = '700 56px Georgia, "Times New Roman", serif'; ctx.fillText(p.ganzhi, x + 32, y + 114);
      ctx.font = '22px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillStyle = '#C9A24B'; ctx.fillText(p.ganShiShen || '—', x + 32, y + 156);
      ctx.fillStyle = '#9A917C'; ctx.fillText(nayinOf(chart, p.label), x + 32, y + 188);
      ctx.font = '24px PingFang SC, Microsoft YaHei, sans-serif';
    });
  }
  function drawPosterElements(ctx, five) {
    var x = 108, y = 884;
    ctx.fillStyle = '#ECE4D2'; ctx.font = '700 34px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText('五行分布', x, y);
    five.forEach(function (f, i) {
      var yy = y + 58 + i * 66;
      ctx.fillStyle = '#9A917C'; ctx.font = '25px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(f.element, x, yy);
      ctx.fillStyle = 'rgba(255,255,255,0.055)'; roundRect(ctx, x + 76, yy - 22, 608, 22, 11, true);
      ctx.fillStyle = posterElementColor(f.element); roundRect(ctx, x + 76, yy - 22, 608 * f.percent / 100, 22, 11, true);
      ctx.fillStyle = '#ECE4D2'; ctx.fillText(f.percent + '%', x + 722, yy);
    });
  }
  function drawPosterLuck(ctx, data) {
    var y = 1230, x = 108, w = 264, gap = 36;
    [['幸运色', data.luckyColor.name], ['方位', data.luckyDir], ['吉时', data.luckyTime]].forEach(function (it, i) {
      var xx = x + i * (w + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.035)'; roundRect(ctx, xx, y - 72, w, 118, 18, true);
      ctx.strokeStyle = 'rgba(201,162,75,0.10)'; roundRect(ctx, xx, y - 72, w, 118, 18, false);
      ctx.fillStyle = '#6C6552'; ctx.font = '22px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(it[0], xx + 30, y - 28);
      if (i === 0) { ctx.fillStyle = data.luckyColor.hex; roundRect(ctx, xx + 30, y + 2, 28, 28, 6, true); }
      ctx.fillStyle = '#ECE4D2'; ctx.font = '700 28px PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(it[1], xx + (i === 0 ? 72 : 30), y + 27);
    });
  }
  function posterFooter(ctx) {
    ctx.fillStyle = '#6C6552'; ctx.font = '22px PingFang SC, Microsoft YaHei, sans-serif';
    ctx.fillText('规则化命理数据分析 · 仅供文化参考', 108, 1342);
    ctx.fillStyle = '#C9A24B'; ctx.font = '22px Georgia, "Times New Roman", serif';
    ctx.fillText('TIANJI.PAVILION', 760, 1342);
  }
  function posterElementColor(e) {
    return { 木:'#7DB88F', 火:'#D8725D', 土:'#C4A56A', 金:'#D9DEE7', 水:'#6FA8DC' }[e] || '#C9A24B';
  }
  function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) ctx.fill(); else ctx.stroke();
  }

  function dimScore(chart, fav, set) {
    var cnt = 0; chart.tenGods.forEach(function (g) { if (set.indexOf(g.name) >= 0) cnt += g.count; });
    return clamp(Math.round(58 + cnt * 6 + fav * 6 + (chart.dayMaster.gan.charCodeAt(0) + set.length) % 9), 40, 98);
  }

  // ---------- page: 排盘命理 ----------
  function pageChart(c) {
    var chart = state.chart, an = state.analysis;
    c.appendChild(el('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:18px' }, [
      el('div', { class: 'section-tabs', style: 'margin:0' }, [
        el('div', { class: 'tab' + (state.bzTab === 'bazi' ? ' on' : ''), onclick: function () { state.bzTab = 'bazi'; setRoute('chart'); } }, ['八字命盘']),
        el('div', { class: 'tab' + (state.bzTab === 'ziwei' ? ' on' : ''), onclick: function () { state.bzTab = 'ziwei'; setRoute('chart'); } }, ['紫微斗数'])
      ]),
      el('div', { class: 'page-sub' }, ['命主 ' + (chart.input.name || '—') + ' · ' + chart.input.gender + ' · ' + chart.input.rawDate + ' · ' + (chart.input.gender === '男' ? '乾造' : '坤造')])
    ]));
    if (state.bzTab === 'ziwei') return ziweiPanel(c);

    // 八字
    var pillarsCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['四柱八字'])]) ]);
    var grid = el('div', { class: 'pillars-4' });
    chart.pillars.forEach(function (p) {
      var hide = p.hidden.map(function (h) { return h.gan; }).join('');
      grid.appendChild(el('div', { class: 'pcol' + (p.label === '日柱' ? ' day' : '') }, [
        el('div', { class: 'p-lab' }, [p.label + (p.label === '日柱' ? ' · 日元' : '')]),
        el('div', { class: 'p-god' }, [p.ganShiShen === '日主' ? (chart.input.gender === '男' ? '元男' : '元女') : (p.ganShiShen || '')]),
        el('div', { class: 'p-gan ' + 'c-' + EL_CLASS[GAN_WX[p.gan]] }, [p.gan]),
        el('div', { class: 'p-zhi ' + 'c-' + EL_CLASS[ZHI_WX[p.zhi]] }, [p.zhi]),
        el('div', { class: 'p-hide' }, [hide + ' · ' + (p.hidden[0] ? p.hidden[0].shishen : '')]),
        el('div', { class: 'p-ny' }, [nayinOf(chart, p.label) + ' · ' + p.diShi])
      ]));
    });
    pillarsCard.appendChild(grid);
    pillarsCard.appendChild(el('div', { class: 'bz-summary' }, [
      sumCell('日主强弱', chart.dayMaster.label + ' · ' + an.strength.band, ''),
      sumCell('喜用神', an.yongShen.favorable.map(function (f) { return f.el; }).join(' · ') + '（' + an.yongShen.favorable.map(function (f) { return f.group; }).join('') + '）', 'c-' + EL_CLASS[an.yongShen.favorable[0].el]),
      sumCell('忌神', an.yongShen.unfavorable.map(function (f) { return f.el; }).join(' · '), 'c-fire')
    ]));

    // 大运
    var now = new Date().getFullYear();
    var duCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['大运 · 现行'])]) ]);
    var duStrip = el('div', { class: 'dayun' });
    chart.luckCycle.slice(0, 8).forEach(function (du) {
      var isNow = now >= du.startYear && now < du.startYear + 10;
      duStrip.appendChild(el('div', { class: 'du' + (isNow ? ' now' : '') }, [
        el('div', { class: 'age' }, [du.startAge + (isNow ? '·现' : '岁')]),
        el('div', { class: 'gz' }, [du.ganzhi])
      ]));
    });
    duCard.appendChild(duStrip);

    var pizhuanCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['命局批断'])]), pizhuanProse(chart, an) ]);

    c.appendChild(el('div', { class: 'grid g-12-5' }, [ pillarsCard, el('div', { class: 'grid', style: 'gap:18px' }, [duCard, pizhuanCard]) ]));
    animateBars(c);
  }

  function pizhuanProse(chart, an) {
    var dm = chart.dayMaster, st = an.strength, ys = an.yongShen;
    var monthZhi = chart.pillars[1].zhi;
    var fav = ys.favorable.map(function (f) { return f.el; });
    var unf = ys.unfavorable.map(function (f) { return f.el; });
    var now = new Date().getFullYear();
    var cur = chart.luckCycle.filter(function (d) { return now >= d.startYear && now < d.startYear + 10; })[0];
    var p1 = dm.gan + dm.element + '生于' + monthZhi + '月，' + (st.deLing ? '当令得气' : '失令') + '，日元' + st.band.replace(/[（）]/g, '') +
      '。喜' + fav.join('、') + '（' + ys.favorable.map(function (f) { return f.group; }).join('') + '）扶身，忌' + unf.join('、') + '克泄耗。' + an.geJu.name + '，' + an.geJu.note;
    var p2 = cur
      ? '现行 ' + cur.ganzhi + ' 大运（' + cur.startAge + '–' + (cur.startAge + 10) + ' 岁），五行属 ' + GAN_WX[cur.gan] + '、' + ZHI_WX[cur.zhi] + '，对喜用「' + fav.join('') + '」而言' +
        (favScore([GAN_WX[cur.gan], ZHI_WX[cur.zhi]], ys) > 0 ? '较为有利，宜进取求成。' : favScore([GAN_WX[cur.gan], ZHI_WX[cur.zhi]], ys) < 0 ? '宜稳中求进、守成为上。' : '平稳过渡，按部就班。')
      : '起运未至，少年运以原局喜忌为主。';
    return el('div', { class: 'prose' }, [ el('p', {}, [p1]), el('p', {}, [p2]), el('p', { style: 'color:var(--text-3);font-size:12px' }, ['以上为「扶抑法」规则化推演，附依据与置信度（' + an.confidence.label + '），非确定性预测，仅供参考。']) ]);
  }

  function ziweiPanel(c) {
    var zw = ziweiChart(state.birth);
    var BR = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    // grid positions per branch (4x4 ring)
    var GP = { 巳:[1,1],午:[1,2],未:[1,3],申:[1,4],辰:[2,1],酉:[2,4],卯:[3,1],戌:[3,4],寅:[4,1],丑:[4,2],子:[4,3],亥:[4,4] };
    var grid = el('div', { class: 'ziwei' });
    BR.forEach(function (b, i) {
      var pos = GP[b]; var stars = zw.palaces[i].stars;
      var cell = el('div', { class: 'zw-cell' + (i === zw.ming ? ' ming' : '') , style: 'grid-row:' + pos[0] + ';grid-column:' + pos[1] }, [
        el('div', {}, stars.length ? stars.map(function (s) { return el('div', { class: 'star' + (s.hua ? ' hua hua-' + s.huaType : '') + (s.aux ? ' aux' : '') }, [s.name + (s.hua ? ' · ' + s.hua : '')]); }) : [el('div', { style: 'color:var(--text-3)' }, ['—'])]),
        el('div', { class: 'pos' }, [zw.palaces[i].name + ' · ' + b + (i === zw.ming ? ' · 命宫' : '') ])
      ]);
      grid.appendChild(cell);
    });
    var center = el('div', { class: 'zw-center' }, [
      el('div', { class: 'kicker' }, [state.birth.gender === 'male' ? '乾造 · 命盘' : '坤造 · 命盘']),
      el('div', { style: 'font-family:var(--serif);font-size:30px;letter-spacing:3px;color:var(--gold-bright);margin:10px 0 8px' }, [zw.mingStar ? '命主 ' + zw.mingStar : '紫微在' + BR[zw.ziwei]]),
      el('p', { class: 'prose', style: 'max-width:300px;text-align:center;margin:0 0 12px' }, [zw.summary]),
      el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center' }, [ el('span', { class: 'pill' }, [zw.juName]), el('span', { class: 'pill ' + (state.birth.gender === 'male' ? 'warn' : 'joy') }, [state.birth.gender === 'male' ? '阳男' : '阴女']), el('span', { class: 'pill' }, ['身宫 ' + BR[zw.shen]]) ])
    ]);
    grid.appendChild(center);
    c.appendChild(el('div', { class: 'card' }, [grid]));
    c.appendChild(el('p', { class: 'page-sub', style: 'margin-top:12px' }, ['已接入十四主星、年干四化与左辅右弼、文昌文曲、禄存羊陀、魁钺、天马、红鸾天喜等辅星。四化以年干起例，辅星用于补充宫位气质，不单独定吉凶。']));
  }

  // ---------- page: 运势分析 ----------
  function pageAnalytics(c) {
    var chart = state.chart, an = state.analysis;
    var now = new Date().getFullYear();
    // 流年曲线
    var years = [], vals = [], annualMeta = [], peak = { v: 0, i: 0 };
    for (var i = 0; i < 13; i++) {
      var yr = now - 6 + i; years.push(yr);
      var f = window.BaZiAnalysis.annualFavor(chart, an.yongShen, yr);
      var v = clamp(60 + f.score * 12 + ((yr * 17) % 7 - 3), 30, 98);
      annualMeta.push({ title: yr + ' · ' + f.ganzhi, sub: v + ' · ' + verdict(v), score: v, verdict: f.verdict });
      vals.push(v); if (v > peak.v) peak = { v: v, i: i };
    }
    var lineCard = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [
        el('div', {}, [ el('h3', {}, ['流年运势曲线']), el('div', { class: 'sub' }, [years[0] + ' – ' + years[years.length - 1] + ' · 移动鼠标查看逐年推演']) ]),
        el('span', { class: 'pill' }, ['Hover'])
      ]),
      lineChart(vals, peak, years.map(String), annualMeta)
    ]);
    // 五行雷达
    var radarCard = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [el('h3', {}, ['五行雷达'])]),
      radarSvg(chart.fiveElements),
      el('p', { class: 'prose', style: 'text-align:center;margin-top:8px' }, [an.balance.note])
    ]);
    // 十神分布
    var groups = [ ['食神/伤官', ['食神','伤官'], 'f-water'], ['正官/七杀', ['正官','七杀'], 'f-fire'], ['正财/偏财', ['正财','偏财'], 'f-wood'], ['正印/偏印', ['正印','偏印'], 'f-gold'] ];
    var maxG = 1; groups.forEach(function (g) { var ct = sumG(chart, g[1]); if (ct > maxG) maxG = ct; });
    var godCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['十神分布'])]) ]);
    groups.forEach(function (g) { var ct = sumG(chart, g[1]); godCard.appendChild(barRow(g[0], Math.round(ct / Math.max(maxG,1) * 100), g[2], '', ct)); });
    // 流月吉凶
    var monthCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['流月吉凶'])]) ]);
    var mrow = el('div', { style: 'display:flex;justify-content:space-between;align-items:flex-end;height:120px;padding:10px 4px' });
    for (var mo = 0; mo < 12; mo++) {
      var mzhi = MONTH_ZHI[mo]; var mf = favScore([ZHI_WX[mzhi]], an.yongShen);
      var col = mf > 0 ? 'var(--joy)' : mf < 0 ? 'var(--warn)' : 'var(--gold)';
      var hgt = 24 + (mf + 1) * 24;
      mrow.appendChild(el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:6px' }, [
        el('div', { style: 'width:10px;height:' + hgt + 'px;border-radius:3px;background:' + col + ';opacity:.85' }),
        el('div', { style: 'font-size:10px;color:var(--text-3)' }, [String(mo + 1)])
      ]));
    }
    monthCard.appendChild(mrow);
    // 关键提示
    var tips = [];
    var good = an.luck.cycles.filter(function (x) { return x.verdict === '有利'; });
    var bad = an.luck.cycles.filter(function (x) { return x.verdict === '不利'; });
    if (good.length) tips.push(['joy', '有利大运：' + good.slice(0,3).map(function (x) { return x.startAge + '岁(' + x.ganzhi + ')'; }).join('、') + '，宜进取。']);
    if (bad.length) tips.push(['warn', '需留意：' + bad.slice(0,3).map(function (x) { return x.startAge + '岁(' + x.ganzhi + ')'; }).join('、') + '，宜守成。']);
    tips.push(['good', '全年补' + an.yongShen.favorable.map(function (f) { return f.el; }).join('') + '调候，' + (DIR[KE[chart.dayMaster.element]] || '正南') + '为财位。']);
    var tipCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['关键提示'])]) ]);
    tips.forEach(function (t) {
      tipCard.appendChild(el('div', { style: 'display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)' }, [
        el('span', { style: 'width:7px;height:7px;border-radius:50%;margin-top:7px;flex:none;background:' + (t[0]==='joy'?'var(--joy)':t[0]==='warn'?'var(--warn)':'var(--gold)') }),
        el('span', { class: 'prose', style: 'margin:0' }, [t[1]])
      ]));
    });

    c.appendChild(el('div', { class: 'grid g-2', style: 'margin-bottom:18px' }, [lineCard, radarCard]));
    c.appendChild(el('div', { class: 'grid g-3' }, [godCard, monthCard, tipCard]));
    animateBars(c);
  }
  function sumG(chart, names) { var s = 0; chart.tenGods.forEach(function (g) { if (names.indexOf(g.name) >= 0) s += g.count; }); return s; }

  // ---------- page: 历史记录 ----------
  function pageRecords(c) {
    var list = []; try { list = JSON.parse(localStorage.getItem('bazi-history') || '[]'); } catch (e) {}
    var card = el('div', { class: 'card' });
    card.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' }, [
      el('div', { class: 'section-tabs', style: 'margin:0' }, [ el('div', { class: 'tab on' }, ['全部']), el('div', { class: 'tab' }, ['八字']), el('div', { class: 'tab' }, ['卦象']), el('div', { class: 'tab' }, ['星座']) ]),
      el('div', { class: 'page-sub' }, ['共 ' + list.length + ' 条占断记录'])
    ]));
    if (!list.length) {
      card.appendChild(el('div', { class: 'placeholder' }, [ el('div', { class: 'pg-seal' }, ['錄']), el('h3', {}, ['暂无记录']), el('p', {}, ['完成排盘后会自动保存在本设备。']) ]));
    } else {
      var tbl = el('table', { class: 'tbl' }, [ el('thead', {}, [ el('tr', {}, ['日期','类型','所问之事','运势','状态'].map(function (h) { return el('th', {}, [h]); })) ]) ]);
      var tb = el('tbody', {});
      list.forEach(function (r) {
        var dt = new Date(r.savedAt || Date.now());
        var vlabel = r.dayMaster || '—';
        tb.appendChild(el('tr', { onclick: function () { state.birth = normalizedBirthFromRecord(r); recompute(); setRoute('chart'); } }, [
          el('td', { class: 'muted' }, [dt.getFullYear() + '.' + pad(dt.getMonth() + 1) + '.' + pad(dt.getDate())]),
          el('td', {}, [el('span', { class: 'pill' }, ['八字'])]),
          el('td', {}, [(r.name || '命主') + ' · ' + (r.calendar === 'lunar' ? '农历' : '公历') + (r.leapMonth ? '闰月' : '') + ' · ' + r.year + '.' + pad(r.month) + '.' + pad(r.day) + ' ' + pad(r.hour) + ':' + pad(r.minute) + (r.trueSolarTime ? ' · 真太阳时' : '')]),
          el('td', {}, [el('span', { class: 'c-' + (EL_CLASS[(r.dayMaster || '').slice(-1)] || 'earth') }, [vlabel])]),
          el('td', { class: 'muted' }, ['已解读'])
        ]));
      });
      tbl.appendChild(tb);
      card.appendChild(tbl);
    }
    c.appendChild(card);
  }

  // ---------- placeholders ----------
  function placeholder(c, r) {
    var seal = { hexagram: '卦', zodiac: '星', oracle: '卜', match: '緣', settings: '設' }[r] || '機';
    var msg = {
      hexagram: '六爻 / 梅花起卦与 64 卦辞详解正在接入。',
      zodiac: '十二星座今日 / 本周 / 本月运程正在接入。',
      oracle: '结合命盘的天机问答正在接入。',
      match: '双人合盘评分与关系结构分析正在接入。',
      settings: '主题、历法与命主管理正在接入。'
    }[r] || '功能建设中。';
    c.appendChild(el('div', { class: 'card placeholder' }, [
      el('div', { class: 'pg-seal' }, [seal]),
      el('h3', {}, [(TITLES[r] ? TITLES[r][0] : '') + ' · 即将上线']),
      el('p', {}, [msg])
    ]));
  }

  // ---------- 命主 modal ----------
  function openBirthModal() {
    var b = state.birth;
    var name = el('input', { type: 'text', value: b.name, placeholder: '姓名/称呼', class: 'tj-in' });
    var date = el('input', { type: 'date', value: b.year + '-' + pad(b.month) + '-' + pad(b.day), class: 'tj-in' });
    var time = el('input', { type: 'time', value: pad(b.hour) + ':' + pad(b.minute), class: 'tj-in' });
    var calendar = el('select', { class: 'tj-in' }, [ el('option', { value: 'solar' }, ['公历']), el('option', { value: 'lunar' }, ['农历']) ]);
    calendar.value = b.calendar || state.defaultCalendar || 'solar';
    var leap = el('input', { type: 'checkbox' }); leap.checked = !!b.leapMonth;
    var leapWrap = el('div', {}, [el('label', { class: 'check-row' }, [leap, el('span', {}, ['此日期为农历闰月'])])]);
    var gender = el('select', { class: 'tj-in' }, [ el('option', { value: 'male' }, ['男']), el('option', { value: 'female' }, ['女']) ]); gender.value = b.gender;
    var place = el('input', { type: 'text', value: b.place || '', placeholder: '上海', class: 'tj-in' });
    var trueSolar = el('input', { type: 'checkbox' }); trueSolar.checked = !!b.trueSolarTime;
    var solarWrap = el('div', {}, [el('label', { class: 'check-row' }, [trueSolar, el('span', {}, ['按出生地换算真太阳时'])])]);
    var lon = el('input', { type: 'number', step: '0.01', value: numOr(b.longitude, 121.47), class: 'tj-in' });
    var mer = el('input', { type: 'number', step: '1', value: numOr(b.meridian, 120), class: 'tj-in' });
    var trueSolarFields = el('div', { class: 'form-grid' }, [labeledIn('出生地经度', lon), labeledIn('标准经线', mer)]);
    function syncAdvanced() {
      leapWrap.style.display = calendar.value === 'lunar' ? '' : 'none';
      trueSolarFields.style.display = trueSolar.checked ? 'grid' : 'none';
    }
    calendar.addEventListener('change', syncAdvanced);
    trueSolar.addEventListener('change', syncAdvanced);
    place.addEventListener('change', function () { applyCityCoords(place, lon, mer); });
    place.addEventListener('blur', function () { applyCityCoords(place, lon, mer); });
    var scrim = el('div', { style: 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:60;display:grid;place-items:center' });
    var box = el('div', { class: 'card birth-card' }, [
      el('div', { class: 'card-h' }, [el('h3', {}, ['切换命主'])]),
      labeledIn('姓名 / 称呼', name),
      el('div', { class: 'form-grid' }, [labeledIn('历法', calendar), labeledIn('性别', gender)]),
      leapWrap,
      el('div', { class: 'form-grid' }, [labeledIn('出生日期', date), labeledIn('出生时间', time)]),
      labeledIn('出生地点', place),
      solarWrap,
      trueSolarFields,
      el('button', { class: 'btn-gold', style: 'margin-top:14px', onclick: function () {
        b.name = name.value.trim() || '命主';
        b.year = +date.value.slice(0,4); b.month = +date.value.slice(5,7); b.day = +date.value.slice(8,10);
        b.hour = +time.value.slice(0,2); b.minute = +time.value.slice(3,5); b.calendar = calendar.value; b.gender = gender.value;
        b.leapMonth = calendar.value === 'lunar' && leap.checked;
        b.place = place.value.trim();
        b.trueSolarTime = trueSolar.checked;
        b.longitude = numOr(lon.value, 121.47);
        b.meridian = numOr(mer.value, 120);
        recompute(); try { addHistory(b, state.chart); } catch (e) {}
        document.body.removeChild(scrim); renderShell();
      } }, ['确 定'])
    ]);
    syncAdvanced();
    scrim.addEventListener('click', function (e) { if (e.target === scrim) document.body.removeChild(scrim); });
    scrim.appendChild(box); document.body.appendChild(scrim);
  }
  function labeledIn(lab, control) {
    return el('div', { style: 'margin-bottom:10px' }, [ el('div', { style: 'font-size:11px;color:var(--text-3);letter-spacing:2px;margin-bottom:5px' }, [lab]), control ]);
  }
  function addHistory(b, chart) {
    var key = [b.year,b.month,b.day,b.hour,b.minute,b.gender,b.calendar,!!b.leapMonth,b.place,!!b.trueSolarTime,numOr(b.longitude,121.47),numOr(b.meridian,120)].join('-');
    var list = []; try { list = JSON.parse(localStorage.getItem('bazi-history') || '[]'); } catch (e) {}
    list = list.filter(function (r) { return [r.year,r.month,r.day,r.hour,r.minute,r.gender,r.calendar || 'solar',!!r.leapMonth,r.place,!!r.trueSolarTime,numOr(r.longitude,121.47),numOr(r.meridian,120)].join('-') !== key; });
    list.unshift({ name: b.name, year: b.year, month: b.month, day: b.day, hour: b.hour, minute: b.minute, calendar: b.calendar || 'solar', leapMonth: !!b.leapMonth, gender: genderLabel(b.gender), place: b.place, trueSolarTime: !!b.trueSolarTime, longitude: numOr(b.longitude, 121.47), meridian: numOr(b.meridian, 120), dayMaster: chart.dayMaster.label, savedAt: Date.now() });
    if (list.length > 30) list = list.slice(0, 30);
    try { localStorage.setItem('bazi-history', JSON.stringify(list)); } catch (e) {}
  }

  // ---------- builders ----------
  function infoCell(lab, val, note) {
    return el('div', { class: 'cell' }, [ el('div', { class: 'info-cell-lab' }, [lab]), el('div', { class: 'info-cell-val' }, [val]), el('div', { class: 'info-cell-note' }, [note]) ]);
  }
  function kvRow(k, v) { return el('div', { class: 'kv-row' }, [ el('span', { class: 'k' }, [k]), el('span', { class: 'v' }, [typeof v === 'string' ? document.createTextNode(v) : v]) ]); }
  function sumCell(lab, val, cls) { return el('div', {}, [ el('div', { class: 'lab' }, [lab]), el('div', { class: 'val ' + (cls || '') }, [val]) ]); }
  function barRow(nm, pct, fillCls, nmCls, rawCount) {
    var span = el('span', { class: fillCls }); span.setAttribute('data-w', pct);
    return el('div', { class: 'bar-row' }, [ el('div', { class: 'nm ' + (nmCls || '') }, [nm]), el('div', { class: 'bar' }, [span]), el('div', { class: 'pct' }, [rawCount != null ? String(rawCount) : pct + '%']) ]);
  }
  function scoreBar(nm, val) {
    var span = el('span', { class: 'f-gold' }); span.setAttribute('data-w', val);
    return el('div', { class: 'bar-row' }, [ el('div', { class: 'nm' }, [nm]), el('div', { class: 'bar' }, [span]), el('div', { class: 'pct', style: 'color:var(--gold-bright)' }, [String(val)]) ]);
  }
  function miniMetric(label, value) {
    return el('div', { class: 'mini-metric' }, [el('span', {}, [label]), el('strong', {}, [value])]);
  }
  function tipRow(badge, title, note, cls) {
    return el('div', { style: 'display:flex;gap:12px;padding:11px 0;border-top:1px solid var(--line-soft)' }, [
      el('div', { class: 'c-' + (cls || 'earth'), style: 'width:30px;height:30px;border-radius:8px;flex:none;display:grid;place-items:center;border:1px solid var(--line-soft);font-family:var(--serif)' }, [badge]),
      el('div', {}, [ el('div', { style: 'font-size:13px' }, [title]), el('div', { style: 'font-size:11px;color:var(--text-3);margin-top:2px' }, [note]) ])
    ]);
  }
  function animateBars(scope) {
    requestAnimationFrame(function () { setTimeout(function () {
      (scope.querySelectorAll ? scope.querySelectorAll('.bar > span') : []).forEach(function (s) { s.style.width = (s.getAttribute('data-w') || 0) + '%'; });
    }, 60); });
  }

  function gaugeSvg(score) {
    var r = 100, cx = 120, cy = 120, circ = 2 * Math.PI * r;
    var off = circ * (1 - score / 100);
    var svg = svgEl('svg', { viewBox: '0 0 240 240', width: '240', height: '240' });
    svg.appendChild(svgEl('defs', {}, ['<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A7B33"/><stop offset="1" stop-color="#E8C977"/></linearGradient>']));
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'rgba(201,162,75,0.12)', 'stroke-width': '8' }));
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 84, fill: 'none', stroke: 'rgba(201,162,75,0.08)', 'stroke-width': '1' }));
    var arc = svgEl('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'url(#gg)', 'stroke-width': '8', 'stroke-linecap': 'round', 'stroke-dasharray': circ, 'stroke-dashoffset': circ });
    svg.appendChild(arc);
    requestAnimationFrame(function () { setTimeout(function () { arc.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.32,.72,0,1)'; arc.setAttribute('stroke-dashoffset', off); }, 80); });
    return svg;
  }

  function lineChart(vals, peak, labels, meta) {
    var W = 640, H = 200, pad = 26, n = vals.length;
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    function x(i) { return pad + (W - pad * 2) * i / (n - 1); }
    function y(v) { return H - 30 - (H - 55) * (v - min) / Math.max(1, max - min); }
    var dPath = '', area = '';
    vals.forEach(function (v, i) { dPath += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1) + ' '; });
    area = dPath + 'L' + x(n - 1) + ' ' + (H - 30) + ' L' + x(0) + ' ' + (H - 30) + ' Z';
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'linechart', preserveAspectRatio: 'none' });
    svg.appendChild(svgEl('defs', {}, ['<linearGradient id="la" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(210,106,80,0.28)"/><stop offset="1" stop-color="rgba(201,162,75,0.02)"/></linearGradient>']));
    svg.appendChild(svgEl('path', { d: area, fill: 'url(#la)', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: dPath, fill: 'none', stroke: '#E8C977', 'stroke-width': '2' }));
    if (peak) {
      var px = x(peak.i), py = y(vals[peak.i]);
      svg.appendChild(svgEl('circle', { cx: px, cy: py, r: 4, fill: '#E8C977' }));
      var bx = clamp(px - 28, 2, W - 58);
      svg.appendChild(svgEl('rect', { x: bx, y: py - 30, width: 56, height: 20, rx: 5, fill: '#E8C977' }));
      svg.appendChild(svgEl('text', { x: bx + 28, y: py - 16, 'text-anchor': 'middle', class: 'chart-peak' }, [vals[peak.i] + '·' + verdict(vals[peak.i])]));
    }
    var labs = labels || ['初一','初六','十一','十六','廿一','廿六','三十'];
    var step = (n - 1) / (labs.length - 1);
    labs.forEach(function (lb, i) { svg.appendChild(svgEl('text', { x: x(Math.round(i * step)), y: H - 8, 'text-anchor': 'middle', class: 'axis' }, [lb])); });
    var hover = svgEl('g', { class: 'chart-hover' });
    var hLine = svgEl('line', { y1: 18, y2: H - 30, stroke: 'rgba(232,201,119,0.28)', 'stroke-width': '1' });
    var hCircle = svgEl('circle', { r: 5, fill: '#E8C977', stroke: '#1a1303', 'stroke-width': '2' });
    var hBox = svgEl('rect', { width: 118, height: 44, rx: 9, fill: 'rgba(20,17,11,0.94)', stroke: 'rgba(201,162,75,0.32)' });
    var hTitle = svgEl('text', { class: 'chart-tip-title', x: 0, y: 0, 'text-anchor': 'middle' });
    var hSub = svgEl('text', { class: 'chart-tip-sub', x: 0, y: 0, 'text-anchor': 'middle' });
    hover.appendChild(hLine); hover.appendChild(hCircle); hover.appendChild(hBox); hover.appendChild(hTitle); hover.appendChild(hSub);
    svg.appendChild(hover);
    function showAt(idx) {
      idx = clamp(idx, 0, n - 1);
      var hx = x(idx), hy = y(vals[idx]);
      var boxX = clamp(hx - 59, 4, W - 122);
      var boxY = clamp(hy - 62, 8, H - 86);
      var m = meta && meta[idx] ? meta[idx] : { title: (labs[idx] || labels && labels[idx] || '节点'), sub: vals[idx] + ' · ' + verdict(vals[idx]) };
      hover.style.opacity = '1';
      hLine.setAttribute('x1', hx); hLine.setAttribute('x2', hx);
      hCircle.setAttribute('cx', hx); hCircle.setAttribute('cy', hy);
      hBox.setAttribute('x', boxX); hBox.setAttribute('y', boxY);
      hTitle.setAttribute('x', boxX + 59); hTitle.setAttribute('y', boxY + 18); hTitle.textContent = m.title;
      hSub.setAttribute('x', boxX + 59); hSub.setAttribute('y', boxY + 35); hSub.textContent = m.sub;
    }
    showAt(peak ? peak.i : n - 1);
    function move(e) {
      var p = e.touches && e.touches[0] ? e.touches[0] : e;
      var rect = svg.getBoundingClientRect();
      var rel = (p.clientX - rect.left) / Math.max(1, rect.width);
      var vx = rel * W;
      showAt(Math.round((vx - pad) / ((W - pad * 2) / (n - 1))));
    }
    svg.addEventListener('mousemove', move);
    svg.addEventListener('touchmove', function (e) { move(e); }, { passive: true });
    svg.addEventListener('mouseleave', function () { showAt(peak ? peak.i : n - 1); });
    return svg;
  }

  function radarSvg(fe) {
    var cx = 130, cy = 115, R = 78, axes = ['金','木','水','火','土'];
    var map = {}; fe.forEach(function (f) { map[f.element] = f.percent; });
    var maxP = Math.max(34, Math.max.apply(null, axes.map(function (a) { return map[a] || 0; })));
    var svg = svgEl('svg', { viewBox: '0 0 260 230', class: 'radar' });
    [1, 0.66, 0.33].forEach(function (k) {
      var pts = axes.map(function (a, i) { var ang = -Math.PI / 2 + i * 2 * Math.PI / 5; return (cx + Math.cos(ang) * R * k).toFixed(1) + ',' + (cy + Math.sin(ang) * R * k).toFixed(1); }).join(' ');
      svg.appendChild(svgEl('polygon', { points: pts, fill: 'none', stroke: 'rgba(201,162,75,0.12)', 'stroke-width': '1' }));
    });
    axes.forEach(function (a, i) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / 5;
      svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: cx + Math.cos(ang) * R, y2: cy + Math.sin(ang) * R, stroke: 'rgba(201,162,75,0.10)' }));
      svg.appendChild(svgEl('text', { x: cx + Math.cos(ang) * (R + 16), y: cy + Math.sin(ang) * (R + 16) + 4, 'text-anchor': 'middle', class: 'c-' + EL_CLASS[a] }, [a]));
    });
    var dpts = axes.map(function (a, i) { var ang = -Math.PI / 2 + i * 2 * Math.PI / 5; var k = (map[a] || 0) / maxP; return (cx + Math.cos(ang) * R * k).toFixed(1) + ',' + (cy + Math.sin(ang) * R * k).toFixed(1); }).join(' ');
    svg.appendChild(svgEl('polygon', { points: dpts, fill: 'rgba(201,162,75,0.22)', stroke: '#E8C977', 'stroke-width': '2' }));
    return svg;
  }

  function guaOfDay(chart, dd) {
    var up = EL_TRI[dd.ganElement], lo = EL_TRI[dd.zhiElement];
    var name = HEX[up][lo];
    var lines = TRI[lo].l.concat(TRI[up].l); // bottom→top
    var moving = (chart.dayMaster.gan.charCodeAt(0) + dd.zhi.charCodeAt(0)) % 6;
    var f = favScore([dd.ganElement, dd.zhiElement], chart && state.analysis ? state.analysis.yongShen : { favorable: [], unfavorable: [] });
    var text = name + '：上卦' + TRI[up].n + '、下卦' + TRI[lo].n + '，' + (f > 0 ? '阴阳得位，气机顺畅，宜把握时机、主动而为。' : f < 0 ? '内外相激，宜持正守中、不可冒进。' : '刚柔相济，事在守成，循序则吉。');
    return { name: name, lines: lines, moving: moving, tris: TRI[up].s + TRI[lo].s, text: text };
  }
  function guaGlyph(lines, moving) {
    var wrap = el('div', { class: 'gua' });
    for (var i = lines.length - 1; i >= 0; i--) {
      wrap.appendChild(el('div', { class: 'line ' + (lines[i] ? 'yang' : 'yin') + (i === moving ? ' moving' : '') }));
    }
    return wrap;
  }

  function nayinOf(chart, label) { var f = (chart.hidden.nayin || []).filter(function (n) { return n.label === label; })[0]; return f ? f.value : ''; }

  function svgEl(tag, attrs, kids) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (typeof c === 'string') { var w = document.createElement('div'); w.innerHTML = '<svg>' + c + '</svg>'; Array.prototype.slice.call(w.firstChild.childNodes).forEach(function (cn) { n.appendChild(cn); }); } else n.appendChild(c); });
    return n;
  }

  // ============================================================
  //  extended features
  // ============================================================
  var GEN = { 木:'火',火:'土',土:'金',金:'水',水:'木' };
  var GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var BR = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  function seedNum(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0; return h; }

  function accentSeg() {
    var opts = [['mojin','墨金'],['zhusha','朱砂'],['shuimo','水墨']];
    return el('div', { class: 'seg' }, opts.map(function (o) {
      return el('button', { class: state.accent === o[0] ? 'on' : '', onclick: function () {
        state.accent = o[0]; try { localStorage.setItem('tianji-accent', o[0]); } catch (e) {} applyAccent(); renderShell();
      } }, [o[1]]);
    }));
  }

  function trendData(chart, an, y, m, d, range) {
    var vals = [], labels = [], meta = [], peak = { v: 0, i: 0 };
    function push(v, title, sub) {
      vals.push(v); meta.push({ title: title, sub: sub || (v + ' · ' + verdict(v)) });
      if (v > peak.v) peak = { v: v, i: vals.length - 1 };
    }
    if (range === 'year') {
      for (var mo = 1; mo <= 12; mo++) {
        var ym = dayComposite(chart, an, y, mo, 15);
        push(ym, y + '年' + mo + '月', ym + ' · ' + verdict(ym));
      }
      labels = ['一','二','三','四','五','六','七','八','九','十','冬','腊'];
    } else if (range === 'quarter') {
      var base = new Date(y, m - 1, d);
      for (var k = 12; k >= 0; k--) {
        var dt = new Date(base); dt.setDate(dt.getDate() - k * 7);
        var qv = dayComposite(chart, an, dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
        push(qv, (dt.getMonth() + 1) + '.' + dt.getDate(), qv + ' · ' + verdict(qv));
      }
      labels = ['12周前','9周前','6周前','3周前','本周'];
    } else {
      for (var i = 1; i <= 30; i++) {
        var mv = dayComposite(chart, an, y, m, i);
        push(mv, m + '.' + i, mv + ' · ' + verdict(mv));
      }
      labels = ['初一','初六','十一','十六','廿一','廿六','三十'];
    }
    return { vals: vals, labels: labels, peak: peak, meta: meta };
  }

  // ---------- 周易起卦 ----------
  function triIdx(a) { for (var i = 0; i < TRI.length; i++) if (TRI[i].l[0] === a[0] && TRI[i].l[1] === a[1] && TRI[i].l[2] === a[2]) return i; return 0; }
  function hexFromLines(lines) {
    var lo = triIdx(lines.slice(0, 3)), up = triIdx(lines.slice(3, 6));
    return { up: up, lo: lo, name: HEX[up][lo], lines: lines.slice() };
  }
  function castCoin() {
    var lines = [], moving = [];
    for (var i = 0; i < 6; i++) {
      var sum = 0; for (var c = 0; c < 3; c++) sum += (Math.random() < 0.5 ? 3 : 2);
      lines.push(sum === 6 || sum === 9 ? (sum === 9 ? 1 : 0) : (sum === 7 ? 1 : 0));
      moving.push(sum === 6 || sum === 9);
    }
    return { lines: lines, moving: moving };
  }
  function castNum(n1, n2) {
    var up = ((n1 % 8) || 8) - 1, lo = ((n2 % 8) || 8) - 1, mv = ((n1 + n2) % 6) || 6;
    var lines = TRI[lo].l.concat(TRI[up].l);
    var moving = [false,false,false,false,false,false]; moving[mv - 1] = true;
    return { lines: lines, moving: moving };
  }
  function castTime() {
    var t = state.today, ld = window.Solar ? window.Solar.fromDate(t).getLunar() : null;
    var lm = ld ? Math.abs(ld.getMonth()) : (t.getMonth() + 1), ldd = ld ? ld.getDay() : t.getDate();
    var hourIdx = Math.floor((t.getHours() + 1) / 2) % 12 + 1;
    return castNum(lm + ldd, lm + ldd + hourIdx);
  }
  function cast() {
    if (state.hexMethod === 'coin') return castCoin();
    if (state.hexMethod === 'report') return castNum(state.hexN1 || 7, state.hexN2 || 3);
    return castTime();
  }
  function hexReading(ben, bian, movingCount, q) {
    var ue = TRI[ben.up].wx, le = TRI[ben.lo].wx, lvl, rel;
    if (ue === le) { lvl = '中吉'; rel = '上下同气，气象专一'; }
    else if (GEN[ue] === le || GEN[le] === ue) { lvl = '吉'; rel = '上下相生，气机流通'; }
    else if (KE[ue] === le || KE[le] === ue) { lvl = '小凶'; rel = '上下相克，内外相激'; }
    else { lvl = '平'; rel = '上下无涉，吉凶在人'; }
    var move = movingCount === 0 ? '本卦无动爻，事态稳定，以本卦卦象为断。' :
      movingCount >= 4 ? '动爻偏多，事态变化剧烈，宜以变卦「' + bian.name + '」为主。' :
      '由本卦「' + ben.name + '」动而化「' + bian.name + '」，事在转折，宜顺势而为。';
    return { level: lvl,
      ci: '所问「' + (q || '所谋之事') + '」：' + ben.name + '（' + TRI[ben.up].n + '上' + TRI[ben.lo].n + '下），' + rel + '，综合判为「' + lvl + '」。',
      move: move };
  }
  function pageHexagram(c) {
    if (!state.hexResult) { var r = cast(); state.hexResult = { ben: hexFromLines(r.lines), moving: r.moving }; }
    var ben = state.hexResult.ben, moving = state.hexResult.moving;
    var bianLines = ben.lines.map(function (v, i) { return moving[i] ? (v ? 0 : 1) : v; });
    var bian = hexFromLines(bianLines);
    var mc = moving.filter(Boolean).length;
    var rd = hexReading(ben, bian, mc, state.hexQuestion);
    var movePos = [];
    moving.forEach(function (mv, i) { if (mv) movePos.push(['初','二','三','四','五','上'][i]); });

    var qIn = el('input', { type: 'text', value: state.hexQuestion, class: 'tj-in', oninput: function (e) { state.hexQuestion = e.target.value; } });
    var n1 = el('input', { type: 'number', value: state.hexN1 || 7, class: 'tj-in', style: 'width:80px' });
    var n2 = el('input', { type: 'number', value: state.hexN2 || 3, class: 'tj-in', style: 'width:80px' });
    var methodSeg = el('div', { class: 'seg', style: 'flex-wrap:wrap' }, [['coin','铜钱'],['plum','梅花'],['time','时间'],['report','报数']].map(function (o) {
      return el('button', { class: state.hexMethod === o[0] ? 'on' : '', onclick: function () { state.hexMethod = o[0]; setRoute('hexagram'); } }, [o[1]]);
    }));
    var reportBox = el('div', { style: 'display:' + (state.hexMethod === 'report' ? 'flex' : 'none') + ';gap:8px;margin-top:10px' }, [labeledIn('上卦数', n1), labeledIn('下卦数', n2)]);

    var infoCard = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [el('h3', {}, ['起卦信息'])]),
      kvRow('所问之事', qIn),
      kvRow('起卦时间', (window.Solar ? window.Solar.fromDate(state.today).getLunar().getDayInGanZhi() : '') + ' 日'),
      kvRow('起卦方式', ({ coin:'铜钱六爻', plum:'梅花数字', time:'时间起卦', report:'报数起卦' })[state.hexMethod]),
      kvRow('动爻', movePos.length ? movePos.join('、') + '爻动' : '无动爻'),
      el('div', { style: 'margin-top:14px' }, [ el('div', { style: 'font-size:11px;color:var(--text-3);letter-spacing:2px;margin-bottom:8px' }, ['起卦方式']), methodSeg, reportBox ]),
      el('button', { class: 'btn-gold', style: 'margin-top:14px', onclick: function () {
        if (state.hexMethod === 'report') { state.hexN1 = +n1.value || 7; state.hexN2 = +n2.value || 3; }
        var rr = cast(); state.hexResult = { ben: hexFromLines(rr.lines), moving: rr.moving }; setRoute('hexagram');
      } }, ['摇 卦'])
    ]);

    var benCard = el('div', { class: 'card', style: 'text-align:center' }, [
      el('div', { class: 'kicker' }, ['本 卦']),
      el('div', { style: 'display:flex;justify-content:center;margin:14px 0' }, [guaGlyph(ben.lines, moving.indexOf(true))]),
      el('div', { class: 'gua-name' }, [ben.name]),
      el('div', { class: 'gua-sub', style: 'margin-top:4px' }, [TRI[ben.up].n + '上' + TRI[ben.lo].n + '下'])
    ]);
    var arrow = el('div', { style: 'display:grid;place-items:center;font-size:24px;color:var(--gold)' }, ['→']);
    var bianCard = el('div', { class: 'card', style: 'text-align:center' }, [
      el('div', { class: 'kicker' }, ['变 卦']),
      el('div', { style: 'display:flex;justify-content:center;margin:14px 0' }, [guaGlyph(bian.lines, -1)]),
      el('div', { class: 'gua-name' }, [bian.name]),
      el('div', { class: 'gua-sub', style: 'margin-top:4px' }, [TRI[bian.up].n + '上' + TRI[bian.lo].n + '下'])
    ]);
    var readCard = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [ el('h3', {}, ['卦辞 · ' + ben.name]), el('span', { class: 'pill ' + (rd.level === '小凶' ? 'warn' : rd.level === '吉' || rd.level === '中吉' ? 'joy' : '') }, [rd.level]) ]),
      el('p', { class: 'prose' }, [rd.ci]),
      el('div', { style: 'font-family:var(--serif);color:var(--gold-bright);margin:10px 0 4px' }, ['白话断语']),
      el('p', { class: 'prose' }, [rd.move + ' ' + (rd.level === '吉' || rd.level === '中吉' ? '宜稳守正道、把握时机。' : rd.level === '小凶' ? '宜守不宜攻，先理边界与人事。' : '随机应变，循序则吉。')])
    ]);

    c.appendChild(el('div', { class: 'grid', style: 'grid-template-columns:5fr 7fr;margin-bottom:18px' }, [
      infoCard,
      el('div', { class: 'grid', style: 'gap:18px' }, [ el('div', { class: 'grid', style: 'grid-template-columns:1fr auto 1fr;gap:14px' }, [benCard, arrow, bianCard]), readCard ])
    ]));
  }

  // ---------- 星座运势 ----------
  var SIGNS = [
    { k:'aries',n:'白羊座',s:'♈',f:[3,21],t:[4,19],el:'火象',m:'狮子座' },
    { k:'taurus',n:'金牛座',s:'♉',f:[4,20],t:[5,20],el:'土象',m:'天秤座' },
    { k:'gemini',n:'双子座',s:'♊',f:[5,21],t:[6,20],el:'风象',m:'水瓶座' },
    { k:'cancer',n:'巨蟹座',s:'♋',f:[6,21],t:[7,22],el:'水象',m:'双鱼座' },
    { k:'leo',n:'狮子座',s:'♌',f:[7,23],t:[8,22],el:'火象',m:'白羊座' },
    { k:'virgo',n:'处女座',s:'♍',f:[8,23],t:[9,22],el:'土象',m:'摩羯座' },
    { k:'libra',n:'天秤座',s:'♎',f:[9,23],t:[10,23],el:'风象',m:'双子座' },
    { k:'scorpio',n:'天蝎座',s:'♏',f:[10,24],t:[11,22],el:'水象',m:'巨蟹座' },
    { k:'sagittarius',n:'射手座',s:'♐',f:[11,23],t:[12,21],el:'火象',m:'白羊座' },
    { k:'capricorn',n:'摩羯座',s:'♑',f:[12,22],t:[1,19],el:'土象',m:'金牛座' },
    { k:'aquarius',n:'水瓶座',s:'♒',f:[1,20],t:[2,18],el:'风象',m:'天秤座' },
    { k:'pisces',n:'双鱼座',s:'♓',f:[2,19],t:[3,20],el:'水象',m:'天蝎座' }
  ];
  function signOf(b) {
    for (var i = 0; i < SIGNS.length; i++) {
      var s = SIGNS[i]; var fm = s.f[0], fd = s.f[1], tm = s.t[0], td = s.t[1];
      if (fm <= tm) { if ((b.month === fm && b.day >= fd) || (b.month === tm && b.day <= td) || (b.month > fm && b.month < tm)) return s; }
      else { if ((b.month === fm && b.day >= fd) || (b.month === tm && b.day <= td) || b.month > fm || b.month < tm) return s; }
    }
    return SIGNS[0];
  }
  function starStr(n) { return el('span', { class: 'stars' }, [ '★★★★★'.slice(0, n), el('span', { class: 'off' }, ['☆☆☆☆☆'.slice(0, 5 - n)]) ]); }
  function pageZodiac(c) {
    var period = state.zPeriod || 'today';
    var sign = state.sign ? SIGNS.filter(function (s) { return s.k === state.sign; })[0] : signOf(state.birth);
    var dk = state.today.getFullYear() + '' + (state.today.getMonth() + 1) + '' + (period === 'today' ? state.today.getDate() : period);
    var sd = seedNum(sign.k + dk);
    function st(i) { return 3 + ((sd >> (i * 2)) % 3); }
    var overall = st(0), love = st(1), career = st(2), wealth = st(3), health = st(4);
    var colorEl = { 火象:'火', 土象:'土', 风象:'金', 水象:'水' }[sign.el];
    var pos = ['正东','正南','正西','正北','东南','西南','东北','西北'][sd % 8];
    var luckyN = (sd % 9) + 1;
    var ov = ['今日气场上扬，思路清晰、表达流畅，宜主动沟通、推进既定计划。','整体节奏平稳，适合处理细节与积累，不宜冒进。','贵人运现于工作场合，主动出击可获良机，但需戒骄躁。','情绪略有起伏，凡事三思而后行，避免因小失大。'][sd % 4];
    var hero = el('div', { class: 'card', style: 'grid-column:1/-1' }, [
      el('div', { style: 'display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:center' }, [
        el('div', { style: 'text-align:center' }, [
          el('div', { style: 'width:84px;height:84px;border-radius:18px;margin:0 auto 12px;display:grid;place-items:center;font-size:40px;color:#b98cff;border:1px solid var(--line);background:rgba(150,110,230,.12)' }, [sign.s]),
          el('div', { style: 'font-family:var(--serif);font-size:24px;letter-spacing:2px' }, [sign.n]),
          el('div', { style: 'font-size:11px;color:var(--text-3);margin-top:4px' }, [sign.f[0] + '.' + sign.f[1] + ' – ' + sign.t[0] + '.' + sign.t[1] + ' · ' + sign.el])
        ]),
        el('div', {}, [
          el('div', { class: 'card-h' }, [ el('div', { style: 'display:flex;align-items:center;gap:12px' }, [ el('h3', {}, ['综合运势']), starStr(overall) ]),
            el('div', { class: 'seg' }, [['today','今日'],['week','本周'],['month','本月']].map(function (o) { return el('button', { class: period === o[0] ? 'on' : '', onclick: function () { state.zPeriod = o[0]; setRoute('zodiac'); } }, [o[1]]); })) ]),
          el('p', { class: 'prose' }, [ov]),
          el('div', { style: 'display:flex;gap:28px;margin-top:14px' }, [
            miniInfo('幸运色', EL_COLOR[colorEl].name, EL_COLOR[colorEl].hex),
            miniInfo('幸运数字', String(luckyN)), miniInfo('幸运方位', pos), miniInfo('速配星座', sign.m)
          ])
        ])
      ])
    ]);
    var catDefs = [['爱情', love, ['桃花暗动，单身者易遇心仪对象；有伴者宜多陪伴。','感情平稳，宜坦诚沟通、用心经营。','易因小事生嫌隙，多体谅则化解于无形。']],
      ['事业', career, ['表现亮眼，获上司赏识，宜主动承担重要任务。','按部就班即可，避免揽下超出能力的事。','竞争加剧，宜以实力服人、稳中求进。']],
      ['财运', wealth, ['正财平稳，偏财一般，不宜冲动消费与高风险投资。','进账可期，适合规划储蓄与稳健配置。','破财提示，留意合约细节与冲动开销。']],
      ['健康', health, ['用脑过度，注意睡眠与颈肩，午后宜小憩养神。','体能尚可，规律作息即可保持状态。','留意肠胃与情绪，宜清淡饮食、适度运动。']]];
    var catCards = catDefs.map(function (cd, i) {
      return el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [ el('h3', {}, [cd[0]]), starStr(cd[1]) ]), el('p', { class: 'prose' }, [cd[2][(sd >> i) % 3]]) ]);
    });
    var gridSigns = el('div', { class: 'card', style: 'grid-column:1/-1' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['十二星座 · 点击切换'])]),
      el('div', { style: 'display:grid;grid-template-columns:repeat(6,1fr);gap:12px' }, SIGNS.map(function (s) {
        return el('div', { class: 'sign-cell' + (s.k === sign.k ? ' on' : ''), onclick: function () { state.sign = s.k; setRoute('zodiac'); } }, [
          el('div', { style: 'font-size:26px;color:#b98cff' }, [s.s]),
          el('div', { style: 'font-size:13px;margin-top:6px' }, [s.n]),
          el('div', { style: 'font-size:10px;color:var(--text-3);margin-top:2px' }, [s.f[0] + '.' + s.f[1] + '-' + s.t[0] + '.' + s.t[1]])
        ]);
      })) ]);
    c.appendChild(hero);
    c.appendChild(el('div', { class: 'grid', style: 'grid-template-columns:repeat(4,1fr);margin:18px 0' }, catCards));
    c.appendChild(gridSigns);
  }
  function miniInfo(lab, val, hex) {
    return el('div', {}, [ el('div', { style: 'font-size:11px;color:var(--text-3)' }, [lab]),
      el('div', { style: 'font-size:14px;margin-top:4px;color:' + (hex || 'var(--gold-bright)') }, [val]) ]);
  }

  // ---------- 天机问答 ----------
  function oracleAnswer(q, chart, an) {
    var dm = chart.dayMaster, fav = an.yongShen.favorable.map(function (f) { return f.el; });
    var now = new Date().getFullYear();
    var cur = chart.luckCycle.filter(function (d) { return now >= d.startYear && now < d.startYear + 10; })[0];
    var af = window.BaZiAnalysis.annualFavor(chart, an.yongShen, now);
    var caiDir = DIR[KE[dm.element]] || '正南';
    var curTxt = cur ? '现行 ' + cur.ganzhi + ' 大运' : '原局喜忌为主';
    function has(arr) { return arr.some(function (w) { return q.indexOf(w) >= 0; }); }
    if (has(['工作','事业','换工作','职','升'])) return '以命论事业：' + curTxt + '，喜用「' + fav.join('') + '」。今岁' + af.ganzhi + '为「' + af.verdict + '」，' + (af.verdict === '有利' ? '宜主动求变、把握机会；' : af.verdict === '不利' ? '宜守成蓄力、不宜大动；' : '宜稳中求进；') + '方位上' + caiDir + '为利，逢喜用之月（行' + fav.join('、') + '气）更佳。';
    if (has(['财','钱','投资','收入'])) return '财以喜用为引：本盘喜「' + fav.join('') + '」，' + caiDir + '为财位。' + (af.verdict === '有利' ? '今岁财气顺，正财稳、可适度进取；' : '今岁宜稳健理财、控制风险；') + '忌随' + an.yongShen.unfavorable.map(function (f) { return f.el; }).join('') + '气冒进。';
    if (has(['姻缘','感情','正缘','结婚','对象','桃花'])) { var dz = chart.pillars[2].zhi; return '配偶宫为日支「' + dz + '」(' + ZHI_WX[dz] + ')，' + curTxt + '。逢喜用流年、或' + (chart.input.gender === '男' ? '财星' : '官星') + '得力之年，姻缘较显；宜在' + caiDir + '方、属相相合之人中留意。'; }
    if (has(['流年','今年','明年','运势'])) return now + ' 年' + af.ganzhi + '，对本盘喜用「' + fav.join('') + '」判为「' + af.verdict + '」。' + (af.verdict === '有利' ? '整体气运上扬，宜进取。' : af.verdict === '不利' ? '宜守正避险、固本培元。' : '平稳过渡，按计划推进。');
    if (has(['择吉','吉日','动土','开业','签约'])) return '择吉以扶喜用为要：宜选行「' + fav.join('、') + '」气之月日与' + caiDir + '方位，避忌神当令之时；具体可按' + curTxt + '与流月吉凶细择。';
    if (has(['起名','名字','补'])) return '起名宜补喜用「' + fav.join('、') + '」：可取该五行偏旁或寓意之字，平衡命局' + an.balance.note;
    if (has(['健康','身体'])) return '健康提示：' + an.balance.note + ' 宜顺喜用调养，劳逸结合（仅为养生提示，非诊断）。';
    return '已读取您的命盘：' + dm.label + '·' + an.strength.band + '，' + an.geJu.name + '，喜用「' + fav.join('') + '」。您可具体问事业、财运、姻缘、流年、择吉或起名，我会结合命盘与' + curTxt + '为您分析。';
  }
  function pageOracle(c) {
    var chart = state.chart, an = state.analysis;
    if (!state.chat) state.chat = [{ role: 'ai', text: (chart.input.name || '命主') + '您好。已为您解读 ' + chart.pillars[2].ganzhi + ' 日元命盘——' + chart.dayMaster.label + '、' + an.strength.band + '、' + an.geJu.name + '，喜用「' + an.yongShen.favorable.map(function (f) { return f.el; }).join('') + '」。请问您想了解哪方面？' }];
    var input = el('input', { type: 'text', class: 'tj-in', placeholder: '向天机先生提问 · 命理 / 卦象 / 运势…', style: 'flex:1' });
    function send(text) {
      var q = (text || input.value).trim(); if (!q) return;
      state.chat.push({ role: 'me', text: q });
      state.chat.push({ role: 'ai', text: oracleAnswer(q, chart, an) });
      setRoute('oracle');
    }
    var chat = el('div', { class: 'chat' }, state.chat.map(function (m) { return el('div', { class: 'bubble ' + (m.role === 'ai' ? 'ai' : 'me') }, [m.text]); }));
    var quick = el('div', { class: 'ask-row' }, ['今年财运如何？','正缘何时出现？','本月需注意什么？'].map(function (q) {
      return el('span', { class: 'pill', style: 'cursor:pointer', onclick: function () { send(q); } }, [q]);
    }));
    var inputRow = el('div', { style: 'display:flex;gap:8px;margin-top:12px' }, [ input, el('button', { class: 'btn-gold', style: 'width:auto;padding:11px 20px', onclick: function () { send(); } }, ['↑']) ]);
    var left = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [ el('div', {}, [ el('h3', {}, ['天机先生 · 命盘问答']), el('div', { class: 'sub' }, ['● 本地规则 · 已读取您的八字命盘']) ]) ]),
      chat, quick, inputRow
    ]);
    var fav = an.yongShen.favorable.map(function (f) { return f.el; }).join(' · ');
    var now = new Date().getFullYear();
    var cur = chart.luckCycle.filter(function (d) { return now >= d.startYear && now < d.startYear + 10; })[0];
    var info = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [el('h3', {}, ['命主信息'])]),
      kvRow('日元', chart.dayMaster.label + ' · ' + an.strength.band.replace(/[（）]/g, '')),
      kvRow('格局', an.geJu.name), kvRow('喜用', fav),
      kvRow('现行大运', cur ? cur.ganzhi + '（' + cur.startAge + '–' + (cur.startAge + 10) + '）' : '未起运')
    ]);
    var sugg = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['推荐探问'])]) ].concat(
      ['流年 · ' + now + '年整体运势','合婚 · 与对方是否相宜','择吉 · 开业动土良辰','起名 · 五行补益用字'].map(function (q) {
        return el('div', { class: 'sugg', onclick: function () { send(q); } }, [q]);
      })));
    c.appendChild(el('div', { class: 'chat-wrap' }, [ left, el('div', { class: 'grid', style: 'gap:18px' }, [info, sugg]) ]));
  }

  // ---------- 缘分配对 ----------
  function pairRelation(a, b) {
    var pair = a + b, rev = b + a;
    var maps = [
      { p:['子丑','寅亥','卯戌','辰酉','巳申','午未'], s:13, t:'双方日支六合，日常相处较易建立默契与协作。' },
      { p:['子午','丑未','寅申','卯酉','辰戌','巳亥'], s:-14, t:'双方日支相冲，节奏与立场差异明显，宜提前约定冲突处理方式。' },
      { p:['子未','丑午','寅巳','卯辰','申亥','酉戌'], s:-8, t:'双方日支相害，误解多源于未说清的期待，需提高沟通透明度。' }
    ];
    for (var i = 0; i < maps.length; i++) if (maps[i].p.indexOf(pair) >= 0 || maps[i].p.indexOf(rev) >= 0) return maps[i];
    return { s: 2, t: '双方日支无直接六合冲害，关系质量更多由现实互动决定。' };
  }
  function compat(a, aa, b, ba) {
    var score = 58, pts = [];
    var aEl = a.dayMaster.element, bEl = b.dayMaster.element;
    if (aEl === bEl) { score += 8; pts.push(['日主关系', '双方同属' + aEl + '，理解方式接近，也易在同一问题上各执己见。']); }
    else if (GEN[aEl] === bEl || GEN[bEl] === aEl) { score += 14; pts.push(['日主关系', '双方日主相生，一方的表达较易转化为另一方需要的支持。']); }
    else if (KE[aEl] === bEl || KE[bEl] === aEl) { score -= 8; pts.push(['日主关系', '双方日主相克，吸引与张力并存，需明确边界与决策方式。']); }
    else pts.push(['日主关系', '双方日主无直接生克，关系更依赖沟通与共同目标。']);
    var rel = pairRelation(a.pillars[2].zhi, b.pillars[2].zhi); score += rel.s; pts.push(['日支互动', rel.t]);
    var dist = a.fiveElements.reduce(function (s, it, i) { return s + Math.abs(it.percent - b.fiveElements[i].percent); }, 0);
    var sim = Math.max(0, 100 - dist); score += Math.round((sim - 50) * 0.18);
    pts.push(['五行结构', '双方五行结构相似度约 ' + sim + '%。' + (sim >= 70 ? '节奏与资源偏好较接近。' : '差异较明显，互补空间大，也更需磨合。')]);
    var aFav = aa.yongShen.favorable.map(function (x) { return x.el; }), bFav = ba.yongShen.favorable.map(function (x) { return x.el; });
    var mutual = aFav.indexOf(bEl) >= 0 || bFav.indexOf(aEl) >= 0;
    if (mutual) score += 8;
    pts.push(['喜用互补', mutual ? '一方日主落在另一方喜用范围内，现实合作更易补位。' : '日主未直接落入彼此喜用，稳定更依赖共同规则与长期投入。']);
    score = Math.max(20, Math.min(96, score));
    return { score: score, label: score >= 82 ? '高协同性' : score >= 68 ? '互补可发展' : score >= 52 ? '需要磨合' : '结构张力较高', points: pts };
  }
  function pageMatch(c) {
    var mb = state.matchBirth;
    var date = el('input', { type: 'date', value: mb.year + '-' + pad(mb.month) + '-' + pad(mb.day), class: 'tj-in' });
    var time = el('input', { type: 'time', value: pad(mb.hour) + ':' + pad(mb.minute), class: 'tj-in' });
    var calendar = el('select', { class: 'tj-in' }, [el('option', { value: 'solar' }, ['公历']), el('option', { value: 'lunar' }, ['农历'])]); calendar.value = mb.calendar || 'solar';
    var leap = el('input', { type: 'checkbox' }); leap.checked = !!mb.leapMonth;
    var leapWrap = el('div', {}, [el('label', { class: 'check-row' }, [leap, el('span', {}, ['对方生日为农历闰月'])])]);
    var gender = el('select', { class: 'tj-in' }, [el('option', { value: 'female' }, ['女']), el('option', { value: 'male' }, ['男'])]); gender.value = mb.gender;
    var place = el('input', { type: 'text', value: mb.place || '', placeholder: '上海', class: 'tj-in' });
    var trueSolar = el('input', { type: 'checkbox' }); trueSolar.checked = !!mb.trueSolarTime;
    var solarWrap = el('div', {}, [el('label', { class: 'check-row' }, [trueSolar, el('span', {}, ['对方命盘换算真太阳时'])])]);
    var lon = el('input', { type: 'number', step: '0.01', value: numOr(mb.longitude, 121.47), class: 'tj-in' });
    var mer = el('input', { type: 'number', step: '1', value: numOr(mb.meridian, 120), class: 'tj-in' });
    var trueSolarFields = el('div', { class: 'form-grid' }, [labeledIn('出生地经度', lon), labeledIn('标准经线', mer)]);
    function syncAdvanced() {
      leapWrap.style.display = calendar.value === 'lunar' ? '' : 'none';
      trueSolarFields.style.display = trueSolar.checked ? 'grid' : 'none';
    }
    calendar.addEventListener('change', syncAdvanced);
    trueSolar.addEventListener('change', syncAdvanced);
    place.addEventListener('change', function () { applyCityCoords(place, lon, mer); });
    place.addEventListener('blur', function () { applyCityCoords(place, lon, mer); });
    var box = el('div', { class: 'match-result' });
    function run() {
      try {
        var other = window.BaZiEngine.compute(birthPayload(mb, false));
        var oa = window.BaZiAnalysis.analyze(other);
        var r = compat(state.chart, state.analysis, other, oa); state.matchResult = r;
        box.innerHTML = '';
        box.appendChild(el('div', { class: 'match-score' }, [ el('strong', {}, [String(r.score)]), el('span', {}, [' / 100']), el('em', {}, ['  ' + r.label]) ]));
        box.appendChild(el('div', { style: 'display:flex;gap:10px;align-items:center;margin:10px 0 16px;font-family:var(--serif);font-size:20px' }, [ el('span', {}, [state.chart.pillars[2].ganzhi]), el('span', { style: 'color:var(--gold)' }, ['×']), el('span', {}, [other.pillars[2].ganzhi]) ]));
        r.points.forEach(function (p) { box.appendChild(el('div', { style: 'padding:11px 0;border-top:1px solid var(--line-soft)' }, [ el('div', { style: 'color:var(--gold-bright);font-size:13px;margin-bottom:3px' }, [p[0]]), el('div', { class: 'prose', style: 'margin:0' }, [p[1]]) ])); });
        box.appendChild(el('p', { class: 'page-sub', style: 'margin-top:12px' }, ['合盘分数用于比较结构互动，不代表关系结果或承诺。']));
      } catch (e) { box.innerHTML = ''; box.appendChild(el('p', { class: 'prose' }, ['日期无法换算，请检查输入。'])); }
    }
    var form = el('div', { class: 'card' }, [
      el('div', { class: 'card-h' }, [ el('div', {}, [ el('span', { class: 'kicker' }, ['双人合盘']), el('h3', {}, ['输入对方出生信息']) ]) ]),
      el('div', { style: 'color:var(--text-2);font-size:13px;margin-bottom:12px' }, ['本方命主：' + (state.chart.input.name || '—') + ' · ' + state.chart.dayMaster.label]),
      el('div', { class: 'form-grid' }, [labeledIn('历法', calendar), labeledIn('性别', gender)]),
      leapWrap,
      el('div', { class: 'form-grid' }, [labeledIn('出生日期', date), labeledIn('出生时间', time)]),
      labeledIn('出生地点', place),
      solarWrap,
      trueSolarFields,
      el('button', { class: 'btn-gold', style: 'margin-top:10px', onclick: function () {
        mb.year = +date.value.slice(0,4); mb.month = +date.value.slice(5,7); mb.day = +date.value.slice(8,10);
        mb.hour = +time.value.slice(0,2); mb.minute = +time.value.slice(3,5); mb.gender = gender.value; mb.calendar = calendar.value;
        mb.leapMonth = calendar.value === 'lunar' && leap.checked;
        mb.place = place.value.trim();
        mb.trueSolarTime = trueSolar.checked;
        mb.longitude = numOr(lon.value, 121.47);
        mb.meridian = numOr(mer.value, 120);
        run();
      } }, ['生 成 合 盘'])
    ]);
    syncAdvanced();
    c.appendChild(el('div', { class: 'grid', style: 'grid-template-columns:5fr 7fr' }, [ form, el('div', { class: 'card' }, [box]) ]));
    run();
  }

  // ---------- 玄微会员 ----------
  function pageMember(c) {
    var active = state.memberPlan === 'pro';
    var features = [
      ['深度命盘报告', '四柱、十神、神煞、纳音、空亡、胎元命宫合并成完整解读。', '命'],
      ['大运流年扩展', '支持指定年份区间、年度评分、事业财运感情健康分项。', '運'],
      ['合盘关系报告', '双方日主、配偶宫、喜用互补、五行结构与冲合害综合评分。', '緣'],
      ['分享海报套件', '今日运势、命盘摘要、合盘摘要多模板导出。', '圖'],
      ['紫微增强', '十四主星、四化、辅星与命身宫重点解释。', '斗'],
      ['本地档案库', '保存多位命主，按姓名、日期、主题快速回看。', '錄']
    ];
    var hero = el('div', { class: 'card member-hero' }, [
      el('div', { class: 'member-copy' }, [
        el('span', { class: 'kicker' }, ['XUANWEI MEMBERSHIP']),
        el('h2', {}, ['玄微会员']),
        el('p', {}, ['把完整排盘、流年区间、合盘报告、紫微增强和分享模板集中到一个工作台。当前为本地预览，不接入支付。']),
        el('div', { class: 'member-actions' }, [
          el('button', { class: 'btn-gold', onclick: function () { state.memberPlan = active ? 'free' : 'pro'; try { localStorage.setItem('tianji-member-plan', state.memberPlan); } catch (e) {} toast(state.memberPlan === 'pro' ? '会员预览已启用' : '已切回基础模式'); setRoute('member'); } }, [active ? '关闭会员预览' : '启用会员预览']),
          el('span', { class: 'pill ' + (active ? 'joy' : '') }, [active ? '已启用' : '基础模式'])
        ])
      ]),
      el('div', { class: 'member-orb' }, [
        el('div', { class: 'orb-main' }, ['玄']),
        el('div', { class: 'orb-sub' }, [active ? 'PRO ACTIVE' : 'PREVIEW'])
      ])
    ]);
    var grid = el('div', { class: 'member-feature-grid' }, features.map(function (f) {
      return el('div', { class: 'card member-feature' }, [
        el('div', { class: 'feature-seal' }, [f[2]]),
        el('div', {}, [el('h3', {}, [f[0]]), el('p', {}, [f[1]])])
      ]);
    }));
    var usage = el('div', { class: 'card', style: 'margin-top:18px' }, [
      el('div', { class: 'card-h' }, [el('h3', {}, ['当前权益状态'])]),
      kvRow('命盘报告', active ? '完整' : '基础'),
      kvRow('流年年份', active ? '可查看 1900–2100' : '当前年度附近'),
      kvRow('合盘报告', active ? '已开放' : '基础评分'),
      kvRow('海报模板', active ? '今日 / 命盘 / 合盘' : '今日运势')
    ]);
    c.appendChild(hero);
    c.appendChild(grid);
    c.appendChild(usage);
  }

  // ---------- 偏好设置 ----------
  function pageSettings(c) {
    var list = []; try { list = JSON.parse(localStorage.getItem('bazi-history') || '[]'); } catch (e) {}
    var themeCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['主题配色'])]),
      el('div', { style: 'display:flex;gap:10px' }, [['mojin','墨金'],['zhusha','朱砂'],['shuimo','水墨']].map(function (o) {
        return el('button', { class: 'theme-chip ' + o[0] + (state.accent === o[0] ? ' on' : ''), onclick: function () { state.accent = o[0]; try { localStorage.setItem('tianji-accent', o[0]); } catch (e) {} applyAccent(); setRoute('settings'); } }, [o[1]]);
      })) ]);
    var calCard = el('div', { class: 'card' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['默认历法'])]),
      el('div', { class: 'seg' }, [['solar','公历'],['lunar','农历']].map(function (o) {
        return el('button', { class: (state.defaultCalendar || 'solar') === o[0] ? 'on' : '', onclick: function () { state.defaultCalendar = o[0]; try { localStorage.setItem('tianji-cal', o[0]); } catch (e) {} setRoute('settings'); } }, [o[1]]);
      })),
      el('p', { class: 'page-sub', style: 'margin-top:14px' }, ['新建命主时默认采用此历法。'])
    ]);
    var manageCard = el('div', { class: 'card', style: 'grid-column:1/-1' }, [
      el('div', { class: 'card-h' }, [ el('h3', {}, ['命主管理']), el('button', { class: 'pill warn', style: 'cursor:pointer;border:none', onclick: function () { if (window.confirm ? window.confirm('确定清空全部历史记录？') : true) { try { localStorage.removeItem('bazi-history'); } catch (e) {} setRoute('settings'); toast('历史记录已清空'); } } }, ['清空全部']) ])
    ]);
    if (!list.length) manageCard.appendChild(el('p', { class: 'page-sub' }, ['暂无保存的命主，排盘后自动保存。']));
    list.forEach(function (r) {
      manageCard.appendChild(el('div', { class: 'manage-row' }, [
        el('div', {}, [ el('div', { style: 'font-size:14px' }, [(r.name || '命主') + ' · ' + (r.dayMaster || '')]), el('div', { style: 'font-size:11px;color:var(--text-3)' }, [r.year + '.' + pad(r.month) + '.' + pad(r.day) + ' ' + pad(r.hour) + ':' + pad(r.minute) + ' · ' + genderLabel(r.gender)]) ]),
        el('div', { style: 'display:flex;gap:8px' }, [
          el('button', { class: 'pill', style: 'cursor:pointer;border:none', onclick: function () { state.birth = normalizedBirthFromRecord(r); recompute(); setRoute('chart'); } }, ['切换']),
          el('button', { class: 'pill warn', style: 'cursor:pointer;border:none', onclick: function () { var k = [r.year,r.month,r.day,r.hour,r.minute,r.gender,r.calendar || 'solar',!!r.leapMonth,r.place,!!r.trueSolarTime,numOr(r.longitude,121.47),numOr(r.meridian,120)].join('-'); var nl = list.filter(function (x) { return [x.year,x.month,x.day,x.hour,x.minute,x.gender,x.calendar || 'solar',!!x.leapMonth,x.place,!!x.trueSolarTime,numOr(x.longitude,121.47),numOr(x.meridian,120)].join('-') !== k; }); try { localStorage.setItem('bazi-history', JSON.stringify(nl)); } catch (e) {} setRoute('settings'); } }, ['删除'])
        ])
      ]));
    });
    var aboutCard = el('div', { class: 'card', style: 'grid-column:1/-1' }, [ el('div', { class: 'card-h' }, [el('h3', {}, ['关于 · 免责声明'])]),
      el('p', { class: 'prose' }, ['天機閣以传统命理「扶抑法」与历法天文计算为基础，所有解读与推测均为规则化推演、附依据与置信度，属文化与分析框架，非科学预测，仅供参考。历法计算基于 lunar-javascript。']) ]);
    c.appendChild(el('div', { class: 'grid g-2', style: 'margin-bottom:18px' }, [themeCard, calCard]));
    c.appendChild(manageCard);
    c.appendChild(el('div', { style: 'margin-top:18px' }, [aboutCard]));
  }

  // ---------- 紫微斗数 ----------
  var WUHU = { 甲:'丙',己:'丙',乙:'戊',庚:'戊',丙:'庚',辛:'庚',丁:'壬',壬:'壬',戊:'甲',癸:'甲' };
  var NAYIN = (function () {
    var pairs = [['甲子乙丑','金'],['丙寅丁卯','火'],['戊辰己巳','木'],['庚午辛未','土'],['壬申癸酉','金'],['甲戌乙亥','火'],
      ['丙子丁丑','水'],['戊寅己卯','土'],['庚辰辛巳','金'],['壬午癸未','木'],['甲申乙酉','水'],['丙戌丁亥','土'],
      ['戊子己丑','火'],['庚寅辛卯','木'],['壬辰癸巳','水'],['甲午乙未','金'],['丙申丁酉','火'],['戊戌己亥','木'],
      ['庚子辛丑','土'],['壬寅癸卯','金'],['甲辰乙巳','火'],['丙午丁未','水'],['戊申己酉','土'],['庚戌辛亥','金'],
      ['壬子癸丑','木'],['甲寅乙卯','水'],['丙辰丁巳','土'],['戊午己未','火'],['庚申辛酉','木'],['壬戌癸亥','水']];
    var m = {}; pairs.forEach(function (p) { m[p[0].slice(0,2)] = p[1]; m[p[0].slice(2,4)] = p[1]; }); return m;
  })();
  var ZW_NAMES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];
  var ZW_DESC = { 紫微:'尊贵稳重、有领导力，宜居要位。', 天机:'机巧善谋、思虑灵敏，长于策划。', 太阳:'热情磊落、利公众与名望。', 武曲:'刚毅果决、长于理财实务。', 天同:'温和知足、福气绵长。', 廉贞:'多才而性烈，宜修身自律。', 天府:'稳健持重、善聚财守成。', 太阴:'细腻内敛、利文艺与不动产。', 贪狼:'多才多艺、欲望与机遇并存。', 巨门:'口才善辩、长于专业与研究。', 天相:'端正辅佐、重信誉。', 天梁:'稳重荫人、有长者风。', 七杀:'果敢开创、利竞争与变革。', 破军:'破旧立新、变动中求成。' };
  var SIHUA = {
    甲: { 禄:'廉贞', 权:'破军', 科:'武曲', 忌:'太阳' },
    乙: { 禄:'天机', 权:'天梁', 科:'紫微', 忌:'太阴' },
    丙: { 禄:'天同', 权:'天机', 科:'文昌', 忌:'廉贞' },
    丁: { 禄:'太阴', 权:'天同', 科:'天机', 忌:'巨门' },
    戊: { 禄:'贪狼', 权:'太阴', 科:'右弼', 忌:'天机' },
    己: { 禄:'武曲', 权:'贪狼', 科:'天梁', 忌:'文曲' },
    庚: { 禄:'太阳', 权:'武曲', 科:'太阴', 忌:'天同' },
    辛: { 禄:'巨门', 权:'太阳', 科:'文曲', 忌:'文昌' },
    壬: { 禄:'天梁', 权:'紫微', 科:'左辅', 忌:'武曲' },
    癸: { 禄:'破军', 权:'巨门', 科:'太阴', 忌:'贪狼' }
  };
  var LUCUN_BRANCH = { 甲:'寅', 乙:'卯', 丙:'巳', 戊:'巳', 丁:'午', 己:'午', 庚:'申', 辛:'酉', 壬:'亥', 癸:'子' };
  var TIANMA_BRANCH = { 申:'寅', 子:'寅', 辰:'寅', 寅:'申', 午:'申', 戌:'申', 亥:'巳', 卯:'巳', 未:'巳', 巳:'亥', 酉:'亥', 丑:'亥' };
  function nayinEl(gz) { return NAYIN[gz] || '土'; }
  function ziweiPos(ju, day) {
    var rem = day % ju, add = rem === 0 ? 0 : ju - rem;
    var multiple = (day + add) / ju, borrow = add;
    var pos = (2 + (multiple - 1)) % 12;
    if (borrow % 2 === 1) pos = ((pos - borrow) % 12 + 12) % 12; else pos = (pos + borrow) % 12;
    return pos;
  }
  function ziweiChart(birth) {
    var solarParts = resolvedSolarParts();
    var sol = window.Solar.fromYmdHms(solarParts.year, solarParts.month, solarParts.day, solarParts.hour, solarParts.minute, 0);
    var lun = sol.getLunar(); var lm = Math.abs(lun.getMonth()), ld = lun.getDay();
    var hourIdx = Math.floor((solarParts.hour + 1) / 2) % 12;
    var ming = ((2 + (lm - 1) - hourIdx) % 12 + 12) % 12;
    var shen = ((2 + (lm - 1) + hourIdx) % 12) % 12;
    var yearGan = state.chart.pillars[0].gan;
    var yearZhi = state.chart.pillars[0].zhi;
    var yinGanIdx = GAN.indexOf(WUHU[yearGan]);
    var mingGanIdx = (yinGanIdx + ((ming - 2 + 12) % 12)) % 10;
    var nyEl = nayinEl(GAN[mingGanIdx] + BR[ming]);
    var ju = { 水:2, 木:3, 金:4, 土:5, 火:6 }[nyEl];
    var juName = { 2:'水二局', 3:'木三局', 4:'金四局', 5:'土五局', 6:'火六局' }[ju];
    var zw = ziweiPos(ju, ld);
    var palaces = []; for (var i = 0; i < 12; i++) palaces.push({ name: ZW_NAMES[((ming - i) % 12 + 12) % 12], stars: [] });
    function normIdx(idx) { return ((idx % 12) + 12) % 12; }
    function idxOfBranch(b) { return Math.max(0, BR.indexOf(b)); }
    function put(name, idx, aux) {
      var p = palaces[normIdx(idx)];
      var hit = p.stars.filter(function (s) { return s.name === name; })[0];
      if (!hit) p.stars.push({ name: name, aux: !!aux });
      return hit || p.stars[p.stars.length - 1];
    }
    put('紫微', zw); put('天机', zw - 1); put('太阳', zw - 3); put('武曲', zw - 4); put('天同', zw - 5); put('廉贞', zw - 8);
    var fu = ((4 - zw) % 12 + 12) % 12;
    put('天府', fu); put('太阴', fu + 1); put('贪狼', fu + 2); put('巨门', fu + 3); put('天相', fu + 4); put('天梁', fu + 5); put('七杀', fu + 6); put('破军', fu + 10);
    put('左辅', 4 + lm - 1, true); put('右弼', 10 - (lm - 1), true);
    put('文昌', 10 - hourIdx, true); put('文曲', 4 + hourIdx, true);
    var lucun = idxOfBranch(LUCUN_BRANCH[yearGan] || '寅');
    put('禄存', lucun, true); put('擎羊', lucun + 1, true); put('陀罗', lucun - 1, true);
    var ty = TIANYI[yearGan] || ['丑','未'];
    put('天魁', idxOfBranch(ty[0]), true); put('天钺', idxOfBranch(ty[1] || ty[0]), true);
    put('天马', idxOfBranch(TIANMA_BRANCH[yearZhi] || '寅'), true);
    put('红鸾', normIdx(3 - idxOfBranch(yearZhi)), true); put('天喜', normIdx(9 - idxOfBranch(yearZhi)), true);
    put('火星', 2 + hourIdx + (lm % 4), true); put('铃星', 8 + hourIdx - (lm % 4), true);
    put('地空', hourIdx - 1, true); put('地劫', hourIdx + 1, true);
    var hua = SIHUA[yearGan] || {};
    Object.keys(hua).forEach(function (type) {
      var star = hua[type];
      for (var pi = 0; pi < palaces.length; pi++) {
        var found = palaces[pi].stars.filter(function (s) { return s.name === star; })[0];
        if (found) { found.hua = '化' + type; found.huaType = type; return; }
      }
    });
    palaces.forEach(function (p) {
      p.stars.sort(function (a, b) {
        if (!!a.hua !== !!b.hua) return a.hua ? -1 : 1;
        if (!!a.aux !== !!b.aux) return a.aux ? 1 : -1;
        return 0;
      });
    });
    var mingStars = palaces[ming].stars.map(function (s) { return s.name; });
    var mainMingStars = palaces[ming].stars.filter(function (s) { return !s.aux; }).map(function (s) { return s.name; });
    var mingStar = mainMingStars[0] || '';
    var huaText = Object.keys(hua).map(function (k) { return hua[k] + '化' + k; }).join('、');
    var summary = '命宫在' + BR[ming] + (mingStar ? '，主星' + mainMingStars.join('、') + '。' + (ZW_DESC[mingStar] || '') : '，本宫无主星，借对宫论之。') + ' 年干' + yearGan + '四化为' + huaText + '。五行' + juName + '，起运' + ju + '岁。';
    return { ming: ming, shen: shen, ziwei: zw, juName: juName, mingStar: mingStar, summary: summary, palaces: palaces };
  }
  function resolvedSolarParts() {
    var d = (state.chart && state.chart.input && state.chart.input.date ? state.chart.input.date : '').split('.');
    var t = (state.chart && state.chart.input && state.chart.input.time ? state.chart.input.time : '').split(':');
    if (d.length === 3 && t.length >= 2) return { year: +d[0], month: +d[1], day: +d[2], hour: +t[0], minute: +t[1] };
    return { year: +state.birth.year, month: +state.birth.month, day: +state.birth.day, hour: +state.birth.hour, minute: +state.birth.minute };
  }
  // ---------- boot ----------
  try { var sa = localStorage.getItem('tianji-accent'); if (sa) state.accent = sa; } catch (e) {}
  try { var sc = localStorage.getItem('tianji-cal'); if (sc === 'solar' || sc === 'lunar') { state.defaultCalendar = sc; state.birth.calendar = sc; } } catch (e) {}
  try { var sp = localStorage.getItem('tianji-member-plan'); if (sp === 'pro') state.memberPlan = 'pro'; } catch (e) {}
  applyAccent();
  recompute();
  renderShell();
  setInterval(function () {
    state.today = new Date();
    if (!document.querySelector('.birth-card') && (state.route === 'daily' || state.route === 'analytics')) renderShell();
  }, 60000);
})();
