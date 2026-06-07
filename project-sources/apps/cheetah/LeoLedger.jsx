const { useEffect, useMemo, useState } = React;

const KEY = "leoledger_jsx_v3";

const CAT_ICONS = ["🍜","🍔","☕","🛒","🛍️","🚇","🚗","✈️","🏠","💡","💊","🏥","🎬","🎮","📚","💪","🐶","🎁","💼","💵","💰","📈","✂️","🧾","📦","❤️","🌍","👕","💄","🍷"];
const CAT_COLORS = ["#FF5A5F","#3B82F6","#A855F7","#F59E0B","#10B981","#14B8A6","#EC4899","#8B5CF6","#0EA5E9","#F43F5E","#22C55E","#EAB308","#00C805","#9AA0AA"];
const ACCOUNT_TYPES = [
  { id:"cash", label:"Cash", desc:"钱包、现金", icon:"💵", color:"#00C805", type:"现金" },
  { id:"current", label:"Current account", desc:"日常交易主账户", icon:"🏦", color:"#3B82F6", type:"现金" },
  { id:"overdraft", label:"Account with overdraft", desc:"允许透支的支票账户", icon:"💱", color:"#3B82F6", type:"信用" },
  { id:"credit", label:"Credit card", desc:"银行信用卡", icon:"💳", color:"#A30E5B", type:"信用" },
  { id:"saving", label:"Saving account", desc:"有利息的银行储蓄", icon:"🐷", color:"#14B8A6", type:"储蓄" },
  { id:"invest", label:"Investments", desc:"股票、ETF、加密货币等", icon:"📈", color:"#F59E0B", type:"投资" },
  { id:"other", label:"Other", desc:"保险、贷款、房贷等", icon:"🧾", color:"#8B5CF6", type:"其他" }
];
function defaultCategories(){
  return [
    { id:"food", name:"餐饮", icon:"🍜", color:"#FF5A5F", children:[
      { id:"food_grocery", name:"食材采购", children:[
        {id:"fg_kroger",name:"Kroger"},{id:"fg_costco",name:"Costco"},{id:"fg_whole",name:"Whole Foods"},{id:"fg_target",name:"Target"},{id:"fg_walmart",name:"Walmart"}
      ]},
      { id:"food_dineout", name:"外卖&餐厅", children:[
        {id:"fd_chipotle",name:"Chipotle"},{id:"fd_delivery",name:"外卖"},{id:"fd_restaurant",name:"餐厅"}
      ]},
      { id:"food_coffee", name:"咖啡&饮品", children:[] }
    ]},
    { id:"transit", name:"交通", icon:"🚇", color:"#3B82F6", children:[
      {id:"tr_taxi",name:"打车"},{id:"tr_pub",name:"公共交通"},{id:"tr_fuel",name:"加油"},{id:"tr_park",name:"停车"},{id:"tr_trip",name:"长途出行"}
    ]},
    { id:"shopping", name:"购物", icon:"🛍️", color:"#A855F7", children:[
      {id:"sh_cloth",name:"服饰"},{id:"sh_digital",name:"数码"},{id:"sh_beauty",name:"美妆"},{id:"sh_daily",name:"日用品"}
    ]},
    { id:"entertainment", name:"娱乐", icon:"🎬", color:"#F59E0B", children:[
      {id:"en_movie",name:"影音"},{id:"en_game",name:"游戏"},{id:"en_sub",name:"订阅会员"},{id:"en_event",name:"演出门票"}
    ]},
    { id:"home", name:"居家", icon:"🏠", color:"#10B981", children:[
      {id:"ho_rent",name:"房租"},{id:"ho_util",name:"水电"},{id:"ho_net",name:"网络"},{id:"ho_furn",name:"家居"}
    ]},
    { id:"health", name:"健康", icon:"💊", color:"#14B8A6", children:[
      {id:"he_med",name:"医疗"},{id:"he_fit",name:"健身"},{id:"he_drug",name:"药品"}
    ]},
    { id:"income", name:"收入", icon:"💵", color:"#00C805", income:true, children:[
      {id:"in_salary",name:"工资"},{id:"in_bonus",name:"奖金"},{id:"in_reimb",name:"报销"},{id:"in_side",name:"兼职"},{id:"in_other",name:"其他收入"}
    ]},
    { id:"other", name:"其他", icon:"📦", color:"#9AA0AA", children:[] }
  ];
}
function fillCats(nodes, parent){
  return (Array.isArray(nodes) ? nodes : []).map(n => {
    const node = {
      id: n.id || ((parent ? parent.id + "_" : "c_") + Math.random().toString(36).slice(2,7)),
      name: n.name || "未命名",
      icon: n.icon || (parent ? parent.icon : "📦"),
      color: n.color || (parent ? parent.color : "#9AA0AA"),
      income: parent ? parent.income : !!n.income
    };
    node.children = fillCats(n.children || n.subs || [], node);
    return node;
  });
}
let CATEGORIES = fillCats(defaultCategories());
let ACCOUNTS = [];
function accountName(id){ const a = ACCOUNTS.find(x => x.id === id); return a ? a.name : "账户"; }
function signedAmount(t, acctId){
  if(t.type === "income") return t.amount;
  if(t.type === "expense") return -t.amount;
  if(t.type === "transfer"){
    if(acctId && t.accountId === acctId) return -t.amount;
    if(acctId && t.toAccountId === acctId) return t.amount;
    return 0;
  }
  return 0;
}
function removeNode(nodes, id){
  for(let i=0;i<nodes.length;i++){
    if(nodes[i].id === id){ nodes.splice(i,1); return true; }
    if(nodes[i].children && removeNode(nodes[i].children, id)) return true;
  }
  return false;
}
function catPath(id, nodes = CATEGORIES, trail = []){
  for(const n of nodes){
    const t = trail.concat(n);
    if(n.id === id) return t;
    if(n.children && n.children.length){ const r = catPath(id, n.children, t); if(r) return r; }
  }
  return null;
}
function categoryById(id){
  const pth = catPath(id);
  return pth ? pth[pth.length - 1] : CATEGORIES[CATEGORIES.length - 1];
}
function topCategory(id){
  const pth = catPath(id);
  return pth ? pth[0] : CATEGORIES[CATEGORIES.length - 1];
}
function categoryName(id){
  const pth = catPath(id);
  return pth ? pth.map(n => n.name).join(" · ") : "其他";
}
function flattenCats(nodes = CATEGORIES, out = []){
  (nodes || []).forEach(n => { out.push(n); if(n.children) flattenCats(n.children, out); });
  return out;
}
function txCountForCat(transactions, id){
  return transactions.filter(t => { const pth = catPath(t.categoryId); return pth && pth.some(n => n.id === id); }).length;
}

const LEVELS = [
  { lv:1, title:"新手豹" }, { lv:5, title:"理财学徒" }, { lv:10, title:"预算达人" },
  { lv:20, title:"储蓄专家" }, { lv:30, title:"投资观察员" }, { lv:50, title:"财富猎手" }
];

const MOOD = {
  happy:{ label:"Happy", face:"😺", line:"今天控制得不错。" },
  concerned:{ label:"Concerned", face:"😟", line:"奶茶预算快见底了。" },
  angry:{ label:"Angry", face:"😠", line:"连续超支了，我们认真看一下。" },
  excited:{ label:"Excited", face:"😆", line:"这周比上周省下了一些，继续保持！" },
  running:{ label:"Running", face:"😼", line:"距离目标只差一步！" },
  sleeping:{ label:"Sleeping", face:"😴", line:"Leo 已经等你好几天了。" }
};

const ICONS = {
  home:<><path d="M4 10.5 12 4l8 6.5"/><path d="M6 10v10h12V10"/><path d="M12 13v4"/><path d="M9.5 15h5"/></>,
  add:<><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
  planning:<><path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9"/><path d="M18.5 4.5 21 2"/></>,
  insights:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  profile:<><circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
  edit:<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  trash:<><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/><path d="M10 11v6M14 11v6"/></>,
  close:<path d="M18 6 6 18M6 6l12 12"/>,
  back:<path d="m15 18-6-6 6-6"/>,
  search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>
};

function uid(prefix){
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}
function dateInputValue(d){
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
}
function todayStr(d = new Date()){ return dateInputValue(d); }
function addDays(d, days){
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function nextDue(dateStr, repeat){
  const d = new Date(dateStr);
  if(repeat === "每周") d.setDate(d.getDate() + 7);
  else if(repeat === "每月") d.setMonth(d.getMonth() + 1);
  else if(repeat === "每年") d.setFullYear(d.getFullYear() + 1);
  else return null;
  return dateInputValue(d);
}
function monthStr(d){
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}`;
}
function money(n){
  return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function clone(x){
  return typeof structuredClone === "function" ? structuredClone(x) : JSON.parse(JSON.stringify(x));
}

function seed(){
  const now = new Date();
  const tx = [];
  const samples = [
    [12,"food","午饭",0,"expense"], [8.5,"transit","打车",0,"expense"],
    [28,"shopping","买了一件 T 恤",1,"expense"], [4.5,"food","奶茶",1,"expense"],
    [60,"entertainment","电影票 x2",2,"expense"], [15,"food","晚饭",2,"expense"],
    [3200,"income","工资到账",3,"income"], [120,"home","水电费",4,"expense"],
    [9,"food","早餐",5,"expense"], [22,"transit","地铁充值",6,"expense"]
  ];
  samples.forEach((row, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - row[3]);
    tx.push({ id:"s"+i, amount:row[0], categoryId:row[1], accountId:"daily", note:row[2], date:dateInputValue(d), type:row[4] });
  });
  return {
    welcomed:true,
    categories:fillCats(defaultCategories()),
    transactions:tx,
    accounts:[
      { id:"daily", name:"日常", balance:842.50, type:"现金", accType:"cash", icon:"💵", color:"#00C805" },
      { id:"card", name:"信用卡", balance:0, type:"信用", accType:"credit", icon:"💳", color:"#A30E5B" },
      { id:"saving", name:"储蓄", balance:0, type:"储蓄", accType:"saving", icon:"🏦", color:"#14B8A6" }
    ],
    budgets:[
      { id:"b1", categoryId:"food", amount:600, month:monthStr(now) },
      { id:"b2", categoryId:"transit", amount:200, month:monthStr(now) },
      { id:"b3", categoryId:"shopping", amount:400, month:monthStr(now) }
    ],
    goals:[
      { id:"g1", name:"换新手机", icon:"📱", target:1000, saved:850 },
      { id:"g2", name:"旅行基金", icon:"✈️", target:3000, saved:620 }
    ],
    planned:[
      { id:"p1", name:"房租", amount:1200, type:"expense", categoryId:"home", accountId:"daily", dueDate:dateInputValue(addDays(now, 4)), repeat:"每月" },
      { id:"p2", name:"Netflix", amount:15.99, type:"expense", categoryId:"entertainment", accountId:"card", dueDate:dateInputValue(addDays(now, 9)), repeat:"每月" },
      { id:"p3", name:"工资", amount:3200, type:"income", categoryId:"income", accountId:"daily", dueDate:dateInputValue(addDays(now, 16)), repeat:"每月" }
    ],
    allocation:{ income:null, buckets:[
      { id:"al_invest", name:"投资", pct:15, color:"#F59E0B" },
      { id:"al_save", name:"储蓄", pct:30, color:"#14B8A6" },
      { id:"al_daily", name:"日常花销", pct:15, color:"#3B82F6" },
      { id:"al_fixed", name:"固定开销", pct:40, color:"#A855F7" }
    ] },
    templates:[
      { id:"tpl1", name:"早餐", amount:0, type:"expense", categoryId:"food", accountId:"daily", note:"早餐" },
      { id:"tpl2", name:"咖啡", amount:0, type:"expense", categoryId:"food_coffee", accountId:"daily", note:"咖啡" },
      { id:"tpl3", name:"地铁", amount:0, type:"expense", categoryId:"tr_pub", accountId:"daily", note:"地铁" },
      { id:"tpl4", name:"工资", amount:0, type:"income", categoryId:"in_salary", accountId:"daily", note:"工资到账" }
    ],
    mascot:{ xp:480, streakDays:12, lastEntry:todayStr(now) },
    pro:false
  };
}
function normalize(raw){
  const base = seed();
  const s = raw || base;
  const categories = Array.isArray(s.categories) && s.categories.length ? fillCats(s.categories) : base.categories;
  const allIds = new Set(flattenCats(categories).map(n => n.id));
  return {
    welcomed: s.welcomed !== false,
    categories,
    transactions: Array.isArray(s.transactions) ? s.transactions.map(t => ({
      id:t.id || uid("t"),
      amount:Number(t.amount) || 0,
      categoryId:(t.subId && allIds.has(t.subId)) ? t.subId : (allIds.has(t.categoryId || t.category) ? (t.categoryId || t.category) : "other"),
      accountId:t.accountId || "daily",
      toAccountId:t.toAccountId || null,
      note:t.note || "",
      date:dateInputValue(t.date || new Date()),
      type:t.type === "transfer" ? "transfer" : (t.type === "income" ? "income" : "expense")
    })) : base.transactions,
    accounts: Array.isArray(s.accounts) && s.accounts.length ? s.accounts.map(a => ({
      id:a.id || uid("a"),
      name:a.name || "账户",
      balance:Number(a.balance) || 0,
      type:a.type || "现金",
      accType:a.accType || "cash",
      icon:a.icon || "💰",
      color:a.color || "#3B82F6"
    })) : base.accounts,
    budgets: Array.isArray(s.budgets) ? s.budgets : base.budgets,
    goals: Array.isArray(s.goals) ? s.goals : base.goals,
    planned: Array.isArray(s.planned) ? s.planned.map(p => ({
      id:p.id || uid("p"),
      name:p.name || "",
      amount:Number(p.amount) || 0,
      type:p.type === "income" ? "income" : "expense",
      categoryId:(p.subId && allIds.has(p.subId)) ? p.subId : (allIds.has(p.categoryId) ? p.categoryId : "other"),
      accountId:p.accountId || "daily",
      dueDate:dateInputValue(p.dueDate || new Date()),
      repeat:p.repeat || "一次"
    })) : base.planned,
    allocation: (() => {
      const a = s.allocation || base.allocation;
      return {
        income: (a.income === null || a.income === undefined) ? null : (Number(a.income) || 0),
        buckets: Array.isArray(a.buckets) && a.buckets.length ? a.buckets.map(b => ({ id:b.id || uid("al"), name:b.name || "分配", pct:Number(b.pct) || 0, color:b.color || "#3B82F6" })) : base.allocation.buckets
      };
    })(),
    templates: Array.isArray(s.templates) ? s.templates.map(t => ({
      id:t.id || uid("tpl"),
      name:t.name || "模板",
      amount:Number(t.amount) || 0,
      type:t.type === "income" ? "income" : "expense",
      categoryId:allIds.has(t.categoryId) ? t.categoryId : "other",
      accountId:t.accountId || "daily",
      note:t.note || ""
    })) : base.templates,
    mascot: Object.assign({}, base.mascot, s.mascot || {}),
    pro: !!s.pro
  };
}
function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : seed();
  }catch(e){
    return seed();
  }
}

function buildMetrics(state){
  const now = new Date();
  const thisMonth = monthStr(now);
  const monthTx = state.transactions.filter(t => monthStr(t.date) === thisMonth);
  const monthExpense = monthTx.filter(t => t.type === "expense").reduce((a,t) => a + t.amount, 0);
  const monthIncome = monthTx.filter(t => t.type === "income").reduce((a,t) => a + t.amount, 0);
  const totalAssets = state.accounts.reduce((a,x) => a + Number(x.balance || 0), 0);
  const today0 = new Date(todayStr(now));
  const duePlans = state.planned
    .filter(p => new Date(p.dueDate) <= today0)
    .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  const upcoming = state.planned
    .filter(p => new Date(p.dueDate) > today0)
    .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  const next30 = upcoming.filter(p => new Date(p.dueDate) <= addDays(now, 30));
  const plannedIncome = next30.filter(p => p.type === "income").reduce((a,p) => a + p.amount, 0);
  const plannedExpense = next30.filter(p => p.type === "expense").reduce((a,p) => a + p.amount, 0);
  const projectedBalance = totalAssets + plannedIncome - plannedExpense;
  const catSpend = {};
  monthTx.filter(t => t.type === "expense").forEach(t => { const top = topCategory(t.categoryId).id; catSpend[top] = (catSpend[top] || 0) + t.amount; });
  const budgets = state.budgets.map(b => {
    const spent = monthTx.filter(t => t.type === "expense" && (catPath(t.categoryId) || []).some(n => n.id === b.categoryId)).reduce((a,t) => a + t.amount, 0);
    const pct = b.amount ? Math.round(spent / b.amount * 100) : 0;
    return { ...b, spent, pct };
  });
  const daysSince = Math.floor((new Date(todayStr(now)) - new Date(state.mascot.lastEntry || todayStr(now))) / 86400000);
  const over = budgets.filter(b => b.pct >= 100).length;
  const near = budgets.filter(b => b.pct >= 80 && b.pct < 100).length;
  let mood = "happy";
  if(daysSince >= 3) mood = "sleeping";
  else if(over >= 2) mood = "angry";
  else if(over || near) mood = "concerned";
  else if(monthIncome > 0 && (monthIncome - monthExpense) / monthIncome >= .25) mood = "excited";
  const li = levelInfo(state.mascot.xp || 0);
  return { now, thisMonth, monthTx, monthExpense, monthIncome, totalAssets, catSpend, budgets, daysSince, mood, li, net:monthIncome - monthExpense, duePlans, upcoming, next30, plannedIncome, plannedExpense, projectedBalance };
}
function levelInfo(xp){
  const lv = Math.max(1, Math.floor(xp / 100) + 1);
  let title = LEVELS[0].title;
  LEVELS.forEach(x => { if(lv >= x.lv) title = x.title; });
  const start = (lv - 1) * 100;
  return { lv, title, pct:Math.max(0, Math.min(100, Math.round((xp - start) / 100 * 100))), toNext:lv * 100 - xp };
}
function achievementState(state, metrics){
  const txCount = state.transactions.length;
  const budgetOk = metrics.budgets.length && metrics.budgets.every(b => b.pct <= 100);
  const goalDone = (state.goals || []).some(g => g.target > 0 && g.saved >= g.target);
  return [
    { id:"first", icon:"🐾", name:"第一笔", desc:"完成第一笔记账", unlocked:txCount > 0 },
    { id:"ten", icon:"📒", name:"记账新手", desc:"累计 10 笔账单", unlocked:txCount >= 10 },
    { id:"thirty", icon:"📚", name:"记账达人", desc:"累计 30 笔账单", unlocked:txCount >= 30 },
    { id:"week", icon:"🔥", name:"坚持一周", desc:"连续记账 7 天", unlocked:state.mascot.streakDays >= 7 },
    { id:"budget", icon:"🎯", name:"预算达人", desc:"预算仍在控制内", unlocked:budgetOk },
    { id:"goal", icon:"🏆", name:"目标达成", desc:"完成一个储蓄目标", unlocked:goalDone },
    { id:"lv5", icon:"🐆", name:"理财学徒", desc:"达到 Lv.5", unlocked:metrics.li.lv >= 5 }
  ];
}

function App(){
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
    if(!toast) return;
    const id = setTimeout(() => setToast(""), 2300);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if(!celebration) return;
    const id = setTimeout(() => setCelebration(null), 2600);
    return () => clearTimeout(id);
  }, [celebration]);

  const metrics = useMemo(() => buildMetrics(state), [state]);
  const prevLvRef = useRef(metrics.li.lv);
  const prevGoalsRef = useRef(state.goals.filter(g => g.target > 0 && g.saved >= g.target).length);
  useEffect(() => {
    if(metrics.li.lv > prevLvRef.current){
      setCelebration({ face:"🎉", title:`升级 Lv.${metrics.li.lv}`, sub:metrics.li.title });
    }
    prevLvRef.current = metrics.li.lv;
  }, [metrics.li.lv]);
  useEffect(() => {
    const done = state.goals.filter(g => g.target > 0 && g.saved >= g.target).length;
    if(done > prevGoalsRef.current){
      setCelebration({ face:"🏆", title:"储蓄目标达成！", sub:"Leo 为你高兴 · +200 XP" });
    }
    prevGoalsRef.current = done;
  }, [state.goals]);
  const editingTx = editingId ? state.transactions.find(t => t.id === editingId) : null;

  function updateState(mutator){
    setState(prev => {
      const next = clone(prev);
      mutator(next);
      return normalize(next);
    });
  }
  function accountById(id, s = state){
    return s.accounts.find(x => x.id === id) || s.accounts[0];
  }
  function applyAccountDelta(s, tx, sign){
    if(tx.type === "transfer"){
      const from = accountById(tx.accountId, s);
      const to = s.accounts.find(a => a.id === tx.toAccountId);
      if(from) from.balance = Number((Number(from.balance || 0) - sign * tx.amount).toFixed(2));
      if(to) to.balance = Number((Number(to.balance || 0) + sign * tx.amount).toFixed(2));
      return;
    }
    const account = accountById(tx.accountId, s);
    const delta = tx.type === "income" ? tx.amount : -tx.amount;
    account.balance = Number((Number(account.balance || 0) + sign * delta).toFixed(2));
  }
  function addTransaction(tx){
    updateState(s => {
      const item = { ...tx, id:uid("t"), amount:Number(tx.amount) || 0 };
      s.transactions.unshift(item);
      applyAccountDelta(s, item, 1);
      updateMascot(s);
    });
    setTab("home");
    setToast("已保存，Leo 记下这一笔了。");
  }
  function updateTransaction(id, tx){
    updateState(s => {
      const old = s.transactions.find(t => t.id === id);
      if(!old) return;
      applyAccountDelta(s, old, -1);
      Object.assign(old, tx, { amount:Number(tx.amount) || 0 });
      applyAccountDelta(s, old, 1);
    });
    setEditingId(null);
    setToast("账单已更新。");
  }
  function deleteTransaction(id){
    updateState(s => {
      const old = s.transactions.find(t => t.id === id);
      if(old) applyAccountDelta(s, old, -1);
      s.transactions = s.transactions.filter(t => t.id !== id);
    });
    setEditingId(null);
    setToast("账单已删除。");
  }
  function updateMascot(s){
    const today = todayStr();
    const last = s.mascot.lastEntry || today;
    const diff = Math.floor((new Date(today) - new Date(last)) / 86400000);
    if(diff === 1) s.mascot.streakDays += 1;
    else if(diff > 1) s.mascot.streakDays = 1;
    s.mascot.xp += s.mascot.streakDays % 7 === 0 ? 60 : 10;
    s.mascot.lastEntry = today;
  }
  function postPlan(s, p){
    const item = { id:uid("t"), amount:Number(p.amount) || 0, categoryId:p.categoryId, accountId:p.accountId, note:p.name, date:p.dueDate, type:p.type };
    s.transactions.unshift(item);
    applyAccountDelta(s, item, 1);
    const nd = nextDue(p.dueDate, p.repeat);
    if(nd) p.dueDate = nd;
    else s.planned = s.planned.filter(x => x.id !== p.id);
  }
  function payPlan(id){
    updateState(s => {
      const p = s.planned.find(x => x.id === id);
      if(!p) return;
      postPlan(s, p);
      updateMascot(s);
    });
    setToast("已入账 ✓ 计划已更新到下一期。");
  }
  function payAllDue(){
    const ids = metrics.duePlans.map(p => p.id);
    if(!ids.length) return;
    updateState(s => {
      ids.forEach(id => {
        const p = s.planned.find(x => x.id === id);
        if(p) postPlan(s, p);
      });
      updateMascot(s);
    });
    setToast(`已入账 ${ids.length} 笔计划付款 ✓`);
  }
  function addCategory(parentId, { name, icon, color, income }){
    updateState(s => {
      if(!parentId){
        s.categories.splice(s.categories.length - 1, 0, { id:uid("c"), name, icon, color, income:!!income, children:[] });
      } else {
        const pth = catPath(parentId, s.categories); const node = pth && pth[pth.length - 1];
        if(node){ node.children = node.children || []; node.children.push({ id:uid("c"), name, icon:icon || node.icon, color:color || node.color, income:node.income, children:[] }); }
      }
    });
    setToast("分类已添加。");
  }
  function updateCategory(id, patch){
    updateState(s => { const pth = catPath(id, s.categories); const node = pth && pth[pth.length - 1]; if(node) Object.assign(node, patch); });
    setToast("分类已更新。");
  }
  function deleteCategory(id){
    if(id === "other" || id === "income"){ setToast("该分类不可删除。"); return; }
    if(!confirm("删除后，其下账单会归到上一级（或「其他」）。确定删除吗？")) return;
    updateState(s => {
      const pth = catPath(id, s.categories);
      const parentId = pth && pth.length >= 2 ? pth[pth.length - 2].id : "other";
      const node = pth ? pth[pth.length - 1] : null;
      const ids = new Set();
      (function collect(n){ if(!n) return; ids.add(n.id); (n.children || []).forEach(collect); })(node);
      s.transactions.forEach(t => { if(ids.has(t.categoryId)) t.categoryId = parentId; });
      s.planned.forEach(pp => { if(ids.has(pp.categoryId)) pp.categoryId = parentId; });
      s.budgets = s.budgets.filter(b => !ids.has(b.categoryId));
      removeNode(s.categories, id);
    });
    setToast("分类已删除。");
  }
  function addTemplate(tpl){
    updateState(s => { s.templates = s.templates || []; s.templates.push({ id:uid("tpl"), name:tpl.name, amount:Number(tpl.amount) || 0, type:tpl.type, categoryId:tpl.categoryId, accountId:tpl.accountId, note:tpl.note || "" }); });
    setToast(`模板「${tpl.name}」已保存。`);
  }
  function deleteTemplate(id){
    updateState(s => { s.templates = (s.templates || []).filter(t => t.id !== id); });
    setToast("模板已删除。");
  }
  function addAccount({ name, type, accType, balance, icon, color }){
    updateState(s => s.accounts.push({ id:uid("a"), name, type:type || "现金", accType:accType || "cash", balance:Number(balance) || 0, icon:icon || "💰", color:color || "#3B82F6" }));
    setToast(`账户「${name}」已添加。`);
  }
  function updateAccount(id, patch){
    updateState(s => { const a = s.accounts.find(x => x.id === id); if(a) Object.assign(a, patch, patch.balance !== undefined ? { balance:Number(patch.balance) || 0 } : {}); });
    setToast("账户已更新。");
  }
  function deleteAccount(id){
    if(state.accounts.length <= 1){ setToast("至少保留一个账户。"); return; }
    if(!confirm("删除账户后，其账单会转到其它账户。确定删除吗？")) return;
    updateState(s => {
      const fallback = s.accounts.find(a => a.id !== id);
      const fid = fallback ? fallback.id : "daily";
      s.transactions.forEach(t => { if(t.accountId === id) t.accountId = fid; });
      s.planned.forEach(pp => { if(pp.accountId === id) pp.accountId = fid; });
      s.accounts = s.accounts.filter(a => a.id !== id);
    });
    setToast("账户已删除。");
  }
  function setAllocIncome(v){
    updateState(s => { s.allocation.income = (v === "" || v === null) ? null : (Number(v) || 0); });
  }
  function addBucket(){
    updateState(s => { s.allocation.buckets.push({ id:uid("al"), name:"新分配", pct:0, color:CAT_COLORS[s.allocation.buckets.length % CAT_COLORS.length] }); });
  }
  function updateBucket(id, patch){
    updateState(s => { const b = s.allocation.buckets.find(x => x.id === id); if(b) Object.assign(b, patch, patch.pct !== undefined ? { pct:Number(patch.pct) || 0 } : {}); });
  }
  function deleteBucket(id){
    updateState(s => { s.allocation.buckets = s.allocation.buckets.filter(x => x.id !== id); });
  }
  function reset(){
    if(!confirm("确定清空所有数据吗？将删除全部账单、预算、目标与计划，并把所有钱包余额清零。")) return;
    setState(prev => {
      const cleared = clone(prev);
      cleared.transactions = [];
      cleared.budgets = [];
      cleared.goals = [];
      cleared.planned = [];
      cleared.accounts = cleared.accounts.map(a => ({ ...a, balance:0 }));
      cleared.mascot = { xp:0, streakDays:0, lastEntry:todayStr() };
      return normalize(cleared);
    });
    setViewAccount(null);
    setSheet(null);
    setTab("home");
    setToast("所有数据已清空，钱包已清零。");
  }
  function exportCSV(){
    const rows = [["date","type","account","category","amount","note"]];
    state.transactions.forEach(t => rows.push([t.date,t.type,accountById(t.accountId).name,`"${categoryName(t.categoryId)}"`,t.amount,`"${String(t.note).replace(/"/g,'""')}"`]));
    download(`leoledger_export_${todayStr()}.csv`, rows.map(r => r.join(",")).join("\n"), "text/csv;charset=utf-8");
    setToast("CSV 已导出。");
  }
  function exportJSON(){
    download(`leoledger_backup_${todayStr()}.json`, JSON.stringify(state,null,2), "application/json;charset=utf-8");
    setToast("JSON 备份已生成。");
  }
  function importJSON(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        setState(normalize(JSON.parse(reader.result)));
        setToast("恢复成功。");
      }catch(e){
        setToast("文件校验失败。");
      }
    };
    reader.readAsText(file);
  }
  function download(name, content, type){
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ctx = {
    state, setState, updateState, metrics, tab, setTab, range, setRange, addOpen, setAddOpen,
    editingId, setEditingId, sheet, setSheet, alertDismissed, setAlertDismissed, txQuery, setTxQuery,
    txMonth, setTxMonth, txCat, setTxCat, addTransaction, updateTransaction, deleteTransaction,
    payPlan, payAllDue, addCategory, updateCategory, deleteCategory, addTemplate, deleteTemplate,
    addAccount, updateAccount, deleteAccount,
    viewAccount, setViewAccount,
    setAllocIncome, addBucket, updateBucket, deleteBucket,
    exportCSV, exportJSON, importJSON, reset, setToast, accountById
  };

  if(!state.welcomed){
    return <Welcome onStart={() => updateState(s => { s.welcomed = true; })} />;
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}
      {celebration && <Celebration data={celebration} onClose={() => setCelebration(null)} />}
      <main className="screen" key={viewAccount ? "acct:" + viewAccount : tab}>
        {viewAccount ? <AccountDetail {...ctx} /> : <>
          {tab === "home" && <Home {...ctx} />}
          {tab === "planning" && <Planning {...ctx} />}
          {tab === "insights" && <Insights {...ctx} />}
          {tab === "profile" && <Profile {...ctx} />}
          {tab === "transactions" && <Transactions {...ctx} />}
        </>}
      </main>
      {!addOpen && !editingTx && !sheet && (
        <button className="fab" onClick={() => setAddOpen(true)} aria-label="记一笔">
          <svg viewBox="0 0 24 24">{ICONS.add}</svg>
        </button>
      )}
      {!addOpen && <TabBar tab={viewAccount ? "" : tab} setTab={t => { setViewAccount(null); setTab(t); }} />}
      {addOpen && <AddRecordSheet {...ctx} />}
      {editingTx && <EditSheet tx={editingTx} {...ctx} />}
      {sheet && <ManageSheet {...ctx} />}
    </>
  );
}

function Welcome({ onStart }){
  return (
    <div className="screen welcome">
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",gap:18,padding:"0 8px"}}>
        <Leo mood="happy" size={120} />
        <div>
          <div className="title-md">Leo Ledger</div>
          <div className="caption" style={{marginTop:8,fontSize:14}}>快速记账，本地保存，Leo 陪你坚持。</div>
        </div>
      </div>
      <div style={{padding:"0 4px 8px"}}><button className="btn" onClick={onStart}>创建本地账本</button></div>
    </div>
  );
}

function Celebration({ data, onClose }){
  const sparks = ["✨","🎊","⭐","💫","🎉","🌟"];
  return (
    <div className="celebrate" onClick={onClose}>
      {sparks.map((s,i) => <span key={i} className="spark" style={{left:`${10 + i * 15}%`, animationDelay:`${i * 0.12}s`}}>{s}</span>)}
      <div className="big">{data.face}</div>
      <div className="ttl">{data.title}</div>
      {data.sub && <div className="sub">{data.sub}</div>}
    </div>
  );
}
function accountSeries(state, accountId, days){
  const points = Math.min(days, 30);
  const acc = state.accounts.find(a => a.id === accountId);
  const total = acc ? Number(acc.balance) || 0 : 0;
  const txs = state.transactions.filter(t => t.accountId === accountId || (t.type === "transfer" && t.toAccountId === accountId));
  const first = new Date(); first.setDate(first.getDate() - days + 1);
  const daily = [];
  for(let i = 0; i < points; i++){
    const d = new Date(first); d.setDate(d.getDate() + Math.round(i * (days - 1) / Math.max(1, points - 1)));
    const ds = todayStr(d);
    const futureDelta = txs.filter(t => t.date > ds).reduce((sum,t) => sum + signedAmount(t, accountId), 0);
    daily.push(total - futureDelta);
  }
  return daily;
}
function AccountDetail(props){
  const { state, viewAccount, setViewAccount, updateAccount, deleteAccount, setEditingId, setToast } = props;
  const [editing, setEditing] = useState(false);
  const account = state.accounts.find(a => a.id === viewAccount);
  if(!account) return null;
  const txs = [...state.transactions].filter(t => t.accountId === account.id || (t.type === "transfer" && t.toAccountId === account.id)).sort((a,b) => new Date(b.date) - new Date(a.date) || String(b.id).localeCompare(String(a.id)));
  const series = accountSeries(state, account.id, 30);
  const since = todayStr(addDays(new Date(), -30));
  const net30 = txs.filter(t => t.date >= since).reduce((a,t) => a + signedAmount(t, account.id), 0);
  const prev = account.balance - net30;
  const pct = prev ? Math.round(net30 / Math.abs(prev) * 100) : 0;
  const groups = {}; txs.forEach(t => { (groups[t.date] = groups[t.date] || []).push(t); });
  return (
    <>
      <div className="detail-top">
        <button className="icon-btn" onClick={() => setViewAccount(null)} aria-label="返回"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.back}</svg></button>
        <div className="detail-title">{account.icon} {account.name}</div>
        <button className="chip" onClick={() => setEditing(true)}>Edit</button>
      </div>
      <section className="card">
        <div className="row">
          <div className="caption">LAST 30 DAYS</div>
          <span className={`caption ${pct < 0 ? "red" : "green"}`}>{pct < 0 ? "↓" : "↑"} {Math.abs(pct)}%</span>
        </div>
        <div className={`title-lg ${account.balance < 0 ? "red" : ""}`} style={{margin:"2px 0 8px"}}>{money(account.balance)}</div>
        <LineChart data={series} color={account.balance < 0 ? "#FF5A5F" : "#00C805"} />
      </section>
      {txs.length ? Object.keys(groups).sort((a,b) => new Date(b) - new Date(a)).map(date => (
        <React.Fragment key={date}>
          <div className="day-head"><span className="d">{new Date(date).toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"short"})}</span></div>
          <section className="card">{groups[date].map(t => <TransactionRow key={t.id} tx={t} onEdit={() => setEditingId(t.id)} />)}</section>
        </React.Fragment>
      )) : <div className="empty">这个账户还没有账单</div>}
      {editing && <AccountEditor account={account} setToast={setToast}
        onSave={data => { updateAccount(account.id, data); setEditing(false); }}
        onDelete={() => { setEditing(false); deleteAccount(account.id); setViewAccount(null); }}
        onClose={() => setEditing(false)} />}
    </>
  );
}
function AllocationBar({ buckets }){
  const total = buckets.reduce((a,b) => a + b.pct, 0) || 100;
  return (
    <div className="alloc-bar">
      {buckets.map(b => <span key={b.id} style={{width:`${b.pct / total * 100}%`, background:b.color}} title={`${b.name} ${b.pct}%`} />)}
    </div>
  );
}
function AllocationSheet({ state, metrics, setAllocIncome, addBucket, updateBucket, deleteBucket, setToast }){
  const alloc = state.allocation;
  const base = alloc.income != null ? alloc.income : metrics.monthIncome;
  const total = alloc.buckets.reduce((a,b) => a + b.pct, 0);
  return (
    <>
      <div className="section-title" style={{marginBottom:14}}>收入分配</div>
      <label className="form-row">
        <span className="caption">月收入基数（留空则用本月收入 {money(metrics.monthIncome)}）</span>
        <input className="field" type="number" value={alloc.income == null ? "" : alloc.income} onChange={e => setAllocIncome(e.target.value)} placeholder={String(metrics.monthIncome)} />
      </label>
      <AllocationBar buckets={alloc.buckets} />
      <div className="row" style={{margin:"10px 2px 8px"}}>
        <span className="caption">合计</span>
        <span className={`caption ${total === 100 ? "green" : "warn"}`}>{total}%{total === 100 ? "" : " · 建议合计 100%"}</span>
      </div>
      {alloc.buckets.map(b => (
        <div className="card" key={b.id} style={{margin:"0 0 10px", padding:12}}>
          <div className="row" style={{gap:8}}>
            <span className="swatch" style={{background:b.color}} />
            <input className="field" value={b.name} onChange={e => updateBucket(b.id, { name:e.target.value })} style={{flex:1}} />
            <input className="field" type="number" value={b.pct} onChange={e => updateBucket(b.id, { pct:e.target.value })} style={{width:70}} />
            <span className="caption">%</span>
            <button className="icon-btn" onClick={() => deleteBucket(b.id)} aria-label="删除"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.trash}</svg></button>
          </div>
          <div className="caption" style={{marginTop:6}}>目标 = {money(base * b.pct / 100)}</div>
        </div>
      ))}
      <button className="btn secondary" onClick={addBucket}>+ 添加分配项</button>
    </>
  );
}
function AccountTypePicker({ accounts, onPick, onClose }){
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>
          <div className="picker-title">添加什么账户？</div>
          <span style={{width:34}} />
        </div>
        <div className="picker-body">
          <div className="picker-section">选择账户类型</div>
          {ACCOUNT_TYPES.map(t => {
            const count = accounts.filter(a => a.accType === t.id).length;
            return (
              <button key={t.id} type="button" className="type-row" onClick={() => onPick(t)}>
                <span className="type-ic" style={{background:t.color + "22", color:t.color}}>{t.icon}</span>
                <span className="type-text">
                  <span className="type-label">{t.label}</span>
                  <span className="type-desc">{t.desc}</span>
                </span>
                {count > 0 && <span className="type-count green">✓ {count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function AccountEditor({ account, preset, onSave, onDelete, onClose, setToast }){
  const initType = account ? (account.accType || "cash") : (preset ? preset.id : "cash");
  const [name, setName] = useState(account ? account.name : "");
  const [accType, setAccType] = useState(initType);
  const [balance, setBalance] = useState(account ? String(account.balance) : "");
  const [icon, setIcon] = useState(account ? account.icon : (preset ? preset.icon : "💰"));
  const [color, setColor] = useState(account ? account.color : (preset ? preset.color : "#3B82F6"));
  const typeObj = ACCOUNT_TYPES.find(t => t.id === accType) || ACCOUNT_TYPES[0];
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>
          <div className="picker-title">{account ? "编辑账户" : typeObj.label}</div>
          <span style={{width:34}} />
        </div>
        <div className="picker-body">
          <label className="form-row"><span className="caption">名称</span><input className="field" value={name} onChange={e => setName(e.target.value)} placeholder={typeObj.label} /></label>
          <div className="form-grid">
            <label className="form-row"><span className="caption">类型</span><select className="field" value={accType} onChange={e => setAccType(e.target.value)}>{ACCOUNT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
            <label className="form-row"><span className="caption">{account ? "余额" : "初始余额"}</span><input className="field" type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0" /></label>
          </div>
          <IconColorPicker icon={icon} setIcon={setIcon} color={color} setColor={setColor} />
          <button className="btn" style={{marginTop:14}} onClick={() => { if(!name.trim()){ setToast("请输入账户名称。"); return; } onSave({ name:name.trim(), type:typeObj.label, accType, balance:Number(balance) || 0, icon, color }); }}>保存</button>
          {account && onDelete && <button className="btn danger" style={{marginTop:10}} onClick={onDelete}>删除账户</button>}
        </div>
      </div>
    </div>
  );
}
function TabBar({ tab, setTab }){
  const tabs = [["home","Dashboard"],["planning","Planning"],["insights","Statistics"],["profile","More"]];
  return (
    <nav className="tabs">
      {tabs.map(([id,label]) => (
        <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)} aria-label={label}>
          <svg viewBox="0 0 24 24">{ICONS[id]}</svg><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Home(props){
  const { state, metrics, range, setRange, setTab, setSheet, setEditingId, alertDismissed, setAlertDismissed, payPlan, addAccount, updateAccount, deleteAccount, setViewAccount } = props;
  const recent = [...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
  const rangeDays = { "7D":7, "30D":30, "90D":90, "1Y":365 }[range];
  const series = trendSeries(state, rangeDays);
  const topBudget = [...metrics.budgets].sort((a,b) => b.pct - a.pct)[0];
  const topGoal = [...state.goals].filter(g => g.target > 0).sort((a,b) => (b.saved/b.target) - (a.saved/a.target))[0];
  const nextPlans = [...metrics.duePlans, ...metrics.upcoming].slice(0, 3);
  const [acctEditor, setAcctEditor] = useState(null);
  const [typePicker, setTypePicker] = useState(false);
  const cells = [...state.accounts, { add:true }];
  const acctPages = [];
  for(let i = 0; i < cells.length; i += 4) acctPages.push(cells.slice(i, i + 4));
  return (
    <>
      <BudgetAlert metrics={metrics} dismissed={alertDismissed} onDismiss={() => setAlertDismissed(metrics.thisMonth)} />
      <section className="wallets">
        <div className="wallet-pager">
          {acctPages.map((page, pi) => (
            <div className="wallet-page" key={pi}>
              {page.map(a => a.add ? (
                <button key="add" className="wallet-card add" onClick={() => setTypePicker(true)}>
                  <span className="wallet-add-ic">+</span>
                  <span className="wallet-add-label">Add account</span>
                </button>
              ) : (
                <div key={a.id} className="wallet-card" onClick={() => setViewAccount(a.id)}>
                  <span className="wallet-ic" style={{background:a.color}}>{a.icon}</span>
                  <div className="wallet-name">{a.name}</div>
                  <div className={`wallet-bal ${a.balance < 0 ? "red" : ""}`}>{money(a.balance)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {acctPages.length > 1 && <div className="dots">{acctPages.map((_, i) => <span key={i} className="dot" />)}</div>}
      </section>
      <section className="card">
        <div className="row" style={{marginBottom:4}}>
          <div className="section-title">Balance Trend</div>
          <span className={`caption ${metrics.net >= 0 ? "green" : "red"}`}>{metrics.net >= 0 ? "▲" : "▼"} 本月 {money(Math.abs(metrics.net))}</span>
        </div>
        <div className="caption">TODAY</div>
        <div className="title-lg" style={{marginBottom:8}}>{money(metrics.totalAssets)}</div>
        <LineChart data={series} color={metrics.net >= 0 ? "#00C805" : "#FF5A5F"} />
        <div className="segmented">
          {["7D","30D","90D","1Y"].map(r => <button key={r} className={`seg-btn ${range === r ? "active" : ""}`} onClick={() => setRange(r)}>{r}</button>)}
        </div>
      </section>
      <section className="stat-grid">
        <div className="stat"><div className="caption">本月收入</div><div className="v green">{money(metrics.monthIncome)}</div></div>
        <div className="stat"><div className="caption">本月支出</div><div className="v red">{money(metrics.monthExpense)}</div></div>
        <div className="stat"><div className="caption">计划支出</div><div className="v small red">{money(metrics.plannedExpense)}</div></div>
        <div className="stat"><div className="caption">预计余额</div><div className={`v small ${metrics.projectedBalance >= 0 ? "green" : "red"}`}>{money(metrics.projectedBalance)}</div></div>
      </section>
      <section className="card" onClick={() => setTab("profile")} style={{cursor:"pointer"}}>
        <div className="row">
          <Leo mood={metrics.mood} />
          <div style={{flex:1,minWidth:0}}>
            <div className="body" style={{fontWeight:800}}>{MOOD[metrics.mood].line}</div>
            <div className="caption" style={{marginTop:4}}>Lv.{metrics.li.lv} {metrics.li.title} · 连续 {state.mascot.streakDays} 天</div>
          </div>
          <span className="caption">›</span>
        </div>
      </section>
      {topBudget && (
        <section className="card">
          <div className="row" style={{marginBottom:8}}>
            <div className="body" style={{fontWeight:800}}>{categoryById(topBudget.categoryId).icon} {categoryById(topBudget.categoryId).name}预算</div>
            <div className={`caption ${topBudget.pct >= 100 ? "red" : topBudget.pct >= 80 ? "warn" : "green"}`}>{topBudget.pct}%</div>
          </div>
          <Progress pct={topBudget.pct} color={budgetColor(topBudget.pct)} />
        </section>
      )}
      {topGoal && (
        <>
          <div className="row" style={{margin:"6px 2px 9px"}}>
            <div className="section-title">储蓄目标</div>
            <button className="chip" onClick={() => setSheet("goals")}>管理</button>
          </div>
          <section className="card" onClick={() => setSheet("goals")} style={{cursor:"pointer"}}>
            <div className="row" style={{marginBottom:8}}>
              <div className="body" style={{fontWeight:800}}>{topGoal.icon} {topGoal.name}</div>
              <div className="caption">{money(topGoal.saved)} / {money(topGoal.target)}</div>
            </div>
            <Progress pct={Math.round(topGoal.saved / topGoal.target * 100)} />
            <div className="caption" style={{marginTop:7}}>{topGoal.saved >= topGoal.target ? "🏆 已达成！" : `还差 ${money(topGoal.target - topGoal.saved)}`}</div>
          </section>
        </>
      )}
      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">计划付款</div>
        <button className="chip" onClick={() => setSheet("planned")}>管理</button>
      </div>
      <section className="card">
        {nextPlans.length ? nextPlans.map(p => <PlannedRow key={p.id} plan={p} onPay={() => payPlan(p.id)} />) : <div className="empty">没有即将到期的计划</div>}
      </section>
      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">最近账单</div>
        <button className="chip" onClick={() => setTab("transactions")}>查看全部</button>
      </div>
      <section className="card">
        {recent.length ? recent.map(t => <TransactionRow key={t.id} tx={t} onEdit={() => setEditingId(t.id)} />) : <div className="empty">还没有账单，去记一笔吧</div>}
      </section>
      {typePicker && <AccountTypePicker accounts={state.accounts} onPick={t => { setTypePicker(false); setAcctEditor({ preset:t }); }} onClose={() => setTypePicker(false)} />}
      {acctEditor && <AccountEditor account={acctEditor.id ? acctEditor : null} preset={acctEditor.preset || null} setToast={props.setToast}
        onSave={data => { if(acctEditor.id) updateAccount(acctEditor.id, data); else addAccount(data); setAcctEditor(null); }}
        onDelete={acctEditor.id ? () => { deleteAccount(acctEditor.id); setAcctEditor(null); } : null}
        onClose={() => setAcctEditor(null)} />}
    </>
  );
}

function BudgetAlert({ metrics, dismissed, onDismiss }){
  const over = metrics.budgets.filter(b => b.pct >= 100);
  const near = metrics.budgets.filter(b => b.pct >= 80 && b.pct < 100);
  const hot = over[0] || near[0];
  if(!hot || dismissed === metrics.thisMonth) return null;
  const isOver = hot.pct >= 100;
  const c = categoryById(hot.categoryId);
  return (
    <section className={`alert ${isOver ? "over" : "near"}`}>
      <span style={{fontSize:20}}>{isOver ? "🚨" : "⚠️"}</span>
      <div style={{flex:1,minWidth:0}}>
        <div className="body" style={{fontWeight:800}}>{c.name}预算{isOver ? "已超支" : "快见底了"}</div>
        <div className="caption">本月{c.name}已用 {hot.pct}%</div>
      </div>
      <button className="icon-btn" onClick={onDismiss} aria-label="关闭提醒"><svg viewBox="0 0 24 24" width="16" height="16">{ICONS.close}</svg></button>
    </section>
  );
}

function AddRecordSheet({ state, addTransaction, setAddOpen, addTemplate, deleteTemplate, setToast }) {
  const [closing, setClosing] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);
  const [tx, setTx] = useState({ amount:"", categoryId:"food", accountId:state.accounts[0].id, toAccountId:(state.accounts[1] || state.accounts[0]).id, note:"", date:todayStr(), type:"expense", id:"new" });

  function requestClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(() => setAddOpen(false), 190);
  }
  useEffect(() => {
    function onKeyDown(e){ if (e.key === "Escape") { if(tplOpen) setTplOpen(false); else requestClose(); } }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closing, tplOpen]);
  function saveAndClose(t){ addTransaction(t); requestClose(); }
  function applyTemplate(t){
    setTx({ amount:"", categoryId:t.categoryId, accountId:t.accountId || state.accounts[0].id, note:t.note || "", date:todayStr(), type:t.type, id:"tpl" + Date.now() });
    setTplOpen(false);
    setToast(`已套用模板「${t.name}」`);
  }
  function saveAsTemplate(draft){
    const def = categoryById(draft.categoryId).name;
    const name = window.prompt ? window.prompt("模板名称", def) : def;
    if(name === null) return;
    addTemplate({ name:(name && name.trim()) || def, amount:0, type:draft.type, categoryId:draft.categoryId, accountId:draft.accountId, note:draft.note });
  }
  return (
    <div className={`record-overlay ${closing ? "closing" : ""}`} onClick={requestClose}>
      <section className="record-sheet" onClick={e => e.stopPropagation()}>
        <div className="record-handle" onClick={requestClose} title="关闭"></div>
        <div className="record-head">
          <button className="record-close" onClick={requestClose} aria-label="关闭记账表单">
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="record-title">Add Record</div>
          <button className="record-template" type="button" onClick={() => setTplOpen(true)}>Templates</button>
        </div>
        <div className="record-body">
          <TransactionForm key={tx.id} tx={tx} accounts={state.accounts} transactions={state.transactions} onSubmit={saveAndClose} submitText="保存账单" onSaveTemplate={saveAsTemplate} />
        </div>
        {tplOpen && <TemplatesPanel templates={state.templates || []} onApply={applyTemplate} onDelete={deleteTemplate} onClose={() => setTplOpen(false)} />}
      </section>
    </div>
  );
}
function TemplatesPanel({ templates, onApply, onDelete, onClose }){
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <span style={{width:34}} />
          <div className="picker-title">记账模板</div>
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>
        </div>
        <div className="picker-body">
          {templates.length ? templates.map(t => {
            const c = categoryById(t.categoryId);
            return (
              <div className="cat-row" key={t.id}>
                <span className="avatar" style={{background:c.color + "22"}} onClick={() => onApply(t)}>{c.icon}</span>
                <div className="cat-row-name" onClick={() => onApply(t)} style={{cursor:"pointer"}}>
                  <div className="body">{t.name}</div>
                  <div className="caption">{categoryName(t.categoryId)} · {t.type === "income" ? "收入" : "支出"}</div>
                </div>
                <button className="icon-btn" onClick={() => onDelete(t.id)} aria-label="删除模板"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.trash}</svg></button>
              </div>
            );
          }) : <div className="empty">还没有模板。记账时点底部「存为模板」即可创建。</div>}
        </div>
      </div>
    </div>
  );
}
function Add({ state, addTransaction }){
  const blankTx = useMemo(() => ({
    amount:"",
    categoryId:"food",
    subId:null,
    accountId:state.accounts[0].id,
    note:"",
    date:todayStr(),
    type:"expense"
  }), [state.accounts]);
  return (
    <>
      <section className="topline"><div className="title-md">记一笔</div></section>
      <TransactionForm tx={blankTx} accounts={state.accounts} transactions={state.transactions} onSubmit={addTransaction} submitText="保存账单" />
    </>
  );
}

function Planning({ state, metrics, setSheet, payPlan, payAllDue }){
  const due = metrics.duePlans;
  const nextPlans = metrics.upcoming.slice(0, 5);
  const topBudgets = [...metrics.budgets].sort((a,b) => b.pct - a.pct).slice(0, 4);
  const goals = [...state.goals].slice(0, 3);
  return (
    <>
      <section className="topline"><div className="title-md">Planning</div></section>
      <section className="stat-grid">
        <div className="stat"><div className="caption">计划收入</div><div className="v green">{money(metrics.plannedIncome)}</div></div>
        <div className="stat"><div className="caption">计划支出</div><div className="v red">{money(metrics.plannedExpense)}</div></div>
        <div className="stat"><div className="caption">预算项目</div><div className="v small">{state.budgets.length} 项</div></div>
        <div className="stat"><div className="caption">储蓄目标</div><div className="v small">{state.goals.length} 个</div></div>
      </section>

      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">收入分配</div>
        <button className="chip" onClick={() => setSheet("allocation")}>管理</button>
      </div>
      <section className="card">
        {(() => {
          const base = state.allocation.income != null ? state.allocation.income : metrics.monthIncome;
          return (
            <>
              <div className="row" style={{marginBottom:10}}>
                <span className="caption">月收入基数</span>
                <span className="body" style={{fontWeight:800}}>{money(base)}</span>
              </div>
              <AllocationBar buckets={state.allocation.buckets} />
              <div style={{marginTop:10}}>
                {state.allocation.buckets.map(b => (
                  <div className="row" key={b.id} style={{padding:"6px 0"}}>
                    <span style={{display:"flex",alignItems:"center",gap:8}}><span className="swatch" style={{background:b.color}} />{b.name} · {b.pct}%</span>
                    <span className="amount">{money(base * b.pct / 100)}</span>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {due.length > 0 && (
        <section className="alert near" style={{marginTop:4}}>
          <span style={{fontSize:20}}>⏰</span>
          <div style={{flex:1,minWidth:0}}>
            <div className="body" style={{fontWeight:800}}>{due.length} 笔计划付款已到期</div>
            <div className="caption">记入后将自动生成下一期</div>
          </div>
          <button className="chip pay-chip" onClick={payAllDue}>全部记入</button>
        </section>
      )}

      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">计划付款</div>
        <button className="chip" onClick={() => setSheet("planned")}>管理</button>
      </div>
      <section className="card">
        {due.map(p => <PlannedRow key={p.id} plan={p} onPay={() => payPlan(p.id)} />)}
        {nextPlans.length ? nextPlans.map(p => <PlannedRow key={p.id} plan={p} onPay={() => payPlan(p.id)} />) : (!due.length && <div className="empty">没有即将到期的计划</div>)}
      </section>

      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">预算</div>
        <button className="chip" onClick={() => setSheet("budgets")}>管理</button>
      </div>
      <section className="card">
        {topBudgets.length ? topBudgets.map(b => <BudgetRow key={b.id} b={b} />) : <div className="empty">还没有预算</div>}
      </section>

      <div className="row" style={{margin:"6px 2px 9px"}}>
        <div className="section-title">储蓄目标</div>
        <button className="chip" onClick={() => setSheet("goals")}>管理</button>
      </div>
      <section className="card">
        {goals.length ? goals.map(g => {
          const pct = g.target ? Math.min(100, Math.round(g.saved / g.target * 100)) : 0;
          return (
            <div key={g.id} style={{marginBottom:14}}>
              <div className="row" style={{marginBottom:7}}>
                <span className="body">{g.icon} {g.name}</span>
                <span className="caption">{money(g.saved)} / {money(g.target)}</span>
              </div>
              <Progress pct={pct} />
            </div>
          );
        }) : <div className="empty">还没有储蓄目标</div>}
      </section>
    </>
  );
}

function TransactionForm({ tx, accounts, transactions, onSubmit, submitText, onCancel, onDelete, onSaveTemplate }){
  const [draft, setDraft] = useState(tx);
  useEffect(() => setDraft(tx), [tx.id]);
  function patch(key, value){
    setDraft(prev => ({ ...prev, [key]: key === "amount" ? Number(value) : value }));
  }
  const [pickerOpen, setPickerOpen] = useState(false);
  const leaf = categoryById(draft.categoryId);
  return (
    <section className="card" style={{marginTop:14}}>
      <div className="row" style={{marginBottom:12}}>
        <div className="section-title">{submitText === "保存账单" ? "账单信息" : "编辑账单"}</div>
        {onCancel && <button className="icon-btn" onClick={onCancel} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>}
      </div>
      <div className="form-grid">
        <label className="form-row"><span className="caption">金额</span><input className="field" type="number" min="0" step="0.01" value={draft.amount || ""} onChange={e => patch("amount", e.target.value)} /></label>
        <label className="form-row"><span className="caption">类型</span><select className="field" value={draft.type} onChange={e => patch("type", e.target.value)}><option value="expense">支出</option><option value="income">收入</option><option value="transfer">转账</option></select></label>
      </div>
      {draft.type === "transfer" ? (
        <>
          <div className="form-grid">
            <label className="form-row"><span className="caption">转出账户</span><select className="field" value={draft.accountId} onChange={e => patch("accountId", e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
            <label className="form-row"><span className="caption">转入账户</span><select className="field" value={draft.toAccountId || (accounts.find(a => a.id !== draft.accountId) || {}).id || ""} onChange={e => patch("toAccountId", e.target.value)}>{accounts.filter(a => a.id !== draft.accountId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
          </div>
          <label className="form-row"><span className="caption">日期</span><input className="field" type="date" value={draft.date} onChange={e => patch("date", e.target.value)} /></label>
        </>
      ) : (
        <>
          <div className="form-row">
            <span className="caption">分类</span>
            <button type="button" className="cat-select" onClick={() => setPickerOpen(true)}>
              <span className="avatar cat-select-ic" style={{background:leaf.color + "22"}}>{leaf.icon}</span>
              <span className="cat-select-name">{categoryName(draft.categoryId)}</span>
              <span className="caption">›</span>
            </button>
          </div>
          <div className="form-grid">
            <label className="form-row"><span className="caption">账户</span><select className="field" value={draft.accountId} onChange={e => patch("accountId", e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
            <label className="form-row"><span className="caption">日期</span><input className="field" type="date" value={draft.date} onChange={e => patch("date", e.target.value)} /></label>
          </div>
        </>
      )}
      <label className="form-row"><span className="caption">备注</span><input className="field" value={draft.note} onChange={e => patch("note", e.target.value)} /></label>
      <button className="btn" onClick={() => {
        if(!draft.amount) return;
        if(draft.type === "transfer"){
          const toId = draft.toAccountId || (accounts.find(a => a.id !== draft.accountId) || {}).id;
          if(!toId || toId === draft.accountId) return;
          onSubmit({ ...draft, toAccountId:toId, categoryId:null });
          return;
        }
        onSubmit(draft);
      }}>{submitText}</button>
      {onSaveTemplate && <button className="btn secondary" style={{marginTop:10}} onClick={() => onSaveTemplate(draft)}>存为模板</button>}
      {onDelete && <button className="btn danger" style={{marginTop:10}} onClick={onDelete}>删除账单</button>}
      {pickerOpen && <CategoryPicker value={draft.categoryId} income={draft.type === "income"} transactions={transactions} onClose={() => setPickerOpen(false)} onPick={id => { patch("categoryId", id); setPickerOpen(false); }} />}
    </section>
  );
}

function Insights({ state, metrics }){
  const slices = Object.entries(metrics.catSpend).map(([id,value]) => ({ ...categoryById(id), value })).sort((a,b) => b.value - a.value);
  const months = monthlyExpenseSeries(state);
  const summary = spendingSummary(metrics, slices);
  return (
    <>
      <section className="topline"><div className="title-md">本月洞察</div></section>
      <section className="card">
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Donut slices={slices} />
          <div style={{flex:1}}>
            {slices.length ? slices.slice(0,5).map(s => (
              <div className="legend" key={s.id}><span className="swatch" style={{background:s.color}}></span><span style={{flex:1}}>{s.name}</span><span className="muted">{metrics.monthExpense ? Math.round(s.value / metrics.monthExpense * 100) : 0}%</span></div>
            )) : <div className="caption">本月还没有支出</div>}
          </div>
        </div>
      </section>
      <section className="card">
        <div className="section-title" style={{marginBottom:12}}>现金流</div>
        <div className="stat-grid" style={{marginBottom:0}}>
          <div className="stat"><div className="caption">收入</div><div className="v green">{money(metrics.monthIncome)}</div></div>
          <div className="stat"><div className="caption">支出</div><div className="v red">{money(metrics.monthExpense)}</div></div>
          <div className="stat"><div className="caption">计划收入</div><div className="v small green">{money(metrics.plannedIncome)}</div></div>
          <div className="stat"><div className="caption">计划支出</div><div className="v small red">{money(metrics.plannedExpense)}</div></div>
        </div>
      </section>
      <section className="card">
        <div className="section-title" style={{marginBottom:14}}>近 6 个月支出趋势</div>
        <BarChart data={months} />
      </section>
      <section className="card">
        <div className="section-title" style={{marginBottom:12}}>预算进度</div>
        {metrics.budgets.length ? metrics.budgets.map(b => <BudgetRow key={b.id} b={b} />) : <div className="empty">还没有预算，去“我的”里添加。</div>}
      </section>
      <section className="card" style={{borderColor:summary.level === "warn" ? "rgba(255,176,32,.42)" : "var(--line)"}}>
        <div className="row">
          <Leo mood={summary.mood} />
          <div style={{flex:1}}>
            <div className="body" style={{fontWeight:800,color:summary.level === "warn" ? "var(--warning)" : "var(--text)"}}>{summary.title}</div>
            <div className="caption" style={{marginTop:5}}>{summary.text}</div>
          </div>
        </div>
      </section>
    </>
  );
}

function Profile(props){
  const { state, metrics, setSheet, exportCSV, exportJSON, importJSON, updateState, reset } = props;
  const ach = achievementState(state, metrics);
  const unlocked = ach.filter(a => a.unlocked);
  return (
    <>
      <section className="card" style={{textAlign:"center",marginTop:8}}>
        <div style={{display:"flex",justifyContent:"center"}}><Leo mood={metrics.mood} /></div>
        <div className="section-title" style={{marginTop:10}}>Leo · Lv.{metrics.li.lv}</div>
        <div className="caption">{metrics.li.title} · 连续 {state.mascot.streakDays} 天 · {state.mascot.xp} XP</div>
        <div style={{margin:"14px 24px 4px"}}>
          <Progress pct={metrics.li.pct} />
          <div className="caption" style={{marginTop:6}}>下一级还需 {metrics.li.toNext} XP</div>
        </div>
      </section>
      <section className="card">
        <div className="row" style={{marginBottom:14}}><div className="section-title">已解锁徽章</div><span className="caption">{unlocked.length} / {ach.length}</span></div>
        <div className="badge-row">
          {unlocked.length ? unlocked.slice(0,6).map(a => <div key={a.id} className="badge" title={`${a.name}：${a.desc}`}><div className="ic">{a.icon}</div></div>) : <div className="caption">开始记账后解锁</div>}
        </div>
      </section>
      <section className="card">
        <NavRow icon="🏦" title="账户管理" sub={`${state.accounts.length} 个账户`} onClick={() => setSheet("accounts")} />
        <NavRow icon="🏷️" title="分类管理" sub={`${CATEGORIES.length} 个分类`} onClick={() => setSheet("categories")} />
        <NavRow icon="🎯" title="预算管理" sub={`${state.budgets.length} 项预算`} onClick={() => setSheet("budgets")} />
        <NavRow icon="📅" title="计划付款" sub={`${state.planned.length} 项计划`} onClick={() => setSheet("planned")} />
        <NavRow icon="🐷" title="储蓄目标" sub={`${state.goals.length} 个目标`} onClick={() => setSheet("goals")} />
      </section>
      <section className="card">
        <NavRow icon="📤" title="导出 CSV" onClick={exportCSV} />
        <NavRow icon="💾" title="备份 JSON" onClick={exportJSON} />
        <label style={{display:"block"}}>
          <NavRow icon="📥" title="恢复 JSON" onClick={() => {}} />
          <input type="file" accept="application/json" style={{display:"none"}} onChange={e => importJSON(e.target.files[0])} />
        </label>
      </section>
      <section className="card">
        <NavRow icon="⭐" title="Leo Pro" sub={state.pro ? "已解锁" : "$4.99 买断"} onClick={() => updateState(s => { s.pro = !s.pro; })} />
        <NavRow icon="🛡️" title="本地优先" sub="无账号 · 无服务器" onClick={() => alert("Leo Ledger 的数据只保存在当前设备。")} />
        <NavRow icon="🗑️" title="清空所有数据" sub="删除全部账单并把钱包清零" onClick={reset} />
      </section>
    </>
  );
}

function Transactions({ state, setTab, setEditingId, txQuery, setTxQuery, txMonth, setTxMonth, txCat, setTxCat }){
  const months = [...new Set(state.transactions.map(t => monthStr(t.date)))].sort().reverse();
  const usedCats = [...new Set(state.transactions.map(t => t.categoryId))];
  const q = txQuery.trim().toLowerCase();
  const list = state.transactions.filter(t => {
    if(txMonth !== "all" && monthStr(t.date) !== txMonth) return false;
    if(txCat !== "all" && t.categoryId !== txCat) return false;
    if(q && !(`${t.note} ${categoryById(t.categoryId).name}`.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b) => new Date(b.date) - new Date(a.date) || String(b.id).localeCompare(String(a.id)));
  const groups = {};
  list.forEach(t => { (groups[t.date] = groups[t.date] || []).push(t); });
  const totalExp = list.filter(t => t.type === "expense").reduce((a,t) => a + t.amount, 0);
  const totalInc = list.filter(t => t.type === "income").reduce((a,t) => a + t.amount, 0);
  return (
    <>
      <button className="back-btn" onClick={() => setTab("home")}><svg viewBox="0 0 24 24">{ICONS.back}</svg>返回首页</button>
      <div className="title-md" style={{margin:"2px 2px 12px"}}>全部账单</div>
      <div className="search"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.search}</svg><input placeholder="搜索备注或分类" value={txQuery} onChange={e => setTxQuery(e.target.value)} /></div>
      <div className="filter-row">
        <button className={`chip ${txMonth === "all" ? "active" : ""}`} onClick={() => setTxMonth("all")}>全部月份</button>
        {months.map(m => <button key={m} className={`chip ${txMonth === m ? "active" : ""}`} onClick={() => setTxMonth(m)}>{Number(m.split("-")[1])}月</button>)}
      </div>
      <div className="filter-row">
        <button className={`chip ${txCat === "all" ? "active" : ""}`} onClick={() => setTxCat("all")}>全部分类</button>
        {usedCats.map(id => <button key={id} className={`chip ${txCat === id ? "active" : ""}`} onClick={() => setTxCat(id)}>{categoryById(id).icon} {categoryById(id).name}</button>)}
      </div>
      <section className="card" style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
        <div><div className="caption">支出</div><div className="amount red">{money(totalExp)}</div></div>
        <div><div className="caption">收入</div><div className="amount green">{money(totalInc)}</div></div>
        <div><div className="caption">笔数</div><div className="amount">{list.length}</div></div>
      </section>
      {list.length ? Object.keys(groups).sort((a,b) => new Date(b) - new Date(a)).map(date => {
        const items = groups[date];
        const dayNet = items.reduce((a,t) => a + signedAmount(t, null), 0);
        return (
          <React.Fragment key={date}>
            <div className="day-head"><span className="d">{new Date(date).toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"short"})}</span><span className="s">{dayNet >= 0 ? "+" : "-"}{money(Math.abs(dayNet))}</span></div>
            <section className="card">{items.map(t => <TransactionRow key={t.id} tx={t} onEdit={() => setEditingId(t.id)} />)}</section>
          </React.Fragment>
        );
      }) : <div className="empty">没有匹配的账单</div>}
    </>
  );
}

function EditSheet({ tx, state, setEditingId, updateTransaction, deleteTransaction }){
  return (
    <div className="sheet-bg">
      <div className="sheet">
        <TransactionForm
          tx={tx}
          accounts={state.accounts}
          transactions={state.transactions}
          submitText="保存修改"
          onSubmit={(draft) => updateTransaction(tx.id, draft)}
          onCancel={() => setEditingId(null)}
          onDelete={() => { if(confirm("确定删除这笔账单吗？")) deleteTransaction(tx.id); }}
        />
      </div>
    </div>
  );
}

function ManageSheet(props){
  const { sheet, setSheet, state, updateState, setToast, payPlan } = props;
  return (
    <div className="sheet-bg">
      <div className="sheet">
        {sheet === "accounts" && <AccountsSheet accounts={state.accounts} />}
        {sheet === "categories" && <CategoriesSheet {...props} />}
        {sheet === "budgets" && <BudgetsSheet state={state} updateState={updateState} setToast={setToast} />}
        {sheet === "planned" && <PlannedSheet state={state} updateState={updateState} setToast={setToast} payPlan={payPlan} />}
        {sheet === "goals" && <GoalsSheet state={state} updateState={updateState} setToast={setToast} />}
        {sheet === "allocation" && <AllocationSheet state={state} metrics={props.metrics} setAllocIncome={props.setAllocIncome} addBucket={props.addBucket} updateBucket={props.updateBucket} deleteBucket={props.deleteBucket} setToast={setToast} />}
        <button className="btn secondary" style={{marginTop:14}} onClick={() => setSheet(null)}>关闭</button>
      </div>
    </div>
  );
}
function AccountsSheet({ accounts }){
  return (
    <>
      <div className="section-title" style={{marginBottom:14}}>账户管理</div>
      {accounts.map(a => <div className="list-item" key={a.id}><div className="avatar">🏦</div><div style={{flex:1}}><div className="body">{a.name}</div><div className="caption">{a.type}</div></div><div className="amount">{money(a.balance)}</div></div>)}
    </>
  );
}
function IconColorPicker({ icon, setIcon, color, setColor }){
  return (
    <>
      <div className="caption" style={{margin:"10px 0 6px"}}>图标</div>
      <div className="icon-grid">{CAT_ICONS.map(ic => <button type="button" key={ic} className={`icon-pick ${icon === ic ? "active" : ""}`} onClick={() => setIcon(ic)}>{ic}</button>)}</div>
      <div className="caption" style={{margin:"10px 0 6px"}}>颜色</div>
      <div className="color-grid">{CAT_COLORS.map(cl => <button type="button" key={cl} className={`color-pick ${color === cl ? "active" : ""}`} style={{background:cl}} onClick={() => setColor(cl)} aria-label={cl} />)}</div>
    </>
  );
}
function CategoryEditor({ node, parentId, onSave, onDelete, onClose, setToast }){
  const [name, setName] = useState(node ? node.name : "");
  const [icon, setIcon] = useState(node ? node.icon : CAT_ICONS[0]);
  const [color, setColor] = useState(node ? node.color : CAT_COLORS[0]);
  const [income, setIncome] = useState(node ? !!node.income : false);
  const locked = node && (node.id === "other" || node.id === "income");
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>
          <div className="picker-title">{node ? "编辑分类" : (parentId ? "新建子分类" : "新建分类")}</div>
          <span style={{width:34}} />
        </div>
        <div className="picker-body">
          <label className="form-row"><span className="caption">名称</span><input className="field" value={name} onChange={e => setName(e.target.value)} placeholder="分类名称" /></label>
          {!node && !parentId && (
            <div className="seg-row">
              <button type="button" className={`chip ${!income ? "active" : ""}`} onClick={() => setIncome(false)}>支出</button>
              <button type="button" className={`chip ${income ? "active" : ""}`} onClick={() => setIncome(true)}>收入</button>
            </div>
          )}
          <IconColorPicker icon={icon} setIcon={setIcon} color={color} setColor={setColor} />
          <button className="btn" style={{marginTop:14}} onClick={() => { if(!name.trim()){ setToast("请输入名称。"); return; } onSave({ name:name.trim(), icon, color, income }); }}>保存</button>
          {node && onDelete && !locked && <button className="btn danger" style={{marginTop:10}} onClick={onDelete}>删除分类</button>}
        </div>
      </div>
    </div>
  );
}
function FrequentRow({ ids, onPick }){
  if(!ids.length) return null;
  return (
    <>
      <div className="picker-section">常用</div>
      <div className="freq-row">
        {ids.map(n => (
          <button key={n.id} type="button" className="freq-item" onClick={() => onPick(n.id)}>
            <span className="freq-ic" style={{background:n.color}}>{n.icon}</span>
            <span className="freq-name">{n.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
function CategoryRow({ node, count, onTap }){
  const hasKids = node.children && node.children.length;
  return (
    <div className="cat-row" onClick={onTap}>
      <span className="avatar" style={{background:node.color + "22"}}>{node.icon}</span>
      <span className="cat-row-name">{node.name}</span>
      {count > 0 && <span className="caption">({count})</span>}
      <span className="cat-row-chev">{hasKids ? "›" : ""}</span>
    </div>
  );
}
function CategoryPicker({ value, income, transactions, onPick, onClose }){
  const [path, setPath] = useState([]);
  const current = path.length ? categoryById(path[path.length - 1]) : null;
  const roots = CATEGORIES.filter(c => !!c.income === !!income);
  const list = current ? (current.children || []) : roots;
  const txs = transactions || [];
  const leafCounts = {};
  txs.forEach(t => { if(!!topCategory(t.categoryId).income === !!income) leafCounts[t.categoryId] = (leafCounts[t.categoryId] || 0) + 1; });
  const frequent = !current ? Object.entries(leafCounts).sort((a,b) => b[1] - a[1]).slice(0,6).map(([id]) => categoryById(id)).filter(n => n && n.id !== "other") : [];
  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          {path.length ? <button className="icon-btn" onClick={() => setPath(p => p.slice(0,-1))} aria-label="返回"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.back}</svg></button> : <span style={{width:34}} />}
          <div className="picker-title">{current ? current.name : (income ? "选择收入分类" : "选择支出分类")}</div>
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.close}</svg></button>
        </div>
        <div className="picker-body">
          {!current && <FrequentRow ids={frequent} onPick={onPick} />}
          {current && (
            <button type="button" className={`pick-self ${value === current.id ? "active" : ""}`} onClick={() => onPick(current.id)}>
              <span className="avatar" style={{background:current.color + "22"}}>{current.icon}</span>
              <span className="cat-row-name">选择「{current.name}」</span>
              {value === current.id && <span className="caption green">✓</span>}
            </button>
          )}
          <div className="picker-section">{current ? "子分类" : "全部分类"}</div>
          {list.map(n => (
            <CategoryRow key={n.id} node={n} count={txCountForCat(txs, n.id)}
              onTap={() => (n.children && n.children.length) ? setPath(p => [...p, n.id]) : onPick(n.id)} />
          ))}
          {list.length === 0 && <div className="empty">这里没有子分类，可直接选择上一级</div>}
        </div>
      </div>
    </div>
  );
}
function CategoriesSheet(props){
  const { state, addCategory, updateCategory, deleteCategory, setToast } = props;
  const [path, setPath] = useState([]);
  const [editor, setEditor] = useState(null);
  const current = path.length ? categoryById(path[path.length - 1]) : null;
  const list = current ? (current.children || []) : state.categories;
  return (
    <>
      <div className="row" style={{marginBottom:12}}>
        {path.length
          ? <button className="back-btn" onClick={() => setPath(p => p.slice(0,-1))}><svg viewBox="0 0 24 24">{ICONS.back}</svg>返回</button>
          : <div className="section-title">分类管理</div>}
        <button className="chip" onClick={() => setEditor({ node:null, parentId:current ? current.id : null })}>+ {current ? "子分类" : "分类"}</button>
      </div>
      {current && (
        <div className="cat-head" style={{borderRadius:10, border:"1px solid var(--line)", marginBottom:12}}>
          <span className="avatar" style={{background:current.color + "22"}}>{current.icon}</span>
          <div style={{flex:1, minWidth:0}}>
            <div className="body" style={{fontWeight:800}}>{categoryName(current.id)}</div>
            <div className="caption">{txCountForCat(state.transactions, current.id)} 笔记录</div>
          </div>
          {current.id !== "other" && current.id !== "income" && <button className="icon-btn" onClick={() => setEditor({ node:current })} aria-label="编辑"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.edit}</svg></button>}
        </div>
      )}
      {list.map(n => (
        <CategoryRow key={n.id} node={n} count={txCountForCat(state.transactions, n.id)}
          onTap={() => (n.children && n.children.length) ? setPath(p => [...p, n.id]) : setEditor({ node:n })} />
      ))}
      {list.length === 0 && <div className="empty">还没有子分类，点右上角添加</div>}
      {editor && <CategoryEditor node={editor.node} parentId={editor.parentId} setToast={setToast}
        onSave={data => { if(editor.node) updateCategory(editor.node.id, { name:data.name, icon:data.icon, color:data.color }); else addCategory(editor.parentId, data); setEditor(null); }}
        onDelete={editor.node ? () => { const wasCurrent = current && current.id === editor.node.id; deleteCategory(editor.node.id); setEditor(null); if(wasCurrent) setPath(p => p.slice(0,-1)); } : null}
        onClose={() => setEditor(null)} />}
    </>
  );
}
function BudgetsSheet({ state, updateState, setToast }){
  const [categoryId, setCategoryId] = useState("food");
  const [amount, setAmount] = useState("");
  return (
    <>
      <div className="section-title" style={{marginBottom:14}}>预算管理</div>
      {state.budgets.map(b => <div className="list-item" key={b.id}><div className="avatar" style={{background:categoryById(b.categoryId).color+"22"}}>{categoryById(b.categoryId).icon}</div><div style={{flex:1}}><div className="body">{categoryById(b.categoryId).name}</div><div className="caption">每月上限</div></div><div className="amount">{money(b.amount)}</div><button className="icon-btn" onClick={() => updateState(s => { s.budgets = s.budgets.filter(x => x.id !== b.id); })} aria-label="删除预算"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.trash}</svg></button></div>)}
      <div className="soft-divider"></div>
      <div className="form-grid">
        <label className="form-row"><span className="caption">分类</span><select className="field" value={categoryId} onChange={e => setCategoryId(e.target.value)}>{CATEGORIES.filter(c => !c.income).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></label>
        <label className="form-row"><span className="caption">预算金额</span><input className="field" type="number" min="0" placeholder="600" value={amount} onChange={e => setAmount(e.target.value)} /></label>
      </div>
      <button className="btn" onClick={() => {
        if(!Number(amount)){ setToast("需要填写预算金额。"); return; }
        updateState(s => s.budgets.push({ id:uid("b"), categoryId, amount:Number(amount), month:monthStr(new Date()) }));
        setAmount("");
        setToast("预算已添加。");
      }}>添加预算</button>
    </>
  );
}
function PlannedSheet({ state, updateState, setToast, payPlan }){
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("home");
  const [accountId, setAccountId] = useState(state.accounts[0].id);
  const [dueDate, setDueDate] = useState(todayStr(addDays(new Date(), 7)));
  const [repeat, setRepeat] = useState("每月");
  return (
    <>
      <div className="section-title" style={{marginBottom:14}}>计划付款</div>
      {state.planned.length ? [...state.planned].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(p => (
        <div className="list-item" key={p.id}>
          <div className="avatar" style={{background:categoryById(p.categoryId).color+"22"}}>{p.type === "income" ? "💵" : categoryById(p.categoryId).icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="body">{p.name}</div>
            <div className="caption">{new Date(p.dueDate).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"})} · {p.repeat} · {categoryById(p.categoryId).name}</div>
          </div>
          <div className={`amount ${p.type === "income" ? "green" : "red"}`}>{p.type === "income" ? "+" : "-"}{money(p.amount)}</div>
          {payPlan && dueLabel(p.dueDate).due && <button className="chip pay-chip" onClick={() => payPlan(p.id)}>记入</button>}
          <button className="icon-btn" onClick={() => updateState(s => { s.planned = s.planned.filter(x => x.id !== p.id); })} aria-label="删除计划"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.trash}</svg></button>
        </div>
      )) : <div className="empty">还没有计划付款</div>}
      <div className="soft-divider"></div>
      <label className="form-row"><span className="caption">名称</span><input className="field" placeholder="例如 房租 / 会员 / 工资" value={name} onChange={e => setName(e.target.value)} /></label>
      <div className="form-grid">
        <label className="form-row"><span className="caption">金额</span><input className="field" type="number" min="0" step="0.01" placeholder="1200" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label className="form-row"><span className="caption">类型</span><select className="field" value={type} onChange={e => setType(e.target.value)}><option value="expense">支出</option><option value="income">收入</option></select></label>
        <label className="form-row"><span className="caption">分类</span><select className="field" value={categoryId} onChange={e => setCategoryId(e.target.value)}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></label>
        <label className="form-row"><span className="caption">账户</span><select className="field" value={accountId} onChange={e => setAccountId(e.target.value)}>{state.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
        <label className="form-row"><span className="caption">日期</span><input className="field" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></label>
        <label className="form-row"><span className="caption">重复</span><select className="field" value={repeat} onChange={e => setRepeat(e.target.value)}><option>一次</option><option>每周</option><option>每月</option><option>每年</option></select></label>
      </div>
      <button className="btn" onClick={() => {
        if(!name.trim() || !Number(amount)){ setToast("需要填写名称和金额。"); return; }
        updateState(s => s.planned.push({ id:uid("p"), name:name.trim(), amount:Number(amount), type, categoryId, accountId, dueDate, repeat }));
        setName("");
        setAmount("");
        setToast("计划付款已添加。");
      }}>添加计划</button>
    </>
  );
}
function GoalsSheet({ state, updateState, setToast }){
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  return (
    <>
      <div className="section-title" style={{marginBottom:14}}>储蓄目标</div>
      {state.goals.length ? state.goals.map(g => <GoalCard key={g.id} goal={g} updateState={updateState} setToast={setToast} />) : <div className="empty">还没有储蓄目标，定一个小目标吧。</div>}
      <div className="soft-divider"></div>
      <div className="form-grid">
        <label className="form-row"><span className="caption">目标名称</span><input className="field" placeholder="例如 旅行基金" value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="form-row"><span className="caption">目标金额</span><input className="field" type="number" min="0" placeholder="3000" value={target} onChange={e => setTarget(e.target.value)} /></label>
      </div>
      <button className="btn" onClick={() => {
        if(!name.trim() || !Number(target)){ setToast("需要填写目标名称和金额。"); return; }
        updateState(s => s.goals.push({ id:uid("g"), name:name.trim(), icon:"🐷", target:Number(target), saved:0 }));
        setName("");
        setTarget("");
        setToast("储蓄目标已添加。");
      }}>添加目标</button>
    </>
  );
}
function GoalCard({ goal, updateState, setToast }){
  const [value, setValue] = useState("");
  const pct = goal.target ? Math.min(100, Math.round(goal.saved / goal.target * 100)) : 0;
  const done = goal.target > 0 && goal.saved >= goal.target;
  return (
    <div className="card" style={{margin:"0 0 12px"}}>
      <div className="row" style={{marginBottom:8}}>
        <div className="body" style={{fontWeight:800}}>{goal.icon} {goal.name} {done ? "🏆" : ""}</div>
        <button className="icon-btn" onClick={() => updateState(s => { s.goals = s.goals.filter(x => x.id !== goal.id); })} aria-label="删除目标"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.trash}</svg></button>
      </div>
      <Progress pct={pct} />
      <div className="row" style={{marginTop:7}}><span className="caption">{money(goal.saved)} / {money(goal.target)} · {pct}%</span></div>
      {!done && <div className="form-grid" style={{marginTop:10}}><input className="field" type="number" min="0" step="0.01" placeholder="存入金额" value={value} onChange={e => setValue(e.target.value)} /><button className="btn secondary" onClick={() => {
        if(!Number(value)){ setToast("需要填写存入金额。"); return; }
        updateState(s => {
          const g = s.goals.find(x => x.id === goal.id);
          if(!g) return;
          const wasDone = g.target > 0 && g.saved >= g.target;
          g.saved = Number((g.saved + Number(value)).toFixed(2));
          if(!wasDone && g.target > 0 && g.saved >= g.target) s.mascot.xp += 200;
        });
        setValue("");
        setToast("已计入储蓄目标。");
      }}>存入</button></div>}
    </div>
  );
}
function TransactionRow({ tx, onEdit }){
  if(tx.type === "transfer"){
    return (
      <div className="list-item">
        <div className="avatar" style={{background:"#3B82F622"}}>🔁</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="body" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx.note || "转账"}</div>
          <div className="caption">{accountName(tx.accountId)} → {accountName(tx.toAccountId)} · {new Date(tx.date).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"})}</div>
        </div>
        <div className="amount muted">{money(tx.amount)}</div>
        <button className="icon-btn" onClick={onEdit} aria-label="编辑账单"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.edit}</svg></button>
      </div>
    );
  }
  const c = categoryById(tx.categoryId);
  const path = categoryName(tx.categoryId);
  return (
    <div className="list-item">
      <div className="avatar" style={{background:c.color+"22"}}>{c.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div className="body" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx.note}</div>
        <div className="caption">{path} · {new Date(tx.date).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"})}</div>
      </div>
      <div className={`amount ${tx.type === "income" ? "green" : ""}`}>{tx.type === "income" ? "+" : "-"}{money(tx.amount)}</div>
      <button className="icon-btn" onClick={onEdit} aria-label="编辑账单"><svg viewBox="0 0 24 24" width="18" height="18">{ICONS.edit}</svg></button>
    </div>
  );
}
function dueLabel(dateStr){
  const diff = Math.round((new Date(dateStr) - new Date(todayStr())) / 86400000);
  if(diff < 0) return { text:`已逾期 ${-diff} 天`, due:true };
  if(diff === 0) return { text:"今天到期", due:true };
  if(diff === 1) return { text:"明天到期", due:false };
  return { text:`${diff} 天后`, due:false };
}
function PlannedRow({ plan, onPay }){
  const c = categoryById(plan.categoryId);
  const dl = dueLabel(plan.dueDate);
  return (
    <div className="list-item">
      <div className="avatar" style={{background:c.color+"22"}}>{plan.type === "income" ? "💵" : c.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div className="body" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{plan.name}</div>
        <div className="caption">{new Date(plan.dueDate).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"})} · {plan.repeat} · <span className={dl.due ? "warn" : ""}>{dl.text}</span></div>
      </div>
      <div className={`amount ${plan.type === "income" ? "green" : "red"}`}>{plan.type === "income" ? "+" : "-"}{money(plan.amount)}</div>
      {onPay && dl.due && <button className="chip pay-chip" onClick={onPay}>{plan.type === "income" ? "入账" : "记入"}</button>}
    </div>
  );
}
function NavRow({ icon, title, sub, onClick }){
  return (
    <div className="nav-row" onClick={onClick}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:20}}>{icon}</span>
        <div><div className="body">{title}</div>{sub && <div className="caption">{sub}</div>}</div>
      </div>
      <span className="caption">›</span>
    </div>
  );
}
function Leo({ mood, size }){
  return <div className={`leo ${mood === "running" ? "running" : ""}`} style={size ? {width:size,height:size,flex:`0 0 ${size}px`} : null}><span className="leo-face" style={size ? {fontSize:52} : null}>{MOOD[mood].face}</span></div>;
}
function Progress({ pct, color = "#00C805" }){
  return <div className="progress"><span style={{width:`${Math.min(100, Math.max(0, pct))}%`, background:color}}></span></div>;
}
function BudgetRow({ b }){
  const c = categoryById(b.categoryId);
  return (
    <div style={{marginBottom:14}}>
      <div className="row" style={{marginBottom:7}}><span className="body">{c.icon} {c.name}</span><span className="caption" style={{color:budgetColor(b.pct)}}>{money(b.spent)} / {money(b.amount)}</span></div>
      <Progress pct={b.pct} color={budgetColor(b.pct)} />
    </div>
  );
}
function trendSeries(state, days){
  const points = Math.min(days, 30);
  const total = state.accounts.reduce((a,x) => a + Number(x.balance || 0), 0);
  const first = new Date();
  first.setDate(first.getDate() - days + 1);
  const daily = [];
  for(let i = 0; i < points; i++){
    const d = new Date(first);
    d.setDate(d.getDate() + Math.round(i * (days - 1) / Math.max(1, points - 1)));
    const ds = todayStr(d);
    const futureDelta = state.transactions.filter(t => t.date > ds).reduce((sum,t) => sum + signedAmount(t, null), 0);
    daily.push(Math.max(0, total - futureDelta));
  }
  return daily;
}
function monthlyExpenseSeries(state){
  const arr = [];
  const now = new Date();
  for(let i = 5; i >= 0; i--){
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthStr(d);
    const sum = state.transactions.filter(t => monthStr(t.date) === key && t.type === "expense").reduce((a,t) => a + t.amount, 0);
    arr.push({ label:(d.getMonth() + 1) + "月", value:sum });
  }
  return arr;
}
function budgetColor(pct){
  return pct >= 100 ? "#FF5A5F" : pct >= 80 ? "#FFB020" : "#00C805";
}
function spendingSummary(metrics, slices){
  const budget = [...metrics.budgets].sort((a,b) => b.pct - a.pct)[0];
  if(budget && budget.pct >= 80){
    return { level:"warn", mood:budget.pct >= 100 ? "angry" : "concerned", title:`${categoryById(budget.categoryId).name}预算${budget.pct >= 100 ? "已超支" : "快见底了"}`, text:`本月${categoryById(budget.categoryId).name}已用 ${budget.pct}%，接下来留意这类消费。` };
  }
  const top = slices[0];
  if(top && metrics.monthExpense > 0){
    return { level:"ok", mood:"happy", title:"消费结构清晰", text:`本月最大支出是${top.name}，占比 ${Math.round(top.value / metrics.monthExpense * 100)}%。` };
  }
  return { level:"ok", mood:"happy", title:"开始记录第一笔", text:"记下几笔之后，这里会展示分类占比、趋势和预算提醒。" };
}
function LineChart({ data, color }){
  const w = 340, h = 118, pad = 8;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const pts = data.map((v,i) => {
    const x = pad + i * ((w - pad * 2) / Math.max(1, data.length - 1));
    const y = pad + (h - pad * 2) * (1 - (v - min) / span);
    return [x, y];
  });
  const path = pts.map((p,i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  return (
    <svg className="mini-chart" viewBox={`0 0 ${w} ${h}`}>
      <defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".28" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill={color} />
    </svg>
  );
}
function Donut({ slices }){
  const visible = slices.length ? slices : [{ color:"#23262D", value:1 }];
  const total = visible.reduce((a,s) => a + s.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 140 140" width="140" height="140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#0F1216" strokeWidth="16" />
      {visible.map((s,i) => {
        const frac = s.value / total;
        const dash = frac * c;
        const el = <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="16" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-acc * c} transform="rotate(-90 70 70)" />;
        acc += frac;
        return el;
      })}
      <text x="70" y="64" textAnchor="middle" fill="#9AA0AA" fontSize="11">总支出</text>
      <text x="70" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800">{total >= 1000 ? "$" + (total / 1000).toFixed(1) + "k" : money(total).replace(".00", "")}</text>
    </svg>
  );
}
function BarChart({ data }){
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d,i) => <div key={d.label} className="bar-col"><div className="bar" style={{height:Math.max(5, d.value / max * 92), background:i === data.length - 1 ? "#00C805" : "#24303A"}}></div><span className="caption" style={{fontSize:10}}>{d.label}</span></div>)}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
