import { Column, Heading, Text } from "@once-ui-system/core";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  as = "h2",
  align = "start",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Column
      gap="12"
      maxWidth={40}
      horizontal={centered ? "center" : "start"}
      align={centered ? "center" : "left"}
    >
      <Text variant="label-default-s" onBackground="brand-medium">
        {eyebrow}
      </Text>
      <Heading as={as} variant={as === "h1" ? "display-strong-s" : "display-strong-xs"}>
        {title}
      </Heading>
      {description && (
        <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
          {description}
        </Text>
      )}
    </Column>
  );
}
