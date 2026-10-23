import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/WorkGrid";
import { getProjects } from "@/content";
import { type Locale, localePath } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { Column } from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/work",
    title: t("workTitle"),
    description: t("workDescription"),
  });
}

export default async function Work({ params }: PageProps<"/[locale]/work">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  const projects = getProjects(locale).map((project) => ({
    ...project,
    href: localePath(locale, `/work/${project.slug}`),
  }));

  return (
    <Column maxWidth="l" gap="40" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      <SectionHeader
        as="h1"
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("subheading")}
      />
      <WorkGrid
        projects={projects}
        allLabel={t("filterAll")}
        categoryLabels={{
          data: t("categories.data"),
          "full-stack": t("categories.full-stack"),
          automation: t("categories.automation"),
        }}
      />
    </Column>
  );
}
