import { site, routes, towns, trust, homeSteps, priceCards, routeFillNote, prices, launchSpecial } from "../data/site.mjs";
import { esc, corners, join, icons, checkList } from "../lib/html.mjs";
import { page, bookBtn } from "../templates/layout.mjs";
import { postCard } from "./blog.mjs";

export function priceCardHtml(p, { home = false } = {}) {
  return `
<div class="price-card blueprint card--lift${home ? "" : " price-card--lg"}">
  ${corners()}
  <div class="price-head">
    <span class="price-kicker">${esc(p.kicker)}</span>
    ${p.tag ? `<span class="badge">${esc(p.tag === true ? "Best value" : p.tag)}</span>` : ""}
  </div>
  <div class="price-amount"><b>${esc(p.price)}</b><span>${esc(p.unit)}</span></div>
  ${p.compare ? `<p class="price-was">${esc(p.compare)}</p>` : ""}
  <h3 class="price-title">${esc(p.title)}</h3>
  <p class="price-body">${esc(home ? p.homeBody : p.body)}</p>
  ${home ? "" : '<span class="qualifies">What qualifies</span>'}
  ${checkList(home ? p.homeBullets : p.bullets)}
  <a href="${routes.book}" class="price-cta">${esc(p.cta)}</a>
</div>`;
}

export function mapFigure({ caption = "" } = {}) {
  return `
<figure class="blueprint map-fig">
  ${corners()}
  <div class="map-area">
    <span class="map-bounds"></span>
    <span class="map-label">Boulder County &#183; service boundary</span>
    ${join(
      towns,
      (t) => `<a href="${routes.area(t.slug)}" class="pin" style="left:${t.map.x}%;top:${t.map.y}%"><i></i><span>${esc(t.name)}</span></a>`,
    )}
  </div>
  ${caption ? `<figcaption class="cap">${esc(caption)}</figcaption>` : ""}
</figure>`;
}

export function homePage(posts) {
  const body = `
<p class="launch-banner">${esc(launchSpecial.banner)}</p>
<section class="hero">
  <img class="hero-img" src="/img/hero-exterior.jpg" alt="Technician cleaning an exterior dryer vent on a Boulder-area home" fetchpriority="high">
  <div class="hero-shade"></div>
  <div class="wrap">
    <div class="hero-copy">
      <div class="eyebrow"><i></i>Boulder County, Colorado</div>
      <h1 class="t-hero">Dryer Vent Cleaning in Boulder County</h1>
      ${icons.wave()}
      <p class="hero-lede">The price is published, so there is nothing to quote. Answer two questions, request a time, we clean the full duct run, you get photos of what came out. That is the whole transaction.</p>
      <div class="actions hero-actions">
        ${bookBtn(`Book My Visit · $${prices.standard.amount}`, "btn btn-ember blueprint")}
        <a href="${site.phoneHref}" class="btn btn-outline-light btn--phone">${site.phoneDisplay}</a>
      </div>
      <p class="hero-fine">Launch special &#183; normally $${prices.standard.normally} &#183; through ${esc(launchSpecial.through)}</p>
    </div>
    <div class="blueprint price-tag">
      ${corners()}
      <small>Launch special, standard clean</small>
      <span class="baseline"><b>$${prices.standard.amount}</b><span class="unit">flat, one dryer</span></span>
      <span class="price-was">Normally $${prices.standard.normally}</span>
    </div>
  </div>
</section>

<section class="bg-sand bb">
  <div class="wrap trust">
    ${join(
      trust,
      (t) => `<div class="trust-item"><i><svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="${t.icon}" stroke="#E8632B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></i><span>${esc(t.label)}</span></div>`,
    )}
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--xl">
    <p class="kicker">What we do</p>
    <div class="grid grid-2 grid-2--tight start">
      <h2 class="t-section">One dryer vent, cleaned end to end. Booked in about a minute.</h2>
      <p class="body-lg">We rotary-brush and vacuum the full duct run from the dryer connection to the exterior termination, check the hood and flapper, and photograph the line before and after. The price comes from two quick questions about your home &#8212; on screen, not after a sales visit.</p>
    </div>
    <div class="grid grid-3 mt-5">
      ${join(
        homeSteps,
        (s) => `<div class="blueprint card">${corners()}<span class="num">${s.n}</span><h3 class="t-card">${esc(s.title)}</h3><p class="card-body">${esc(s.body)}</p></div>`,
      )}
    </div>
    <div style="display:flex;justify-content:center" class="mt-4">
      ${bookBtn("Start with step one")}
    </div>
  </div>
</section>

<section class="bg-sand bt bb">
  <div class="wrap section--xl">
    <div class="row-between">
      <div>
        <p class="kicker">Published prices</p>
        <h2 class="t-section">The price is the price</h2>
      </div>
      <a href="${routes.pricing}" class="link-arrow">What qualifies &#8594;</a>
    </div>
    <div class="grid grid-cards mt-4">
      ${join(priceCards, (p) => priceCardHtml(p, { home: true }))}
    </div>
    <p class="note">${esc(routeFillNote)}</p>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--xl">
    <div class="grid grid-2--wide grid center">
      <div>
        <p class="kicker">Why lint matters</p>
        <h2 class="t-section" style="margin-bottom:16px">Drag the line. That is years of laundry.</h2>
        <p class="body-lg">A packed duct makes the dryer run hot and long. Clothes come out damp, cycles double, and the lint sitting against the heat is the reason dryers are one of the most common causes of household fires.</p>
        <p class="body-lg" style="margin-bottom:22px">Cleared, the air moves the way the manufacturer intended. Same dryer, half the cycle.</p>
        <a href="${routes.book}" class="btn btn--md btn-ember">Book My Visit &#183; $${prices.standard.amount}</a>
      </div>
      <figure class="blueprint" data-reveal>
        ${corners()}
        <div class="reveal">
          <img src="/img/vent-clear.jpg" alt="A clear dryer vent after cleaning" loading="lazy">
          <img class="before" src="/img/lint-closeup.jpg" alt="A dryer vent packed with lint before cleaning" loading="lazy">
          <span class="reveal-label l">Before</span>
          <span class="reveal-label r">After</span>
          <span class="reveal-line"></span>
          <input type="range" min="4" max="96" value="52" aria-label="Reveal the duct before and after cleaning">
          <span class="reveal-knob">${icons.drag()}</span>
        </div>
        <figcaption class="cap">Same kind of duct, one visit apart. Every job is photographed like this and sent to you.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section id="reviews" class="bg-ink">
  <div class="wrap section--xl">
    <div class="row-between">
      <div>
        <p class="kicker kicker--light">Reviews</p>
        <h2 class="t-section on-ink">Reviews come from customers, not from us</h2>
      </div>
    </div>
    <div class="grid grid-cards grid-cards--270 mt-4">
      <div class="blueprint on-dark review-card">
        ${corners()}
        <p>This page stays blank until real customers write in. We will not seed it with marketing copy or borrowed testimonials.</p>
        <div class="who"><i>1</i><span><b>Unedited</b><small>What customers send is what appears</small></span></div>
      </div>
      <div class="blueprint on-dark review-card">
        ${corners()}
        <p>Every visit ends with before-and-after photos and two airflow readings in your inbox. That is the evidence we would rather you judge us on.</p>
        <div class="who"><i>2</i><span><b>Photo-documented</b><small>Same-day, every job</small></span></div>
      </div>
      <div class="blueprint on-dark review-card">
        ${corners()}
        <p>Had a visit? Send the unvarnished version through the contact page and say it is a review. It goes up as written.</p>
        <div class="who"><a href="${routes.reviews}" class="link-arrow" style="color:#fff">Read more about reviews &#8594;</a></div>
      </div>
    </div>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--xl">
    <p class="kicker">Service area</p>
    <h2 class="t-section max-22 mb-3">Five towns, one route sheet</h2>
    <div class="grid grid-2 center">
      ${mapFigure()}
      <div>
        <p class="body-lg" style="margin-bottom:20px">We run Boulder County only, one town at a time. That is why the price is flat and why we ask a couple of questions before confirming a time &#8212; we are fitting you onto a route, not driving out for an estimate.</p>
        <div class="town-chips">
          ${join(
            towns,
            (t) => `<a href="${routes.area(t.slug)}" class="blueprint town-chip">${corners()}<b>${esc(t.name)}</b><small>${t.zips.join(" &#183; ")}</small></a>`,
          )}
        </div>
        <a href="${routes.areas}" class="link-arrow" style="margin-top:18px">All service areas &#8594;</a>
      </div>
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap section--xl">
    <div class="row-between">
      <h2 class="t-section">From the blog</h2>
      <a href="${routes.blog}" class="link-arrow">All posts &#8594;</a>
    </div>
    <div class="grid grid-cards grid-cards--270 mt-3">
      ${join(posts.slice(0, 3), (p) => postCard(p, { excerpt: false }))}
    </div>
  </div>
</section>

<section class="bg-ink cta-band">
  <div class="wrap">
    <div>
      <h2 class="t-cta">See the price. See if we have a time.</h2>
      <p class="lede-light">Two questions, then your published price and a request for the days that work. If we cannot fit you soon, we will tell you that too.</p>
    </div>
    <div class="actions">
      ${bookBtn("Book My Visit", "btn btn--lg btn-ember blueprint")}
      <a href="${site.phoneHref}" class="btn btn--lg btn-outline-light btn--phone">${site.phoneDisplay}</a>
    </div>
  </div>
</section>`;

  return page({
    path: routes.home,
    title: `${site.name} — Dryer Vent Cleaning in Boulder County`,
    rawTitle: true,
    description: site.description,
    current: "home",
    body,
  });
}
