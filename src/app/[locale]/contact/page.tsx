import { accentTags } from "@/components/Accent";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/SectionTitle";
import { personalInfo } from "@/content";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { Column, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import type { IconName } from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function Contact({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const channels: { icon: IconName; label: string; value: string; href?: string }[] = [
    {
      icon: "mail",
      label: t("email"),
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/jaramillohub",
      href: personalInfo.linkedin,
    },
    {
      icon: "github",
      label: "GitHub",
      value: "github.com/jjaramillo34",
      href: personalInfo.github,
    },
    { icon: "mapPin", label: t("location"), value: personalInfo.location },
  ];

  return (
    <Column maxWidth="l" gap="40" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      <SectionTitle
        as="h1"
        eyebrow={t("eyebrow")}
        title={t.rich("heading", accentTags)}
        description={t("subheading")}
      />
      <Row gap="40" s={{ direction: "column" }}>
        <Column flex={3} background="surface" border radius="l" padding="32" s={{ padding: "24" }}>
          <ContactForm />
        </Column>
        <Column flex={2} gap="16">
          <Text variant="label-default-s" onBackground="neutral-weak">
            {t("directly")}
          </Text>
          {channels.map((channel) => (
            <Row key={channel.label} gap="16" vertical="center">
              <Row
                center
                width="40"
                height="40"
                radius="m"
                background="brand-alpha-weak"
                border="brand-alpha-medium"
              >
                <Icon name={channel.icon} size="s" onBackground="brand-medium" />
              </Row>
              <Column gap="2">
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {channel.label}
                </Text>
                {channel.href ? (
                  <SmartLink href={channel.href}>{channel.value}</SmartLink>
                ) : (
                  <Text variant="body-default-s">{channel.value}</Text>
                )}
              </Column>
            </Row>
          ))}
        </Column>
      </Row>
    </Column>
  );
}
