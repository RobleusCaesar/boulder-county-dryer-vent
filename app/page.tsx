import type { Metadata } from "next";
import Link from "next/link";
import { brand, homepageCopy } from "@/lib/brand";
import { serviceAreas } from "@/lib/areas";
import { formatUsd, publicPrices } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { CtaBand } from "@/components/site/CtaBand";
import { Flatirons } from "@/components/site/Flatirons";

export const metadata: Metadata = {
  title: homepageCopy.h1,
  description: homepageCopy.subhead,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: brand.name,
  description: homepageCopy.subhead,
  areaServed: serviceAreas.map((area) => `${area.city}, CO`),
  priceRange: "$129–$169",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden bg-teal-900 text-white">
        <Flatirons className="absolute inset-x-0 bottom-0 h-40 w-full text-black" />
        <div className="site-wrap relative py-16 sm:py-24">
          <p className="kicker !text-teal-100">{brand.serviceAreaLabel}</p>
          <h1 className="display mt-3 max-w-4xl text-[2.35rem] leading-[1.08] sm:text-6xl">{homepageCopy.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 sm:text-xl">{homepageCopy.subhead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={routes.book} className="btn-light">
              {homepageCopy.cta}
            </Link>
            <Link href={routes.pricing} className="btn-ghost !border-white/20 !text-white hover:!bg-white/10">
              View prices
            </Link>
          </div>
          <p className="mt-10 text-sm font-semibold text-white/90 sm:text-base">{homepageCopy.trust}</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatUsd(129)}
            <span className="ml-2 text-base font-normal text-white/70">standard clean</span>
          </p>
        </div>
      </section>

      <section className="site-wrap py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="kicker">What we do</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">A clean vent, a working flap, and a price you already saw.</h2>
            <p className="mt-4 max-w-xl text-lg text-charcoal-800">
              Lint that never leaves the run is a fire risk and a slow dryer. We brush the line, clear the termination,
              and tell you if the next visit should be sooner than a year.
            </p>
            <Link href={routes.service} className="mt-6 inline-flex font-semibold text-teal-700">
              How a visit works →
            </Link>
          </div>
          <ol className="card divide-y divide-teal-900/10">
            {[
              ["1", "Eligibility", "City, stories, and access. Commercial work is not booked online."],
              ["2", "Price", "Standard $129 or difficult $169. Annual plan $109 after the first visit."],
              ["3", "Times", "If the calendar is empty, we say so and take a waitlist."],
            ].map(([n, title, body]) => (
              <li key={n} className="flex gap-4 px-5 py-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-50 text-sm font-bold text-teal-800">
                  {n}
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-charcoal-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="site-wrap">
          <p className="kicker">Published prices</p>
          <h2 className="display mt-2 text-3xl">What you’ll pay</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {publicPrices.map((price) => (
              <article key={price.id} className="card p-6">
                <p className="text-sm font-semibold text-teal-700">{price.label}</p>
                <p className="display mt-2 text-4xl">
                  {formatUsd(price.amount)}
                  {price.cadence === "year" && <span className="text-lg text-charcoal-400"> / year</span>}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{price.blurb}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-charcoal-400">
            Route-fill pricing is used only when we have leftover capacity on a planned day. It is not listed here.
          </p>
        </div>
      </section>

      <section className="site-wrap py-14">
        <p className="kicker">Service area</p>
        <h2 className="display mt-2 text-3xl">Boulder County towns we book</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {serviceAreas.map((area) => (
            <Link key={area.slug} href={routes.area(area.slug)} className="card p-5 hover:shadow-lift">
              <p className="font-semibold">
                {area.city}, {area.state}
              </p>
              <p className="mt-2 text-sm text-charcoal-600">{area.zips.join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
