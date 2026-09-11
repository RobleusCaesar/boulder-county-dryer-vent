export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-often-to-clean-a-dryer-vent-in-boulder-county",
    title: "How often to clean a dryer vent in Boulder County",
    excerpt: "Most homes here need a yearly clean. High-use households and long runs should come sooner.",
    date: "2026-09-11",
    paragraphs: [
      "A dryer that takes two cycles to finish a load is usually a vent problem, not a dying machine. Lint that never reaches the cap sits in the elbows and cooks.",
      "For a typical Boulder County household — a few loads a week, a run under about thirty feet — a yearly clean is the right interval. That is what the annual plan is built around.",
      "Come sooner if you run the dryer daily, if the house is two-story with a roof cap, or if the last tech left a note that the line was packed. Colorado’s dry air does not make lint safer; it just makes it lighter and easier to pack into a bend.",
      "We will not invent a schedule to sell a second visit. If a single-story ranch with a short run is clean, we say so and book you a year out.",
    ],
  },
  {
    slug: "what-a-dryer-vent-cleaning-visit-includes",
    title: "What a dryer vent cleaning visit includes",
    excerpt: "From the dryer hookup to the termination flap — and what we will not pretend to do on a booked clean.",
    date: "2026-09-11",
    paragraphs: [
      "The visit starts at the machine. We pull it far enough to disconnect the transition, then brush and rod the line toward the outside. A stuck flap at the cap still overheats a clean pipe, so we check that it swings.",
      "You get a plain note: roughly how long the run is, anything we could not reach, and when the next clean should be. Photos go in the customer portal once storage is live.",
      "This is not a new duct install, a dryer repair, or a commercial laundry job. If the line is crushed, disconnected in a wall, or foil flex that will not take a brush, we name it instead of charging for work we could not finish.",
      "Eligibility on the book page is how we pick $129 or $169 before we arrive. Roof work and two-story runs are the higher visit, not a surprise on the invoice.",
    ],
  },
  {
    slug: "dryer-vent-lint-and-fire-risk",
    title: "Lint, heat, and why a blocked vent is a fire risk",
    excerpt: "The fire is usually in the lint, not the dryer. A working cap and an open run are the whole point.",
    date: "2026-09-11",
    paragraphs: [
      "Clothes dryers are a common source of home fires. The fuel is lint. The ignition is a machine that has to run hotter and longer because air cannot leave the house.",
      "You do not need a scare statistic invented for this page. If the exterior flap does not move, or if the dryer is hot to the touch after a short cycle, the vent is due.",
      "Cleaning does not replace a smoke alarm or a crushed pipe. It does remove the lint we can reach and tell you if the next step is a repair, not another brush.",
      "If you smell burning or see scorch at the transition, stop the machine and treat it as a safety issue — not a waitlist item.",
    ],
  },
  {
    slug: "standard-versus-difficult-dryer-vent-price",
    title: "Standard $129 vs difficult $169 — how the quote is chosen",
    excerpt: "Stories and roof access set the price. Route-fill is never on the public price list.",
    date: "2026-09-11",
    paragraphs: [
      "The book flow asks city, ZIP, property type, stories, and whether the termination needs a roof set-up. That is the whole quote.",
      "Standard $129 is a single-story home with typical access. Difficult $169 is two or more stories, a long run, or work that needs a ladder on the roof. The annual plan is $109 a year after the first paid visit.",
      "A $99 route-fill rate exists for leftover capacity on a day we are already in the neighborhood. It is not advertised on the pricing page. If a link includes that offer, the book flow will say so.",
      "If we cannot do the work as described, we say so before you pay. Card checkout is still a stub on this site; a submitted request is not a charge.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
