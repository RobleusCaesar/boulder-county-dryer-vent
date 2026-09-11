import type { Metadata } from "next";
import { BookingWizard } from "@/components/book/BookingWizard";

export const metadata: Metadata = {
  title: "Book",
  description: "See your dryer vent cleaning price and real appointment times in Boulder County.",
};

export default function BookPage() {
  return (
    <section className="bg-cream/60 py-10 sm:py-14">
      <div className="site-wrap max-w-2xl">
        <BookingWizard />
      </div>
    </section>
  );
}
