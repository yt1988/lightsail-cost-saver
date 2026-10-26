#!/usr/bin/env node
// Pulls current Lightsail prices from the public AWS Price List API and rewrites the
// PRICES block in public/index.html. Run before deploying: `node scripts/update-prices.mjs`
// Needs Node 18+ (built-in fetch). Regions that fail to download keep their old values.
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../public/index.html", import.meta.url);
const HOST = "https://pricing.us-east-1.amazonaws.com";
const BEGIN = "/* PRICES:BEGIN */", END = "/* PRICES:END */";
const HOURS_PER_MONTH = 744; // Lightsail caps hourly billing at the monthly plan price

const html = await readFile(FILE, "utf8");
const a = html.indexOf(BEGIN), b = html.indexOf(END);
if (a < 0 || b < 0) throw new Error("PRICES markers not found in public/index.html");
const old = JSON.parse(html.slice(a + BEGIN.length, b).replace(/^\s*const PRICES =\s*/, "").replace(/;\s*$/, ""));

const order = /const REGION_ORDER = (\[[^\]]*\])/.exec(html);
if (!order) throw new Error("REGION_ORDER not found in public/index.html");
const ids = JSON.parse(order[1]);

const getJSON =async path => { const r = await fetch(HOST + path); if (!r.ok) throw new Error(`${r.status} ${path}`); return r.json(); };
const toTB = s => { const m = /^([\d.]+)\s*(TB|GB)$/i.exec(s || ""); return m ? +m[1] / (m[2].toUpperCase() === "GB" ? 1024 : 1) : null; };

const index = await getJSON("/offers/v1.0/aws/AmazonLightsail/current/region_index.json");
const regions = {};
let ok = 0;
for (const id of ids) {
  try {
    const entry = index.regions[id];
    if (!entry) throw new Error("not in price list");
    const offer = await getJSON(entry.currentVersionUrl);
    const price = sku => { const t = offer.terms.OnDemand[sku]; if (!t) return null; const d = Object.values(Object.values(t)[0].priceDimensions)[0]; return +d.pricePerUnit.USD; };
    const bundles = {};
    let over = null;
    for (const p of Object.values(offer.products)) {
      const at = p.attributes, ut = at.usagetype || "";
      if (p.productFamily === "Lightsail Instance" && at.operatingSystem === "Linux" && !at.instancefamily) {
        const m = /-BundleUsage:([\d.]+)GB(_IPv6)?$/.exec(ut);
        if (!m) continue;
        const ram = +m[1], hourly = price(p.sku);
        if (hourly == null) continue;
        const row = bundles[ram] || (bundles[ram] = [ram, null, null, toTB(at.dataTransferQuota)]);
        row[m[2] ? 2 : 1] = Math.round(hourly * HOURS_PER_MONTH * 10) / 10;
      }
      if (/-DataXfer-Out-Overage-Bytes$/.test(ut) && !/Storage|Container|CDN|Database/i.test(ut)) over = price(p.sku);
    }
    const q = Object.values(bundles).filter(r => r[1] != null && r[2] != null && r[3] != null).sort((x, y) => x[0] - y[0]).slice(0, 8);
    if (q.length < 4 || over == null) throw new Error("unexpected price list shape");
    regions[id] = { over, q };
    ok++;
    console.log(`✓ ${id}  overage $${over}/GB  ${q.map(r => `${r[0]}GB $${r[1]}/$${r[2]} ${r[3]}TB`).join(", ")}`);
  } catch (e) {
    if (old.regions[id]) regions[id] = old.regions[id];
    console.warn(`✗ ${id}: ${e.message} (${old.regions[id] ? "kept previous values" : "left out"})`);
  }
}
if (!ok) { console.error("No region could be updated; file left unchanged."); process.exit(1); }

// The Lightsail FAQ says these regions get half the allowance, but the Price List does not always
// reflect it. Stay conservative: halve any of them still listed at the full (us-east-1) allowance.
const DOC_HALF = ["ap-south-1", "ap-southeast-2", "ap-southeast-3", "ap-southeast-5", "ap-east-1", "sa-east-1"];
const ref = Object.fromEntries((regions["us-east-1"]?.q || []).map(r => [r[0], r[3]]));
for (const id of DOC_HALF) {
  const r = regions[id];
  if (r && r.q.some(row => ref[row[0]] && row[3] >= ref[row[0]])) {
    r.q = r.q.map(row => ref[row[0]] && row[3] >= ref[row[0]] ? [row[0], row[1], row[2], row[3] / 2] : row);
    console.warn(`! ${id}: Price List shows full allowance, halved per the Lightsail FAQ`);
  }
}

const date = new Date().toISOString().slice(0, 10);
const body = `const PRICES = {"date":"${date}","regions":{\n` +
  Object.entries(regions).map(([id, r]) => `    ${JSON.stringify(id)}:${JSON.stringify(r)}`).join(",\n") + "\n  }};";
await writeFile(FILE, html.slice(0, a + BEGIN.length) + "\n  " + body + "\n  " + html.slice(b));
console.log(`\nUpdated ${ok}/${Object.keys(regions).length} regions → public/index.html (date ${date})`);
