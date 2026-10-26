// AWS Lightsail Cost Saver — calculation core (ES module).
// Generated from public/index.html by scripts/build.mjs; edit the page, not this file.
// Docs: https://ls.1ms.dog/llms.txt · Source: https://github.com/yt1988/lightsail-cost-saver
//
//   import { calculate, buildLink } from "https://ls.1ms.dog/calc.js";
//   const prices = await (await fetch("https://ls.1ms.dog/prices.json")).json();
//   calculate({ region: "us-east-1", sizeGB: 1, usedGB: 3000 }, prices);

/* CALC:BEGIN — shared calculation core. scripts/build.mjs copies this block verbatim into public/calc.js,
   so it must stay self-contained (no DOM, no page state, no globals). */
const CALC_VERSION = 1;
// Lightsail counts allowance in binary units: the API's transferPerMonthInGb is 1024 for a 1 TB plan
const GB_PER_TB = 1024, HOUR_MS = 36e5;
const monthKey = d => d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
const monthRange = k => { const [y, m] = k.split("-").map(Number); return [Date.UTC(y, m - 1, 1), Date.UTC(y, m, 1)]; };

// Accepts the compact page format ({ q: [[ram, dual, ipv6, tb]] }) or the published prices.json format.
function normalizePrices(prices) {
  const regions = {};
  for (const [id, r] of Object.entries(prices.regions || {})) {
    const rows = r.q ? r.q.map(([ram, p4, p6, tb]) => ({ ram, p4, p6, tb }))
      : (r.bundles || []).map(b => ({ ram: b.ramGB, p4: b.dualStackMonthly, p6: b.ipv6OnlyMonthly, tb: b.transferTB }));
    regions[id] = { over: r.over ?? r.overagePerGB, bundles: rows };
  }
  return { date: prices.date, regions };
}
function regionInfo(prices, id) {
  const norm = normalizePrices(prices), ids = Object.keys(norm.regions);
  const rid = norm.regions[id] ? id : ids[0], r = norm.regions[rid], one = r.bundles.find(b => b.ram === 1);
  return { id: rid, price: r.over, half: !!one && one.tb < 2, bundles: r.bundles };
}

// state: { month "YYYY-MM", region, size (RAM GB), ipv4, baseStart ms, used GB|null, usedAt ms, forecast GB|null,
//          outRatio 0-100, prorate, nodes: [{ count, start ms|null, end ms|null }] }
function computeCore(state, prices, nowReal) {
  const clamp = (v, a, z) => Math.min(z, Math.max(a, v));
  const R = regionInfo(prices, state.region);
  const b = R.bundles.find(x => x.ram === state.size) || R.bundles.find(x => x.ram === 1) || R.bundles[0];
  const full = b.tb * GB_PER_TB, [m0, m1] = monthRange(state.month), M = m1 - m0;
  const now = clamp(nowReal, m0, m1), nodesIn = state.nodes || [];
  const span = (s, e) => { s = Math.max(s == null ? m0 : s, m0); e = Math.min(e == null ? m1 : e, m1); return e > s ? (e - s) / M : 0; };
  const allowOf = (n, f) => n * full * (state.prorate ? f : (f > 0 ? 1 : 0));
  // Plan mode: only a month-end total is given, no usage yet. Treat the month as a whole and assume every
  // running instance is configured for all of it, so the answer is "how many for the full month".
  const hasU = state.used != null, auto = state.forecast == null, has = hasU || !auto, plan = !hasU && !auto;
  const life = (s, e) => plan && e == null ? 1 : span(s, e);
  const bf = life(state.baseStart, null);
  const base = { allow: allowOf(1, bf), cost: (state.ipv4 ? b.p4 : b.p6) * bf };
  // allowFuture: instances that start later can only cover traffic from then on, never overage already incurred
  const basePlanned = !plan && state.baseStart != null && state.baseStart > now;
  let allow = base.allow, allowFuture = basePlanned ? base.allow : 0, cost = base.cost, live = 1;
  const nodes = nodesIn.map(n => {
    const f = life(n.start, n.end), r = {
      allow: allowOf(n.count, f), cost: n.count * b.p6 * f,
      planned: !plan && n.start != null && n.start > nowReal, gone: n.end != null && n.end <= nowReal
    };
    allow += r.allow; cost += r.cost; if (!r.gone) live += n.count;
    if (!plan && n.start != null && n.start > now) allowFuture += r.allow;
    return r;
  });
  const allowPast = allow - allowFuture;
  // Traffic can only flow once the first instance exists, so the daily pace is measured from there, not from the 1st
  const starts = [state.baseStart, ...nodesIn.map(n => n.start)].map(v => v == null ? m0 : v);
  const p0 = plan ? m0 : clamp(Math.min(...starts), m0, m1 - HOUR_MS);
  const tU = clamp(hasU ? (state.usedAt || now) : now, p0 + HOUR_MS, m1);
  const U = hasU ? +state.used : 0;
  const rate = U / (tU - p0);
  const P = auto ? U + rate * (m1 - tU) : Math.max(+state.forecast, U);
  const fr = plan ? 0 : m1 > tU ? (P - U) / (m1 - tU) : 0;
  const Unow = U + fr * Math.max(0, now - tU);
  const ratio = state.outRatio / 100;
  // overage already incurred is fixed; the rest of the month is covered by leftover current allowance plus later instances
  const lockedGB = plan ? 0 : Math.max(0, Unow - allowPast);
  const F = Math.max(0, P - Unow), Rem = Math.max(0, allowPast - Unow) + allowFuture;
  const overGB = (lockedGB + Math.max(0, F - Rem)) * ratio, overCost = overGB * R.price;
  let exhaust = !has || plan ? null : lockedGB > 0 ? (rate > 0 ? p0 + allowPast / rate : null)
    : allow <= U ? (rate > 0 ? p0 + allow / rate : null) : (fr > 0 ? tU + (allow - U) / fr : null);
  if (exhaust != null && exhaust >= m1) exhaust = null;
  // options: add N IPv6-only traffic instances from the next full hour (a whole month each in plan mode)
  const t0 = Math.ceil(now / HOUR_MS) * HOUR_MS, rf = plan ? 1 : Math.max(0, (m1 - t0) / M);
  const ai = full * (state.prorate ? rf : 1), ci = b.p6 * rf;
  const optFor = N => { const o = (lockedGB + Math.max(0, F - Rem - N * ai)) * ratio * R.price; return { N, add: N * ci, over: o, total: N * ci + o }; };
  const Nmin = ai > 0 && F > Rem ? Math.ceil((F - Rem) / ai) : 0;
  const ns = Nmin <= 3 ? [...Array(Nmin + 2).keys()] : [0, Nmin - 1, Nmin, Nmin + 1];
  const opts = has && rf > 0 && overGB > 0 ? ns.map(optFor) : [];
  const best = opts.reduce((a, o) => (!a || o.total < a.total - 1e-9 ? o : a), null);
  const status = !has ? "idle" : lockedGB > 0 ? "bad" : overGB > 0 ? "warn" : "good";
  const nextNodes = has ? Math.max(0, Math.ceil(P / full) - 1) : 0;
  const nextCost = (state.ipv4 ? b.p4 : b.p6) + nextNodes * b.p6;
  return { R, b, full, m0, m1, now, p0, base, allow, cost, live, has, hasU, plan, U, tU, rate, P, auto, Unow, overGB, overCost, lockedGB, exhaust,
    t0, ai, ci, opts, best, status, nextNodes, nextCost, nodes };
}

// Friendly input (what agents and links use) <-> internal state. Dates may be ms, ISO strings or Date objects.
function toState(input = {}, now = Date.now()) {
  const ms = v => v == null || v === "" ? null : typeof v === "number" ? v : new Date(v).getTime();
  const num = v => v == null || v === "" || !isFinite(+v) ? null : +v;
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(input.month || "") ? input.month : monthKey(new Date(now));
  const [m0] = monthRange(month);
  const inGB = num(input.inGB), outGB = num(input.outGB);
  const used = num(input.usedGB) ?? (inGB != null || outGB != null ? (inGB || 0) + (outGB || 0) : null);
  return {
    v: 2, month, region: input.region || "us-east-1", size: num(input.sizeGB) ?? 1, ipv4: input.ipv4 !== false,
    baseStart: ms(input.baseStart) ?? m0, used, usedAt: used == null ? null : ms(input.usedAt) ?? now,
    usedIn: inGB, usedOut: outGB, forecast: num(input.forecastGB),
    outRatio: num(input.outboundPercent) ?? 100, prorate: input.prorate !== false,
    nodes: (input.trafficInstances || []).map(n => ({ count: Math.max(1, Math.floor(num(n.count) || 1)), start: ms(n.start), end: ms(n.end) }))
  };
}
function fromState(s) {
  const iso = v => v == null ? undefined : new Date(v).toISOString();
  const out = { month: s.month, region: s.region, sizeGB: s.size, ipv4: s.ipv4, baseStart: iso(s.baseStart) };
  if (s.usedIn != null || s.usedOut != null) { out.inGB = s.usedIn ?? 0; out.outGB = s.usedOut ?? 0; }
  else if (s.used != null) out.usedGB = s.used;
  if (s.used != null) out.usedAt = iso(s.usedAt);
  if (s.forecast != null) out.forecastGB = s.forecast;
  if (s.outRatio !== 100) out.outboundPercent = s.outRatio;
  if (s.prorate === false) out.prorate = false;
  out.trafficInstances = (s.nodes || []).map(n => ({ count: n.count, start: iso(n.start), end: iso(n.end) }));
  return out;
}

// calculate(input, prices[, now]) -> plain JSON answer, the same numbers the page shows
function calculate(input, prices, now = Date.now()) {
  const s = toState(input, now), c = computeCore(s, prices, now);
  const r2 = v => Math.round(v * 100) / 100, iso = v => v == null ? null : new Date(v).toISOString();
  const statusName = { idle: "needs-input", good: "safe", warn: "overage-expected", bad: "over-allowance" }[c.status];
  return {
    version: CALC_VERSION, pricesDate: normalizePrices(prices).date, month: s.month,
    mode: c.plan ? "full-month-plan" : c.hasU ? "actual-usage" : "needs-input", status: statusName,
    region: { id: c.R.id, overagePerGB: c.R.price, halfAllowance: c.R.half },
    base: { ramGB: c.b.ram, network: s.ipv4 ? "dual-stack" : "ipv6-only", monthlyPrice: s.ipv4 ? c.b.p4 : c.b.p6, transferTB: c.b.tb },
    allowanceGB: r2(c.allow), usedGB: c.hasU ? r2(c.Unow) : null, forecastGB: c.has ? r2(c.P) : null,
    overageGB: r2(c.overGB), overageCost: r2(c.overCost), instanceCost: r2(c.cost), totalCost: r2(c.cost + c.overCost),
    allowanceRunsOutAt: iso(c.exhaust), unavoidableOverageGB: r2(c.lockedGB),
    recommendation: c.best ? {
      addTrafficInstances: c.best.N, startingAt: c.plan ? null : iso(c.t0),
      eachAddsGB: r2(c.ai), eachCosts: r2(c.ci), resultingCost: r2(c.best.total), savesVsAddingNone: r2(c.opts[0].total - c.best.total)
    } : null,
    options: c.opts.map(o => ({ addTrafficInstances: o.N, instanceCost: r2(o.add), overageCost: r2(o.over), total: r2(o.total) })),
    nextMonth: c.has ? { trafficInstances: c.nextNodes, monthlyCost: r2(c.nextCost) } : null
  };
}

// Shareable links: ?region=&size=&ipv4=&base=&used=|in=&out=&at=&forecast=&outpct=&prorate=&nodes=count@start[~end],...
const LINK_KEYS = ["region", "size", "ipv4", "base", "used", "in", "out", "at", "forecast", "outpct", "prorate", "nodes"];
function buildLink(input, base = "https://ls.1ms.dog/") {
  const u = new URL(base), p = u.searchParams, set = (k, v) => { if (v != null && v !== "") p.set(k, String(v)); };
  set("region", input.region); set("size", input.sizeGB);
  if (input.ipv4 === false) p.set("ipv4", "0");
  set("base", input.baseStart && new Date(input.baseStart).toISOString().slice(0, 16) + "Z");
  set("used", input.usedGB); set("in", input.inGB); set("out", input.outGB);
  set("at", input.usedAt && new Date(input.usedAt).toISOString().slice(0, 16) + "Z");
  set("forecast", input.forecastGB); set("outpct", input.outboundPercent);
  if (input.prorate === false) p.set("prorate", "0");
  const t = v => v ? new Date(v).toISOString().slice(0, 16) + "Z" : "";
  if ((input.trafficInstances || []).length) p.set("nodes", input.trafficInstances.map(n => n.count + "@" + t(n.start) + (n.end ? "~" + t(n.end) : "")).join(","));
  // keep ":" "@" "," readable; URLSearchParams would percent-encode them
  const q = [...p].map(([k, v]) => k + "=" + encodeURIComponent(v).replace(/%3A/g, ":").replace(/%40/g, "@").replace(/%2C/g, ",")).join("&");
  return u.origin + u.pathname + (q ? "?" + q : "");
}
function parseLink(search) {
  const p = new URLSearchParams(search), g = k => p.get(k);
  if (!LINK_KEYS.some(k => p.has(k))) return null;
  const out = {};
  if (g("region")) out.region = g("region");
  if (g("size")) out.sizeGB = +g("size");
  if (g("ipv4") === "0") out.ipv4 = false;
  if (g("base")) out.baseStart = g("base");
  if (g("used")) out.usedGB = +g("used");
  if (g("in")) out.inGB = +g("in");
  if (g("out")) out.outGB = +g("out");
  if (g("at")) out.usedAt = g("at");
  if (g("forecast")) out.forecastGB = +g("forecast");
  if (g("outpct")) out.outboundPercent = +g("outpct");
  if (g("prorate") === "0") out.prorate = false;
  if (g("nodes")) out.trafficInstances = g("nodes").split(",").filter(Boolean).map(x => {
    const [count, rest = ""] = x.split("@"), [start, end] = rest.split("~");
    return { count: +count || 1, start: start || null, end: end || null };
  });
  return out;
}
/* CALC:END */

export { CALC_VERSION, GB_PER_TB, monthKey, monthRange, normalizePrices, regionInfo, computeCore, toState, fromState, calculate, buildLink, parseLink };
