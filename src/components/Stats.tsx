"use client";

import { Column, CountFx, Grid, Text, useInViewport } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

export interface Stat {
  /** Display value such as "15+", "93%" or "1M+"; the number part counts up. */
  value: string;
  label: string;
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
        return (
          <Column key={stat.label} background="surface" border radius="l" padding="24" gap="4">
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
