import type { MetadataRoute } from "next";

const siteUrl = "https://www.rolearc.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/builder/", "/dashboard", "/deploy-guide", "/upgrade"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
