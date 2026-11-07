# AGENTS.md

Notes for anyone working on this repository, people and AI agents alike. What the tool does for its users is in [README.md](README.md); why the code is built the way it is, in [docs/design.md](docs/design.md).

## What this is

AWS Lightsail Cost Saver: a static calculator for Lightsail data transfer pools. It tells you whether this month will go over the allowance, by how much, and the cheapest number of extra instances to add. There is no server and no API: the whole site is the `public/` folder, and everything runs in the visitor's browser (setups are kept in `localStorage`). It has 10 languages, each its own pre-rendered page.

## Sources and generated files

Edit only these two by hand:

| File | What it holds |
|---|---|
| `public/index.html` | Markup and CSS; it is also the English page |
| `src/app.js` | The page script, with three blocks the build reads: `PRICES` (prices per region), `I18N` (region names and all 10 language packs) and `CALC` (the calculation core) |

`npm run build` (`scripts/build.mjs`) writes everything else from them, so never edit these by hand:

- `public/<lang>/index.html`, one page per language with its text written into the HTML
- `public/assets/js/app.<hash>.js` (a copy of `src/app.js` named by its content) and `public/assets/favicon.svg`
- `public/calc.js` (the `CALC` block as an ES module) and `public/prices.json`
- the build-managed blocks inside `public/index.html`: `SITE`, `APP`, `HELP`, `LANGNAV`, the footer text and the JSON-LD FAQ

Other scripts: `scripts/update-prices.mjs` (refreshes `PRICES` from the AWS Price List API), `scripts/set-site-url.mjs` (canonical, hreflang, sitemap, robots for a domain), `scripts/og.mjs` (link-preview images in `public/og/`).

## Run it locally

Needs Node 18 or later (CI uses 22).

```bash
npm ci
npm run build
npx wrangler dev        # or any static server pointed at public/, e.g. npx serve public
```

The server must serve `public/zh-cn/` for `/zh-cn/` (directory index) and `.js` as JavaScript, because `calc.js` is imported as a module. `docker compose up -d --build` serves it on http://localhost:8080 with the same nginx config as production.

## Test

`npm test` is what CI (`.github/workflows/check.yml`) runs on every push and pull request. It has three parts; run the ones your change touches while you work, and the whole thing before you commit.

| Changed | Run | Checks |
|---|---|---|
| anything | `node scripts/build.mjs --check` | every generated file matches the sources (run `npm run build` to fix) |
| `CALC` block, `PRICES` | `node scripts/test-calc.mjs` | regression cases of the calculation, with a fixed "now" |
| `I18N`, `index.html`, `build.mjs` | `node scripts/test-pages.mjs` | each language page is pre-rendered in its language: title, tagline, labels, help, canonical, hreflang, og tags |
| prices | `npm run prices` | rewrites `PRICES` and rebuilds; review the diff before committing |
| link-preview text (`seoTitle`, `ogSub`) | `npm run og` | regenerates `public/og/*.png` (needs the `@resvg/resvg-js` dev dependency) |

The build itself fails when a language is missing a key, has a different number of items in a list, or uses different `{placeholders}` than English. There is no fallback to English at runtime.

Layout changes are not covered by tests. Look at the page at a desktop width (1440 px), a laptop (about 1100 px) and a phone (375 px), in light and dark, and in a long language (fr, pt, ru) as well as zh-CN.

## Deploy

The site is the `public/` folder; any static host works. Ready-made setups:

- **Cloudflare Workers (static assets).** `wrangler.toml` serves `public/` with no Worker script. Connect the repository in the Cloudflare dashboard (build command empty, deploy command `npx wrangler deploy`), or run `npx wrangler deploy` yourself.
- **Docker.** `Dockerfile` builds an nginx image with `nginx.conf`. `.github/workflows/docker.yml` publishes it for amd64 and arm64 on every push to `main` and on `v*` tags. It needs a repository secret named `DOCKERHUB_TOKEN` (a Docker Hub access token). Set `DOCKERHUB_USERNAME` too when you push to your own Docker Hub account. Without the token the workflow only prints a warning.
- **Vercel, Netlify, GitHub Pages.** `vercel.json`, `netlify.toml` and `.github/workflows/pages.yml` (manual) are included.

Cache and CORS headers are set in three places that must agree: `public/_headers` (Cloudflare, Netlify), `nginx.conf` (Docker) and `vercel.json`.

### Deploying your own copy

1. Fork the repository and clone it.
2. `npm ci`
3. Optional: `npm run prices` to refresh prices.
4. `node scripts/set-site-url.mjs https://<your-domain>/`. This writes the canonical URL, hreflang, `sitemap.xml` and `robots.txt`, then rebuilds. It does not change the site address used in `public/llms.txt`, the README and the default base of `buildLink()` in `src/app.js`; change those by hand if your copy should point at itself.
5. `npm test`
6. Deploy `public/` with one of the options above, for example `npx wrangler deploy`, or `docker compose up -d --build` on your server behind your own TLS proxy at `<your-domain>`.

The cross-links to other tools (Me2Cloud, Cloud Cost Planner) only appear when the page contains `<meta name="m2c" content="https://<host>/">` or `<meta name="cost" content="https://<host>/">`. A copy without them shows no links and needs nothing.

## Conventions

- Keep the site static: no server code, no build step at deploy time, no third-party requests (fonts are self-hosted).
- Any change to visible text goes into all 10 language packs. Words that visitors compare with the AWS console follow AWS's own wording in that language (see [docs/design.md](docs/design.md#translations)).
- Do not rename the `localStorage` keys (`lightsail-pool:v2` for the setup, `lightsail-pool:v1` read once for migration, `lightsail-pool:theme`, `lightsail-pool:lang`): existing visitors would lose their saved setup. The head script in `index.html` reads the last two too.
- Generated files are committed. Run `npm run build` and commit them together with the source change.
- Text files use LF line endings (`.gitattributes`).

1ms.dog's operations notes are in the private repository 1ms-shell.
