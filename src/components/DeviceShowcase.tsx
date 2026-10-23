import type { ProjectMedia } from "@/types/portfolio";
import { Column, Icon, Row, Text } from "@once-ui-system/core";
import styles from "./DeviceShowcase.module.scss";
import { ZoomableImage } from "./ZoomableImage";

const domain = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** A fake browser window around a desktop screenshot, used for the hero and gallery. */
export function BrowserFrame({
  url,
  src,
  alt,
  priority,
  compact,
}: {
  url: string;
  src: string;
  alt: string;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <Column
      fillWidth
      radius="l"
      border
      overflow="hidden"
      background="surface"
      shadow={compact ? "m" : "xl"}
    >
      <Row
        fillWidth
        paddingX={compact ? "12" : "16"}
        paddingY={compact ? "8" : "12"}
        gap="12"
        vertical="center"
        borderBottom
        background="neutral-alpha-weak"
      >
        <Row gap="8" aria-hidden>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </Row>
        {!compact && (
          <Row
            flex={1}
            horizontal="center"
            vertical="center"
            gap="8"
            radius="full"
            background="page"
            border
            paddingX="12"
            paddingY="4"
            maxWidth={24}
            style={{ margin: "0 auto" }}
          >
            <Icon name="lock" size="xs" onBackground="neutral-weak" />
            <Text variant="label-default-s" onBackground="neutral-medium" truncate>
              {domain(url)}
            </Text>
          </Row>
        )}
      </Row>
      <ZoomableImage
        src={src}
        alt={alt}
        aspectRatio="16 / 10"
        priority={priority}
        sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 960px"}
      />
    </Column>
  );
}

/** Desktop screenshot in a browser frame with the mobile screenshot in a phone overlapping it. */
export function DeviceShowcase({
  media,
  desktopAlt,
  mobileAlt,
}: {
  media: ProjectMedia;
  desktopAlt: string;
  mobileAlt: string;
}) {
  return (
    <div className={styles.stage}>
      <BrowserFrame url={media.url} src={media.desktop} alt={desktopAlt} priority />
      <div className={styles.phone}>
        <ZoomableImage src={media.mobile} alt={mobileAlt} aspectRatio="390 / 844" sizes="200px" />
      </div>
    </div>
  );
}
