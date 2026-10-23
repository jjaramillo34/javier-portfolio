import { Background, Column, Grid, Heading, Icon, Row, Text } from "@once-ui-system/core";
import { getTranslations } from "next-intl/server";
import { HiHeart } from "react-icons/hi2";
import { accentTags } from "./Accent";
import styles from "./Dedication.module.scss";

// Fixed values (not random) so server and client render the same hearts.
const HEARTS = [
  { left: 4, size: 14, delay: 0, duration: 11, sway: "18px", restTop: 70 },
  { left: 12, size: 22, delay: 3.5, duration: 13, sway: "-14px", restTop: 30 },
  { left: 21, size: 12, delay: 7, duration: 10, sway: "10px", restTop: 85 },
  { left: 30, size: 18, delay: 1.5, duration: 12, sway: "-20px", restTop: 15 },
  { left: 41, size: 10, delay: 9, duration: 9, sway: "12px", restTop: 55 },
  { left: 52, size: 20, delay: 5, duration: 14, sway: "-10px", restTop: 80 },
  { left: 61, size: 14, delay: 2, duration: 11, sway: "16px", restTop: 40 },
  { left: 70, size: 24, delay: 8, duration: 15, sway: "-18px", restTop: 10 },
  { left: 79, size: 12, delay: 4, duration: 10, sway: "14px", restTop: 65 },
  { left: 87, size: 18, delay: 10, duration: 13, sway: "-12px", restTop: 25 },
  { left: 94, size: 14, delay: 6, duration: 12, sway: "10px", restTop: 50 },
];

const FAMILY = ["cris", "sofia", "mateo"] as const;

/** "Why I built this": the dedication to Javier's family, with floating hearts behind it. */
export async function Dedication() {
  const t = await getTranslations("about");

  return (
    <Column
      as="section"
      fillWidth
      background="surface"
      border="brand-alpha-medium"
      radius="xl"
      paddingX="64"
      paddingY="80"
      gap="40"
      horizontal="center"
      s={{ paddingX: "24", paddingY: "48" }}
    >
      <Background
        position="absolute"
        top="0"
        left="0"
        fill
        pointerEvents="none"
        radius="xl"
        gradient={{
          display: true,
          colorStart: "brand-alpha-medium",
          colorEnd: "static-transparent",
          x: 50,
          y: 100,
          width: 140,
          height: 70,
          opacity: 50,
        }}
      />
      <div className={styles.hearts} aria-hidden>
        {HEARTS.map((heart) => (
          <span
            key={heart.left}
            className={styles.heart}
            style={
              {
                left: `${heart.left}%`,
                // Negative delay: hearts start mid-flight, already spread out on load.
                "--delay": `-${heart.delay}s`,
                "--duration": `${heart.duration}s`,
                "--sway": heart.sway,
                "--rest-top": `${heart.restTop}%`,
              } as React.CSSProperties
            }
          >
            <HiHeart size={heart.size} />
          </span>
        ))}
      </div>

      <Column zIndex={1} gap="24" maxWidth={40} horizontal="center" align="center">
        <Row gap="12" vertical="center">
          <Icon name="heartFill" size="s" onBackground="brand-medium" />
          <Text variant="label-default-s" onBackground="brand-medium">
            {t("storyEyebrow")}
          </Text>
          <Icon name="heartFill" size="s" onBackground="brand-medium" />
        </Row>
        <Heading as="h2" variant="display-strong-m" wrap="balance">
          {t.rich("storyLead", accentTags)}
        </Heading>
      </Column>

      <Grid zIndex={1} columns="3" gap="16" fillWidth maxWidth={40} s={{ gap: "8" }}>
        {FAMILY.map((member) => (
          <Column
            key={member}
            className={styles.familyCard}
            background="page"
            border="brand-alpha-medium"
            radius="l"
            paddingY="24"
            paddingX="8"
            gap="8"
            horizontal="center"
            align="center"
          >
            <Row
              center
              width="48"
              height="48"
              radius="full"
              background="brand-alpha-weak"
              border="brand-alpha-medium"
            >
              <Icon name="heartFill" onBackground="brand-medium" className={styles.beat} />
            </Row>
            <Text variant="heading-strong-l">{t(`familyNames.${member}`)}</Text>
            <Text variant="label-default-s" onBackground="neutral-weak">
              {t(`family.${member}`)}
            </Text>
          </Column>
        ))}
      </Grid>

      <Column zIndex={1} gap="20" maxWidth={40}>
        <Text variant="body-default-xl" onBackground="neutral-strong">
          {t("storyP1")}
        </Text>
        <Text variant="body-default-l" onBackground="neutral-medium">
          {t("storyP2")}
        </Text>
        <Text variant="body-default-l" onBackground="neutral-medium">
          {t("storyP3")}
        </Text>
      </Column>

      <Column
        zIndex={1}
        gap="12"
        maxWidth={40}
        fillWidth
        paddingTop="24"
        borderTop="brand-alpha-medium"
      >
        <Row gap="12" vertical="start">
          <Icon name="heartFill" onBackground="brand-medium" size="s" marginTop="2" />
          <Text variant="body-default-m" onBackground="neutral-weak">
            {t("storyThanks")}
          </Text>
        </Row>
        <Text variant="heading-default-l" onBackground="brand-medium" align="right">
          — {t("storySignature")}
        </Text>
      </Column>
    </Column>
  );
}
