import type { MetadataRoute } from "next";

const siteUrl = "https://www.rolearc.xyz";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/templates", priority: 0.85 },
  { path: "/pricing", priority: 0.8 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
