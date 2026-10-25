import { Column, Heading, Line, Row, Text } from "@once-ui-system/core";
import { Fragment } from "react";
import { Reveal } from "./Reveal";
import type { SectionScheme } from "./SectionBand";

interface SectionTitleProps {
  eyebrow: string;
  /** Plain text or rich text; wrap a word in `<Accent>` (or `<em>` via accentTags) to highlight it. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Section number shown before the eyebrow, e.g. 1 → "01". */
  index?: number;
  as?: "h1" | "h2";
  align?: "start" | "center";
  /** Colour of the index number and rule, matching the section's band. */
  scheme?: SectionScheme;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  index,
  as = "h2",
  align = "start",
  scheme = "brand",
}: SectionTitleProps) {
  const centered = align === "center";
  // Page titles render immediately (they are the page's main content); section titles reveal on scroll.
  const Wrapper = as === "h1" ? Fragment : Reveal;

  return (
    <Wrapper>
      <Column
        gap="16"
        maxWidth={40}
        horizontal={centered ? "center" : "start"}
        align={centered ? "center" : "left"}
      >
        <Row gap="12" vertical="center">
          {index !== undefined && (
            <Text variant="code-default-s" onBackground={`${scheme}-medium`}>
              {String(index).padStart(2, "0")}
            </Text>
          )}
          <Line background={`${scheme}-alpha-strong`} width="24" />
          <Text variant="label-default-s" onBackground="neutral-medium">
            {eyebrow}
          </Text>
        </Row>
        <Heading as={as} variant={as === "h1" ? "display-strong-m" : "display-strong-s"}>
          {title}
        </Heading>
        {description && (
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
            {description}
          </Text>
        )}
      </Column>
    </Wrapper>
  );
}
