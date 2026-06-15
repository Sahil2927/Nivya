import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Home, BarChart3, Layers, Briefcase, User, Search, Bell, Eye, EyeOff,
  ChevronRight, ArrowLeft, TrendingUp, TrendingDown, Star, Plus, Minus, X,
  Wallet, ShieldCheck,
  Settings, HelpCircle, FileText, LogOut, Building2, BadgeCheck,
} from "lucide-react";

/* ============================================================
   Nivya — a mobile-first investing app (Groww-style demo)
   Single-file React artifact. Mock data + simulated live prices.
   ============================================================ */

const CSS = `
:root{
  --navy:#16213E; --navy2:#0F1830; --navy3:#1E2A4A;
  --teal:#16C9AE; --blue:#2456BE;
  --brand:#0FA8A0;            /* interactive accent */
  --brand-ink:#0B7E78;
  --up:#16A35A; --up-bg:#E7F6EE;
  --down:#E0444B; --down-bg:#FDECEC;
  --bg:#F4F6F9; --surface:#FFFFFF; --soft:#F2F4F7;
  --ink:#0D1526; --muted:#667085; --faint:#98A2B3;
  --line:#EAECF0; --line2:#EDF0F4;
  --grad:linear-gradient(152deg,#19C9AE 0%,#1F8FB8 42%,#2456BE 100%);
  --shadow:0 1px 2px rgba(16,24,40,.05),0 1px 3px rgba(16,24,40,.06);
  --font:"Plus Jakarta Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
.nv-root{font-family:var(--font);color:var(--ink);}
.num{font-family:var(--mono);font-variant-numeric:tabular-nums;letter-spacing:-.02em;}

.stage{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(130% 120% at 50% -10%,#21345d 0%,#0f1a35 45%,#0a1226 100%);}

.phone{position:relative;width:100%;max-width:440px;height:100vh;background:var(--bg);
  display:flex;flex-direction:column;overflow:hidden;}
@media(min-width:480px){
  .phone{height:884px;border-radius:40px;
    box-shadow:0 50px 100px -20px rgba(2,8,23,.7),0 0 0 11px #0b1224,0 0 0 12px rgba(255,255,255,.05);}
}

/* status bar */
.statusbar{height:34px;flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;
  padding:0 22px;font-size:13px;font-weight:700;color:var(--ink);background:var(--surface);}
.statusbar .dots{display:flex;gap:5px;align-items:center;}
.sigbar{display:flex;gap:2px;align-items:flex-end;height:11px;}
.sigbar i{width:3px;background:var(--ink);border-radius:1px;display:block;}
.batt{width:22px;height:11px;border:1.5px solid var(--ink);border-radius:3px;position:relative;padding:1.5px;}
.batt::after{content:"";position:absolute;right:-3px;top:3px;width:2px;height:5px;background:var(--ink);border-radius:0 1px 1px 0;}
.batt i{display:block;height:100%;width:72%;background:var(--ink);border-radius:1px;}

/* appbar */
.appbar{flex:0 0 auto;background:var(--surface);padding:8px 16px 12px;display:flex;align-items:center;
  justify-content:space-between;border-bottom:1px solid var(--line);}
.brand{display:flex;align-items:center;gap:9px;}
.brand .wm{font-size:20px;font-weight:800;letter-spacing:-.03em;}
.brand .wm b{color:var(--navy);} 
.iconbtn{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:none;background:var(--soft);color:var(--ink);cursor:pointer;position:relative;}
.iconbtn:active{transform:scale(.94);}
.dot{position:absolute;top:8px;right:9px;width:7px;height:7px;background:var(--down);border-radius:50%;border:2px solid var(--surface);}
.appbar-actions{display:flex;gap:8px;align-items:center;}

/* scroll body */
.scroll{flex:1 1 auto;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;
  padding:14px 16px 96px;}
.scroll::-webkit-scrollbar{width:0;}

/* wealth hero */
.wealth{position:relative;border-radius:22px;padding:18px 18px 16px;color:#fff;overflow:hidden;
  background:var(--grad);box-shadow:0 14px 30px -10px rgba(20,48,110,.55);}
.wealth .peaks{position:absolute;inset:auto 0 -2px 0;opacity:.16;pointer-events:none;}
.wealth .lbl{font-size:12.5px;font-weight:600;opacity:.86;display:flex;align-items:center;gap:7px;}
.wealth .val{font-size:31px;font-weight:800;margin:5px 0 2px;}
.wealth .sub{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;margin-top:4px;}
.delta{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:999px;font-weight:700;font-size:12.5px;}
.delta.pos{background:rgba(255,255,255,.18);} .delta.neg{background:rgba(255,255,255,.18);}
.wealth .stats{display:flex;gap:0;margin-top:15px;background:rgba(255,255,255,.13);border-radius:14px;overflow:hidden;}
.wealth .stats .st{flex:1;padding:10px 12px;}
.wealth .stats .st + .st{border-left:1px solid rgba(255,255,255,.16);}
.wealth .stats .k{font-size:11px;opacity:.82;font-weight:600;}
.wealth .stats .v{font-size:14.5px;font-weight:700;margin-top:3px;}
.eye{margin-left:auto;background:rgba(255,255,255,.16);border:none;color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;cursor:pointer;}

/* quick actions */
.quick{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px;}
.qa{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 6px;display:flex;
  flex-direction:column;align-items:center;gap:7px;cursor:pointer;box-shadow:var(--shadow);}
.qa:active{transform:scale(.97);}
.qa .ic{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;}
.qa .t{font-size:11.5px;font-weight:600;color:var(--ink);}

/* index strip */
.strip{display:flex;gap:10px;overflow-x:auto;padding:2px 0 4px;margin-top:6px;scrollbar-width:none;}
.strip::-webkit-scrollbar{display:none;}
.idx{flex:0 0 auto;min-width:140px;background:var(--surface);border:1px solid var(--line);border-radius:16px;
  padding:12px 13px;box-shadow:var(--shadow);}
.idx .nm{font-size:12.5px;font-weight:700;color:var(--ink);}
.idx .pr{font-size:15px;font-weight:700;margin-top:4px;}
.idx .ch{font-size:12px;font-weight:600;margin-top:2px;}

/* section */
.section{margin-top:22px;}
.sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;padding:0 2px;}
.sec-head h3{font-size:16px;font-weight:700;margin:0;letter-spacing:-.01em;}
.seeall{font-size:12.5px;font-weight:700;color:var(--brand-ink);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:1px;}

/* card list */
.list{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow);}
.row{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;background:var(--surface);}
.row:active{background:var(--soft);}
.row + .row{border-top:1px solid var(--line2);}
.av{width:40px;height:40px;border-radius:12px;flex:0 0 auto;display:grid;place-items:center;color:#fff;
  font-weight:800;font-size:13px;letter-spacing:-.02em;}
.row .meta{flex:1;min-width:0;}
.row .nm{font-size:14px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.row .sub{font-size:11.5px;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:6px;}
.row .right{text-align:right;flex:0 0 auto;display:flex;align-items:center;gap:10px;}
.row .price{font-size:14px;font-weight:700;color:var(--ink);}
.row .chg{font-size:11.5px;font-weight:700;margin-top:2px;}
.tag{font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:var(--soft);color:var(--muted);}
.star{background:none;border:none;cursor:pointer;padding:4px;color:var(--faint);}

.up{color:var(--up);} .down{color:var(--down);}

/* segmented */
.seg{display:flex;background:var(--soft);border-radius:12px;padding:4px;gap:4px;}
.seg button{flex:1;border:none;background:none;padding:8px 4px;border-radius:9px;font-weight:700;font-size:13px;
  color:var(--muted);cursor:pointer;font-family:var(--font);}
.seg button.on{background:var(--surface);color:var(--ink);box-shadow:var(--shadow);}

/* search */
.searchbar{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);
  border-radius:14px;padding:11px 14px;box-shadow:var(--shadow);}
.searchbar input{border:none;outline:none;flex:1;font-size:14.5px;font-family:var(--font);color:var(--ink);background:none;}
.searchbar input::placeholder{color:var(--faint);}

/* chips */
.chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0;scrollbar-width:none;}
.chips::-webkit-scrollbar{display:none;}
.chip{flex:0 0 auto;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 13px;
  font-size:12.5px;font-weight:600;color:var(--ink);cursor:pointer;}
.chip.on{background:var(--navy);color:#fff;border-color:var(--navy);}

/* bottom nav */
.bottomnav{position:absolute;left:0;right:0;bottom:0;background:rgba(255,255,255,.96);
  backdrop-filter:blur(12px);border-top:1px solid var(--line);display:flex;padding:7px 6px 9px;z-index:30;}
.nav{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;
  cursor:pointer;padding:5px 0;color:var(--faint);font-family:var(--font);}
.nav span{font-size:10.5px;font-weight:600;}
.nav.on{color:var(--brand-ink);}

/* overlay screens (detail) */
.overlay{position:absolute;inset:0;background:var(--bg);z-index:40;display:flex;flex-direction:column;
  animation:slideIn .26s cubic-bezier(.22,1,.36,1);}
@keyframes slideIn{from{transform:translateX(7%);opacity:.4;}to{transform:translateX(0);opacity:1;}}
.dbar{flex:0 0 auto;background:var(--surface);padding:10px 12px;display:flex;align-items:center;gap:10px;
  border-bottom:1px solid var(--line);}
.dbar .back{width:38px;height:38px;border-radius:50%;border:none;background:var(--soft);display:grid;place-items:center;cursor:pointer;color:var(--ink);}
.dbar .ttl{flex:1;min-width:0;}
.dbar .ttl .a{font-size:15px;font-weight:800;line-height:1.1;}
.dbar .ttl .b{font-size:11.5px;color:var(--muted);margin-top:1px;}

.dscroll{flex:1;overflow-y:auto;padding:16px 16px 110px;}
.dscroll::-webkit-scrollbar{width:0;}
.ltp{display:flex;align-items:flex-end;justify-content:space-between;}
.ltp .big{font-size:30px;font-weight:800;}
.ltp .ch{font-size:14px;font-weight:700;margin-top:3px;}

/* timeframe */
.tf{display:flex;gap:6px;margin:14px 0 4px;}
.tf button{flex:1;border:none;background:var(--soft);color:var(--muted);font-weight:700;font-size:12.5px;
  padding:7px 0;border-radius:9px;cursor:pointer;font-family:var(--font);}
.tf button.on{background:var(--navy);color:#fff;}

/* stat grid */
.statgrid{display:grid;grid-template-columns:1fr 1fr;gap:0;background:var(--surface);border:1px solid var(--line);
  border-radius:16px;overflow:hidden;box-shadow:var(--shadow);}
.statgrid .cell{padding:13px 15px;}
.statgrid .cell:nth-child(odd){border-right:1px solid var(--line2);}
.statgrid .cell{border-bottom:1px solid var(--line2);}
.statgrid .cell:nth-last-child(-n+2){border-bottom:none;}
.statgrid .k{font-size:11.5px;color:var(--muted);font-weight:600;}
.statgrid .v{font-size:14px;font-weight:700;margin-top:3px;}

.about{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:15px;box-shadow:var(--shadow);}
.about p{margin:0;font-size:13.5px;line-height:1.55;color:#475467;}

.hold-note{background:#EAF7F3;border:1px solid #CDEDE3;border-radius:14px;padding:11px 14px;display:flex;
  align-items:center;justify-content:space-between;}
.hold-note .l{font-size:12px;color:var(--brand-ink);font-weight:700;}
.hold-note .r{font-size:13px;font-weight:800;color:var(--ink);}

/* trade bar */
.tradebar{position:absolute;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--line);
  padding:12px 16px 16px;display:flex;gap:11px;z-index:45;}
.btn{flex:1;border:none;border-radius:13px;padding:14px 0;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font);}
.btn:active{transform:scale(.985);}
.btn-sell{background:var(--down-bg);color:var(--down);}
.btn-buy{background:var(--up);color:#fff;}
.btn-grad{background:var(--grad);color:#fff;}
.btn-full{width:100%;flex:none;}

/* modal sheet */
.scrim{position:absolute;inset:0;background:rgba(8,15,30,.46);z-index:60;display:flex;align-items:flex-end;
  animation:fade .2s ease;}
@keyframes fade{from{opacity:0;}to{opacity:1;}}
.sheet{width:100%;background:var(--surface);border-radius:24px 24px 0 0;padding:8px 18px 20px;
  animation:up .3s cubic-bezier(.22,1,.36,1);max-height:90%;overflow-y:auto;}
@keyframes up{from{transform:translateY(100%);}to{transform:translateY(0);}}
.grab{width:42px;height:5px;border-radius:3px;background:#E0E4EA;margin:6px auto 14px;}
.sheet h4{font-size:17px;font-weight:800;margin:0 0 2px;}
.sheet .ltp-line{font-size:12.5px;color:var(--muted);font-weight:600;margin-bottom:14px;}

.stepper{display:flex;align-items:center;justify-content:space-between;background:var(--soft);border-radius:13px;
  padding:6px;margin-top:6px;}
.stepper button{width:42px;height:42px;border-radius:10px;border:none;background:var(--surface);box-shadow:var(--shadow);
  display:grid;place-items:center;cursor:pointer;color:var(--ink);}
.stepper input{flex:1;text-align:center;border:none;background:none;font-size:19px;font-weight:800;outline:none;
  font-family:var(--mono);color:var(--ink);width:60px;}
.fieldlbl{font-size:12px;font-weight:700;color:var(--muted);margin:16px 0 0;}
.ordtype{display:flex;gap:8px;margin-top:8px;}
.ordtype button{flex:1;border:1px solid var(--line);background:var(--surface);border-radius:11px;padding:10px;
  font-weight:700;font-size:13px;color:var(--muted);cursor:pointer;font-family:var(--font);}
.ordtype button.on{border-color:var(--navy);color:var(--ink);background:var(--soft);}
.limitfield{margin-top:10px;display:flex;align-items:center;background:var(--soft);border-radius:12px;padding:0 14px;}
.limitfield input{flex:1;border:none;background:none;outline:none;padding:13px 0;font-size:16px;font-weight:700;font-family:var(--mono);color:var(--ink);}
.summary{margin-top:18px;border-top:1px dashed var(--line);padding-top:14px;}
.sumrow{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:9px;color:#475467;font-weight:600;}
.sumrow.total{font-size:16px;font-weight:800;color:var(--ink);margin-top:4px;}

/* allocation */
.alloc{height:12px;border-radius:8px;overflow:hidden;display:flex;margin:14px 0 12px;}
.alloc i{height:100%;}
.legend{display:flex;flex-wrap:wrap;gap:10px 16px;}
.lg{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#475467;}
.lg .sw{width:10px;height:10px;border-radius:3px;}

/* profile */
.pcard{background:var(--grad);border-radius:20px;padding:18px;color:#fff;display:flex;align-items:center;gap:14px;
  box-shadow:0 14px 30px -12px rgba(20,48,110,.5);}
.pcard .ring{width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:21px;font-weight:800;}
.pcard .nm{font-size:18px;font-weight:800;}
.pcard .em{font-size:12.5px;opacity:.85;margin-top:2px;}
.menu{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);margin-top:16px;}
.mrow{display:flex;align-items:center;gap:14px;padding:15px 16px;cursor:pointer;}
.mrow + .mrow{border-top:1px solid var(--line2);}
.mrow:active{background:var(--soft);}
.mrow .mi{width:36px;height:36px;border-radius:10px;background:var(--soft);display:grid;place-items:center;color:var(--navy);}
.mrow .mt{flex:1;font-size:14px;font-weight:600;}

.disclaimer{margin-top:18px;text-align:center;font-size:11px;color:var(--faint);line-height:1.5;padding:0 8px;}
.kyc{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.2);padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;margin-top:7px;}

/* toast */
.toast{position:absolute;left:16px;right:16px;bottom:84px;background:var(--navy);color:#fff;border-radius:14px;
  padding:13px 16px;font-size:13.5px;font-weight:600;z-index:80;display:flex;align-items:center;gap:10px;
  box-shadow:0 12px 30px rgba(8,15,30,.4);animation:toastIn .3s cubic-bezier(.22,1,.36,1);}
@keyframes toastIn{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.toast .tick{width:22px;height:22px;border-radius:50%;background:var(--up);display:grid;place-items:center;flex:0 0 auto;}

/* splash */
.splash{position:absolute;inset:0;z-index:120;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(120% 100% at 50% 0%,#21345d,#0f1a35 55%,#0a1226);gap:18px;animation:fade .3s;}
.splash .name{color:#fff;font-size:30px;font-weight:800;letter-spacing:-.04em;animation:pop .6s cubic-bezier(.22,1,.36,1);}
.splash .tag{color:rgba(255,255,255,.55);font-size:13px;font-weight:600;letter-spacing:.02em;}
@keyframes pop{from{transform:scale(.8);opacity:0;}to{transform:scale(1);opacity:1;}}
.tipbar{font-size:11px;color:var(--muted);text-align:center;margin-top:14px;font-weight:600;}
`;

/* ---------------- data ---------------- */
const STOCKS = [
  { s:"RELIANCE", n:"Reliance Industries", sec:"Energy",        p:1432.50, c:0.0124, mc:"₹19.4L Cr", pe:24.1 },
  { s:"TCS",      n:"Tata Consultancy",     sec:"IT",            p:3310.00, c:-0.0045, mc:"₹12.1L Cr", pe:28.5 },
  { s:"HDFCBANK", n:"HDFC Bank",            sec:"Banking",       p:1705.20, c:0.0082, mc:"₹13.0L Cr", pe:19.8 },
  { s:"INFY",     n:"Infosys",              sec:"IT",            p:1498.60, c:0.0210, mc:"₹6.2L Cr",  pe:26.0 },
  { s:"ICICIBANK",n:"ICICI Bank",           sec:"Banking",       p:1278.40, c:0.0055, mc:"₹9.0L Cr",  pe:18.4 },
  { s:"SBIN",     n:"State Bank of India",  sec:"Banking",       p:812.30,  c:-0.0110, mc:"₹7.2L Cr",  pe:10.9 },
  { s:"BHARTIARTL",n:"Bharti Airtel",       sec:"Telecom",       p:1620.75, c:0.0095, mc:"₹9.6L Cr",  pe:72.0 },
  { s:"ITC",      n:"ITC",                  sec:"FMCG",          p:462.15,  c:-0.0030, mc:"₹5.8L Cr",  pe:25.3 },
  { s:"LT",       n:"Larsen & Toubro",      sec:"Infrastructure",p:3540.00, c:0.0150, mc:"₹4.9L Cr",  pe:36.2 },
  { s:"TATAMOTORS",n:"Tata Motors",         sec:"Automobile",    p:985.40,  c:0.0320, mc:"₹3.6L Cr",  pe:11.4 },
  { s:"WIPRO",    n:"Wipro",                sec:"IT",            p:298.55,  c:-0.0085, mc:"₹3.1L Cr",  pe:22.7 },
  { s:"HINDUNILVR",n:"Hindustan Unilever",  sec:"FMCG",          p:2410.00, c:0.0012, mc:"₹5.7L Cr",  pe:55.1 },
  { s:"BAJFINANCE",n:"Bajaj Finance",       sec:"Finance",       p:6920.00, c:-0.0065, mc:"₹4.3L Cr",  pe:30.8 },
  { s:"MARUTI",   n:"Maruti Suzuki",        sec:"Automobile",    p:10840.0, c:0.0142, mc:"₹3.4L Cr",  pe:27.6 },
  { s:"SUNPHARMA",n:"Sun Pharma",           sec:"Pharma",        p:1722.00, c:0.0078, mc:"₹4.1L Cr",  pe:38.9 },
  { s:"ASIANPAINT",n:"Asian Paints",        sec:"Consumer",      p:2855.00, c:0.0040, mc:"₹2.7L Cr",  pe:52.4 },
  { s:"ADANIENT", n:"Adani Enterprises",    sec:"Infrastructure",p:2340.00, c:0.0280, mc:"₹2.7L Cr",  pe:78.5 },
  { s:"TITAN",    n:"Titan Company",        sec:"Consumer",      p:3252.00, c:-0.0058, mc:"₹2.9L Cr",  pe:88.0 },
];

const INDICES = [
  { s:"NIFTY 50",   p:24850.45, c:0.0062 },
  { s:"SENSEX",     p:81420.30, c:0.0055 },
  { s:"NIFTY BANK", p:53210.80, c:0.0078 },
  { s:"NIFTY IT",   p:43180.20, c:-0.0034 },
];

const FUNDS = [
  { s:"Parag Parikh Flexi Cap", h:"PPFAS", cat:"Flexi Cap", risk:"Very High", r3:22.4, r1:31.8, r5:24.9, nav:82.15 },
  { s:"Nippon India Small Cap", h:"Nippon", cat:"Small Cap", risk:"Very High", r3:31.2, r1:38.6, r5:34.1, nav:178.90 },
  { s:"HDFC Balanced Advantage", h:"HDFC", cat:"Hybrid", risk:"High", r3:18.6, r1:21.2, r5:17.4, nav:495.20 },
  { s:"Quant Small Cap", h:"Quant", cat:"Small Cap", risk:"Very High", r3:34.8, r1:29.4, r5:39.2, nav:265.40 },
  { s:"Mirae Asset Large Cap", h:"Mirae", cat:"Large Cap", risk:"High", r3:15.9, r1:19.7, r5:16.8, nav:105.60 },
  { s:"Axis Bluechip Fund", h:"Axis", cat:"Large Cap", risk:"High", r3:13.2, r1:18.1, r5:14.6, nav:58.30 },
  { s:"SBI Contra Fund", h:"SBI", cat:"Contra", risk:"Very High", r3:27.5, r1:24.9, r5:30.3, nav:385.70 },
  { s:"ICICI Pru Technology", h:"ICICI", cat:"Sectoral", risk:"Very High", r3:19.8, r1:33.5, r5:26.1, nav:192.30 },
];

const INITIAL_HOLDINGS = [
  { s:"RELIANCE", qty:50, avg:1290 },
  { s:"INFY", qty:40, avg:1380 },
  { s:"HDFCBANK", qty:30, avg:1640 },
  { s:"TATAMOTORS", qty:60, avg:820 },
  { s:"ICICIBANK", qty:45, avg:1180 },
  { s:"ITC", qty:100, avg:440 },
];

const INITIAL_WATCH = ["MARUTI","SUNPHARMA","ADANIENT","TITAN","BHARTIARTL"];

const AV_COLORS = ["#2456BE","#0E9C8E","#7A5AF8","#E8943A","#D6409F","#16A35A","#0E7C86","#475467","#DC6803","#3E63DD"];
const SECTOR_BLURB = {
  Energy:"operates across oil-to-chemicals, retail, and digital services, and is among India's largest companies by market value.",
  IT:"provides software services, consulting, and digital transformation to enterprise clients across global markets.",
  Banking:"offers retail and corporate banking, lending, and deposit products across a wide branch and digital network.",
  Telecom:"is a leading telecom operator providing mobile, broadband, and enterprise connectivity services.",
  FMCG:"manufactures and sells everyday consumer goods across food, personal care, and household categories.",
  Infrastructure:"builds and operates large-scale infrastructure, engineering, and industrial projects.",
  Automobile:"designs and manufactures passenger and commercial vehicles for domestic and export markets.",
  Finance:"provides consumer and commercial lending, financing, and wealth products.",
  Pharma:"develops, manufactures, and markets generic and specialty pharmaceutical products globally.",
  Consumer:"sells branded consumer and lifestyle products through retail and distribution channels.",
};

/* ---------------- helpers ---------------- */
const nf2 = new Intl.NumberFormat("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 });
const nf0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits:0 });
const inr = (n) => "₹" + nf2.format(n);
const inr0 = (n) => "₹" + nf0.format(Math.round(n));
const signPct = (c) => (c >= 0 ? "+" : "") + (c * 100).toFixed(2) + "%";
const signInr = (n) => (n >= 0 ? "+" : "−") + "₹" + nf2.format(Math.abs(n));

function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return (h>>>0); }
function mulberry32(a){ return function(){ a|=0;a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const avColor = (s) => AV_COLORS[hashStr(s) % AV_COLORS.length];
const mono = (s) => s.replace(/[^A-Z]/gi,"").slice(0,2).toUpperCase();

const prevCloseOf = (st) => st.p / (1 + st.c);

function genSeries(sym, tf, price, prevClose){
  const conf = { "1D":{n:42,vol:0.006,rmin:0,rmax:0}, "1W":{n:34,vol:0.014,rmin:-0.04,rmax:0.06},
                 "1M":{n:30,vol:0.03,rmin:-0.07,rmax:0.12}, "1Y":{n:52,vol:0.05,rmin:-0.12,rmax:0.34} }[tf];
  const rng = mulberry32(hashStr(sym + tf));
  const start = tf === "1D" ? prevClose : price * (1 - (conf.rmin + rng()*(conf.rmax-conf.rmin)));
  // brownian bridge for wiggle pinned to 0 at both ends
  const w = [0];
  for(let i=1;i<conf.n;i++) w.push(w[i-1] + (rng()-0.5));
  const last = w[conf.n-1];
  let maxAbs = 0;
  for(let i=0;i<conf.n;i++){ w[i] = w[i] - last*(i/(conf.n-1)); maxAbs = Math.max(maxAbs, Math.abs(w[i])); }
  maxAbs = maxAbs || 1;
  const amp = price * conf.vol;
  const out = [];
  for(let i=0;i<conf.n;i++){
    const t = i/(conf.n-1);
    const base = start + (price - start)*t;
    const v = base + (w[i]/maxAbs)*amp;
    out.push({ t:i, v: Math.max(v, price*0.4) });
  }
  out[conf.n-1].v = price; // pin to live price
  return out;
}

/* ---------------- atoms ---------------- */
function NivyaMark({ size=28 }){
  const g = "nvgrad-" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Nivya">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#19C9AE" />
          <stop offset="1" stopColor="#2456BE" />
        </linearGradient>
      </defs>
      <polygon points="40,14 49,14 26,86 13,86" fill="#16213E" />
      <polygon points="52,14 63,28 56,86 43,86" fill={`url(#${g})`} />
      <polygon points="64,42 74,42 83,86 67,86" fill="#16213E" />
    </svg>
  );
}

function Avatar({ s }){
  return <div className="av" style={{ background: avColor(s) }}>{mono(s)}</div>;
}

function MiniSpark({ data, up }){
  const ys = data.map(d=>d.v);
  const min = Math.min(...ys), max = Math.max(...ys), rng = max-min || 1;
  const W = 56, H = 26;
  const pts = data.map((d,i)=>{
    const x = (i/(data.length-1))*W;
    const y = H - ((d.v-min)/rng)*H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={W} height={H} style={{display:"block"}}>
      <polyline points={pts} fill="none" stroke={up?"var(--up)":"var(--down)"} strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ChartTip({ active, payload }){
  if(!active || !payload || !payload.length) return null;
  return <div style={{background:"var(--navy)",color:"#fff",padding:"5px 10px",borderRadius:8,fontSize:12,
    fontWeight:700,fontFamily:"var(--mono)"}}>{inr(payload[0].value)}</div>;
}

function PriceChart({ sym, tf, price, prevClose, up }){
  const data = useMemo(()=>genSeries(sym, tf, price, prevClose), [sym, tf, price, prevClose]);
  const ys = data.map(d=>d.v);
  const min = Math.min(...ys), max = Math.max(...ys);
  const pad = (max-min)*0.12 || 1;
  const color = up ? "var(--up)" : "var(--down)";
  const id = `g-${sym}-${tf}-${up?"u":"d"}`;
  return (
    <div style={{height:210, width:"100%", margin:"6px -6px 0"}}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{top:8,right:8,left:8,bottom:0}}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[min-pad, max+pad]} />
          <XAxis dataKey="t" hide />
          {tf==="1D" && <ReferenceLine y={prevClose} stroke="var(--faint)" strokeDasharray="5 5" strokeOpacity={0.7} />}
          <Tooltip content={<ChartTip />} cursor={{stroke:"var(--faint)",strokeOpacity:0.4,strokeWidth:1}} />
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.2} fill={`url(#${id})`}
            dot={false} isAnimationActive animationDuration={450} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- stock row ---------------- */
function StockRow({ st, quote, onOpen, watched, onToggleWatch, showStar=false }){
  const chg = quote.price/quote.prevClose - 1;
  const up = chg >= 0;
  const spark = useMemo(()=>genSeries(st.s, "1D", quote.price, quote.prevClose), [st.s, Math.round(quote.price*4)]);
  return (
    <div className="row" onClick={onOpen}>
      <Avatar s={st.s} />
      <div className="meta">
        <div className="nm">{st.n}</div>
        <div className="sub"><span>{st.s}</span><span className="tag">{st.sec}</span></div>
      </div>
      <MiniSpark data={spark} up={up} />
      <div className="right">
        <div>
          <div className="price num">{inr(quote.price)}</div>
          <div className={"chg num " + (up?"up":"down")}>{signPct(chg)}</div>
        </div>
        {showStar && (
          <button className="star" onClick={(e)=>{e.stopPropagation();onToggleWatch(st.s);}}>
            <Star size={18} fill={watched?"#F5A623":"none"} color={watched?"#F5A623":"currentColor"} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- screens ---------------- */
function Home({ quotes, holdings, watch, balVis, setBalVis, openStock, go, toggleWatch }){
  const portfolio = useMemo(()=>{
    let inv=0, cur=0, day=0;
    holdings.forEach(h=>{
      const q = quotes[h.s]; if(!q) return;
      inv += h.qty*h.avg; cur += h.qty*q.price; day += h.qty*(q.price - q.prevClose);
    });
    return { inv, cur, day, ret: cur-inv, retPct: inv? (cur-inv)/inv : 0, dayPct: cur? day/(cur-day) : 0 };
  }, [quotes, holdings]);

  const trending = ["TATAMOTORS","ADANIENT","INFY","MARUTI","LT"].map(s=>STOCKS.find(x=>x.s===s));
  const dispHold = holdings.slice(0,3);

  return (
    <div className="scroll">
      {/* wealth hero */}
      <div className="wealth">
        <svg className="peaks" viewBox="0 0 440 70" preserveAspectRatio="none">
          <polygon points="0,70 70,26 120,52 200,10 260,44 330,18 400,50 440,30 440,70" fill="#fff"/>
        </svg>
        <div className="lbl">
          <Wallet size={15} /> Portfolio value
          <button className="eye" onClick={()=>setBalVis(v=>!v)}>
            {balVis ? <Eye size={15}/> : <EyeOff size={15}/>}
          </button>
        </div>
        <div className="val num">{balVis ? inr(portfolio.cur) : "₹ ••••••"}</div>
        <div className="sub">
          <span className="delta pos">
            {portfolio.day>=0 ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
            {balVis ? `${signInr(portfolio.day)} (${signPct(portfolio.dayPct)})` : "•••"}
          </span>
          <span style={{opacity:.85,fontSize:12}}>Today</span>
        </div>
        <div className="stats">
          <div className="st"><div className="k">Invested</div><div className="v num">{balVis?inr0(portfolio.inv):"••••"}</div></div>
          <div className="st"><div className="k">Total returns</div>
            <div className="v num">{balVis?`${signInr(portfolio.ret)}`:"••••"}</div></div>
          <div className="st"><div className="k">Returns %</div>
            <div className="v num">{balVis?signPct(portfolio.retPct):"••••"}</div></div>
        </div>
      </div>

      {/* quick actions */}
      <div className="quick">
        {[
          { t:"Stocks", ic:<BarChart3 size={19}/>, bg:"#E8F0FF", fg:"#2456BE", go:()=>go("stocks") },
          { t:"Mutual Funds", ic:<Layers size={19}/>, bg:"#E7F7F2", fg:"#0E9C8E", go:()=>go("funds") },
          { t:"Portfolio", ic:<Briefcase size={19}/>, bg:"#F3EEFF", fg:"#7A5AF8", go:()=>go("portfolio") },
          { t:"Watchlist", ic:<Star size={19}/>, bg:"#FFF3E0", fg:"#E8943A", go:()=>go("stocks") },
        ].map(q=>(
          <button className="qa" key={q.t} onClick={q.go}>
            <div className="ic" style={{background:q.bg,color:q.fg}}>{q.ic}</div>
            <div className="t">{q.t}</div>
          </button>
        ))}
      </div>

      {/* indices */}
      <div className="section">
        <div className="sec-head"><h3>Market indices</h3></div>
        <div className="strip">
          {INDICES.map(ix=>{
            const q = quotes["IDX:"+ix.s]; const chg = q.price/q.prevClose - 1; const up = chg>=0;
            return (
              <div className="idx" key={ix.s}>
                <div className="nm">{ix.s}</div>
                <div className="pr num">{nf2.format(q.price)}</div>
                <div className={"ch num "+(up?"up":"down")}>{up?"▲":"▼"} {signPct(chg)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* holdings */}
      <div className="section">
        <div className="sec-head"><h3>Your holdings</h3>
          <button className="seeall" onClick={()=>go("portfolio")}>See all <ChevronRight size={14}/></button></div>
        <div className="list">
          {dispHold.map(h=>{
            const st = STOCKS.find(x=>x.s===h.s); const q = quotes[h.s];
            const chg = q.price/q.prevClose-1; const pnl = h.qty*(q.price-h.avg); const up = pnl>=0;
            return (
              <div className="row" key={h.s} onClick={()=>openStock(h.s)}>
                <Avatar s={h.s}/>
                <div className="meta">
                  <div className="nm">{st.n}</div>
                  <div className="sub"><span>{h.qty} shares</span><span>·</span><span>Avg {inr0(h.avg)}</span></div>
                </div>
                <div className="right"><div>
                  <div className="price num">{inr0(h.qty*q.price)}</div>
                  <div className={"chg num "+(up?"up":"down")}>{signInr(pnl)} ({signPct(pnl/(h.qty*h.avg))})</div>
                </div></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* watchlist */}
      <div className="section">
        <div className="sec-head"><h3>Watchlist</h3>
          <button className="seeall" onClick={()=>go("stocks")}>Manage <ChevronRight size={14}/></button></div>
        <div className="list">
          {watch.map(s=>{
            const st = STOCKS.find(x=>x.s===s);
            return <StockRow key={s} st={st} quote={quotes[s]} onOpen={()=>openStock(s)}
              watched onToggleWatch={toggleWatch} showStar />;
          })}
        </div>
      </div>

      {/* trending */}
      <div className="section">
        <div className="sec-head"><h3>Most traded</h3>
          <button className="seeall" onClick={()=>go("stocks")}>Explore <ChevronRight size={14}/></button></div>
        <div className="list">
          {trending.map(st=>(
            <StockRow key={st.s} st={st} quote={quotes[st.s]} onOpen={()=>openStock(st.s)} />
          ))}
        </div>
      </div>

      <div className="tipbar">Simulated market data · prices update live for demo</div>
    </div>
  );
}

function Stocks({ quotes, watch, openStock, toggleWatch }){
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const list = useMemo(()=>{
    let arr = STOCKS.map(st=>({ st, chg: quotes[st.s].price/quotes[st.s].prevClose - 1 }));
    if(q.trim()){
      const k = q.toLowerCase();
      arr = arr.filter(x=> x.st.n.toLowerCase().includes(k) || x.st.s.toLowerCase().includes(k));
    }
    if(tab==="gainers") arr = arr.filter(x=>x.chg>0).sort((a,b)=>b.chg-a.chg);
    else if(tab==="losers") arr = arr.filter(x=>x.chg<0).sort((a,b)=>a.chg-b.chg);
    return arr;
  }, [quotes, tab, q]);

  return (
    <div className="scroll">
      <div className="searchbar" style={{marginBottom:14}}>
        <Search size={18} color="var(--faint)"/>
        <input placeholder="Search stocks, e.g. Reliance" value={q} onChange={e=>setQ(e.target.value)} />
        {q && <X size={18} color="var(--faint)" onClick={()=>setQ("")} style={{cursor:"pointer"}}/>}
      </div>

      <div className="seg" style={{marginBottom:14}}>
        {[["all","All"],["gainers","Top gainers"],["losers","Top losers"]].map(([k,l])=>(
          <button key={k} className={tab===k?"on":""} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {list.length===0 ? (
        <div style={{textAlign:"center",padding:"50px 20px",color:"var(--muted)"}}>
          <Search size={32} color="var(--faint)"/>
          <p style={{fontWeight:600,marginTop:10}}>No stocks match “{q}”.</p>
          <p style={{fontSize:13,color:"var(--faint)"}}>Try a company name or ticker.</p>
        </div>
      ) : (
        <div className="list">
          {list.map(({st})=>(
            <StockRow key={st.s} st={st} quote={quotes[st.s]} onOpen={()=>openStock(st.s)}
              watched={watch.includes(st.s)} onToggleWatch={toggleWatch} showStar />
          ))}
        </div>
      )}
    </div>
  );
}

function Funds({ openFund }){
  const [cat, setCat] = useState("All");
  const cats = ["All","High return","Large Cap","Small Cap","Hybrid","Tax saving"];
  const list = FUNDS.filter(f=>{
    if(cat==="All") return true;
    if(cat==="High return") return f.r3>=25;
    if(cat==="Tax saving") return false;
    return f.cat===cat;
  });
  return (
    <div className="scroll">
      <div className="section" style={{marginTop:0}}>
        <div className="chips" style={{marginBottom:14}}>
          {cats.map(c=>(
            <button key={c} className={"chip "+(cat===c?"on":"")} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
        {list.length===0 ? (
          <div style={{textAlign:"center",padding:"40px",color:"var(--muted)",fontWeight:600}}>
            No funds in this collection yet.
          </div>
        ) : (
          <div className="list">
            {list.map(f=>(
              <div className="row" key={f.s} onClick={()=>openFund(f)}>
                <div className="av" style={{background:avColor(f.h),borderRadius:12}}>{f.h.slice(0,2).toUpperCase()}</div>
                <div className="meta">
                  <div className="nm">{f.s}</div>
                  <div className="sub"><span>{f.cat}</span><span className="tag">{f.risk}</span></div>
                </div>
                <div className="right"><div>
                  <div className="price num up">{f.r3}%</div>
                  <div className="sub" style={{justifyContent:"flex-end"}}>3Y returns</div>
                </div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="tipbar">Returns are annualised. Mutual fund investments are subject to market risks.</div>
    </div>
  );
}

function Portfolio({ quotes, holdings, openStock }){
  const data = useMemo(()=>{
    let inv=0, cur=0, day=0;
    const rows = holdings.map(h=>{
      const st = STOCKS.find(x=>x.s===h.s); const qv = quotes[h.s];
      const value = h.qty*qv.price; const cost = h.qty*h.avg; const pnl = value-cost;
      inv += cost; cur += value; day += h.qty*(qv.price-qv.prevClose);
      return { h, st, qv, value, cost, pnl };
    }).sort((a,b)=>b.value-a.value);
    return { rows, inv, cur, day, ret: cur-inv, retPct: inv?(cur-inv)/inv:0, dayPct: cur?day/(cur-day):0 };
  }, [quotes, holdings]);

  const total = data.cur || 1;

  return (
    <div className="scroll">
      <div className="wealth" style={{marginBottom:4}}>
        <div className="lbl"><Briefcase size={15}/> Current value</div>
        <div className="val num">{inr(data.cur)}</div>
        <div className="sub">
          <span className="delta pos">{data.ret>=0?<TrendingUp size={13}/>:<TrendingDown size={13}/>}
            {signInr(data.ret)} ({signPct(data.retPct)})</span>
          <span style={{opacity:.85,fontSize:12}}>Total returns</span>
        </div>
        <div className="stats">
          <div className="st"><div className="k">Invested</div><div className="v num">{inr0(data.inv)}</div></div>
          <div className="st"><div className="k">Today's P&L</div><div className="v num">{signInr(data.day)}</div></div>
          <div className="st"><div className="k">Today %</div><div className="v num">{signPct(data.dayPct)}</div></div>
        </div>
      </div>

      <div className="section" style={{marginTop:6}}>
        <div className="sec-head"><h3>Portfolio trend</h3><span style={{fontSize:12,fontWeight:700,color:"var(--muted)"}}>1M</span></div>
        <PriceChart sym="PORTFOLIO" tf="1M" price={data.cur} prevClose={data.inv} up={data.ret>=0} />
      </div>

      <div className="section" style={{marginTop:18}}>
        <div className="sec-head"><h3>Allocation</h3></div>
        <div className="alloc">
          {data.rows.map(r=>(
            <i key={r.h.s} style={{width:`${(r.value/total)*100}%`,background:avColor(r.h.s)}}/>
          ))}
        </div>
        <div className="legend">
          {data.rows.map(r=>(
            <div className="lg" key={r.h.s}>
              <span className="sw" style={{background:avColor(r.h.s)}}/>
              {r.h.s} · {((r.value/total)*100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="sec-head"><h3>Holdings · {holdings.length}</h3></div>
        <div className="list">
          {data.rows.map(({h,st,qv,value,pnl})=>{
            const up = pnl>=0;
            return (
              <div className="row" key={h.s} onClick={()=>openStock(h.s)}>
                <Avatar s={h.s}/>
                <div className="meta">
                  <div className="nm">{st.n}</div>
                  <div className="sub"><span>{h.qty} × {inr(qv.price)}</span></div>
                </div>
                <div className="right"><div>
                  <div className="price num">{inr0(value)}</div>
                  <div className={"chg num "+(up?"up":"down")}>{signInr(pnl)} ({signPct(pnl/(h.qty*h.avg))})</div>
                </div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Profile({ holdings, quotes, toast }){
  const invested = holdings.reduce((a,h)=>a+h.qty*h.avg,0);
  const current = holdings.reduce((a,h)=>a+h.qty*quotes[h.s].price,0);
  return (
    <div className="scroll">
      <div className="pcard">
        <div className="ring">S</div>
        <div style={{flex:1}}>
          <div className="nm">Shambhu</div>
          <div className="em">shambhu@nivya.app</div>
          <div className="kyc"><BadgeCheck size={13}/> KYC verified</div>
        </div>
      </div>

      <div className="section" style={{marginTop:16}}>
        <div className="list" style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          <div style={{padding:"15px 16px",borderRight:"1px solid var(--line2)"}}>
            <div style={{fontSize:11.5,color:"var(--muted)",fontWeight:600}}>Total invested</div>
            <div className="num" style={{fontSize:17,fontWeight:800,marginTop:4}}>{inr0(invested)}</div>
          </div>
          <div style={{padding:"15px 16px"}}>
            <div style={{fontSize:11.5,color:"var(--muted)",fontWeight:600}}>Current value</div>
            <div className="num" style={{fontSize:17,fontWeight:800,marginTop:4}}>{inr0(current)}</div>
          </div>
        </div>
      </div>

      <div className="menu">
        {[
          { i:<User size={18}/>, t:"Account & profile" },
          { i:<Building2 size={18}/>, t:"Bank & UPI details" },
          { i:<FileText size={18}/>, t:"Reports & statements" },
          { i:<ShieldCheck size={18}/>, t:"Security & privacy" },
          { i:<Settings size={18}/>, t:"App settings" },
          { i:<HelpCircle size={18}/>, t:"Help & support" },
        ].map(m=>(
          <div className="mrow" key={m.t} onClick={()=>toast(`${m.t} — demo screen`)}>
            <div className="mi">{m.i}</div>
            <div className="mt">{m.t}</div>
            <ChevronRight size={18} color="var(--faint)"/>
          </div>
        ))}
        <div className="mrow" onClick={()=>toast("Logged out — demo")}>
          <div className="mi" style={{color:"var(--down)"}}><LogOut size={18}/></div>
          <div className="mt" style={{color:"var(--down)"}}>Log out</div>
        </div>
      </div>

      <div className="disclaimer">
        <NivyaMark size={22}/><br/>
        <b>Nivya</b> · Demo build v1.0<br/>
        This is a design prototype for demonstration only. It is not a real brokerage, is not affiliated
        with any exchange, and involves no real money, securities, or trades.
      </div>
    </div>
  );
}

/* ---------------- stock detail ---------------- */
function StockDetail({ st, quote, holding, watched, onBack, onToggleWatch, onTrade }){
  const [tf, setTf] = useState("1D");
  const chg = quote.price/quote.prevClose - 1;
  const up = chg >= 0;
  const series = useMemo(()=>genSeries(st.s, tf, quote.price, quote.prevClose), [st.s, tf, Math.round(quote.price*4)]);
  const ys = series.map(d=>d.v);
  const open = series[0].v, high = Math.max(...ys), low = Math.min(...ys);
  const high52 = quote.prevClose*1.28, low52 = quote.prevClose*0.74;
  const vol = (hashStr(st.s)%900 + 120) / 10;

  return (
    <div className="overlay">
      <div className="dbar">
        <button className="back" onClick={onBack}><ArrowLeft size={20}/></button>
        <div className="ttl">
          <div className="a">{st.n}</div>
          <div className="b">{st.s} · NSE</div>
        </div>
        <button className="star" onClick={()=>onToggleWatch(st.s)}>
          <Star size={22} fill={watched?"#F5A623":"none"} color={watched?"#F5A623":"var(--faint)"}/>
        </button>
      </div>

      <div className="dscroll">
        <div className="ltp">
          <div>
            <div className="big num">{inr(quote.price)}</div>
            <div className={"ch num "+(up?"up":"down")}>
              {up?"▲":"▼"} {signInr(quote.price-quote.prevClose)} ({signPct(chg)})
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11.5,color:"var(--muted)",fontWeight:600}}>Mkt cap</div>
            <div className="num" style={{fontWeight:700,fontSize:14}}>{st.mc}</div>
          </div>
        </div>

        <PriceChart sym={st.s} tf={tf} price={quote.price} prevClose={quote.prevClose} up={up} />

        <div className="tf">
          {["1D","1W","1M","1Y"].map(k=>(
            <button key={k} className={tf===k?"on":""} onClick={()=>setTf(k)}>{k}</button>
          ))}
        </div>

        {holding && (
          <div className="hold-note" style={{marginTop:16}}>
            <div className="l">You hold {holding.qty} shares · Avg {inr(holding.avg)}</div>
            <div className="r num">{inr0(holding.qty*quote.price)}</div>
          </div>
        )}

        <div className="section" style={{marginTop:18}}>
          <div className="sec-head"><h3>Today</h3></div>
          <div className="statgrid">
            <div className="cell"><div className="k">Open</div><div className="v num">{inr(open)}</div></div>
            <div className="cell"><div className="k">Prev. close</div><div className="v num">{inr(quote.prevClose)}</div></div>
            <div className="cell"><div className="k">Day high</div><div className="v num">{inr(high)}</div></div>
            <div className="cell"><div className="k">Day low</div><div className="v num">{inr(low)}</div></div>
            <div className="cell"><div className="k">52W high</div><div className="v num">{inr0(high52)}</div></div>
            <div className="cell"><div className="k">52W low</div><div className="v num">{inr0(low52)}</div></div>
            <div className="cell"><div className="k">P/E ratio</div><div className="v num">{st.pe}</div></div>
            <div className="cell"><div className="k">Volume</div><div className="v num">{vol.toFixed(1)}M</div></div>
          </div>
        </div>

        <div className="section">
          <div className="sec-head"><h3>About {st.n}</h3></div>
          <div className="about">
            <p><b>{st.n}</b> {SECTOR_BLURB[st.sec]} It is listed on the NSE and BSE in the {st.sec} sector.</p>
          </div>
        </div>
      </div>

      <div className="tradebar">
        <button className="btn btn-sell" onClick={()=>onTrade("SELL")}>Sell</button>
        <button className="btn btn-buy" onClick={()=>onTrade("BUY")}>Buy</button>
      </div>
    </div>
  );
}

/* ---------------- fund detail ---------------- */
function FundDetail({ fund, onBack, toast }){
  const [tf, setTf] = useState("1Y");
  return (
    <div className="overlay">
      <div className="dbar">
        <button className="back" onClick={onBack}><ArrowLeft size={20}/></button>
        <div className="ttl"><div className="a">{fund.s}</div><div className="b">{fund.cat} · {fund.risk} risk</div></div>
      </div>
      <div className="dscroll">
        <div className="ltp">
          <div>
            <div style={{fontSize:11.5,color:"var(--muted)",fontWeight:600}}>NAV</div>
            <div className="big num">{inr(fund.nav)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11.5,color:"var(--muted)",fontWeight:600}}>3Y annualised</div>
            <div className="num up" style={{fontWeight:800,fontSize:20}}>{fund.r3}%</div>
          </div>
        </div>
        <PriceChart sym={"FUND:"+fund.s} tf={tf} price={fund.nav} prevClose={fund.nav*0.82} up />
        <div className="tf">
          {["1W","1M","1Y"].map(k=>(<button key={k} className={tf===k?"on":""} onClick={()=>setTf(k)}>{k}</button>))}
        </div>

        <div className="section" style={{marginTop:18}}>
          <div className="sec-head"><h3>Returns (annualised)</h3></div>
          <div className="statgrid">
            <div className="cell"><div className="k">1 year</div><div className="v num up">{fund.r1}%</div></div>
            <div className="cell"><div className="k">3 years</div><div className="v num up">{fund.r3}%</div></div>
            <div className="cell"><div className="k">5 years</div><div className="v num up">{fund.r5}%</div></div>
            <div className="cell"><div className="k">Category</div><div className="v">{fund.cat}</div></div>
          </div>
        </div>
        <div className="section">
          <div className="about"><p>Returns shown are past performance and do not guarantee future results.
            Mutual fund investments are subject to market risks; read all scheme-related documents carefully.</p></div>
        </div>
      </div>
      <div className="tradebar">
        <button className="btn btn-sell" onClick={()=>toast("One-time order — demo")}>One-time</button>
        <button className="btn btn-grad" onClick={()=>toast("SIP started — demo")}>Start SIP</button>
      </div>
    </div>
  );
}

/* ---------------- trade sheet ---------------- */
function TradeSheet({ st, quote, side, holding, onClose, onConfirm }){
  const [s, setS] = useState(side);
  const [qty, setQty] = useState(1);
  const [type, setType] = useState("Market");
  const [limit, setLimit] = useState(quote.price.toFixed(2));
  const px = type==="Limit" ? (parseFloat(limit)||quote.price) : quote.price;
  const total = qty*px;
  const margin = 50000;
  const maxSell = holding ? holding.qty : 0;
  const buy = s==="BUY";
  const err = !buy && qty>maxSell ? `You only hold ${maxSell} shares` :
              buy && total>margin ? "Insufficient margin (demo limit ₹50,000)" : "";

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="grab"/>
        <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}>
          <Avatar s={st.s}/>
          <div style={{flex:1}}>
            <h4>{st.n}</h4>
            <div className="ltp-line">LTP {inr(quote.price)} · NSE</div>
          </div>
          <button className="iconbtn" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="seg" style={{marginBottom:6}}>
          <button className={buy?"on":""} onClick={()=>setS("BUY")} style={buy?{color:"var(--up)"}:{}}>Buy</button>
          <button className={!buy?"on":""} onClick={()=>setS("SELL")} style={!buy?{color:"var(--down)"}:{}}>Sell</button>
        </div>

        <div className="fieldlbl">Quantity</div>
        <div className="stepper">
          <button onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus size={18}/></button>
          <input className="num" value={qty} onChange={e=>{
            const v=parseInt(e.target.value.replace(/\D/g,""))||0; setQty(Math.max(0,v));
          }}/>
          <button onClick={()=>setQty(q=>q+1)}><Plus size={18}/></button>
        </div>

        <div className="fieldlbl">Order type</div>
        <div className="ordtype">
          {["Market","Limit"].map(t=>(
            <button key={t} className={type===t?"on":""} onClick={()=>setType(t)}>{t}</button>
          ))}
        </div>
        {type==="Limit" && (
          <div className="limitfield">
            <span style={{fontWeight:700,color:"var(--muted)"}}>₹</span>
            <input className="num" value={limit} onChange={e=>setLimit(e.target.value.replace(/[^0-9.]/g,""))}/>
            <span style={{fontSize:12,color:"var(--faint)",fontWeight:600}}>limit price</span>
          </div>
        )}

        <div className="summary">
          <div className="sumrow"><span>{qty} × {inr(px)}</span><span className="num">{inr(total)}</span></div>
          <div className="sumrow"><span>{buy?"Available margin":"Holding value"}</span>
            <span className="num">{buy?inr0(margin):inr0(maxSell*quote.price)}</span></div>
          <div className="sumrow total"><span>Approx. {buy?"required":"credit"}</span><span className="num">{inr(total)}</span></div>
        </div>

        {err && <div style={{color:"var(--down)",fontSize:12.5,fontWeight:700,marginTop:10,textAlign:"center"}}>{err}</div>}

        <button className={"btn btn-full "+(buy?"btn-buy":"btn-sell")} style={{marginTop:14,opacity:(err||qty<1)?.5:1}}
          disabled={!!err||qty<1}
          onClick={()=>onConfirm(s, qty, px)}>
          {buy?"Place buy order":"Place sell order"} · {inr(total)}
        </button>
        <div style={{textAlign:"center",fontSize:10.5,color:"var(--faint)",marginTop:10,fontWeight:600}}>
          Demo order — no real trade is executed.
        </div>
      </div>
    </div>
  );
}

/* ---------------- bottom nav ---------------- */
function BottomNav({ tab, go }){
  const items = [
    { k:"home", t:"Home", I:Home },
    { k:"stocks", t:"Stocks", I:BarChart3 },
    { k:"funds", t:"Funds", I:Layers },
    { k:"portfolio", t:"Portfolio", I:Briefcase },
    { k:"profile", t:"Profile", I:User },
  ];
  return (
    <div className="bottomnav">
      {items.map(({k,t,I})=>(
        <button key={k} className={"nav "+(tab===k?"on":"")} onClick={()=>go(k)}>
          <I size={21} strokeWidth={tab===k?2.4:2}/>
          <span>{t}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- root ---------------- */
export default function App(){
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("home");
  const [balVis, setBalVis] = useState(true);
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
  const [watch, setWatch] = useState(INITIAL_WATCH);
  const [openSym, setOpenSym] = useState(null);
  const [openFundObj, setOpenFundObj] = useState(null);
  const [trade, setTrade] = useState(null); // {sym, side}
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  // build live quote state (stocks + indices)
  const [quotes, setQuotes] = useState(()=>{
    const q = {};
    STOCKS.forEach(st=>{ q[st.s] = { price: st.p, prevClose: prevCloseOf(st) }; });
    INDICES.forEach(ix=>{ q["IDX:"+ix.s] = { price: ix.p, prevClose: ix.p/(1+ix.c) }; });
    return q;
  });

  // splash timer
  useEffect(()=>{ const t=setTimeout(()=>setSplash(false), 1500); return ()=>clearTimeout(t); }, []);

  // load fonts
  useEffect(()=>{
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap";
    document.head.appendChild(l);
    return ()=>{ try{ document.head.removeChild(l); }catch(e){} };
  }, []);

  // simulated live ticks
  useEffect(()=>{
    const id = setInterval(()=>{
      setQuotes(prev=>{
        const next = { ...prev };
        for(const k in next){
          const item = next[k];
          const drift = (Math.random()-0.5)*0.0018;
          let np = item.price*(1+drift);
          const hi = item.prevClose*1.06, lo = item.prevClose*0.94;
          np = Math.min(hi, Math.max(lo, np));
          next[k] = { ...item, price: np };
        }
        return next;
      });
    }, 2600);
    return ()=>clearInterval(id);
  }, []);

  const toast = (m)=>{
    setToastMsg(m);
    if(toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToastMsg(null), 2400);
  };

  const toggleWatch = (s)=> setWatch(w=> w.includes(s) ? w.filter(x=>x!==s) : [s,...w]);

  const go = (t)=>{ setOpenSym(null); setOpenFundObj(null); setTab(t); };

  const confirmTrade = (side, qty, price)=>{
    const sym = trade.sym;
    setHoldings(prev=>{
      const idx = prev.findIndex(h=>h.s===sym);
      if(side==="BUY"){
        if(idx<0) return [...prev, { s:sym, qty, avg:price }];
        const h = prev[idx]; const nq = h.qty+qty;
        const navg = (h.qty*h.avg + qty*price)/nq;
        const cp = [...prev]; cp[idx] = { ...h, qty:nq, avg:navg }; return cp;
      } else {
        if(idx<0) return prev;
        const h = prev[idx]; const nq = h.qty-qty;
        if(nq<=0) return prev.filter(x=>x.s!==sym);
        const cp = [...prev]; cp[idx] = { ...h, qty:nq }; return cp;
      }
    });
    setTrade(null);
    toast(`${side==="BUY"?"Buy":"Sell"} order placed · ${qty} ${sym} @ ${inr(price)}`);
  };

  const curStock = openSym ? STOCKS.find(x=>x.s===openSym) : null;
  const curHolding = openSym ? holdings.find(h=>h.s===openSym) : null;
  const tradeStock = trade ? STOCKS.find(x=>x.s===trade.sym) : null;
  const tradeHolding = trade ? holdings.find(h=>h.s===trade.sym) : null;

  const titles = { home:"", stocks:"Stocks", funds:"Mutual Funds", portfolio:"Portfolio", profile:"Profile" };

  return (
    <div className="nv-root">
      <style>{CSS}</style>
      <div className="stage">
        <div className="phone">
          {/* status bar */}
          <div className="statusbar">
            <span>9:41</span>
            <div className="dots">
              <span className="sigbar"><i style={{height:4}}/><i style={{height:6}}/><i style={{height:8}}/><i style={{height:11}}/></span>
              <span style={{fontSize:11,fontWeight:700}}>5G</span>
              <span className="batt"><i/></span>
            </div>
          </div>

          {/* app bar */}
          <div className="appbar">
            <div className="brand">
              <NivyaMark size={28}/>
              {tab==="home"
                ? <span className="wm">Niv<b>ya</b></span>
                : <span className="wm" style={{fontSize:18}}>{titles[tab]}</span>}
            </div>
            <div className="appbar-actions">
              <button className="iconbtn"><Search size={19}/></button>
              <button className="iconbtn"><Bell size={19}/><span className="dot"/></button>
            </div>
          </div>

          {/* screens */}
          {tab==="home" && <Home quotes={quotes} holdings={holdings} watch={watch} balVis={balVis}
            setBalVis={setBalVis} openStock={setOpenSym} go={go} toggleWatch={toggleWatch} />}
          {tab==="stocks" && <Stocks quotes={quotes} watch={watch} openStock={setOpenSym} toggleWatch={toggleWatch} />}
          {tab==="funds" && <Funds openFund={setOpenFundObj} />}
          {tab==="portfolio" && <Portfolio quotes={quotes} holdings={holdings} openStock={setOpenSym} />}
          {tab==="profile" && <Profile holdings={holdings} quotes={quotes} toast={toast} />}

          <BottomNav tab={tab} go={go} />

          {/* stock detail overlay */}
          {curStock && (
            <StockDetail st={curStock} quote={quotes[openSym]} holding={curHolding}
              watched={watch.includes(openSym)} onBack={()=>setOpenSym(null)}
              onToggleWatch={toggleWatch} onTrade={(side)=>setTrade({ sym:openSym, side })} />
          )}

          {/* fund detail overlay */}
          {openFundObj && (
            <FundDetail fund={openFundObj} onBack={()=>setOpenFundObj(null)} toast={toast} />
          )}

          {/* trade sheet */}
          {trade && tradeStock && (
            <TradeSheet st={tradeStock} quote={quotes[trade.sym]} side={trade.side}
              holding={tradeHolding} onClose={()=>setTrade(null)} onConfirm={confirmTrade} />
          )}

          {/* toast */}
          {toastMsg && (
            <div className="toast">
              <span className="tick"><BadgeCheck size={14} color="#fff"/></span>
              {toastMsg}
            </div>
          )}

          {/* splash */}
          {splash && (
            <div className="splash">
              <NivyaMark size={76}/>
              <div className="name">Nivya</div>
              <div className="tag">Invest. Grow. Repeat.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
