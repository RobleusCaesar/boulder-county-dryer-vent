import Image from "next/image";
import Link from "next/link";
import type { ServiceArea } from "@/lib/areas";
import { serviceAreas } from "@/lib/areas";
import { homepageCopy } from "@/lib/brand";
import { routes } from "@/lib/routes";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";

export function AreaContent({ area }: { area: ServiceArea }) {
  return (
    <>
      <PageHero kicker={`${area.city}, Colorado`} title={area.title} lede={area.intro} />
      <section className="site-wrap py-8">
        <figure className="overflow-hidden rounded-2xl border border-teal-900/10 bg-cream shadow-sm">
          <Image
            src={`/assets/cities/${area.heroImage}`}
            alt={area.heroAlt}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
          <figcaption className="px-4 py-3 text-sm text-charcoal-600">{area.heroCaption}</figcaption>
        </figure>
      </section>
      <section className="site-wrap grid gap-6 py-12 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <h2 className="display text-2xl">Housing we see here</h2>
          <p className="mt-3 text-lg text-charcoal-800">{area.housing}</p>
          <p className="mt-4 text-charcoal-600">{area.note}</p>
        </article>
        <aside className="card h-fit p-6">
          <p className="kicker">ZIPs we treat as in-area</p>
          <ul className="mt-3 space-y-1 font-semibold">
            {area.zips.map((zip) => (
              <li key={zip}>{zip}</li>
            ))}
          </ul>
          <Link href={routes.book} className="btn-primary mt-6 w-full">
            {homepageCopy.cta}
          </Link>
        </aside>
      </section>
      <section className="site-wrap pb-4">
        <h2 className="display text-2xl">Other towns</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {serviceAreas
            .filter((other) => other.slug !== area.slug)
            .map((other) => (
              <Link key={other.slug} href={routes.area(other.slug)} className="btn-ghost !py-2 !text-sm">
                {other.city}
              </Link>
            ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
