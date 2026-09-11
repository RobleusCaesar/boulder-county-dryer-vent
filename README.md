# Boulder County Dryer Vent

Public marketing site, booking funnel, and customer portal stub for **Boulder County Dryer Vent** (no “Co.” in the brand name). Hosted as a static export on GitHub Pages.

Live URL (after Pages is enabled and `main` has deployed):

**https://robleuscaesar.github.io/boulder-county-dryer-vent/**

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- `output: "export"` — no server at runtime
- Mock CRM in `lib/crm/` with TODOs for Supabase

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run build` writes static files to `out/` and adds `.nojekyll` plus a root `404.html` for GitHub Pages.

Production on Pages uses `NEXT_PUBLIC_BASE_PATH=/boulder-county-dryer-vent`. Leave that unset locally so routes stay at `/`.

## GitHub Pages

1. Repo **Settings → Pages → Source**: GitHub Actions.
2. Merge to `main`. The **Deploy GitHub Pages** workflow builds the export and publishes it.
3. First successful run serves the URL above.

Workflows:

- `.github/workflows/ci.yml` — lint, typecheck, build on pull requests
- `.github/workflows/pages.yml` — deploy `out/` on `main`

A custom domain can be added later. If the site moves to the root of a domain, drop `NEXT_PUBLIC_BASE_PATH` in the workflows and set `NEXT_PUBLIC_SITE_URL` to that origin.

## Booking prices

| Price | When |
| --- | --- |
| **$129** | Standard single-story / typical access |
| **$169** | Two-story or roof access |
| **$109 / year** | Annual plan after the first visit |
| **$99** | Route-fill — **not listed** on the public pricing page. Apply with `?offer=route` on `/book/` |

The times step reads the CRM slot list. The mock returns **no slots** on purpose, then offers a waitlist.

## Customer portal (demo)

`/portal/login/` — **Enter demo portal**, or any email with password `demo`.

A **Demo mode** banner stays visible. Household, jobs, photos, invoices, reschedule, and SMS consent are mock data (`Jordan Hale`, Boulder).

## Supabase CRM roadmap

The UI talks only to `getCrm()` (`lib/crm/index.ts`). V1 returns `mockCrm`.

When you are ready:

1. Create a Supabase project. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and keep service-role keys off this static host).
2. Tables to stand up: `customers`, `jobs`, `job_photos`, `invoices`, `waitlist`, `bookings`, `reschedule_requests`, `contact_messages`.
3. Implement `lib/crm/supabase.ts` that satisfies `CrmClient` in `lib/crm/types.ts`. Switch the factory in `lib/crm/index.ts`.
4. Auth: magic link or OTP for real portal users. Storage bucket for job photos.
5. Writes that are stubs today: waitlist, booking request, contact form, reschedule, SMS consent.
6. Payments stay off this static export — use Stripe (or similar) hosted checkout / Payment Element against a small API or Edge Function, not against GitHub Pages itself.
7. Slot source: publish capacity from an ops calendar so `/book/` can show real times instead of an empty book.

Search the repo for `TODO(supabase)` for call sites.

## Brand

Deep teal / charcoal / white. No AI or “powered by” marks on the public site. Phone and email in the footer are labeled placeholders until real ones exist.
