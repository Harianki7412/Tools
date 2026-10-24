import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/tools/`, lastModified: now, priority: 0.8 },
  ];
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${base}/tools/${t.slug}/`,
    lastModified: now,
    priority: 0.9,
  }));
  return [...staticRoutes, ...toolRoutes];
}