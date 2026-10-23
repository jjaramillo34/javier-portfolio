"use client";

import type { Skill } from "@/types/portfolio";
import { Column, CountFx, Row, Text, useInViewport, useReducedMotion } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

const FILL_MS = 1200;
const STAGGER_MS = 90;

/** Skill group whose bars grow from 0 and percentages count up the first time it scrolls into view. */
export function SkillCard({ title, skills }: { title: string; skills: Skill[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const { shouldAnimate } = useReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  // Under reduced motion, show final values immediately.
  const filled = seen || !shouldAnimate;

  return (
    <Column ref={ref} background="surface" border radius="l" padding="24" gap="16" fillHeight>
      <Text variant="heading-strong-s">{title}</Text>
      <Column as="ul" gap="12" margin="0" padding="0" style={{ listStyle: "none" }}>
        {skills.map((skill, index) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            filled={filled}
            animate={shouldAnimate}
            delay={shouldAnimate ? index * STAGGER_MS : 0}
          />
        ))}
      </Column>
    </Column>
  );
}

interface SkillRowProps {
  skill: Skill;
  filled: boolean;
  animate: boolean;
  delay: number;
}

/** One bar + percentage; both start together after the row's stagger delay. */
function SkillRow({ skill, filled, animate, delay }: SkillRowProps) {
  const [started, setStarted] = useState(!animate);

  useEffect(() => {
    if (!filled || started) return;
    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [filled, started, delay]);

  const value = started ? skill.level : 0;

  return (
    <Column as="li" gap="4" aria-label={`${skill.name}: ${skill.level}%`}>
      <Row horizontal="between" vertical="center" textVariant="label-default-s" aria-hidden>
        <Text>{skill.name}</Text>
        {animate ? (
          <CountFx
            value={value}
            speed={FILL_MS}
            variant="label-default-s"
            onBackground="neutral-weak"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            %
          </CountFx>
        ) : (
          <Text onBackground="neutral-weak">{skill.level}%</Text>
        )}
      </Row>
      <Row fillWidth height="4" radius="full" background="neutral-alpha-weak" aria-hidden>
        <Row
          height="4"
          radius="full"
          style={{
            // The theme's "contrast" solids are near-black; use the brand orange instead.
            background: "var(--brand-on-background-medium)",
            width: `${value}%`,
            transition: animate ? `width ${FILL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
            // A soft glow along the bar as it grows.
            boxShadow: "0 0 8px var(--brand-alpha-medium)",
          }}
        />
      </Row>
    </Column>
  );
}
