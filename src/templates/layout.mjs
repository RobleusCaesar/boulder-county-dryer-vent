import { site, nav, routes, towns, forms, analytics, prices, inAreaZips } from "../data/site.mjs";
import { esc, attr, corners, join, icons } from "../lib/html.mjs";

const bookBtn = (label = "Book My Visit", cls = "btn btn-ember blueprint") =>
  `<a href="${routes.book}" class="${cls}" data-book-cta>${corners()}${esc(label)}</a>`;

export function header(current = "") {
  const links = (cls) =>
    join(
      nav,
      (it) =>
        `<a href="${it.href}" class="${cls}"${it.id === current ? ' aria-current="page"' : ""}>${esc(it.label)}</a>`,
    );
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a href="${routes.home}" class="brand" aria-label="${attr(site.name)} — home">
      <span class="brand-mark">${icons.mark()}</span>
      <span class="brand-text"><small>Boulder County</small><span>Dryer Vent</span></span>
    </a>
    <nav class="nav-desktop" aria-label="Primary">${links("nav-link")}</nav>
    <a href="${site.phoneHref}" class="header-phone">${site.phoneDisplay}</a>
    ${bookBtn("Book My Visit", "btn btn-ember blueprint header-book")}
    <button type="button" class="menu-btn" data-menu-open aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="menu-overlay" id="menu" data-menu aria-hidden="true" role="dialog" aria-label="Menu">
  <div class="menu-top"><span>Menu</span><button type="button" class="menu-close" data-menu-close aria-label="Close menu">&#215;</button></div>
  <nav class="menu-links" aria-label="Mobile">${links("")}<a href="${routes.contact}">Contact</a></nav>
  <div class="menu-actions">
    <a href="${routes.book}" class="btn btn-ember" data-book-cta>Book My Visit</a>
    <a href="${site.phoneHref}" class="btn btn-outline-light btn--phone">Call ${site.phoneDisplay}</a>
  </div>
</div>`;
}

export function mobileBar() {
  return `
<div class="mobile-bar" aria-label="Quick actions">
  <a href="${site.phoneHref}" class="call">Call</a>
  <a href="${routes.book}" class="book" data-book-cta>Book My Visit</a>
</div>`;
}

export function footer() {
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-col footer-about">
      <span class="footer-brand"><small>Boulder County</small><span>Dryer Vent</span></span>
      <p>Published prices, no estimate visit, and photos of the duct before and after. One dryer vent done properly, by your neighbors in Boulder County.</p>
      <svg viewBox="0 0 180 20" width="180" height="20" fill="none" aria-hidden="true" style="overflow:visible"><path d="M2 15C34 15 44 4 78 4c30 0 38 11 68 11 14 0 24-4 32-8" stroke="#E8632B" stroke-width="1.6" stroke-linecap="round"></path></svg>
    </div>
    <div class="footer-col">
      <h6>Visit</h6>
      <a href="${routes.home}">Home</a>
      <a href="${routes.service}">The service</a>
      <a href="${routes.pricing}">Pricing</a>
      <a href="${routes.blog}">Blog</a>
      <a href="${routes.reviews}">Reviews</a>
      <a href="${routes.about}">About</a>
      <a href="${routes.contact}">Contact</a>
      <a href="${routes.book}">Book a time</a>
    </div>
    <div class="footer-col">
      <h6>Areas</h6>
      ${join(towns, (t) => `<a href="${routes.area(t.slug)}">${esc(t.name)}, CO</a>`)}
      <a href="${routes.areas}">All service areas</a>
    </div>
    <div class="footer-col">
      <h6>Reach us</h6>
      <a href="${site.phoneHref}" class="footer-phone">${site.phoneDisplay}</a>
      <a href="mailto:${site.email}" style="word-break:break-word">${site.email}</a>
      <span>${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}</span>
      <span class="footer-dim">${esc(site.hours)}</span>
    </div>
  </div>
  <div class="footer-legal">
    <div class="wrap">
      <span>&#169; ${site.copyrightYear} ${esc(site.name)}</span>
      <a href="${routes.terms}">Terms</a>
      <a href="${routes.privacy}">Privacy</a>
      <a href="${routes.credits}">Credits</a>
    </div>
  </div>
</footer>`;
}

export function ctaBand({ title = "See the price. See if we have a time.", lede = "Three questions, then your published price and a request for the days that work. If we cannot fit you soon, we will tell you that too.", size = "t-cta--sm", phone = true } = {}) {
  return `
<section class="bg-ink cta-band">
  <div class="wrap">
    <div>
      <h2 class="t-cta ${size}">${esc(title)}</h2>
      ${lede ? `<p class="lede-light">${esc(lede)}</p>` : ""}
    </div>
    <div class="actions">
      ${bookBtn("Book My Visit", "btn btn--lg btn-ember blueprint")}
      ${phone ? `<a href="${site.phoneHref}" class="btn btn--lg btn-outline-light btn--phone">${site.phoneDisplay}</a>` : ""}
    </div>
  </div>
</section>`;
}

export function pageHero({ kicker, title, lede, size = "", cls = "section--hero", extra = "" }) {
  return `
<section class="bg-sand bb">
  <div class="wrap ${cls}">
    ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ""}
    <h1 class="t-page ${size}">${esc(title)}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ""}
    ${extra}
  </div>
</section>`;
}

function localBusinessJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    image: `${site.url}/img/hero-exterior.jpg`,
    description: site.description,
    priceRange: `$${prices.standard.amount}–$${prices.difficult.amount}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    areaServed: towns.map((t) => ({ "@type": "City", name: `${t.name}, CO` })),
    openingHours: site.hoursSchema,
    makesOffer: [
      { "@type": "Offer", name: prices.standard.label, price: String(prices.standard.amount), priceCurrency: "USD" },
      { "@type": "Offer", name: prices.difficult.label, price: String(prices.difficult.amount), priceCurrency: "USD" },
    ],
  });
}

/**
 * Full page shell.
 * @param {object} o
 * @param {string} o.path       canonical path, e.g. "/pricing/"
 * @param {string} o.title      <title> (site name appended unless o.rawTitle)
 * @param {string} o.description
 * @param {string} o.current    nav id to mark active
 * @param {string} o.body       page markup (between header and footer)
 * @param {boolean} o.bare      omit header/footer/mobile bar (booking flow has its own chrome)
 * @param {string} o.customHeader markup rendered before <main> when bare
 * @param {boolean} o.noBar     omit the mobile call/book bar
 * @param {string} o.image      OG image path
 * @param {string} o.jsonLd     extra JSON-LD
 * @param {string[]} o.scripts  extra script paths
 * @param {string} o.bodyClass
 */
export function page(o) {
  const title = o.rawTitle ? o.title : `${o.title} · ${site.name}`;
  const canonical = `${site.url}${o.path}`;
  const image = `${site.url}${o.image || "/img/hero-exterior.jpg"}`;
  const cfg = {
    email: site.email,
    phone: site.phoneDisplay,
    formEndpoint: forms.endpoint,
    analyticsEndpoint: analytics.endpoint,
    prices: { standard: prices.standard.amount, difficult: prices.difficult.amount, annual: prices.annual.amount },
    inAreaZips,
    slots: [],
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(o.description)}">
<link rel="canonical" href="${canonical}">
${o.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="${o.ogType || "website"}">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(o.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1F2A37">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/css/site.css">
<script type="application/ld+json">${localBusinessJsonLd()}</script>
${o.jsonLd ? `<script type="application/ld+json">${o.jsonLd}</script>` : ""}
<script>window.BCDV=${JSON.stringify(cfg)};</script>
</head>
<body${o.bodyClass || o.noBar ? ` class="${[o.bodyClass, o.noBar ? "no-bar" : ""].filter(Boolean).join(" ")}"` : ""}>
${o.bare ? (o.customHeader || "") : header(o.current)}
<main id="main" class="page">
${o.body}
</main>
${o.bare ? "" : footer()}
${o.bare || o.noBar ? "" : mobileBar()}
<script src="/js/site.js" defer></script>
${join(o.scripts || [], (s) => `<script src="${s}" defer></script>`)}
</body>
</html>`;
}

export { bookBtn };
