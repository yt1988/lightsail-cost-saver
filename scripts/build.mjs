#!/usr/bin/env node
// Generates files from public/index.html, which stays the single source (and the English page):
//   public/calc.js            the CALC:BEGIN…CALC:END block as an ES module
//   public/prices.json        the PRICES block in a readable format
//   public/<lang>/index.html  one pre-rendered page per language (zh/, ja/, …), with that language's text
//                             written into the HTML so crawlers that don't run JS (Baidu) can index it
// It also keeps index.html's own SITE block (canonical, hreflang) and footer language links in sync.
// Usage: node scripts/build.mjs          write the files
//        node scripts/build.mjs --check  exit 1 if they are out of date (used in CI)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../public/", import.meta.url);
const EXPORTS = ["CALC_VERSION", "GB_PER_TB", "monthKey", "monthRange", "normalizePrices", "regionInfo",
  "computeCore", "toState", "fromState", "calculate", "buildLink", "parseLink"];
const OG_LOCALE = { en: "en_US", "zh-CN": "zh_CN", "zh-TW": "zh_TW", ja: "ja_JP", ko: "ko_KR", es: "es_ES", fr: "fr_FR", de: "de_DE", pt: "pt_BR", ru: "ru_RU" };

function between(text, begin, end, label) {
  const a = text.indexOf(begin), b = text.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`${label} markers not found in public/index.html`);
  return text.slice(a, b + end.length);
}
// replace what lies between two markers, keeping the markers
function fill(text, begin, end, content, label) {
  const a = text.indexOf(begin), b = text.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`${label} markers not found`);
  const open = text.indexOf("-->", a) + 3;
  return text.slice(0, open) + "\n" + content + "\n" + text.slice(b);
}
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// the language packs, read straight from the page's I18N:BEGIN…I18N:END block
export function langData(html) {
  const src = between(html, "/* I18N:BEGIN", "/* I18N:END */", "I18N");
  return new Function(src + "\nreturn { REGION_ORDER, LINKS, RULE_ICONS, RULE_WARN, LANGS, LANG_PATHS, I18N };")();
}
// the public root URL, taken from the canonical link that scripts/set-site-url.mjs wrote
export function siteBase(html) {
  const m = /<link rel="canonical" href="([^"]+)">/.exec(between(html, "<!-- SITE:BEGIN", "<!-- SITE:END -->", "SITE"));
  if (!m) throw new Error("canonical link not found in the SITE block");
  return m[1].endsWith("/") ? m[1] : m[1] + "/";
}
export function siteTags(base, lang, D) {
  const url = l => base + D.LANG_PATHS[l];
  return [
    `<link rel="canonical" href="${url(lang)}">`,
    `<meta property="og:url" content="${url(lang)}">`,
    ...D.LANGS.map(([l]) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${base}">`,
    `<link rel="sitemap" type="application/xml" href="${base}sitemap.xml">`
  ].join("\n");
}
// footer links to every language page, relative so the site also works below a path
function langNav(lang, D) {
  const up = lang === "en" ? "" : "../";
  return D.LANGS.map(([l, name]) => `      <a href="${up + D.LANG_PATHS[l] || "./"}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ""}>${name}</a>`).join("\n");
}
// the parts of index.html that the build owns: canonical/hreflang, the footer text and language links
function managed(html, lang, D, priceDate) {
  const foot = D.I18N[lang].foot.split("{d}").join(priceDate);
  html = html.replace(/(<span id="footTxt">)[^<]*(<\/span>)/, (m, a, b) => a + esc(foot) + b);
  html = fill(html, "<!-- SITE:BEGIN", "<!-- SITE:END -->", siteTags(siteBase(html), lang, D), "SITE");
  return fill(html, "<!-- LANGNAV:BEGIN", "<!-- LANGNAV:END -->", langNav(lang, D), "LANGNAV");
}

// index.html (English) -> the same page with another language written in
export function renderPage(src, lang, D, priceDate) {
  const L = D.I18N[lang], E = D.I18N.en;
  const t = (k, v) => { let s = L[k] ?? E[k] ?? k; if (v) for (const p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
  const meta = (attr, key, value) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(">)`);
    if (!re.test(html)) throw new Error(`meta ${key} not found`);
    html = html.replace(re, (m, a, b) => a + esc(value) + b);
  };
  let html = managed(src, lang, D, priceDate);
  html = html.replace('<html lang="en">', `<html lang="${lang}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(t("name"))}</title>`);
  meta("name", "description", L.seoDesc ?? t("tagline"));
  meta("name", "keywords", L.seoKw ?? "");
  meta("name", "application-name", t("name"));
  meta("property", "og:site_name", t("name"));
  meta("property", "og:title", t("name"));
  meta("property", "og:description", t("tagline"));
  meta("name", "twitter:title", t("name"));
  meta("name", "twitter:description", t("tagline"));
  // og:locale for this page, the others as alternates
  html = html.replace(/\n?<meta property="og:locale:alternate" content="[^"]*">/g, "");
  html = html.replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${OG_LOCALE[lang]}">\n` +
    D.LANGS.filter(([l]) => l !== lang).map(([l]) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join(""));
  // structured data: this page's name, description and language; the FAQ stays on the English page
  html = html.replace(/(<script type="application\/ld\+json">\n)([\s\S]*?)(\n<\/script>)/, (m, a, json, b) => {
    const ld = JSON.parse(json);
    ld["@graph"] = ld["@graph"].filter(x => x["@type"] !== "FAQPage");
    Object.assign(ld["@graph"][0], { name: t("name"), description: L.seoDesc ?? t("tagline"), inLanguage: lang, url: siteBase(src) + D.LANG_PATHS[lang] });
    return a + JSON.stringify(ld) + b;
  });
  // every element with data-i="key" holds plain text that the page script would set at runtime
  let n = 0;
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i="(\w+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, key, text, close) => { n++; return open + esc(t(key)) + close; });
  if (!n) throw new Error("no data-i elements found");
  // billing rules and official links, as applyLang() renders them
  const rules = L.r.map((txt, i) => `      <div class="rule${D.RULE_WARN.includes(i) ? " w" : ""}"><span class="ic">${D.RULE_ICONS[i]}</span><span>${txt}</span></div>`).join("\n");
  html = html.replace(/(<div class="rule-grid" id="rules">\n)[\s\S]*?(\n    <\/div>\n    <div class="links")/, (m, a, b) => a + rules + b);
  const links = L.links.map((txt, i) => `      <a href="${D.LINKS[i]}" target="_blank" rel="noopener">${txt}</a>`).join("\n");
  html = html.replace(/(<div class="links" id="links">\n)[\s\S]*?(\n    <\/div>\n  <\/section>)/, (m, a, b) => a + links + b);
  return html;
}

export async function build({ check = false } = {}) {
  const src = await readFile(new URL("index.html", root), "utf8");
  const D = langData(src);
  const priceDate = /"date":"([^"]+)"/.exec(between(src, "/* PRICES:BEGIN */", "/* PRICES:END */", "PRICES"))[1];
  const html = managed(src, "en", D, priceDate);

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

  const targets = [["index.html", html], ["calc.js", calc], ["prices.json", json],
    ...D.LANGS.filter(([l]) => l !== "en").map(([l]) => [D.LANG_PATHS[l] + "index.html", renderPage(html, l, D, P.date)])];
  let stale = [];
  for (const [name, content] of targets) {
    const url = new URL(name, root);
    const current = await readFile(url, "utf8").catch(() => null);
    if (current === content) continue;
    if (check) stale.push(name);
    else { await mkdir(new URL(".", url), { recursive: true }); await writeFile(url, content); console.log(`wrote public/${name}`); }
  }
  if (check && stale.length) { console.error(`Out of date: ${stale.join(", ")}. Run: node scripts/build.mjs`); process.exitCode = 1; }
  else if (check) console.log(`${targets.length} generated files are up to date`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await build({ check: process.argv.includes("--check") });
}
