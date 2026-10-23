"use client";

import { Column, ParticleFx } from "@once-ui-system/core";
import { useRef } from "react";

/**
 * Hero section with an interactive particle field behind its content.
 *
 * ParticleFx positions particles in container-query units, so it must be a sized
 * layer rather than a wrapper. It only listens for mouse moves on itself, so moves
 * over the content are forwarded to it; the content stays fully clickable.
 */
export function ParticleHero({ children }: { children: React.ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);

  return (
    <Column
      fillWidth
      horizontal="center"
      paddingTop="80"
      paddingBottom="40"
      s={{ paddingTop: "40" }}
      onMouseMove={(event) =>
        layer.current?.dispatchEvent(
          new MouseEvent("mousemove", { clientX: event.clientX, clientY: event.clientY }),
        )
      }
    >
      <ParticleFx
        ref={layer}
        position="absolute"
        top="0"
        left="0"
        interactive
        mode="repel"
        density={90}
        speed={0.25}
        intensity={25}
        color="brand-on-background-medium"
        opacity={70}
        aria-hidden
      />
      <Column fillWidth horizontal="center" zIndex={1}>
        {children}
      </Column>
    </Column>
  );
}
