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

export interface WorkExperience {
  id: number;
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

export type ProjectCategory = "data" | "full-stack" | "automation";

/** Project as stored in the JSON, with optional Spanish fields. */
export interface ProjectRecord {
  id: number;
  order: number;
  category: ProjectCategory;
  title: string;
  titleEs?: string;
  period: string;
  description: string;
  descriptionEs?: string;
  technologies: string[];
  achievements: string[];
  achievementsEs?: string[];
  link: string;
  image?: string;
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
  id: number;
  title: string;
  institution: string;
  issueDate: string;
  credentialId: string | null;
  skills: string[];
  description: string;
  link: string;
}

export type CertificationCategoryKey =
  | "backendDevelopment"
  | "computerVisionAI"
  | "dataAnalysis"
  | "excelVBA"
  | "security";

export type RelationshipType = "manager" | "colleague" | "teacher" | "client";

export interface Testimonial {
  id: number;
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

export interface PortfolioData {
  personalInfo: PersonalInfo;
  achievements: Achievements;
  workExperience: WorkExperience[];
  education: Education[];
  projects: ProjectRecord[];
  skills: Record<SkillCategoryKey, Skill[]>;
  certifications: Record<CertificationCategoryKey, Certification[]>;
  testimonials: Testimonial[];
  languages: Language[];
}
