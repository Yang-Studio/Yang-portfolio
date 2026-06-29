/* BaZi — UI. Vanilla JS, no build step. Renders three screens into #app. */
(function () {
  'use strict';

  var QUERY = new URLSearchParams(window.location.search);
  var EMBED_MODE = document.documentElement.hasAttribute('data-embed') || QUERY.get('embed') === '1';
  var EMBED_START = QUERY.get('screen') || 'form';

  var GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  var ZHI_WX = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
  var EL_CLASS = { 木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water' };
  var EL_ORDER = ['木', '火', '土', '金', '水'];
  var PILLAR_MEANING = {
    年柱: '代表早年环境、家族背景、外部资源与一个人最早接触到的社会氛围。',
    月柱: '代表成长阶段、职业底色、能力形成方式，也是判断强弱与格局时最重要的时间位置。',
    日柱: '代表本人核心与亲密关系。天干是日主，地支常被看作配偶宫与内在稳定感。',
    时柱: '代表后期发展、子女/作品、长期目标，以及一个人把能力输出到未来的方式。'
  };
  var ELEMENT_MEANING = {
    木: '代表生长、规划、学习、仁和、向上发展。过强容易固执，过弱容易缺少持续生发力。',
    火: '代表表达、热度、传播、审美、行动可见度。过强容易急躁外耗，过弱则热情和呈现感不足。',
    土: '代表承载、稳定、信用、现实执行和资源沉淀。过强容易迟滞保守，过弱则不易落地。',
    金: '代表规则、判断、效率、边界、决断和专业标准。过强容易锋利紧绷，过弱则原则和收束力不足。',
    水: '代表流动、信息、智慧、适应、沟通与资源循环。过强容易漂移，过弱则弹性和变通不足。'
  };
  var TEN_GOD_MEANING = {
    比肩: '同类力量，代表自我、独立、竞争、同辈关系。多则主见强，少则需要借助外部支持建立自信。',
    劫财: '同类但带争夺性，代表行动力、社交、合伙、资源竞争。多则敢冲敢抢，也要注意财务边界。',
    食神: '日主所生且较温和，代表才华输出、表达、享受、稳定产出。多则适合内容、教育、审美与创作。',
    伤官: '日主所生且更外放，代表才气、突破、表达欲、反规则。多则聪明锋利，也要注意与制度的摩擦。',
    正财: '被日主所克且稳定，代表现实收益、责任、经营、可控资源。多则重结果与稳定回报。',
    偏财: '被日主所克且流动，代表机会财、人脉财、市场感、资源调度。多则灵活，但来去也快。',
    正官: '克日主且有秩序，代表规则、责任、职位、名誉、自律。多则适合制度化环境与管理路径。',
    七杀: '克日主且压力更强，代表竞争、压强、决断、开创和危机处理。得制化时有领导力，失衡时压力大。',
    正印: '生日主且稳定，代表学习、保护、资格、贵人、吸收能力。多则重知识与安全感。',
    偏印: '生日主且偏专，代表洞察、技术、冷门能力、独立思考。多则适合研究型或非标准路径。'
  };
  var BRANCH_MEANING = {
    子: '水气集中，偏信息、流动、机敏与隐性资源。',
    丑: '湿土，偏储藏、缓慢积累、现实承载。',
    寅: '初春木，偏启动、生发、开局与学习。',
    卯: '纯木，偏生长、审美、关系柔韧与方向感。',
    辰: '湿土带水木，偏转换、蓄势、复杂资源。',
    巳: '初夏火，偏表达、技术、热度与外显行动。',
    午: '火气集中，偏可见度、热情、速度与表现。',
    未: '燥土带木火，偏整理、承接、成果沉淀。',
    申: '金气启动，偏规则、技术、效率与变化。',
    酉: '纯金，偏标准、判断、审美边界与收束。',
    戌: '燥土带火金，偏防守、责任、秩序与封存。',
    亥: '水气生木，偏流动、远方、学习与潜在机会。'
  };
  var VERDICT_MEANING = {
    有利: '这一阶段带来的五行更接近当前喜用，通常更利于推进、扩张或修复结构短板。',
    平稳: '这一阶段没有明显放大喜用或忌神，节奏相对中性，更适合稳步经营。',
    不利: '这一阶段带来的五行更接近忌神，容易放大结构压力，适合保守、减杠杆、重调整。'
  };
  var CHANGSHENG_MEANING = {
    长生: '气开始生发，代表起点、学习、恢复和新机会。',
    沐浴: '气不稳定，代表变化、外界影响、吸引力和试探。',
    冠带: '气逐渐成形，代表包装、身份、规则意识和成长。',
    临官: '气进入可用状态，代表执行、独立、职位和现实能力。',
    帝旺: '气最强，代表高峰、主导、强势和放大效应。',
    衰: '气由盛转弱，代表收敛、调整、保守和消耗后的整理。',
    病: '气受损，代表压力、阻滞、需要修复的环节。',
    死: '气停滞，代表结束、定型、低活性和不宜强推。',
    墓: '气入库，代表收藏、积累、封存、资源不外露。',
    绝: '气断开，代表转换、断舍离、旧结构难以延续。',
    胎: '气重新孕育，代表潜力、酝酿、未成形的新方向。',
    养: '气被滋养，代表修复、培养、准备和长期铺垫。'
  };
  var SHENSHA_MEANING = {
    天乙贵人: '代表外部助力、贵人缘、逢难有解的传统符号。',
    文昌贵人: '代表学习、文书、考试、表达和专业资质方面的助力。',
    禄神: '代表稳定资源、职位收益、自身可用的现实支撑。',
    羊刃: '代表强硬、锋利、冲劲和风险承受力，宜被规则或目标约束。',
    桃花: '代表吸引力、审美、社交曝光和人际缘分，也要注意边界。',
    驿马: '代表移动、变化、出差迁移、跨地域机会和不安定因素。',
    华盖: '代表独立、审美、研究、精神性和偏冷门的专长。',
    将星: '代表掌控力、组织力、领导意识和在群体中的号召力。'
  };
  var NAYIN_ELEMENT_MEANING = {
    木: '纳音属木，偏向生发、教育、规划、成长和长期培育。',
    火: '纳音属火，偏向表达、传播、热度、可见度和快速推动。',
    土: '纳音属土，偏向承载、稳定、信用、资源沉淀和现实落地。',
    金: '纳音属金，偏向规则、技术、标准、判断和收束能力。',
    水: '纳音属水，偏向流动、信息、迁移、沟通和适应能力。'
  };

  // City longitudes for true-solar-time correction. [name, longitude, standardMeridian].
  // Meridian defaults to 120 (China Standard Time); overseas entries carry their own.
  var CITIES = [
    // —— 直辖市 ——
    ['北京', 116.41], ['上海', 121.47], ['天津', 117.20], ['重庆', 106.55],
    // —— 省会 / 首府 ——
    ['广州', 113.26], ['成都', 104.07], ['杭州', 120.15], ['南京', 118.80],
    ['武汉', 114.30], ['西安', 108.94], ['郑州', 113.62], ['济南', 117.00],
    ['长沙', 112.94], ['沈阳', 123.43], ['哈尔滨', 126.53], ['长春', 125.32],
    ['昆明', 102.83], ['贵阳', 106.71], ['南宁', 108.37], ['海口', 110.35],
    ['福州', 119.30], ['南昌', 115.86], ['合肥', 117.27], ['石家庄', 114.51],
    ['太原', 112.55], ['呼和浩特', 111.65], ['银川', 106.27], ['西宁', 101.78],
    ['兰州', 103.83], ['乌鲁木齐', 87.62], ['拉萨', 91.14],
    // —— 主要城市 ——
    ['深圳', 114.06], ['珠海', 113.55], ['东莞', 113.75], ['佛山', 113.12],
    ['惠州', 114.41], ['中山', 113.39], ['江门', 113.08], ['汕头', 116.68],
    ['湛江', 110.36], ['苏州', 120.62], ['无锡', 120.30], ['常州', 119.95],
    ['徐州', 117.18], ['南通', 120.86], ['扬州', 119.42], ['盐城', 120.16],
    ['连云港', 119.16], ['宁波', 121.55], ['温州', 120.70], ['绍兴', 120.58],
    ['金华', 119.65], ['台州', 121.42], ['嘉兴', 120.76], ['湖州', 120.10],
    ['青岛', 120.38], ['烟台', 121.39], ['潍坊', 119.16], ['临沂', 118.36],
    ['淄博', 118.05], ['威海', 122.12], ['大连', 121.62], ['鞍山', 122.99],
    ['吉林', 126.55], ['齐齐哈尔', 123.92], ['芜湖', 118.38], ['蚌埠', 117.39],
    ['厦门', 118.10], ['泉州', 118.59], ['莆田', 119.01], ['赣州', 114.94],
    ['九江', 115.99], ['宜昌', 111.29], ['襄阳', 112.14], ['荆州', 112.24],
    ['洛阳', 112.45], ['开封', 114.30], ['南阳', 112.53], ['信阳', 114.09],
    ['株洲', 113.13], ['湘潭', 112.93], ['衡阳', 112.57], ['岳阳', 113.13],
    ['常德', 111.69], ['绵阳', 104.68], ['德阳', 104.40], ['南充', 106.08],
    ['宜宾', 104.64], ['泸州', 105.44], ['攀枝花', 101.72], ['桂林', 110.29],
    ['柳州', 109.41], ['北海', 109.12], ['三亚', 109.51], ['遵义', 106.93],
    ['曲靖', 103.79], ['大理', 100.23], ['丽江', 100.23], ['咸阳', 108.71],
    ['宝鸡', 107.24], ['延安', 109.49], ['榆林', 109.74], ['天水', 105.72],
    ['唐山', 118.18], ['保定', 115.46], ['廊坊', 116.70], ['秦皇岛', 119.60],
    ['邯郸', 114.54], ['大同', 113.30], ['包头', 109.84],
    // —— 港澳台 ——
    ['香港', 114.17], ['澳门', 113.55], ['台北', 121.56], ['高雄', 120.31],
    // —— 海外（常见，含所在时区标准经线）——
    ['新加坡', 103.82, 120], ['吉隆坡', 101.69, 120], ['曼谷', 100.50, 105],
    ['东京', 139.69, 135], ['首尔', 126.98, 135], ['悉尼', 151.21, 150],
    ['伦敦', -0.13, 0], ['纽约', -74.00, -75], ['洛杉矶', -118.24, -120],
    ['旧金山', -122.42, -120], ['温哥华', -123.12, -120], ['多伦多', -79.38, -75]
  ];

  var state = {
    birth: { name: '', year: 1996, month: 5, day: 18, hour: 9, minute: 30, calendar: 'solar', leapMonth: false, gender: 'male', place: '上海', trueSolarTime: false, longitude: 121.47, meridian: 120 },
    matchBirth: { year: 1996, month: 5, day: 18, hour: 9, minute: 30, calendar: 'solar', leapMonth: false, gender: 'female', place: '上海', trueSolarTime: false, longitude: 121.47, meridian: 120 },
    matchResult: null,
    chart: null,
    analysis: null,
    year: new Date().getFullYear()
  };

  var app = document.getElementById('app');
  var sheetRoot = document.getElementById('sheet-root');

  if (EMBED_MODE) {
    document.documentElement.classList.add('embed-mode');
    document.body.classList.add('embed-mode');
    if (QUERY.get('transparent') === '1') {
      document.documentElement.classList.add('embed-transparent');
      document.body.classList.add('embed-transparent');
    }
    applyEmbedParams();
  }

  // ---------- helpers ----------
  function applyEmbedParams() {
    var b = state.birth;
    var date = QUERY.get('date');
    var time = QUERY.get('time');
    if (QUERY.has('name')) b.name = QUERY.get('name') || '';
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      b.year = +date.slice(0, 4);
      b.month = +date.slice(5, 7);
      b.day = +date.slice(8, 10);
    }
    if (time && /^\d{2}:\d{2}$/.test(time)) {
      b.hour = +time.slice(0, 2);
      b.minute = +time.slice(3, 5);
    }
    if (QUERY.get('calendar') === 'lunar' || QUERY.get('calendar') === 'solar') b.calendar = QUERY.get('calendar');
    if (QUERY.has('leapMonth')) b.leapMonth = QUERY.get('leapMonth') === '1';
    if (QUERY.get('gender') === 'female' || QUERY.get('gender') === 'male') b.gender = QUERY.get('gender');
    if (QUERY.has('place')) {
      b.place = QUERY.get('place') || '';
      var city = cityOf(b.place);
      if (city) {
        b.longitude = city[1];
        b.meridian = city.length > 2 ? city[2] : 120;
      }
    }
    if (QUERY.has('trueSolarTime')) b.trueSolarTime = QUERY.get('trueSolarTime') === '1';
    if (QUERY.has('longitude') && !isNaN(parseFloat(QUERY.get('longitude')))) b.longitude = parseFloat(QUERY.get('longitude'));
    if (QUERY.has('meridian') && !isNaN(parseFloat(QUERY.get('meridian')))) b.meridian = parseFloat(QUERY.get('meridian'));
  }

  function postEmbedMessage(type, payload) {
    if (!EMBED_MODE || window.parent === window) return;
    window.parent.postMessage(Object.assign({ type: type, source: 'bazi-widget' }, payload || {}), '*');
  }

  function notifyScreen(name) {
    postEmbedMessage('bazi:screen', { screen: name });
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clsOf(ch) { return EL_CLASS[GAN_WX[ch] || ZHI_WX[ch]] || ''; }
  // colorize each character of a ganzhi string
  function gzSpan(gz) {
    var wrap = el('span');
    gz.split('').forEach(function (ch) { wrap.appendChild(el('span', { class: clsOf(ch) }, [ch])); });
    return wrap;
  }
  function cityOf(place) {
    for (var i = 0; i < CITIES.length; i++) if (CITIES[i][0] === place) return CITIES[i];
    return null;
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (!EMBED_MODE) {
      try { localStorage.setItem('bazi-theme', t); } catch (e) {}
    }
    var btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = t === 'dark' ? sunIcon() : moonIcon();
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  // ---------- history (saved on this device) ----------
  var HISTORY_KEY = 'bazi-history';
  function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; } }
  function saveHistory(list) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {} }
  function recordKey(b) { return [b.calendar || 'solar', b.leapMonth ? 1 : 0, b.year, b.month, b.day, b.hour, b.minute, b.gender, b.place, b.trueSolarTime ? 1 : 0].join('-'); }
  function addHistory(b, chart) {
    var key = recordKey(b);
    var list = loadHistory().filter(function (r) { return recordKey(r) !== key; });
    list.unshift({
      name: b.name || '', year: b.year, month: b.month, day: b.day, hour: b.hour, minute: b.minute,
      calendar: b.calendar || 'solar', leapMonth: !!b.leapMonth,
      gender: b.gender, place: b.place, trueSolarTime: b.trueSolarTime, longitude: b.longitude, meridian: b.meridian,
      dayMaster: chart.dayMaster.label, savedAt: Date.now()
    });
    if (list.length > 30) list = list.slice(0, 30);
    saveHistory(list);
  }
  function removeHistory(key) { saveHistory(loadHistory().filter(function (r) { return recordKey(r) !== key; })); }
  function openHistory(r) {
    state.birth = { name: r.name || '', year: r.year, month: r.month, day: r.day, hour: r.hour, minute: r.minute,
      calendar: r.calendar || 'solar', leapMonth: !!r.leapMonth,
      gender: r.gender, place: r.place, trueSolarTime: r.trueSolarTime, longitude: r.longitude, meridian: r.meridian };
    compute();
  }

  // ---------- top bar ----------
  function topbar(opts) {
    opts = opts || {};
    if (EMBED_MODE && !opts.back) return el('div', { class: 'embed-spacer', 'aria-hidden': 'true' });
    var left = opts.back
      ? el('button', { class: 'iconbtn back', onclick: opts.back }, ['‹ 返回'])
      : el('span', { class: 'brand' }, ['BaZi']);
    return el('div', { class: 'topbar' }, [
      el('div', { class: 'topbar-left' }, [left]),
      el('div', { class: 'topbar-right' }, EMBED_MODE ? [] : [
        opts.noHistory ? null : el('button', { class: 'iconbtn', title: '历史记录', onclick: renderHistory, html: historyIcon() }),
        el('button', { class: 'iconbtn', id: 'theme-btn', title: '切换主题', onclick: toggleTheme,
          html: document.documentElement.getAttribute('data-theme') === 'dark' ? sunIcon() : moonIcon() })
      ])
    ]);
  }

  // ---------- history screen ----------
  function renderHistory() {
    app.innerHTML = '';
    app.className = 'app-history';
    app.appendChild(topbar({ back: state.chart ? renderResult : renderHome, noHistory: true }));
    var list = loadHistory();
    var screen = el('div', { class: 'screen' }, [el('h1', { class: 'title', style: 'margin:8px 0 24px' }, ['历史记录'])]);
    if (!list.length) {
      screen.appendChild(el('div', { class: 'empty' }, [
        el('div', { class: 'empty-icon', html: historyIcon() }),
        el('p', { class: 'subtitle' }, ['暂无记录']),
        el('p', { class: 'caption' }, ['完成排盘后会自动保存在本设备。'])
      ]));
    } else {
      list.forEach(function (r) {
        var label = r.name || (r.year + '.' + pad(r.month) + '.' + pad(r.day));
        var sub = r.year + '.' + pad(r.month) + '.' + pad(r.day) + ' ' + pad(r.hour) + ':' + pad(r.minute) +
          ' · ' + r.gender + (r.place ? ' · ' + r.place : '');
        var dmEl = (r.dayMaster || '').slice(-1);
        var card = el('div', { class: 'hist' }, [
          el('div', { class: 'hist-main', onclick: function () { openHistory(r); } }, [
            el('div', { class: 'hist-name' }, [label]),
            el('div', { class: 'hist-sub' }, [sub])
          ]),
          el('div', { class: 'hist-dm ' + (EL_CLASS[dmEl] || '') }, [r.dayMaster || '']),
          el('button', { class: 'hist-del', title: '删除', html: trashIcon(),
            onclick: function (e) { e.stopPropagation(); removeHistory(recordKey(r)); renderHistory(); } })
        ]);
        screen.appendChild(card);
      });
    }
    app.appendChild(screen);
    notifyScreen('history');
  }

  // ---------- screen 1: home ----------
  function renderHome() {
    app.innerHTML = '';
    app.className = 'app-home';
    var screen = el('div', { class: 'screen home' }, [
      el('div', {}, [
        el('div', { class: 'logo-mark', html: logoIcon() }),
        el('h1', { class: 'title' }, ['BaZi']),
        el('p', { class: 'subtitle' }, ['现代八字排盘工具']),
      ]),
      el('p', { class: 'subtitle' }, ['通过出生时间生成四柱结构，查看五行分布与大运周期。']),
      el('button', { class: 'btn', onclick: renderForm }, ['开始排盘'])
    ]);
    app.appendChild(screen);
    notifyScreen('home');
  }

  // ---------- screen 2: birth info ----------
  function renderForm() {
    app.innerHTML = '';
    app.className = 'app-form';
    app.appendChild(topbar({ back: EMBED_MODE ? null : renderHome }));
    var b = state.birth;

    var nameInput = el('input', { type: 'text', value: b.name || '', placeholder: '可留空', maxlength: '20' });
    var dateInput = el('input', { type: 'date', value: pad4(b.year) + '-' + pad(b.month) + '-' + pad(b.day) });
    var timeInput = el('input', { type: 'time', value: pad(b.hour) + ':' + pad(b.minute) });

    var calendarSeg = el('div', { class: 'segmented' }, [
      segBtn('公历', (b.calendar || 'solar') === 'solar', function () { b.calendar = 'solar'; refreshCalendar(); }),
      segBtn('农历', b.calendar === 'lunar', function () { b.calendar = 'lunar'; refreshCalendar(); })
    ]);

    var genderSeg = el('div', { class: 'segmented' }, [
      segBtn('男', b.gender === 'male', function () { b.gender = 'male'; refreshSeg(); }),
      segBtn('女', b.gender === 'female', function () { b.gender = 'female'; refreshSeg(); })
    ]);
    function refreshSeg() {
      Array.prototype.forEach.call(genderSeg.children, function (c, i) {
        c.classList.toggle('on', (i === 0) === (b.gender === 'male'));
      });
    }

    var leapSwitch = el('label', { class: 'switch' }, [
      el('input', { type: 'checkbox' }),
      el('span', { class: 'slider' })
    ]);
    var leapCb = leapSwitch.querySelector('input');
    leapCb.checked = !!b.leapMonth;
    var leapField = field('农历闰月', leapSwitch, true);
    function refreshCalendar() {
      Array.prototype.forEach.call(calendarSeg.children, function (c, i) {
        c.classList.toggle('on', (i === 0) === ((b.calendar || 'solar') === 'solar'));
      });
      leapField.style.display = b.calendar === 'lunar' ? '' : 'none';
    }

    // searchable place field (typeahead over the full city list)
    var listId = 'city-list';
    var datalist = el('datalist', { id: listId }, CITIES.map(function (c) { return el('option', { value: c[0] }); }));
    var placeInput = el('input', { type: 'text', list: listId, value: b.place, placeholder: '城市，或留空' });

    // longitude + standard-meridian fields (revealed only when true solar time is on)
    var lonInput = el('input', { type: 'number', step: '0.01', value: b.longitude });
    var merInput = el('input', { type: 'number', step: '1', value: b.meridian });
    var coordHint = el('p', { class: 'caption', style: 'margin:0 4px' }, []);
    function setCoordsFromPlace() {
      var c = cityOf(placeInput.value.trim());
      if (c) {
        b.longitude = c[1]; b.meridian = c.length > 2 ? c[2] : 120;
        lonInput.value = b.longitude; merInput.value = b.meridian;
        coordHint.textContent = '已按「' + c[0] + '」自动填入经度。未列出的地点可直接修改。';
      } else {
        coordHint.textContent = '未在列表中，请手动填写经度（东经为正）。海外出生请同时调整标准经线。';
      }
    }
    placeInput.addEventListener('input', setCoordsFromPlace);
    setCoordsFromPlace();

    var coordsBox = el('div', { id: 'tst-coords' }, [
      field('出生地经度', lonInput),
      field('时区标准经线', merInput),
      coordHint
    ]);
    coordsBox.style.display = b.trueSolarTime ? '' : 'none';

    var tstSwitch = el('label', { class: 'switch' }, [
      el('input', { type: 'checkbox' }),
      el('span', { class: 'slider' })
    ]);
    var tstCb = tstSwitch.querySelector('input');
    tstCb.checked = b.trueSolarTime;
    tstCb.addEventListener('change', function () { coordsBox.style.display = tstCb.checked ? '' : 'none'; });

    var screen = el('div', { class: 'screen' }, [
      el('h1', { class: 'title', style: 'margin:8px 0 24px' }, ['出生信息']),
      field('姓名 / 称呼', nameInput),
      field('历法', calendarSeg, true),
      field('出生日期', dateInput),
      leapField,
      field('出生时间', timeInput),
      field('性别', genderSeg, true),
      field('出生地点', placeInput),
      datalist,
      field('真太阳时', tstSwitch, true),
      coordsBox,
      el('p', { class: 'caption', style: 'margin:12px 4px 24px' },
        ['真太阳时按出生地经度与均时差校正钟表时间，可能影响时柱与节气边界。']),
      el('button', { class: 'btn', onclick: function () {
        b.name = nameInput.value.trim();
        b.year = +dateInput.value.slice(0, 4); b.month = +dateInput.value.slice(5, 7); b.day = +dateInput.value.slice(8, 10);
        b.hour = +timeInput.value.slice(0, 2); b.minute = +timeInput.value.slice(3, 5);
        b.calendar = b.calendar === 'lunar' ? 'lunar' : 'solar';
        b.leapMonth = b.calendar === 'lunar' && leapCb.checked;
        b.place = placeInput.value.trim();
        b.trueSolarTime = tstCb.checked;
        b.longitude = parseFloat(lonInput.value); b.meridian = parseFloat(merInput.value);
        if (isNaN(b.longitude)) b.longitude = 120;
        if (isNaN(b.meridian)) b.meridian = 120;
        compute();
      } }, ['生成排盘'])
    ]);
    refreshCalendar();
    app.appendChild(screen);
    notifyScreen('form');
  }

  function field(label, control, inline) {
    if (inline) {
      return el('div', { class: 'field' }, [
        el('div', { class: 'field-main' }, [el('label', {}, [label])]),
        control
      ]);
    }
    return el('div', { class: 'field' }, [
      el('div', { class: 'field-main' }, [el('label', {}, [label]), control])
    ]);
  }
  function segBtn(txt, on, cb) { return el('button', { class: on ? 'on' : '', onclick: cb }, [txt]); }

  // ---------- compute & go to result ----------
  function compute() {
    var b = state.birth;
    try {
      state.chart = window.BaZiEngine.compute({
        name: b.name || '', year: b.year, month: b.month, day: b.day, hour: b.hour, minute: b.minute,
        calendar: b.calendar || 'solar', leapMonth: !!b.leapMonth,
        gender: b.gender, place: b.place, trueSolarTime: b.trueSolarTime,
        longitude: b.longitude, standardMeridian: b.meridian
      });
    } catch (error) {
      window.alert('出生日期无法换算，请检查日期和闰月设置。');
      return;
    }
    state.analysis = window.BaZiAnalysis.analyze(state.chart);
    state.year = new Date().getFullYear();
    if (!EMBED_MODE) addHistory(b, state.chart);
    renderResult();
  }

  // ---------- screen 3: result dashboard ----------
  function renderResult() {
    var c = state.chart;
    app.innerHTML = '';
    app.className = 'app-result';
    app.appendChild(topbar({ back: renderForm }));
    var screen = el('div', { class: 'screen result-screen' });

    // hero
    var dm = c.dayMaster;
    var birthLine = c.input.sourceLunar
      ? '农历 ' + c.input.sourceLunar.display + ' → 公历 ' + c.input.sourceLunar.solarDate + '  ' + c.input.rawTime + '  ' + c.input.gender
      : '公历 ' + c.input.rawDate + '  ' + c.input.rawTime + '  ' + c.input.gender;
    screen.appendChild(el('div', { class: 'hero' }, [
      el('div', { class: 'name' }, [c.input.name || '—']),
      el('div', { class: 'birth' }, [birthLine +
        (c.input.trueSolarTime ? '  · 真太阳时 ' + c.input.time : '')]),
      el('div', { class: 'daymaster-label' }, ['日主']),
      el('div', { class: 'daymaster ' + EL_CLASS[dm.element] }, [
        el('span', {}, [dm.label]),
        el('span', { class: 'yy' }, ['（' + dm.yinyang + dm.element + '）'])
      ])
    ]));

    screen.appendChild(resultSummary(c, state.analysis));
    screen.appendChild(resultNav());

    var overview = resultSection('result-overview', '01', '命盘概览', '先看四柱结构、五行重心、十神分布与当前周期。');

    // four pillars
    var grid = el('div', { class: 'pillars' });
    c.pillars.forEach(function (p) {
      var card = el('div', { class: 'pillar', onclick: function () { openSheet(p); } }, [
        el('div', { class: 'plabel' }, [p.label]),
        el('div', { class: 'pgz' }, [
          el('div', { class: 'pgan ' + clsOf(p.gan) }, [p.gan]),
          el('div', { class: 'pzhi ' + clsOf(p.zhi) }, [p.zhi])
        ]),
        el('div', { class: 'pelem' }, [p.ganShiShen === '日主' ? '日主' : (p.ganShiShen || '')])
      ]);
      grid.appendChild(card);
    });
    overview.appendChild(grid);
    overview.appendChild(el('h3', { class: 'subsection-title' }, ['基础排盘明细']));
    overview.appendChild(basicChartTable(c));

    // five elements and ten gods
    var structureGrid = el('div', { class: 'structure-grid' });
    var elementsBlock = el('div', { class: 'structure-block' }, [
      el('h3', { class: 'subsection-title' }, ['五行结构指数'])
    ]);
    var elBox = el('div', { class: 'card' });
    elBox.appendChild(fiveElementRadar(c.fiveElements));
    c.fiveElements.forEach(function (f) {
      var span = el('span', { class: 'fill-' + EL_CLASS[f.element] });
      var row = el('div', { class: 'elrow' }, [
        el('div', { class: 'ename ' + EL_CLASS[f.element] }, [f.element]),
        el('div', { class: 'bar' }, [span]),
        el('div', { class: 'epct' }, ['0%'])
      ]);
      elBox.appendChild(row);
      // animate after mount
      requestAnimationFrame(function () { setTimeout(function () {
        span.style.width = f.percent + '%';
        animateNumber(row.querySelector('.epct'), f.percent, '%');
      }, 60); });
    });
    elementsBlock.appendChild(elBox);

    var godsBlock = el('div', { class: 'structure-block' }, [
      el('h3', { class: 'subsection-title' }, ['十神分布'])
    ]);
    var tagBox = el('div', { class: 'card' }, [el('div', { class: 'tags' },
      c.tenGods.map(function (g) {
        return el('span', { class: 'tag' }, [g.name, g.count > 1 ? el('span', { class: 'cnt' }, ['×' + g.count]) : null]);
      })
    )]);
    godsBlock.appendChild(tagBox);
    structureGrid.appendChild(elementsBlock);
    structureGrid.appendChild(godsBlock);
    overview.appendChild(structureGrid);

    // luck cycle
    overview.appendChild(el('h3', { class: 'subsection-title' }, ['大运周期']));
    var tl = el('div', { class: 'timeline' });
    var nowYear = new Date().getFullYear();
    c.luckCycle.forEach(function (d, i) {
      var isCurrent = nowYear >= d.startYear && nowYear < d.startYear + 10;
      var v = state.analysis.luck.cycles[i];
      tl.appendChild(el('div', { class: 'luck' + (isCurrent ? ' current' : '') }, [
        el('div', { class: 'lage' }, [d.startAge + '–' + (d.startAge + 9) + ' 岁']),
        el('div', { class: 'lgz' }, [gzSpan(d.ganzhi)]),
        el('div', { class: 'lyear' }, [d.startYear + '–' + (d.startYear + 9)]),
        v ? verdictBadge(v.verdict) : null
      ]));
    });
    var tlWrap = el('div', { class: 'timeline-wrap' }, [tl]);
    overview.appendChild(tlWrap);
    overview.appendChild(el('p', { class: 'caption', style: 'margin:0 4px' },
      ['起运：出生后约 ' + c.luckStart.years + ' 年 ' + c.luckStart.months + ' 个月（' + c.luckStart.date + '）']));

    // annual luck
    overview.appendChild(el('h3', { class: 'subsection-title' }, ['流年观察']));
    var annualBox = el('div', { class: 'card', id: 'annual-box' });
    overview.appendChild(annualBox);
    renderAnnual(annualBox);
    screen.appendChild(overview);

    var v2 = resultSection('result-v2', '02', 'V2 工具', '今日趋势、幸运颜色、双人合盘与可分享海报。');
    renderV2(v2, c, state.analysis);
    screen.appendChild(v2);

    var conclusions = resultSection('result-conclusions', '03', '核心结论', '把强弱、喜忌和组合关系翻译成对这个人的具体影响。');
    renderPlainAnalysis(conclusions, c, state.analysis, false);
    screen.appendChild(conclusions);

    var details = resultSection('result-details', '04', '完整依据', '需要追溯每项含义和判断链时，再展开对应内容。');
    details.appendChild(collapse('典籍与方法', sourceMethodology(state.analysis), '查看规则来源、引用范围和本产品的量化边界'));
    var fullReading = el('div', { class: 'long-reading' });
    renderMeaningGuide(fullReading, c, state.analysis);
    renderIntegratedReport(fullReading, c, state.analysis);
    details.appendChild(collapse('完整联合解读', fullReading, '四柱、五行、十神、纳音、神煞与周期的逐项结论'));

    var ruleDetails = el('div');
    renderAnalysis(ruleDetails, c, state.analysis);
    details.appendChild(collapse('规则明细', ruleDetails, '查看旺衰、喜忌与格局的计算理由'));

    var inferenceDetails = el('div');
    renderInferences(inferenceDetails, state.analysis);
    details.appendChild(collapse('细分解读', inferenceDetails, '事业、财富、关系、学习、健康与时机'));

    details.appendChild(collapse('纳音', nayinList(c, state.analysis), '查看每柱纳音对对应人生领域的修正'));
    details.appendChild(collapse('神煞', shenshaList(c.hidden.shensha, c), '作为辅助信号查看落柱与现实作用'));
    details.appendChild(collapse('十二长生', kvList(c.hidden.changsheng.map(function (n) { return [n.label, n.value]; })), '查看四柱气势所处阶段'));
    details.appendChild(collapse('空亡 · 胎元 · 命宫', hiddenCoreList(c, state.analysis), '查看底层气质与延迟、落空类信号'));
    screen.appendChild(details);

    app.appendChild(screen);
    // auto-center current luck pillar
    var cur = tl.querySelector('.luck.current');
    if (cur) tlWrap.scrollLeft = cur.offsetLeft - 24;
    notifyScreen('result');
    postEmbedMessage('bazi:result', {
      input: c.input,
      dayMaster: c.dayMaster,
      pillars: c.pillars,
      fiveElements: c.fiveElements,
      tenGods: c.tenGods,
      luckCycle: c.luckCycle,
      analysis: state.analysis
    });
  }

  function resultSummary(c, an) {
    var current = currentLuck(c, an);
    var annual = window.BaZiAnalysis.annualFavor(c, an.yongShen, state.year);
    return el('div', { class: 'result-summary', 'aria-label': '命盘关键指标' }, [
      summaryMetric('强弱', an.strength.band, an.strength.percent + '%'),
      summaryMetric('喜用', an.yongShen.favorable.map(function (f) { return f.el; }).join('、') || '流通', '平衡方向'),
      summaryMetric('当前大运', current ? current.cycle.ganzhi : '未匹配', current ? current.view.verdict : '—'),
      summaryMetric('所选流年', String(state.year), annual.verdict, 'quick-year-summary')
    ]);
  }

  function summaryMetric(label, value, note, id) {
    var attrs = { class: 'summary-metric' };
    if (id) attrs.id = id;
    return el('div', attrs, [
      el('span', { class: 'summary-label' }, [label]),
      el('strong', { class: 'summary-value' }, [value]),
      el('span', { class: 'summary-note' }, [note])
    ]);
  }

  function resultNav() {
    var items = [
      ['概览', 'result-overview'],
      ['今日', 'result-v2'],
      ['结论', 'result-conclusions'],
      ['依据', 'result-details']
    ];
    return el('nav', { class: 'result-nav', 'aria-label': '结果页导航' }, items.map(function (item, index) {
      return el('button', {
        type: 'button',
        'aria-current': index === 0 ? 'true' : 'false',
        onclick: function (event) {
          var target = document.getElementById(item[1]);
          var nav = event.currentTarget.parentNode;
          Array.prototype.forEach.call(nav.querySelectorAll('button'), function (button) {
            button.setAttribute('aria-current', button === event.currentTarget ? 'true' : 'false');
          });
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, [item[0]]);
    }));
  }

  function resultSection(id, number, title, description) {
    return el('section', { class: 'result-section', id: id }, [
      el('div', { class: 'result-section-head' }, [
        el('span', { class: 'section-number' }, [number]),
        el('div', {}, [
          el('h2', { class: 'section-title' }, [title]),
          el('p', { class: 'section-description' }, [description])
        ])
      ])
    ]);
  }

  function basicChartTable(c) {
    var nayin = {};
    c.hidden.nayin.forEach(function (item) { nayin[item.label] = item.value; });
    return el('div', { class: 'card basic-chart-table' }, c.pillars.map(function (p) {
      return el('div', { class: 'basic-chart-row', onclick: function () { openSheet(p); } }, [
        el('div', { class: 'basic-chart-pillar' }, [
          el('span', { class: 'basic-chart-label' }, [p.label]),
          el('strong', {}, [gzSpan(p.ganzhi)])
        ]),
        el('div', { class: 'basic-chart-data' }, [
          basicDatum('天干', p.gan + ' · ' + (p.ganShiShen === '日主' ? '日主' : p.ganShiShen)),
          basicDatum('地支', p.zhi + ' · ' + ZHI_WX[p.zhi]),
          basicDatum('藏干', hiddenText(p)),
          basicDatum('纳音', nayin[p.label] || '—')
        ])
      ]);
    }));
  }

  function basicDatum(label, value) {
    return el('div', { class: 'basic-datum' }, [
      el('span', {}, [label]),
      el('strong', {}, [value])
    ]);
  }

  function fiveElementRadar(items) {
    var cx = 130, cy = 118, radius = 78, max = 50;
    var points = [];
    var axes = [];
    var labels = [];
    var rings = [0.25, 0.5, 0.75, 1].map(function (ratio) {
      return '<polygon points="' + radarPoints(items.length, cx, cy, radius * ratio).join(' ') + '" />';
    }).join('');
    items.forEach(function (item, i) {
      var angle = -Math.PI / 2 + i * Math.PI * 2 / items.length;
      var valueRadius = Math.min(item.percent / max, 1) * radius;
      points.push((cx + Math.cos(angle) * valueRadius).toFixed(1) + ',' + (cy + Math.sin(angle) * valueRadius).toFixed(1));
      axes.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(angle) * radius).toFixed(1) +
        '" y2="' + (cy + Math.sin(angle) * radius).toFixed(1) + '" />');
      var lx = cx + Math.cos(angle) * (radius + 25);
      var ly = cy + Math.sin(angle) * (radius + 25);
      labels.push('<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle">' +
        item.element + ' ' + item.percent + '%</text>');
    });
    var svg = '<svg viewBox="0 0 260 236" role="img" aria-label="五行结构雷达图">' +
      '<g class="radar-grid">' + rings + axes.join('') + '</g>' +
      '<polygon class="radar-shape" points="' + points.join(' ') + '" />' +
      '<g class="radar-labels">' + labels.join('') + '</g></svg>';
    return el('div', { class: 'element-radar', html: svg });
  }

  function radarPoints(count, cx, cy, radius) {
    var out = [];
    for (var i = 0; i < count; i++) {
      var angle = -Math.PI / 2 + i * Math.PI * 2 / count;
      out.push((cx + Math.cos(angle) * radius).toFixed(1) + ',' + (cy + Math.sin(angle) * radius).toFixed(1));
    }
    return out;
  }

  function renderV2(section, c, an) {
    var now = new Date();
    var daily = window.BaZiEngine.daily(c, now.getFullYear(), now.getMonth() + 1, now.getDate());
    var dailyFavor = favorElements([daily.ganElement, daily.zhiElement], an.yongShen);
    var colors = luckyColors(an.yongShen, daily);
    var todayScores = dailyDomainScores(c, an, daily, dailyFavor.score);

    var todayCard = el('div', { class: 'card today-card' }, [
      el('div', { class: 'v2-card-head' }, [
        el('div', {}, [
          el('span', { class: 'v2-kicker' }, ['今日运势']),
          el('h3', {}, [daily.date + ' · ', gzSpan(daily.ganzhi)])
        ]),
        verdictBadge(dailyFavor.verdict)
      ]),
      el('p', { class: 'today-summary' }, [dailySummary(daily, dailyFavor, an)]),
      scoreGrid(todayScores),
      el('div', { class: 'lucky-colors' }, [
        el('span', { class: 'lucky-label' }, ['幸运颜色']),
        el('div', { class: 'color-swatches' }, colors.map(function (color) {
          return el('span', { class: 'color-chip' }, [
            el('i', { style: 'background:' + color.hex }),
            color.name
          ]);
        }))
      ]),
      el('p', { class: 'method-caption' }, ['今日项根据当日干支对本盘喜忌的增量计算，仅表示当天节奏。'])
    ]);
    section.appendChild(todayCard);

    var matchBox = el('div', { class: 'match-result', 'aria-live': 'polite' });
    var mb = state.matchBirth;
    var matchDate = el('input', { type: 'date', value: pad4(mb.year) + '-' + pad(mb.month) + '-' + pad(mb.day) });
    var matchTime = el('input', { type: 'time', value: pad(mb.hour) + ':' + pad(mb.minute) });
    var matchCalendar = el('select', {}, [
      el('option', { value: 'solar' }, ['公历']),
      el('option', { value: 'lunar' }, ['农历'])
    ]);
    matchCalendar.value = mb.calendar || 'solar';
    var matchGender = el('select', {}, [
      el('option', { value: 'female' }, ['女']),
      el('option', { value: 'male' }, ['男'])
    ]);
    matchGender.value = mb.gender || 'female';
    var matchLeap = el('input', { type: 'checkbox' });
    matchLeap.checked = !!mb.leapMonth;
    var matchLeapLabel = el('label', { class: 'match-check' }, [matchLeap, el('span', {}, ['闰月'])]);
    matchLeapLabel.style.display = matchCalendar.value === 'lunar' ? '' : 'none';
    matchCalendar.addEventListener('change', function () {
      matchLeapLabel.style.display = matchCalendar.value === 'lunar' ? '' : 'none';
    });

    var matchCard = el('div', { class: 'card match-card' }, [
      el('div', { class: 'v2-card-head' }, [
        el('div', {}, [
          el('span', { class: 'v2-kicker' }, ['双人合盘']),
          el('h3', {}, ['输入对方出生信息'])
        ])
      ]),
      el('div', { class: 'match-form' }, [
        compactField('历法', matchCalendar),
        compactField('出生日期', matchDate),
        compactField('出生时间', matchTime),
        compactField('性别', matchGender),
        matchLeapLabel
      ]),
      el('button', { class: 'btn secondary', onclick: function () {
        mb.year = +matchDate.value.slice(0, 4);
        mb.month = +matchDate.value.slice(5, 7);
        mb.day = +matchDate.value.slice(8, 10);
        mb.hour = +matchTime.value.slice(0, 2);
        mb.minute = +matchTime.value.slice(3, 5);
        mb.calendar = matchCalendar.value;
        mb.leapMonth = matchCalendar.value === 'lunar' && matchLeap.checked;
        renderMatchResult(matchBox, c, an, mb);
      } }, ['生成合盘']),
      matchBox
    ]);
    section.appendChild(matchCard);

    section.appendChild(el('div', { class: 'card poster-card' }, [
      el('div', {}, [
        el('span', { class: 'v2-kicker' }, ['分享海报']),
        el('h3', {}, ['生成命盘摘要图片']),
        el('p', {}, ['包含四柱、日主、五行结构和今日趋势，不包含完整隐私字段。'])
      ]),
      el('button', { class: 'icon-command', title: '生成并下载分享海报', onclick: function () {
        createSharePoster(c, an, daily, dailyFavor, colors);
      }, html: downloadIcon() + '<span>生成海报</span>' })
    ]));
  }

  function compactField(label, control) {
    return el('label', { class: 'compact-field' }, [
      el('span', {}, [label]),
      control
    ]);
  }

  function renderMatchResult(box, baseChart, baseAnalysis, birth) {
    try {
      var other = window.BaZiEngine.compute({
        year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, minute: birth.minute,
        calendar: birth.calendar, leapMonth: birth.leapMonth,
        gender: birth.gender, place: birth.place,
        trueSolarTime: false, longitude: birth.longitude, standardMeridian: birth.meridian
      });
      var otherAnalysis = window.BaZiAnalysis.analyze(other);
      var result = compatibilityResult(baseChart, baseAnalysis, other, otherAnalysis);
      state.matchResult = result;
      box.innerHTML = '';
      box.appendChild(el('div', { class: 'match-score' }, [
        el('strong', {}, [String(result.score)]),
        el('span', {}, ['/ 100']),
        el('em', {}, [result.label])
      ]));
      box.appendChild(el('div', { class: 'match-pillars' }, [
        el('span', {}, [baseChart.pillars[2].ganzhi]),
        el('i', {}, ['×']),
        el('span', {}, [other.pillars[2].ganzhi])
      ]));
      result.points.forEach(function (point) {
        box.appendChild(el('div', { class: 'match-point' }, [
          el('strong', {}, [point.title]),
          el('span', {}, [point.text])
        ]));
      });
      box.appendChild(el('p', { class: 'method-caption' }, ['合盘分数用于比较结构互动，不代表关系结果或承诺。']));
    } catch (error) {
      box.innerHTML = '';
      box.appendChild(el('p', { class: 'match-error' }, ['日期无法换算，请检查农历日期或闰月设置。']));
    }
  }

  function compatibilityResult(a, aa, b, ba) {
    var score = 58;
    var points = [];
    var gen = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
    var ke = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
    var aEl = a.dayMaster.element, bEl = b.dayMaster.element;
    if (aEl === bEl) {
      score += 8;
      points.push({ title: '日主关系', text: '双方同属' + aEl + '，理解方式接近，但也容易在相同问题上坚持。' });
    } else if (gen[aEl] === bEl || gen[bEl] === aEl) {
      score += 14;
      points.push({ title: '日主关系', text: '双方日主形成相生，一方的表达方式较容易转化为另一方需要的支持。' });
    } else if (ke[aEl] === bEl || ke[bEl] === aEl) {
      score -= 8;
      points.push({ title: '日主关系', text: '双方日主形成相克，吸引力和推动力并存，需要明确边界与决策方式。' });
    } else {
      points.push({ title: '日主关系', text: '双方日主没有直接生克，关系更依赖具体沟通和共同目标。' });
    }

    var relation = pairRelation(a.pillars[2].zhi, b.pillars[2].zhi);
    score += relation.score;
    points.push({ title: '日支互动', text: relation.text });

    var distance = a.fiveElements.reduce(function (sum, item, i) {
      return sum + Math.abs(item.percent - b.fiveElements[i].percent);
    }, 0);
    var similarity = Math.max(0, 100 - distance);
    score += Math.round((similarity - 50) * 0.18);
    points.push({ title: '五行结构', text: '双方五行结构相似度约 ' + similarity + '%。' +
      (similarity >= 70 ? '生活节奏和资源偏好较接近。' : '差异较明显，互补空间大，也需要更多磨合。') });

    var aFav = aa.yongShen.favorable.map(function (x) { return x.el; });
    var bFav = ba.yongShen.favorable.map(function (x) { return x.el; });
    var mutual = aFav.indexOf(bEl) >= 0 || bFav.indexOf(aEl) >= 0;
    if (mutual) score += 8;
    points.push({ title: '喜用互补', text: mutual
      ? '至少一方的日主五行落在另一方喜用范围内，现实合作时更容易形成补位。'
      : '双方日主没有直接落入彼此喜用范围，关系稳定更依赖共同规则和长期投入。' });

    score = Math.max(20, Math.min(96, score));
    return {
      score: score,
      label: score >= 82 ? '高协同性' : (score >= 68 ? '互补可发展' : (score >= 52 ? '需要磨合' : '结构张力较高')),
      points: points
    };
  }

  function pairRelation(a, b) {
    var pair = a + b, reverse = b + a;
    var maps = [
      { pairs: ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'], score: 13, name: '六合', text: '双方日支形成六合，日常相处中较容易建立默契与协作。' },
      { pairs: ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'], score: -14, name: '冲', text: '双方日支相冲，节奏和立场差异明显，适合提前约定冲突处理方式。' },
      { pairs: ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'], score: -8, name: '害', text: '双方日支有相害信号，误解往往来自没有说清的期待，需要提高沟通透明度。' }
    ];
    for (var i = 0; i < maps.length; i++) {
      if (maps[i].pairs.indexOf(pair) >= 0 || maps[i].pairs.indexOf(reverse) >= 0) return maps[i];
    }
    return { score: 2, name: '平', text: '双方日支没有直接六合、冲或害，关系质量更多由现实互动决定。' };
  }

  function favorElements(elements, ys) {
    var fav = ys.favorable.map(function (x) { return x.el; });
    var unfav = ys.unfavorable.map(function (x) { return x.el; });
    var score = 0;
    elements.forEach(function (e) {
      if (fav.indexOf(e) >= 0) score++;
      else if (unfav.indexOf(e) >= 0) score--;
    });
    return { score: score, verdict: score > 0 ? '有利' : (score < 0 ? '不利' : '平稳') };
  }

  function annualDomainScores(c, an, year) {
    var annual = window.BaZiEngine.annual(c, year);
    var favor = favorElements([annual.ganElement, annual.zhiElement], an.yongShen);
    return domainScores(c, annual.stemGod, annual.branchGod, favor.score);
  }

  function dailyDomainScores(c, an, daily, favorScore) {
    return domainScores(c, daily.stemGod, daily.branchGod, favorScore);
  }

  function domainScores(c, stemGod, branchGod, favorScore) {
    var gods = [stemGod, branchGod];
    function scoreFor(names) {
      var score = 3 + (favorScore > 0 ? 1 : (favorScore < 0 ? -1 : 0));
      gods.forEach(function (g) { if (names.indexOf(g) >= 0) score++; });
      return Math.max(1, Math.min(5, score));
    }
    return [
      { label: '事业', score: scoreFor(['正官', '七杀', '正印', '偏印']) },
      { label: '财运', score: scoreFor(['正财', '偏财', '食神']) },
      { label: '感情', score: scoreFor(['正财', '偏财', '正官', '七杀', '桃花']) },
      { label: '行动', score: scoreFor(['食神', '伤官', '比肩', '劫财']) }
    ];
  }

  function scoreGrid(scores) {
    return el('div', { class: 'score-grid' }, scores.map(function (item) {
      return el('div', { class: 'score-item' }, [
        el('span', {}, [item.label]),
        el('strong', { 'aria-label': item.score + ' 星' }, [stars(item.score)])
      ]);
    }));
  }

  function stars(count) {
    return '★★★★★'.slice(0, count) + '☆☆☆☆☆'.slice(0, 5 - count);
  }

  function luckyColors(ys, daily) {
    var map = {
      木: [{ name: '松柏绿', hex: '#4B9E7E' }, { name: '青竹色', hex: '#77A88D' }],
      火: [{ name: '朱砂红', hex: '#D9694E' }, { name: '珊瑚色', hex: '#E58B73' }],
      土: [{ name: '琥珀黄', hex: '#C9A35B' }, { name: '岩灰', hex: '#9B927F' }],
      金: [{ name: '银灰', hex: '#8C93A0' }, { name: '象牙白', hex: '#E8E5DC' }],
      水: [{ name: '靛青', hex: '#5B7FB0' }, { name: '深海蓝', hex: '#315C86' }]
    };
    var fav = ys.favorable.map(function (x) { return x.el; });
    var order = [daily.ganElement, daily.zhiElement].concat(fav);
    var chosen = [];
    order.forEach(function (e) {
      if (fav.indexOf(e) >= 0 && map[e]) map[e].forEach(function (color) {
        if (chosen.length < 3 && !chosen.some(function (x) { return x.name === color.name; })) chosen.push(color);
      });
    });
    if (!chosen.length && fav[0]) chosen = map[fav[0]].slice(0, 2);
    return chosen.slice(0, 3);
  }

  function dailySummary(daily, favor, an) {
    var action = favor.verdict === '有利'
      ? '适合推进重要事项，把注意力放在能形成实际结果的任务上。'
      : (favor.verdict === '不利' ? '适合降低并行任务数量，先处理边界、预算和沟通误差。' : '整体节奏中性，按既定计划稳定推进即可。');
    return '今日「' + daily.ganzhi + '」增强 ' + daily.ganElement + '、' + daily.zhiElement +
      '，相对本盘喜用「' + an.yongShen.favorable.map(function (x) { return x.el; }).join('、') +
      '」判断为「' + favor.verdict + '」。' + action;
  }

  function createSharePoster(c, an, daily, favor, colors) {
    var canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111111';
    ctx.font = '700 46px "PingFang SC", sans-serif';
    ctx.fillText('BaZi 命盘摘要', 76, 105);
    ctx.fillStyle = '#666666';
    ctx.font = '400 26px "PingFang SC", sans-serif';
    ctx.fillText(c.input.rawDate + '  ' + c.input.rawTime + '  ' + c.input.gender, 76, 154);
    ctx.fillStyle = '#4F46E5';
    ctx.font = '700 96px "PingFang SC", sans-serif';
    ctx.fillText(c.dayMaster.label, 76, 300);
    ctx.fillStyle = '#666666';
    ctx.font = '500 25px "PingFang SC", sans-serif';
    ctx.fillText('日主 · ' + c.dayMaster.yinyang + c.dayMaster.element, 80, 344);

    c.pillars.forEach(function (p, i) {
      var x = 76 + i * 232;
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, x, 408, 204, 220, 14);
      ctx.fillStyle = '#666666';
      ctx.font = '500 24px "PingFang SC", sans-serif';
      ctx.fillText(p.label, x + 24, 454);
      ctx.fillStyle = '#111111';
      ctx.font = '700 58px "PingFang SC", sans-serif';
      ctx.fillText(p.ganzhi, x + 42, 540);
      ctx.fillStyle = '#666666';
      ctx.font = '400 21px "PingFang SC", sans-serif';
      ctx.fillText(p.ganShiShen === '日主' ? '日主' : p.ganShiShen, x + 24, 588);
    });

    ctx.fillStyle = '#111111';
    ctx.font = '700 32px "PingFang SC", sans-serif';
    ctx.fillText('五行结构', 76, 712);
    c.fiveElements.forEach(function (item, i) {
      var y = 770 + i * 76;
      ctx.fillStyle = '#666666';
      ctx.font = '600 24px "PingFang SC", sans-serif';
      ctx.fillText(item.element, 76, y + 22);
      ctx.fillStyle = '#ECECEC';
      roundRect(ctx, 130, y, 720, 28, 14);
      ctx.fillStyle = elementHex(item.element);
      roundRect(ctx, 130, y, 720 * item.percent / 100, 28, 14);
      ctx.fillStyle = '#111111';
      ctx.fillText(item.percent + '%', 884, y + 23);
    });

    ctx.fillStyle = '#111111';
    ctx.font = '700 32px "PingFang SC", sans-serif';
    ctx.fillText('今日 · ' + daily.ganzhi, 76, 1190);
    ctx.fillStyle = '#666666';
    ctx.font = '400 24px "PingFang SC", sans-serif';
    wrapCanvasText(ctx, dailySummary(daily, favor, an), 76, 1242, 890, 38, 3);
    colors.forEach(function (color, i) {
      ctx.fillStyle = color.hex;
      ctx.beginPath();
      ctx.arc(80 + i * 178, 1382, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#666666';
      ctx.fillText(color.name, 108 + i * 178, 1391);
    });

    canvas.toBlob(function (blob) {
      if (!blob) return;
      var fileName = 'bazi-' + c.input.rawDate.replace(/\./g, '-') + '.png';
      if (navigator.share && navigator.canShare) {
        var file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'BaZi 命盘摘要' }).catch(function () {});
          return;
        }
      }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }, 'image/png');
  }

  function roundRect(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) return;
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    ctx.fill();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var line = '', lines = [];
    text.split('').forEach(function (ch) {
      var test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach(function (item, i) { ctx.fillText(item, x, y + i * lineHeight); });
  }

  function elementHex(element) {
    return { 木: '#4B9E7E', 火: '#D9694E', 土: '#C9A35B', 金: '#8C93A0', 水: '#5B7FB0' }[element] || '#4F46E5';
  }

  function renderPlainAnalysis(screen, c, an, showHeading) {
    var st = an.strength;
    var bl = an.balance;
    var topGods = c.tenGods.slice(0, 3).map(function (g) {
      return g.name + (g.count > 1 ? '×' + g.count : '');
    }).join('、') || '分布较均衡';
    var fav = an.yongShen.favorable.map(function (f) { return f.el; }).join('、');
    var unfav = an.yongShen.unfavorable.map(function (f) { return f.el; }).join('、');
    var nowYear = new Date().getFullYear();
    var current = null;
    c.luckCycle.forEach(function (d, i) {
      if (nowYear >= d.startYear && nowYear < d.startYear + 10) {
        current = { cycle: d, view: an.luck.cycles[i] };
      }
    });
    var annual = window.BaZiAnalysis.annualFavor(c, an.yongShen, state.year);
    var missing = bl.missing.length ? bl.missing.join('、') : '无明显缺项';
    var strengthBasis = st.reasons.slice(0, 3).join(' ');

    if (showHeading !== false) screen.appendChild(secHead('数据解读'));
    screen.appendChild(el('div', { class: 'card plain-analysis' }, [
      el('p', { class: 'plain-lead' }, [
        '这张盘可以先当作一份结构报告来看：日主是 ' + c.dayMaster.label +
        '，生扶力量约 ' + st.percent + '%，整体属于「' + st.band +
        '」。下面的结论按“结构强弱、五行比例、十神分布、周期变化”逐层推导，不把它当作确定性预测。'
      ]),
      el('div', { class: 'metric-grid' }, [
        metric('日主', c.dayMaster.label, c.dayMaster.yinyang + c.dayMaster.element, EL_CLASS[c.dayMaster.element]),
        metric('强弱', st.percent + '%', st.band, ''),
        metric('最旺', bl.strongest.element + ' ' + bl.strongest.percent + '%', '重心元素', EL_CLASS[bl.strongest.element]),
        metric('最弱', bl.weakest.element + ' ' + bl.weakest.percent + '%', missing, EL_CLASS[bl.weakest.element]),
        metric('喜用', fav || '流通', unfav ? '忌 ' + unfav : '忌神不重', ''),
        metric('当前运', current ? current.cycle.ganzhi : '未匹配', current ? current.view.verdict : '查看时间轴', '')
      ]),
      el('div', { class: 'confidence-summary' }, [
        el('span', { class: 'confidence-badge ' + an.confidence.level }, [an.confidence.label]),
        el('span', {}, ['整体推衍置信度：' + an.confidence.note])
      ]),
      plainPoint('强弱判断', '生扶与克泄耗的比例是核心判断口径：生扶 ' + st.support +
        '，克泄耗 ' + st.drain + '，因此落在「' + st.band + '」。这比只看日主所属五行更可靠。', strengthBasis),
      plainPoint('五行结构', '能量最集中在「' + bl.strongest.element + '」（' + bl.strongest.percent +
        '%），最少的是「' + bl.weakest.element + '」（' + bl.weakest.percent +
        '%），缺项判断为：' + missing + '。后续解读会优先看最旺元素是否继续被放大，以及最弱元素是否得到补充。', bl.note),
      plainPoint('十神模式', '出现较多的是 ' + topGods +
        '。十神用于观察行为模式：哪些动力反复出现，哪些动力不足；数量越集中，表现越稳定，也越容易形成偏向。', an.personality.summary),
      plainPoint('地支关系', an.relations.summary,
        '地支合冲刑害来自传统支神关系，本系统只作为辅助信号，不单独定吉凶。'),
      plainPoint('平衡取向', fav ? '当前更适合观察与「' + fav + '」相关的补充力量；需要少放大的元素是「' +
        (unfav || '不明显') + '」。这不是简单吉凶，而是结构平衡上的“加什么、减什么”。' :
        '当前结构较平衡，重点在保持五行流动，不需要过度强化某一种元素。', an.yongShen.note),
      plainPoint('周期', current
        ? '当前大运从 ' + current.cycle.startAge + ' 岁开始，为 ' + current.cycle.ganzhi +
          '，带来的五行为 ' + current.view.elements.join('、') + '，相对喜用评估为「' + current.view.verdict + '」。'
        : '当前未匹配到明确的大运区间，可横向滑动上方时间轴查看完整周期。', an.luck.summary),
      plainPoint('今年', state.year + ' 年的流年五行为 ' + annual.elements.join('、') +
        '，相对当前喜用取向为「' + annual.verdict + '」。如果流年与当前大运同向，体感会更明显；如果方向相反，则表现为拉扯。', '流年只看当年增量，大运看十年背景，两者需要一起读。')
    ]));

    if (an.inferences && an.inferences.domains && an.inferences.domains.length) {
      screen.appendChild(el('h3', { class: 'subsection-title' }, ['现实落点']));
      screen.appendChild(el('div', { class: 'domain-grid' },
        an.inferences.domains.map(function (dm) { return domainCard(dm); })
      ));
    }
  }

  function metric(label, value, note, cls) {
    return el('div', { class: 'metric' }, [
      el('div', { class: 'metric-label' }, [label]),
      el('div', { class: 'metric-value ' + (cls || '') }, [value]),
      el('div', { class: 'metric-note' }, [note || ''])
    ]);
  }

  function plainPoint(label, text, basis) {
    return el('div', { class: 'plain-point' }, [
      el('span', { class: 'plain-label' }, [label]),
      el('span', { class: 'plain-text' }, [
        text,
        basis ? el('span', { class: 'plain-basis' }, ['依据：' + basis]) : null
      ])
    ]);
  }

  function domainCard(dm) {
    var points = dm.points.filter(function (pt) { return !pt.note; }).slice(0, 3);
    if (!points.length) points = dm.points.slice(0, 2);
    return el('div', { class: 'card domain-card' }, [
      el('div', { class: 'domain-title' }, [dm.domain]),
      el('div', {}, points.map(function (pt) {
        return el('div', { class: 'domain-point' }, [
          el('div', { class: 'domain-text' }, [pt.text]),
          pt.basis && pt.basis.length
            ? el('div', { class: 'domain-basis' }, ['依据：' + pt.basis.join('；')])
            : null
        ]);
      }))
    ]);
  }

  function renderMeaningGuide(screen, c, an) {
    var annual = window.BaZiEngine.annual(c, state.year);
    var fav = window.BaZiAnalysis.annualFavor(c, an.yongShen, state.year);
    screen.appendChild(secHead('代表含义'));
    screen.appendChild(el('div', { class: 'meaning-grid' }, [
      meaningCard('四柱代表什么', c.pillars.map(function (p) {
        return meaningItem(p.label, p.ganzhi, pillarContext(p, an));
      })),
      meaningCard('五行代表什么', c.fiveElements.map(function (f) {
        return meaningItem(f.element, f.percent + '%', elementContext(f, c, an));
      })),
      meaningCard('十神代表什么', c.tenGods.map(function (g) {
        return meaningItem(g.name, g.count > 1 ? '×' + g.count : '出现', tenGodContext(g, c));
      })),
      meaningCard('周期符号代表什么', [
        meaningItem('大运', '10年', luckContext(currentLuck(c, an))),
        meaningItem('流年', annual.ganzhi, state.year + ' 年为「' + annual.ganzhi + '」，天干为「' + annual.stemGod +
          '」，地支主气为「' + annual.branchGod + '」。落到此盘，是在十年大运背景上叠加 ' + fav.elements.join('、') +
          '，系统判断为「' + fav.verdict + '」。'),
        meaningItem('↑', '增强', '在此盘的流年卡里，↑ 表示 ' + fav.elements.join('、') +
          ' 被当年加强；因为此盘喜用为「' + an.yongShen.favorable.map(function (f) { return f.el; }).join('、') +
          '」，所以增强是否有利，要看增强的是喜用还是忌神。'),
        meaningItem(fav.verdict, fav.elements.join('、'), (VERDICT_MEANING[fav.verdict] || '') +
          ' 此盘今年加强的是 ' + fav.elements.join('、') + '，因此落点是「' + fav.verdict + '」。')
      ])
    ]));
  }

  function meaningCard(title, items) {
    return el('div', { class: 'card meaning-card' }, [
      el('div', { class: 'meaning-title' }, [title]),
      el('div', {}, items)
    ]);
  }

  function meaningItem(label, value, text) {
    return el('div', { class: 'meaning-item' }, [
      el('div', { class: 'meaning-k' }, [
        el('span', { class: 'meaning-label' }, [label]),
        el('span', { class: 'meaning-value' }, [value])
      ]),
      el('div', { class: 'meaning-text' }, [text])
    ]);
  }

  function elementLevelText(percent) {
    if (percent >= 30) return '属于明显偏强，需要看是否继续被大运或流年放大。';
    if (percent <= 10) return '属于明显偏弱，需要看是否得到喜用或周期补充。';
    return '处在中间区间，更多起到配合与流通作用。';
  }

  function elementConclusion(f, role) {
    var level = f.percent >= 30 ? '很突出' : (f.percent <= 10 ? '明显不足' : '有一定存在感');
    var effect = role === '喜用' ? '能补盘、能修复状态' : (role === '忌神' ? '容易形成消耗或压力' : '主要起背景配合作用');
    return level + '，' + effect;
  }

  function pillarTopic(label) {
    return {
      年柱: '早年家庭、家族背景、外部资源和社会起点',
      月柱: '成长环境、职业底色、能力形成和事业框架',
      日柱: '本人核心、亲密关系、内在稳定感',
      时柱: '后期发展、子女/作品、长期目标和成果输出'
    }[label] || '对应柱位事项';
  }

  function tenGodConclusion(name, count) {
    var many = count >= 2;
    var map = {
      比肩: many ? '自我意识和独立性明显，遇事倾向自己扛、自己判断。' : '有独立判断，但不是最主导的性格来源。',
      劫财: many ? '行动力和竞争心强，资源、人脉、合伙议题会比较显眼。' : '有冲劲和社交竞争意识，但影响偏局部。',
      食神: many ? '表达、审美、输出和生活感比较明显，适合稳定产出型能力。' : '有温和输出和才华表现，但需要被运势或环境触发。',
      伤官: many ? '才华外露、表达欲强，不喜欢被束缚，容易靠专业输出打开局面。' : '有突破和表达信号，但不一定持续主导。',
      正财: many ? '现实感、责任感和经营意识强，重视稳定回报和可控资源。' : '有现实收益意识，但要看落点决定表现强弱。',
      偏财: many ? '资源调度、人脉机会和市场敏感度明显，财来得更灵活。' : '有机会财信号，但不是全局主线。',
      正官: many ? '规则、责任和职位意识明显，适合制度化、管理型或专业规范环境。' : '有责任和规则意识，但影响偏局部。',
      七杀: many ? '竞争压力和决断力强，适合高压、开创或需要执行力的场景。' : '有压力和冲劲信号，需要结合所在柱位看。',
      正印: many ? '学习、资质、贵人和保护力明显，适合靠知识和专业背书发展。' : '有学习和保护信号，但需要持续积累。',
      偏印: many ? '洞察力、技术感和非标准路径明显，适合研究、专业化或冷门能力。' : '有独特思考和技术倾向，但影响偏局部。'
    };
    return map[name] || '这个关系模式在盘中形成一个可观察的行为倾向。';
  }

  function changshengConclusion(label, stage) {
    var topic = pillarTopic(label);
    var map = {
      长生: topic + '有生发和恢复力，适合从新机会中起势。',
      沐浴: topic + '变化感强，容易受外界影响，也有吸引力和不稳定性。',
      冠带: topic + '逐渐成形，适合通过身份、规范和包装建立优势。',
      临官: topic + '执行力较强，能落到现实能力或职位表现上。',
      帝旺: topic + '力量很旺，容易成为主导点，也要避免过度强势。',
      衰: topic + '需要收敛和调整，适合保守推进。',
      病: topic + '有阻滞或压力，需要修复和管理。',
      死: topic + '活性较低，不宜硬推，适合结束旧模式。',
      墓: topic + '偏收藏和沉淀，资源不一定外露，但有积累性。',
      绝: topic + '容易有断裂或转换，旧路径不宜强行延续。',
      胎: topic + '处在酝酿期，有潜力但尚未完全成形。',
      养: topic + '适合培养和准备，靠长期铺垫见效。'
    };
    return map[stage] || topic + '呈现出这个阶段对应的气势状态。';
  }

  function roleEffect(role) {
    if (role === '喜用') return '补充和修复';
    if (role === '忌神') return '增加压力或消耗';
    return '提供背景气质';
  }

  function overallConclusion(c, an, current, annual) {
    var topGods = c.tenGods.slice(0, 3).map(function (g) { return g.name; }).join('、');
    var fav = an.yongShen.favorable.map(function (f) { return f.el; }).join('、');
    var strongest = an.balance.strongest;
    var currentText = current ? '当前大运为' + current.cycle.ganzhi + '，判断为「' + current.view.verdict + '」' : '当前大运不明显';
    return '整体结论：这是一个「' + an.strength.band + '」的' + c.dayMaster.label + '盘，核心不是盲目追求更强，而是用「' +
      fav + '」来补足日主、稳定结构。盘里' + strongest.element + '最旺，' + topGods +
      '最显眼，说明这个人一方面有明显的表达/规则/资源议题，另一方面真正能让状态变好的，是学习吸收、恢复力、贵人资源和自我根气。' +
      currentText + '；' + state.year + '流年为「' + annual.verdict + '」。所以现实建议是：先稳住专业能力和身体/情绪恢复，再推进事业与财富，不适合在压力年份里硬冲。';
  }

  function nayinImpact(label, value, an) {
    var e = nayinElement(value);
    var role = e ? elementRole(e, an) : '辅助';
    var place = pillarTopic(label);
    var base = '';
    if (label === '年柱') base = '会影响早年家庭氛围、外部资源和社会起点。';
    else if (label === '月柱') base = '会影响成长路径、职业底色和能力形成方式。';
    else if (label === '日柱') base = '会影响自我感、亲密关系和内在稳定感。';
    else base = '会影响后期发展、长期目标、作品输出和成果沉淀。';

    var roleText = role === '喜用'
      ? '这层气质对本人有补益，相关领域更容易成为支撑点。'
      : (role === '忌神' ? '这层气质容易带来压力或消耗，相关领域需要节制。' : '这层气质更多是背景，不是主要矛盾。');

    var concrete = '';
    if (e === '木') concrete = '表现为学习力、成长性、适应和柔韧度被强调。';
    else if (e === '火') concrete = '表现为表达欲、曝光度、审美和行动热度被强调。';
    else if (e === '土') concrete = '表现为现实责任、承载、稳定和资源沉淀被强调。';
    else if (e === '金') concrete = '表现为规则、判断、边界、技术和决断被强调。';
    else if (e === '水') concrete = '表现为信息、流动、沟通、迁移和恢复能力被强调。';

    return label + '纳音「' + value + '」落在' + place + '，' + base + concrete + roleText;
  }

  function shenshaImpact(s) {
    var where = s.pillars.join('、');
    var topic = s.pillars.map(function (label) { return pillarTopic(label); }).join('；');
    var map = {
      天乙贵人: '贵人和解决问题的机会会出现在这些领域，遇到阻力时更容易有人拉一把。',
      文昌贵人: '学习、考试、写作、表达、证书和专业能力是可用优势。',
      禄神: '稳定资源、职位收益和可持续收入感较强。',
      羊刃: '冲劲和硬度很强，适合攻坚，但也容易急、硬、冒风险。',
      桃花: '人际吸引力、审美、社交曝光和关系机会更明显。',
      驿马: '迁移、出差、跨城市发展、行业变化或流动型机会更明显。',
      华盖: '独立研究、审美、精神性、专业深耕和冷门能力更突出。',
      将星: '组织力、掌控感和带队能力更容易被看见。'
    };
    return '「' + s.name + '」落在' + where + '，作用领域是' + topic + '。' +
      (map[s.name] || '它给对应领域增加一层辅助象意。') +
      '这些领域的表现会比普通情况更突出，需要放进整体强弱和运势里一起判断。';
  }

  function palaceConclusion(label, gz, c, an) {
    var chars = (gz || '').split('');
    var gan = chars[0], zhi = chars[1];
    var ganRole = GAN_WX[gan] ? elementRole(GAN_WX[gan], an) : '辅助';
    var zhiRole = ZHI_WX[zhi] ? elementRole(ZHI_WX[zhi], an) : '辅助';
    var score = (ganRole === '喜用' ? 1 : ganRole === '忌神' ? -1 : 0) + (zhiRole === '喜用' ? 1 : zhiRole === '忌神' ? -1 : 0);
    if (label === '胎元') {
      if (score > 0) return '胎元「' + gz + '」对底层气质有补益，说明先天恢复力、学习吸收或内在支撑并不差，遇到合适环境能慢慢起势。';
      if (score < 0) return '胎元「' + gz + '」带来底层压力，说明先天敏感点在安全感、稳定性或早期资源承接上，需要靠后天环境补足。';
      return '胎元「' + gz + '」偏中性，底层气质不构成主要矛盾，更多看日主强弱和大运流年。';
    }
    if (score > 0) return '命宫「' + gz + '」对外在人生主题有帮助，说明对外呈现、社会定位和人生方向更容易获得支撑。';
    if (score < 0) return '命宫「' + gz + '」带来外部压力，说明社会定位、职业选择或对外关系容易有消耗，需要更清晰的边界和节奏。';
    return '命宫「' + gz + '」偏中性，外在人生主题不极端，主要随大运流年起伏。';
  }

  function elementRole(element, an) {
    var fav = an.yongShen.favorable.some(function (f) { return f.el === element; });
    var unfav = an.yongShen.unfavorable.some(function (f) { return f.el === element; });
    if (fav) return '喜用';
    if (unfav) return '忌神';
    return '中性';
  }

  function elementContext(f, c, an) {
    var role = elementRole(f.element, an);
    var isDay = f.element === c.dayMaster.element;
    var parts = [];
    parts.push(f.element + '在这个盘里' + elementConclusion(f, role) + '。');
    if (isDay) parts.push('它直接对应本人核心能量，说明自我修复、学习成长和方向感是关键底盘。');
    if (role === '喜用' && f.percent <= 15) parts.push('后续走到' + f.element + '运或' + f.element + '年时，容易补短板、恢复状态。');
    if (role === '忌神' && f.percent >= 25) parts.push('再遇到' + f.element + '被加强时，容易把压力、消耗或失衡放大。');
    if (role === '喜用' && f.percent >= 25) parts.push('它已经能用，重点是稳定发挥，而不是继续堆高。');
    if (role === '忌神' && f.percent <= 15) parts.push('它虽为忌，但占比低，不是主要矛盾。');
    return parts.join('');
  }

  function pillarContext(p, an) {
    var ganRole = elementRole(p.ganElement, an);
    var zhiEl = ZHI_WX[p.zhi];
    var zhiRole = elementRole(zhiEl, an);
    var hidden = p.hidden.map(function (h) { return h.shishen; }).filter(Boolean);
    var positive = (ganRole === '喜用' ? 1 : 0) + (zhiRole === '喜用' ? 1 : 0);
    var pressure = (ganRole === '忌神' ? 1 : 0) + (zhiRole === '忌神' ? 1 : 0);
    var topic = pillarTopic(p.label);
    var result;
    if (p.label === '年柱') {
      result = positive > pressure ? '早年家庭和外部资源对本人有托举，容易较早接触到可用资源或支持。'
        : pressure > positive ? '早年环境带来的压力感较强，家族资源或外部期待容易形成消耗。'
        : '早年环境有助力也有压力，外部资源不是纯顺，需要筛选后才能真正为自己所用。';
    } else if (p.label === '月柱') {
      result = positive > pressure ? '成长路径和职业底色有可用支撑，学习吸收、专业积累或贵人资源能帮到事业。'
        : pressure > positive ? '事业底色带压，成长阶段容易被规则、竞争或输出消耗推着走。'
        : '职业底色一半是资源一半是压力，适合在专业能力和稳定规则之间找平衡。';
    } else if (p.label === '日柱') {
      result = positive > pressure ? '本人核心稳定感较强，亲密关系和自我恢复能力能成为支撑点。'
        : pressure > positive ? '本人内在容易有压力或消耗感，亲密关系和自我状态需要主动维护。'
        : '自我核心既有支撑也有拉扯，关系与个人状态会互相影响。';
    } else {
      result = positive > pressure ? '后期发展、作品输出和长期规划有可用助力，越往后越适合把能力沉淀成成果。'
        : pressure > positive ? '后期发展伴随竞争、压力或消耗，长期目标需要更强的节制和风险管理。'
        : '后期发展有机会也有压力，适合稳扎稳打，把输出变成可持续的成果。';
    }
    return result + ' 这一柱主要作用在' + topic + '；显性力量是' + (p.ganShiShen || '日主') +
      '，隐性力量包含' + hidden.join('、') + '，所以判断上要同时看外在表现和内部动机。';
  }

  function tenGodContext(g, c) {
    var loc = godLocations(g.name, c);
    var conclusion = tenGodConclusion(g.name, g.count);
    var strength = g.count >= 3 ? '这个模式很显眼，会成为行为惯性。'
      : (g.count === 2 ? '这个模式稳定存在，会在关键事项中反复出现。' : '这个信号较局部，要看它落在哪一柱。');
    return conclusion + strength + ' 具体落点在' + (loc.length ? loc.join('、') : '未定位') + '。';
  }

  function godLocations(name, c) {
    var out = [];
    c.pillars.forEach(function (p) {
      if (p.ganShiShen === name) out.push(p.label + '天干');
      p.hidden.forEach(function (h) {
        if (h.shishen === name) out.push(p.label + '藏干' + h.gan + (h.main ? '主气' : ''));
      });
    });
    return out;
  }

  function godOf(name, c) {
    var found = c.tenGods.filter(function (g) { return g.name === name; })[0];
    return found || { name: name, count: 1 };
  }

  function changshengContext(p) {
    return p.label + '的气势处在「' + p.diShi + '」：' + changshengConclusion(p.label, p.diShi) +
      ' 内部动力来自' + hiddenText(p) + '，所以这个位置的表现会带有这些十神的底层动机。';
  }

  function nayinContext(n, an) {
    return nayinImpact(n.label, n.value, an);
  }

  function kongwangContext(label, values, c) {
    if (!values || !values.length) return label + '未见空亡，这一项不是本盘重点。';
    var hits = c.pillars.filter(function (p) { return values.indexOf(p.zhi) >= 0; }).map(function (p) { return p.label + p.zhi; });
    var where = hits.length ? '实际触及本盘的' + hits.join('、') : '本盘四支未直接落入这些空亡支';
    var focus = label === '日柱' ? '本人核心、亲密关系、内在稳定感' : '早年环境、家族背景、外部资源';
    return focus + '存在“先虚后实、先迟后成”的倾向。' + where +
      '，所以这类事项不能只看有没有，更要看后续大运流年是否把它补起来。';
  }

  function luckContext(current) {
    if (!current) return '当前年份未匹配到明确大运区间，可查看时间轴。';
    return '此盘当前处于 ' + current.cycle.startAge + ' 岁起的「' + current.cycle.ganzhi + '」大运，带来 ' +
      current.view.elements.join('、') + '。系统判断为「' + current.view.verdict + '」：' +
      (VERDICT_MEANING[current.view.verdict] || '这是十年背景变量。');
  }

  function renderIntegratedReport(screen, c, an) {
    var current = currentLuck(c, an);
    var annual = window.BaZiAnalysis.annualFavor(c, an.yongShen, state.year);
    var fav = an.yongShen.favorable.map(function (f) { return f.el; }).join('、') || '流通';
    var unfav = an.yongShen.unfavorable.map(function (f) { return f.el; }).join('、') || '不明显';
    var strongest = an.balance.strongest;
    var weakest = an.balance.weakest;
    var dayElementStats = c.fiveElements.filter(function (f) { return f.element === c.dayMaster.element; })[0];
    var goodLuck = an.luck.cycles.filter(function (x) { return x.verdict === '有利'; }).slice(0, 4);
    var badLuck = an.luck.cycles.filter(function (x) { return x.verdict === '不利'; }).slice(0, 4);

    screen.appendChild(secHead('综合研判'));
    screen.appendChild(el('div', { class: 'card integrated-report' }, [
      el('p', { class: 'plain-lead' }, [
        overallConclusion(c, an, current, annual)
      ]),
      reportSection('1. 核心判断链', [
        reportItem('日主', '此盘日主为「' + c.dayMaster.label + '」，所有十神都围绕它计算。' +
          (dayElementStats ? elementContext(dayElementStats, c, an) : '') , '来自日柱天干。'),
        reportItem('月令', '月柱为 ' + c.pillars[1].ganzhi + '，代表季节和成长环境，是判断旺衰最关键的位置。' +
          ' 当前强弱结论为「' + an.strength.band + '」，生扶 ' + an.strength.support + '，克泄耗 ' + an.strength.drain + '。', an.strength.reasons[0]),
        reportItem('五行', '最旺是「' + strongest.element + '」' + strongest.percent + '%，最弱是「' + weakest.element + '」' + weakest.percent +
          '%。这说明结构重心在' + strongest.element + '，需要观察它是否继续被大运流年放大。', an.balance.note),
        reportItem('喜忌', '平衡取向为喜「' + fav + '」，忌「' + unfav + '」。大运、流年、行业取向、行动节奏，都优先看是否靠近这个方向。', an.yongShen.note)
      ]),
      reportSection('2. 四柱联动', c.pillars.map(function (p) {
        return reportItem(p.label + ' ' + p.ganzhi,
          pillarContext(p, an),
          '看' + p.label + '位置、显性十神和藏干组合。')
      })),
      reportSection('3. 藏干与十二长生', c.pillars.map(function (p) {
        return reportItem(p.label,
          changshengContext(p),
          '藏干：' + hiddenText(p))
      })),
      reportSection('4. 十神组合', c.tenGods.map(function (g) {
        return reportItem(g.name + (g.count > 1 ? ' ×' + g.count : ''),
          tenGodContext(g, c),
          '十神来自天干与各地支藏干相对日主的关系。')
      })),
      reportSection('5. 纳音', c.hidden.nayin.map(function (n) {
        return reportItem(n.label + ' ' + n.value,
          nayinContext(n, an),
          '看纳音五行、柱位和喜忌。')
      })),
      reportSection('6. 神煞', shenshaReportItems(c.hidden.shensha)),
      reportSection('7. 空亡、胎元、命宫', [
        reportItem('日柱空亡', kongwangContext('日柱', c.hidden.kongwang.day, c),
          '空亡支：' + (c.hidden.kongwang.day.join('、') || '无')),
        reportItem('年柱空亡', kongwangContext('年柱', c.hidden.kongwang.year, c),
          '空亡支：' + (c.hidden.kongwang.year.join('、') || '无')),
        reportItem('胎元', palaceConclusion('胎元', c.hidden.taiyuan, c, an),
          '胎元：' + c.hidden.taiyuan),
        reportItem('命宫', palaceConclusion('命宫', c.hidden.minggong, c, an),
          '命宫：' + c.hidden.minggong)
      ]),
      reportSection('8. 大运与流年联动', [
        reportItem('当前大运', current ? current.cycle.startAge + ' 岁起 ' + current.cycle.ganzhi + '，五行为 ' +
          current.view.elements.join('、') + '，判断为「' + current.view.verdict + '」。' : '当前未匹配到明确大运。',
          current ? VERDICT_MEANING[current.view.verdict] : '可查看大运时间轴。'),
        reportItem('有利阶段', goodLuck.length ? goodLuck.map(function (x) { return x.startAge + '岁起 ' + x.ganzhi; }).join('、') : '暂无明显有利阶段',
          '这些阶段更接近喜用方向，适合主动推进、修复短板或放大优势。'),
        reportItem('需稳阶段', badLuck.length ? badLuck.map(function (x) { return x.startAge + '岁起 ' + x.ganzhi; }).join('、') : '暂无明显不利阶段',
          '这些阶段更接近忌神方向，适合降低风险、保守决策、减少过度消耗。'),
        reportItem(state.year + ' 流年', '流年五行为 ' + annual.elements.join('、') + '，判断为「' + annual.verdict + '」。',
          '流年是年度增量，大运是十年背景；两者同向时感受更强，反向时表现为拉扯。')
      ]),
      reportSection('9. 能看的现实方向', an.inferences.domains.map(function (dm) {
        var points = dm.points.filter(function (pt) { return !pt.note; }).slice(0, 2);
        var text = points.map(function (pt) { return pt.text; }).join(' ');
        var basis = points.map(function (pt) { return (pt.basis || []).join('；'); }).filter(Boolean).join('；');
        return reportItem(dm.domain, text || '该方向以结构平衡为主，没有特别强烈的单一信号。', basis || '来自十神、五行、喜忌与神煞的综合判断。');
      }))
    ]));
  }

  function reportSection(title, items) {
    return el('div', { class: 'report-section' }, [
      el('div', { class: 'report-title' }, [title]),
      el('div', {}, items)
    ]);
  }

  function reportItem(label, text, basis) {
    var contextualText = /此盘|本盘|当前|落到|在此盘/.test(text) ? text : ('此盘中，' + text);
    return el('div', { class: 'report-item' }, [
      el('div', { class: 'report-label' }, [label]),
      el('div', { class: 'report-text' }, [
        contextualText,
        basis ? el('span', { class: 'report-basis' }, ['参考：' + basis]) : null
      ])
    ]);
  }

  function hiddenText(p) {
    return p.hidden.map(function (h) {
      return h.gan + h.element + '（' + h.shishen + (h.main ? '，主气' : '') + '）';
    }).join('、');
  }

  function shenshaReportItems(list) {
    if (!list.length) {
      return [reportItem('常见神煞', '此盘未见系统当前计算范围内的常见神煞，因此神煞不是本盘主要判断来源。', '核心仍以日主强弱、五行、十神、大运流年为主。')];
    }
    return list.map(function (s) {
      return reportItem(s.name,
        shenshaImpact(s),
        '据' + s.note + '推得。神煞在此盘只作象意加权，不越过强弱、喜忌和运势主线。');
    });
  }

  function nayinMeaning(value) {
    var e = nayinElement(value);
    return e ? NAYIN_ELEMENT_MEANING[e] : '它提供该柱的补充气质。';
  }

  function nayinElement(value) {
    return ['金', '木', '水', '火', '土'].filter(function (x) { return value.indexOf(x) >= 0; })[0];
  }

  function currentLuck(c, an) {
    var nowYear = new Date().getFullYear();
    var current = null;
    c.luckCycle.forEach(function (d, i) {
      if (nowYear >= d.startYear && nowYear < d.startYear + 10) {
        current = { cycle: d, view: an.luck.cycles[i] };
      }
    });
    return current;
  }

  function renderAnnual(box) {
    box.innerHTML = '';
    var a = window.BaZiEngine.annual(state.chart, state.year);
    box.appendChild(el('div', { class: 'year-pick' }, [
      el('button', { class: 'stepper', onclick: function () { state.year--; renderAnnual(box); } }, ['−']),
      el('div', {}, [
        el('div', { class: 'yr' }, [String(a.year)]),
        el('div', { class: 'ygz', style: 'text-align:center' }, [gzSpan(a.ganzhi)])
      ]),
      el('button', { class: 'stepper', onclick: function () { state.year++; renderAnnual(box); } }, ['+'])
    ]));
    var grid = el('div', { class: 'annual-grid' });
    a.trends.forEach(function (t) {
      grid.appendChild(el('div', { class: 'acell' }, [
        el('div', { class: 'ael ' + EL_CLASS[t.element] }, [t.element]),
        el('div', { class: 'atrend ' + t.trend }, [t.trend === 'up' ? '↑' : '→'])
      ]));
    });
    box.appendChild(grid);
    box.appendChild(el('div', { class: 'annual-gods' }, [
      el('span', { class: 'tag' }, ['天干 · ' + a.stemGod]),
      el('span', { class: 'tag' }, ['地支 · ' + a.branchGod])
    ]));
    // favorability vs the chart's 用神
    var fav = window.BaZiAnalysis.annualFavor(state.chart, state.analysis.yongShen, state.year);
    box.appendChild(el('div', { style: 'display:flex;justify-content:center;margin-top:12px' }, [verdictBadge(fav.verdict)]));
    box.appendChild(el('p', { class: 'caption', style: 'text-align:center;margin:8px 0 0' },
      ['本年五行 ' + fav.elements.join('·') + ' 对喜用「' + state.analysis.yongShen.favorable.map(function (f) { return f.el; }).join('') + '」而言：' + fav.verdict + '。']));
    box.appendChild(scoreGrid(annualDomainScores(state.chart, state.analysis, state.year)));
    var quickYear = document.getElementById('quick-year-summary');
    if (quickYear) {
      quickYear.querySelector('.summary-value').textContent = String(state.year);
      quickYear.querySelector('.summary-note').textContent = fav.verdict;
    }
  }

  // verdict badge: 有利 / 平稳 / 不利
  function verdictBadge(v) {
    var cls = v === '有利' ? 'good' : (v === '不利' ? 'bad' : 'flat');
    return el('span', { class: 'verdict ' + cls }, [v]);
  }

  // ---------- analysis section (rule-based, auditable) ----------
  function renderAnalysis(screen, c, an) {
    screen.appendChild(secHead('命理分析'));
    screen.appendChild(el('p', { class: 'caption disclaimer' }, [an.disclaimer]));
    screen.appendChild(methodSummaryCard(an));

    // 1. day-master strength
    var st = an.strength;
    var strBar = el('span', { class: 'fill-accent' });
    var strCard = analysisCard('日主旺衰', st.band + ' · ' + st.confidence.label, [
      el('div', { class: 'strength-meter' }, [
        el('div', { class: 'meter-track' }, [strBar]),
        el('div', { class: 'meter-labels' }, [
          el('span', {}, ['弱']), el('span', {}, ['中和']), el('span', {}, ['强'])
        ])
      ]),
      el('p', { class: 'an-note' }, ['生扶力量约占 ' + st.percent + '%（生扶 ' + st.support + ' ∶ 克泄耗 ' + st.drain + '）。']),
      el('p', { class: 'an-note' }, [st.modelNote])
    ], st.reasons);
    screen.appendChild(strCard);
    requestAnimationFrame(function () { setTimeout(function () { strBar.style.width = st.percent + '%'; }, 80); });

    // 2. 用神 / 喜忌
    var ys = an.yongShen;
    var favWrap = el('div', { class: 'tags' }, ys.favorable.map(function (f) {
      return el('span', { class: 'tag fav ' + EL_CLASS[f.el] }, [f.el + '（' + f.group + '）']);
    }));
    var unfavWrap = el('div', { class: 'tags' }, ys.unfavorable.map(function (f) {
      return el('span', { class: 'tag unfav' }, [f.el]);
    }));
    var ysBody = [
      el('div', { class: 'kv' }, [el('span', { class: 'k' }, ['喜用神']), favWrap]),
      el('div', { class: 'kv' }, [el('span', { class: 'k' }, ['忌神']), unfavWrap]),
      el('p', { class: 'an-note' }, [ys.note]),
      el('p', { class: 'an-note' }, ['置信度：' + ys.confidence.label + '。' + ys.confidence.note])
    ];
    (ys.extra || []).forEach(function (x) { ysBody.push(el('p', { class: 'an-note alt' }, [x])); });
    screen.appendChild(analysisCard('用神喜忌', '扶抑法', ysBody, [
      '用神依「' + an.strength.band + '」推定：' + ys.note,
      '喜用：' + ys.favorable.map(function (f) { return f.el + '(' + f.group + ')'; }).join('、') +
      '；忌神：' + ys.unfavorable.map(function (f) { return f.el; }).join('、') + '。'
    ]));

    // 3. 格局
    screen.appendChild(analysisCard('格局', an.geJu.name, [
      el('p', { class: 'an-note' }, [an.geJu.note]),
      el('p', { class: 'an-note' }, ['置信度：' + an.geJu.confidence.label + '。' + an.geJu.confidence.note])
    ]));

    // 4. branch relations
    screen.appendChild(analysisCard('地支关系', an.relations.confidence.label, [
      el('p', { class: 'an-note' }, [an.relations.summary])
    ], an.relations.items.length
      ? an.relations.items.map(function (item) { return item.text; })
      : ['未见明显合冲刑害成组关系。']));

    // 5. five-element balance
    var bl = an.balance;
    screen.appendChild(analysisCard('五行平衡', bl.strongest.element + ' 最旺', [
      el('p', { class: 'an-note' }, [bl.note])
    ]));

    // 6. personality
    var pe = an.personality;
    screen.appendChild(analysisCard('性格特质', '', [
      el('p', { class: 'an-note' }, [pe.summary]),
      el('div', {}, pe.traits.map(function (t) {
        return el('div', { class: 'trait' }, [
          el('span', { class: 'trait-god' }, [t.god + (t.count > 1 ? ' ×' + t.count : '')]),
          el('span', { class: 'trait-text' }, [t.text])
        ]);
      }))
    ]));

    // 7. career & wealth
    var ca = an.career;
    screen.appendChild(analysisCard('事业财富', '', [
      el('p', { class: 'an-note' }, [ca.note]),
      el('div', { class: 'tags', style: 'margin-top:8px' }, ca.directions.map(function (d) {
        return el('span', { class: 'tag' }, [d.god + ' · ' + d.text]);
      }))
    ]));

    // 8. luck-cycle reading
    screen.appendChild(analysisCard('大运走势', '', [
      el('p', { class: 'an-note' }, [an.luck.summary])
    ]));
  }

  // ---------- 推测 (inferences) — each point shows its 依据 ----------
  function renderInferences(screen, an) {
    var inf = an.inferences;
    if (!inf) return;
    screen.appendChild(secHead('推测与依据'));
    screen.appendChild(el('p', { class: 'caption disclaimer' }, [inf.disclaimer]));
    inf.domains.forEach(function (dm) {
      var card = el('div', { class: 'card infer-card' }, [
        el('div', { class: 'an-head' }, [el('span', { class: 'an-title' }, [dm.domain])])
      ]);
      dm.points.forEach(function (pt) {
        var node = el('div', { class: 'infer-point' + (pt.note ? ' note' : '') }, [
          el('div', { class: 'infer-text' }, [(pt.note ? '' : '· ') + pt.text])
        ]);
        if (pt.basis && pt.basis.length) {
          node.appendChild(el('div', { class: 'infer-basis' }, [
            el('span', { class: 'basis-tag' }, ['依据']),
            el('span', {}, [pt.basis.join('；')])
          ]));
        }
        card.appendChild(node);
      });
      screen.appendChild(card);
    });
  }

  function methodSummaryCard(an) {
    return el('div', { class: 'card method-summary' }, [
      el('div', { class: 'method-summary-head' }, [
        el('span', { class: 'an-title' }, ['整体推衍置信度']),
        el('span', { class: 'confidence-badge ' + an.confidence.level }, [an.confidence.label])
      ]),
      el('p', { class: 'an-note' }, [an.confidence.note]),
      el('p', { class: 'method-caption' }, ['置信度表示传统规则之间的一致程度，不代表科学验证概率。'])
    ]);
  }

  function sourceMethodology(an) {
    var root = el('div', { class: 'source-methodology' });
    root.appendChild(el('div', { class: 'source-confidence' }, [
      el('span', {}, ['整体置信度']),
      el('strong', {}, [an.confidence.label]),
      el('p', {}, [an.confidence.note])
    ]));

    root.appendChild(el('h3', { class: 'source-subtitle' }, ['方法边界']));
    root.appendChild(el('ul', { class: 'method-list' }, (an.methodology || []).map(function (note) {
      return el('li', {}, [note]);
    })));

    root.appendChild(el('h3', { class: 'source-subtitle' }, ['参考典籍与计算来源']));
    var list = el('div', { class: 'source-list' });
    (an.sources || []).forEach(function (source) {
      list.appendChild(el('a', {
        class: 'source-item',
        href: source.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      }, [
        el('span', { class: 'source-title' }, [source.title]),
        el('span', { class: 'source-focus' }, [source.focus]),
        el('span', { class: 'source-note' }, [source.note])
      ]));
    });
    root.appendChild(list);
    root.appendChild(el('p', { class: 'method-caption' }, [
      '典籍用于说明规则沿革和取法依据。不同版本、注本和流派可能存在差异，因此系统不把单条古诀直接当作确定结论。'
    ]));
    return root;
  }

  // a card with a title, optional pill, body nodes, and an optional reasoning <details>
  function analysisCard(title, pill, body, reasons) {
    var head = el('div', { class: 'an-head' }, [
      el('span', { class: 'an-title' }, [title]),
      pill ? el('span', { class: 'an-pill' }, [pill]) : null
    ]);
    var children = [head].concat(body);
    if (reasons && reasons.length) {
      children.push(el('details', { class: 'reasoning' }, [
        el('summary', {}, ['推理依据']),
        el('div', { class: 'reason-list' }, reasons.map(function (r) { return el('p', {}, [r]); }))
      ]));
    }
    return el('div', { class: 'card an-card' }, children);
  }

  // ---------- bottom sheet ----------
  function openSheet(p) {
    var hiddenStr = p.hidden.map(function (h) { return h.gan + '（' + h.shishen + '）'; }).join('，');
    var sheet = el('div', { class: 'sheet' }, [
      el('div', { class: 'grabber' }),
      el('div', { class: 'sheet-gz' }, [gzSpan(p.ganzhi)]),
      el('div', { class: 'sheet-sub' }, [p.label]),
      kvList([
        ['这一柱代表', PILLAR_MEANING[p.label] || '用于观察该时间位置对应的人生层面。'],
        ['天干', p.gan + '（' + p.ganYinYang + p.ganElement + '）'],
        ['天干含义', stemMeaning(p.gan, p.ganYinYang, p.ganElement, state.analysis)],
        ['天干十神', p.ganShiShen === '日主' ? '日主（元神）' : p.ganShiShen],
        ['十神含义', p.ganShiShen === '日主' ? '此处是日主，代表本盘本人核心，是所有十神关系的参照点。' : tenGodContext(godOf(p.ganShiShen, state.chart), state.chart)],
        ['地支', p.zhi + '（' + ZHI_WX[p.zhi] + '）'],
        ['地支含义', '此支为' + p.zhi + '，主' + ZHI_WX[p.zhi] + '，在本盘属「' + elementRole(ZHI_WX[p.zhi], state.analysis) + '」。' + (BRANCH_MEANING[p.zhi] || '')],
        ['藏干', hiddenStr],
        ['藏干含义', '藏干是地支内部隐藏的天干，代表不直接外露但会持续影响结构的潜在力量。'],
        ['十二长生', p.diShi],
        ['长生含义', changshengContext(p)]
      ])
    ]);
    var scrim = el('div', { class: 'sheet-scrim' });
    sheetRoot.innerHTML = '';
    sheetRoot.appendChild(scrim);
    sheetRoot.appendChild(sheet);
    requestAnimationFrame(function () { scrim.classList.add('show'); sheet.classList.add('show'); });
    function close() {
      scrim.classList.remove('show'); sheet.classList.remove('show');
      setTimeout(function () { sheetRoot.innerHTML = ''; }, 350);
    }
    scrim.addEventListener('click', close);
  }

  function stemMeaning(gan, yy, element, an) {
    var yyText = yy === '阳' ? '外放、主动、显性' : '内敛、细腻、持续';
    return gan + '属' + element + '，偏' + yyText + '。在此盘属「' + elementRole(element, an) + '」。' +
      (ELEMENT_MEANING[element] || '');
  }

  // ---------- small builders ----------
  function secHead(t) { return el('div', { class: 'sec-head' }, [el('h2', { class: 'section-title' }, [t])]); }
  function kvList(pairs) {
    return el('div', {}, pairs.map(function (p) {
      return el('div', { class: 'kv' }, [el('span', { class: 'k' }, [p[0]]), el('span', { class: 'v' }, [p[1]])]);
    }));
  }
  function nayinList(c, an) {
    return el('div', {}, c.hidden.nayin.map(function (n) {
      return el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, [n.label + ' · ' + n.value]),
        el('div', { class: 'swhere' }, [nayinImpact(n.label, n.value, an)])
      ]);
    }));
  }

  function shenshaList(list, c) {
    if (!list.length) return el('p', { class: 'caption' }, ['此盘未见系统当前计算范围内的常见神煞，神煞不是主要判断来源。']);
    return el('div', {}, list.map(function (s) {
      return el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, [s.name]),
        el('div', { class: 'swhere' }, [shenshaImpact(s)])
      ]);
    }));
  }

  function hiddenCoreList(c, an) {
    return el('div', {}, [
      el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, ['日柱空亡 · ' + (c.hidden.kongwang.day.join('、') || '无')]),
        el('div', { class: 'swhere' }, [kongwangContext('日柱', c.hidden.kongwang.day, c)])
      ]),
      el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, ['年柱空亡 · ' + (c.hidden.kongwang.year.join('、') || '无')]),
        el('div', { class: 'swhere' }, [kongwangContext('年柱', c.hidden.kongwang.year, c)])
      ]),
      el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, ['胎元 · ' + c.hidden.taiyuan]),
        el('div', { class: 'swhere' }, [palaceConclusion('胎元', c.hidden.taiyuan, c, an)])
      ]),
      el('div', { class: 'shensha-item' }, [
        el('div', { class: 'sname' }, ['命宫 · ' + c.hidden.minggong]),
        el('div', { class: 'swhere' }, [palaceConclusion('命宫', c.hidden.minggong, c, an)])
      ])
    ]);
  }
  function collapse(title, body, description) {
    return el('details', { class: 'collapse' }, [
      el('summary', {}, [
        el('span', { class: 'collapse-heading' }, [
          el('span', { class: 'collapse-title' }, [title]),
          description ? el('span', { class: 'collapse-description' }, [description]) : null
        ]),
        el('span', { class: 'chev', html: chevIcon() })
      ]),
      el('div', { class: 'cbody' }, [body])
    ]);
  }

  // ---------- animations ----------
  function animateNumber(node, target, suffix) {
    var dur = 900, start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(target * e) + (suffix || '');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- icons ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function pad4(n) { n = String(n); while (n.length < 4) n = '0' + n; return n; }
  function logoIcon() { return '<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="8" width="6" height="24" rx="2" fill="var(--accent)" opacity=".95"/><rect x="17" y="12" width="6" height="20" rx="2" fill="var(--accent)" opacity=".72"/><rect x="26" y="5" width="6" height="27" rx="2" fill="var(--accent)" opacity=".48"/><path d="M7 34h26" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity=".28"/></svg>'; }
  function moonIcon() { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'; }
  function sunIcon() { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>'; }
  function chevIcon() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'; }
  function historyIcon() { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>'; }
  function trashIcon() { return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>'; }
  function downloadIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>'; }

  function setupEmbedBridge() {
    if (!EMBED_MODE) return;
    var resizeQueued = false;
    function sendHeight() {
      resizeQueued = false;
      postEmbedMessage('bazi:resize', {
        height: Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))
      });
    }
    function queueHeight() {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(sendHeight);
    }
    new MutationObserver(queueHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
    if (window.ResizeObserver) new ResizeObserver(queueHeight).observe(document.body);
    window.addEventListener('load', queueHeight);
    window.addEventListener('message', function (event) {
      if (event.source !== window.parent || !event.data || event.data.source !== 'bazi-host') return;
      var message = event.data;
      if (message.type === 'bazi:setTheme') {
        setTheme(message.theme === 'dark' ? 'dark' : 'light');
      } else if (message.type === 'bazi:reset') {
        state.chart = null;
        state.analysis = null;
        renderForm();
      } else if (message.type === 'bazi:setBirth' || message.type === 'bazi:calculate') {
        if (message.birth && typeof message.birth === 'object') {
          Object.keys(state.birth).forEach(function (key) {
            if (message.birth[key] !== undefined) state.birth[key] = message.birth[key];
          });
        }
        if (message.type === 'bazi:calculate') compute();
        else renderForm();
      }
      queueHeight();
    });
    postEmbedMessage('bazi:ready', { version: '1.0.0' });
    queueHeight();
  }

  // ---------- boot the app ----------
  var requestedTheme = QUERY.get('theme');
  if (requestedTheme === 'dark') setTheme('dark');
  else if (requestedTheme === 'light') setTheme('light');
  else if (requestedTheme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  else {
    try { setTheme(EMBED_MODE ? 'light' : (localStorage.getItem('bazi-theme') || 'light')); } catch (e) { setTheme('light'); }
  }

  if (EMBED_MODE) {
    if (QUERY.get('autostart') === '1') compute();
    else if (EMBED_START === 'home') renderHome();
    else renderForm();
    setupEmbedBridge();
  } else {
    renderHome();
  }
})();
