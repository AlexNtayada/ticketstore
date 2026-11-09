import type { MetadataRoute } from "next";
import { event } from "@/config/event";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = event.seo?.canonicalUrl;
  if (event.isDemo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(base ? { sitemap: new URL("/sitemap.xml", base).toString() } : {}),
  };
}
