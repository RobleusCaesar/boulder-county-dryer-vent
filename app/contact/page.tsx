import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { routes } from "@/lib/routes";
import { PageHero } from "@/components/site/PageHero";
import { PhonePlaceholder } from "@/components/site/PhonePlaceholder";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Boulder County Dryer Vent — booking, waitlist, and general questions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Questions that are not a booking"
        lede="For a price and a time, use the book flow. For everything else, leave a note here."
      />
      <section className="site-wrap grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="card h-fit space-y-4 p-6">
          <div>
            <p className="kicker">Phone</p>
            <div className="mt-2">
              <PhonePlaceholder />
            </div>
          </div>
          <div>
            <p className="kicker">Email</p>
            <p className="mt-2 font-semibold">
              {brand.noticesEmail}
            </p>
          </div>
          <div>
            <p className="kicker">Hours</p>
            <p className="mt-2">{brand.hours}</p>
          </div>
          <p className="text-sm text-charcoal-600">
            Prefer to start with eligibility?{" "}
            <a href={routes.book} className="font-semibold text-teal-700">
              See price and times
            </a>
            .
          </p>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
