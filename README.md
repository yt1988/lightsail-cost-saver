# AWS Lightsail Cost Saver

**English** · [简体中文](README.zh-CN.md)

> **Live demo: [ls.1ms.dog](https://ls.1ms.dog/)**. Open it and go, no sign-up. Or [hand it to your AI agent](#use-it-with-your-ai-agent).

<a href="https://ls.1ms.dog/"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-en-dark.png">
  <img src="docs/preview-en-light.png" alt="AWS Lightsail Cost Saver preview: the status banner shows $39.53 overage expected and suggests adding 2 traffic instances" width="100%">
</picture></a>

If you run anything traffic-heavy on Lightsail, you've probably had one scary bill. Once a plan's included transfer runs out, overage costs $0.09/GB, about $92 per TB. Yet a $5 IPv6 instance comes with 2 TB of transfer, which works out to $2.50 per TB. Same terabyte, more than 30× the price.

What many people miss: **Lightsail instances of the same size in the same region share one transfer pool**. In a busy month you can add a few small instances and the pool grows with them; when traffic drops, delete them. Billing is hourly, so nothing is wasted.

The hard part is doing the math. Will you go over this month? By how much? How many instances should you add, and when? How is a mid-month instance's allowance prorated? Can overage you've already hit be undone? The answers are scattered across AWS docs and forum threads, and it's easy to get them wrong by hand.

This tool does that math for you. Enter what you've used so far this month, or just your expected monthly total, and it tells you:

- **Whether this month is safe**: safe, overage expected, or already over, and how much extra you'd pay
- **When the allowance runs out**, so you know how long you have to act
- **The cheapest number of traffic instances to add**, added to your setup with one click
- **What to run next month** at the current pace

No sign-up. Open it and go; your data stays in your own browser. Available in 10 languages, with light and dark themes, and it works on phones.

## Features

| Area | What it does |
|---|---|
| Status banner | One glance: **Safe**, **Overage expected** or **Over allowance**, with the dollar amount and when the allowance runs out |
| Usage input | Type this month's total, or fill in the two bill items `TotalDataXfer-In-Bytes` and `TotalDataXfer-Out-Bytes` and they're added up |
| Forecast bar | Usage so far, the projected rest of the month, the allowance line and anything past it |
| Scale-up plan | Compares adding 0, 1, 2… traffic instances (instance cost + overage) and adds the cheapest with one click |
| Base instance | Pick a plan by monthly price; each card shows transfer and cost per TB, with the cheapest marked |
| Traffic instances | Always the same size as the base and IPv6-only (cheapest, and pooled with a dual-stack base); start and delete times per batch |
| Next month | Suggests base + N instances for next month at the current pace |
| Checks | Warns when a forecast is below usage or a deletion time is before creation; imported backups are sanitized |

### Two calculation modes

| Mode | When | How it works |
|---|---|---|
| Actual usage | You entered usage | Daily pace is measured from the first instance's start; overage already incurred can't be offset; new instances are prorated from the next full hour |
| Full-month plan | Only a month-end forecast | Nothing before today counts as used; every running instance counts for the whole month, so the answer is "how many for the full month" |

## Use it with your AI agent

Rather not fill it in yourself? Hand it to an agent that can browse the web, such as ChatGPT, Claude, Gemini or Cursor. The agent reads one short guide, does the math and gives you a pre-filled link you can check in the app. The **Use with AI** button at the top of the page has the same content with copy buttons.

### One-minute start

Send this to your agent and fill in the blanks:

```text
Read https://ls.1ms.dog/llms.txt first, then use its Lightsail billing rules to work out my data transfer pool.
My setup: region ___, bundle ___ (e.g. $7 / 2 TB transfer), ___ GB used this month (as of ___).
Tell me whether I'll go over this month and the cheapest number of traffic instances to add, and give me a pre-filled calculator link so I can check.
```

Opening the link loads that setup; your previous data is backed up first and can be restored. In the app, **Settings → Copy config link** does the reverse, so you can send your current setup to the agent.

### Use cases

| Use case | Ask something like | Access needed |
|---|---|---|
| Will I go over? | I'm on the $12 / 3 TB bundle in Tokyo and have used 2800 GB this month. Will I go over, and how many traffic instances should I add? | None |
| Choose a setup | About 8 TB a month, mostly to users in Southeast Asia. What's the cheapest Lightsail setup? | None |
| Plan next month | Next month I expect about 12,000 GB in Frankfurt on the $7 / 2 TB bundle. How many traffic instances keep the cost lowest? | None |
| Explain my bill | Here are the Lightsail data transfer lines from my bill (paste). How much allowance is left, and will I be charged? | None |
| Usage alerts | Every morning, read my instances' network metrics and warn me if this month is heading for overage. | AWS read-only |
| Auto scale-up | If overage is expected, create the recommended number of IPv6-only instances of my bundle in the same region. Ask me to confirm first. | AWS write, costs money |

Add "Rules and method: https://ls.1ms.dog/llms.txt" to any question so the agent uses the same rules as the app.

### For developers

Everything is a static file, readable from any origin. There is no server API and no key.

| File | Contents |
|---|---|
| [llms.txt](https://ls.1ms.dog/llms.txt) | Guide for agents: billing rules, link parameters, result fields |
| [prices.json](https://ls.1ms.dog/prices.json) | Bundle prices, allowances and overage rates for every region |
| [calc.js](https://ls.1ms.dog/calc.js) | The calculation module (ES module): the exact code the page runs, so results match |

```js
import { calculate, buildLink } from "https://ls.1ms.dog/calc.js";
const prices = await (await fetch("https://ls.1ms.dog/prices.json")).json();

const input = {
  region: "us-east-1", sizeGB: 1, usedGB: 3150,
  trafficInstances: [{ count: 1, start: "2026-10-11T00:00Z" }]
};
const result = calculate(input, prices);
const link = buildLink(input);   // the same setup as a pre-filled link
```

Main fields returned by `calculate`:

| Field | Meaning |
|---|---|
| `status` | `safe`, `overage-expected`, `over-allowance` or `needs-input` |
| `allowanceGB`, `usedGB`, `forecastGB` | Allowance, used and month-end forecast (GB) |
| `overageGB`, `overageCost`, `totalCost` | Expected overage (GB), overage cost and total cost (USD) |
| `allowanceRunsOutAt` | When the allowance is expected to run out (UTC) |
| `recommendation` | How many traffic instances to add, from when, and what it saves |
| `nextMonth` | Suggested traffic instances and monthly cost for next month |

Common link parameters:

| Param | Meaning | Example |
|---|---|---|
| `region` | AWS Region code | `us-east-1` |
| `size` | Bundle, identified by its RAM in GB (prices.json maps it to price and transfer) | `1` |
| `used` | GB used this month (in + out) | `3150` |
| `forecast` | Expected month-end total in GB; without `used` it plans the full month | `10000` |
| `nodes` | Traffic instances as `count@start[~end]`, UTC | `1@2026-10-11T00:00Z` |

All parameters are in [llms.txt](https://ls.1ms.dog/llms.txt). Node.js can't import from a URL: download `calc.js` or use `public/calc.js` from this repository. `calc.js` and `prices.json` are generated from `public/index.html` by `node scripts/build.mjs`; `npm test` checks they're in sync and runs the regression tests.

### Safety notes

- Config links contain your usage numbers, so check before sharing them.
- Usage alerts only need read access; give the agent a separate read-only IAM user or role.
- Auto scale-up creates real, billed instances: grant only the permissions it needs, require the agent to confirm first and cap the instance count.
- Results are estimates; your AWS bill is final.

## Billing rules used

| Item | Rule |
|---|---|
| What counts | Inbound **and** outbound traffic both use the allowance |
| What's charged | Only outbound traffic beyond the allowance (the "outbound share" setting, default 100%) |
| Pooling | Same region **and** same bundle size; dual-stack and IPv6-only of one size pool together |
| Mid-month changes | Billed hourly; allowance prorated by lifetime (not stated in the docs; an AWS Support–reviewed re:Post answer says hourly; can be switched off) |
| Overage already incurred | Can't be offset by adding instances later |
| Units | 1 TB = 1024 GB (the Lightsail API's `transferPerMonthInGb` is 1024 for a 1 TB plan); billing month = UTC calendar month |
| Half allowance | Mumbai, Sydney, Jakarta, Malaysia, Hong Kong, São Paulo |

Estimates only; your AWS bill is final. This is not an official AWS tool.

## Deploy

The whole app is `public/`. Any static host works; three ready-made options follow.

### Cloudflare (recommended)

Requests for static assets are free and unmetered, and there's no commercial-use restriction. `wrangler.toml` is set up as a Worker that only serves static assets from `public/` (no Worker script), which is the default flow in the Cloudflare dashboard today.

**Option A: connect this repository (Workers)**

1. Fork this repository.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**, then pick your fork.
3. Settings:
   - Build command: *(leave empty)*
   - Deploy command: **`npx wrangler deploy`** (the default)
   - Preview command: `npx wrangler versions upload` or the default; preview builds are optional
4. **Deploy**. Every push to the main branch redeploys.

**Option B: Cloudflare Pages**

Workers & Pages → **Create** → **Pages** → **Connect to Git** → Framework preset **None**, Build command *(empty)*, Build output directory **`public`**.

**Option C: deploy from your machine**

```bash
npx wrangler deploy
```

### Vercel

**Option A:** Vercel dashboard → **Add New** → **Project** → import your fork. No framework, no build command; `vercel.json` already sets the output directory to `public`.

**Option B:**

```bash
npx vercel --prod
```

Note: the free Hobby plan is for **non-commercial use only** and stops serving once its monthly request quota is used up.

### Docker

A ready-to-run image is published to Docker Hub as `imxjp/lightsail-cost-saver` (nginx serving the static page, about 20 MB, `linux/amd64` and `linux/arm64`).

```bash
docker run -d --name lightsail-cost-saver -p 8080:80 --restart unless-stopped imxjp/lightsail-cost-saver:latest
```

Then open http://localhost:8080.

With Docker Compose:

```yaml
services:
  lightsail-cost-saver:
    image: imxjp/lightsail-cost-saver:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

To build it yourself instead, clone the repository and run `docker compose up -d --build`.

## Before you deploy (optional)

```bash
# Refresh prices from the AWS Price List API into public/index.html (Node 18+)
node scripts/update-prices.mjs

# Set your public URL for SEO: canonical, hreflang, sitemap.xml, robots.txt
node scripts/set-site-url.mjs https://your-domain.example
```

Both run once on your machine or in CI and add nothing to page load. If a region fails to download, its previous prices are kept.

## Project layout

```
public/index.html                 the whole app (logos inlined, no external images)
public/calc.js, prices.json      generated for agents (calculation module, prices)
public/llms.txt                   how agents can use the tool
scripts/build.mjs                 regenerates calc.js and prices.json from the page
scripts/test-calc.mjs             regression tests (npm test)
scripts/update-prices.mjs         refresh prices from the AWS Price List API
scripts/set-site-url.mjs          canonical / hreflang / sitemap / robots for your domain
assets/                           1ms logo masters (light and dark), kept for reference
docs/                             README preview screenshots
Dockerfile, nginx.conf            container image
.github/workflows/docker.yml      builds and pushes the Docker Hub image
.github/workflows/pages.yml       optional GitHub Pages deployment
wrangler.toml, vercel.json, netlify.toml
```

## Official references

- [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/)
- [Data transfer FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html)
- [Billing FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html)
- [AWS Service Terms](https://aws.amazon.com/service-terms/)

## License

[MIT](LICENSE)
