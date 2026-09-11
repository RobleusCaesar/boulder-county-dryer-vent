"use client";

import Link from "next/link";
import { useState } from "react";
import { homepageCopy } from "@/lib/brand";
import { navPrimary, routes } from "@/lib/routes";
import { Logo } from "@/components/site/Logo";
import { PhonePlaceholder } from "@/components/site/PhonePlaceholder";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-paper/90 backdrop-blur-md">
      <div className="site-wrap flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navPrimary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-charcoal-800 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <PhonePlaceholder compact />
          <Link href={routes.book} className="btn-primary !py-2.5 !text-sm">
            {homepageCopy.cta}
          </Link>
        </div>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-teal-900/10 bg-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-charcoal transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-full bg-charcoal transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-charcoal transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="border-t border-teal-900/10 bg-paper lg:hidden">
          <nav className="site-wrap flex flex-col gap-1 py-4" aria-label="Mobile">
            {navPrimary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base font-semibold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href={routes.contact} className="rounded-xl px-3 py-3 text-base font-semibold" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <div className="px-3 pt-2">
              <PhonePlaceholder />
            </div>
            <Link href={routes.book} className="btn-primary mt-2" onClick={() => setOpen(false)}>
              {homepageCopy.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
