import type { Project } from "@/types/portfolio";
import { Card, Column, Heading, Media, Row, Tag, Text, TiltFx } from "@once-ui-system/core";
import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  href: string;
  categoryLabel: string;
  priority?: boolean;
}

export function ProjectCard({ project, href, categoryLabel, priority }: ProjectCardProps) {
  // Prefer the latest live capture; fall back to the curated cover image.
  const cover = project.media?.desktop ?? project.image;
  return (
    // Subtle 3D tilt toward the cursor; mouse-only and off under reduced motion.
    <TiltFx fillWidth fillHeight radius="l">
      <Card
        href={href}
        fillWidth
        fillHeight
        direction="column"
        radius="l"
        border
        padding="0"
        overflow="hidden"
      >
        {cover ? (
          <Media
            src={cover}
            alt={project.title}
            aspectRatio="16 / 9"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            radius="none"
          />
        ) : (
          <ProjectCover
            title={project.title}
            category={project.category}
            technologies={project.technologies}
          />
        )}
        <Column fillWidth padding="24" gap="12" flex={1}>
          <Row gap="8" vertical="center" horizontal="between">
            <Tag size="s" scheme="brand">
              {categoryLabel}
            </Tag>
            <Text variant="label-default-s" onBackground="neutral-weak">
              {project.period}
            </Text>
          </Row>
          <Heading as="h3" variant="heading-strong-l">
            {project.title}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {project.description}
          </Text>
          <Row gap="4" wrap marginTop="auto" paddingTop="8">
            {project.technologies.slice(0, 4).map((tech) => (
              <Tag key={tech} size="s">
                {tech}
              </Tag>
            ))}
          </Row>
        </Column>
      </Card>
    </TiltFx>
  );
}
