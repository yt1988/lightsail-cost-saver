#!/usr/bin/env node
// Sets the public URL for SEO: canonical, og:url and hreflang links in every language page,
// plus public/robots.txt and public/sitemap.xml. Run once per domain:
//   node scripts/set-site-url.mjs https://lightsail.example.com
import { readFile, writeFile } from "node:fs/promises";
import { build, langData } from "./build.mjs";

const arg = process.argv[2];
if (!arg || !/^https?:\/\//.test(arg)) { console.error("Usage: node scripts/set-site-url.mjs https://your-domain.example"); process.exit(1); }
const base = arg.replace(/\/+$/, "") + "/";

// store the base as the English page's canonical; build() derives every page's tags from it
const FILE = new URL("../public/index.html", import.meta.url);
const html = await readFile(FILE, "utf8");
const BEGIN = /<!-- SITE:BEGIN[^>]*-->/, END = "<!-- SITE:END -->";
const m = BEGIN.exec(html), b = html.indexOf(END);
if (!m || b < 0) throw new Error("SITE markers not found in public/index.html");
await writeFile(FILE, html.slice(0, m.index + m[0].length) + `\n<link rel="canonical" href="${base}">\n` + html.slice(b));

const D = langData(await readFile(new URL("../src/app.js", import.meta.url), "utf8")), url = l => base + D.LANG_PATHS[l], LANGS = D.LANGS.map(([l]) => l);
const today = new Date().toISOString().slice(0, 10);
const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l)}"/>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(l => `  <url>\n    <loc>${url(l)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${base}"/>\n  </url>`).join("\n")}
</urlset>
`;
await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../public/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
await build();
console.log(`Site URL set to ${base}\n  every language page: canonical + hreflang (${LANGS.length} languages)\n  public/sitemap.xml\n  public/robots.txt`);
