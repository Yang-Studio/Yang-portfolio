/*
 * BaZi engine — a thin, transparent wrapper over lunar-javascript (6tail, MIT).
 * Turns a birth moment into a structured chart: four pillars, hidden stems,
 * ten gods, a weighted five-element distribution, the luck cycle, annual luck,
 * and the optional "hidden" sections (nayin / 12-stages / void / shensha).
 *
 * Nothing here is fortune-telling. It is a deterministic restatement of the
 * traditional Chinese calendar + the sexagenary (干支) system.
 */
(function (root) {
  'use strict';

  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // Stem -> element. Branch elements are derived from their main hidden stem.
  var GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  var YANG_GAN = { 甲: 1, 丙: 1, 戊: 1, 庚: 1, 壬: 1 };
  var ELEMENTS = ['木', '火', '土', '金', '水'];
  var EL_EN = { 木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water' };

  // Weighting scheme for the five-element distribution.
  // Each of the 4 stems contributes 1.0 to its element.
  // Each branch contributes through its hidden stems: main / mid / residual.
  var STEM_WEIGHT = 1.0;
  var HIDE_WEIGHT = [1.0, 0.5, 0.2];

  // --- classic shensha lookup tables (deterministic) ---
  // trine groups (三合) keyed by any member branch
  function trineKey(zhi) {
    if ('申子辰'.indexOf(zhi) >= 0) return '申子辰';
    if ('寅午戌'.indexOf(zhi) >= 0) return '寅午戌';
    if ('亥卯未'.indexOf(zhi) >= 0) return '亥卯未';
    return '巳酉丑';
  }
  var TAOHUA = { 申子辰: '酉', 寅午戌: '卯', 亥卯未: '子', 巳酉丑: '午' }; // 桃花/咸池
  var YIMA = { 申子辰: '寅', 寅午戌: '申', 亥卯未: '巳', 巳酉丑: '亥' };   // 驿马
  var HUAGAI = { 申子辰: '辰', 寅午戌: '戌', 亥卯未: '未', 巳酉丑: '丑' };  // 华盖
  var JIANGXING = { 申子辰: '子', 寅午戌: '午', 亥卯未: '卯', 巳酉丑: '酉' }; // 将星
  var TIANYI = { // 天乙贵人 by day stem -> two branches
    甲: '丑未', 戊: '丑未', 庚: '丑未', 乙: '子申', 己: '子申',
    丙: '亥酉', 丁: '亥酉', 壬: '卯巳', 癸: '卯巳', 辛: '午寅'
  };
  var WENCHANG = { 甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
  var LUSHEN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
  var YANGREN = { 甲: '卯', 丙: '午', 戊: '午', 庚: '酉', 壬: '子' }; // yang stems only

  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function dayOfYear(y, m, d) {
    var cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var n = cum[m - 1] + d;
    if (m > 2 && isLeap(y)) n += 1;
    return n;
  }
  // Equation of time, minutes (apparent − mean solar time).
  function equationOfTime(y, m, d) {
    var n = dayOfYear(y, m, d);
    var b = (2 * Math.PI * (n - 81)) / 364;
    return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  }

  // Largest-remainder rounding so percentages sum to exactly 100.
  function toPercents(values) {
    var total = values.reduce(function (a, b) { return a + b; }, 0);
    if (total <= 0) return values.map(function () { return 0; });
    var raw = values.map(function (v) { return (v / total) * 100; });
    var floors = raw.map(Math.floor);
    var used = floors.reduce(function (a, b) { return a + b; }, 0);
    var remainder = 100 - used;
    var order = raw
      .map(function (v, i) { return { i: i, frac: v - Math.floor(v) }; })
      .sort(function (a, b) { return b.frac - a.frac; });
    for (var k = 0; k < remainder; k++) floors[order[k % order.length].i] += 1;
    return floors;
  }

  function ganYinYang(gan) { return YANG_GAN[gan] ? '阳' : '阴'; }

  function compute(input) {
    var L = root.Solar ? root : (typeof require !== 'undefined' ? require('./lunar.js') : null);
    if (!L || !L.Solar) throw new Error('lunar-javascript not loaded');
    var Solar = L.Solar;
    var Lunar = L.Lunar;

    var y = input.year, mo = input.month, d = input.day,
      h = input.hour, mi = input.minute || 0;
    var sourceCalendar = input.calendar === 'lunar' ? 'lunar' : 'solar';
    var sourceLunar = null;

    if (sourceCalendar === 'lunar') {
      if (!Lunar) throw new Error('lunar-javascript Lunar API not loaded');
      var lunarMonth = input.leapMonth ? -Math.abs(mo) : mo;
      var lunarInput = Lunar.fromYmdHms(y, lunarMonth, d, h, mi, 0);
      var solarInput = lunarInput.getSolar();
      sourceLunar = {
        year: input.year,
        month: mo,
        day: d,
        leapMonth: !!input.leapMonth,
        display: input.year + '.' + pad(mo) + '.' + pad(d) + (input.leapMonth ? ' 闰月' : ''),
        solarDate: solarInput.getYear() + '.' + pad(solarInput.getMonth()) + '.' + pad(solarInput.getDay())
      };
      y = solarInput.getYear();
      mo = solarInput.getMonth();
      d = solarInput.getDay();
      h = solarInput.getHour();
      mi = solarInput.getMinute();
    }

    // --- true solar time correction ---
    var tst = null;
    if (input.trueSolarTime && typeof input.longitude === 'number') {
      var meridian = typeof input.standardMeridian === 'number' ? input.standardMeridian : 120;
      var meanCorr = (input.longitude - meridian) * 4;     // 4 min per degree from the zone meridian
      var eot = equationOfTime(y, mo, d);
      var totalMin = meanCorr + eot;                        // apparent solar = clock + corr + EoT
      var base = Solar.fromYmdHms(y, mo, d, h, mi, 0);
      var adj = Solar.fromJulianDay(base.getJulianDay() + totalMin / 1440);
      y = adj.getYear(); mo = adj.getMonth(); d = adj.getDay();
      h = adj.getHour(); mi = adj.getMinute();
      tst = { meanCorrection: meanCorr, equationOfTime: eot, totalMinutes: totalMin };
    }

    var solar = Solar.fromYmdHms(y, mo, d, h, mi, 0);
    var lunar = solar.getLunar();
    var ec = lunar.getEightChar();

    var ganzhi = { 年: ec.getYear(), 月: ec.getMonth(), 日: ec.getDay(), 时: ec.getTime() };
    var dayGan = ec.getDayGan();
    var dayElement = GAN_WX[dayGan];

    function pillar(label, gz, hideGans, shiZhi, diShi, shiGan) {
      var gan = gz.charAt(0), zhi = gz.charAt(1);
      var hidden = hideGans.map(function (g, i) {
        return { gan: g, element: GAN_WX[g], shishen: shiZhi[i] || '', main: i === 0 };
      });
      return {
        label: label, ganzhi: gz, gan: gan, zhi: zhi,
        ganElement: GAN_WX[gan], ganYinYang: ganYinYang(gan),
        ganShiShen: shiGan,            // '' / '日主' for the day pillar
        hidden: hidden, diShi: diShi
      };
    }

    var pillars = [
      pillar('年柱', ganzhi.年, ec.getYearHideGan(), ec.getYearShiShenZhi(), ec.getYearDiShi(), ec.getYearShiShenGan()),
      pillar('月柱', ganzhi.月, ec.getMonthHideGan(), ec.getMonthShiShenZhi(), ec.getMonthDiShi(), ec.getMonthShiShenGan()),
      pillar('日柱', ganzhi.日, ec.getDayHideGan(), ec.getDayShiShenZhi(), ec.getDayDiShi(), '日主'),
      pillar('时柱', ganzhi.时, ec.getTimeHideGan(), ec.getTimeShiShenZhi(), ec.getTimeDiShi(), ec.getTimeShiShenGan())
    ];

    // --- five-element distribution (weighted) ---
    var score = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    pillars.forEach(function (p) {
      score[p.ganElement] += STEM_WEIGHT;
      p.hidden.forEach(function (hg, i) {
        score[hg.element] += HIDE_WEIGHT[i] !== undefined ? HIDE_WEIGHT[i] : 0.2;
      });
    });
    var vals = ELEMENTS.map(function (e) { return score[e]; });
    var pcts = toPercents(vals);
    var fiveElements = ELEMENTS.map(function (e, i) {
      return { element: e, en: EL_EN[e], percent: pcts[i], score: Math.round(vals[i] * 10) / 10 };
    });

    // --- ten gods (unique, with counts) ---
    var tenCount = {};
    function addGod(g) { if (g && g !== '日主') tenCount[g] = (tenCount[g] || 0) + 1; }
    [ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ec.getTimeShiShenGan()].forEach(addGod);
    [ec.getYearShiShenZhi(), ec.getMonthShiShenZhi(), ec.getDayShiShenZhi(), ec.getTimeShiShenZhi()]
      .forEach(function (arr) { arr.forEach(addGod); });
    var tenGods = Object.keys(tenCount).map(function (k) { return { name: k, count: tenCount[k] }; })
      .sort(function (a, b) { return b.count - a.count; });

    // --- luck cycle (大运) ---
    var gender = input.gender === 'female' ? 0 : 1;
    var yun = ec.getYun(gender);
    var startSolar = yun.getStartSolar();
    var luckCycle = yun.getDaYun().filter(function (dy) { return dy.getStartAge() > 0 && dy.getGanZhi(); })
      .map(function (dy) {
        var gz = dy.getGanZhi();
        return {
          startAge: dy.getStartAge(), startYear: dy.getStartYear(),
          ganzhi: gz, gan: gz.charAt(0), zhi: gz.charAt(1),
          ganElement: GAN_WX[gz.charAt(0)]
        };
      });
    var startInfo = {
      years: yun.getStartYear(), months: yun.getStartMonth(), days: yun.getStartDay(),
      date: startSolar.getYear() + '.' + pad(startSolar.getMonth()) + '.' + pad(startSolar.getDay())
    };

    // --- hidden sections ---
    var branches = pillars.map(function (p) { return p.zhi; });
    var dayZhi = pillars[2].zhi, yearZhi = pillars[0].zhi;
    var shensha = computeShensha(pillars, dayGan, dayZhi, yearZhi);

    var hidden = {
      nayin: [
        { label: '年柱', value: ec.getYearNaYin() },
        { label: '月柱', value: ec.getMonthNaYin() },
        { label: '日柱', value: ec.getDayNaYin() },
        { label: '时柱', value: ec.getTimeNaYin() }
      ],
      changsheng: pillars.map(function (p) { return { label: p.label, value: p.diShi }; }),
      kongwang: { day: splitChars(ec.getDayXunKong()), year: splitChars(ec.getYearXunKong()) },
      shensha: shensha,
      taiyuan: ec.getTaiYuan(), minggong: ec.getMingGong()
    };

    return {
      input: {
        name: input.name || '',
        date: y + '.' + pad(mo) + '.' + pad(d),
        rawDate: input.year + '.' + pad(input.month) + '.' + pad(input.day),
        time: pad(h) + ':' + pad(mi),
        rawTime: pad(input.hour) + ':' + pad(input.minute || 0),
        gender: input.gender === 'female' ? '女' : '男',
        place: input.place || '',
        trueSolarTime: !!input.trueSolarTime,
        calendar: sourceCalendar,
        sourceLunar: sourceLunar
      },
      tst: tst,
      lunarDate: lunar.getYearInGanZhi() + '年 ' + lunar.getMonthInChinese() + '月 ' + lunar.getDayInChinese(),
      dayMaster: { gan: dayGan, element: dayElement, yinyang: ganYinYang(dayGan), label: dayGan + dayElement },
      pillars: pillars,
      fiveElements: fiveElements,
      tenGods: tenGods,
      luckCycle: luckCycle,
      luckStart: startInfo,
      hidden: hidden,
      gender: gender
    };
  }

  function computeShensha(pillars, dayGan, dayZhi, yearZhi) {
    var found = [];
    var labels = pillars.map(function (p) { return p.label; });
    var branches = pillars.map(function (p) { return p.zhi; });
    function mark(name, targetZhis, refNote) {
      var hits = [];
      branches.forEach(function (z, i) { if (targetZhis.indexOf(z) >= 0) hits.push(labels[i]); });
      if (hits.length) found.push({ name: name, pillars: hits, note: refNote });
    }
    var dayTrine = trineKey(dayZhi), yearTrine = trineKey(yearZhi);
    mark('天乙贵人', splitChars(TIANYI[dayGan] || ''), '日干');
    mark('文昌贵人', [WENCHANG[dayGan]], '日干');
    mark('禄神', [LUSHEN[dayGan]], '日干');
    if (YANGREN[dayGan]) mark('羊刃', [YANGREN[dayGan]], '日干');
    // trine-based: check against day branch group (and year group when different)
    mark('桃花', uniq([TAOHUA[dayTrine], TAOHUA[yearTrine]]), '日/年支');
    mark('驿马', uniq([YIMA[dayTrine], YIMA[yearTrine]]), '日/年支');
    mark('华盖', uniq([HUAGAI[dayTrine], HUAGAI[yearTrine]]), '日/年支');
    mark('将星', uniq([JIANGXING[dayTrine], JIANGXING[yearTrine]]), '日/年支');
    return found;
  }

  // Annual luck for one solar year, relative to the day master.
  function annual(chart, year) {
    var L = root.Solar ? root : (typeof require !== 'undefined' ? require('./lunar.js') : null);
    var Solar = L.Solar;
    var lunar = Solar.fromYmdHms(year, 6, 1, 12, 0, 0).getLunar();
    var ec = lunar.getEightChar();
    // year ganzhi by 立春
    var gz = lunar.getYearInGanZhiExact();
    var gan = gz.charAt(0), zhi = gz.charAt(1);
    var ganEl = GAN_WX[gan];
    // hidden main element of the year branch
    var solarBranch = Solar.fromYmdHms(year, 6, 1, 12, 0, 0).getLunar().getEightChar();
    var zhiHide = mainHiddenOfBranch(zhi);
    var zhiEl = GAN_WX[zhiHide];
    // ten-god of year stem & branch main vs day master
    var dayGan = chart.dayMaster.gan;
    var stemGod = shiShen(dayGan, gan);
    var branchGod = shiShen(dayGan, zhiHide);
    // which elements this year reinforces
    var boosted = {};
    boosted[ganEl] = true; boosted[zhiEl] = true;
    var trends = ELEMENTS.map(function (e) {
      return { element: e, en: EL_EN[e], trend: boosted[e] ? 'up' : 'flat' };
    });
    return {
      year: year, ganzhi: gz, gan: gan, zhi: zhi,
      ganElement: ganEl, zhiElement: zhiEl,
      stemGod: stemGod, branchGod: branchGod,
      trends: trends
    };
  }

  // Daily luck for one solar date, relative to the day master.
  function daily(chart, y, m, d) {
    var L = root.Solar ? root : (typeof require !== 'undefined' ? require('./lunar.js') : null);
    var Solar = L.Solar;
    var lunar = Solar.fromYmdHms(y, m, d, 12, 0, 0).getLunar();
    var ec = lunar.getEightChar();
    var gz = ec.getDay();
    var gan = gz.charAt(0), zhi = gz.charAt(1);
    var ganEl = GAN_WX[gan];
    var zhiHide = mainHiddenOfBranch(zhi);
    var zhiEl = GAN_WX[zhiHide];
    var dayGan = chart.dayMaster.gan;
    var boosted = {};
    boosted[ganEl] = true; boosted[zhiEl] = true;
    return {
      date: y + '.' + pad(m) + '.' + pad(d),
      ganzhi: gz, gan: gan, zhi: zhi,
      ganElement: ganEl, zhiElement: zhiEl,
      stemGod: shiShen(dayGan, gan),
      branchGod: shiShen(dayGan, zhiHide),
      trends: ELEMENTS.map(function (e) {
        return { element: e, en: EL_EN[e], trend: boosted[e] ? 'up' : 'flat' };
      })
    };
  }

  // Hidden main stem of a branch (for annual element).
  var BRANCH_MAIN = {
    子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊', 巳: '丙',
    午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬'
  };
  function mainHiddenOfBranch(zhi) { return BRANCH_MAIN[zhi]; }

  // Ten-god of `other` stem relative to `day` master.
  function shiShen(dayGan, other) {
    var di = GAN.indexOf(dayGan), oi = GAN.indexOf(other);
    var dEl = GAN_WX[dayGan], oEl = GAN_WX[other];
    var samePolarity = (YANG_GAN[dayGan] ? 1 : 0) === (YANG_GAN[other] ? 1 : 0);
    var order = ['木', '火', '土', '金', '水'];
    var di2 = order.indexOf(dEl), oi2 = order.indexOf(oEl);
    var rel = (oi2 - di2 + 5) % 5; // 0 same,1 we-generate,2 we-control,3 controls-us,4 generates-us
    var map = {
      0: samePolarity ? '比肩' : '劫财',
      1: samePolarity ? '食神' : '伤官',
      2: samePolarity ? '偏财' : '正财',
      3: samePolarity ? '七杀' : '正官',
      4: samePolarity ? '偏印' : '正印'
    };
    return map[rel];
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function splitChars(s) { return (s || '').split(''); }
  function uniq(a) { var o = {}; return a.filter(function (x) { return x && !o[x] && (o[x] = 1); }); }

  var api = { compute: compute, annual: annual, daily: daily, ELEMENTS: ELEMENTS, EL_EN: EL_EN, GAN_WX: GAN_WX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BaZiEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
