import type { Metadata } from "next";
import { formatUsd, publicPrices } from "@/lib/pricing";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Fixed dryer vent cleaning prices for Boulder County: $129 standard, $169 difficult, $109 annual.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Pricing"
        title="Three published prices. Nothing invented at the door."
        lede="Eligibility picks the visit rate. If we cannot do the work as described, we say so before you pay."
      />
      <section className="site-wrap grid gap-4 py-12 md:grid-cols-3">
        {publicPrices.map((price) => (
          <article key={price.id} className="card p-6">
            <p className="kicker">{price.label}</p>
            <p className="display mt-3 text-5xl">
              {formatUsd(price.amount)}
              {price.cadence === "year" ? <span className="text-xl text-charcoal-400"> / yr</span> : null}
            </p>
            <p className="mt-4 text-charcoal-600">{price.blurb}</p>
          </article>
        ))}
      </section>
      <section className="site-wrap pb-4">
        <div className="card p-6 sm:p-8">
          <h2 className="display text-2xl">How the quote is chosen</h2>
          <ul className="mt-4 space-y-3 text-charcoal-800">
            <li>
              <strong>Standard $129</strong> — single-story, typical access, ground-level or easy termination.
            </li>
            <li>
              <strong>Difficult $169</strong> — two or more stories, long runs, or a roof set-up.
            </li>
            <li>
              <strong>Annual $109</strong> — after the first paid visit, a yearly return at a set rate. We remind you
              when it’s due.
            </li>
          </ul>
          <p className="mt-6 text-sm text-charcoal-400">
            A lower route-fill rate is used only when we have leftover capacity on a day already planned. It is not
            advertised on this page.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
