import { SectionHeader } from "@/components/SectionHeader";
import { certifications, getCertificationLink } from "@/content";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import type { CertificationCategoryKey } from "@/types/portfolio";
import { Column, Grid, Heading, Row, SmartLink, Tag, Text } from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

const CATEGORIES: CertificationCategoryKey[] = [
  "dataAnalysis",
  "computerVisionAI",
  "backendDevelopment",
  "excelVBA",
  "security",
];

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

  return (
    <Column maxWidth="l" gap="80" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      <SectionHeader
        as="h1"
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("subheading")}
      />
      {CATEGORIES.filter((category) => certifications[category]?.length).map((category) => (
        <Column key={category} gap="24">
          <Row gap="12" vertical="center">
            <Heading as="h2" variant="heading-strong-xl">
              {t(`categories.${category}`)}
            </Heading>
            <Tag size="s">{certifications[category].length}</Tag>
          </Row>
          <Grid columns="3" gap="16" m={{ columns: 2 }} s={{ columns: 1 }}>
            {certifications[category].map((cert) => {
              const link = getCertificationLink(cert.link);
              return (
                <Column key={cert.id} background="surface" border radius="l" padding="24" gap="12">
                  <Column gap="4">
                    <Text variant="heading-strong-s">{cert.title}</Text>
                    <Text variant="body-default-s" onBackground="brand-medium">
                      {cert.institution}
                    </Text>
                  </Column>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {cert.description}
                  </Text>
                  <Row gap="4" wrap>
                    {cert.skills.map((skill) => (
                      <Tag key={skill} size="s">
                        {skill}
                      </Tag>
                    ))}
                  </Row>
                  <Column
                    gap="4"
                    marginTop="auto"
                    paddingTop="8"
                    textVariant="label-default-xs"
                    onBackground="neutral-weak"
                  >
                    <Text>{t("issued", { date: cert.issueDate })}</Text>
                    {cert.credentialId && (
                      <Text>{t("credentialId", { id: cert.credentialId })}</Text>
                    )}
                  </Column>
                  {link && (
                    <SmartLink href={link} suffixIcon="arrowUpRight">
                      {t("viewCredential")}
                    </SmartLink>
                  )}
                </Column>
              );
            })}
          </Grid>
        </Column>
      ))}
    </Column>
  );
}
