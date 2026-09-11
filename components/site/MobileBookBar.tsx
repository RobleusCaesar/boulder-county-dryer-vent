"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homepageCopy } from "@/lib/brand";
import { routes } from "@/lib/routes";

export function MobileBookBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal") || pathname?.startsWith("/book") || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-teal-900/10 bg-paper/95 p-3 backdrop-blur md:hidden">
      <Link href={routes.book} className="btn-primary w-full">
        {homepageCopy.cta}
      </Link>
    </div>
  );
}
