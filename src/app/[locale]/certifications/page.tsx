import { accentTags } from "@/components/Accent";
import { CertificationTimeline } from "@/components/CertificationTimeline";
import { SectionTitle } from "@/components/SectionTitle";
import { getCertificationTimeline } from "@/content";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { Column } from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: PageProps<"/[locale]/certifications">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/certifications",
    title: t("certificationsTitle"),
    description: t("certificationsDescription"),
  });
}

export default async function Certifications({ params }: PageProps<"/[locale]/certifications">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("certifications");
  const timeline = getCertificationTimeline();

  return (
    <Column maxWidth="l" gap="64" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      <SectionTitle
        as="h1"
        eyebrow={t("eyebrow")}
        title={t.rich("heading", accentTags)}
        description={t("subheading")}
      />
      <CertificationTimeline items={timeline} />
    </Column>
  );
}
