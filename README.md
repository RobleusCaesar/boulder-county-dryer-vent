# Boulder County Dryer Vent

Public marketing site, booking funnel, and customer portal stub for **Boulder County Dryer Vent** (never “Co.”). Hosted as a static export on GitHub Pages.

See [STATUS.md](./STATUS.md) for deploy state.

Live URL (after Pages is enabled and `main` has deployed):

**https://robleuscaesar.github.io/boulder-county-dryer-vent/**

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, Inter
- `output: "export"`, `trailingSlash: true`, unoptimized images
- When `GITHUB_PAGES=true`, `basePath` and `assetPrefix` are `/boulder-county-dryer-vent`. Local builds leave them empty.
- Mock CRM in `lib/crm/` with TODOs for Supabase

## Local development

```bash
npm install
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run build` writes static files to `out/` (plus `public/.nojekyll` and a root `404.html`).

## GitHub Pages

1. Repo **Settings → Pages → Source**: GitHub Actions.
2. Push to `main`. `.github/workflows/pages.yml` builds with `GITHUB_PAGES=true` and publishes `out/`.
3. Do not add a CNAME. Do not change IONOS MX/SPF/DKIM/DMARC.

## Routes

- `/`, `/dryer-vent-cleaning`, `/pricing`, `/book`, `/book/confirmation`
- `/areas/{city}-co` and SEO aliases `/{city}-co-dryer-vent-cleaning` (Boulder, Louisville, Lafayette, Longmont, Superior)
- `/about`, `/contact`, `/reviews`, `/blog` (seed posts), `/legal/terms`, `/legal/privacy`
- `/portal` demo stub (`Demo — not live accounts`)
- `/admin` — password `NEXT_PUBLIC_ADMIN_PASSWORD` (default `changeme`)

## Booking prices

| Price | When |
| --- | --- |
| **$129** | Standard |
| **$169** | Difficult |
| **$109 / year** | Annual plan after the first visit |
| **$99** | Route-fill — **ops only**, never on the public pricing page. `/book/?offer=route` |

Empty calendar copy: **No times open yet — join waitlist / leave contact**

Phone everywhere: **Call coming soon**

## Legal

Public office: **6654 Gunpark Drive, Boulder, CO 80301** (Gunpark / Gunbarrel).

Frost River Capital, LLC d/b/a Boulder County Dryer Vent. Trade name ID 20268139028. Legal notices: 2369 S. Trenton Way Suite P, Denver, CO 80231. rob@frostrivercapital.com.

Cancel ≥24h: refund. Cancel &lt;24h: credit for 90 days.

## Brand

Teal `#0D7377` / `#095456` / `#E6F3F3`, charcoal `#2C3333` / `#5A6363`, wash `#F7F8F8`, line `#E2E5E5`, white. No AI marks. Stripe keys are test-mode stubs in `.env.example` only.
