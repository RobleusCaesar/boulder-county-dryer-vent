// Single source of truth for business facts. Every page reads from here —
// change a price, phone, or address once and the whole site follows.

export const site = {
  name: "Boulder County Dryer Vent",
  url: "https://bouldercountydryervent.com",
  description:
    "Fixed-price dryer vent cleaning in Boulder County, Colorado. Published prices, no estimate visit, before-and-after photos of every duct. Boulder, Louisville, Lafayette, Longmont, Superior, Erie, and Broomfield.",
  phoneDisplay: "(720) 605-3198",
  phoneHref: "tel:+17206053198",
  phoneE164: "+1-720-605-3198",
  email: "ava@frostrivercapital.com",
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
  noticesEmail: "ava@frostrivercapital.com",
  cancelPolicy:
    "Cancel 24 hours or more before the visit for a refund. Cancel less than 24 hours before the visit and the amount is credited for 90 days.",
  legalUpdated: "September 23, 2026",
  copyrightYear: 2026,
  // Public BBB.org listing used as a quiet footer text link.
  bbbProfileUrl:
    "https://www.bbb.org/us/co/boulder/profile/dryer-vent-cleaning/boulder-county-dryer-vent-1296-1000201831",
};

// Where booking requests and contact messages go.
// Leave `endpoint` empty and the forms compose an email to `site.email` from the
// visitor's device. Set it to a form-service URL (e.g. Formspree) to POST instead.
export const forms = {
  endpoint: "https://api.bouldercountydryervent.com/book",
};

// First-party hit collector (Ava). Empty endpoint = beacon disabled on every page.
// Durable named tunnel: api.bouldercountydryervent.com/hit
export const analytics = {
  /** First-party collector POST URL. Empty = beacon disabled. */
  endpoint: "https://api.bouldercountydryervent.com/hit",
};

// Machine-readable booking (MCP). Same public ops host as book ingest (`/book`).
// Path is stable (`/mcp`) on the durable named tunnel hostname.
export const mcp = {
  path: "/mcp",
  url: "https://api.bouldercountydryervent.com/mcp",
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
  agents: "/agents/",
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
    price: `$${prices.standard.amount}`,
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
    cta: `Book at $${prices.standard.amount}`,
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

// Per-town page content. Every local fact below is checkable against the
// sources noted on each town page (Wikipedia town articles, USGS GNIS elevation
// as listed on Wikipedia, U.S. Census 2020). No invented stats, no job counts,
// no reviews. Prices, phone, and booking link come from the shared data above.
export const towns = [
  {
    slug: "boulder-co",
    seoSlug: "boulder-co-dryer-vent-cleaning",
    name: "Boulder",
    core: true,
    zips: ["80301", "80302", "80303", "80304", "80305", "80310"],
    blurb:
      "Boulder sits at the foot of the Flatirons at about 5,300 feet. Snow in winter and housing from many eras make the outdoor hood and the length of the duct the two things we check first.",
    paragraphs: [
      "Boulder was founded in late 1858 by gold prospectors who arrived at Boulder Canyon, and it was incorporated in 1871. It is the county seat and the home of the University of Colorado Boulder. A city that has been growing since 1858 has housing from many eras, and different eras route a dryer vent differently. That is the main reason we ask where your vent exits before we give you a price.",
      "A dryer in a basement or a middle-of-the-house laundry closet pushes air a long way before it reaches daylight. When the run is longer than about 15 feet, or the vent leaves through the roof or a second-story wall, it is the $169 difficult clean. You see that price in the booking flow before you pick a time. A dryer on an outside ground-floor wall with a short run is the $129 standard clean.",
      "The city sits near the base of the Rocky Mountain foothills, and snow can drift against a low side-wall hood and cover the louvers. If your dryer has started taking two cycles after a storm, check the hood first. Our guide to getting the vent ready for a Colorado winter walks through it.",
    ],
    facts: [
      ["Elevation", "About 5,300 feet above sea level"],
      ["Founded", "1858; incorporated 1871"],
      ["Population", "108,250 (2020 census)"],
      ["County", "Boulder County, and the county seat"],
      ["Our business address", "6395 Gunpark Dr, Suite J, Boulder, CO 80301"],
    ],
    nearby: ["louisville-co", "superior-co", "longmont-co"],
    image: "boulder.jpg",
    imageAlt: "The Flatirons rock formations above Boulder, Colorado, at sunrise",
    imageCaption: "The Flatirons from Chautauqua. Boulder scenery, not a job photo.",
    credit: {
      title: "Flatirons Sunrise",
      author: "Tyler Cipriani",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      url: "https://commons.wikimedia.org/wiki/File:Flatirons_Sunrise.jpg",
    },
    map: { x: 30, y: 46 },
  },
  {
    slug: "louisville-co",
    seoSlug: "louisville-co-dryer-vent-cleaning",
    name: "Louisville",
    core: true,
    zips: ["80027"],
    blurb:
      "Louisville grew up around coal mines in the 1870s and became a commuter suburb after the last mine closed in the 1950s. Houses from several eras sit side by side, and each era puts the dryer vent in a different place.",
    paragraphs: [
      "The town traces back to the Welch Mine in 1877. It was named for Louis Nawatny, who platted his land, and it was incorporated in 1882. About 30 different mines operated within today's town limits over the years, the last ones closed in the 1950s, and the town turned into a suburban community. Today it has about 21,000 residents and a historic downtown on Main Street, with Steinbaugh Pavilion hosting the summer Street Faire.",
      "Homes of different ages route the dryer vent differently. A laundry room in a basement or the middle of the house means a long run to the hood, and a laundry room on an outside ground-floor wall means a short one. The price follows the vent, not the street: $129 for a ground-level side-wall exit under about 15 feet, $169 for a roof, upper-floor, or long run.",
      "Louisville shares ZIP code 80027 with Superior, so pick your town in the booking form and we will route you correctly. US 36, the Denver-Boulder Turnpike, forms the southwestern edge of town, and Louisville borders Superior, so the two towns can share a route day.",
    ],
    facts: [
      ["Elevation", "About 5,400 feet above sea level"],
      ["Founded", "1877; incorporated 1882"],
      ["Population", "21,226 (2020 census)"],
      ["ZIP code", "80027 (shared with Superior)"],
      ["Town edge", "US 36 forms the southwestern border"],
    ],
    nearby: ["superior-co", "lafayette-co", "boulder-co"],
    image: "louisville.jpg",
    imageAlt: "Jacoe Store on Main Street in historic downtown Louisville, Colorado",
    imageCaption: "Jacoe Store on Main Street. Louisville scenery, not a job photo.",
    credit: {
      title: "Jacoe Store",
      author: "Jeffrey Beall",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      url: "https://commons.wikimedia.org/wiki/File:Jacoe_Store.JPG",
    },
    map: { x: 56, y: 72 },
  },
  {
    slug: "lafayette-co",
    seoSlug: "lafayette-co-dryer-vent-cleaning",
    name: "Lafayette",
    core: true,
    zips: ["80026"],
    blurb:
      "Lafayette was platted in 1888 by Mary E. Miller on land where coal was found in 1884. Old Town still has structures moved in from the mine camps, and the newer streets around it are a very different kind of house.",
    paragraphs: [
      "Mary Miller filed the original plat in January 1888 and sold the first lot that March. Coal had been discovered on the Miller farm in 1884, and the town grew around the mines. A few buildings moved from those camps still stand in Old Town, and the Lafayette History Museum keeps some of the mining tools. Festival Plaza, on Public Road at Chester Street, is the center of Old Town today.",
      "Lafayette has about 30,400 residents and roughly 12,500 housing units. US 287 runs through the center of town, and the city borders Louisville to the southwest, Broomfield to the east and south, and Erie to the north and east. Because it touches so many neighbors, a Lafayette visit can share a route day with a stop in any of them.",
      "Townhomes with shared walls and HOA rules are fine for us. We work from the dryer inside the home and the hood on the outside wall, and we do not go onto a roof we were not invited onto. If your HOA wants a certificate of insurance on file, say so in your booking notes. A ground-level side-wall exit is the $129 standard clean. A roof or upper-floor exit is $169.",
    ],
    facts: [
      ["Elevation", "About 5,300 feet above sea level"],
      ["Founded", "1888 by Mary E. Miller"],
      ["Population", "30,411 (2020 census)"],
      ["ZIP code", "80026"],
      ["Main road", "US 287, with I-25 exit 229 nearby"],
    ],
    nearby: ["louisville-co", "erie-co", "broomfield-co"],
    image: "lafayette.jpg",
    imageAlt: "Looking east on E Simpson Street in Lafayette, Colorado",
    imageCaption: "E Simpson Street. Lafayette streetscape, not a job photo.",
    credit: {
      title: "Lafayette, CO",
      author: "Jared Winkler",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      url: "https://commons.wikimedia.org/wiki/File:Lafayette,_CO.jpg",
    },
    map: { x: 70, y: 58 },
  },
  {
    slug: "longmont-co",
    seoSlug: "longmont-co-dryer-vent-cleaning",
    name: "Longmont",
    core: true,
    zips: ["80501", "80503", "80504"],
    blurb:
      "Longmont is the second-largest town on our list and the one farthest from the rest of the route. We batch Longmont visits by day, so we tell you plainly when a Longmont day is open.",
    paragraphs: [
      "The Chicago-Colorado Colony founded Longmont in 1871 as the first planned community in Boulder County, with its streets laid out in a grid inside one square mile. The town was incorporated in 1885 and is named for Longs Peak, which you can see from town. About 98,900 people live here, in roughly 41,700 housing units.",
      "A town this size has housing from every era, from the original grid near Main Street to newer subdivisions. In the mid-1990s the south edge of town became the site of Prospect New Town, the first New Urbanist project in Colorado. Wherever your house sits, the dryer vent has one job, and the length and exit point of that vent set your price, so we ask about both before quoting.",
      "The climate is cold and semi-arid, and Longmont sits at about 5,000 feet, a little lower than Boulder. Winter snow can still pile against a low hood, and a hood that does not open lets lint build up behind it. Because Longmont is a longer drive, we group visits by day, and the booking flow shows your published price either way. The city sits in both Boulder and Weld counties.",
    ],
    facts: [
      ["Elevation", "About 5,000 feet above sea level"],
      ["Founded", "1871; incorporated 1885"],
      ["Population", "98,885 (2020 census)"],
      ["Climate", "Cold semi-arid"],
      ["Counties", "Boulder and Weld"],
    ],
    nearby: ["boulder-co", "lafayette-co", "erie-co"],
    image: "longmont.jpg",
    imageAlt: "Main Street in downtown Longmont, Colorado",
    imageCaption: "Main Street in downtown Longmont. Local scenery, not a job photo.",
    credit: {
      title: "Longmont Colorado",
      author: "David Shankbone",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
      url: "https://commons.wikimedia.org/wiki/File:Longmont_Colorado.JPG",
    },
    map: { x: 62, y: 20 },
  },
  {
    slug: "superior-co",
    seoSlug: "superior-co-dryer-vent-cleaning",
    name: "Superior",
    core: true,
    zips: ["80027"],
    blurb:
      "Superior had about 250 residents until the 1990s, then added Rock Creek Ranch and other subdivisions and passed 9,000 people by 2000. Most of the homes here are newer, and newer floor plans change how a dryer vent is routed.",
    paragraphs: [
      "William and Emmaline Hake settled along Coal Creek in 1860, and coal found on their homestead in 1864 started the mining that, by most accounts, gave the town its name. Superior was founded in 1896 and incorporated in 1904. The Industrial Mine closed in 1945, the population hovered around 250 for decades, and then Rock Creek Ranch and other subdivisions were built in the 1990s. About 13,400 people live here now, and Downtown Superior is a newer mixed-use district.",
      "Because so much of Superior was built from the 1990s on, many homes have newer floor plans. A second-floor laundry room can mean a vent that runs up and out through the roof or a high wall, and that is the $169 difficult clean. A ground-floor laundry with a side-wall hood is the $129 standard clean. The booking flow asks two questions about the exit and the run, then shows your price before you pick a time.",
      "Superior is the highest of the towns we list, at about 5,500 feet, and winter snow can pile against a side-wall hood. It shares ZIP code 80027 with Louisville, so choose your town in the booking form. Superior borders Louisville and is close to Boulder, so a Superior visit can share a route day with either.",
    ],
    facts: [
      ["Elevation", "About 5,500 feet above sea level"],
      ["Founded", "1896; incorporated 1904"],
      ["Population", "13,361 (2024 estimate)"],
      ["ZIP code", "80027 (shared with Louisville)"],
      ["Growth", "Rock Creek Ranch and other subdivisions built from the 1990s"],
    ],
    nearby: ["louisville-co", "boulder-co", "broomfield-co"],
    image: "superior.jpg",
    imageAlt: "Overlook of the Rock Creek subdivision in Superior, Colorado",
    imageCaption: "Rock Creek overlook. Superior scenery, not a job photo.",
    credit: {
      title: "Superior, Colorado, Fall 2011",
      author: "Pleiades Two",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      url: "https://commons.wikimedia.org/wiki/File:Superior,_Colorado,_Fall_2011.jpg",
    },
    map: { x: 34, y: 84 },
  },
  {
    slug: "erie-co",
    seoSlug: "erie-co-dryer-vent-cleaning",
    name: "Erie",
    core: false,
    zips: ["80516"],
    blurb:
      "Erie was a coal town in the 1870s and is now the most populous statutory town in Colorado. It grew by more than 65 percent between 2010 and 2020, so much of it is recent construction.",
    paragraphs: [
      "Erie was settled in 1867 and incorporated in 1874. Its coal miners owned their own land and houses instead of living in temporary camps. The old downtown still has an 1889 brick building, the Miner Memorial dedicated in 2000, and a Town Hall that used to be Lincoln School. Most of the mines closed by 1960.",
      "The 2020 census counted 30,038 people, up about 65.6 percent from 2010, in 10,332 housing units. Nearly half of Erie households, 48.1 percent, had children under 18. Fast growth means a lot of newer homes, and more people at home generally means more laundry and more lint through the duct. A newer two-story plan can also mean a longer run or a roof exit. We price by the vent: $129 for a ground-level side-wall exit under about 15 feet, $169 for a roof, upper-floor, or long run.",
      "Erie is partly in Weld County and partly in Boulder County. It sits just west of I-25, about 20 minutes from Boulder, and it borders Lafayette and Broomfield. Erie is new to our route sheet. Request a visit and we will confirm whether your address is on a route, and what days we have open, within one business day.",
    ],
    facts: [
      ["Elevation", "About 5,100 feet above sea level"],
      ["Settled", "1867; incorporated 1874"],
      ["Population", "30,038 (2020 census)"],
      ["Counties", "Weld and Boulder"],
      ["ZIP code", "80516"],
    ],
    nearby: ["lafayette-co", "broomfield-co", "longmont-co"],
    image: "erie.jpg",
    imageAlt: "Erie Town Hall, the former Lincoln School, in Erie, Colorado",
    imageCaption: "Erie Town Hall, the former Lincoln School. Local scenery, not a job photo.",
    credit: {
      title: "Town Hall Erie Colorado 01",
      author: "Erie Bard",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      url: "https://commons.wikimedia.org/wiki/File:Town_Hall_Erie_Colorado_01.jpg",
    },
    map: { x: 84, y: 40 },
  },
  {
    slug: "broomfield-co",
    seoSlug: "broomfield-co-dryer-vent-cleaning",
    name: "Broomfield",
    core: false,
    zips: ["80020", "80021", "80023"],
    blurb:
      "Broomfield is its own city and county, formed in 2001 right next to Boulder County. About 74,000 people live here, in more than 31,000 homes.",
    paragraphs: [
      "The Broomfield post office opened in 1884, and historians think the name comes from the broomcorn grown here for brooms. The Denver-Boulder Turnpike opened through the area in 1952, and the City of Broomfield was incorporated in 1961. On November 15, 2001, Broomfield became its own county, the 64th and smallest in Colorado. It sits right next to Boulder County, on its southeast side.",
      "About 74,100 people live in Broomfield, in more than 31,000 housing units. The climate is cold semi-arid, and in an average year the coldest night reaches about 9 degrees below zero, so a side-wall hood can get packed with snow after a storm. Broomfield covers three ZIP codes, 80020, 80021, and 80023. We do not guess at a home from its address. We ask where your vent exits and how long the run is, then show you the published price: $129 standard, $169 difficult.",
      "Broomfield is new to our route sheet. Request a visit and we will confirm whether your address is on a route, and what days we have open, within one business day. Broomfield borders Lafayette, Erie, and Superior, so a stop here often fits with a visit in one of those towns.",
    ],
    facts: [
      ["Elevation", "About 5,300 feet above sea level"],
      ["Incorporated", "1961; became its own county in 2001"],
      ["Population", "74,112 (2020 census)"],
      ["Climate", "Cold semi-arid"],
      ["ZIP codes", "80020, 80021, 80023"],
    ],
    nearby: ["lafayette-co", "superior-co", "erie-co"],
    image: "broomfield.jpg",
    imageAlt: "Morning view of the Flatirons from Broomfield, Colorado",
    imageCaption: "The Flatirons from Broomfield. Local scenery, not a job photo.",
    credit: {
      title: "Flatirons view from Broomfield, Colorado",
      author: "Kpsudeep",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      url: "https://commons.wikimedia.org/wiki/File:Flatirons_view_from_Broomfield,_Colorado.jpg",
    },
    map: { x: 80, y: 78 },
  },
];

// Towns on the regular route. llms.txt only lists these.
export const coreTowns = towns.filter((t) => t.core);

// ZIPs the booking form treats as in the service area. Erie and Broomfield are
// accepted by the booking system, the MCP tool, and the phone line as of 2026-10-29.
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
    body: "Tell us your town and the days that work. We confirm a two-hour window by text or email. Nothing is charged to hold it.",
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
  { q: "Is there a trip or fuel charge?", a: "No. The published price is the whole price for a scheduled visit in the towns we list." },
  {
    q: "What if my home turns out to be difficult?",
    a: "We tell you before any work starts. You either approve $169 or send us on our way — nothing owed either way.",
  },
  {
    q: "How do I pay?",
    a: "Nothing is charged to hold a time. Payment is due before the visit, by card through Stripe only.",
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
  emptyCalendarTitle: "No open times listed yet — request your visit",
};
