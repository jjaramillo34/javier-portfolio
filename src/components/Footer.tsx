import { personalInfo } from "@/content";
import { resumeHref } from "@/resources/site";
import { Column, IconButton, Row, Text } from "@once-ui-system/core";
import { getTranslations } from "next-intl/server";
import { VisitorCount } from "./VisitorCount";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <Column as="footer" fillWidth horizontal="center" padding="8" paddingBottom="24">
      <Row
        maxWidth="m"
        paddingX="16"
        paddingY="8"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{ direction: "column", horizontal: "center" }}
      >
        <Row gap="12" vertical="center" wrap s={{ horizontal: "center" }}>
          <Text variant="body-default-s" onBackground="neutral-weak">
            © {year} {personalInfo.name}. {t("rights")}
          </Text>
          <VisitorCount />
        </Row>
        <Row gap="8">
          <IconButton
            href={personalInfo.github}
            icon="github"
            tooltip="GitHub"
            size="s"
            variant="ghost"
          />
          <IconButton
            href={personalInfo.linkedin}
            icon="linkedin"
            tooltip="LinkedIn"
            size="s"
            variant="ghost"
          />
          <IconButton
            href={`mailto:${personalInfo.email}`}
            icon="mail"
            tooltip="Email"
            size="s"
            variant="ghost"
          />
          <IconButton
            href={resumeHref}
            icon="document"
            tooltip={t("resume")}
            size="s"
            variant="ghost"
          />
        </Row>
      </Row>
      {/* Leaves room for the fixed bottom nav on phones. */}
      <Row height="80" hide s={{ hide: false }} />
    </Column>
  );
}
