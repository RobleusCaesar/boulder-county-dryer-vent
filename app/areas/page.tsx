import type { Metadata } from "next";
import Link from "next/link";
import { serviceAreas } from "@/lib/areas";
import { routes } from "@/lib/routes";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Service areas",
  description: "Boulder County towns we book: Boulder, Louisville, Lafayette, Longmont, and Superior.",
};

export default function AreasIndexPage() {
  return (
    <>
      <PageHero
        kicker="Areas"
        title="Boulder County towns on the book"
        lede="If your ZIP is on a town page, we treat it as in-area. Eligibility still has to match the house."
      />
      <section className="site-wrap grid gap-4 py-12 md:grid-cols-2">
        {serviceAreas.map((area) => (
          <Link key={area.slug} href={routes.area(area.slug)} className="card p-6 hover:shadow-lift">
            <h2 className="text-xl font-semibold">
              {area.city}, {area.state}
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">{area.intro}</p>
          </Link>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
