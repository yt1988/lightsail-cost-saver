#!/usr/bin/env node
// Checks the pre-rendered language pages: each one exists at its path, carries its own language in the
// HTML itself (no JS needed), and points canonical/hreflang at the right URLs.
import { readFile } from "node:fs/promises";
import { langData, siteBase } from "./build.mjs";

const pub = new URL("../public/", import.meta.url);
const src = await readFile(new URL("index.html", pub), "utf8");
const D = langData(src), base = siteBase(src);
const plain = s => s.replace(/<[^>]+>/g, "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
let failed = 0;
const check = (name, ok) => { console.log(`${ok ? "ok  " : "FAIL"} ${name}`); if (!ok) failed++; };

// the early head script redirects with its own copy of the path map
const head = /var d = document\.documentElement, P = (\{[^}]+\})/.exec(src);
check("head script path map matches LANG_PATHS", !!head && JSON.stringify(JSON.parse(head[1])) === JSON.stringify(D.LANG_PATHS));

for (const [lang] of D.LANGS) {
  const L = D.I18N[lang], path = D.LANG_PATHS[lang];
  const html = await readFile(new URL(path + "index.html", pub), "utf8").catch(() => "");
  const ok = html.includes(`<html lang="${lang}">`)
    && html.includes(`<title>${esc(L.name)}</title>`)
    && html.includes(`data-i="tagline">${esc(L.tagline)}<`)
    && html.includes(plain(L.r[0]).split(" ")[0])
    && html.includes(`<link rel="canonical" href="${base + path}">`)
    && (html.match(/<link rel="alternate" hreflang=/g) || []).length === D.LANGS.length + 1
    && html.includes('aria-current="page">' + D.LANGS.find(([l]) => l === lang)[1] + "<");
  check(`/${path} is pre-rendered in ${lang}`, ok);
}

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log("\nall page checks passed");
