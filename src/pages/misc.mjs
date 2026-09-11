import { site, routes, prices, aboutValues, towns } from "../data/site.mjs";
import { esc, corners, join, icons } from "../lib/html.mjs";
import { page, ctaBand, pageHero, bookBtn } from "../templates/layout.mjs";

/* ── About ──────────────────────────────────────────────────────────── */
export function aboutPage() {
  const body = `
<section class="bg-sand bb">
  <div class="wrap grid grid-2--280 grid center" style="padding-top:clamp(36px,5vw,76px);padding-bottom:clamp(36px,5vw,76px)">
    <div>
      <p class="kicker">About</p>
      <h1 class="t-page">A local service with one job</h1>
      <p class="lede lede--tight" style="margin-bottom:14px">We clean residential dryer vents in Boulder County. We publish prices. We do not invent appointment times. This is not a national franchise page and not a catch-all &#8220;we do vents, ducts, and chimneys&#8221; shop.</p>
      <p class="body-lg" style="max-width:48ch">We stay inside the county on purpose. It keeps drive time out of your invoice, and it means the person at your door is a neighbor, not a dispatch from Denver.</p>
    </div>
    <figure class="blueprint">
      ${corners()}
      <span class="fig-img ar-4-5"><img src="/img/lint-before.jpg" alt="Rotary brush pulling lint from an exterior dryer vent hood" width="1448" height="1086" style="object-position:70% 50%"></span>
    </figure>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--md">
    <p class="kicker">Why fixed pricing</p>
    <h2 class="t-section t-section--sm max-24 mb-3">Three decisions that make the flat rate work</h2>
    <div class="grid grid-cards grid-cards--270">
      ${join(
        aboutValues,
        (v) => `<div class="blueprint card card--pad-lg">${corners()}<span class="num">${v.n}</span><h3 class="t-card" style="font-size:25px">${esc(v.title)}</h3><p class="card-body">${esc(v.body)}</p></div>`,
      )}
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap section--md grid grid-2--280 grid" style="align-items:stretch">
    <div class="blueprint card card--pad-lg office-card">
      ${corners()}
      <h3>The Boulder office</h3>
      <p class="card-body">Paperwork, phones, and the route sheet live here. The van does not park here &#8212; it is out in the county.</p>
      <p class="addr">${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}</p>
      <p class="muted" style="margin:0">${esc(site.hours)}</p>
      <a href="${site.phoneHref}" class="big-phone">${site.phoneDisplay}</a>
      <a href="${routes.contact}" class="btn btn-outline-ink" style="min-height:50px;font-size:18px">Send a message</a>
    </div>
    <figure class="blueprint map-fig" style="min-height:280px">
      ${corners()}
      <a href="${site.mapsUrl}" target="_blank" rel="noopener" class="map-area" style="display:block;aspect-ratio:auto;height:100%;min-height:280px;text-decoration:none" aria-label="Open ${esc(site.addressLine)} in Google Maps">
        <span class="map-label">Office &#183; ${esc(site.address.street)}</span>
        <span class="map-cross-h"></span><span class="map-cross-v"></span>
        <span class="pin pin--static"><i></i><span>Open in maps &#8594;</span></span>
      </a>
    </figure>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--md wrap--narrow">
    <h2 class="t-block mb-2">How we run things</h2>
    <p class="body-lg">The booking flow is built to be boring on purpose. You answer two access questions, you see the price that applies, and you tell us the days that work. We confirm a two-hour window by text or email &#8212; we do not show placeholder appointment slots to look busy.</p>
    <p class="body-lg">Reviews stay empty until customers write them. Photos of your duct, before and after, go to your inbox the same day as the visit, along with the two airflow readings. That is the record we would rather be judged on.</p>
    <p class="body-lg">${esc(site.legalName)}. Colorado trade name ID ${esc(site.tradeNameId)}.</p>
  </div>
</section>

${ctaBand({ lede: "" })}`;

  return page({
    path: routes.about,
    title: "About — one van, five towns, one job",
    description: "Boulder County Dryer Vent is a local, fixed-price dryer vent cleaning service. One service only, routes not dispatch, photos every visit.",
    current: "about",
    body,
  });
}

/* ── Reviews ────────────────────────────────────────────────────────── */
export function reviewsPage() {
  const body = `
${pageHero({
  kicker: "Reviews",
  title: "Reviews coming after our first jobs",
  lede: "When customers leave notes after a visit, they appear here as written. Until then this page stays blank on purpose &#8212; no borrowed testimonials, no seeded five-star copy.",
})}

<section class="bg-white">
  <div class="wrap section grid grid-2 start">
    <div class="blueprint card card--pad-lg">
      ${corners()}
      <h2 class="t-block" style="margin-bottom:10px">Been here already?</h2>
      <p class="card-body" style="margin-bottom:22px">If we cleaned your vent, we want the unvarnished version. Use the contact form and say it was a review. We will not edit it into marketing copy.</p>
      <a href="${routes.contact}" class="btn btn--md btn-ember" style="display:inline-flex">Send a review</a>
    </div>
    <div class="blueprint card card--sand card--pad-lg">
      ${corners()}
      <h2 class="t-block" style="margin-bottom:10px">What you can judge us on today</h2>
      <p class="card-body" style="margin-bottom:14px">Every visit ends with before-and-after photos of your duct and two airflow readings in your inbox, the same day. The price you saw on screen is the price on the invoice.</p>
      <a href="${routes.service}" class="link-arrow">How a visit works &#8594;</a>
    </div>
  </div>
</section>

${ctaBand({ lede: "Two questions, then your published price and a request for the days that work." })}`;

  return page({
    path: routes.reviews,
    title: "Reviews",
    description: "Customer reviews for Boulder County Dryer Vent. This page stays empty until real customers write in — no seeded testimonials.",
    current: "reviews",
    body,
  });
}

/* ── Contact ────────────────────────────────────────────────────────── */
export function contactPage() {
  const body = `
<section class="bg-sand bb">
  <div class="wrap" style="padding-top:clamp(32px,5vw,68px);padding-bottom:clamp(32px,5vw,68px)">
    <p class="kicker">Contact</p>
    <h1 class="t-page t-page--sm max-22">Questions we have not answered yet</h1>
    <p class="lede lede--sm" style="max-width:52ch">If you want to book, the flow is faster than this form &#8212; it shows your price and takes your request in about a minute.</p>
    <a href="${routes.book}" class="btn btn--md btn-ember" style="margin-top:20px">Book My Visit &#183; $${prices.standard.amount}</a>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--md grid grid-2 start">
    <div>
      <form class="blueprint card card--pad-lg form" data-contact-form novalidate>
        ${corners()}
        <h2 class="t-block" style="font-size:clamp(26px,3.6vw,34px);margin:0">Send a message</h2>
        <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" class="input" type="text" placeholder="Jane Doe" required autocomplete="name"></div>
        <div class="field"><label for="c-phone">Phone</label><input id="c-phone" name="phone" class="input" type="tel" placeholder="(303) 555-0134" autocomplete="tel"></div>
        <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" class="input" type="email" placeholder="you@example.com" required autocomplete="email"></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" class="input" placeholder="Second-floor laundry, not sure which tier we are in." required></textarea></div>
        <button type="submit" class="btn btn--md btn-ember blueprint" style="display:flex">${corners()}Send it</button>
        <p class="form-error" data-error hidden></p>
        <p class="form-note">We answer during office hours, usually within a few hours. Nothing is scheduled from this form &#8212; use <a href="${routes.book}">Book My Visit</a> for that.</p>
      </form>
      <div class="blueprint card card--pad-lg" data-contact-done hidden tabindex="-1">
        ${corners()}
        <span class="done-mark">${icons.bigCheck()}</span>
        <h2 class="t-block" style="margin:16px 0 8px">Message ready</h2>
        <p class="card-body" data-via></p>
        <div class="actions" style="margin-top:18px">
          <a href="#" class="btn btn--md btn-outline-ink" data-mailto hidden>Open the email again</a>
          <a href="${site.phoneHref}" class="btn btn--md btn-outline-ink btn--phone">${site.phoneDisplay}</a>
        </div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="blueprint contact-card" style="background:var(--sand)">
        ${corners()}
        <h3>Call or text</h3>
        <a href="${site.phoneHref}" class="big-phone">${site.phoneDisplay}</a>
        <p>Fastest for odd situations &#8212; shared walls, detached laundry, anything the flow does not have a button for.</p>
      </div>
      <div class="blueprint contact-card">
        ${corners()}
        <h3>Email</h3>
        <a href="mailto:${site.email}" style="font-size:18px;word-break:break-word">${site.email}</a>
      </div>
      <div class="blueprint contact-card">
        ${corners()}
        <h3>Office</h3>
        <p class="addr">${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}</p>
        <p class="muted">${esc(site.hours)}</p>
        <a href="${site.mapsUrl}" target="_blank" rel="noopener" class="link-arrow link-arrow--sm" style="min-height:0">Open in maps &#8594;</a>
      </div>
      <div class="blueprint contact-card">
        ${corners()}
        <h3>Service area</h3>
        <p>${towns.map((t) => t.name).join(", ").replace(/, ([^,]*)$/, ", and $1")}. <a href="${routes.areas}">See the map</a>.</p>
      </div>
    </div>
  </div>
</section>`;

  return page({
    path: routes.contact,
    title: "Contact",
    description: `Call or text ${site.phoneDisplay}, email ${site.email}, or send a message. Boulder County Dryer Vent — ${site.addressLine}.`,
    current: "",
    body,
  });
}

/* ── Legal ──────────────────────────────────────────────────────────── */
const legalShell = ({ kicker, title, lede, inner }) => `
${pageHero({ kicker, title, lede, size: "t-page--sm" })}
<section class="bg-white"><div class="wrap wrap--prose legal-prose">${inner}</div></section>`;

export function termsPage() {
  const inner = `
<p>Last updated: ${esc(site.legalUpdated)}.</p>
<h2>Who you are contracting with</h2>
<p>${esc(site.legalName)}. Colorado trade name ID ${esc(site.tradeNameId)}. Notices: ${esc(site.noticesAddress)}. ${esc(site.noticesEmail)}.</p>
<h2>The service</h2>
<p>${esc(site.name)} offers residential dryer vent cleaning in the Boulder County towns listed on this site. An online booking request is a request until we confirm a time by text or email. Published prices apply to work that matches the eligibility answers you submit; if the home does not match, we tell you before any work starts and you may decline with nothing owed.</p>
<h2>Cancellation</h2>
<p>${esc(site.cancelPolicy)}</p>
<h2>What we can refuse</h2>
<p>We may decline unsafe roof conditions, commercial plants, multi-unit risers, or homes outside the listed area. If we decline after a visit starts because the job does not match the booking, we will say so before charging for a visit that was not performed.</p>
<h2>Payments</h2>
<p>This website does not charge cards and nothing is charged to hold a time. Payment is collected after the visit by card link, invoice, or on site, and charges appear on your statement as ${esc(site.name)}.</p>
<h2>Texts</h2>
<p>If you opt in to SMS, you agree to receive appointment and service messages. Frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.</p>`;

  return page({
    path: routes.terms,
    title: "Terms of service",
    description: `Terms for booking and using the ${site.name} website.`,
    current: "",
    body: legalShell({ kicker: "Legal", title: "Terms of service", lede: "These terms cover the public site, booking requests, and the waitlist.", inner }),
  });
}

export function privacyPage() {
  const inner = `
<p>Last updated: ${esc(site.legalUpdated)}.</p>
<p>${esc(site.legalName)}. Trade name ID ${esc(site.tradeNameId)}. Notices: ${esc(site.noticesAddress)}. ${esc(site.noticesEmail)}.</p>
<h2>What we collect when you book or write to us</h2>
<p>Name, email, phone, service address, eligibility answers, preferred days, SMS consent, and anything you put in the notes. After a visit: job notes, invoices, and the before-and-after photos of your duct, kept for customers who booked a visit.</p>
<h2>How this website handles forms</h2>
<p>This is a static website with no server of its own. When you submit the booking request or contact form, the details are sent to us either as an email composed on your device or through our form provider; the website itself does not store them. Your in-progress booking answers are kept in your browser&#8217;s session storage so a page refresh does not lose them, and are never sent anywhere until you submit.</p>
<h2>Sharing</h2>
<p>We do not sell customer lists. Processors we use or expect to use include an email provider, a payment provider for invoices and card links, and a form-delivery service. We name vendors here when they are actually connected.</p>
<h2>Contact</h2>
<p>Privacy questions: ${esc(site.noticesEmail)}.</p>`;

  return page({
    path: routes.privacy,
    title: "Privacy policy",
    description: `How ${site.name} handles contact and booking information.`,
    current: "",
    body: legalShell({ kicker: "Legal", title: "Privacy policy", lede: "What we collect, how the forms on this site work, and who we share with.", inner }),
  });
}

/* ── Credits ────────────────────────────────────────────────────────── */
export function creditsPage() {
  const rows = [
    ["boulder.jpg", "Flatirons Sunrise — Flatirons from Chautauqua", "Tyler Cipriani", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Flatirons_Sunrise.jpg"],
    ["louisville.jpg", "Jacoe Store, Main Street, Louisville, CO", "Jeffrey Beall", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Jacoe_Store.JPG"],
    ["lafayette.jpg", "E Simpson Street, Lafayette, CO", "Jared Winkler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Lafayette,_CO.jpg"],
    ["longmont.jpg", "Downtown Longmont Main Street", "David Shankbone", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Longmont_Colorado.JPG"],
    ["superior.jpg", "Rock Creek subdivision, Superior, CO", "Pleiades Two", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Superior,_Colorado,_Fall_2011.jpg"],
  ];
  const inner = `
<p>Town page photographs are licensed local scenery from Wikimedia Commons &#8212; real places in the towns we serve, not job photos. Each is cropped and resized for the web; the original and its license are linked below.</p>
<div class="table-scroll"><table>
<thead><tr><th>Page</th><th>Depicts</th><th>Author</th><th>License</th></tr></thead>
<tbody>${join(rows, ([file, what, who, lic, url]) => `<tr><td>${esc(file.replace(".jpg", ""))}</td><td><a href="${url}" rel="noopener" target="_blank">${esc(what)}</a></td><td>${esc(who)}</td><td>${esc(lic)}</td></tr>`)}</tbody>
</table></div>
<p>Service photographs (technician, ducts, hoods) are illustrative images prepared for this site, not photographs of a specific customer&#8217;s home. Every customer receives photos of their own duct after the visit.</p>
<p>Type: Barlow and Barlow Condensed by Jeremy Tribby, via Google Fonts (SIL Open Font License).</p>`;

  return page({
    path: routes.credits,
    title: "Credits",
    description: "Photo credits and licenses for Boulder County Dryer Vent town page imagery.",
    current: "",
    body: legalShell({ kicker: "Credits", title: "Photo credits", lede: "Town page heroes are licensed local scenery &#8212; not dryer-vent job photos.", inner }),
  });
}

/* ── 404 ────────────────────────────────────────────────────────────── */
export function notFoundPage() {
  const body = `
<section class="bg-sand">
  <div class="wrap section nf">
    <div>
      <b>404</b>
      <h1 class="t-page t-page--sm" style="margin-top:10px">That page is not on the route sheet</h1>
      <p class="lede" style="margin-left:auto;margin-right:auto">The address may have changed. Everything useful is a click away.</p>
      <div class="actions" style="justify-content:center;margin-top:26px">
        ${bookBtn("Book My Visit")}
        <a href="${routes.home}" class="btn btn-outline-ink">Back to home</a>
      </div>
    </div>
  </div>
</section>`;
  return page({ path: "/404.html", title: "Page not found", description: "That page is not on the route sheet.", current: "", body, noindex: true });
}
