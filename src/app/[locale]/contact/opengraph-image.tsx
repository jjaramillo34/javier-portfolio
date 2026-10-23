import { type Locale, routing } from "@/i18n/routing";
import { ogContentType, ogSize } from "@/lib/og";
import { renderPageOg } from "@/lib/og-pages";

export const size = ogSize;
export const contentType = ogContentType;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = "Javier Jaramillo — Data Analyst & Full-Stack Developer";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return renderPageOg((await params).locale as Locale, "contact");
}
