# STATUS — Boulder County Dryer Vent public site V2

## Done (2026-09-11)
- **V2 redesign live on `main`**: static HTML from the Claude Design "Industry" system (ember / ink / sand, Barlow Condensed, blueprint frames). Replaces the Next.js V1.
- Fixes the broken custom-domain deploy: V1 built with a `/boulder-county-dryer-vent` basePath, so every asset 404'd at https://bouldercountydryervent.com/. V2 serves from `/`.
- Brand: Boulder County Dryer Vent (no Co., no AI marks)
- Phone: **(866) 494-6590** (`tel:+18664946590`)
- Customer NAP: **6395 Gunpark Dr, Suite J, Boulder, CO 80301** · rob@frostrivercapital.com
- Pages: home, service, pricing, book (3-step), areas + 5 town pages, blog (3 posts) + post template, reviews (honest empty), about, contact, terms, privacy, credits, 404. Sitemap, robots, LocalBusiness + FAQ + BlogPosting schema.
- Booking + contact forms deliver by composed email to rob@frostrivercapital.com by default; drop a form-endpoint URL into `src/data/site.mjs` → `forms.endpoint` to POST instead.
- Empty calendar copy kept: **No times open yet — join waitlist / leave contact**. Slot UI is built and switches on when `slots` is populated.
- Town photos: licensed Wikimedia scenery committed under `src/static/img/cities/` (no build-time download). Attribution on `/credits/` and in `CREDITS.md`.

## Pages
https://bouldercountydryervent.com/ — Settings → Pages → Source = **GitHub Actions**; custom domain + HTTPS configured in Pages settings (no CNAME file needed).

## Removed in V2
- `/portal/*` demo and `/admin/` password stub (were "Demo — not live accounts"; not in the redesign)
- Stripe Payment Link env hooks (site no longer has a pay step — payment is after the visit)
- Wikimedia fetch-at-build script (images are committed)

## Still stubbed / owner decisions
- Form endpoint (Formspree or similar) — 5-minute setup, see README
- Real appointment slots — needs a schedule source
- Stripe online checkout — parked; manual invoice / link per `docs/JOB1-PAY-RUNBOOK.md`
- Reviews — page stays empty until customers write in
- Legal copy (terms/privacy) was updated to describe V2's forms; counsel review still pending
