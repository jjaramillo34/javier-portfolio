import styles from "./Accent.module.scss";

/** Highlights part of a heading with the brand gradient. Used as the `<em>` tag in rich messages. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className={styles.accent}>{children}</span>;
}

/** Rich-text tag map for next-intl: `t.rich("key", accentTags)` turns `<em>…</em>` into an Accent. */
export const accentTags = {
  em: (chunks: React.ReactNode) => <Accent>{chunks}</Accent>,
};
