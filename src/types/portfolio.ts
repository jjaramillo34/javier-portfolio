export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  location: string;
  linkedin: string;
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

export interface Project {
  id: number;
  title: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  link: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  languages: Skill[];
  frontend: Skill[];
  dataVisualization: Skill[];
  cloud: Skill[];
  databases: Skill[];
  tools: Skill[];
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

export interface CertificationCategory {
  backendDevelopment: Certification[];
  computerVisionAI: Certification[];
  dataAnalysis: Certification[];
  excelVBA: Certification[];
  security: Certification[];
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  relationship: string;
  relationshipType: 'manager' | 'colleague' | 'teacher' | 'client';
  date: string;
  quote: string;
  avatar?: string;
}

export interface Translation {
  [key: string]: any;
}

export interface Translations {
  en: Translation;
  es: Translation;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory;
  certifications: CertificationCategory;
  testimonials: Testimonial[];
  languages: Language[];
  achievements: Achievements;
  translations: Translations;
}
