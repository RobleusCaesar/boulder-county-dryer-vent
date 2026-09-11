export const routes = {
  home: "/",
  service: "/dryer-vent-cleaning/",
  pricing: "/pricing/",
  book: "/book/",
  bookConfirmation: "/book/confirmation/",
  about: "/about/",
  contact: "/contact/",
  reviews: "/reviews/",
  terms: "/legal/terms/",
  privacy: "/legal/privacy/",
  areas: "/areas/",
  area: (slug: string) => `/areas/${slug}/`,
  portal: {
    login: "/portal/login/",
    home: "/portal/",
    jobs: "/portal/jobs/",
    job: (id: string) => `/portal/jobs/${id}/`,
    schedule: "/portal/schedule/",
    billing: "/portal/billing/",
    account: "/portal/account/",
  },
} as const;

export const navPrimary = [
  { href: routes.service, label: "The service" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.areas, label: "Areas" },
  { href: routes.reviews, label: "Reviews" },
  { href: routes.about, label: "About" },
] as const;
