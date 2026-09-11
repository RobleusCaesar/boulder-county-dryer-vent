import Link from "next/link";
import { brand } from "@/lib/brand";
import { routes } from "@/lib/routes";

type LogoProps = {
  invert?: boolean;
  compact?: boolean;
};

export function Logo({ invert = false, compact = false }: LogoProps) {
  return (
    <Link href={routes.home} className="group flex items-center gap-2.5">
      <span
        className={`grid h-9 w-9 place-items-center rounded-full ${
          invert ? "bg-white/15 text-white" : "bg-teal-800 text-white"
        }`}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 14c3.2-1.6 5.3-4.8 5.3-8.4M10.2 16.2c3-1.4 5-4.4 5-7.8M16.4 17.8c2.5-1 4.1-3.4 4.1-6.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="6.2" cy="18.4" r="1.5" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
            invert ? "text-white/70" : "text-teal-700"
          }`}
        >
          Boulder County
        </span>
        {!compact && (
          <span className={`block text-[1.05rem] font-semibold ${invert ? "text-white" : "text-charcoal"}`}>
            {brand.name.replace("Boulder County ", "")}
          </span>
        )}
      </span>
    </Link>
  );
}
