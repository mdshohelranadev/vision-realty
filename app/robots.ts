import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The admin area is kept out of search results with a noindex tag in app/admin/layout.tsx,
// so its path is deliberately not listed here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
