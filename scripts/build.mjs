#!/usr/bin/env node
// Generates files from the two sources: public/index.html (the markup, and the English page) and src/app.js (the script).
//   public/assets/js/app.<hash>.js  src/app.js, named by its content so it can be cached for a year
//   public/assets/favicon.svg       head crop of public/assets/logo-light.svg
//   public/calc.js                  the CALC:BEGIN…CALC:END block as an ES module
//   public/prices.json              the PRICES block in a readable format
//   public/<lang>/index.html        one pre-rendered page per language (zh-cn/, ja/, …), with that language's text
//                                   written into the HTML so crawlers that don't run JS (Baidu) can index it
// It also keeps index.html's own SITE block (canonical, hreflang), script tag and footer language links in sync.
// Usage: node scripts/build.mjs          write the files
//        node scripts/build.mjs --check  exit 1 if they are out of date (used in CI)
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = new URL("../public/", import.meta.url);
const appSrc = new URL("../src/app.js", import.meta.url);
const EXPORTS = ["CALC_VERSION", "GB_PER_TB", "monthKey", "monthRange", "normalizePrices", "regionInfo",
  "computeCore", "toState", "fromState", "calculate", "buildLink", "parseLink"];
const OG_LOCALE = { en: "en_US", "zh-CN": "zh_CN", "zh-TW": "zh_TW", ja: "ja_JP", ko: "ko_KR", es: "es_ES", fr: "fr_FR", de: "de_DE", pt: "pt_BR", ru: "ru_RU" };

function between(text, begin, end, label) {
  const a = text.indexOf(begin), b = text.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`${label} markers not found`);
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

// the language packs, read straight from the I18N:BEGIN…I18N:END block of src/app.js
export function langData(app) {
  const src = between(app, "/* I18N:BEGIN", "/* I18N:END */", "I18N");
  return new Function(src + "\nreturn { REGION_ORDER, REGION_NAMES, LINKS, HELP, LANGS, LANG_PATHS, I18N };")();
}
// every language has every text the English pack has, in the same shape and with the same {placeholders};
// the page has no fallback to English, so a gap here would show up as a missing label
export function i18nGaps(D) {
  const gaps = [], ph = s => [...s.matchAll(/\{\/?\w+\}/g)].map(m => m[0]).sort().join(" ");
  const walk = (en, x, at) => {
    if (typeof en === "string") {
      if (typeof x !== "string" || (en && !x.trim())) gaps.push(at + " is missing");
      else if (ph(en) !== ph(x)) gaps.push(`${at} has placeholders ${ph(x) || "(none)"}, English has ${ph(en)}`);
    } else if (Array.isArray(en)) {
      if (!Array.isArray(x) || x.length !== en.length) gaps.push(`${at} should have ${en.length} items`);
      else en.forEach((v, i) => walk(v, x[i], `${at}[${i}]`));
    } else if (en && typeof en === "object") {
      if (!x || typeof x !== "object") gaps.push(at + " is missing");
      else for (const k in en) walk(en[k], x[k], at + "." + k);
    }
  };
  for (const [l] of D.LANGS) {
    if (l !== "en") walk(D.I18N.en, D.I18N[l], l);
    if (D.REGION_NAMES[l]?.length !== D.REGION_ORDER.length || D.REGION_NAMES[l].some(x => !x)) gaps.push(`REGION_NAMES.${l} should name all ${D.REGION_ORDER.length} regions`);
  }
  return gaps;
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
// the help dialog's questions and answers: billing rules, the overage price range and the official links
function helpItems(lang, D, P) {
  const L = D.I18N[lang], overs = Object.values(P.regions).map(r => r.over);
  const usd = v => "$" + v.toFixed(2);
  return D.HELP.map(([kind, i], n) => ({
    q: L.helpQ[n],
    a: kind === "r" ? `<p${i === 4 ? ' class="w"' : ""}>${L.r[i]}</p>`
      : kind === "over" ? `<p>${L.overA.split("{lo}").join(usd(Math.min(...overs))).split("{hi}").join(usd(Math.max(...overs)))}</p>`
      : `<p class="links">${L.links.map((txt, k) => `<a href="${D.LINKS[k]}" target="_blank" rel="noopener">${txt}</a>`).join("")}</p>`
  }));
}
function helpHtml(items, t) {
  const prev = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4L6 8l4 4"/></svg>';
  const next = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>';
  return [
    `      <nav class="help-nav" id="helpNav" role="tablist" aria-orientation="vertical">`,
    ...items.map((x, i) => `        <button type="button" role="tab" id="hq${i}" data-hq="${i}" aria-controls="ha${i}" aria-selected="${i === 0}">${esc(x.q)}</button>`),
    `      </nav>`,
    `      <div class="help-pick"><button class="icon-btn" type="button" data-hstep="-1" data-ia="qPrev" aria-label="${esc(t("qPrev"))}">${prev}</button><select id="helpSel" aria-labelledby="helpT"></select><button class="icon-btn" type="button" data-hstep="1" data-ia="qNext" aria-label="${esc(t("qNext"))}">${next}</button></div>`,
    `      <div class="help-c" id="helpC">`,
    ...items.map((x, i) => `        <section role="tabpanel" id="ha${i}" data-hqb="${i}" aria-labelledby="hq${i}"${i ? " hidden" : ""}><h4>${esc(x.q)}</h4>${x.a}</section>`),
    `      </div>`
  ].join("\n");
}
// the parts of index.html that the build owns: canonical/hreflang, the script tag, the footer text, language links,
// the help dialog and the FAQ structured data built from it
function managed(html, lang, D, P, appFile) {
  const priceDate = P.date, items = helpItems(lang, D, P);
  html = fill(html, "<!-- HELP:BEGIN", "<!-- HELP:END -->", helpHtml(items, k => D.I18N[lang][k]), "HELP");
  html = html.replace(/(<script type="application\/ld\+json">\n)([\s\S]*?)(\n<\/script>)/, (m, a, json, b) => {
    const ld = JSON.parse(json), plain = s => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const faq = { "@type": "FAQPage", inLanguage: lang, mainEntity: items.slice(0, -1).map(x => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: plain(x.a) } })) };
    ld["@graph"] = [...ld["@graph"].filter(x => x["@type"] !== "FAQPage"), faq];
    return a + (lang === "en" ? JSON.stringify(ld, null, 1) : JSON.stringify(ld)) + b;
  });
  const foot = D.I18N[lang].foot.split("{d}").join(priceDate);
  html = html.replace(/(<span id="footTxt">)[^<]*(<\/span>)/, (m, a, b) => a + esc(foot) + b);
  html = fill(html, "<!-- SITE:BEGIN", "<!-- SITE:END -->", siteTags(siteBase(html), lang, D), "SITE");
  html = fill(html, "<!-- APP:BEGIN", "<!-- APP:END -->", `<script defer src="assets/js/${appFile}"></script>`, "APP");
  return fill(html, "<!-- LANGNAV:BEGIN", "<!-- LANGNAV:END -->", langNav(lang, D), "LANGNAV");
}

// index.html (English) -> the same page with another language written in
export function renderPage(src, lang, D, P, appFile) {
  const L = D.I18N[lang];
  const t = (k, v) => { let s = L[k]; if (v) for (const p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
  const meta = (attr, key, value) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(">)`);
    if (!re.test(html)) throw new Error(`meta ${key} not found`);
    html = html.replace(re, (m, a, b) => a + esc(value) + b);
  };
  let html = managed(src, lang, D, P, appFile);
  html = html.replace('<html lang="en">', `<html lang="${lang}">`);
  // the page sits one level down, so the shared files are at ../assets/
  html = html.replace(/(["(])assets\//g, "$1../assets/");
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
  // structured data: this page's name, description and language (the FAQ was written by managed())
  html = html.replace(/(<script type="application\/ld\+json">\n)([\s\S]*?)(\n<\/script>)/, (m, a, json, b) => {
    const ld = JSON.parse(json);
    Object.assign(ld["@graph"][0], { name: t("name"), description: L.seoDesc ?? t("tagline"), inLanguage: lang, url: siteBase(src) + D.LANG_PATHS[lang] });
    return a + JSON.stringify(ld) + b;
  });
  // every element with data-i="key" holds plain text that the page script would set at runtime
  let n = 0;
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i="(\w+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, key, text, close) => { n++; return open + esc(t(key)) + close; });
  if (!n) throw new Error("no data-i elements found");
  html = html.replace(/<[a-z]+\b[^>]*\sdata-ia="(\w+)"[^>]*>/g, (tag, key) => tag.replace(/ (aria-label|title)="[^"]*"/g, (m, a) => ` ${a}="${esc(t(key))}"`));
  return html;
}

export async function build({ check = false } = {}) {
  const src = await readFile(new URL("index.html", root), "utf8");
  const app = await readFile(appSrc, "utf8");
  const D = langData(app);
  const gaps = i18nGaps(D);
  if (gaps.length) throw new Error("Untranslated text in src/app.js:\n  " + gaps.join("\n  "));
  const pricesSrc = between(app, "/* PRICES:BEGIN */", "/* PRICES:END */", "PRICES")
    .replace("/* PRICES:BEGIN */", "").replace("/* PRICES:END */", "").trim()
    .replace(/^const PRICES =\s*/, "").replace(/;$/, "");
  const P = JSON.parse(pricesSrc);
  const appFile = `app.${createHash("sha256").update(app).digest("hex").slice(0, 10)}.js`;
  const html = managed(src, "en", D, P, appFile);

  // favicon: the dog's head from the light logo, wordmark hidden
  const favicon = (await readFile(new URL("assets/logo-light.svg", root), "utf8"))
    .replace(/<svg [^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="920 208 544 544">')
    .replace('id="wordmark"', 'id="wordmark" display="none"');

  const block = between(app, "/* CALC:BEGIN", "/* CALC:END */", "CALC");
  const body = block.split("\n").map(l => l.replace(/^ {2}/, "")).join("\n");
  const calc = `// AWS Lightsail Cost Saver — calculation core (ES module).
// Generated from src/app.js by scripts/build.mjs; edit that, not this file.
// Docs: https://ls.1ms.dog/llms.txt · Source: https://github.com/yt1988/lightsail-cost-saver
//
//   import { calculate, buildLink } from "https://ls.1ms.dog/calc.js";
//   const prices = await (await fetch("https://ls.1ms.dog/prices.json")).json();
//   calculate({ region: "us-east-1", sizeGB: 1, usedGB: 3000 }, prices);

${body}

export { ${EXPORTS.join(", ")} };
`;

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
    ["assets/js/" + appFile, app], ["assets/favicon.svg", favicon],
    ...D.LANGS.filter(([l]) => l !== "en").map(([l]) => [D.LANG_PATHS[l] + "index.html", renderPage(html, l, D, P, appFile)])];
  let stale = [];
  // bundles left from earlier builds
  const jsDir = new URL("assets/js/", root);
  for (const name of await readdir(jsDir).catch(() => [])) {
    if (name === appFile || !/^app\.\w+\.js$/.test(name)) continue;
    if (check) stale.push("assets/js/" + name + " (old bundle)");
    else { await unlink(new URL(name, jsDir)); console.log(`removed public/assets/js/${name}`); }
  }
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
