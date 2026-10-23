import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/routing";
import type {
  Achievements,
  Certification,
  Education,
  Language,
  PersonalInfo,
  Project,
  ProjectMedia,
  ProjectRecord,
  Skill,
  SkillCategoryKey,
  Testimonial,
  TimelineCertification,
  WorkExperience,
} from "@/types/portfolio";
import mediaRaw from "./project-media.json";

// Content lives in src/content as JSON files edited through Keystatic (/keystatic). They are
// read at build time, so every page is still statically rendered. Server-only.

const CONTENT_DIR = join(process.cwd(), "src/content");

const readJson = <T>(file: string): T => JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8"));

/** Every entry in a collection folder, with its filename (the slug) as `id`. */
const readCollection = <T>(folder: string): (T & { id: string })[] =>
  readdirSync(join(CONTENT_DIR, folder))
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ ...readJson<T>(join(folder, file)), id: file.replace(/\.json$/, "") }));

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const profile = readJson<{
  personalInfo: PersonalInfo;
  achievements: Achievements;
  education: Education[];
  languages: Language[];
}>("profile.json");

export const personalInfo = profile.personalInfo;
export const achievements = profile.achievements;
export const education = profile.education;
export const languages = profile.languages;
export const skills = readJson<Record<SkillCategoryKey, Skill[]>>("skills.json");

export const workExperience: WorkExperience[] = readCollection<WorkExperience & { order: number }>(
  "experience",
).sort(byOrder);

export const testimonials: Testimonial[] = readCollection<Testimonial & { order: number }>(
  "testimonials",
).sort(byOrder);

const projectMedia = mediaRaw as Record<string, ProjectMedia>;
const projectRecords = readCollection<ProjectRecord>("projects").sort(byOrder);

const localizeProject = (project: ProjectRecord & { id: string }, locale: Locale): Project => {
  const es = locale === "es";
  // The filename is the slug, shared by both locales.
  const slug = project.id;
  return {
    slug,
    category: project.category,
    title: (es && project.titleEs) || project.title,
    period: project.period,
    description: (es && project.descriptionEs) || project.description,
    technologies: project.technologies,
    achievements:
      (es && project.achievementsEs.length > 0 && project.achievementsEs) || project.achievements,
    link: project.link || null,
    image: project.image || null,
    media: projectMedia[slug] ?? null,
  };
};

export const getProjects = (locale: Locale): Project[] =>
  projectRecords.map((project) => localizeProject(project, locale));

export const getProject = (locale: Locale, slug: string): Project | undefined =>
  getProjects(locale).find((project) => project.slug === slug);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Every certification, newest first, with its year parsed from "Sep 2020". */
export const getCertificationTimeline = (): TimelineCertification[] =>
  readCollection<Certification>("certifications")
    .map((cert) => {
      const [month, year] = cert.issueDate.split(" ");
      const monthIndex = Math.max(0, MONTHS.indexOf(month));
      return {
        ...cert,
        link: cert.link || null,
        year: Number(year),
        sortKey: Number(year) * 12 + monthIndex,
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey || a.title.localeCompare(b.title));
