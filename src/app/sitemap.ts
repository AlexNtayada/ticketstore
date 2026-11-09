import type { MetadataRoute } from "next";
import { event } from "@/config/event";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = event.seo?.canonicalUrl;
  if (!url || event.isDemo) return [];
  return [{ url, changeFrequency: "weekly", priority: 1 }];
}
