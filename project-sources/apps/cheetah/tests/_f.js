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
(async()=>{
  await act(async()=>{});
  for(const t of [...root.querySelectorAll(".tab")]){ await fire(t); await act(async()=>{}); }
  // open FAB
  await fire(root.querySelector(".fab")); await act(async()=>{});
  console.log("Add sheet opened (Add Record):", root.textContent.includes("Add Record"));
  // close it
  const close=root.querySelector(".record-close"); if(close){ await fire(close); await act(async()=>{}); }
  // go to More/profile, open a manage sheet (储蓄目标)
  const moreTab=[...root.querySelectorAll(".tab")].find(t=>/More/.test(t.textContent)); await fire(moreTab); await act(async()=>{});
  const navRows=[...root.querySelectorAll(".nav-row")];
  console.log("profile nav rows:", navRows.length);
  const real=errors.filter(e=>!/not wrapped in act|ReactDOMTestUtils|deprecated|Warning.*act\(/.test(e));
  console.log("REAL ERRORS:", real.length); real.slice(0,4).forEach(e=>console.log("  ⚠",e.slice(0,160)));
  console.log("FINAL SMOKE OK");
})();
