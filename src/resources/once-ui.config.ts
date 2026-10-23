import type { OnceUIDataStyleConfig, OnceUIStyleConfig } from "@once-ui-system/core";

export const style: OnceUIStyleConfig = {
  // Keep "system" so the theme toggle works; defaultTheme is what a first visit sees.
  theme: "system",
  defaultTheme: "system",
  neutral: "sand",
  brand: "orange",
  accent: "cyan",
  solid: "contrast",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "100",
};

export const dataStyle: OnceUIDataStyleConfig = {
  variant: "gradient",
  mode: "categorical",
  height: 24,
  axis: { stroke: "var(--neutral-alpha-weak)" },
  tick: { fill: "var(--neutral-on-background-weak)", fontSize: 11, line: false },
};
