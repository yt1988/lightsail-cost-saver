# Design notes

Why the code is built the way it is. How to build, test and deploy is in [AGENTS.md](../AGENTS.md).

## Billing model

The calculation follows these rules. Each one either comes from AWS's documentation or is marked as an assumption, so it can be switched off or changed if AWS says otherwise.

- **Both directions count, only outbound is charged.** Inbound and outbound both use the allowance. Overage is charged only on the outbound share, so the "outbound share" setting (default 100%) scales the overage, not the usage.
- **A pool is one region and one bundle size.** Dual-stack and IPv6-only instances of the same size share the same pool. So traffic instances are always the base instance's size, and always IPv6-only: that is the cheapest bundle that still joins the pool.
- **1 TB = 1024 GB.** The Lightsail API reports `transferPerMonthInGb` as 1024 for a 1 TB bundle. The billing month is the UTC calendar month, so all times are handled in UTC and only displayed in local time.
- **Half allowance in six regions** (Mumbai, Sydney, Jakarta, Malaysia, Hong Kong, São Paulo). The Lightsail FAQ says so, but the AWS Price List API doesn't always reflect it, so `scripts/update-prices.mjs` halves any of these regions (`DOC_HALF`) still listed at the full allowance. Check the list whenever Lightsail adds a region.
- **Mid-month instances are prorated by the hour** (assumption). The docs don't say how. An AWS Support–reviewed answer on re:Post says hourly, so the default prorates and the "prorate" setting turns it off. A new instance's allowance starts at the next full hour.
- **Overage already incurred can't be undone.** Instances added later only grow the allowance from then on, so the recommendation compares "add N now" against the overage that is still avoidable, not the whole month.

There are two modes, because people come with two different kinds of numbers:

- **Actual usage** (usage entered). The daily pace is measured from the earliest instance's start, clamped to this month, so a pool that started on the 20th isn't averaged over 20 empty days.
- **Full-month plan** (only a month-end forecast). Nothing before today counts as used, and every running instance counts for the whole month. The answer is "how many instances to run for the whole month", which is what you want when planning next month.

## One calculation core

The `CALC` block in `src/app.js` is copied into `public/calc.js` by the build, and the page calls the same functions. So the page, an agent importing `calc.js` and the regression tests always get the same numbers, and there is only one place to fix a rule. `npm test` fails if the copy drifts.

`calculate(input, prices, now)` takes `now` as an argument so tests can pin the clock. The page passes `Date.now()`.

Prices are a compact block in `src/app.js` (`[RAM GB, dual-stack $, IPv6-only $, transfer TB]` per bundle) so the page needs no extra request. `prices.json` is the same data in a readable shape for agents. `normalizePrices` accepts both.

## Static only

There is no server API, by design: the site costs nothing to host on static asset services (Cloudflare Workers static assets are free and unmetered), there is nothing to keep running, and visitors' numbers never leave their browser. Agents get the same capability from static files: `llms.txt` (rules and link parameters), `prices.json` and `calc.js`, served with open CORS.

Config links (`?region=…&used=…`) carry a whole setup. Opening one replaces the saved setup in that browser, so the previous setup is kept and the banner offers to undo. The config parameters are then removed from the address bar, so a reload doesn't apply the link again. Anything that comes from a link, an imported file or old storage goes through the same sanitizer: known keys and sane values only.

## Language pages

Each language is its own pre-rendered page (`/zh-cn/`, `/ja/`, …) with its text in the HTML, rather than one page translated by JavaScript. Search engines that don't run JavaScript (Baidu, for one) can then index every language, and the page doesn't flash English before switching.

- `public/index.html` is the source and the English page; the build fills every other page from `I18N`.
- All paths are relative (language pages rewrite `assets/` to `../assets/`), so the site also works below a sub-path, such as GitHub Pages.
- The head script sends a first visit at the root to the visitor's saved or browser language, but not crawlers (it skips user agents that look like bots), so the root stays indexable as English.
- No fallback to English. A missing key would quietly show English on a Chinese page, so the build fails instead: every language must have every key, the same list lengths and the same `{placeholders}`.

## Translations

- Words that visitors compare with the AWS console or bill follow AWS's own wording in that language. For example, zh-TW uses 執行個體 (as the AWS console does), not 實例. Bill item names (`TotalDataXfer-In-Bytes`) and "IPv6-only" stay in English in every language, explained in plain words the first time.
- The same concept uses the same word everywhere on a page: bundle, allowance, main instance, traffic instance, overage.
- The status headline (`#bandT`) must stay on one line at desktop width in every language. Keep its wording short, and check long languages (fr, pt, ru, de) after changing it.

## Layout

- **First paint is already the final layout.** Everything the page script fills in — the bundle grid, the action card, the gauge legend, the allowance/remaining/cost numbers, the bill link, the UTC note, the per-instance allowance line, the network label, the status headline and both selects — is written into the HTML by `scripts/build.mjs` in its default state (`firstBlocks()`), so the deferred script only replaces text where it already is. Before that, the page painted with empty containers and grew by ~330 px when the script ran: the weekly smoke run measured CLS 0.25 (good is under 0.1), and all of it was below-the-fold content moving down. The numbers in these blocks are computed for `PRICES.date`, not "now", because `build --check` must produce the same bytes on every machine; the script writes today's values a moment later. The shapes (dates, prorated allowances) match, so nothing moves. Fonts are preloaded in the head for the same reason: a late swap re-wraps a long title (de) or the forecast label and makes the header a line taller or shorter.
- **Header fitting.** The toolbar never wraps beside the logo. `fitHeader()` tries, in order: one row; a compact row (text buttons become icons); stacked under the logo. It measures by adding up the controls' widths, because overflow from a right-aligned row spills to the left, and `scrollWidth` doesn't count that. A `ResizeObserver` re-runs it when the web font loads or the language changes the widths.
- **Phones.** Below 640 px and on touch screens, form fields are 16 px (smaller text makes iOS Safari zoom in on focus), tap targets are at least 32 px, and no text is under 12 px. Date and time fields go under their label, because at 16 px they don't fit beside it.
- **Themes.** Colors are CSS tokens on `:root`, redefined for dark under `prefers-color-scheme` (unless the visitor picked light) and under `[data-theme="dark"]`. Control colors (`--sel`, `--knob`, …) and data colors (`--pool`) are separate tokens, so each can be tuned for a theme without affecting the other.

## Performance and caching

- The script is published as `app.<content hash>.js` and fonts are self-hosted, both cached for a year as immutable: a changed file gets a new name, so there is never a stale copy. Pages have no long cache header. Logos, the favicon and link-preview images keep their names, so they are cached for a week only.
- No third-party requests (no font CDN, no analytics in this repository), so the page works the same anywhere it is deployed.
- The logos are SVG files referenced by `<img>`, not inlined, so they are cached across pages. They were minified at one decimal of precision: rounding further turns the gradients' stop opacities into 0 or 1 and loses the shading.
- The same cache and CORS headers are written in three places: `public/_headers`, `nginx.conf` and `vercel.json`. Change all three together.

## Old browsers

Shipped scripts are lowered to ES2019 by esbuild (`TARGET` in `scripts/build.mjs`). Optional chaining (`?.`) and `??` are syntax errors in Safari before 13.1, Chrome before 80 and the in-app browsers built on them, and a single syntax error stops the whole script, so the page would show nothing but its pre-rendered text. The target leaves out `safari12`: esbuild treats destructuring as unsupported before Safari 14.1 (because of an edge case with default values) and can't lower it, while the plain destructuring in this code runs in Safari 12. The inline head script in `index.html` isn't processed, so it is written in ES2019 by hand. `scripts/test-pages.mjs` checks all three shipped scripts.
