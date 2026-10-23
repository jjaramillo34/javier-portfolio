"use client";

import { Column, RevealFx, useInViewport, useReducedMotion } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

/** Fades and lifts its children in once, the first time they scroll into view. */
export function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const { shouldAnimate } = useReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  return (
    <Column ref={ref} fillWidth>
      <RevealFx
        fillWidth
        // Column so a Grid child stretches to full width instead of shrinking to its content.
        direction="column"
        speed="fast"
        translateY="12"
        delay={delay}
        revealed={seen || !shouldAnimate}
        revealedByDefault={!shouldAnimate}
      >
        {children}
      </RevealFx>
    </Column>
  );
}
