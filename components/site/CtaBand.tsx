import Link from "next/link";
import { homepageCopy } from "@/lib/brand";
import { routes } from "@/lib/routes";

export function CtaBand({ title = "See the price. See if we have a time." }: { title?: string }) {
  return (
    <section className="site-wrap my-16">
      <div className="relative overflow-hidden rounded-3xl bg-teal-800 px-6 py-10 text-white sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" />
        <h2 className="display max-w-xl text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl text-white/75">
          Eligibility, a fixed quote, then an honest calendar. If the book is empty, you can join the waitlist.
        </p>
        <Link href={routes.book} className="btn-light mt-6">
          {homepageCopy.cta}
        </Link>
      </div>
    </section>
  );
}
