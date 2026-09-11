import type { MetadataRoute } from "next";
import { serviceAreas } from "@/lib/areas";
import { routes } from "@/lib/routes";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://robleuscaesar.github.io/boulder-county-dryer-vent";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    routes.home,
    routes.service,
    routes.pricing,
    routes.book,
    routes.about,
    routes.contact,
    routes.reviews,
    routes.terms,
    routes.privacy,
    routes.areas,
    ...serviceAreas.map((area) => routes.area(area.slug)),
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === routes.home ? 1 : 0.7,
  }));
}
