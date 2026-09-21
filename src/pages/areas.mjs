import { site, routes, towns, prices } from "../data/site.mjs";
import { esc, attr, corners, join } from "../lib/html.mjs";
import { page, ctaBand, pageHero, bookBtn } from "../templates/layout.mjs";
import { mapFigure } from "./home.mjs";

const compactPrices = [
  { price: `$${prices.standard.amount}`, title: "Standard clean", note: "Ground-floor side-wall termination" },
  { price: `$${prices.difficult.amount}`, title: "Difficult clean", note: "Roof, upper floor, or a long run" },
  { price: `$${prices.annual.amount}`, title: "Annual plan", note: "After your first visit: same clean, same month, $20 off" },
];

const waitHonest =
  "We confirm a 2-hour window within one business day (usually a few business days out while we ramp).";

const priceProof = `$${prices.standard.amount} standard &#183; $${prices.difficult.amount} difficult/long &#183; $${prices.annual.amount} annual`;

function lafayetteNearby(t) {
  if (t.slug !== "lafayette-co") return "";
  const louisville = towns.find((x) => x.slug === "louisville-co");
  const superior = towns.find((x) => x.slug === "superior-co");
  return `<p class="muted" style="margin:16px 0 0;font-size:16px">Also see <a href="${routes.areas}">all service areas</a>, <a href="${routes.area(louisville.slug)}">${esc(louisville.name)}</a>, and <a href="${routes.area(superior.slug)}">${esc(superior.name)}</a>.</p>`;
}

export function areasPage() {
  const body = `
${pageHero({
  kicker: "Service area",
  title: "Boulder County only, one town at a time",
  size: "t-page--lg max-20",
  lede: `We do not drive to Denver. Staying inside five towns is what keeps the price flat and the schedule honest &#8212; if we are in your town anyway, the visit costs $${prices.standard.amount}.`,
})}

<section class="bg-white">
  <div class="wrap section grid grid-2--wide grid center">
    ${mapFigure({ caption: "Schematic, not to scale. Routes rotate through the five towns." })}
    <div>
      <h2 class="t-block" style="margin-bottom:14px">Pick your town for local notes and zips</h2>
      <p class="body-lg" style="margin-bottom:22px">Each town page lists the zip codes we cover and what we tend to find in that town&#8217;s homes. Or skip ahead &#8212; the booking flow asks for your town and zip anyway, and tells you straight away if you are outside the five.</p>
      ${bookBtn(`Book My Visit · $${prices.standard.amount}`)}
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap section">
    <h2 class="t-section t-section--sm mb-3">Five towns</h2>
    <div class="grid grid-cards grid-cards--270">
      ${join(
        towns,
        (t) => `
      <a href="${routes.area(t.slug)}" class="town-card blueprint card--lift">
        ${corners()}
        <span class="duotone"><img src="/img/cities/${t.image}" alt="${attr(t.imageAlt)}" loading="lazy" width="1200" height="900"></span>
        <span class="town-card-body">
          <span class="name">${esc(t.name)}, CO</span>
          <span class="zips">${t.zips.join(" &#183; ")}</span>
          <span class="more">See ${esc(t.name)} page &#8594;</span>
        </span>
      </a>`,
      )}
    </div>
  </div>
</section>

${ctaBand({
  title: "Not sure we cover your street?",
  lede: "Start the flow and enter your zip — it tells you straight away, and shows the price either way.",
})}`;

  return page({
    path: routes.areas,
    title: "Service areas — five Boulder County towns",
    description: "Dryer vent cleaning in Boulder, Louisville, Lafayette, Longmont, and Superior, Colorado. Zip codes covered, flat published pricing, one town at a time.",
    current: "areas",
    body,
  });
}

export function townPage(t) {
  const body = `
<section class="bg-sand bb">
  <div class="wrap section--hero grid grid-2 center" style="padding-top:clamp(36px,5vw,72px);padding-bottom:clamp(36px,5vw,72px)">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${routes.home}">Home</a><span>/</span>
        <a href="${routes.areas}">Areas</a><span>/</span>
        <span class="here">${esc(t.name)}</span>
      </nav>
      <h1 class="t-page t-page--sm">Dryer Vent Cleaning in ${esc(t.name)}, CO</h1>
      <p class="lede lede--tight" style="margin-top:16px">${esc(t.blurb)}</p>
      <p class="muted" style="margin:14px 0 0;font-size:16px;font-variant-numeric:tabular-nums">Zip codes covered: ${t.zips.join(" &#183; ")}</p>
      <div class="actions" style="margin-top:26px">
        ${bookBtn("Request a visit")}
        <a href="${site.phoneHref}" class="btn btn-outline-ink btn--phone">Call ${site.phoneDisplay}</a>
      </div>
      <p class="muted" style="margin:14px 0 0;font-size:16px">${esc(waitHonest)}</p>
      <p class="muted" style="margin:8px 0 0;font-size:16px;font-variant-numeric:tabular-nums">${priceProof}</p>
    </div>
    <figure class="blueprint">
      ${corners()}
      <span class="fig-img ar-4-3"><img src="/img/cities/${t.image}" alt="${attr(t.imageAlt)}" width="1200" height="900"></span>
      <figcaption class="cap" style="font-size:13px;padding:9px 12px">${esc(t.imageCaption)}</figcaption>
    </figure>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--md grid grid-2--280 grid start">
    <div>
      <h2 class="t-block" style="margin-bottom:14px">What we see in ${esc(t.name)} homes</h2>
      <p class="body-lg" style="margin-bottom:12px">${esc(t.local1)}</p>
      <p class="body-lg">${esc(t.local2)}</p>
      ${lafayetteNearby(t)}
    </div>
    <div style="display:grid;gap:12px">
      ${join(
        compactPrices,
        (p) => `<div class="blueprint price-row">${corners()}<b>${p.price}</b><span class="price-row-text"><span>${esc(p.title)}</span><span>${esc(p.note)}</span></span><a href="${routes.book}" class="btn btn--sm btn-ember">Book</a></div>`,
      )}
      <a href="${routes.pricing}" class="link-arrow link-arrow--sm">What qualifies as difficult &#8594;</a>
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap section--md grid grid-2 center">
    <div>
      <h2 class="t-block" style="margin-bottom:14px">Reviews from ${esc(t.name)}</h2>
      <p class="body-lg">None yet &#8212; we publish reviews only when ${esc(t.name)} customers write them, unedited. Had a visit? <a href="${routes.contact}">Send yours</a> and say it is a review.</p>
    </div>
    <div class="blueprint card">
      ${corners()}
      <h3 style="margin:0 0 8px;font-size:23px;text-transform:uppercase;color:var(--ink)">What every ${esc(t.name)} visit includes</h3>
      <p class="card-body">Full duct run rotary-brushed and vacuumed, hood and flapper cleaned, airflow metered before and after, and photos of the duct emailed the same day. <a href="${routes.service}">The full service, step by step &#8594;</a></p>
    </div>
  </div>
</section>

<section class="bg-ink cta-band">
  <div class="wrap" style="padding-top:clamp(44px,6vw,88px);padding-bottom:clamp(44px,6vw,88px)">
    <div>
      <h2 class="t-cta t-cta--xs">Book a ${esc(t.name)} visit</h2>
      <p class="lede-light">${esc(waitHonest)}</p>
      <p class="lede-light" style="margin-top:10px;font-size:16px;font-variant-numeric:tabular-nums">${priceProof}</p>
    </div>
    <div class="actions">
      ${bookBtn("Request a visit", "btn btn--lg btn-ember blueprint")}
      <a href="${site.phoneHref}" class="btn btn--lg btn-outline-light btn--phone">Call ${site.phoneDisplay}</a>
    </div>
  </div>
</section>`;

  return page({
    path: routes.area(t.slug),
    title: `Dryer vent cleaning in ${t.name}, CO`,
    description: `Fixed-price dryer vent cleaning in ${t.name}, Colorado (${t.zips.join(", ")}). $${prices.standard.amount} standard, $${prices.difficult.amount} for roof or long runs — published before you book, photos after every visit.`,
    current: "areas",
    body,
    image: `/img/cities/${t.image}`,
  });
}

// Legacy SEO alias (/boulder-co-dryer-vent-cleaning/) → canonical town page.
export function townRedirect(t) {
  const target = `${site.url}${routes.area(t.slug)}`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Dryer vent cleaning in ${esc(t.name)}, CO</title>
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex">
</head><body><p>Moved to <a href="${target}">${target}</a>.</p></body></html>`;
}
