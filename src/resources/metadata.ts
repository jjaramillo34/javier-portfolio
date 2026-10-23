import { type Locale, localePath, routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { baseURL, ogImage } from "./site";

interface PageMetadata {
  locale: Locale;
  /** Path without the locale prefix, e.g. "/work". */
  path: string;
  title: string;
  description: string;
  image?: string;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = ogImage,
}: PageMetadata): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${baseURL}${localePath(l, path)}`]),
  );

  return {
    metadataBase: new URL(baseURL),
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, "x-default": `${baseURL}${path}` },
    },
    openGraph: {
      type: "website",
      siteName: "Jaramillo Hub",
      url: localePath(locale, path),
      title,
      description,
      locale: locale === "es" ? "es_US" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
