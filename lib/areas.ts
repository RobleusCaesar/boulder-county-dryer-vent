export type ServiceArea = {
  slug: string;
  seoSlug: string;
  city: string;
  state: "CO";
  title: string;
  intro: string;
  housing: string;
  note: string;
  zips: string[];
  image: string;
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: "boulder-co",
    seoSlug: "boulder-co-dryer-vent-cleaning",
    city: "Boulder",
    state: "CO",
    title: "Dryer vent cleaning in Boulder, CO",
    intro:
      "Older University Hill bungalows, north Boulder ranches, and south Boulder two-stories all share the same problem: lint that never makes it out of a long, bent run.",
    housing:
      "Many Boulder homes vent through a crawl, a low roof, or a second-story termination tucked behind a deck. We price that work up front instead of discovering it on the ladder.",
    note: "We serve city of Boulder and the nearby unincorporated pockets we can reach on the same route.",
    zips: ["80301", "80302", "80303", "80304", "80305", "80310"],
    image: "/assets/cities/boulder.jpg",
  },
  {
    slug: "louisville-co",
    seoSlug: "louisville-co-dryer-vent-cleaning",
    city: "Louisville",
    state: "CO",
    title: "Dryer vent cleaning in Louisville, CO",
    intro:
      "Louisville’s mix of 1970s ranches and newer two-stories is a good fit for a fixed-price visit. Most terminations are reachable without a surprise add-on.",
    housing:
      "If your dryer is in a basement and the cap is high on the rear wall or roof, we’ll quote the two-story / roof rate before you book.",
    note: "Downtown Louisville, Cottonwood, and the neighborhoods west of McCaslin are all in-area.",
    zips: ["80027"],
    image: "/assets/cities/louisville.jpg",
  },
  {
    slug: "lafayette-co",
    seoSlug: "lafayette-co-dryer-vent-cleaning",
    city: "Lafayette",
    state: "CO",
    title: "Dryer vent cleaning in Lafayette, CO",
    intro:
      "From Old Town Lafayette to the newer streets east of Public Road, we clean residential dryer vents on a published price — not a range that moves after we arrive.",
    housing:
      "Townhomes with shared side yards and HOA rules are fine. We work from the home’s dryer, not from a roof we weren’t invited onto.",
    note: "If your HOA needs a certificate of insurance on file, say so in the booking notes.",
    zips: ["80026"],
    image: "/assets/cities/lafayette.jpg",
  },
  {
    slug: "longmont-co",
    seoSlug: "longmont-co-dryer-vent-cleaning",
    city: "Longmont",
    state: "CO",
    title: "Dryer vent cleaning in Longmont, CO",
    intro:
      "Longmont is a longer drive from the rest of the county, so we batch these visits. That’s why the calendar is honest: if we don’t have a Longmont day open, we say so.",
    housing:
      "West Longmont two-stories and east-side ranches both book the same way. Stories and roof access set the price, not the ZIP.",
    note: "Hover and Hygiene-adjacent addresses are reviewed during eligibility.",
    zips: ["80501", "80503", "80504"],
    image: "/assets/cities/longmont.jpg",
  },
  {
    slug: "superior-co",
    seoSlug: "superior-co-dryer-vent-cleaning",
    city: "Superior",
    state: "CO",
    title: "Dryer vent cleaning in Superior, CO",
    intro:
      "Superior’s planned streets make routing simple. If we already have a day in Louisville or Boulder, a Superior stop is often the efficient next job — when the calendar actually has room.",
    housing:
      "Most homes here are two-story with rooftop or high-wall caps. Expect the $169 visit unless you have ground-level termination.",
    note: "Rock Creek and the original Superior townsite are both in-area.",
    zips: ["80027"],
    image: "/assets/cities/superior.jpg",
  },
];

export function getArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug);
}

export function getAreaBySeoSlug(seoSlug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.seoSlug === seoSlug);
}

export const inAreaZips = new Set(serviceAreas.flatMap((area) => area.zips));

export const inAreaCities = serviceAreas.map((area) => area.city);
