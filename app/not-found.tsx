import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="site-wrap max-w-xl py-16">
      <p className="kicker">404</p>
      <h1 className="display mt-2 text-4xl">That page isn’t on this site</h1>
      <p className="mt-4 text-charcoal-600">Check the address, or go back to the homepage.</p>
      <Link href={routes.home} className="btn-primary mt-6">
        Home
      </Link>
    </section>
  );
}
