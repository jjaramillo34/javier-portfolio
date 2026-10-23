import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English keeps the existing URLs (/, /work…); Spanish lives under /es.
  localePrefix: "as-needed",
  // No Accept-Language/cookie redirects: each URL always serves the same language,
  // which keeps search indexing predictable and the language switch a plain link.
  localeDetection: false,
});

/** Prefixes an app path with the locale segment where needed ("/work" → "/es/work"). */
export const localePath = (locale: Locale, path: string) => {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export type Locale = (typeof routing.locales)[number];
