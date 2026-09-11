"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DemoBanner } from "@/components/portal/DemoBanner";
import { PORTAL_SESSION_KEY, type PortalSession } from "@/lib/portal/session";
import { routes } from "@/lib/routes";

const links = [
  { href: routes.portal.home, label: "Overview" },
  { href: routes.portal.jobs, label: "Jobs" },
  { href: routes.portal.schedule, label: "Schedule" },
  { href: routes.portal.billing, label: "Billing" },
  { href: routes.portal.account, label: "Account" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<PortalSession | null | undefined>(undefined);
  const isLogin = pathname?.includes("/portal/login");

  useEffect(() => {
    const raw = localStorage.getItem(PORTAL_SESSION_KEY);
    setSession(raw ? (JSON.parse(raw) as PortalSession) : null);
  }, [pathname]);

  useEffect(() => {
    if (session === null && !isLogin) {
      router.replace(routes.portal.login);
    }
  }, [session, isLogin, router]);

  if (isLogin) {
    return (
      <>
        <DemoBanner />
        {children}
      </>
    );
  }

  if (!session) {
    return (
      <>
        <DemoBanner />
        <div className="site-wrap py-16 text-charcoal-400">Opening the portal…</div>
      </>
    );
  }

  return (
    <>
      <DemoBanner />
      <div className="border-b border-teal-900/10 bg-white">
        <div className="site-wrap flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="kicker">Customer portal</p>
            <p className="font-semibold">{session.email}</p>
          </div>
          <button
            type="button"
            className="btn-ghost !py-2 !text-sm"
            onClick={() => {
              localStorage.removeItem(PORTAL_SESSION_KEY);
              router.push(routes.portal.login);
            }}
          >
            Sign out
          </button>
        </div>
        <nav className="site-wrap flex gap-1 overflow-x-auto pb-3" aria-label="Portal">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== routes.portal.home && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold ${
                  active ? "bg-teal-800 text-white" : "text-charcoal-800 hover:bg-teal-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="bg-cream/40">{children}</div>
    </>
  );
}
