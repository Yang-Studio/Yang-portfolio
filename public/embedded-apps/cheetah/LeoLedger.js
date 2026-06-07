(() => {
  const { useEffect, useMemo, useState } = React;
  const KEY = "leoledger_jsx_v3";
  const CAT_ICONS = ["\u{1F35C}", "\u{1F354}", "\u2615", "\u{1F6D2}", "\u{1F6CD}\uFE0F", "\u{1F687}", "\u{1F697}", "\u2708\uFE0F", "\u{1F3E0}", "\u{1F4A1}", "\u{1F48A}", "\u{1F3E5}", "\u{1F3AC}", "\u{1F3AE}", "\u{1F4DA}", "\u{1F4AA}", "\u{1F436}", "\u{1F381}", "\u{1F4BC}", "\u{1F4B5}", "\u{1F4B0}", "\u{1F4C8}", "\u2702\uFE0F", "\u{1F9FE}", "\u{1F4E6}", "\u2764\uFE0F", "\u{1F30D}", "\u{1F455}", "\u{1F484}", "\u{1F377}"];
  const CAT_COLORS = ["#FF5A5F", "#3B82F6", "#A855F7", "#F59E0B", "#10B981", "#14B8A6", "#EC4899", "#8B5CF6", "#0EA5E9", "#F43F5E", "#22C55E", "#EAB308", "#00C805", "#9AA0AA"];
  const ACCOUNT_TYPES = [
    { id: "cash", label: "Cash", desc: "\u94B1\u5305\u3001\u73B0\u91D1", icon: "\u{1F4B5}", color: "#00C805", type: "\u73B0\u91D1" },
    { id: "current", label: "Current account", desc: "\u65E5\u5E38\u4EA4\u6613\u4E3B\u8D26\u6237", icon: "\u{1F3E6}", color: "#3B82F6", type: "\u73B0\u91D1" },
    { id: "overdraft", label: "Account with overdraft", desc: "\u5141\u8BB8\u900F\u652F\u7684\u652F\u7968\u8D26\u6237", icon: "\u{1F4B1}", color: "#3B82F6", type: "\u4FE1\u7528" },
    { id: "credit", label: "Credit card", desc: "\u94F6\u884C\u4FE1\u7528\u5361", icon: "\u{1F4B3}", color: "#A30E5B", type: "\u4FE1\u7528" },
    { id: "saving", label: "Saving account", desc: "\u6709\u5229\u606F\u7684\u94F6\u884C\u50A8\u84C4", icon: "\u{1F437}", color: "#14B8A6", type: "\u50A8\u84C4" },
    { id: "invest", label: "Investments", desc: "\u80A1\u7968\u3001ETF\u3001\u52A0\u5BC6\u8D27\u5E01\u7B49", icon: "\u{1F4C8}", color: "#F59E0B", type: "\u6295\u8D44" },
    { id: "other", label: "Other", desc: "\u4FDD\u9669\u3001\u8D37\u6B3E\u3001\u623F\u8D37\u7B49", icon: "\u{1F9FE}", color: "#8B5CF6", type: "\u5176\u4ED6" }
  ];
  function defaultCategories() {
    return [
      { id: "food", name: "\u9910\u996E", icon: "\u{1F35C}", color: "#FF5A5F", children: [
        { id: "food_grocery", name: "\u98DF\u6750\u91C7\u8D2D", children: [
          { id: "fg_kroger", name: "Kroger" },
          { id: "fg_costco", name: "Costco" },
          { id: "fg_whole", name: "Whole Foods" },
          { id: "fg_target", name: "Target" },
          { id: "fg_walmart", name: "Walmart" }
        ] },
        { id: "food_dineout", name: "\u5916\u5356&\u9910\u5385", children: [
          { id: "fd_chipotle", name: "Chipotle" },
          { id: "fd_delivery", name: "\u5916\u5356" },
          { id: "fd_restaurant", name: "\u9910\u5385" }
        ] },
        { id: "food_coffee", name: "\u5496\u5561&\u996E\u54C1", children: [] }
      ] },
      { id: "transit", name: "\u4EA4\u901A", icon: "\u{1F687}", color: "#3B82F6", children: [
        { id: "tr_taxi", name: "\u6253\u8F66" },
        { id: "tr_pub", name: "\u516C\u5171\u4EA4\u901A" },
        { id: "tr_fuel", name: "\u52A0\u6CB9" },
        { id: "tr_park", name: "\u505C\u8F66" },
        { id: "tr_trip", name: "\u957F\u9014\u51FA\u884C" }
      ] },
      { id: "shopping", name: "\u8D2D\u7269", icon: "\u{1F6CD}\uFE0F", color: "#A855F7", children: [
        { id: "sh_cloth", name: "\u670D\u9970" },
        { id: "sh_digital", name: "\u6570\u7801" },
        { id: "sh_beauty", name: "\u7F8E\u5986" },
        { id: "sh_daily", name: "\u65E5\u7528\u54C1" }
      ] },
      { id: "entertainment", name: "\u5A31\u4E50", icon: "\u{1F3AC}", color: "#F59E0B", children: [
        { id: "en_movie", name: "\u5F71\u97F3" },
        { id: "en_game", name: "\u6E38\u620F" },
        { id: "en_sub", name: "\u8BA2\u9605\u4F1A\u5458" },
        { id: "en_event", name: "\u6F14\u51FA\u95E8\u7968" }
      ] },
      { id: "home", name: "\u5C45\u5BB6", icon: "\u{1F3E0}", color: "#10B981", children: [
        { id: "ho_rent", name: "\u623F\u79DF" },
        { id: "ho_util", name: "\u6C34\u7535" },
        { id: "ho_net", name: "\u7F51\u7EDC" },
        { id: "ho_furn", name: "\u5BB6\u5C45" }
      ] },
      { id: "health", name: "\u5065\u5EB7", icon: "\u{1F48A}", color: "#14B8A6", children: [
        { id: "he_med", name: "\u533B\u7597" },
        { id: "he_fit", name: "\u5065\u8EAB" },
        { id: "he_drug", name: "\u836F\u54C1" }
      ] },
      { id: "income", name: "\u6536\u5165", icon: "\u{1F4B5}", color: "#00C805", income: true, children: [
        { id: "in_salary", name: "\u5DE5\u8D44" },
        { id: "in_bonus", name: "\u5956\u91D1" },
        { id: "in_reimb", name: "\u62A5\u9500" },
        { id: "in_side", name: "\u517C\u804C" },
        { id: "in_other", name: "\u5176\u4ED6\u6536\u5165" }
      ] },
      { id: "other", name: "\u5176\u4ED6", icon: "\u{1F4E6}", color: "#9AA0AA", children: [] }
    ];
  }
  function fillCats(nodes, parent) {
    return (Array.isArray(nodes) ? nodes : []).map((n) => {
      const node = {
        id: n.id || (parent ? parent.id + "_" : "c_") + Math.random().toString(36).slice(2, 7),
        name: n.name || "\u672A\u547D\u540D",
        icon: n.icon || (parent ? parent.icon : "\u{1F4E6}"),
        color: n.color || (parent ? parent.color : "#9AA0AA"),
        income: parent ? parent.income : !!n.income
      };
      node.children = fillCats(n.children || n.subs || [], node);
      return node;
    });
  }
  let CATEGORIES = fillCats(defaultCategories());
  let ACCOUNTS = [];
  function accountName(id) {
    const a = ACCOUNTS.find((x) => x.id === id);
    return a ? a.name : "\u8D26\u6237";
  }
  function signedAmount(t, acctId) {
    if (t.type === "income") return t.amount;
    if (t.type === "expense") return -t.amount;
    if (t.type === "transfer") {
      if (acctId && t.accountId === acctId) return -t.amount;
      if (acctId && t.toAccountId === acctId) return t.amount;
      return 0;
    }
    return 0;
  }
  function removeNode(nodes, id) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && removeNode(nodes[i].children, id)) return true;
    }
    return false;
  }
  function catPath(id, nodes = CATEGORIES, trail = []) {
    for (const n of nodes) {
      const t = trail.concat(n);
      if (n.id === id) return t;
      if (n.children && n.children.length) {
        const r = catPath(id, n.children, t);
        if (r) return r;
      }
    }
    return null;
  }
  function categoryById(id) {
    const pth = catPath(id);
    return pth ? pth[pth.length - 1] : CATEGORIES[CATEGORIES.length - 1];
  }
  function topCategory(id) {
    const pth = catPath(id);
    return pth ? pth[0] : CATEGORIES[CATEGORIES.length - 1];
  }
  function categoryName(id) {
    const pth = catPath(id);
    return pth ? pth.map((n) => n.name).join(" \xB7 ") : "\u5176\u4ED6";
  }
  function flattenCats(nodes = CATEGORIES, out = []) {
    (nodes || []).forEach((n) => {
      out.push(n);
      if (n.children) flattenCats(n.children, out);
    });
    return out;
  }
  function txCountForCat(transactions, id) {
    return transactions.filter((t) => {
      const pth = catPath(t.categoryId);
      return pth && pth.some((n) => n.id === id);
    }).length;
  }
  const LEVELS = [
    { lv: 1, title: "\u65B0\u624B\u8C79" },
    { lv: 5, title: "\u7406\u8D22\u5B66\u5F92" },
    { lv: 10, title: "\u9884\u7B97\u8FBE\u4EBA" },
    { lv: 20, title: "\u50A8\u84C4\u4E13\u5BB6" },
    { lv: 30, title: "\u6295\u8D44\u89C2\u5BDF\u5458" },
    { lv: 50, title: "\u8D22\u5BCC\u730E\u624B" }
  ];
  const MOOD = {
    happy: { label: "Happy", face: "\u{1F63A}", line: "\u4ECA\u5929\u63A7\u5236\u5F97\u4E0D\u9519\u3002" },
    concerned: { label: "Concerned", face: "\u{1F61F}", line: "\u5976\u8336\u9884\u7B97\u5FEB\u89C1\u5E95\u4E86\u3002" },
    angry: { label: "Angry", face: "\u{1F620}", line: "\u8FDE\u7EED\u8D85\u652F\u4E86\uFF0C\u6211\u4EEC\u8BA4\u771F\u770B\u4E00\u4E0B\u3002" },
    excited: { label: "Excited", face: "\u{1F606}", line: "\u8FD9\u5468\u6BD4\u4E0A\u5468\u7701\u4E0B\u4E86\u4E00\u4E9B\uFF0C\u7EE7\u7EED\u4FDD\u6301\uFF01" },
    running: { label: "Running", face: "\u{1F63C}", line: "\u8DDD\u79BB\u76EE\u6807\u53EA\u5DEE\u4E00\u6B65\uFF01" },
    sleeping: { label: "Sleeping", face: "\u{1F634}", line: "Leo \u5DF2\u7ECF\u7B49\u4F60\u597D\u51E0\u5929\u4E86\u3002" }
  };
  const ICONS = {
    home: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 10.5 12 4l8 6.5" }), /* @__PURE__ */ React.createElement("path", { d: "M6 10v10h12V10" }), /* @__PURE__ */ React.createElement("path", { d: "M12 13v4" }), /* @__PURE__ */ React.createElement("path", { d: "M9.5 15h5" })),
    add: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8v8M8 12h8" })),
    planning: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 8v5l3 2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M18.5 4.5 21 2" })),
    insights: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 20V10M10 20V4M16 20v-7M22 20H2" })),
    profile: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M8 12h.01M12 12h.01M16 12h.01" })),
    edit: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 20h9" }), /* @__PURE__ */ React.createElement("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" })),
    trash: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18" }), /* @__PURE__ */ React.createElement("path", { d: "M8 6V4h8v2" }), /* @__PURE__ */ React.createElement("path", { d: "M6 6l1 15h10l1-15" }), /* @__PURE__ */ React.createElement("path", { d: "M10 11v6M14 11v6" })),
    close: /* @__PURE__ */ React.createElement("path", { d: "M18 6 6 18M6 6l12 12" }),
    back: /* @__PURE__ */ React.createElement("path", { d: "m15 18-6-6 6-6" }),
    search: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "m20 20-3.5-3.5" }))
  };
  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function dateInputValue(d) {
    const x = new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  }
  function todayStr(d = /* @__PURE__ */ new Date()) {
    return dateInputValue(d);
  }
  function addDays(d, days) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }
  function nextDue(dateStr, repeat) {
    const d = new Date(dateStr);
    if (repeat === "\u6BCF\u5468") d.setDate(d.getDate() + 7);
    else if (repeat === "\u6BCF\u6708") d.setMonth(d.getMonth() + 1);
    else if (repeat === "\u6BCF\u5E74") d.setFullYear(d.getFullYear() + 1);
    else return null;
    return dateInputValue(d);
  }
  function monthStr(d) {
    const x = new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
  }
  function money(n) {
    return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function clone(x) {
    return typeof structuredClone === "function" ? structuredClone(x) : JSON.parse(JSON.stringify(x));
  }
  function seed() {
    const now = /* @__PURE__ */ new Date();
    const tx = [];
    const samples = [
      [12, "food", "\u5348\u996D", 0, "expense"],
      [8.5, "transit", "\u6253\u8F66", 0, "expense"],
      [28, "shopping", "\u4E70\u4E86\u4E00\u4EF6 T \u6064", 1, "expense"],
      [4.5, "food", "\u5976\u8336", 1, "expense"],
      [60, "entertainment", "\u7535\u5F71\u7968 x2", 2, "expense"],
      [15, "food", "\u665A\u996D", 2, "expense"],
      [3200, "income", "\u5DE5\u8D44\u5230\u8D26", 3, "income"],
      [120, "home", "\u6C34\u7535\u8D39", 4, "expense"],
      [9, "food", "\u65E9\u9910", 5, "expense"],
      [22, "transit", "\u5730\u94C1\u5145\u503C", 6, "expense"]
    ];
    samples.forEach((row, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - row[3]);
      tx.push({ id: "s" + i, amount: row[0], categoryId: row[1], accountId: "daily", note: row[2], date: dateInputValue(d), type: row[4] });
    });
    return {
      welcomed: true,
      categories: fillCats(defaultCategories()),
      transactions: tx,
      accounts: [
        { id: "daily", name: "\u65E5\u5E38", balance: 842.5, type: "\u73B0\u91D1", accType: "cash", icon: "\u{1F4B5}", color: "#00C805" },
        { id: "card", name: "\u4FE1\u7528\u5361", balance: 0, type: "\u4FE1\u7528", accType: "credit", icon: "\u{1F4B3}", color: "#A30E5B" },
        { id: "saving", name: "\u50A8\u84C4", balance: 0, type: "\u50A8\u84C4", accType: "saving", icon: "\u{1F3E6}", color: "#14B8A6" }
      ],
      budgets: [
        { id: "b1", categoryId: "food", amount: 600, month: monthStr(now) },
        { id: "b2", categoryId: "transit", amount: 200, month: monthStr(now) },
        { id: "b3", categoryId: "shopping", amount: 400, month: monthStr(now) }
      ],
      goals: [
        { id: "g1", name: "\u6362\u65B0\u624B\u673A", icon: "\u{1F4F1}", target: 1e3, saved: 850 },
        { id: "g2", name: "\u65C5\u884C\u57FA\u91D1", icon: "\u2708\uFE0F", target: 3e3, saved: 620 }
      ],
      planned: [
        { id: "p1", name: "\u623F\u79DF", amount: 1200, type: "expense", categoryId: "home", accountId: "daily", dueDate: dateInputValue(addDays(now, 4)), repeat: "\u6BCF\u6708" },
        { id: "p2", name: "Netflix", amount: 15.99, type: "expense", categoryId: "entertainment", accountId: "card", dueDate: dateInputValue(addDays(now, 9)), repeat: "\u6BCF\u6708" },
        { id: "p3", name: "\u5DE5\u8D44", amount: 3200, type: "income", categoryId: "income", accountId: "daily", dueDate: dateInputValue(addDays(now, 16)), repeat: "\u6BCF\u6708" }
      ],
      allocation: { income: null, buckets: [
        { id: "al_invest", name: "\u6295\u8D44", pct: 15, color: "#F59E0B" },
        { id: "al_save", name: "\u50A8\u84C4", pct: 30, color: "#14B8A6" },
        { id: "al_daily", name: "\u65E5\u5E38\u82B1\u9500", pct: 15, color: "#3B82F6" },
        { id: "al_fixed", name: "\u56FA\u5B9A\u5F00\u9500", pct: 40, color: "#A855F7" }
      ] },
      templates: [
        { id: "tpl1", name: "\u65E9\u9910", amount: 0, type: "expense", categoryId: "food", accountId: "daily", note: "\u65E9\u9910" },
        { id: "tpl2", name: "\u5496\u5561", amount: 0, type: "expense", categoryId: "food_coffee", accountId: "daily", note: "\u5496\u5561" },
        { id: "tpl3", name: "\u5730\u94C1", amount: 0, type: "expense", categoryId: "tr_pub", accountId: "daily", note: "\u5730\u94C1" },
        { id: "tpl4", name: "\u5DE5\u8D44", amount: 0, type: "income", categoryId: "in_salary", accountId: "daily", note: "\u5DE5\u8D44\u5230\u8D26" }
      ],
      mascot: { xp: 480, streakDays: 12, lastEntry: todayStr(now) },
      pro: false
    };
  }
  function normalize(raw) {
    const base = seed();
    const s = raw || base;
    const categories = Array.isArray(s.categories) && s.categories.length ? fillCats(s.categories) : base.categories;
    const allIds = new Set(flattenCats(categories).map((n) => n.id));
    return {
      welcomed: s.welcomed !== false,
      categories,
      transactions: Array.isArray(s.transactions) ? s.transactions.map((t) => ({
        id: t.id || uid("t"),
        amount: Number(t.amount) || 0,
        categoryId: t.subId && allIds.has(t.subId) ? t.subId : allIds.has(t.categoryId || t.category) ? t.categoryId || t.category : "other",
        accountId: t.accountId || "daily",
        toAccountId: t.toAccountId || null,
        note: t.note || "",
        date: dateInputValue(t.date || /* @__PURE__ */ new Date()),
        type: t.type === "transfer" ? "transfer" : t.type === "income" ? "income" : "expense"
      })) : base.transactions,
      accounts: Array.isArray(s.accounts) && s.accounts.length ? s.accounts.map((a) => ({
        id: a.id || uid("a"),
        name: a.name || "\u8D26\u6237",
        balance: Number(a.balance) || 0,
        type: a.type || "\u73B0\u91D1",
        accType: a.accType || "cash",
        icon: a.icon || "\u{1F4B0}",
        color: a.color || "#3B82F6"
      })) : base.accounts,
      budgets: Array.isArray(s.budgets) ? s.budgets : base.budgets,
      goals: Array.isArray(s.goals) ? s.goals : base.goals,
      planned: Array.isArray(s.planned) ? s.planned.map((p) => ({
        id: p.id || uid("p"),
        name: p.name || "",
        amount: Number(p.amount) || 0,
        type: p.type === "income" ? "income" : "expense",
        categoryId: p.subId && allIds.has(p.subId) ? p.subId : allIds.has(p.categoryId) ? p.categoryId : "other",
        accountId: p.accountId || "daily",
        dueDate: dateInputValue(p.dueDate || /* @__PURE__ */ new Date()),
        repeat: p.repeat || "\u4E00\u6B21"
      })) : base.planned,
      allocation: (() => {
        const a = s.allocation || base.allocation;
        return {
          income: a.income === null || a.income === void 0 ? null : Number(a.income) || 0,
          buckets: Array.isArray(a.buckets) && a.buckets.length ? a.buckets.map((b) => ({ id: b.id || uid("al"), name: b.name || "\u5206\u914D", pct: Number(b.pct) || 0, color: b.color || "#3B82F6" })) : base.allocation.buckets
        };
      })(),
      templates: Array.isArray(s.templates) ? s.templates.map((t) => ({
        id: t.id || uid("tpl"),
        name: t.name || "\u6A21\u677F",
        amount: Number(t.amount) || 0,
        type: t.type === "income" ? "income" : "expense",
        categoryId: allIds.has(t.categoryId) ? t.categoryId : "other",
        accountId: t.accountId || "daily",
        note: t.note || ""
      })) : base.templates,
      mascot: Object.assign({}, base.mascot, s.mascot || {}),
      pro: !!s.pro
    };
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? normalize(JSON.parse(raw)) : seed();
    } catch (e) {
      return seed();
    }
  }
  function buildMetrics(state) {
    const now = /* @__PURE__ */ new Date();
    const thisMonth = monthStr(now);
    const monthTx = state.transactions.filter((t) => monthStr(t.date) === thisMonth);
    const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    const monthIncome = monthTx.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const totalAssets = state.accounts.reduce((a, x) => a + Number(x.balance || 0), 0);
    const today0 = new Date(todayStr(now));
    const duePlans = state.planned.filter((p) => new Date(p.dueDate) <= today0).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const upcoming = state.planned.filter((p) => new Date(p.dueDate) > today0).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const next30 = upcoming.filter((p) => new Date(p.dueDate) <= addDays(now, 30));
    const plannedIncome = next30.filter((p) => p.type === "income").reduce((a, p) => a + p.amount, 0);
    const plannedExpense = next30.filter((p) => p.type === "expense").reduce((a, p) => a + p.amount, 0);
    const projectedBalance = totalAssets + plannedIncome - plannedExpense;
    const catSpend = {};
    monthTx.filter((t) => t.type === "expense").forEach((t) => {
      const top = topCategory(t.categoryId).id;
      catSpend[top] = (catSpend[top] || 0) + t.amount;
    });
    const budgets = state.budgets.map((b) => {
      const spent = monthTx.filter((t) => t.type === "expense" && (catPath(t.categoryId) || []).some((n) => n.id === b.categoryId)).reduce((a, t) => a + t.amount, 0);
      const pct = b.amount ? Math.round(spent / b.amount * 100) : 0;
      return { ...b, spent, pct };
    });
    const daysSince = Math.floor((new Date(todayStr(now)) - new Date(state.mascot.lastEntry || todayStr(now))) / 864e5);
    const over = budgets.filter((b) => b.pct >= 100).length;
    const near = budgets.filter((b) => b.pct >= 80 && b.pct < 100).length;
    let mood = "happy";
    if (daysSince >= 3) mood = "sleeping";
    else if (over >= 2) mood = "angry";
    else if (over || near) mood = "concerned";
    else if (monthIncome > 0 && (monthIncome - monthExpense) / monthIncome >= 0.25) mood = "excited";
    const li = levelInfo(state.mascot.xp || 0);
    return { now, thisMonth, monthTx, monthExpense, monthIncome, totalAssets, catSpend, budgets, daysSince, mood, li, net: monthIncome - monthExpense, duePlans, upcoming, next30, plannedIncome, plannedExpense, projectedBalance };
  }
  function levelInfo(xp) {
    const lv = Math.max(1, Math.floor(xp / 100) + 1);
    let title = LEVELS[0].title;
    LEVELS.forEach((x) => {
      if (lv >= x.lv) title = x.title;
    });
    const start = (lv - 1) * 100;
    return { lv, title, pct: Math.max(0, Math.min(100, Math.round((xp - start) / 100 * 100))), toNext: lv * 100 - xp };
  }
  function achievementState(state, metrics) {
    const txCount = state.transactions.length;
    const budgetOk = metrics.budgets.length && metrics.budgets.every((b) => b.pct <= 100);
    const goalDone = (state.goals || []).some((g) => g.target > 0 && g.saved >= g.target);
    return [
      { id: "first", icon: "\u{1F43E}", name: "\u7B2C\u4E00\u7B14", desc: "\u5B8C\u6210\u7B2C\u4E00\u7B14\u8BB0\u8D26", unlocked: txCount > 0 },
      { id: "ten", icon: "\u{1F4D2}", name: "\u8BB0\u8D26\u65B0\u624B", desc: "\u7D2F\u8BA1 10 \u7B14\u8D26\u5355", unlocked: txCount >= 10 },
      { id: "thirty", icon: "\u{1F4DA}", name: "\u8BB0\u8D26\u8FBE\u4EBA", desc: "\u7D2F\u8BA1 30 \u7B14\u8D26\u5355", unlocked: txCount >= 30 },
      { id: "week", icon: "\u{1F525}", name: "\u575A\u6301\u4E00\u5468", desc: "\u8FDE\u7EED\u8BB0\u8D26 7 \u5929", unlocked: state.mascot.streakDays >= 7 },
      { id: "budget", icon: "\u{1F3AF}", name: "\u9884\u7B97\u8FBE\u4EBA", desc: "\u9884\u7B97\u4ECD\u5728\u63A7\u5236\u5185", unlocked: budgetOk },
      { id: "goal", icon: "\u{1F3C6}", name: "\u76EE\u6807\u8FBE\u6210", desc: "\u5B8C\u6210\u4E00\u4E2A\u50A8\u84C4\u76EE\u6807", unlocked: goalDone },
      { id: "lv5", icon: "\u{1F406}", name: "\u7406\u8D22\u5B66\u5F92", desc: "\u8FBE\u5230 Lv.5", unlocked: metrics.li.lv >= 5 }
    ];
  }
  function App() {
    const [state, setState] = useState(loadState);
    CATEGORIES = state.categories;
    ACCOUNTS = state.accounts;
    const [tab, setTab] = useState("home");
    const [viewAccount, setViewAccount] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [range, setRange] = useState("30D");
    const [editingId, setEditingId] = useState(null);
    const [sheet, setSheet] = useState(null);
    const [toast, setToast] = useState("");
    const [alertDismissed, setAlertDismissed] = useState("");
    const [txQuery, setTxQuery] = useState("");
    const [txMonth, setTxMonth] = useState("all");
    const [txCat, setTxCat] = useState("all");
    const [celebration, setCelebration] = useState(null);
    const { useRef } = React;
    useEffect(() => localStorage.setItem(KEY, JSON.stringify(state)), [state]);
    useEffect(() => {
      if (!toast) return;
      const id = setTimeout(() => setToast(""), 2300);
      return () => clearTimeout(id);
    }, [toast]);
    useEffect(() => {
      if (!celebration) return;
      const id = setTimeout(() => setCelebration(null), 2600);
      return () => clearTimeout(id);
    }, [celebration]);
    const metrics = useMemo(() => buildMetrics(state), [state]);
    const prevLvRef = useRef(metrics.li.lv);
    const prevGoalsRef = useRef(state.goals.filter((g) => g.target > 0 && g.saved >= g.target).length);
    useEffect(() => {
      if (metrics.li.lv > prevLvRef.current) {
        setCelebration({ face: "\u{1F389}", title: `\u5347\u7EA7 Lv.${metrics.li.lv}`, sub: metrics.li.title });
      }
      prevLvRef.current = metrics.li.lv;
    }, [metrics.li.lv]);
    useEffect(() => {
      const done = state.goals.filter((g) => g.target > 0 && g.saved >= g.target).length;
      if (done > prevGoalsRef.current) {
        setCelebration({ face: "\u{1F3C6}", title: "\u50A8\u84C4\u76EE\u6807\u8FBE\u6210\uFF01", sub: "Leo \u4E3A\u4F60\u9AD8\u5174 \xB7 +200 XP" });
      }
      prevGoalsRef.current = done;
    }, [state.goals]);
    const editingTx = editingId ? state.transactions.find((t) => t.id === editingId) : null;
    function updateState(mutator) {
      setState((prev) => {
        const next = clone(prev);
        mutator(next);
        return normalize(next);
      });
    }
    function accountById(id, s = state) {
      return s.accounts.find((x) => x.id === id) || s.accounts[0];
    }
    function applyAccountDelta(s, tx, sign) {
      if (tx.type === "transfer") {
        const from = accountById(tx.accountId, s);
        const to = s.accounts.find((a) => a.id === tx.toAccountId);
        if (from) from.balance = Number((Number(from.balance || 0) - sign * tx.amount).toFixed(2));
        if (to) to.balance = Number((Number(to.balance || 0) + sign * tx.amount).toFixed(2));
        return;
      }
      const account = accountById(tx.accountId, s);
      const delta = tx.type === "income" ? tx.amount : -tx.amount;
      account.balance = Number((Number(account.balance || 0) + sign * delta).toFixed(2));
    }
    function addTransaction(tx) {
      updateState((s) => {
        const item = { ...tx, id: uid("t"), amount: Number(tx.amount) || 0 };
        s.transactions.unshift(item);
        applyAccountDelta(s, item, 1);
        updateMascot(s);
      });
      setTab("home");
      setToast("\u5DF2\u4FDD\u5B58\uFF0CLeo \u8BB0\u4E0B\u8FD9\u4E00\u7B14\u4E86\u3002");
    }
    function updateTransaction(id, tx) {
      updateState((s) => {
        const old = s.transactions.find((t) => t.id === id);
        if (!old) return;
        applyAccountDelta(s, old, -1);
        Object.assign(old, tx, { amount: Number(tx.amount) || 0 });
        applyAccountDelta(s, old, 1);
      });
      setEditingId(null);
      setToast("\u8D26\u5355\u5DF2\u66F4\u65B0\u3002");
    }
    function deleteTransaction(id) {
      updateState((s) => {
        const old = s.transactions.find((t) => t.id === id);
        if (old) applyAccountDelta(s, old, -1);
        s.transactions = s.transactions.filter((t) => t.id !== id);
      });
      setEditingId(null);
      setToast("\u8D26\u5355\u5DF2\u5220\u9664\u3002");
    }
    function updateMascot(s) {
      const today = todayStr();
      const last = s.mascot.lastEntry || today;
      const diff = Math.floor((new Date(today) - new Date(last)) / 864e5);
      if (diff === 1) s.mascot.streakDays += 1;
      else if (diff > 1) s.mascot.streakDays = 1;
      s.mascot.xp += s.mascot.streakDays % 7 === 0 ? 60 : 10;
      s.mascot.lastEntry = today;
    }
    function postPlan(s, p) {
      const item = { id: uid("t"), amount: Number(p.amount) || 0, categoryId: p.categoryId, accountId: p.accountId, note: p.name, date: p.dueDate, type: p.type };
      s.transactions.unshift(item);
      applyAccountDelta(s, item, 1);
      const nd = nextDue(p.dueDate, p.repeat);
      if (nd) p.dueDate = nd;
      else s.planned = s.planned.filter((x) => x.id !== p.id);
    }
    function payPlan(id) {
      updateState((s) => {
        const p = s.planned.find((x) => x.id === id);
        if (!p) return;
        postPlan(s, p);
        updateMascot(s);
      });
      setToast("\u5DF2\u5165\u8D26 \u2713 \u8BA1\u5212\u5DF2\u66F4\u65B0\u5230\u4E0B\u4E00\u671F\u3002");
    }
    function payAllDue() {
      const ids = metrics.duePlans.map((p) => p.id);
      if (!ids.length) return;
      updateState((s) => {
        ids.forEach((id) => {
          const p = s.planned.find((x) => x.id === id);
          if (p) postPlan(s, p);
        });
        updateMascot(s);
      });
      setToast(`\u5DF2\u5165\u8D26 ${ids.length} \u7B14\u8BA1\u5212\u4ED8\u6B3E \u2713`);
    }
    function addCategory(parentId, { name, icon, color, income }) {
      updateState((s) => {
        if (!parentId) {
          s.categories.splice(s.categories.length - 1, 0, { id: uid("c"), name, icon, color, income: !!income, children: [] });
        } else {
          const pth = catPath(parentId, s.categories);
          const node = pth && pth[pth.length - 1];
          if (node) {
            node.children = node.children || [];
            node.children.push({ id: uid("c"), name, icon: icon || node.icon, color: color || node.color, income: node.income, children: [] });
          }
        }
      });
      setToast("\u5206\u7C7B\u5DF2\u6DFB\u52A0\u3002");
    }
    function updateCategory(id, patch) {
      updateState((s) => {
        const pth = catPath(id, s.categories);
        const node = pth && pth[pth.length - 1];
        if (node) Object.assign(node, patch);
      });
      setToast("\u5206\u7C7B\u5DF2\u66F4\u65B0\u3002");
    }
    function deleteCategory(id) {
      if (id === "other" || id === "income") {
        setToast("\u8BE5\u5206\u7C7B\u4E0D\u53EF\u5220\u9664\u3002");
        return;
      }
      if (!confirm("\u5220\u9664\u540E\uFF0C\u5176\u4E0B\u8D26\u5355\u4F1A\u5F52\u5230\u4E0A\u4E00\u7EA7\uFF08\u6216\u300C\u5176\u4ED6\u300D\uFF09\u3002\u786E\u5B9A\u5220\u9664\u5417\uFF1F")) return;
      updateState((s) => {
        const pth = catPath(id, s.categories);
        const parentId = pth && pth.length >= 2 ? pth[pth.length - 2].id : "other";
        const node = pth ? pth[pth.length - 1] : null;
        const ids = /* @__PURE__ */ new Set();
        (function collect(n) {
          if (!n) return;
          ids.add(n.id);
          (n.children || []).forEach(collect);
        })(node);
        s.transactions.forEach((t) => {
          if (ids.has(t.categoryId)) t.categoryId = parentId;
        });
        s.planned.forEach((pp) => {
          if (ids.has(pp.categoryId)) pp.categoryId = parentId;
        });
        s.budgets = s.budgets.filter((b) => !ids.has(b.categoryId));
        removeNode(s.categories, id);
      });
      setToast("\u5206\u7C7B\u5DF2\u5220\u9664\u3002");
    }
    function addTemplate(tpl) {
      updateState((s) => {
        s.templates = s.templates || [];
        s.templates.push({ id: uid("tpl"), name: tpl.name, amount: Number(tpl.amount) || 0, type: tpl.type, categoryId: tpl.categoryId, accountId: tpl.accountId, note: tpl.note || "" });
      });
      setToast(`\u6A21\u677F\u300C${tpl.name}\u300D\u5DF2\u4FDD\u5B58\u3002`);
    }
    function deleteTemplate(id) {
      updateState((s) => {
        s.templates = (s.templates || []).filter((t) => t.id !== id);
      });
      setToast("\u6A21\u677F\u5DF2\u5220\u9664\u3002");
    }
    function addAccount({ name, type, accType, balance, icon, color }) {
      updateState((s) => s.accounts.push({ id: uid("a"), name, type: type || "\u73B0\u91D1", accType: accType || "cash", balance: Number(balance) || 0, icon: icon || "\u{1F4B0}", color: color || "#3B82F6" }));
      setToast(`\u8D26\u6237\u300C${name}\u300D\u5DF2\u6DFB\u52A0\u3002`);
    }
    function updateAccount(id, patch) {
      updateState((s) => {
        const a = s.accounts.find((x) => x.id === id);
        if (a) Object.assign(a, patch, patch.balance !== void 0 ? { balance: Number(patch.balance) || 0 } : {});
      });
      setToast("\u8D26\u6237\u5DF2\u66F4\u65B0\u3002");
    }
    function deleteAccount(id) {
      if (state.accounts.length <= 1) {
        setToast("\u81F3\u5C11\u4FDD\u7559\u4E00\u4E2A\u8D26\u6237\u3002");
        return;
      }
      if (!confirm("\u5220\u9664\u8D26\u6237\u540E\uFF0C\u5176\u8D26\u5355\u4F1A\u8F6C\u5230\u5176\u5B83\u8D26\u6237\u3002\u786E\u5B9A\u5220\u9664\u5417\uFF1F")) return;
      updateState((s) => {
        const fallback = s.accounts.find((a) => a.id !== id);
        const fid = fallback ? fallback.id : "daily";
        s.transactions.forEach((t) => {
          if (t.accountId === id) t.accountId = fid;
        });
        s.planned.forEach((pp) => {
          if (pp.accountId === id) pp.accountId = fid;
        });
        s.accounts = s.accounts.filter((a) => a.id !== id);
      });
      setToast("\u8D26\u6237\u5DF2\u5220\u9664\u3002");
    }
    function setAllocIncome(v) {
      updateState((s) => {
        s.allocation.income = v === "" || v === null ? null : Number(v) || 0;
      });
    }
    function addBucket() {
      updateState((s) => {
        s.allocation.buckets.push({ id: uid("al"), name: "\u65B0\u5206\u914D", pct: 0, color: CAT_COLORS[s.allocation.buckets.length % CAT_COLORS.length] });
      });
    }
    function updateBucket(id, patch) {
      updateState((s) => {
        const b = s.allocation.buckets.find((x) => x.id === id);
        if (b) Object.assign(b, patch, patch.pct !== void 0 ? { pct: Number(patch.pct) || 0 } : {});
      });
    }
    function deleteBucket(id) {
      updateState((s) => {
        s.allocation.buckets = s.allocation.buckets.filter((x) => x.id !== id);
      });
    }
    function reset() {
      if (!confirm("\u786E\u5B9A\u6E05\u7A7A\u6240\u6709\u6570\u636E\u5417\uFF1F\u5C06\u5220\u9664\u5168\u90E8\u8D26\u5355\u3001\u9884\u7B97\u3001\u76EE\u6807\u4E0E\u8BA1\u5212\uFF0C\u5E76\u628A\u6240\u6709\u94B1\u5305\u4F59\u989D\u6E05\u96F6\u3002")) return;
      setState((prev) => {
        const cleared = clone(prev);
        cleared.transactions = [];
        cleared.budgets = [];
        cleared.goals = [];
        cleared.planned = [];
        cleared.accounts = cleared.accounts.map((a) => ({ ...a, balance: 0 }));
        cleared.mascot = { xp: 0, streakDays: 0, lastEntry: todayStr() };
        return normalize(cleared);
      });
      setViewAccount(null);
      setSheet(null);
      setTab("home");
      setToast("\u6240\u6709\u6570\u636E\u5DF2\u6E05\u7A7A\uFF0C\u94B1\u5305\u5DF2\u6E05\u96F6\u3002");
    }
    function exportCSV() {
      const rows = [["date", "type", "account", "category", "amount", "note"]];
      state.transactions.forEach((t) => rows.push([t.date, t.type, accountById(t.accountId).name, `"${categoryName(t.categoryId)}"`, t.amount, `"${String(t.note).replace(/"/g, '""')}"`]));
      download(`leoledger_export_${todayStr()}.csv`, rows.map((r) => r.join(",")).join("\n"), "text/csv;charset=utf-8");
      setToast("CSV \u5DF2\u5BFC\u51FA\u3002");
    }
    function exportJSON() {
      download(`leoledger_backup_${todayStr()}.json`, JSON.stringify(state, null, 2), "application/json;charset=utf-8");
      setToast("JSON \u5907\u4EFD\u5DF2\u751F\u6210\u3002");
    }
    function importJSON(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          setState(normalize(JSON.parse(reader.result)));
          setToast("\u6062\u590D\u6210\u529F\u3002");
        } catch (e) {
          setToast("\u6587\u4EF6\u6821\u9A8C\u5931\u8D25\u3002");
        }
      };
      reader.readAsText(file);
    }
    function download(name, content, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
    const ctx = {
      state,
      setState,
      updateState,
      metrics,
      tab,
      setTab,
      range,
      setRange,
      addOpen,
      setAddOpen,
      editingId,
      setEditingId,
      sheet,
      setSheet,
      alertDismissed,
      setAlertDismissed,
      txQuery,
      setTxQuery,
      txMonth,
      setTxMonth,
      txCat,
      setTxCat,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      payPlan,
      payAllDue,
      addCategory,
      updateCategory,
      deleteCategory,
      addTemplate,
      deleteTemplate,
      addAccount,
      updateAccount,
      deleteAccount,
      viewAccount,
      setViewAccount,
      setAllocIncome,
      addBucket,
      updateBucket,
      deleteBucket,
      exportCSV,
      exportJSON,
      importJSON,
      reset,
      setToast,
      accountById
    };
    if (!state.welcomed) {
      return /* @__PURE__ */ React.createElement(Welcome, { onStart: () => updateState((s) => {
        s.welcomed = true;
      }) });
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, toast && /* @__PURE__ */ React.createElement("div", { className: "toast" }, toast), celebration && /* @__PURE__ */ React.createElement(Celebration, { data: celebration, onClose: () => setCelebration(null) }), /* @__PURE__ */ React.createElement("main", { className: "screen", key: viewAccount ? "acct:" + viewAccount : tab }, viewAccount ? /* @__PURE__ */ React.createElement(AccountDetail, { ...ctx }) : /* @__PURE__ */ React.createElement(React.Fragment, null, tab === "home" && /* @__PURE__ */ React.createElement(Home, { ...ctx }), tab === "planning" && /* @__PURE__ */ React.createElement(Planning, { ...ctx }), tab === "insights" && /* @__PURE__ */ React.createElement(Insights, { ...ctx }), tab === "profile" && /* @__PURE__ */ React.createElement(Profile, { ...ctx }), tab === "transactions" && /* @__PURE__ */ React.createElement(Transactions, { ...ctx }))), !addOpen && !editingTx && !sheet && /* @__PURE__ */ React.createElement("button", { className: "fab", onClick: () => setAddOpen(true), "aria-label": "\u8BB0\u4E00\u7B14" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24" }, ICONS.add)), !addOpen && /* @__PURE__ */ React.createElement(TabBar, { tab: viewAccount ? "" : tab, setTab: (t) => {
      setViewAccount(null);
      setTab(t);
    } }), addOpen && /* @__PURE__ */ React.createElement(AddRecordSheet, { ...ctx }), editingTx && /* @__PURE__ */ React.createElement(EditSheet, { tx: editingTx, ...ctx }), sheet && /* @__PURE__ */ React.createElement(ManageSheet, { ...ctx }));
  }
  function Welcome({ onStart }) {
    return /* @__PURE__ */ React.createElement("div", { className: "screen welcome" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 18, padding: "0 8px" } }, /* @__PURE__ */ React.createElement(Leo, { mood: "happy", size: 120 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "title-md" }, "Leo Ledger"), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 8, fontSize: 14 } }, "\u5FEB\u901F\u8BB0\u8D26\uFF0C\u672C\u5730\u4FDD\u5B58\uFF0CLeo \u966A\u4F60\u575A\u6301\u3002"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 4px 8px" } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onStart }, "\u521B\u5EFA\u672C\u5730\u8D26\u672C")));
  }
  function Celebration({ data, onClose }) {
    const sparks = ["\u2728", "\u{1F38A}", "\u2B50", "\u{1F4AB}", "\u{1F389}", "\u{1F31F}"];
    return /* @__PURE__ */ React.createElement("div", { className: "celebrate", onClick: onClose }, sparks.map((s, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "spark", style: { left: `${10 + i * 15}%`, animationDelay: `${i * 0.12}s` } }, s)), /* @__PURE__ */ React.createElement("div", { className: "big" }, data.face), /* @__PURE__ */ React.createElement("div", { className: "ttl" }, data.title), data.sub && /* @__PURE__ */ React.createElement("div", { className: "sub" }, data.sub));
  }
  function accountSeries(state, accountId, days) {
    const points = Math.min(days, 30);
    const acc = state.accounts.find((a) => a.id === accountId);
    const total = acc ? Number(acc.balance) || 0 : 0;
    const txs = state.transactions.filter((t) => t.accountId === accountId || t.type === "transfer" && t.toAccountId === accountId);
    const first = /* @__PURE__ */ new Date();
    first.setDate(first.getDate() - days + 1);
    const daily = [];
    for (let i = 0; i < points; i++) {
      const d = new Date(first);
      d.setDate(d.getDate() + Math.round(i * (days - 1) / Math.max(1, points - 1)));
      const ds = todayStr(d);
      const futureDelta = txs.filter((t) => t.date > ds).reduce((sum, t) => sum + signedAmount(t, accountId), 0);
      daily.push(total - futureDelta);
    }
    return daily;
  }
  function AccountDetail(props) {
    const { state, viewAccount, setViewAccount, updateAccount, deleteAccount, setEditingId, setToast } = props;
    const [editing, setEditing] = useState(false);
    const account = state.accounts.find((a) => a.id === viewAccount);
    if (!account) return null;
    const txs = [...state.transactions].filter((t) => t.accountId === account.id || t.type === "transfer" && t.toAccountId === account.id).sort((a, b) => new Date(b.date) - new Date(a.date) || String(b.id).localeCompare(String(a.id)));
    const series = accountSeries(state, account.id, 30);
    const since = todayStr(addDays(/* @__PURE__ */ new Date(), -30));
    const net30 = txs.filter((t) => t.date >= since).reduce((a, t) => a + signedAmount(t, account.id), 0);
    const prev = account.balance - net30;
    const pct = prev ? Math.round(net30 / Math.abs(prev) * 100) : 0;
    const groups = {};
    txs.forEach((t) => {
      (groups[t.date] = groups[t.date] || []).push(t);
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "detail-top" }, /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => setViewAccount(null), "aria-label": "\u8FD4\u56DE" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.back)), /* @__PURE__ */ React.createElement("div", { className: "detail-title" }, account.icon, " ", account.name), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setEditing(true) }, "Edit")), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "LAST 30 DAYS"), /* @__PURE__ */ React.createElement("span", { className: `caption ${pct < 0 ? "red" : "green"}` }, pct < 0 ? "\u2193" : "\u2191", " ", Math.abs(pct), "%")), /* @__PURE__ */ React.createElement("div", { className: `title-lg ${account.balance < 0 ? "red" : ""}`, style: { margin: "2px 0 8px" } }, money(account.balance)), /* @__PURE__ */ React.createElement(LineChart, { data: series, color: account.balance < 0 ? "#FF5A5F" : "#00C805" })), txs.length ? Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).map((date) => /* @__PURE__ */ React.createElement(React.Fragment, { key: date }, /* @__PURE__ */ React.createElement("div", { className: "day-head" }, /* @__PURE__ */ React.createElement("span", { className: "d" }, new Date(date).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" }))), /* @__PURE__ */ React.createElement("section", { className: "card" }, groups[date].map((t) => /* @__PURE__ */ React.createElement(TransactionRow, { key: t.id, tx: t, onEdit: () => setEditingId(t.id) }))))) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD9\u4E2A\u8D26\u6237\u8FD8\u6CA1\u6709\u8D26\u5355"), editing && /* @__PURE__ */ React.createElement(
      AccountEditor,
      {
        account,
        setToast,
        onSave: (data) => {
          updateAccount(account.id, data);
          setEditing(false);
        },
        onDelete: () => {
          setEditing(false);
          deleteAccount(account.id);
          setViewAccount(null);
        },
        onClose: () => setEditing(false)
      }
    ));
  }
  function AllocationBar({ buckets }) {
    const total = buckets.reduce((a, b) => a + b.pct, 0) || 100;
    return /* @__PURE__ */ React.createElement("div", { className: "alloc-bar" }, buckets.map((b) => /* @__PURE__ */ React.createElement("span", { key: b.id, style: { width: `${b.pct / total * 100}%`, background: b.color }, title: `${b.name} ${b.pct}%` })));
  }
  function AllocationSheet({ state, metrics, setAllocIncome, addBucket, updateBucket, deleteBucket, setToast }) {
    const alloc = state.allocation;
    const base = alloc.income != null ? alloc.income : metrics.monthIncome;
    const total = alloc.buckets.reduce((a, b) => a + b.pct, 0);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u6536\u5165\u5206\u914D"), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u6708\u6536\u5165\u57FA\u6570\uFF08\u7559\u7A7A\u5219\u7528\u672C\u6708\u6536\u5165 ", money(metrics.monthIncome), "\uFF09"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", value: alloc.income == null ? "" : alloc.income, onChange: (e) => setAllocIncome(e.target.value), placeholder: String(metrics.monthIncome) })), /* @__PURE__ */ React.createElement(AllocationBar, { buckets: alloc.buckets }), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "10px 2px 8px" } }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u5408\u8BA1"), /* @__PURE__ */ React.createElement("span", { className: `caption ${total === 100 ? "green" : "warn"}` }, total, "%", total === 100 ? "" : " \xB7 \u5EFA\u8BAE\u5408\u8BA1 100%")), alloc.buckets.map((b) => /* @__PURE__ */ React.createElement("div", { className: "card", key: b.id, style: { margin: "0 0 10px", padding: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "swatch", style: { background: b.color } }), /* @__PURE__ */ React.createElement("input", { className: "field", value: b.name, onChange: (e) => updateBucket(b.id, { name: e.target.value }), style: { flex: 1 } }), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", value: b.pct, onChange: (e) => updateBucket(b.id, { pct: e.target.value }), style: { width: 70 } }), /* @__PURE__ */ React.createElement("span", { className: "caption" }, "%"), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => deleteBucket(b.id), "aria-label": "\u5220\u9664" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.trash))), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 6 } }, "\u76EE\u6807 = ", money(base * b.pct / 100)))), /* @__PURE__ */ React.createElement("button", { className: "btn secondary", onClick: addBucket }, "+ \u6DFB\u52A0\u5206\u914D\u9879"));
  }
  function AccountTypePicker({ accounts, onPick, onClose }) {
    return /* @__PURE__ */ React.createElement("div", { className: "picker-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "picker-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "picker-head" }, /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close)), /* @__PURE__ */ React.createElement("div", { className: "picker-title" }, "\u6DFB\u52A0\u4EC0\u4E48\u8D26\u6237\uFF1F"), /* @__PURE__ */ React.createElement("span", { style: { width: 34 } })), /* @__PURE__ */ React.createElement("div", { className: "picker-body" }, /* @__PURE__ */ React.createElement("div", { className: "picker-section" }, "\u9009\u62E9\u8D26\u6237\u7C7B\u578B"), ACCOUNT_TYPES.map((t) => {
      const count = accounts.filter((a) => a.accType === t.id).length;
      return /* @__PURE__ */ React.createElement("button", { key: t.id, type: "button", className: "type-row", onClick: () => onPick(t) }, /* @__PURE__ */ React.createElement("span", { className: "type-ic", style: { background: t.color + "22", color: t.color } }, t.icon), /* @__PURE__ */ React.createElement("span", { className: "type-text" }, /* @__PURE__ */ React.createElement("span", { className: "type-label" }, t.label), /* @__PURE__ */ React.createElement("span", { className: "type-desc" }, t.desc)), count > 0 && /* @__PURE__ */ React.createElement("span", { className: "type-count green" }, "\u2713 ", count));
    }))));
  }
  function AccountEditor({ account, preset, onSave, onDelete, onClose, setToast }) {
    const initType = account ? account.accType || "cash" : preset ? preset.id : "cash";
    const [name, setName] = useState(account ? account.name : "");
    const [accType, setAccType] = useState(initType);
    const [balance, setBalance] = useState(account ? String(account.balance) : "");
    const [icon, setIcon] = useState(account ? account.icon : preset ? preset.icon : "\u{1F4B0}");
    const [color, setColor] = useState(account ? account.color : preset ? preset.color : "#3B82F6");
    const typeObj = ACCOUNT_TYPES.find((t) => t.id === accType) || ACCOUNT_TYPES[0];
    return /* @__PURE__ */ React.createElement("div", { className: "picker-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "picker-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "picker-head" }, /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close)), /* @__PURE__ */ React.createElement("div", { className: "picker-title" }, account ? "\u7F16\u8F91\u8D26\u6237" : typeObj.label), /* @__PURE__ */ React.createElement("span", { style: { width: 34 } })), /* @__PURE__ */ React.createElement("div", { className: "picker-body" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u540D\u79F0"), /* @__PURE__ */ React.createElement("input", { className: "field", value: name, onChange: (e) => setName(e.target.value), placeholder: typeObj.label })), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u7C7B\u578B"), /* @__PURE__ */ React.createElement("select", { className: "field", value: accType, onChange: (e) => setAccType(e.target.value) }, ACCOUNT_TYPES.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.id, value: t.id }, t.label)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, account ? "\u4F59\u989D" : "\u521D\u59CB\u4F59\u989D"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", step: "0.01", value: balance, onChange: (e) => setBalance(e.target.value), placeholder: "0" }))), /* @__PURE__ */ React.createElement(IconColorPicker, { icon, setIcon, color, setColor }), /* @__PURE__ */ React.createElement("button", { className: "btn", style: { marginTop: 14 }, onClick: () => {
      if (!name.trim()) {
        setToast("\u8BF7\u8F93\u5165\u8D26\u6237\u540D\u79F0\u3002");
        return;
      }
      onSave({ name: name.trim(), type: typeObj.label, accType, balance: Number(balance) || 0, icon, color });
    } }, "\u4FDD\u5B58"), account && onDelete && /* @__PURE__ */ React.createElement("button", { className: "btn danger", style: { marginTop: 10 }, onClick: onDelete }, "\u5220\u9664\u8D26\u6237"))));
  }
  function TabBar({ tab, setTab }) {
    const tabs = [["home", "Dashboard"], ["planning", "Planning"], ["insights", "Statistics"], ["profile", "More"]];
    return /* @__PURE__ */ React.createElement("nav", { className: "tabs" }, tabs.map(([id, label]) => /* @__PURE__ */ React.createElement("button", { key: id, className: `tab ${tab === id ? "active" : ""}`, onClick: () => setTab(id), "aria-label": label }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24" }, ICONS[id]), /* @__PURE__ */ React.createElement("span", null, label))));
  }
  function Home(props) {
    const { state, metrics, range, setRange, setTab, setSheet, setEditingId, alertDismissed, setAlertDismissed, payPlan, addAccount, updateAccount, deleteAccount, setViewAccount } = props;
    const recent = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const rangeDays = { "7D": 7, "30D": 30, "90D": 90, "1Y": 365 }[range];
    const series = trendSeries(state, rangeDays);
    const topBudget = [...metrics.budgets].sort((a, b) => b.pct - a.pct)[0];
    const topGoal = [...state.goals].filter((g) => g.target > 0).sort((a, b) => b.saved / b.target - a.saved / a.target)[0];
    const nextPlans = [...metrics.duePlans, ...metrics.upcoming].slice(0, 3);
    const [acctEditor, setAcctEditor] = useState(null);
    const [typePicker, setTypePicker] = useState(false);
    const cells = [...state.accounts, { add: true }];
    const acctPages = [];
    for (let i = 0; i < cells.length; i += 4) acctPages.push(cells.slice(i, i + 4));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BudgetAlert, { metrics, dismissed: alertDismissed, onDismiss: () => setAlertDismissed(metrics.thisMonth) }), /* @__PURE__ */ React.createElement("section", { className: "wallets" }, /* @__PURE__ */ React.createElement("div", { className: "wallet-pager" }, acctPages.map((page, pi) => /* @__PURE__ */ React.createElement("div", { className: "wallet-page", key: pi }, page.map((a) => a.add ? /* @__PURE__ */ React.createElement("button", { key: "add", className: "wallet-card add", onClick: () => setTypePicker(true) }, /* @__PURE__ */ React.createElement("span", { className: "wallet-add-ic" }, "+"), /* @__PURE__ */ React.createElement("span", { className: "wallet-add-label" }, "Add account")) : /* @__PURE__ */ React.createElement("div", { key: a.id, className: "wallet-card", onClick: () => setViewAccount(a.id) }, /* @__PURE__ */ React.createElement("span", { className: "wallet-ic", style: { background: a.color } }, a.icon), /* @__PURE__ */ React.createElement("div", { className: "wallet-name" }, a.name), /* @__PURE__ */ React.createElement("div", { className: `wallet-bal ${a.balance < 0 ? "red" : ""}` }, money(a.balance))))))), acctPages.length > 1 && /* @__PURE__ */ React.createElement("div", { className: "dots" }, acctPages.map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "dot" })))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "Balance Trend"), /* @__PURE__ */ React.createElement("span", { className: `caption ${metrics.net >= 0 ? "green" : "red"}` }, metrics.net >= 0 ? "\u25B2" : "\u25BC", " \u672C\u6708 ", money(Math.abs(metrics.net)))), /* @__PURE__ */ React.createElement("div", { className: "caption" }, "TODAY"), /* @__PURE__ */ React.createElement("div", { className: "title-lg", style: { marginBottom: 8 } }, money(metrics.totalAssets)), /* @__PURE__ */ React.createElement(LineChart, { data: series, color: metrics.net >= 0 ? "#00C805" : "#FF5A5F" }), /* @__PURE__ */ React.createElement("div", { className: "segmented" }, ["7D", "30D", "90D", "1Y"].map((r) => /* @__PURE__ */ React.createElement("button", { key: r, className: `seg-btn ${range === r ? "active" : ""}`, onClick: () => setRange(r) }, r)))), /* @__PURE__ */ React.createElement("section", { className: "stat-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u672C\u6708\u6536\u5165"), /* @__PURE__ */ React.createElement("div", { className: "v green" }, money(metrics.monthIncome))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u672C\u6708\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "v red" }, money(metrics.monthExpense))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BA1\u5212\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "v small red" }, money(metrics.plannedExpense))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u9884\u8BA1\u4F59\u989D"), /* @__PURE__ */ React.createElement("div", { className: `v small ${metrics.projectedBalance >= 0 ? "green" : "red"}` }, money(metrics.projectedBalance)))), /* @__PURE__ */ React.createElement("section", { className: "card", onClick: () => setTab("profile"), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement(Leo, { mood: metrics.mood }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, MOOD[metrics.mood].line), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 4 } }, "Lv.", metrics.li.lv, " ", metrics.li.title, " \xB7 \u8FDE\u7EED ", state.mascot.streakDays, " \u5929")), /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u203A"))), topBudget && /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, categoryById(topBudget.categoryId).icon, " ", categoryById(topBudget.categoryId).name, "\u9884\u7B97"), /* @__PURE__ */ React.createElement("div", { className: `caption ${topBudget.pct >= 100 ? "red" : topBudget.pct >= 80 ? "warn" : "green"}` }, topBudget.pct, "%")), /* @__PURE__ */ React.createElement(Progress, { pct: topBudget.pct, color: budgetColor(topBudget.pct) })), topGoal && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u50A8\u84C4\u76EE\u6807"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("goals") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card", onClick: () => setSheet("goals"), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, topGoal.icon, " ", topGoal.name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, money(topGoal.saved), " / ", money(topGoal.target))), /* @__PURE__ */ React.createElement(Progress, { pct: Math.round(topGoal.saved / topGoal.target * 100) }), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 7 } }, topGoal.saved >= topGoal.target ? "\u{1F3C6} \u5DF2\u8FBE\u6210\uFF01" : `\u8FD8\u5DEE ${money(topGoal.target - topGoal.saved)}`))), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u8BA1\u5212\u4ED8\u6B3E"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("planned") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card" }, nextPlans.length ? nextPlans.map((p) => /* @__PURE__ */ React.createElement(PlannedRow, { key: p.id, plan: p, onPay: () => payPlan(p.id) })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u6CA1\u6709\u5373\u5C06\u5230\u671F\u7684\u8BA1\u5212")), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u6700\u8FD1\u8D26\u5355"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setTab("transactions") }, "\u67E5\u770B\u5168\u90E8")), /* @__PURE__ */ React.createElement("section", { className: "card" }, recent.length ? recent.map((t) => /* @__PURE__ */ React.createElement(TransactionRow, { key: t.id, tx: t, onEdit: () => setEditingId(t.id) })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u8D26\u5355\uFF0C\u53BB\u8BB0\u4E00\u7B14\u5427")), typePicker && /* @__PURE__ */ React.createElement(AccountTypePicker, { accounts: state.accounts, onPick: (t) => {
      setTypePicker(false);
      setAcctEditor({ preset: t });
    }, onClose: () => setTypePicker(false) }), acctEditor && /* @__PURE__ */ React.createElement(
      AccountEditor,
      {
        account: acctEditor.id ? acctEditor : null,
        preset: acctEditor.preset || null,
        setToast: props.setToast,
        onSave: (data) => {
          if (acctEditor.id) updateAccount(acctEditor.id, data);
          else addAccount(data);
          setAcctEditor(null);
        },
        onDelete: acctEditor.id ? () => {
          deleteAccount(acctEditor.id);
          setAcctEditor(null);
        } : null,
        onClose: () => setAcctEditor(null)
      }
    ));
  }
  function BudgetAlert({ metrics, dismissed, onDismiss }) {
    const over = metrics.budgets.filter((b) => b.pct >= 100);
    const near = metrics.budgets.filter((b) => b.pct >= 80 && b.pct < 100);
    const hot = over[0] || near[0];
    if (!hot || dismissed === metrics.thisMonth) return null;
    const isOver = hot.pct >= 100;
    const c = categoryById(hot.categoryId);
    return /* @__PURE__ */ React.createElement("section", { className: `alert ${isOver ? "over" : "near"}` }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, isOver ? "\u{1F6A8}" : "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, c.name, "\u9884\u7B97", isOver ? "\u5DF2\u8D85\u652F" : "\u5FEB\u89C1\u5E95\u4E86"), /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u672C\u6708", c.name, "\u5DF2\u7528 ", hot.pct, "%")), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onDismiss, "aria-label": "\u5173\u95ED\u63D0\u9192" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "16", height: "16" }, ICONS.close)));
  }
  function AddRecordSheet({ state, addTransaction, setAddOpen, addTemplate, deleteTemplate, setToast }) {
    const [closing, setClosing] = useState(false);
    const [tplOpen, setTplOpen] = useState(false);
    const [tx, setTx] = useState({ amount: "", categoryId: "food", accountId: state.accounts[0].id, toAccountId: (state.accounts[1] || state.accounts[0]).id, note: "", date: todayStr(), type: "expense", id: "new" });
    function requestClose() {
      if (closing) return;
      setClosing(true);
      setTimeout(() => setAddOpen(false), 190);
    }
    useEffect(() => {
      function onKeyDown(e) {
        if (e.key === "Escape") {
          if (tplOpen) setTplOpen(false);
          else requestClose();
        }
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [closing, tplOpen]);
    function saveAndClose(t) {
      addTransaction(t);
      requestClose();
    }
    function applyTemplate(t) {
      setTx({ amount: "", categoryId: t.categoryId, accountId: t.accountId || state.accounts[0].id, note: t.note || "", date: todayStr(), type: t.type, id: "tpl" + Date.now() });
      setTplOpen(false);
      setToast(`\u5DF2\u5957\u7528\u6A21\u677F\u300C${t.name}\u300D`);
    }
    function saveAsTemplate(draft) {
      const def = categoryById(draft.categoryId).name;
      const name = window.prompt ? window.prompt("\u6A21\u677F\u540D\u79F0", def) : def;
      if (name === null) return;
      addTemplate({ name: name && name.trim() || def, amount: 0, type: draft.type, categoryId: draft.categoryId, accountId: draft.accountId, note: draft.note });
    }
    return /* @__PURE__ */ React.createElement("div", { className: `record-overlay ${closing ? "closing" : ""}`, onClick: requestClose }, /* @__PURE__ */ React.createElement("section", { className: "record-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "record-handle", onClick: requestClose, title: "\u5173\u95ED" }), /* @__PURE__ */ React.createElement("div", { className: "record-head" }, /* @__PURE__ */ React.createElement("button", { className: "record-close", onClick: requestClose, "aria-label": "\u5173\u95ED\u8BB0\u8D26\u8868\u5355" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M18 6 6 18M6 6l12 12" }))), /* @__PURE__ */ React.createElement("div", { className: "record-title" }, "Add Record"), /* @__PURE__ */ React.createElement("button", { className: "record-template", type: "button", onClick: () => setTplOpen(true) }, "Templates")), /* @__PURE__ */ React.createElement("div", { className: "record-body" }, /* @__PURE__ */ React.createElement(TransactionForm, { key: tx.id, tx, accounts: state.accounts, transactions: state.transactions, onSubmit: saveAndClose, submitText: "\u4FDD\u5B58\u8D26\u5355", onSaveTemplate: saveAsTemplate })), tplOpen && /* @__PURE__ */ React.createElement(TemplatesPanel, { templates: state.templates || [], onApply: applyTemplate, onDelete: deleteTemplate, onClose: () => setTplOpen(false) })));
  }
  function TemplatesPanel({ templates, onApply, onDelete, onClose }) {
    return /* @__PURE__ */ React.createElement("div", { className: "picker-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "picker-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "picker-head" }, /* @__PURE__ */ React.createElement("span", { style: { width: 34 } }), /* @__PURE__ */ React.createElement("div", { className: "picker-title" }, "\u8BB0\u8D26\u6A21\u677F"), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close))), /* @__PURE__ */ React.createElement("div", { className: "picker-body" }, templates.length ? templates.map((t) => {
      const c = categoryById(t.categoryId);
      return /* @__PURE__ */ React.createElement("div", { className: "cat-row", key: t.id }, /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { background: c.color + "22" }, onClick: () => onApply(t) }, c.icon), /* @__PURE__ */ React.createElement("div", { className: "cat-row-name", onClick: () => onApply(t), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { className: "body" }, t.name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, categoryName(t.categoryId), " \xB7 ", t.type === "income" ? "\u6536\u5165" : "\u652F\u51FA")), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => onDelete(t.id), "aria-label": "\u5220\u9664\u6A21\u677F" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.trash)));
    }) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u6A21\u677F\u3002\u8BB0\u8D26\u65F6\u70B9\u5E95\u90E8\u300C\u5B58\u4E3A\u6A21\u677F\u300D\u5373\u53EF\u521B\u5EFA\u3002"))));
  }
  function Planning({ state, metrics, setSheet, payPlan, payAllDue }) {
    const due = metrics.duePlans;
    const nextPlans = metrics.upcoming.slice(0, 5);
    const topBudgets = [...metrics.budgets].sort((a, b) => b.pct - a.pct).slice(0, 4);
    const goals = [...state.goals].slice(0, 3);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "topline" }, /* @__PURE__ */ React.createElement("div", { className: "title-md" }, "Planning")), /* @__PURE__ */ React.createElement("section", { className: "stat-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BA1\u5212\u6536\u5165"), /* @__PURE__ */ React.createElement("div", { className: "v green" }, money(metrics.plannedIncome))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BA1\u5212\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "v red" }, money(metrics.plannedExpense))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u9884\u7B97\u9879\u76EE"), /* @__PURE__ */ React.createElement("div", { className: "v small" }, state.budgets.length, " \u9879")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u50A8\u84C4\u76EE\u6807"), /* @__PURE__ */ React.createElement("div", { className: "v small" }, state.goals.length, " \u4E2A"))), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u6536\u5165\u5206\u914D"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("allocation") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card" }, (() => {
      const base = state.allocation.income != null ? state.allocation.income : metrics.monthIncome;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u6708\u6536\u5165\u57FA\u6570"), /* @__PURE__ */ React.createElement("span", { className: "body", style: { fontWeight: 800 } }, money(base))), /* @__PURE__ */ React.createElement(AllocationBar, { buckets: state.allocation.buckets }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, state.allocation.buckets.map((b) => /* @__PURE__ */ React.createElement("div", { className: "row", key: b.id, style: { padding: "6px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "swatch", style: { background: b.color } }), b.name, " \xB7 ", b.pct, "%"), /* @__PURE__ */ React.createElement("span", { className: "amount" }, money(base * b.pct / 100))))));
    })()), due.length > 0 && /* @__PURE__ */ React.createElement("section", { className: "alert near", style: { marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u23F0"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, due.length, " \u7B14\u8BA1\u5212\u4ED8\u6B3E\u5DF2\u5230\u671F"), /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BB0\u5165\u540E\u5C06\u81EA\u52A8\u751F\u6210\u4E0B\u4E00\u671F")), /* @__PURE__ */ React.createElement("button", { className: "chip pay-chip", onClick: payAllDue }, "\u5168\u90E8\u8BB0\u5165")), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u8BA1\u5212\u4ED8\u6B3E"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("planned") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card" }, due.map((p) => /* @__PURE__ */ React.createElement(PlannedRow, { key: p.id, plan: p, onPay: () => payPlan(p.id) })), nextPlans.length ? nextPlans.map((p) => /* @__PURE__ */ React.createElement(PlannedRow, { key: p.id, plan: p, onPay: () => payPlan(p.id) })) : !due.length && /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u6CA1\u6709\u5373\u5C06\u5230\u671F\u7684\u8BA1\u5212")), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u9884\u7B97"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("budgets") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card" }, topBudgets.length ? topBudgets.map((b) => /* @__PURE__ */ React.createElement(BudgetRow, { key: b.id, b })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u9884\u7B97")), /* @__PURE__ */ React.createElement("div", { className: "row", style: { margin: "6px 2px 9px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u50A8\u84C4\u76EE\u6807"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("goals") }, "\u7BA1\u7406")), /* @__PURE__ */ React.createElement("section", { className: "card" }, goals.length ? goals.map((g) => {
      const pct = g.target ? Math.min(100, Math.round(g.saved / g.target * 100)) : 0;
      return /* @__PURE__ */ React.createElement("div", { key: g.id, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 7 } }, /* @__PURE__ */ React.createElement("span", { className: "body" }, g.icon, " ", g.name), /* @__PURE__ */ React.createElement("span", { className: "caption" }, money(g.saved), " / ", money(g.target))), /* @__PURE__ */ React.createElement(Progress, { pct }));
    }) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u50A8\u84C4\u76EE\u6807")));
  }
  function TransactionForm({ tx, accounts, transactions, onSubmit, submitText, onCancel, onDelete, onSaveTemplate }) {
    const [draft, setDraft] = useState(tx);
    useEffect(() => setDraft(tx), [tx.id]);
    function patch(key, value) {
      setDraft((prev) => ({ ...prev, [key]: key === "amount" ? Number(value) : value }));
    }
    const [pickerOpen, setPickerOpen] = useState(false);
    const leaf = categoryById(draft.categoryId);
    return /* @__PURE__ */ React.createElement("section", { className: "card", style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, submitText === "\u4FDD\u5B58\u8D26\u5355" ? "\u8D26\u5355\u4FE1\u606F" : "\u7F16\u8F91\u8D26\u5355"), onCancel && /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onCancel, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close))), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u91D1\u989D"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", min: "0", step: "0.01", value: draft.amount || "", onChange: (e) => patch("amount", e.target.value) })), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u7C7B\u578B"), /* @__PURE__ */ React.createElement("select", { className: "field", value: draft.type, onChange: (e) => patch("type", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "expense" }, "\u652F\u51FA"), /* @__PURE__ */ React.createElement("option", { value: "income" }, "\u6536\u5165"), /* @__PURE__ */ React.createElement("option", { value: "transfer" }, "\u8F6C\u8D26")))), draft.type === "transfer" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u8F6C\u51FA\u8D26\u6237"), /* @__PURE__ */ React.createElement("select", { className: "field", value: draft.accountId, onChange: (e) => patch("accountId", e.target.value) }, accounts.map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.name)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u8F6C\u5165\u8D26\u6237"), /* @__PURE__ */ React.createElement("select", { className: "field", value: draft.toAccountId || (accounts.find((a) => a.id !== draft.accountId) || {}).id || "", onChange: (e) => patch("toAccountId", e.target.value) }, accounts.filter((a) => a.id !== draft.accountId).map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.name))))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u65E5\u671F"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "date", value: draft.date, onChange: (e) => patch("date", e.target.value) }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u5206\u7C7B"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cat-select", onClick: () => setPickerOpen(true) }, /* @__PURE__ */ React.createElement("span", { className: "avatar cat-select-ic", style: { background: leaf.color + "22" } }, leaf.icon), /* @__PURE__ */ React.createElement("span", { className: "cat-select-name" }, categoryName(draft.categoryId)), /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u203A"))), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u8D26\u6237"), /* @__PURE__ */ React.createElement("select", { className: "field", value: draft.accountId, onChange: (e) => patch("accountId", e.target.value) }, accounts.map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.name)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u65E5\u671F"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "date", value: draft.date, onChange: (e) => patch("date", e.target.value) })))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u5907\u6CE8"), /* @__PURE__ */ React.createElement("input", { className: "field", value: draft.note, onChange: (e) => patch("note", e.target.value) })), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => {
      if (!draft.amount) return;
      if (draft.type === "transfer") {
        const toId = draft.toAccountId || (accounts.find((a) => a.id !== draft.accountId) || {}).id;
        if (!toId || toId === draft.accountId) return;
        onSubmit({ ...draft, toAccountId: toId, categoryId: null });
        return;
      }
      onSubmit(draft);
    } }, submitText), onSaveTemplate && /* @__PURE__ */ React.createElement("button", { className: "btn secondary", style: { marginTop: 10 }, onClick: () => onSaveTemplate(draft) }, "\u5B58\u4E3A\u6A21\u677F"), onDelete && /* @__PURE__ */ React.createElement("button", { className: "btn danger", style: { marginTop: 10 }, onClick: onDelete }, "\u5220\u9664\u8D26\u5355"), pickerOpen && /* @__PURE__ */ React.createElement(CategoryPicker, { value: draft.categoryId, income: draft.type === "income", transactions, onClose: () => setPickerOpen(false), onPick: (id) => {
      patch("categoryId", id);
      setPickerOpen(false);
    } }));
  }
  function Insights({ state, metrics }) {
    const slices = Object.entries(metrics.catSpend).map(([id, value]) => ({ ...categoryById(id), value })).sort((a, b) => b.value - a.value);
    const months = monthlyExpenseSeries(state);
    const summary = spendingSummary(metrics, slices);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "topline" }, /* @__PURE__ */ React.createElement("div", { className: "title-md" }, "\u672C\u6708\u6D1E\u5BDF")), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Donut, { slices }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, slices.length ? slices.slice(0, 5).map((s) => /* @__PURE__ */ React.createElement("div", { className: "legend", key: s.id }, /* @__PURE__ */ React.createElement("span", { className: "swatch", style: { background: s.color } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, s.name), /* @__PURE__ */ React.createElement("span", { className: "muted" }, metrics.monthExpense ? Math.round(s.value / metrics.monthExpense * 100) : 0, "%"))) : /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u672C\u6708\u8FD8\u6CA1\u6709\u652F\u51FA")))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 12 } }, "\u73B0\u91D1\u6D41"), /* @__PURE__ */ React.createElement("div", { className: "stat-grid", style: { marginBottom: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u6536\u5165"), /* @__PURE__ */ React.createElement("div", { className: "v green" }, money(metrics.monthIncome))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "v red" }, money(metrics.monthExpense))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BA1\u5212\u6536\u5165"), /* @__PURE__ */ React.createElement("div", { className: "v small green" }, money(metrics.plannedIncome))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u8BA1\u5212\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "v small red" }, money(metrics.plannedExpense))))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u8FD1 6 \u4E2A\u6708\u652F\u51FA\u8D8B\u52BF"), /* @__PURE__ */ React.createElement(BarChart, { data: months })), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 12 } }, "\u9884\u7B97\u8FDB\u5EA6"), metrics.budgets.length ? metrics.budgets.map((b) => /* @__PURE__ */ React.createElement(BudgetRow, { key: b.id, b })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u9884\u7B97\uFF0C\u53BB\u201C\u6211\u7684\u201D\u91CC\u6DFB\u52A0\u3002")), /* @__PURE__ */ React.createElement("section", { className: "card", style: { borderColor: summary.level === "warn" ? "rgba(255,176,32,.42)" : "var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement(Leo, { mood: summary.mood }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800, color: summary.level === "warn" ? "var(--warning)" : "var(--text)" } }, summary.title), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 5 } }, summary.text)))));
  }
  function Profile(props) {
    const { state, metrics, setSheet, exportCSV, exportJSON, importJSON, updateState, reset } = props;
    const ach = achievementState(state, metrics);
    const unlocked = ach.filter((a) => a.unlocked);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "card", style: { textAlign: "center", marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Leo, { mood: metrics.mood })), /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginTop: 10 } }, "Leo \xB7 Lv.", metrics.li.lv), /* @__PURE__ */ React.createElement("div", { className: "caption" }, metrics.li.title, " \xB7 \u8FDE\u7EED ", state.mascot.streakDays, " \u5929 \xB7 ", state.mascot.xp, " XP"), /* @__PURE__ */ React.createElement("div", { style: { margin: "14px 24px 4px" } }, /* @__PURE__ */ React.createElement(Progress, { pct: metrics.li.pct }), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { marginTop: 6 } }, "\u4E0B\u4E00\u7EA7\u8FD8\u9700 ", metrics.li.toNext, " XP"))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u5DF2\u89E3\u9501\u5FBD\u7AE0"), /* @__PURE__ */ React.createElement("span", { className: "caption" }, unlocked.length, " / ", ach.length)), /* @__PURE__ */ React.createElement("div", { className: "badge-row" }, unlocked.length ? unlocked.slice(0, 6).map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, className: "badge", title: `${a.name}\uFF1A${a.desc}` }, /* @__PURE__ */ React.createElement("div", { className: "ic" }, a.icon))) : /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u5F00\u59CB\u8BB0\u8D26\u540E\u89E3\u9501"))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F3E6}", title: "\u8D26\u6237\u7BA1\u7406", sub: `${state.accounts.length} \u4E2A\u8D26\u6237`, onClick: () => setSheet("accounts") }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F3F7}\uFE0F", title: "\u5206\u7C7B\u7BA1\u7406", sub: `${CATEGORIES.length} \u4E2A\u5206\u7C7B`, onClick: () => setSheet("categories") }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F3AF}", title: "\u9884\u7B97\u7BA1\u7406", sub: `${state.budgets.length} \u9879\u9884\u7B97`, onClick: () => setSheet("budgets") }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F4C5}", title: "\u8BA1\u5212\u4ED8\u6B3E", sub: `${state.planned.length} \u9879\u8BA1\u5212`, onClick: () => setSheet("planned") }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F437}", title: "\u50A8\u84C4\u76EE\u6807", sub: `${state.goals.length} \u4E2A\u76EE\u6807`, onClick: () => setSheet("goals") })), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F4E4}", title: "\u5BFC\u51FA CSV", onClick: exportCSV }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F4BE}", title: "\u5907\u4EFD JSON", onClick: exportJSON }), /* @__PURE__ */ React.createElement("label", { style: { display: "block" } }, /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F4E5}", title: "\u6062\u590D JSON", onClick: () => {
    } }), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "application/json", style: { display: "none" }, onChange: (e) => importJSON(e.target.files[0]) }))), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement(NavRow, { icon: "\u2B50", title: "Leo Pro", sub: state.pro ? "\u5DF2\u89E3\u9501" : "$4.99 \u4E70\u65AD", onClick: () => updateState((s) => {
      s.pro = !s.pro;
    }) }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F6E1}\uFE0F", title: "\u672C\u5730\u4F18\u5148", sub: "\u65E0\u8D26\u53F7 \xB7 \u65E0\u670D\u52A1\u5668", onClick: () => alert("Leo Ledger \u7684\u6570\u636E\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u8BBE\u5907\u3002") }), /* @__PURE__ */ React.createElement(NavRow, { icon: "\u{1F5D1}\uFE0F", title: "\u6E05\u7A7A\u6240\u6709\u6570\u636E", sub: "\u5220\u9664\u5168\u90E8\u8D26\u5355\u5E76\u628A\u94B1\u5305\u6E05\u96F6", onClick: reset })));
  }
  function Transactions({ state, setTab, setEditingId, txQuery, setTxQuery, txMonth, setTxMonth, txCat, setTxCat }) {
    const months = [...new Set(state.transactions.map((t) => monthStr(t.date)))].sort().reverse();
    const usedCats = [...new Set(state.transactions.map((t) => t.categoryId))];
    const q = txQuery.trim().toLowerCase();
    const list = state.transactions.filter((t) => {
      if (txMonth !== "all" && monthStr(t.date) !== txMonth) return false;
      if (txCat !== "all" && t.categoryId !== txCat) return false;
      if (q && !`${t.note} ${categoryById(t.categoryId).name}`.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date) || String(b.id).localeCompare(String(a.id)));
    const groups = {};
    list.forEach((t) => {
      (groups[t.date] = groups[t.date] || []).push(t);
    });
    const totalExp = list.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    const totalInc = list.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "back-btn", onClick: () => setTab("home") }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24" }, ICONS.back), "\u8FD4\u56DE\u9996\u9875"), /* @__PURE__ */ React.createElement("div", { className: "title-md", style: { margin: "2px 2px 12px" } }, "\u5168\u90E8\u8D26\u5355"), /* @__PURE__ */ React.createElement("div", { className: "search" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.search), /* @__PURE__ */ React.createElement("input", { placeholder: "\u641C\u7D22\u5907\u6CE8\u6216\u5206\u7C7B", value: txQuery, onChange: (e) => setTxQuery(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "filter-row" }, /* @__PURE__ */ React.createElement("button", { className: `chip ${txMonth === "all" ? "active" : ""}`, onClick: () => setTxMonth("all") }, "\u5168\u90E8\u6708\u4EFD"), months.map((m) => /* @__PURE__ */ React.createElement("button", { key: m, className: `chip ${txMonth === m ? "active" : ""}`, onClick: () => setTxMonth(m) }, Number(m.split("-")[1]), "\u6708"))), /* @__PURE__ */ React.createElement("div", { className: "filter-row" }, /* @__PURE__ */ React.createElement("button", { className: `chip ${txCat === "all" ? "active" : ""}`, onClick: () => setTxCat("all") }, "\u5168\u90E8\u5206\u7C7B"), usedCats.map((id) => /* @__PURE__ */ React.createElement("button", { key: id, className: `chip ${txCat === id ? "active" : ""}`, onClick: () => setTxCat(id) }, categoryById(id).icon, " ", categoryById(id).name))), /* @__PURE__ */ React.createElement("section", { className: "card", style: { display: "flex", justifyContent: "space-around", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u652F\u51FA"), /* @__PURE__ */ React.createElement("div", { className: "amount red" }, money(totalExp))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u6536\u5165"), /* @__PURE__ */ React.createElement("div", { className: "amount green" }, money(totalInc))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u7B14\u6570"), /* @__PURE__ */ React.createElement("div", { className: "amount" }, list.length))), list.length ? Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).map((date) => {
      const items = groups[date];
      const dayNet = items.reduce((a, t) => a + signedAmount(t, null), 0);
      return /* @__PURE__ */ React.createElement(React.Fragment, { key: date }, /* @__PURE__ */ React.createElement("div", { className: "day-head" }, /* @__PURE__ */ React.createElement("span", { className: "d" }, new Date(date).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" })), /* @__PURE__ */ React.createElement("span", { className: "s" }, dayNet >= 0 ? "+" : "-", money(Math.abs(dayNet)))), /* @__PURE__ */ React.createElement("section", { className: "card" }, items.map((t) => /* @__PURE__ */ React.createElement(TransactionRow, { key: t.id, tx: t, onEdit: () => setEditingId(t.id) }))));
    }) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u6CA1\u6709\u5339\u914D\u7684\u8D26\u5355"));
  }
  function EditSheet({ tx, state, setEditingId, updateTransaction, deleteTransaction }) {
    return /* @__PURE__ */ React.createElement("div", { className: "sheet-bg" }, /* @__PURE__ */ React.createElement("div", { className: "sheet" }, /* @__PURE__ */ React.createElement(
      TransactionForm,
      {
        tx,
        accounts: state.accounts,
        transactions: state.transactions,
        submitText: "\u4FDD\u5B58\u4FEE\u6539",
        onSubmit: (draft) => updateTransaction(tx.id, draft),
        onCancel: () => setEditingId(null),
        onDelete: () => {
          if (confirm("\u786E\u5B9A\u5220\u9664\u8FD9\u7B14\u8D26\u5355\u5417\uFF1F")) deleteTransaction(tx.id);
        }
      }
    )));
  }
  function ManageSheet(props) {
    const { sheet, setSheet, state, updateState, setToast, payPlan } = props;
    return /* @__PURE__ */ React.createElement("div", { className: "sheet-bg" }, /* @__PURE__ */ React.createElement("div", { className: "sheet" }, sheet === "accounts" && /* @__PURE__ */ React.createElement(AccountsSheet, { accounts: state.accounts }), sheet === "categories" && /* @__PURE__ */ React.createElement(CategoriesSheet, { ...props }), sheet === "budgets" && /* @__PURE__ */ React.createElement(BudgetsSheet, { state, updateState, setToast }), sheet === "planned" && /* @__PURE__ */ React.createElement(PlannedSheet, { state, updateState, setToast, payPlan }), sheet === "goals" && /* @__PURE__ */ React.createElement(GoalsSheet, { state, updateState, setToast }), sheet === "allocation" && /* @__PURE__ */ React.createElement(AllocationSheet, { state, metrics: props.metrics, setAllocIncome: props.setAllocIncome, addBucket: props.addBucket, updateBucket: props.updateBucket, deleteBucket: props.deleteBucket, setToast }), /* @__PURE__ */ React.createElement("button", { className: "btn secondary", style: { marginTop: 14 }, onClick: () => setSheet(null) }, "\u5173\u95ED")));
  }
  function AccountsSheet({ accounts }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u8D26\u6237\u7BA1\u7406"), accounts.map((a) => /* @__PURE__ */ React.createElement("div", { className: "list-item", key: a.id }, /* @__PURE__ */ React.createElement("div", { className: "avatar" }, "\u{1F3E6}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "body" }, a.name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, a.type)), /* @__PURE__ */ React.createElement("div", { className: "amount" }, money(a.balance)))));
  }
  function IconColorPicker({ icon, setIcon, color, setColor }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "caption", style: { margin: "10px 0 6px" } }, "\u56FE\u6807"), /* @__PURE__ */ React.createElement("div", { className: "icon-grid" }, CAT_ICONS.map((ic) => /* @__PURE__ */ React.createElement("button", { type: "button", key: ic, className: `icon-pick ${icon === ic ? "active" : ""}`, onClick: () => setIcon(ic) }, ic))), /* @__PURE__ */ React.createElement("div", { className: "caption", style: { margin: "10px 0 6px" } }, "\u989C\u8272"), /* @__PURE__ */ React.createElement("div", { className: "color-grid" }, CAT_COLORS.map((cl) => /* @__PURE__ */ React.createElement("button", { type: "button", key: cl, className: `color-pick ${color === cl ? "active" : ""}`, style: { background: cl }, onClick: () => setColor(cl), "aria-label": cl }))));
  }
  function CategoryEditor({ node, parentId, onSave, onDelete, onClose, setToast }) {
    const [name, setName] = useState(node ? node.name : "");
    const [icon, setIcon] = useState(node ? node.icon : CAT_ICONS[0]);
    const [color, setColor] = useState(node ? node.color : CAT_COLORS[0]);
    const [income, setIncome] = useState(node ? !!node.income : false);
    const locked = node && (node.id === "other" || node.id === "income");
    return /* @__PURE__ */ React.createElement("div", { className: "picker-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "picker-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "picker-head" }, /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close)), /* @__PURE__ */ React.createElement("div", { className: "picker-title" }, node ? "\u7F16\u8F91\u5206\u7C7B" : parentId ? "\u65B0\u5EFA\u5B50\u5206\u7C7B" : "\u65B0\u5EFA\u5206\u7C7B"), /* @__PURE__ */ React.createElement("span", { style: { width: 34 } })), /* @__PURE__ */ React.createElement("div", { className: "picker-body" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u540D\u79F0"), /* @__PURE__ */ React.createElement("input", { className: "field", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u5206\u7C7B\u540D\u79F0" })), !node && !parentId && /* @__PURE__ */ React.createElement("div", { className: "seg-row" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: `chip ${!income ? "active" : ""}`, onClick: () => setIncome(false) }, "\u652F\u51FA"), /* @__PURE__ */ React.createElement("button", { type: "button", className: `chip ${income ? "active" : ""}`, onClick: () => setIncome(true) }, "\u6536\u5165")), /* @__PURE__ */ React.createElement(IconColorPicker, { icon, setIcon, color, setColor }), /* @__PURE__ */ React.createElement("button", { className: "btn", style: { marginTop: 14 }, onClick: () => {
      if (!name.trim()) {
        setToast("\u8BF7\u8F93\u5165\u540D\u79F0\u3002");
        return;
      }
      onSave({ name: name.trim(), icon, color, income });
    } }, "\u4FDD\u5B58"), node && onDelete && !locked && /* @__PURE__ */ React.createElement("button", { className: "btn danger", style: { marginTop: 10 }, onClick: onDelete }, "\u5220\u9664\u5206\u7C7B"))));
  }
  function FrequentRow({ ids, onPick }) {
    if (!ids.length) return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "picker-section" }, "\u5E38\u7528"), /* @__PURE__ */ React.createElement("div", { className: "freq-row" }, ids.map((n) => /* @__PURE__ */ React.createElement("button", { key: n.id, type: "button", className: "freq-item", onClick: () => onPick(n.id) }, /* @__PURE__ */ React.createElement("span", { className: "freq-ic", style: { background: n.color } }, n.icon), /* @__PURE__ */ React.createElement("span", { className: "freq-name" }, n.name)))));
  }
  function CategoryRow({ node, count, onTap }) {
    const hasKids = node.children && node.children.length;
    return /* @__PURE__ */ React.createElement("div", { className: "cat-row", onClick: onTap }, /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { background: node.color + "22" } }, node.icon), /* @__PURE__ */ React.createElement("span", { className: "cat-row-name" }, node.name), count > 0 && /* @__PURE__ */ React.createElement("span", { className: "caption" }, "(", count, ")"), /* @__PURE__ */ React.createElement("span", { className: "cat-row-chev" }, hasKids ? "\u203A" : ""));
  }
  function CategoryPicker({ value, income, transactions, onPick, onClose }) {
    const [path, setPath] = useState([]);
    const current = path.length ? categoryById(path[path.length - 1]) : null;
    const roots = CATEGORIES.filter((c) => !!c.income === !!income);
    const list = current ? current.children || [] : roots;
    const txs = transactions || [];
    const leafCounts = {};
    txs.forEach((t) => {
      if (!!topCategory(t.categoryId).income === !!income) leafCounts[t.categoryId] = (leafCounts[t.categoryId] || 0) + 1;
    });
    const frequent = !current ? Object.entries(leafCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => categoryById(id)).filter((n) => n && n.id !== "other") : [];
    return /* @__PURE__ */ React.createElement("div", { className: "picker-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "picker-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "picker-head" }, path.length ? /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => setPath((p) => p.slice(0, -1)), "aria-label": "\u8FD4\u56DE" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.back)) : /* @__PURE__ */ React.createElement("span", { style: { width: 34 } }), /* @__PURE__ */ React.createElement("div", { className: "picker-title" }, current ? current.name : income ? "\u9009\u62E9\u6536\u5165\u5206\u7C7B" : "\u9009\u62E9\u652F\u51FA\u5206\u7C7B"), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.close))), /* @__PURE__ */ React.createElement("div", { className: "picker-body" }, !current && /* @__PURE__ */ React.createElement(FrequentRow, { ids: frequent, onPick }), current && /* @__PURE__ */ React.createElement("button", { type: "button", className: `pick-self ${value === current.id ? "active" : ""}`, onClick: () => onPick(current.id) }, /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { background: current.color + "22" } }, current.icon), /* @__PURE__ */ React.createElement("span", { className: "cat-row-name" }, "\u9009\u62E9\u300C", current.name, "\u300D"), value === current.id && /* @__PURE__ */ React.createElement("span", { className: "caption green" }, "\u2713")), /* @__PURE__ */ React.createElement("div", { className: "picker-section" }, current ? "\u5B50\u5206\u7C7B" : "\u5168\u90E8\u5206\u7C7B"), list.map((n) => /* @__PURE__ */ React.createElement(
      CategoryRow,
      {
        key: n.id,
        node: n,
        count: txCountForCat(txs, n.id),
        onTap: () => n.children && n.children.length ? setPath((p) => [...p, n.id]) : onPick(n.id)
      }
    )), list.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD9\u91CC\u6CA1\u6709\u5B50\u5206\u7C7B\uFF0C\u53EF\u76F4\u63A5\u9009\u62E9\u4E0A\u4E00\u7EA7"))));
  }
  function CategoriesSheet(props) {
    const { state, addCategory, updateCategory, deleteCategory, setToast } = props;
    const [path, setPath] = useState([]);
    const [editor, setEditor] = useState(null);
    const current = path.length ? categoryById(path[path.length - 1]) : null;
    const list = current ? current.children || [] : state.categories;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 12 } }, path.length ? /* @__PURE__ */ React.createElement("button", { className: "back-btn", onClick: () => setPath((p) => p.slice(0, -1)) }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24" }, ICONS.back), "\u8FD4\u56DE") : /* @__PURE__ */ React.createElement("div", { className: "section-title" }, "\u5206\u7C7B\u7BA1\u7406"), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setEditor({ node: null, parentId: current ? current.id : null }) }, "+ ", current ? "\u5B50\u5206\u7C7B" : "\u5206\u7C7B")), current && /* @__PURE__ */ React.createElement("div", { className: "cat-head", style: { borderRadius: 10, border: "1px solid var(--line)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { background: current.color + "22" } }, current.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, categoryName(current.id)), /* @__PURE__ */ React.createElement("div", { className: "caption" }, txCountForCat(state.transactions, current.id), " \u7B14\u8BB0\u5F55")), current.id !== "other" && current.id !== "income" && /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => setEditor({ node: current }), "aria-label": "\u7F16\u8F91" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.edit))), list.map((n) => /* @__PURE__ */ React.createElement(
      CategoryRow,
      {
        key: n.id,
        node: n,
        count: txCountForCat(state.transactions, n.id),
        onTap: () => n.children && n.children.length ? setPath((p) => [...p, n.id]) : setEditor({ node: n })
      }
    )), list.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u5B50\u5206\u7C7B\uFF0C\u70B9\u53F3\u4E0A\u89D2\u6DFB\u52A0"), editor && /* @__PURE__ */ React.createElement(
      CategoryEditor,
      {
        node: editor.node,
        parentId: editor.parentId,
        setToast,
        onSave: (data) => {
          if (editor.node) updateCategory(editor.node.id, { name: data.name, icon: data.icon, color: data.color });
          else addCategory(editor.parentId, data);
          setEditor(null);
        },
        onDelete: editor.node ? () => {
          const wasCurrent = current && current.id === editor.node.id;
          deleteCategory(editor.node.id);
          setEditor(null);
          if (wasCurrent) setPath((p) => p.slice(0, -1));
        } : null,
        onClose: () => setEditor(null)
      }
    ));
  }
  function BudgetsSheet({ state, updateState, setToast }) {
    const [categoryId, setCategoryId] = useState("food");
    const [amount, setAmount] = useState("");
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u9884\u7B97\u7BA1\u7406"), state.budgets.map((b) => /* @__PURE__ */ React.createElement("div", { className: "list-item", key: b.id }, /* @__PURE__ */ React.createElement("div", { className: "avatar", style: { background: categoryById(b.categoryId).color + "22" } }, categoryById(b.categoryId).icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "body" }, categoryById(b.categoryId).name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, "\u6BCF\u6708\u4E0A\u9650")), /* @__PURE__ */ React.createElement("div", { className: "amount" }, money(b.amount)), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => updateState((s) => {
      s.budgets = s.budgets.filter((x) => x.id !== b.id);
    }), "aria-label": "\u5220\u9664\u9884\u7B97" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.trash)))), /* @__PURE__ */ React.createElement("div", { className: "soft-divider" }), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u5206\u7C7B"), /* @__PURE__ */ React.createElement("select", { className: "field", value: categoryId, onChange: (e) => setCategoryId(e.target.value) }, CATEGORIES.filter((c) => !c.income).map((c) => /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.icon, " ", c.name)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u9884\u7B97\u91D1\u989D"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", min: "0", placeholder: "600", value: amount, onChange: (e) => setAmount(e.target.value) }))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => {
      if (!Number(amount)) {
        setToast("\u9700\u8981\u586B\u5199\u9884\u7B97\u91D1\u989D\u3002");
        return;
      }
      updateState((s) => s.budgets.push({ id: uid("b"), categoryId, amount: Number(amount), month: monthStr(/* @__PURE__ */ new Date()) }));
      setAmount("");
      setToast("\u9884\u7B97\u5DF2\u6DFB\u52A0\u3002");
    } }, "\u6DFB\u52A0\u9884\u7B97"));
  }
  function PlannedSheet({ state, updateState, setToast, payPlan }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [categoryId, setCategoryId] = useState("home");
    const [accountId, setAccountId] = useState(state.accounts[0].id);
    const [dueDate, setDueDate] = useState(todayStr(addDays(/* @__PURE__ */ new Date(), 7)));
    const [repeat, setRepeat] = useState("\u6BCF\u6708");
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u8BA1\u5212\u4ED8\u6B3E"), state.planned.length ? [...state.planned].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map((p) => /* @__PURE__ */ React.createElement("div", { className: "list-item", key: p.id }, /* @__PURE__ */ React.createElement("div", { className: "avatar", style: { background: categoryById(p.categoryId).color + "22" } }, p.type === "income" ? "\u{1F4B5}" : categoryById(p.categoryId).icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body" }, p.name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, new Date(p.dueDate).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }), " \xB7 ", p.repeat, " \xB7 ", categoryById(p.categoryId).name)), /* @__PURE__ */ React.createElement("div", { className: `amount ${p.type === "income" ? "green" : "red"}` }, p.type === "income" ? "+" : "-", money(p.amount)), payPlan && dueLabel(p.dueDate).due && /* @__PURE__ */ React.createElement("button", { className: "chip pay-chip", onClick: () => payPlan(p.id) }, "\u8BB0\u5165"), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => updateState((s) => {
      s.planned = s.planned.filter((x) => x.id !== p.id);
    }), "aria-label": "\u5220\u9664\u8BA1\u5212" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.trash)))) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u8BA1\u5212\u4ED8\u6B3E"), /* @__PURE__ */ React.createElement("div", { className: "soft-divider" }), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u540D\u79F0"), /* @__PURE__ */ React.createElement("input", { className: "field", placeholder: "\u4F8B\u5982 \u623F\u79DF / \u4F1A\u5458 / \u5DE5\u8D44", value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u91D1\u989D"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", min: "0", step: "0.01", placeholder: "1200", value: amount, onChange: (e) => setAmount(e.target.value) })), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u7C7B\u578B"), /* @__PURE__ */ React.createElement("select", { className: "field", value: type, onChange: (e) => setType(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "expense" }, "\u652F\u51FA"), /* @__PURE__ */ React.createElement("option", { value: "income" }, "\u6536\u5165"))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u5206\u7C7B"), /* @__PURE__ */ React.createElement("select", { className: "field", value: categoryId, onChange: (e) => setCategoryId(e.target.value) }, CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.icon, " ", c.name)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u8D26\u6237"), /* @__PURE__ */ React.createElement("select", { className: "field", value: accountId, onChange: (e) => setAccountId(e.target.value) }, state.accounts.map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.name)))), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u65E5\u671F"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) })), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u91CD\u590D"), /* @__PURE__ */ React.createElement("select", { className: "field", value: repeat, onChange: (e) => setRepeat(e.target.value) }, /* @__PURE__ */ React.createElement("option", null, "\u4E00\u6B21"), /* @__PURE__ */ React.createElement("option", null, "\u6BCF\u5468"), /* @__PURE__ */ React.createElement("option", null, "\u6BCF\u6708"), /* @__PURE__ */ React.createElement("option", null, "\u6BCF\u5E74")))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => {
      if (!name.trim() || !Number(amount)) {
        setToast("\u9700\u8981\u586B\u5199\u540D\u79F0\u548C\u91D1\u989D\u3002");
        return;
      }
      updateState((s) => s.planned.push({ id: uid("p"), name: name.trim(), amount: Number(amount), type, categoryId, accountId, dueDate, repeat }));
      setName("");
      setAmount("");
      setToast("\u8BA1\u5212\u4ED8\u6B3E\u5DF2\u6DFB\u52A0\u3002");
    } }, "\u6DFB\u52A0\u8BA1\u5212"));
  }
  function GoalsSheet({ state, updateState, setToast }) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-title", style: { marginBottom: 14 } }, "\u50A8\u84C4\u76EE\u6807"), state.goals.length ? state.goals.map((g) => /* @__PURE__ */ React.createElement(GoalCard, { key: g.id, goal: g, updateState, setToast })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, "\u8FD8\u6CA1\u6709\u50A8\u84C4\u76EE\u6807\uFF0C\u5B9A\u4E00\u4E2A\u5C0F\u76EE\u6807\u5427\u3002"), /* @__PURE__ */ React.createElement("div", { className: "soft-divider" }), /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u76EE\u6807\u540D\u79F0"), /* @__PURE__ */ React.createElement("input", { className: "field", placeholder: "\u4F8B\u5982 \u65C5\u884C\u57FA\u91D1", value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement("label", { className: "form-row" }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u76EE\u6807\u91D1\u989D"), /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", min: "0", placeholder: "3000", value: target, onChange: (e) => setTarget(e.target.value) }))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => {
      if (!name.trim() || !Number(target)) {
        setToast("\u9700\u8981\u586B\u5199\u76EE\u6807\u540D\u79F0\u548C\u91D1\u989D\u3002");
        return;
      }
      updateState((s) => s.goals.push({ id: uid("g"), name: name.trim(), icon: "\u{1F437}", target: Number(target), saved: 0 }));
      setName("");
      setTarget("");
      setToast("\u50A8\u84C4\u76EE\u6807\u5DF2\u6DFB\u52A0\u3002");
    } }, "\u6DFB\u52A0\u76EE\u6807"));
  }
  function GoalCard({ goal, updateState, setToast }) {
    const [value, setValue] = useState("");
    const pct = goal.target ? Math.min(100, Math.round(goal.saved / goal.target * 100)) : 0;
    const done = goal.target > 0 && goal.saved >= goal.target;
    return /* @__PURE__ */ React.createElement("div", { className: "card", style: { margin: "0 0 12px" } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { fontWeight: 800 } }, goal.icon, " ", goal.name, " ", done ? "\u{1F3C6}" : ""), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => updateState((s) => {
      s.goals = s.goals.filter((x) => x.id !== goal.id);
    }), "aria-label": "\u5220\u9664\u76EE\u6807" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.trash))), /* @__PURE__ */ React.createElement(Progress, { pct }), /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginTop: 7 } }, /* @__PURE__ */ React.createElement("span", { className: "caption" }, money(goal.saved), " / ", money(goal.target), " \xB7 ", pct, "%")), !done && /* @__PURE__ */ React.createElement("div", { className: "form-grid", style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("input", { className: "field", type: "number", min: "0", step: "0.01", placeholder: "\u5B58\u5165\u91D1\u989D", value, onChange: (e) => setValue(e.target.value) }), /* @__PURE__ */ React.createElement("button", { className: "btn secondary", onClick: () => {
      if (!Number(value)) {
        setToast("\u9700\u8981\u586B\u5199\u5B58\u5165\u91D1\u989D\u3002");
        return;
      }
      updateState((s) => {
        const g = s.goals.find((x) => x.id === goal.id);
        if (!g) return;
        const wasDone = g.target > 0 && g.saved >= g.target;
        g.saved = Number((g.saved + Number(value)).toFixed(2));
        if (!wasDone && g.target > 0 && g.saved >= g.target) s.mascot.xp += 200;
      });
      setValue("");
      setToast("\u5DF2\u8BA1\u5165\u50A8\u84C4\u76EE\u6807\u3002");
    } }, "\u5B58\u5165")));
  }
  function TransactionRow({ tx, onEdit }) {
    if (tx.type === "transfer") {
      return /* @__PURE__ */ React.createElement("div", { className: "list-item" }, /* @__PURE__ */ React.createElement("div", { className: "avatar", style: { background: "#3B82F622" } }, "\u{1F501}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tx.note || "\u8F6C\u8D26"), /* @__PURE__ */ React.createElement("div", { className: "caption" }, accountName(tx.accountId), " \u2192 ", accountName(tx.toAccountId), " \xB7 ", new Date(tx.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }))), /* @__PURE__ */ React.createElement("div", { className: "amount muted" }, money(tx.amount)), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onEdit, "aria-label": "\u7F16\u8F91\u8D26\u5355" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.edit)));
    }
    const c = categoryById(tx.categoryId);
    const path = categoryName(tx.categoryId);
    return /* @__PURE__ */ React.createElement("div", { className: "list-item" }, /* @__PURE__ */ React.createElement("div", { className: "avatar", style: { background: c.color + "22" } }, c.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tx.note), /* @__PURE__ */ React.createElement("div", { className: "caption" }, path, " \xB7 ", new Date(tx.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }))), /* @__PURE__ */ React.createElement("div", { className: `amount ${tx.type === "income" ? "green" : ""}` }, tx.type === "income" ? "+" : "-", money(tx.amount)), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: onEdit, "aria-label": "\u7F16\u8F91\u8D26\u5355" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, ICONS.edit)));
  }
  function dueLabel(dateStr) {
    const diff = Math.round((new Date(dateStr) - new Date(todayStr())) / 864e5);
    if (diff < 0) return { text: `\u5DF2\u903E\u671F ${-diff} \u5929`, due: true };
    if (diff === 0) return { text: "\u4ECA\u5929\u5230\u671F", due: true };
    if (diff === 1) return { text: "\u660E\u5929\u5230\u671F", due: false };
    return { text: `${diff} \u5929\u540E`, due: false };
  }
  function PlannedRow({ plan, onPay }) {
    const c = categoryById(plan.categoryId);
    const dl = dueLabel(plan.dueDate);
    return /* @__PURE__ */ React.createElement("div", { className: "list-item" }, /* @__PURE__ */ React.createElement("div", { className: "avatar", style: { background: c.color + "22" } }, plan.type === "income" ? "\u{1F4B5}" : c.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "body", style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, plan.name), /* @__PURE__ */ React.createElement("div", { className: "caption" }, new Date(plan.dueDate).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }), " \xB7 ", plan.repeat, " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: dl.due ? "warn" : "" }, dl.text))), /* @__PURE__ */ React.createElement("div", { className: `amount ${plan.type === "income" ? "green" : "red"}` }, plan.type === "income" ? "+" : "-", money(plan.amount)), onPay && dl.due && /* @__PURE__ */ React.createElement("button", { className: "chip pay-chip", onClick: onPay }, plan.type === "income" ? "\u5165\u8D26" : "\u8BB0\u5165"));
  }
  function NavRow({ icon, title, sub, onClick }) {
    return /* @__PURE__ */ React.createElement("div", { className: "nav-row", onClick }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "body" }, title), sub && /* @__PURE__ */ React.createElement("div", { className: "caption" }, sub))), /* @__PURE__ */ React.createElement("span", { className: "caption" }, "\u203A"));
  }
  function Leo({ mood, size }) {
    return /* @__PURE__ */ React.createElement("div", { className: `leo ${mood === "running" ? "running" : ""}`, style: size ? { width: size, height: size, flex: `0 0 ${size}px` } : null }, /* @__PURE__ */ React.createElement("span", { className: "leo-face", style: size ? { fontSize: 52 } : null }, MOOD[mood].face));
  }
  function Progress({ pct, color = "#00C805" }) {
    return /* @__PURE__ */ React.createElement("div", { className: "progress" }, /* @__PURE__ */ React.createElement("span", { style: { width: `${Math.min(100, Math.max(0, pct))}%`, background: color } }));
  }
  function BudgetRow({ b }) {
    const c = categoryById(b.categoryId);
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { marginBottom: 7 } }, /* @__PURE__ */ React.createElement("span", { className: "body" }, c.icon, " ", c.name), /* @__PURE__ */ React.createElement("span", { className: "caption", style: { color: budgetColor(b.pct) } }, money(b.spent), " / ", money(b.amount))), /* @__PURE__ */ React.createElement(Progress, { pct: b.pct, color: budgetColor(b.pct) }));
  }
  function trendSeries(state, days) {
    const points = Math.min(days, 30);
    const total = state.accounts.reduce((a, x) => a + Number(x.balance || 0), 0);
    const first = /* @__PURE__ */ new Date();
    first.setDate(first.getDate() - days + 1);
    const daily = [];
    for (let i = 0; i < points; i++) {
      const d = new Date(first);
      d.setDate(d.getDate() + Math.round(i * (days - 1) / Math.max(1, points - 1)));
      const ds = todayStr(d);
      const futureDelta = state.transactions.filter((t) => t.date > ds).reduce((sum, t) => sum + signedAmount(t, null), 0);
      daily.push(Math.max(0, total - futureDelta));
    }
    return daily;
  }
  function monthlyExpenseSeries(state) {
    const arr = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthStr(d);
      const sum = state.transactions.filter((t) => monthStr(t.date) === key && t.type === "expense").reduce((a, t) => a + t.amount, 0);
      arr.push({ label: d.getMonth() + 1 + "\u6708", value: sum });
    }
    return arr;
  }
  function budgetColor(pct) {
    return pct >= 100 ? "#FF5A5F" : pct >= 80 ? "#FFB020" : "#00C805";
  }
  function spendingSummary(metrics, slices) {
    const budget = [...metrics.budgets].sort((a, b) => b.pct - a.pct)[0];
    if (budget && budget.pct >= 80) {
      return { level: "warn", mood: budget.pct >= 100 ? "angry" : "concerned", title: `${categoryById(budget.categoryId).name}\u9884\u7B97${budget.pct >= 100 ? "\u5DF2\u8D85\u652F" : "\u5FEB\u89C1\u5E95\u4E86"}`, text: `\u672C\u6708${categoryById(budget.categoryId).name}\u5DF2\u7528 ${budget.pct}%\uFF0C\u63A5\u4E0B\u6765\u7559\u610F\u8FD9\u7C7B\u6D88\u8D39\u3002` };
    }
    const top = slices[0];
    if (top && metrics.monthExpense > 0) {
      return { level: "ok", mood: "happy", title: "\u6D88\u8D39\u7ED3\u6784\u6E05\u6670", text: `\u672C\u6708\u6700\u5927\u652F\u51FA\u662F${top.name}\uFF0C\u5360\u6BD4 ${Math.round(top.value / metrics.monthExpense * 100)}%\u3002` };
    }
    return { level: "ok", mood: "happy", title: "\u5F00\u59CB\u8BB0\u5F55\u7B2C\u4E00\u7B14", text: "\u8BB0\u4E0B\u51E0\u7B14\u4E4B\u540E\uFF0C\u8FD9\u91CC\u4F1A\u5C55\u793A\u5206\u7C7B\u5360\u6BD4\u3001\u8D8B\u52BF\u548C\u9884\u7B97\u63D0\u9192\u3002" };
  }
  function LineChart({ data, color }) {
    const w = 340, h = 118, pad = 8;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const span = max - min || 1;
    const pts = data.map((v, i) => {
      const x = pad + i * ((w - pad * 2) / Math.max(1, data.length - 1));
      const y = pad + (h - pad * 2) * (1 - (v - min) / span);
      return [x, y];
    });
    const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const area = `${path} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;
    return /* @__PURE__ */ React.createElement("svg", { className: "mini-chart", viewBox: `0 0 ${w} ${h}` }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "lineFill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: color, stopOpacity: ".28" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: color, stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("path", { d: area, fill: "url(#lineFill)" }), /* @__PURE__ */ React.createElement("path", { d: path, fill: "none", stroke: color, strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: "4", fill: color }));
  }
  function Donut({ slices }) {
    const visible = slices.length ? slices : [{ color: "#23262D", value: 1 }];
    const total = visible.reduce((a, s) => a + s.value, 0) || 1;
    const r = 52, c = 2 * Math.PI * r;
    let acc = 0;
    return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 140 140", width: "140", height: "140" }, /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "70", r, fill: "none", stroke: "#0F1216", strokeWidth: "16" }), visible.map((s, i) => {
      const frac = s.value / total;
      const dash = frac * c;
      const el = /* @__PURE__ */ React.createElement("circle", { key: i, cx: "70", cy: "70", r, fill: "none", stroke: s.color, strokeWidth: "16", strokeDasharray: `${dash} ${c - dash}`, strokeDashoffset: -acc * c, transform: "rotate(-90 70 70)" });
      acc += frac;
      return el;
    }), /* @__PURE__ */ React.createElement("text", { x: "70", y: "64", textAnchor: "middle", fill: "#9AA0AA", fontSize: "11" }, "\u603B\u652F\u51FA"), /* @__PURE__ */ React.createElement("text", { x: "70", y: "84", textAnchor: "middle", fill: "#FFFFFF", fontSize: "18", fontWeight: "800" }, total >= 1e3 ? "$" + (total / 1e3).toFixed(1) + "k" : money(total).replace(".00", "")));
  }
  function BarChart({ data }) {
    const max = Math.max(...data.map((d) => d.value), 1);
    return /* @__PURE__ */ React.createElement("div", { className: "bar-chart" }, data.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.label, className: "bar-col" }, /* @__PURE__ */ React.createElement("div", { className: "bar", style: { height: Math.max(5, d.value / max * 92), background: i === data.length - 1 ? "#00C805" : "#24303A" } }), /* @__PURE__ */ React.createElement("span", { className: "caption", style: { fontSize: 10 } }, d.label))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
