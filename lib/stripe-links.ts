import type { PriceId } from "@/lib/pricing";

/**
 * Optional Stripe Payment Links for static GitHub Pages.
 * Empty env (default) keeps the /book pay stub unchanged — zero live-charge risk.
 * Only set NEXT_PUBLIC_STRIPE_PAYMENT_LINK_* at build time after Rob banks Stripe
 * and Ava/Rob record written go-live.
 */
export function paymentLinkForPrice(priceId: PriceId): string | null {
  const map: Partial<Record<PriceId, string | undefined>> = {
    standard: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD,
    complex: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_COMPLEX,
  };
  const url = (map[priceId] || "").trim();
  if (!url) return null;
  if (!/^https:\/\/buy\.stripe\.com\//i.test(url)) return null;
  return url;
}
