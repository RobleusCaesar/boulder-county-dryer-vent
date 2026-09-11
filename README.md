# Boulder County Dryer Vent

Public marketing site and booking funnel for **Boulder County Dryer Vent** (never "Co."). Static HTML/CSS/JS with no dependencies, built by a tiny Node script and published to GitHub Pages.

**Live:** https://bouldercountydryervent.com/ · See [STATUS.md](./STATUS.md) for deploy state.

## Stack

- Plain HTML, one stylesheet (`src/static/css/site.css`), two small scripts (`site.js`, `book.js`). No framework, no npm packages.
- `scripts/build.mjs` (zero dependencies, Node ≥ 20) renders `src/pages/*.mjs` templates with data from `src/data/site.mjs` into `dist/`.
- Design: the "Industry" system from the Claude Design export — Barlow Condensed over Barlow, blueprint frames with `+` corner marks, ember `#E8632B` / ink `#1F2A37` / sand `#F6F1EA`.
- Deploy: `.github/workflows/pages.yml` builds on every push to `main` and publishes `dist/` (Pages source = GitHub Actions). The custom domain is configured in repo **Settings → Pages**; no `CNAME` file is needed for Actions deploys. Do not change IONOS MX/SPF/DKIM/DMARC.

## Local development

```bash
node scripts/build.mjs
python -m http.server 8787 -d dist
```

Open http://localhost:8787/. Any static server pointed at `dist/` works.

## Where things live

| Change | File |
| --- | --- |
| Phone, email, address, hours, legal entity | `src/data/site.mjs` → `site` |
| Prices, price cards, route-fill note | `src/data/site.mjs` → `prices`, `priceCards` |
| Towns, zips, per-town copy, map pin positions | `src/data/site.mjs` → `towns` |
| FAQs, service steps, warnings, trust bar | `src/data/site.mjs` |
| Where booking/contact forms are delivered | `src/data/site.mjs` → `forms.endpoint` (see below) |
| Nav links, header, footer, CTA band, `<head>` / schema | `src/templates/layout.mjs` |
| Page markup | `src/pages/*.mjs` |
| Blog posts | `src/content/blog/*.md` (frontmatter: `title`, `slug`, `date`, `category`, `readTime`, `image`, `imageAlt`, `description`) |
| Photos | `src/static/img/` (service photos) and `src/static/img/cities/` (licensed town scenery — see `CREDITS.md`) |

## Routes

`/`, `/dryer-vent-cleaning/`, `/pricing/`, `/book/`, `/areas/`, `/areas/{city}-co/`, `/blog/`, `/blog/{slug}/`, `/reviews/`, `/about/`, `/contact/`, `/legal/terms/`, `/legal/privacy/`, `/credits/`, `404.html`, `sitemap.xml`, `robots.txt`.
Legacy `/{city}-co-dryer-vent-cleaning/` URLs redirect to the `/areas/` pages.

## Booking flow and forms

`/book/` is a three-step flow: two eligibility questions → published price (`$129` standard, `$169` roof / second story / run over ~15 ft) → request a time. There is no server, so:

- **Default (`forms.endpoint` empty):** submitting the booking request or contact form composes an email to `site.email` on the visitor's device with every field filled in, and the confirmation screen shows the request summary plus the phone number as a fallback.
- **Recommended:** create a free form endpoint (Formspree or similar), paste the URL into `forms.endpoint`, and rebuild. Submissions are then POSTed as JSON and land in your inbox without the visitor's mail app being involved.
- **Real appointment slots:** `book.js` already renders slot buttons when `window.BCDV.slots` is non-empty. Wire `slots` in `src/templates/layout.mjs` (the `cfg` object) to a real schedule source when one exists. Until then the flow shows the honest empty-calendar state.

## Prices

| Price | When |
| --- | --- |
| **$129** | Standard — ground-floor side-wall termination, run under ~15 ft |
| **$169** | Difficult — roof or second-story termination, long or bending runs |
| **$109 / year** | Annual plan after the first visit |
| **$99** | Route-fill — **ops only**, never on the public site |

Phone everywhere: **(866) 494-6590**. Customer NAP: **6395 Gunpark Dr, Suite J, Boulder, CO 80301**.

## Legal

Frost River Capital, LLC d/b/a Boulder County Dryer Vent. Trade name ID 20268139028. Notices: 2369 S. Trenton Way Suite P, Denver, CO 80231. rob@frostrivercapital.com.
Cancel ≥ 24h: refund. Cancel < 24h: credit for 90 days.

## Content rules

- No fabricated reviews, ratings, review counts, or owner bios. `/reviews/` and the home reviews band stay honest until customers write in.
- No placeholder appointment times. The calendar is empty until real capacity exists.
- Blog is customer education only.
