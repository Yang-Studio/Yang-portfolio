const { JSDOM } = require("jsdom");
const fs = require("fs");
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, { url: "http://localhost", pretendToBeVisual: true });
const { window } = dom;
global.window = window; global.document = window.document; global.navigator = window.navigator;
// localStorage stub
const store = {}; window.localStorage = { getItem:k=>k in store?store[k]:null, setItem:(k,v)=>store[k]=String(v), removeItem:k=>{delete store[k];}, clear:()=>{for(const k in store)delete store[k];} };
global.localStorage = window.localStorage;
window.confirm = () => true; window.alert = () => {};
global.React = require("react");
const RD = require("react-dom"); const RDC = require("react-dom/client");
global.ReactDOM = Object.assign({}, RD, RDC);
global.requestAnimationFrame = cb => setTimeout(cb, 0);
window.matchMedia = window.matchMedia || (() => ({ matches:false, addListener(){}, removeListener(){} }));

const errors = [];
const origErr = console.error; console.error = (...a) => { errors.push(a.join(" ")); };

const code = fs.readFileSync("LeoLedger.js","utf8");
try { eval(code); } catch(e){ console.log("EVAL ERROR:", e.message); process.exit(1); }

const { act } = require("react-dom/test-utils");
function tick(){ return new Promise(r=>setTimeout(r,30)); }

(async () => {
  await tick();
  const root = document.getElementById("root");
  const txt = () => root.textContent;
  // Welcome should show (first launch -> seed has welcomed:true actually). Seed sets welcomed true, so app renders home directly.
  console.log("CONTAINS 总资产:", txt().includes("总资产"));
  // click through tabs
  const tabs = [...root.querySelectorAll(".tab")];
  console.log("tab count:", tabs.length, "labels:", tabs.map(t=>t.textContent).join("|"));
  for(const t of tabs){ await act(async()=>{ t.dispatchEvent(new window.MouseEvent("click",{bubbles:true})); }); await tick(); }
  // go to planning, find pay-all or pay chip
  const planTab = tabs.find(t=>/Planning/.test(t.textContent));
  await act(async()=>{ planTab.dispatchEvent(new window.MouseEvent("click",{bubbles:true})); }); await tick();
  const payChips = [...root.querySelectorAll(".pay-chip")];
  console.log("pay-chips on planning:", payChips.length);
  if(payChips.length){
    const before = JSON.parse(localStorage.getItem("leoledger_jsx_v3")).transactions.length;
    await act(async()=>{ payChips[0].dispatchEvent(new window.MouseEvent("click",{bubbles:true})); }); await tick();
    const after = JSON.parse(localStorage.getItem("leoledger_jsx_v3")).transactions.length;
    console.log("pay added tx? before/after:", before, after, after>before ? "OK" : "FAIL");
  }
  // open FAB add sheet
  await tick();
  const fab = root.querySelector(".fab");
  console.log("fab present:", !!fab);
  console.log("ERRORS (react):", errors.filter(e=>!/ReactDOM.render is no longer|not wrapped in act/.test(e)).length);
  errors.filter(e=>!/ReactDOM.render is no longer|not wrapped in act/.test(e)).slice(0,5).forEach(e=>console.log("  ⚠",e.slice(0,160)));
  console.log("SMOKE DONE");
})();
