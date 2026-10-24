import type { ProjectCategory } from "@/types/portfolio";
import { Icon, type IconName } from "@once-ui-system/core";
import styles from "./ProjectCover.module.scss";

const CATEGORY_ICON: Record<ProjectCategory, IconName> = {
  "full-stack": "code",
  data: "barChart",
  automation: "bolt",
  api: "cube",
};

/** Initials from the first two words that start with a letter or digit ("Iconyc - BigApps" → "IB"). */
export const projectMonogram = (title: string) =>
  title
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

interface ProjectCoverProps {
  title: string;
  category: ProjectCategory;
  technologies: string[];
  aspectRatio?: string;
}

/** Designed placeholder for projects without a screenshot or cover image. */
export function ProjectCover({
  title,
  category,
  technologies,
  aspectRatio = "16 / 9",
}: ProjectCoverProps) {
  return (
    <div className={styles.cover} style={{ aspectRatio }} aria-hidden>
      <div className={styles.dots} />
      <span className={styles.monogram}>{projectMonogram(title)}</span>
      <div className={styles.tile}>
        <Icon name={CATEGORY_ICON[category]} size="l" />
      </div>
      <div className={styles.stack}>
        {technologies.slice(0, 3).map((tech) => (
          <span key={tech} className={styles.chip}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
