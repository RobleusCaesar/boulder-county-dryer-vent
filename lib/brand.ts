import { EMPTY_CALENDAR_COPY } from "@/lib/capacity";

export const brand = {
  name: "Boulder County Dryer Vent",
  shortName: "BCDV",
  tagline: "Fixed-price dryer vent cleaning with real appointment times.",
  phoneDisplay: "Call coming soon",
  phoneHref: "",
  phoneIsPlaceholder: true,
  email: "rob@frostrivercapital.com",
  emailIsPlaceholder: false,
  serviceAreaLabel: "Boulder County, Colorado",
  hours: "Weekdays 8am–5pm · Saturday by route",
  legalName: "Frost River Capital, LLC d/b/a Boulder County Dryer Vent",
  tradeNameId: "20268139028",
  noticesAddress: "2369 S. Trenton Way Suite P, Denver, CO 80231",
  noticesEmail: "rob@frostrivercapital.com",
  publicAddress: "6395 Gunpark Drive, Suite J",
  publicCityLine: "Boulder, CO 80301",
} as const;

export const homepageCopy = {
  h1: "Dryer Vent Cleaning in Boulder County",
  subhead:
    "Fast, fixed-price service with real appointment times. Book online in about a minute.",
  cta: "See Price & Times",
  trust: "Clear pricing · No estimate visit · Photo-documented service",
} as const;

export const lockedCopy = {
  emptyCalendar: EMPTY_CALENDAR_COPY,
  phone: "Call coming soon",
  portalBanner: "Demo — not live accounts",
  reviewsTitle: "Reviews coming after our first jobs",
  cancelPolicy:
    "Cancel 24 hours or more before the visit for a refund. Cancel less than 24 hours before the visit and the amount is credited for 90 days.",
} as const;
