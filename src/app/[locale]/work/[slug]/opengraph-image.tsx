import { getProjects } from "@/content";
import { type Locale, routing } from "@/i18n/routing";
import { ogContentType, ogSize } from "@/lib/og";
import { renderProjectOg } from "@/lib/og-pages";

export const size = ogSize;
export const contentType = ogContentType;
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug })),
  );
}

export const alt = "Project by Javier Jaramillo";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return renderProjectOg(locale as Locale, slug);
}
