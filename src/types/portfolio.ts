export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  location: string;
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  summary: string;
}

// Entries are stored one JSON file per item (edited in Keystatic); `id` is the filename slug.

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  location: string;
}

export type ProjectCategory = "data" | "full-stack" | "automation" | "api";

/** Project as stored in src/content/projects/<slug>.json; empty Spanish fields fall back to English. */
export interface ProjectRecord {
  order: number;
  category: ProjectCategory;
  title: string;
  titleEs: string;
  period: string;
  description: string;
  descriptionEs: string;
  technologies: string[];
  achievements: string[];
  achievementsEs: string[];
  link: string | null;
  image: string;
}

/** Live-site screenshots and metadata captured by scripts/capture-projects.mjs. */
export interface ProjectMedia {
  url: string;
  capturedAt: string;
  siteTitle: string;
  siteDescription: string;
  desktop: string;
  mobile: string;
  gallery: string[];
}

/** Project resolved for one locale. */
export interface Project {
  slug: string;
  category: ProjectCategory;
  title: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  link: string | null;
  image: string | null;
  media: ProjectMedia | null;
}

export interface Skill {
  name: string;
  level: number;
}

export type SkillCategoryKey =
  | "languages"
  | "frontend"
  | "dataVisualization"
  | "cloud"
  | "databases"
  | "tools";

export interface Certification {
  id: string;
  title: string;
  institution: string;
  issueDate: string;
  category: CertificationCategoryKey;
  credentialId: string;
  skills: string[];
  description: string;
  link: string | null;
}

export type CertificationCategoryKey =
  | "backendDevelopment"
  | "computerVisionAI"
  | "dataAnalysis"
  | "excelVBA"
  | "security";

/** A certification with its category and parsed issue date, for the timeline. */
export interface TimelineCertification extends Certification {
  /** Months since year 0, for sorting ("Sep 2020" → 2020 * 12 + 8). */
  sortKey: number;
  year: number;
}

export type RelationshipType = "manager" | "colleague" | "teacher" | "client";

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  relationship: string;
  relationshipType: RelationshipType;
  date: string;
  quote: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Achievements {
  yearsOfExperience: number;
  projectsCompleted: number;
  dataPointsProcessed: string;
  satisfactionRate: number;
}
