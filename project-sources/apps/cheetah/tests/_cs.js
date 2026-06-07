const { JSDOM } = require("jsdom"); const fs=require("fs");
const dom=new JSDOM(`<!DOCTYPE html><body><div id="root"></div></body>`,{url:"http://localhost"});
const {window}=dom; global.window=window; global.document=window.document; global.navigator=window.navigator;
const store={}; Object.defineProperty(window,"localStorage",{value:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>{},clear:()=>{}},configurable:true});
global.localStorage=window.localStorage; window.confirm=()=>true; window.alert=()=>{}; global.IS_REACT_ACT_ENVIRONMENT=true;
global.React=require("react"); const RD=require("react-dom"),RDC=require("react-dom/client"); global.ReactDOM=Object.assign({},RD,RDC); const {act}=require("react");
const errors=[]; console.error=(...a)=>errors.push(a.join(" "));
eval(fs.readFileSync("LeoLedger.js","utf8"));
const root=document.getElementById("root");
const fire=el=>act(()=>{el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));});
const setVal=(el,v)=>act(()=>{const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;set.call(el,v);el.dispatchEvent(new window.Event("input",{bubbles:true}));});
(async()=>{
  await act(async()=>{});
  // go to More
  const moreTab=[...root.querySelectorAll(".tab")].find(t=>/More/.test(t.textContent)); await fire(moreTab); await act(async()=>{});
  // open 分类管理 (nav-row containing 分类管理)
  const navs=[...root.querySelectorAll(".nav-row")];
  const catNav=navs.find(n=>/分类管理/.test(n.textContent)); await fire(catNav); await act(async()=>{});
  console.log("sheet open (分类管理):", root.textContent.includes("分类管理"));
  console.log("cat-cards:", root.querySelectorAll(".cat-card").length);
  console.log("shows 餐饮 & 占比/笔:", root.textContent.includes("餐饮"));
  // expand first category card head
  const head=root.querySelector(".cat-head"); await fire(head); await act(async()=>{});
  console.log("expanded shows 子分类:", root.textContent.includes("子分类"));
  console.log("sub-tags visible:", root.querySelectorAll(".sub-tag").length);
  // add subcategory
  const subInput=root.querySelector(".sub-add input"); setVal(subInput,"夜宵"); await act(async()=>{});
  const subAddBtn=root.querySelector(".sub-add .btn"); await fire(subAddBtn); await act(async()=>{});
  const cats=JSON.parse(localStorage.getItem("leoledger_jsx_v3")).categories;
  const food=cats.find(c=>c.id==="food");
  console.log("subcategory added to food:", food.subs.some(s=>s.name==="夜宵"), "count:", food.subs.length);
  // open add category panel
  const newBtn=[...root.querySelectorAll(".chip")].find(c=>/新分类/.test(c.textContent)); await fire(newBtn); await act(async()=>{});
  const nameInput=root.querySelector(".cat-card input.field"); setVal(nameInput,"宠物"); await act(async()=>{});
  const addBtn=[...root.querySelectorAll(".btn")].find(b=>b.textContent==="添加分类"); await fire(addBtn); await act(async()=>{});
  const cats2=JSON.parse(localStorage.getItem("leoledger_jsx_v3")).categories;
  console.log("category added (宠物):", cats2.some(c=>c.name==="宠物"), "| 其他 still last:", cats2[cats2.length-1].id==="other");
  const real=errors.filter(e=>!/not wrapped in act|ReactDOMTestUtils|deprecated|act\(/.test(e));
  console.log("REAL ERRORS:", real.length); real.slice(0,4).forEach(e=>console.log("  ⚠",e.slice(0,150)));
  console.log("CAT SMOKE DONE");
})();
