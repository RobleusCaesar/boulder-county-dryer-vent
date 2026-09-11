import type { Metadata } from "next";
import { ConfirmationView } from "@/components/book/ConfirmationView";

export const metadata: Metadata = {
  title: "Request received",
  description: "Your Boulder County Dryer Vent booking or waitlist request was recorded.",
};

export default function ConfirmationPage() {
  return (
    <section className="site-wrap max-w-2xl py-12">
      <ConfirmationView />
    </section>
  );
}
