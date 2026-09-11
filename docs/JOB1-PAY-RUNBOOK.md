# Job #1 pay runbook (Sep 18 first paid)

**Status:** Pages live. Online Stripe checkout on `/book` is still a stub (static GitHub Pages; no secret-key server). **Manual invoice / Link is the approved path for job #1.**

## What works today on the live site
- `/book/` wizard: Eligibility → Price → Times → Details → Pay
- Calendar: `listSlots()` returns `[]` → honest empty calendar + waitlist UI
- Pay step: “Submit request” only (demo CRM; **does not charge**)
- Prices locked: Standard $129 · Difficult $169 · Annual $109 after first visit

## Job #1 — collect payment (no site change required)
1. Get customer details (name, email, phone, service address, ZIP, standard vs difficult).
2. In **Stripe Dashboard** (Frost River Capital LLC / trade name Boulder County Dryer Vent when available):
   - **Preferred:** create + email a **Stripe Invoice** for the quote amount (tax OFF for V1), OR
   - **Fast:** create a one-off **Payment Link** / Payment request and text/email it, OR
   - **Fallback:** Stripe **Link** / Dashboard charge with card present (if in person).
3. On paid: note invoice/payment id on the job row; send confirmation (email ok for #1; SMS later).
4. Do **not** flip site checkout live without written Ava/Rob go-live.

## Unblock full online pay (after bank)
Blocked on Rob:
1. Stripe account under **Frost River Capital LLC** (filed trade name for statements)
2. Bank account linked + payouts enabled
3. Test keys shared to Stack Builder (never commit live keys)
4. Written go-live in Owner Approvals before production keys / live Payment Links on `/book`

Then Stack Builder can:
- A) Add a **Payment Link** button to the `/book` confirmation step (works on GitHub Pages), or
- B) Add Checkout Session via a small backend (Supabase edge) + webhook → job confirm

## Capacity note (not Stack Builder)
Owner pivoted tech capacity to **solopreneurs / gig sites**, not competitor LLCs. Field Ops owns recruitment. Site keeps empty calendar + waitlist until real slots exist.

## Custom domain
Live: https://bouldercountydryervent.com/ (configured in GitHub Pages settings). Keep IONOS MX/SPF/DKIM/DMARC untouched.
