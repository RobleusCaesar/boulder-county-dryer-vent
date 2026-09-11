import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "About Boulder County Dryer Vent — a local, fixed-price dryer vent cleaning service.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title={`${brand.name} is a local service with one job`}
        lede="We clean residential dryer vents in Boulder County. We publish prices. We do not invent appointment times."
      />
      <section className="site-wrap max-w-3xl space-y-6 py-12 text-lg leading-relaxed text-charcoal-800">
        <p>
          This is not a national franchise page and not a catch-all “we do vents, ducts, and chimneys” shop. The work
          is dryer vents: the run from the machine to the cap, and a flap that still moves when we’re done.
        </p>
        <p>
          The booking flow is built to be boring on purpose. You answer a few access questions, you see the price that
          applies, and you see the calendar as it actually is. If there are no public slots, the waitlist is the honest
          next step.
        </p>
        <p>
          Reviews stay empty until customers write them. The customer portal is a working stub with a demo household so
          you can see history, notes, invoices, and a reschedule request before real accounts are connected.
        </p>
      </section>
      <CtaBand title="Ready when you are." />
    </>
  );
}
