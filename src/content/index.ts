import type { Locale } from "@/i18n/routing";
import type { PortfolioData, Project, ProjectRecord } from "@/types/portfolio";
import raw from "./portfolio-data.json";

// Imported at build time, so every page is statically rendered with its content.
const data = raw as PortfolioData;

export const personalInfo = data.personalInfo;
export const achievements = data.achievements;
export const workExperience = data.workExperience;
export const education = data.education;
export const skills = data.skills;
export const certifications = data.certifications;
export const testimonials = data.testimonials;
export const languages = data.languages;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // strip accents left as combining marks by NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "#" is the JSON's placeholder for "no link".
const realLink = (link: string | undefined) => (link && link !== "#" ? link : null);

const localizeProject = (project: ProjectRecord, locale: Locale): Project => {
  const es = locale === "es";
  return {
    // Slugs come from the English title so both locales share one URL path.
    slug: slugify(project.title),
    category: project.category,
    title: (es && project.titleEs) || project.title,
    period: project.period,
    description: (es && project.descriptionEs) || project.description,
    technologies: project.technologies,
    achievements: (es && project.achievementsEs) || project.achievements,
    link: realLink(project.link),
    image: project.image ?? null,
  };
};

export const getProjects = (locale: Locale): Project[] =>
  [...data.projects].sort((a, b) => a.order - b.order).map((p) => localizeProject(p, locale));

export const getProject = (locale: Locale, slug: string): Project | undefined =>
  getProjects(locale).find((project) => project.slug === slug);

export const getCertificationLink = (link: string) => realLink(link);
