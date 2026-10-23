"use client";

import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import type { WorkExperience } from "@/types/portfolio";
import { Column, Row, Tag, Text } from "@once-ui-system/core";

interface ExperienceTimelineProps {
  jobs: WorkExperience[];
  presentLabel: string;
}

/** Career timeline whose rail fills in brand colour as you scroll, lighting each dot it reaches. */
export function ExperienceTimeline({ jobs, presentLabel }: ExperienceTimelineProps) {
  const { listRef, markerRef, rail, reached } = useTimelineProgress();

  return (
    <Column
      as="ol"
      ref={listRef}
      gap="0"
      margin="0"
      padding="0"
      position="relative"
      style={{ listStyle: "none" }}
    >
      {/* Rail track and its scroll-driven fill, centred on the 16px dot column. */}
      <Row
        position="absolute"
        left="0"
        background="neutral-alpha-medium"
        aria-hidden
        style={{ top: rail.top, height: rail.height, width: 2, marginLeft: 7 }}
      />
      <Row
        position="absolute"
        left="0"
        aria-hidden
        style={{
          // The theme's "contrast" solids are near-black; use the brand orange instead.
          background: "var(--brand-on-background-medium)",
          top: rail.top,
          height: rail.fill,
          width: 2,
          marginLeft: 7,
          transition: "height 120ms linear",
        }}
      />
      {jobs.map((job, index) => {
        const current = /present/i.test(job.period);
        const lit = index < reached;
        return (
          <Row as="li" key={job.id} gap="24">
            <Column horizontal="center" minWidth="16" paddingTop="8" zIndex={1}>
              <Row
                ref={markerRef(index)}
                width="12"
                height="12"
                radius="full"
                background="page"
                border={lit ? "brand-alpha-strong" : "neutral-alpha-strong"}
                transition="micro-medium"
                style={{
                  background: lit ? "var(--brand-on-background-medium)" : undefined,
                  // Soft halo once the fill reaches this role.
                  boxShadow: lit ? "0 0 0 4px var(--brand-alpha-weak)" : "none",
                  transform: lit ? "scale(1.15)" : "scale(1)",
                }}
              />
            </Column>
            <Column flex={1} gap="8" paddingBottom="40">
              <Row
                fillWidth
                horizontal="between"
                vertical="center"
                gap="12"
                s={{ direction: "column", vertical: "start" }}
              >
                <Column gap="4">
                  <Text variant="heading-strong-m">{job.title}</Text>
                  <Text variant="body-default-s" onBackground="brand-medium">
                    {job.company} · {job.location}
                  </Text>
                </Column>
                <Tag size="s" scheme={current ? "brand" : "neutral"}>
                  {job.period.replace("Present", presentLabel)}
                </Tag>
              </Row>
              <Column as="ul" gap="8" margin="0" paddingLeft="20">
                {job.achievements.map((achievement) => (
                  <Text
                    as="li"
                    key={achievement}
                    variant="body-default-m"
                    onBackground="neutral-weak"
                  >
                    {achievement}
                  </Text>
                ))}
              </Column>
            </Column>
          </Row>
        );
      })}
    </Column>
  );
}
