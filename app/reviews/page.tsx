import type { Metadata } from "next";
import Link from "next/link";
import { lockedCopy } from "@/lib/brand";
import { routes } from "@/lib/routes";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Customer reviews for Boulder County Dryer Vent. This page stays empty until real customers write in.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        kicker="Reviews"
        title={lockedCopy.reviewsTitle}
        lede="When customers leave notes after a visit, they will appear here. Until then this page stays blank on purpose."
      />
      <section className="site-wrap py-12">
        <div className="card max-w-2xl p-6 sm:p-8">
          <h2 className="display text-2xl">Been here already?</h2>
          <p className="mt-3 text-charcoal-600">
            If we cleaned your vent, we want the unvarnished version. Use the contact form and say it was a review. We
            will not edit it into marketing copy.
          </p>
          <Link href={routes.contact} className="btn-primary mt-6">
            Send a review
          </Link>
        </div>
      </section>
    </>
  );
}
