import type { Locale } from "@/i18n/routing";
import type {
  CertificationCategoryKey,
  PortfolioData,
  Project,
  ProjectMedia,
  ProjectRecord,
  TimelineCertification,
} from "@/types/portfolio";
import raw from "./portfolio-data.json";
import mediaRaw from "./project-media.json";

// Imported at build time, so every page is statically rendered with its content.
const data = raw as PortfolioData;
const projectMedia = mediaRaw as Record<string, ProjectMedia>;

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
  // Slugs come from the English title so both locales share one URL path.
  const slug = slugify(project.title);
  return {
    slug,
    category: project.category,
    title: (es && project.titleEs) || project.title,
    period: project.period,
    description: (es && project.descriptionEs) || project.description,
    technologies: project.technologies,
    achievements: (es && project.achievementsEs) || project.achievements,
    link: realLink(project.link),
    image: project.image ?? null,
    media: projectMedia[slug] ?? null,
  };
};

export const getProjects = (locale: Locale): Project[] =>
  [...data.projects].sort((a, b) => a.order - b.order).map((p) => localizeProject(p, locale));

export const getProject = (locale: Locale, slug: string): Project | undefined =>
  getProjects(locale).find((project) => project.slug === slug);

export const getCertificationLink = (link: string) => realLink(link);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Every certification, newest first, with its category and year ("Sep 2020"). */
export const getCertificationTimeline = (): TimelineCertification[] =>
  (
    Object.entries(certifications) as [
      CertificationCategoryKey,
      PortfolioData["certifications"][CertificationCategoryKey],
    ][]
  )
    .flatMap(([category, list]) =>
      list.map((cert) => {
        const [month, year] = cert.issueDate.split(" ");
        const monthIndex = Math.max(0, MONTHS.indexOf(month));
        return { ...cert, category, year: Number(year), sortKey: Number(year) * 12 + monthIndex };
      }),
    )
    .sort((a, b) => b.sortKey - a.sortKey || a.title.localeCompare(b.title));
