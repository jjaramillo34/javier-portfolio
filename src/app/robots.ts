import { baseURL } from "@/resources/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/keystatic"] },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
