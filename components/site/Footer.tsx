import Link from "next/link";
import { brand } from "@/lib/brand";
import { serviceAreas } from "@/lib/areas";
import { routes } from "@/lib/routes";
import { Logo } from "@/components/site/Logo";
import { PhonePlaceholder } from "@/components/site/PhonePlaceholder";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-charcoal text-white">
      <div className="site-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo invert />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Fixed-price dryer vent cleaning for Boulder County homes. Real times when we have them. A waitlist when we
            don’t.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Visit</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={routes.service} className="hover:text-teal-100">
                Dryer vent cleaning
              </Link>
            </li>
            <li>
              <Link href={routes.pricing} className="hover:text-teal-100">
                Pricing
              </Link>
            </li>
            <li>
              <Link href={routes.book} className="hover:text-teal-100">
                Book
              </Link>
            </li>
            <li>
              <Link href={routes.reviews} className="hover:text-teal-100">
                Reviews
              </Link>
            </li>
            <li>
              <Link href={routes.blog} className="hover:text-teal-100">
                Blog
              </Link>
            </li>
            <li>
              <Link href={routes.about} className="hover:text-teal-100">
                About
              </Link>
            </li>
            <li>
              <Link href={routes.contact} className="hover:text-teal-100">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Areas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                <Link href={routes.area(area.slug)} className="hover:text-teal-100">
                  {area.city}, CO
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 text-sm text-white/70">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Reach us</h2>
          <PhonePlaceholder invert />
          <p>
            {brand.publicAddress}
            <br />
            {brand.publicCityLine}
          </p>
          <p>
            Email <span className="text-white">{brand.noticesEmail}</span>
          </p>
          <p>{brand.hours}</p>
          <Link href={routes.portal.login} className="inline-block text-white/80 underline-offset-4 hover:underline">
            Customer portal
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href={routes.terms} className="hover:text-white">
              Terms
            </Link>
            <Link href={routes.privacy} className="hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
