import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${brand.name} handles contact, booking, and portal information.`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy policy"
        lede="This version of the site is static. Most forms stay in your browser until a CRM is connected."
      />
      <article className="site-wrap max-w-3xl space-y-6 py-12 leading-relaxed text-charcoal-800">
        <p>Last updated: September 11, 2026.</p>
        <h2 className="display text-2xl">What we intend to collect</h2>
        <p>
          When the CRM is live: name, email, phone, service address, eligibility answers, SMS consent, job notes, and
          invoices. Job photos will be stored only for customers who booked a visit.
        </p>
        <h2 className="display text-2xl">What this static site does now</h2>
        <p>
          Booking drafts and portal demo state are saved in your browser (sessionStorage / localStorage). They are not
          sent to a server from this GitHub Pages build.
        </p>
        <h2 className="display text-2xl">Sharing</h2>
        <p>
          We will not sell customer lists. Processors we expect to use later include a payment provider and Supabase
          for the CRM. Those vendors will be named here when they are actually connected.
        </p>
        <h2 className="display text-2xl">Contact</h2>
        <p>
          Privacy questions: {brand.email} {brand.emailIsPlaceholder ? "(placeholder)" : ""}.
        </p>
      </article>
    </>
  );
}
