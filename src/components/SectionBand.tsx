import styles from "./SectionBand.module.scss";

export type SectionScheme = "brand" | "accent" | "info" | "success" | "warning";

interface SectionBandProps {
  scheme: SectionScheme;
  /** Which side the soft glow sits on; alternate between sections for rhythm. */
  glow?: "left" | "right";
  children: React.ReactNode;
}

/** Gives a page section its own soft, full-width colour so consecutive sections read apart. */
export function SectionBand({ scheme, glow = "left", children }: SectionBandProps) {
  return (
    <div
      className={styles.band}
      data-glow={glow}
      style={
        {
          "--band": `var(--${scheme}-alpha-weak)`,
          "--band-strong": `var(--${scheme}-alpha-medium)`,
        } as React.CSSProperties
      }
    >
      <div className={styles.bg} aria-hidden />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
