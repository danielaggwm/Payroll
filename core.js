// Shared payroll engine for Brickell — used by both the employee and admin apps
// so every screen calculates working days, holidays, PTO and totals identically.
// No Firebase here — pure functions.

export const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
export const MSHORT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---------- date helpers ---------- */
export function iso(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
export function mkey(y,m){ return y+"-"+String(m).padStart(2,"0"); }
function easter(y){
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,
    f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,
    i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
    mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;
  return new Date(y,mo-1,da);
}
function nthWeekday(y,mo,wd,n){ let d=new Date(y,mo,1),c=0; while(true){ if(d.getDay()===wd){c++; if(c===n) return new Date(d);} d.setDate(d.getDate()+1); } }
function lastWeekday(y,mo,wd){ let d=new Date(y,mo+1,0); while(d.getDay()!==wd) d.setDate(d.getDate()-1); return d; }

/* ---------- holidays (rule-based, any year) ---------- */
export function computeHolidays(y){
  const gf=easter(y); gf.setDate(gf.getDate()-2);
  const tg=nthWeekday(y,10,4,4);
  const dayAfter=new Date(tg); dayAfter.setDate(tg.getDate()+1);
  return [
    {date:iso(new Date(y,0,1)),     name:"New Year's Day"},
    {date:iso(nthWeekday(y,0,1,3)), name:"Martin Luther King Jr. Day"},
    {date:iso(gf),                  name:"Good Friday"},
    {date:iso(lastWeekday(y,4,1)),  name:"Memorial Day"},
    {date:iso(new Date(y,5,19)),    name:"Juneteenth National Independence Day"},
    {date:iso(new Date(y,6,4)),     name:"Independence Day"},
    {date:iso(nthWeekday(y,8,1,1)), name:"Labor Day"},
    {date:iso(new Date(y,10,11)),   name:"Veterans Day"},
    {date:iso(tg),                  name:"Thanksgiving Day"},
    {date:iso(dayAfter),            name:"Day after Thanksgiving"},
    {date:iso(new Date(y,11,25)),   name:"Christmas Day"},
  ];
}
export function holidaysForYear(y, overrides){
  const ov=overrides && overrides[String(y)];
  return (ov && ov.length) ? ov : computeHolidays(y);
}
export function daysInMonth(y,m){ return new Date(y,m,0).getDate(); }
export function weekdaysInMonth(y,m){ let d=daysInMonth(y,m),n=0; for(let i=1;i<=d;i++){ let w=new Date(y,m-1,i).getDay(); if(w>=1&&w<=5)n++; } return n; }
export function holidayList(y,m,overrides){ return holidaysForYear(y,overrides).filter(h=>{ const dt=new Date(h.date+"T00:00:00");
  if(dt.getFullYear()!==y||dt.getMonth()+1!==m) return false; const w=dt.getDay(); return w>=1&&w<=5; }); }
export function monthMeta(y,m,overrides){ const wk=weekdaysInMonth(y,m), hl=holidayList(y,m,overrides);
  return {days:daysInMonth(y,m),weekdays:wk,holidayCount:hl.length,workingDays:wk-hl.length,holidays:hl}; }

/* ---------- month calculation ----------
   rec fields (all optional): vac, sick, pday (HOURS), ot (hours), adj (hours, admin only),
   reghOverride, salaryHoursOverride, miles, reimbursement, bonus, note, status
*/
export function computeMonth(company, emp, rec, y, m){
  rec = rec || {};
  const meta=monthMeta(y,m, company.holidayOverrides), hpd=emp.hoursPerDay||8;
  const vacH=+rec.vac||0, sickH=+rec.sick||0, pdayH=+rec.pday||0, ptoH=vacH+sickH+pdayH;
  const vacD=vacH/hpd, sickD=sickH/hpd, pdayD=pdayH/hpd;
  const ot=+rec.ot||0, adj=(emp.type==="hourly")?(+rec.adj||0):0;
  const miles=+rec.miles||0, mileagePay=miles*(company.mileageRate||0);
  const tolls=+rec.tolls||0;
  const reimb=+rec.reimbursement||0;
  const reimbTotal=round2(mileagePay+tolls+reimb);
  const bonus=(rec.bonus!=null?+rec.bonus:(emp.monthlyBonus||0));
  const hol=hpd*meta.holidayCount;
  let salh=0, regh=0, total=0, base=0;
  if(emp.type==="salaried"){
    salh=(rec.salaryHoursOverride!=null)?+rec.salaryHoursOverride:meta.workingDays*hpd;
    total=salh+hol+ot; base=salh;
  }else{
    regh=(rec.reghOverride!=null)?+rec.reghOverride:(meta.workingDays*hpd-ptoH);
    total=regh+hol+ot+adj+ptoH; base=regh;
  }
  return {meta,hpd,salh,regh,base,hol,ot,adj,vacH,sickH,pdayH,vacD,sickD,pdayD,ptoH,
    miles,mileagePay,tolls,reimb,reimbTotal,bonus,total:round2(total),note:rec.note||null,status:rec.status||"draft"};
}

/* ---------- active-month window ----------
   A month counts toward totals once tracking has started and it isn't in the future.
   This MUST match index.html's isActiveMonth() so the employee and admin dashboards
   always agree on which months are included. */
export function activeWindow(company){
  const c=company||{};
  const ts = c.trackingStart || (((c.startYear)|| (new Date()).getFullYear())+"-01");
  const n=new Date(); const nowK=mkey(n.getFullYear(), n.getMonth()+1);
  return {from:ts, to:nowK};
}
export function isActiveMonthKey(k, company){ const w=activeWindow(company); return k>=w.from && k<=w.to; }

/* ---------- PTO balances (days) for a year ----------
   timesheets: map of "YYYY-MM" -> rec, for this employee & year.
   Only months inside the active tracking window are counted (same rule as the admin),
   so a stale, future, or pre-tracking draft can never inflate "used". Pre-tracking
   usage belongs in priorUsed instead.
*/
export function balances(emp, timesheets, y, company){
  const hpd=emp.hoursPerDay||8;
  const pr=(emp.priorUsed&&emp.priorUsed[String(y)])||{};
  let vacH=0, sickH=0, pdayH=0;
  Object.keys(timesheets||{}).forEach(k=>{ if(k.slice(0,4)==String(y) && isActiveMonthKey(k, company)){ const r=timesheets[k]||{};
    vacH+=+r.vac||0; sickH+=+r.sick||0; pdayH+=+r.pday||0; } });
  const used={ vacation: round2(vacH/hpd + (+pr.vacationDays||0)),
               sick:     round2(sickH/hpd + (+pr.sickDays||0)),
               personal: round2(pdayH/hpd + (+pr.personalDays||0)) };
  const ent=emp.entitlements||{};
  return {
    hpd,
    vacation:{ used:used.vacation, ent:(ent.vacationDays??15), remaining:round2((ent.vacationDays??15)-used.vacation) },
    sick:    { used:used.sick,     ent:(ent.sickDays??3),      remaining:round2((ent.sickDays??3)-used.sick) },
    personal:{ used:used.personal, ent:(ent.personalDays??2),  remaining:round2((ent.personalDays??2)-used.personal) },
  };
}

/* ---------- formatting ---------- */
export const round2=n=>Math.round(n*100)/100;
export function fh(n){ if(n==null) return "—"; return (round2(n)).toLocaleString(undefined,{maximumFractionDigits:2}); }
export function fd(n){ return (round2(n)).toLocaleString(undefined,{maximumFractionDigits:2}); }
export function money(n){ return "$"+(round2(n)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
export function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
