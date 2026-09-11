export type PriceId = "standard" | "complex" | "annual" | "route-fill";

export type Price = {
  id: PriceId;
  amount: number;
  label: string;
  blurb: string;
  public: boolean;
  cadence?: "visit" | "year";
};

export const prices: Record<PriceId, Price> = {
  standard: {
    id: "standard",
    amount: 129,
    label: "Standard clean",
    blurb: "Typical single-story home with ground-level or easy roof-adjacent termination.",
    public: true,
    cadence: "visit",
  },
  complex: {
    id: "complex",
    amount: 169,
    label: "Two-story / roof access",
    blurb: "Two-story homes, long runs, or work that needs a roof set-up.",
    public: true,
    cadence: "visit",
  },
  annual: {
    id: "annual",
    amount: 109,
    label: "Annual plan",
    blurb: "After the first visit, stay on a yearly clean at a set price. We remind you when it’s due.",
    public: true,
    cadence: "year",
  },
  "route-fill": {
    id: "route-fill",
    amount: 99,
    label: "Route fill",
    blurb: "Unused capacity on an existing neighborhood route. Not listed publicly.",
    public: false,
    cadence: "visit",
  },
};

export const publicPrices = Object.values(prices).filter((price) => price.public);

export function formatUsd(amount: number): string {
  return `$${amount}`;
}

export function quoteFromEligibility(input: {
  stories: "1" | "2+";
  roofAccess: boolean;
  routeFill?: boolean;
}): { price: Price; reason: string } {
  if (input.routeFill) {
    return {
      price: prices["route-fill"],
      reason: "Route-fill rate for leftover capacity on a planned neighborhood day.",
    };
  }

  if (input.stories === "2+" || input.roofAccess) {
    return {
      price: prices.complex,
      reason: "Two-story or roof-access work is priced at the higher fixed visit rate.",
    };
  }

  return {
    price: prices.standard,
    reason: "Single-story home with typical access qualifies for the standard visit price.",
  };
}
