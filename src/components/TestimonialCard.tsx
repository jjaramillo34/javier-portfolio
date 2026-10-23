"use client";

import type { Testimonial } from "@/types/portfolio";
import { Avatar, Button, Column, Icon, Row, Tag, Text } from "@once-ui-system/core";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.scss";

interface TestimonialCardProps {
  testimonial: Testimonial;
  relationshipLabel: string;
  readMoreLabel: string;
  readLessLabel: string;
}

export function TestimonialCard({
  testimonial,
  relationshipLabel,
  readMoreLabel,
  readLessLabel,
}: TestimonialCardProps) {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [expanded, setExpanded] = useState(false);
  // Only offer "Read more" when the clamped quote is actually cut off.
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const quote = quoteRef.current;
    if (!quote || expanded) return;
    const measure = () => setTruncated(quote.scrollHeight > quote.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(quote);
    return () => observer.disconnect();
  }, [expanded]);

  const initials = testimonial.name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <Column
      as="figure"
      background="surface"
      border
      radius="l"
      padding="24"
      gap="16"
      margin="0"
      fillHeight
    >
      <Row horizontal="between" vertical="center">
        <Icon name="chat" onBackground="brand-medium" />
        <Tag size="s">{relationshipLabel}</Tag>
      </Row>
      <Column gap="8" flex={1} horizontal="start">
        <Text
          as="blockquote"
          ref={quoteRef}
          variant="body-default-m"
          onBackground="neutral-medium"
          margin="0"
          className={expanded ? undefined : styles.clamp}
        >
          “{testimonial.quote}”
        </Text>
        {(truncated || expanded) && (
          <Button
            variant="tertiary"
            size="s"
            suffixIcon={expanded ? "chevronUp" : "chevronDown"}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? readLessLabel : readMoreLabel}
          </Button>
        )}
      </Column>
      <Row as="figcaption" gap="12" vertical="center" paddingTop="16" borderTop>
        <Avatar value={initials} size="m" />
        <Column gap="2" flex={1}>
          <Text variant="label-strong-s">{testimonial.name}</Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {testimonial.position} · {testimonial.company}
          </Text>
        </Column>
      </Row>
    </Column>
  );
}
