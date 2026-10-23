"use client";

import type { Project, ProjectCategory } from "@/types/portfolio";
import { Column, Grid, SegmentedControl } from "@once-ui-system/core";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

interface WorkGridProps {
  projects: (Project & { href: string })[];
  allLabel: string;
  categoryLabels: Record<ProjectCategory, string>;
}

export function WorkGrid({ projects, allLabel, categoryLabels }: WorkGridProps) {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  // Only offer filters for categories that actually have projects.
  const categories = (Object.keys(categoryLabels) as ProjectCategory[]).filter((category) =>
    projects.some((project) => project.category === category),
  );
  const visible =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <Column fillWidth gap="32">
      <SegmentedControl
        fillWidth={false}
        value={filter}
        onChange={(value) => setFilter(value as "all" | ProjectCategory)}
        buttons={[
          { value: "all", label: allLabel },
          ...categories.map((category) => ({ value: category, label: categoryLabels[category] })),
        ]}
      />
      <Grid columns="2" gap="24" s={{ columns: 1 }}>
        {visible.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            href={project.href}
            categoryLabel={categoryLabels[project.category]}
            priority={index < 2}
          />
        ))}
      </Grid>
    </Column>
  );
}
