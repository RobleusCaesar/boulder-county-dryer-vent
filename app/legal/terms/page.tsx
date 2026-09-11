import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `Terms for booking and using the ${brand.name} website and customer portal.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms of service" lede="These terms cover the public site, booking requests, waitlist, and the demo portal." />
      <article className="site-wrap max-w-3xl space-y-6 py-12 leading-relaxed text-charcoal-800">
        <p>Last updated: September 11, 2026.</p>
        <h2 className="display text-2xl">The service</h2>
        <p>
          {brand.name} offers residential dryer vent cleaning in listed Boulder County towns. Online booking is a
          request until we confirm a time. Published prices apply to work that matches the eligibility answers you
          submit.
        </p>
        <h2 className="display text-2xl">What we can refuse</h2>
        <p>
          We may decline unsafe roof conditions, commercial plants, multi-unit risers, or homes outside the listed
          area. If we decline after a visit starts because the job does not match the booking, we will say so before
          charging a visit that was not performed.
        </p>
        <h2 className="display text-2xl">Payments</h2>
        <p>
          Card checkout is a stub in this version. A submitted pay step is not a charge. When payments go live, charges
          will appear on your statement as {brand.name}.
        </p>
        <h2 className="display text-2xl">Portal</h2>
        <p>
          The customer portal currently uses a demo household. Do not enter real payment cards or documents you would
          not want stored in a browser.
        </p>
        <h2 className="display text-2xl">Texts</h2>
        <p>
          If you opt in to SMS, you agree to receive appointment and service messages. Frequency varies. Message and
          data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.
        </p>
      </article>
    </>
  );
}
