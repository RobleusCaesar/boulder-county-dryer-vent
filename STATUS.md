# STATUS — Boulder County Dryer Vent public site V1

## Done
- On GitHub `main`: Next.js static export + Pages workflow
- Brand: Boulder County Dryer Vent (no Co., no AI)
- Phone: **Call coming soon** (no fake number)
- Homepage locked H1 / subhead / CTA; trust line in brand.copy
- `/portal` demo banner: **Demo — not live accounts**
- `/admin` password stub (default changeme)
- Empty capacity via CRM `listSlots() => []`
- Box mirrors: `/workspace/bcdv/site-stable` (build OK) and `/workspace/bcdv/site`

## Stubbed
Stripe live, real slots, SMS, counsel legal, custom domain (IONOS MX untouched)

## Pages
https://robleuscaesar.github.io/boulder-county-dryer-vent/

Deploy 404s until Pages exists. Enable **Settings → Pages → Source: GitHub Actions**, then re-run **Deploy GitHub Pages**. The workflow skips `deploy-pages` (green) until that API is available so failed deploys stop emailing.

Public NAP on contact/footer/schema: **6395 Gunpark Drive, Suite J, Boulder, CO 80301**. Legal notices stay Denver (Trenton Way).
