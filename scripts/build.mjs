#!/usr/bin/env node
// Generates the agent-facing files from public/index.html, which stays the single source:
//   public/calc.js     the CALC:BEGIN…CALC:END block as an ES module
//   public/prices.json the PRICES block in a readable format
// Usage: node scripts/build.mjs          write the files
//        node scripts/build.mjs --check  exit 1 if they are out of date (used in CI)
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../public/", import.meta.url);
const EXPORTS = ["CALC_VERSION", "GB_PER_TB", "monthKey", "monthRange", "normalizePrices", "regionInfo",
  "computeCore", "toState", "fromState", "calculate", "buildLink", "parseLink"];

function between(text, begin, end, label) {
  const a = text.indexOf(begin), b = text.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`${label} markers not found in public/index.html`);
  return text.slice(a, b + end.length);
}

export async function build({ check = false } = {}) {
  const html = await readFile(new URL("index.html", root), "utf8");

  const block = between(html, "/* CALC:BEGIN", "/* CALC:END */", "CALC");
  const body = block.split("\n").map(l => l.replace(/^ {2}/, "")).join("\n");
  const calc = `// AWS Lightsail Cost Saver — calculation core (ES module).
// Generated from public/index.html by scripts/build.mjs; edit the page, not this file.
// Docs: https://ls.1ms.dog/llms.txt · Source: https://github.com/yt1988/lightsail-cost-saver
//
//   import { calculate, buildLink } from "https://ls.1ms.dog/calc.js";
//   const prices = await (await fetch("https://ls.1ms.dog/prices.json")).json();
//   calculate({ region: "us-east-1", sizeGB: 1, usedGB: 3000 }, prices);

${body}

export { ${EXPORTS.join(", ")} };
`;

  const pricesSrc = between(html, "/* PRICES:BEGIN */", "/* PRICES:END */", "PRICES")
    .replace("/* PRICES:BEGIN */", "").replace("/* PRICES:END */", "").trim()
    .replace(/^const PRICES =\s*/, "").replace(/;$/, "");
  const P = JSON.parse(pricesSrc);
  const prices = {
    schema: 1,
    date: P.date,
    source: "AWS Price List API (Amazon Lightsail), Linux general purpose bundles",
    units: {
      dualStackMonthly: "USD per month, public IPv4 + IPv6",
      ipv6OnlyMonthly: "USD per month, IPv6 only",
      transferTB: "monthly transfer allowance in TB (1 TB = 1024 GB); already halved in regions where AWS halves it",
      overagePerGB: "USD per GB of outbound transfer beyond the pooled allowance"
    },
    regions: Object.fromEntries(Object.entries(P.regions).map(([id, r]) => [id, {
      overagePerGB: r.over,
      bundles: r.q.map(([ramGB, dualStackMonthly, ipv6OnlyMonthly, transferTB]) => ({ ramGB, dualStackMonthly, ipv6OnlyMonthly, transferTB }))
    }]))
  };
  const json = JSON.stringify(prices, null, 2) + "\n";

  const targets = [["calc.js", calc], ["prices.json", json]];
  let stale = [];
  for (const [name, content] of targets) {
    const url = new URL(name, root);
    const current = await readFile(url, "utf8").catch(() => null);
    if (current === content) continue;
    if (check) stale.push(name); else { await writeFile(url, content); console.log(`wrote public/${name}`); }
  }
  if (check && stale.length) { console.error(`Out of date: ${stale.join(", ")}. Run: node scripts/build.mjs`); process.exitCode = 1; }
  else if (check) console.log("calc.js and prices.json are up to date");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await build({ check: process.argv.includes("--check") });
}
