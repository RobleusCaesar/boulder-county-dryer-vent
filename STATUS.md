# Status

V1 public site is on `main` as a Next.js 15 static export for GitHub Pages.

## Build

Local `npm install && npm run build` must pass before a Pages deploy. The workflow at `.github/workflows/pages.yml` sets `GITHUB_PAGES=true` so `basePath` / `assetPrefix` are `/boulder-county-dryer-vent`.

## Pages

Expected URL: https://robleuscaesar.github.io/boulder-county-dryer-vent/

Enable **Settings → Pages → Source: GitHub Actions**, then re-run **Deploy GitHub Pages**. The first Actions deploy built `out/` successfully and failed at `deploy-pages` with 404 until Pages is turned on. No CNAME. IONOS MX/SPF/DKIM/DMARC are not touched.

## Locked public copy

- Phone everywhere: Call coming soon
- Empty calendar: No times open yet — join waitlist / leave contact
- Portal banner: Demo — not live accounts
- Reviews title: Reviews coming after our first jobs
- Homepage H1 / subhead / CTA / trust line as in `lib/brand.ts`
- Public prices: $129 / $169 / $109. $99 route-fill is ops-only (`/book/?offer=route`, `/admin`)
