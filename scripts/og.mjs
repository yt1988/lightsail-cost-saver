#!/usr/bin/env node
// Renders the link-preview images with resvg (dev dependency), 1200 × 630: public/og/<lang>.png for each language.
// Run when the name, the og subtitle or the logo changes, and commit the output. Uses system fonts for the text
// (Windows: Segoe UI, Microsoft YaHei, Microsoft JhengHei, Yu Gothic UI, Malgun Gothic), like the 1ms.dog home page.
// Usage: npm i && node scripts/og.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import { langData, siteBase } from "./build.mjs";

const pub = new URL("../public/", import.meta.url);
const D = langData(await readFile(new URL("../src/app.js", import.meta.url), "utf8"));
const HOST = new URL(siteBase(await readFile(new URL("index.html", pub), "utf8"))).host;
const render = svg => new Resvg(svg, { fitTo: { mode: "width", value: 1200 }, font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" } }).render().asPng();
const logo = Buffer.from(await readFile(new URL("assets/logo-dark.svg", pub))).toString("base64");
const FONTS = { "zh-CN": "Microsoft YaHei", "zh-TW": "Microsoft JhengHei", ja: "Yu Gothic UI", ko: "Malgun Gothic" };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// the picture: three instances' allowances joined into one pool bar, the usage filling it, and a red overage tail
function pool() {
  const x0 = 90, w = 600, y = 540, h = 26, seg = w / 3;
  return [
    ...[0, 1, 2].map(i => `<rect x="${x0 + i * seg + (i ? 3 : 0)}" y="${y}" width="${seg - (i ? 3 : 0) - (i < 2 ? 3 : 0)}" height="${h}" rx="6" fill="#2c2c2c"/>`),
    `<rect x="${x0}" y="${y}" width="${w * 0.78}" height="${h}" rx="6" fill="#3ecf8e"/>`,
    `<rect x="${x0 + w + 8}" y="${y}" width="70" height="${h}" rx="6" fill="#f56565" opacity=".35"/>`,
    `<line x1="${x0 + w + 4}" y1="${y - 10}" x2="${x0 + w + 4}" y2="${y + h + 10}" stroke="#f0f0f0" stroke-width="4" stroke-linecap="round"/>`
  ].join("");
}

// one card: the logo, the name (on two lines when long), a subtitle, the pool bar, the host
function card(lang, title, sub) {
  const ff = `${FONTS[lang] ? `'${FONTS[lang]}', ` : ""}'Segoe UI', 'Microsoft YaHei', sans-serif`;
  const cjk = /[　-鿿가-힯]/.test(title), max = cjk ? 16 : 26;
  let lines = [title];
  if (title.length > max) {
    const cut = title.lastIndexOf(" ", Math.ceil(title.length / 2) + 4);
    lines = cut > 3 ? [title.slice(0, cut), title.slice(cut + 1)] : [title];
  }
  const size = lines.length > 1 || title.length > 22 ? 62 : 72;
  const subY = 250 + lines.length * (size + 16) + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1c1c1c"/>
  <image href="data:image/svg+xml;base64,${logo}" x="90" y="64" width="250" height="100"/>
  ${lines.map((l, i) => `<text x="90" y="${250 + i * (size + 16)}" font-size="${size}" font-weight="700" fill="#ffffff" font-family="${ff}">${esc(l)}</text>`).join("")}
  <text x="90" y="${subY}" font-size="32" fill="#a0a0a0" font-family="${ff}">${esc(sub)}</text>
  ${pool()}
  <text x="1110" y="566" text-anchor="end" font-size="30" font-weight="600" fill="#ffb63f" font-family="Consolas, monospace">${HOST}</text>
</svg>`;
}

await mkdir(new URL("og/", pub), { recursive: true });
for (const [lang] of D.LANGS) {
  const L = D.I18N[lang], file = `og/${lang.toLowerCase()}.png`;
  await writeFile(new URL(file, pub), render(card(lang, L.name, L.ogSub)));
  console.log("wrote public/" + file);
}
