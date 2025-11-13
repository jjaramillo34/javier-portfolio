import { createClient } from 'contentful';
import type {
  Achievements,
  Certification,
  CertificationCategory,
  Language,
  PersonalInfo,
  PortfolioData,
  Project,
  Skill,
  SkillCategory,
  Testimonial,
  Translation,
  Translations,
  WorkExperience,
  Education,
} from '../types/portfolio';

type LocaleKey = 'en' | 'es';

type PersonalInfoFields = PersonalInfo;

interface WorkExperienceFields extends Omit<WorkExperience, 'id' | 'achievements'> {
  id?: number;
  order?: number;
  achievements?: string[];
}

interface EducationFields extends Education {
  order?: number;
}

interface ProjectFields extends Omit<Project, 'id' | 'achievements' | 'technologies'> {
  id?: number;
  order?: number;
  achievements?: string[];
  technologies?: string[];
}

interface SkillFields extends Skill {
  category: keyof SkillCategory;
  order?: number;
}

interface CertificationFields extends Omit<Certification, 'id' | 'skills'> {
  id?: number;
  order?: number;
  skills?: string[];
  category: keyof CertificationCategory;
}

interface TestimonialFields extends Omit<Testimonial, 'id'> {
  id?: number;
  order?: number;
}

interface LanguageFields extends Language {
  order?: number;
}

type AchievementsFields = Achievements;

interface TranslationFields {
  payload: Translation;
}

const CONTENTFUL_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT ?? 'master';
const CONTENTFUL_DELIVERY_TOKEN = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
const CONTENTFUL_PREVIEW_TOKEN = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN;
const CONTENTFUL_USE_PREVIEW = import.meta.env.VITE_CONTENTFUL_USE_PREVIEW === 'true';

export const isContentfulConfigured =
  Boolean(CONTENTFUL_SPACE_ID) && Boolean(CONTENTFUL_DELIVERY_TOKEN || CONTENTFUL_PREVIEW_TOKEN);

type ContentfulClient = ReturnType<typeof createClient>;

const contentfulClient: ContentfulClient | null = isContentfulConfigured
  ? createClient({
      space: CONTENTFUL_SPACE_ID,
      environment: CONTENTFUL_ENVIRONMENT,
      accessToken: CONTENTFUL_USE_PREVIEW && CONTENTFUL_PREVIEW_TOKEN
        ? CONTENTFUL_PREVIEW_TOKEN
        : CONTENTFUL_DELIVERY_TOKEN ?? '',
      host: CONTENTFUL_USE_PREVIEW ? 'preview.contentful.com' : undefined,
    })
  : null;

const CONTENT_TYPE = {
  personalInfo: 'personalInfo',
  workExperience: 'workExperience',
  education: 'education',
  project: 'project',
  skill: 'skill',
  certification: 'certification',
  testimonial: 'testimonial',
  language: 'language',
  achievements: 'portfolioStats',
  translations: 'translations',
} as const;

const CATEGORY_KEYS: (keyof SkillCategory)[] = [
  'languages',
  'frontend',
  'dataVisualization',
  'cloud',
  'databases',
  'tools',
];

const CERTIFICATION_CATEGORY_KEYS: (keyof CertificationCategory)[] = [
  'backendDevelopment',
  'computerVisionAI',
  'dataAnalysis',
  'excelVBA',
  'security',
];

const toContentfulLocale = (locale: LocaleKey): string => {
  if (locale === 'es') {
    return import.meta.env.VITE_CONTENTFUL_LOCALE_ES ?? 'es-ES';
  }
  return import.meta.env.VITE_CONTENTFUL_LOCALE_EN ?? 'en-US';
};

const ensureClient = (): ContentfulClient => {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured. Check your environment variables.');
  }
  return contentfulClient;
};

type ContentfulEntry<T> = { fields: T };

const getSingleEntry = async <T>(
  contentType: string,
  locale: string,
  fallbackLocale?: string,
): Promise<ContentfulEntry<T>> => {
  const client = ensureClient();
  const response = (await client.getEntries({
    content_type: contentType,
    limit: 1,
    locale,
  })) as unknown as { items: ContentfulEntry<T>[] };

  if (response.items.length > 0) {
    return response.items[0];
  }

  if (fallbackLocale) {
    const fallbackResponse = (await client.getEntries({
      content_type: contentType,
      limit: 1,
      locale: fallbackLocale,
    })) as unknown as { items: ContentfulEntry<T>[] };
    if (fallbackResponse.items.length > 0) {
      return fallbackResponse.items[0];
    }
  }

  throw new Error(`Missing entry for content type ${contentType} in locale ${locale}`);
};

const getCollection = async <T>(
  contentType: string,
  locale: string,
  orderFields: string[] = ['fields.order', 'fields.id'],
): Promise<ContentfulEntry<T>[]> => {
  const client = ensureClient();
  const response = (await client.getEntries({
    content_type: contentType,
    limit: 1000,
    locale,
    order: orderFields as any,
  })) as unknown as { items: ContentfulEntry<T>[] };
  return response.items;
};

const mapWorkExperience = (entries: ContentfulEntry<WorkExperienceFields>[]): WorkExperience[] =>
  entries.map((entry, index) => ({
    id: entry.fields.id ?? entry.fields.order ?? index + 1,
    title: entry.fields.title,
    company: entry.fields.company,
    period: entry.fields.period,
    location: entry.fields.location,
    achievements: entry.fields.achievements ?? [],
  }));

const mapEducation = (entries: ContentfulEntry<EducationFields>[]): Education[] =>
  entries.map((entry) => ({
    degree: entry.fields.degree,
    school: entry.fields.school,
    period: entry.fields.period,
    location: entry.fields.location,
  }));

const mapProjects = (entries: ContentfulEntry<ProjectFields>[]): Project[] =>
  entries.map((entry, index) => ({
    id: entry.fields.id ?? entry.fields.order ?? index + 1,
    title: entry.fields.title,
    period: entry.fields.period,
    description: entry.fields.description,
    technologies: entry.fields.technologies ?? [],
    achievements: entry.fields.achievements ?? [],
    link: entry.fields.link,
  }));

const mapSkills = (entries: ContentfulEntry<SkillFields>[]): SkillCategory => {
  const base: SkillCategory = CATEGORY_KEYS.reduce(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as SkillCategory,
  );

  const grouped = new Map<keyof SkillCategory, { name: string; level: number; order: number }[]>();

  entries.forEach((entry) => {
    const category = entry.fields.category;
    if (!category || !base[category]) return;

    const existing = grouped.get(category) ?? [];
    existing.push({
      name: entry.fields.name,
      level: entry.fields.level ?? 0,
      order: entry.fields.order ?? existing.length,
    });
    grouped.set(category, existing);
  });

  CATEGORY_KEYS.forEach((key) => {
    const items = grouped.get(key) ?? [];
    items.sort((a, b) => a.order - b.order);
    base[key] = items.map(({ name, level }) => ({ name, level }));
  });

  return base;
};

const mapCertifications = (entries: ContentfulEntry<CertificationFields>[]): CertificationCategory => {
  const base: CertificationCategory = CERTIFICATION_CATEGORY_KEYS.reduce(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as CertificationCategory,
  );

  entries.forEach((entry, index) => {
    const category = entry.fields.category;
    if (category && base[category]) {
      const { category: _category, order: _order, ...fields } = entry.fields;
      base[category].push({
        ...fields,
        id: entry.fields.id ?? entry.fields.order ?? index + 1,
        skills: fields.skills ?? [],
      });
    }
  });

  return base;
};

const mapTestimonials = (entries: ContentfulEntry<TestimonialFields>[]): Testimonial[] =>
  entries.map((entry, index) => {
    const { id, order, ...rest } = entry.fields;
    return {
      id: id ?? order ?? index + 1,
      ...rest,
    };
  });

const mapLanguages = (entries: ContentfulEntry<LanguageFields>[]): Language[] =>
  entries.map((entry) => ({
    language: entry.fields.language,
    proficiency: entry.fields.proficiency,
  }));

const mapAchievements = (entry: ContentfulEntry<AchievementsFields>): Achievements => ({
  yearsOfExperience: entry.fields.yearsOfExperience,
  projectsCompleted: entry.fields.projectsCompleted,
  dataPointsProcessed: entry.fields.dataPointsProcessed,
  satisfactionRate: entry.fields.satisfactionRate,
});

const mapTranslations = (entry: ContentfulEntry<TranslationFields>): Translation => ({
  ...(entry.fields.payload ?? {}),
});

export const fetchPortfolioDataFromContentful = async (): Promise<PortfolioData> => {
  const localeEn = toContentfulLocale('en');
  const localeEs = toContentfulLocale('es');

  const [
    personalInfoEntry,
    achievementsEntry,
    workExperienceEntries,
    educationEntries,
    projectEntries,
    skillEntries,
    certificationEntries,
    testimonialEntries,
    languageEntries,
    translationsEnEntry,
    translationsEsEntry,
  ] = await Promise.all([
    getSingleEntry<PersonalInfoFields>(CONTENT_TYPE.personalInfo, localeEn, localeEs),
    getSingleEntry<AchievementsFields>(CONTENT_TYPE.achievements, localeEn, localeEs),
    getCollection<WorkExperienceFields>(CONTENT_TYPE.workExperience, localeEn),
    getCollection<EducationFields>(CONTENT_TYPE.education, localeEn),
    getCollection<ProjectFields>(CONTENT_TYPE.project, localeEn),
    getCollection<SkillFields>(CONTENT_TYPE.skill, localeEn),
    getCollection<CertificationFields>(CONTENT_TYPE.certification, localeEn),
    getCollection<TestimonialFields>(CONTENT_TYPE.testimonial, localeEn),
    getCollection<LanguageFields>(CONTENT_TYPE.language, localeEn),
    getSingleEntry<TranslationFields>(CONTENT_TYPE.translations, localeEn),
    getSingleEntry<TranslationFields>(CONTENT_TYPE.translations, localeEs, localeEn),
  ]);

  const personalInfo: PersonalInfo = {
    ...personalInfoEntry.fields,
  };

  const achievements = mapAchievements(achievementsEntry);
  const workExperience = mapWorkExperience(workExperienceEntries);
  const education = mapEducation(educationEntries);
  const projects = mapProjects(projectEntries);
  const skills = mapSkills(skillEntries);
  const certifications = mapCertifications(certificationEntries);
  const testimonials = mapTestimonials(testimonialEntries);
  const languages = mapLanguages(languageEntries);
  const translations: Translations = {
    en: mapTranslations(translationsEnEntry),
    es: mapTranslations(translationsEsEntry),
  };

  return {
    personalInfo,
    achievements,
    workExperience,
    education,
    projects,
    skills,
    certifications,
    testimonials,
    languages,
    translations,
  };
};

