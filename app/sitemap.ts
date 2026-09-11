import type { MetadataRoute } from "next";
import { serviceAreas } from "@/lib/areas";
import { blogPosts } from "@/lib/blog";
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
    routes.blog,
    ...blogPosts.map((post) => routes.post(post.slug)),
    routes.terms,
    routes.privacy,
    routes.areas,
    ...serviceAreas.map((area) => routes.area(area.slug)),
    ...serviceAreas.map((area) => routes.seoArea(area.seoSlug)),
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === routes.home ? 1 : 0.7,
  }));
}
