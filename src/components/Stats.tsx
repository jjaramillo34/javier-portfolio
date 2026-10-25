"use client";

import {
  Column,
  CountFx,
  Grid,
  Icon,
  type IconName,
  Row,
  Text,
  useInViewport,
} from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";
import type { SectionScheme } from "./SectionBand";

export interface Stat {
  /** Display value such as "15+", "93%" or "1M+"; the number part counts up. */
  value: string;
  label: string;
  icon?: IconName;
  /** Colour for the icon tile and the card's corner tint. */
  scheme?: SectionScheme;
}

const parse = (value: string) => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return match ? { number: Number(match[1]), suffix: match[2] } : null;
};

export function Stats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  return (
    <Grid ref={ref} fillWidth columns="4" gap="16" m={{ columns: 2 }}>
      {stats.map((stat) => {
        const parsed = parse(stat.value);
        const scheme = stat.scheme ?? "brand";
        return (
          <Column
            key={stat.label}
            background="surface"
            border
            radius="l"
            padding="24"
            gap="4"
            // Tint layered over the surface colour, fading from the top-left corner.
            style={{
              backgroundImage: `linear-gradient(135deg, var(--${scheme}-alpha-weak), transparent 65%)`,
            }}
          >
            {stat.icon && (
              <Row
                center
                width="40"
                height="40"
                radius="m"
                marginBottom="12"
                background={`${scheme}-alpha-weak`}
                border={`${scheme}-alpha-medium`}
              >
                <Icon name={stat.icon} size="s" onBackground={`${scheme}-medium`} />
              </Row>
            )}
            {parsed ? (
              <CountFx
                value={seen ? parsed.number : 0}
                speed={1200}
                variant="display-strong-s"
                onBackground="neutral-strong"
              >
                {parsed.suffix}
              </CountFx>
            ) : (
              <Text variant="display-strong-s" onBackground="neutral-strong">
                {stat.value}
              </Text>
            )}
            <Text variant="label-default-s" onBackground="neutral-weak">
              {stat.label}
            </Text>
          </Column>
        );
      })}
    </Grid>
  );
}
