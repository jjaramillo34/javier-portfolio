import { type Locale, localePath } from "@/i18n/routing";
import { Button, Column, Heading, Text } from "@once-ui-system/core";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("notFound");

  return (
    <Column maxWidth="s" gap="16" paddingY="160" horizontal="center" align="center">
      <Text variant="display-strong-xl" onBackground="brand-medium">
        404
      </Text>
      <Heading as="h1" variant="display-strong-xs">
        {t("title")}
      </Heading>
      <Text onBackground="neutral-weak">{t("body")}</Text>
      <Column paddingTop="16" data-border="rounded">
        <Button href={localePath(locale, "/")} variant="secondary" prefixIcon="home">
          {t("home")}
        </Button>
      </Column>
    </Column>
  );
}
