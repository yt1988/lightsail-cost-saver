#!/usr/bin/env node
// Sets the public URL for SEO: canonical, og:url and hreflang links in public/index.html,
// plus public/robots.txt and public/sitemap.xml. Run once per domain:
//   node scripts/set-site-url.mjs https://lightsail.example.com
import { readFile, writeFile } from "node:fs/promises";

const arg = process.argv[2];
if (!arg || !/^https?:\/\//.test(arg)) { console.error("Usage: node scripts/set-site-url.mjs https://your-domain.example"); process.exit(1); }
const base = arg.replace(/\/+$/, "") + "/";
const LANGS = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru"];
const urlFor = l => l === "en" ? base : `${base}?lang=${l}`;

const FILE = new URL("../public/index.html", import.meta.url);
const html = await readFile(FILE, "utf8");
const BEGIN = /<!-- SITE:BEGIN[^>]*-->/, END = "<!-- SITE:END -->";
const m = BEGIN.exec(html), b = html.indexOf(END);
if (!m || b < 0) throw new Error("SITE markers not found in public/index.html");
const tags = [
  `<link rel="canonical" href="${base}">`,
  `<meta property="og:url" content="${base}">`,
  ...LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${urlFor(l)}">`),
  `<link rel="alternate" hreflang="x-default" href="${base}">`,
  `<link rel="sitemap" type="application/xml" href="${base}sitemap.xml">`
].join("\n");
await writeFile(FILE, html.slice(0, m.index + m[0].length) + "\n" + tags + "\n" + html.slice(b));

const today = new Date().toISOString().slice(0, 10);
const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l).replace(/&/g, "&amp;")}"/>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(l => `  <url>\n    <loc>${urlFor(l)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`).join("\n")}
</urlset>
`;
await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../public/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
console.log(`Site URL set to ${base}\n  public/index.html  canonical + hreflang (${LANGS.length} languages)\n  public/sitemap.xml\n  public/robots.txt`);
