import { getProjects } from "@/content";
import { localePath, routing } from "@/i18n/routing";
import { baseURL } from "@/resources/site";
import type { MetadataRoute } from "next";

const STATIC_PATHS = ["/", "/about", "/work", "/certifications", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...getProjects(routing.defaultLocale).map((project) => `/work/${project.slug}`),
  ];

  return paths.map((path) => ({
    url: `${baseURL}${path}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${baseURL}${localePath(locale, path)}`]),
      ),
    },
  }));
}
