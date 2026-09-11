import type { NextConfig } from "next";

const pagesBase = "/boulder-county-dryer-vent";
const basePath =
  process.env.GITHUB_PAGES === "true" ? pagesBase : process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
