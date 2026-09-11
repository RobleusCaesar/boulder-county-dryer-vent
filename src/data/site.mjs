// Single source of truth for business facts. Every page reads from here —
// change a price, phone, or address once and the whole site follows.

export const site = {
  name: "Boulder County Dryer Vent",
  url: "https://bouldercountydryervent.com",
  description:
    "Fixed-price dryer vent cleaning in Boulder County, Colorado. Published prices, no estimate visit, before-and-after photos of every duct. Boulder, Louisville, Lafayette, Longmont, and Superior.",
  phoneDisplay: "(866) 494-6590",
  phoneHref: "tel:+18664946590",
  phoneE164: "+1-866-494-6590",
  email: "info@frostrivercapital.com",
  hours: "Weekdays 8am–5pm · Saturday by route",
  hoursSchema: ["Mo-Fr 08:00-17:00"],
  // Customer-facing NAP (footer, contact, LocalBusiness schema).
  address: {
    street: "6395 Gunpark Dr, Suite J",
    city: "Boulder",
    region: "CO",
    postal: "80301",
    country: "US",
  },
  addressLine: "6395 Gunpark Dr, Suite J, Boulder, CO 80301",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=6395+Gunpark+Dr+Suite+J+Boulder+CO+80301",
  // Legal entity — terms, privacy, notices only.
  legalName: "Frost River Capital, LLC d/b/a Boulder County Dryer Vent",
  tradeNameId: "20268139028",
  noticesAddress: "2369 S. Trenton Way Suite P, Denver, CO 80231",
  noticesEmail: "info@frostrivercapital.com",
  cancelPolicy:
    "Cancel 24 hours or more before the visit for a refund. Cancel less than 24 hours before the visit and the amount is credited for 90 days.",
  legalUpdated: "September 11, 2026",
  copyrightYear: 2026,
};

// Where booking requests and contact messages go.
// Leave `endpoint` empty and the forms compose an email to `site.email` from the
// visitor's device. Set it to a form-service URL (e.g. Formspree) to POST instead.
export const forms = {
  endpoint: "",
};

// First-party hit collector (Ava). Empty endpoint = beacon disabled on every page.
// PUBLIC_URL + "/hit". Rotate this if the Cloudflare quick tunnel hostname changes.
export const analytics = {
  /** First-party collector POST URL. Empty = beacon disabled. */
  endpoint: "https://exact-segments-mentioned-previously.trycloudflare.com/hit",
};

export const routes = {
  home: "/",
  service: "/dryer-vent-cleaning/",
  pricing: "/pricing/",
  book: "/book/",
  areas: "/areas/",
  area: (slug) => `/areas/${slug}/`,
  seoArea: (seoSlug) => `/${seoSlug}/`,
  blog: "/blog/",
  post: (slug) => `/blog/${slug}/`,
  reviews: "/reviews/",
  about: "/about/",
  contact: "/contact/",
  terms: "/legal/terms/",
  privacy: "/legal/privacy/",
  credits: "/credits/",
};

export const nav = [
  { id: "service", label: "Service", href: routes.service },
  { id: "pricing", label: "Pricing", href: routes.pricing },
  { id: "areas", label: "Areas", href: routes.areas },
  { id: "blog", label: "Blog", href: routes.blog },
  { id: "reviews", label: "Reviews", href: routes.reviews },
  { id: "about", label: "About", href: routes.about },
];

export const prices = {
  standard: { amount: 129, label: "Standard clean" },
  difficult: { amount: 169, label: "Difficult clean" },
  annual: { amount: 109, label: "Annual plan" },
};

// Published price cards (home + pricing page).
export const priceCards = [
  {
    id: "standard",
    kicker: "Standard",
    price: "$129",
    unit: "flat",
    title: "Standard clean",
    homeBody: "The common case: a ground-floor laundry room with a side-wall termination.",
    body: "The common case, and most of the homes we visit.",
    homeBullets: ["Full duct run brushed and vacuumed", "Hood and flapper checked", "Before and after photos"],
    bullets: [
      "One dryer, one duct run",
      "Termination on a ground-floor side wall",
      "Duct run under roughly 15 feet",
      "Reachable without ladder work",
    ],
    tag: false,
    cta: "Book at $129",
  },
  {
    id: "difficult",
    kicker: "Difficult",
    price: "$169",
    unit: "flat",
    title: "Difficult clean",
    homeBody: "Roof terminations, long runs, and laundry rooms on an upper floor or interior wall.",
    body: "Same clean, more access. You know before you book, not after.",
    homeBullets: ["Everything in the standard clean", "Roof or second-story access", "Extra rods for runs over 15 feet"],
    bullets: [
      "Roof or second-story termination",
      "Runs over roughly 15 feet",
      "Interior laundry rooms with bends",
      "Crawlspace or attic sections",
    ],
    tag: false,
    cta: "Book at $169",
  },
  {
    id: "annual",
    kicker: "Annual plan",
    price: "$109",
    unit: "per year",
    title: "Annual plan",
    homeBody: "After your first visit: the same clean, the same month each year. We remind you; you never think about it again.",
    body: "After your first visit: the standard clean at $20 off, on the same month every year.",
    homeBullets: ["$20 off every visit, locked", "Priority slot on the route sheet", "Cancel any year, no fee"],
    bullets: [
      "$20 off the published price, locked in",
      "Priority slot on the route sheet",
      "A reminder a week ahead to confirm",
      "Cancel any year, no fee",
    ],
    tag: true,
    cta: "Ask about the plan",
  },
];

export const routeFillNote =
  "Route-fill note: these are the published prices for a scheduled visit on a day we are already working your town. Same-day and single-stop trips are quoted on the phone.";

export const towns = [
  {
    slug: "boulder-co",
    seoSlug: "boulder-co-dryer-vent-cleaning",
    name: "Boulder",
    zips: ["80301", "80302", "80303", "80304", "80305", "80310"],
    blurb:
      "Older University Hill bungalows, north Boulder ranches, and south Boulder two-stories all share the same problem: lint that never makes it out of a long, bent run.",
    local1:
      "Many Boulder homes vent through a crawl, a low roof, or a second-story termination tucked behind a deck. We price that work up front instead of discovering it on the ladder.",
    local2: "We serve the city of Boulder and the nearby unincorporated pockets we can reach on the same route.",
    image: "boulder.jpg",
    imageAlt: "Flatirons at sunrise from Chautauqua in Boulder, Colorado",
    imageCaption: "Flatirons from Chautauqua — local Boulder scenery, not a job photo.",
    map: { x: 30, y: 46 },
  },
  {
    slug: "louisville-co",
    seoSlug: "louisville-co-dryer-vent-cleaning",
    name: "Louisville",
    zips: ["80027"],
    blurb:
      "Louisville’s mix of 1970s ranches and newer two-stories is a good fit for a fixed-price visit. Most terminations are reachable without a surprise add-on.",
    local1:
      "If your dryer is in a basement and the cap is high on the rear wall or roof, the flow quotes the difficult rate before you book — not at the door.",
    local2: "Downtown Louisville, Cottonwood, and the neighborhoods west of McCaslin are all in-area.",
    image: "louisville.jpg",
    imageAlt: "Jacoe Store on Main Street in historic downtown Louisville, Colorado",
    imageCaption: "Historic Main Street, Louisville — local scenery, not a job photo.",
    map: { x: 56, y: 72 },
  },
  {
    slug: "lafayette-co",
    seoSlug: "lafayette-co-dryer-vent-cleaning",
    name: "Lafayette",
    zips: ["80026"],
    blurb:
      "From Old Town Lafayette to the newer streets east of Public Road, we clean residential dryer vents on a published price — not a range that moves after we arrive.",
    local1:
      "Townhomes with shared side yards and HOA rules are fine. We work from the home’s dryer, not from a roof we weren’t invited onto.",
    local2: "If your HOA needs a certificate of insurance on file, say so in your booking notes.",
    image: "lafayette.jpg",
    imageAlt: "Looking east on E Simpson Street in Lafayette, Colorado",
    imageCaption: "E Simpson Street, Lafayette — local streetscape, not a job photo.",
    map: { x: 70, y: 58 },
  },
  {
    slug: "longmont-co",
    seoSlug: "longmont-co-dryer-vent-cleaning",
    name: "Longmont",
    zips: ["80501", "80503", "80504"],
    blurb:
      "Longmont is a longer drive from the rest of the county, so we batch these visits. That is why the calendar is honest: if we do not have a Longmont day open, we say so.",
    local1:
      "West Longmont two-stories and east-side ranches both book the same way. Stories and roof access set the price, not the ZIP.",
    local2: "Hover and Hygiene-adjacent addresses are reviewed when you request a time.",
    image: "longmont.jpg",
    imageAlt: "Main Street in downtown Longmont, Colorado",
    imageCaption: "Downtown Longmont Main Street — local scenery, not a job photo.",
    map: { x: 62, y: 20 },
  },
  {
    slug: "superior-co",
    seoSlug: "superior-co-dryer-vent-cleaning",
    name: "Superior",
    zips: ["80027"],
    blurb:
      "Superior’s planned streets make routing simple. If we already have a day in Louisville or Boulder, a Superior stop is often the efficient next job.",
    local1:
      "Most homes here are two-story with rooftop or high-wall caps. Expect the $169 visit unless you have a ground-level termination.",
    local2: "Rock Creek and the original Superior townsite are both in-area.",
    image: "superior.jpg",
    imageAlt: "Overlook of the Rock Creek subdivision in Superior, Colorado",
    imageCaption: "Rock Creek overlook, Superior — local scenery, not a job photo.",
    map: { x: 34, y: 84 },
  },
];

export const inAreaZips = [...new Set(towns.flatMap((t) => t.zips))];

export const homeSteps = [
  {
    n: "1",
    title: "Eligibility",
    body: "Two taps about where the vent exits and how far the dryer sits from it. No address needed yet.",
  },
  {
    n: "2",
    title: "Price",
    body: "The published number appears on screen — standard or difficult. Nothing is hidden until a visit.",
  },
  {
    n: "3",
    title: "Times",
    body: "Tell us your town and the days that work. We confirm a two-hour window by text or email. No card to hold it.",
  },
];

export const trust = [
  {
    label: "Clear pricing",
    icon: "M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM12.2 7.6a2 2 0 0 0-1.8-1.1H9.4a1.9 1.9 0 0 0-.4 3.75l2 .5a1.9 1.9 0 0 1-.4 3.75H9.6a2 2 0 0 1-1.8-1.1M10 5.2v9.6",
  },
  { label: "No estimate visit", icon: "M17.3 9.2V10a7.5 7.5 0 1 1-4.45-6.85M18 4.5L10 12.5l-2.3-2.3" },
  {
    label: "Photo-documented service",
    icon: "M5.4 6.5l1-1.6a1.3 1.3 0 0 1 1.1-.6h5a1.3 1.3 0 0 1 1.1.6l1 1.6h1.6a1.7 1.7 0 0 1 1.7 1.7v6.2a1.7 1.7 0 0 1-1.7 1.7H3.8a1.7 1.7 0 0 1-1.7-1.7V8.2a1.7 1.7 0 0 1 1.7-1.7zM10 13.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z",
  },
];

export const serviceSteps = [
  {
    n: "1",
    title: "We text on the way",
    body: "You get a message with the tech’s name and a two-hour window the morning of, and another when we leave the previous stop. No all-day waiting.",
  },
  {
    n: "2",
    title: "Airflow reading, before",
    body: "We meter the airflow at the termination and note it down. It is the number we compare against when the work is done.",
  },
  {
    n: "3",
    title: "Rotary brush, full run",
    body: "A flexible rod and brush are driven the length of the duct from both ends while the vacuum runs at the opening. Every foot of the run gets touched.",
  },
  {
    n: "4",
    title: "Hood, flapper, connection",
    body: "The exterior hood comes off and gets cleaned by hand. We check the flapper swings freely and reseat the dryer connection with a proper clamp if the old one is slipping.",
  },
  {
    n: "5",
    title: "Photos and the second reading",
    body: "A photo of the duct before, a photo after, the two airflow numbers, and anything we noticed — emailed the same day. Then we are out of your laundry room.",
  },
];

export const serviceIncluded = [
  "Full duct run rotary-brushed and vacuumed, both directions",
  "Exterior hood removed, cleaned by hand, and refitted",
  "Flapper checked for free swing and seal",
  "Dryer connection reclamped if the existing clamp is loose",
  "Airflow metered before and after the clean",
  "Lint removed from the site — nothing left in a bag by the door",
  "Before-and-after photos emailed the same day",
];

export const serviceWarnings = [
  "A load takes two cycles to dry",
  "The top of the dryer is hot to the touch",
  "The laundry room smells warm or damp after a load",
  "No lint at all coming out of the exterior hood",
  "More than a year since the last clean",
  "You just moved in and have no record of one",
];

export const serviceFaqs = [
  { q: "How long does it take?", a: "About an hour for a standard clean, closer to ninety minutes for roof access." },
  {
    q: "Do you need to get inside?",
    a: "Yes, briefly — we work the duct from the dryer end and the exterior end. We pull the dryer out and put it back where it was.",
  },
  {
    q: "Will it be messy?",
    a: "The vacuum runs the whole time at the open end. We lay a mat under the connection and take the lint with us.",
  },
  {
    q: "What if the duct is damaged?",
    a: "We photograph it and tell you what it needs. We do not sell duct replacement, so there is nothing in it for us either way.",
  },
  { q: "How often should this happen?", a: "Once a year for most homes. Twice if you run a large household or the run is long." },
  { q: "Do you clean the lint trap housing?", a: "Yes, that is part of the standard clean, along with the hose behind the dryer." },
  {
    q: "Can I be out of the house?",
    a: "Only if we can reach both ends. Most customers stay for the hour; it is your laundry room.",
  },
];

export const pricingRules = [
  { q: "Ground-floor side wall", a: "Standard. We work from outside and inside at floor level, no ladder." },
  { q: "Roof termination", a: "Difficult. Ladder setup, roof safety, and a longer rod run add about forty minutes." },
  { q: "Long or bending runs", a: "Difficult once the run passes roughly 15 feet or turns more than twice." },
  {
    q: "Not sure which you have",
    a: "Book the standard clean. If we find roof access or a long run we tell you before starting — you can still walk away with nothing owed.",
  },
];

export const planBullets = [
  "One full clean a year, same month",
  "$20 off the published price, locked",
  "Photos and airflow reading every visit",
  "First pick of route slots before public booking",
];

export const pricingFaqs = [
  { q: "Is there a trip or fuel charge?", a: "No. The published price is the whole price for a scheduled visit in our five towns." },
  {
    q: "What if my home turns out to be difficult?",
    a: "We tell you before any work starts. You either approve $169 or send us on our way — nothing owed either way.",
  },
  {
    q: "How do I pay?",
    a: "Nothing is charged to hold a time. You pay after the visit — by card link or invoice, or on site.",
  },
  {
    q: "Do you clean HVAC ducts too?",
    a: "No. Dryer vents only — it is the one thing we do, and it is why the price can be flat.",
  },
  { q: "Is the annual plan a contract?", a: "No. It renews yearly after your first visit, and you can cancel any year with an email." },
  {
    q: "What about same-day service?",
    a: "Call us. Same-day and single-stop trips sit outside the route sheet, so they are quoted on the phone.",
  },
];

export const aboutValues = [
  {
    n: "1",
    title: "One service only",
    body: "Dryer vents. No HVAC, no chimneys, no air-quality add-ons. When you do one job all day you know exactly how long it takes, which is the whole reason a flat price is possible.",
  },
  {
    n: "2",
    title: "Routes, not dispatch",
    body: "We work one town at a time. You are a stop on a street we are already on, so there is no drive time hidden in your invoice and no incentive to upsell to cover the trip.",
  },
  {
    n: "3",
    title: "Photos every visit",
    body: "Before, after, and the two airflow readings, emailed the same day. If we did not improve anything you will see that as clearly as we do.",
  },
];

// Booking flow copy and logic (mirrored in static/js/book.js).
export const booking = {
  exitOptions: [
    { id: "side", label: "Side wall, ground floor", hint: "The hood is at waist height outside" },
    { id: "roof", label: "Roof or second story", hint: "Ladder work — priced as difficult" },
    { id: "unsure", label: "Not sure", hint: "We will confirm on site at the standard rate" },
  ],
  runOptions: [
    { id: "near", label: "Under 15 feet", hint: "Dryer sits on an exterior wall" },
    { id: "far", label: "More than 15 feet", hint: "Interior laundry room or a long duct run" },
    { id: "unsure", label: "Not sure", hint: "Most homes are under 15 feet" },
  ],
  included: [
    "Full duct run rotary-brushed and vacuumed",
    "Exterior hood and flapper cleaned and checked",
    "Airflow measured before and after",
    "Photos of the duct emailed the same day",
  ],
  emptyCalendarTitle: "No times open yet — join waitlist / leave contact",
};
