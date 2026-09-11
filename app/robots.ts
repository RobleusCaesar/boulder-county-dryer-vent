import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://robleuscaesar.github.io/boulder-county-dryer-vent";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/", "/admin/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
