const { JSDOM } = require("jsdom");
const fs = require("fs");
const dom = new JSDOM(`<!DOCTYPE html><body><div id="root"></div></body>`,{url:"http://localhost"});
const { window } = dom;
global.window=window; global.document=window.document; global.navigator=window.navigator;
const store={}; window.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>{delete store[k]},clear:()=>{}};
global.localStorage=window.localStorage; window.confirm=()=>true; window.alert=()=>{};
global.IS_REACT_ACT_ENVIRONMENT=true;
global.React=require("react"); const RD=require("react-dom"),RDC=require("react-dom/client");
global.ReactDOM=Object.assign({},RD,RDC); const { act }=require("react");
const today=new Date().toISOString().slice(0,10);
const d=new Date(); d.setDate(d.getDate()-1); const due=d.toISOString().slice(0,10);
store["leoledger_jsx_v3"]=JSON.stringify({welcomed:true,
 transactions:[{id:"s0",amount:12,categoryId:"food",accountId:"daily",note:"午饭",date:today,type:"expense"}],
 accounts:[{id:"daily",name:"日常",balance:800,type:"现金"}],
 budgets:[{id:"b1",categoryId:"food",amount:600,month:today.slice(0,7)}],
 goals:[{id:"g1",name:"换手机",icon:"📱",target:1000,saved:980}],
 planned:[{id:"p1",name:"房租",amount:1200,type:"expense",categoryId:"home",accountId:"daily",dueDate:due,repeat:"每月"}],
 mascot:{xp:480,streakDays:12,lastEntry:today},pro:false});
const errors=[]; console.error=(...a)=>errors.push(a.join(" "));
eval(fs.readFileSync("LeoLedger.js","utf8"));
const root=document.getElementById("root");
(async()=>{
  await act(async()=>{});
  const planTab=[...root.querySelectorAll(".tab")].find(t=>/Planning/.test(t.textContent));
  await act(async()=>{ planTab.dispatchEvent(new window.MouseEvent("click",{bubbles:true})); });
  await act(async()=>{});
  console.log("today/due:", today, due);
  console.log("on planning (has 计划付款):", root.textContent.includes("计划付款"));
  console.log("has 已到期 banner:", root.textContent.includes("已到期"));
  console.log("has 房租:", root.textContent.includes("房租"));
  console.log("pay-chips:", root.querySelectorAll(".pay-chip").length);
  const chips=[...root.querySelectorAll(".pay-chip")];
  if(chips.length){
    const tx0=JSON.parse(localStorage.getItem("leoledger_jsx_v3")).transactions.length;
    await act(async()=>{ chips[0].dispatchEvent(new window.MouseEvent("click",{bubbles:true})); });
    await act(async()=>{});
    const st=JSON.parse(localStorage.getItem("leoledger_jsx_v3"));
    console.log("tx added:", st.transactions.length, "(was",tx0,")");
    console.log("plan dueDate advanced:", st.planned[0].dueDate, "(was",due,")");
    console.log("balance now:", st.accounts[0].balance);
  }
  const realErr=errors.filter(e=>!/not wrapped in act|ReactDOMTestUtils|deprecated|act\(/.test(e));
  console.log("real errors:", realErr.length); realErr.slice(0,3).forEach(e=>console.log("  ⚠",e.slice(0,140)));
})();
