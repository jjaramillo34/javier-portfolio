import type { Testimonial } from "@/types/portfolio";
import { Avatar, Column, Row, Tag, Text } from "@once-ui-system/core";

interface TestimonialCardProps {
  testimonial: Testimonial;
  relationshipLabel: string;
}

export function TestimonialCard({ testimonial, relationshipLabel }: TestimonialCardProps) {
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
      gap="20"
      margin="0"
      fillHeight
    >
      <Text as="blockquote" variant="body-default-m" onBackground="neutral-medium" margin="0">
        “{testimonial.quote}”
      </Text>
      <Row as="figcaption" gap="12" vertical="center" marginTop="auto">
        <Avatar value={initials} size="m" />
        <Column gap="2" flex={1}>
          <Text variant="label-strong-s">{testimonial.name}</Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {testimonial.position} · {testimonial.company}
          </Text>
        </Column>
        <Tag size="s">{relationshipLabel}</Tag>
      </Row>
    </Column>
  );
}
