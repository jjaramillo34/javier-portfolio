import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import dotenv from 'dotenv';
import contentfulManagement from 'contentful-management';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local') });

const REQUIRED_ENV_VARS = [
  'VITE_CONTENTFUL_SPACE_ID',
  'VITE_CONTENTFUL_ENVIRONMENT',
  'VITE_CONTENTFUL_LOCALE_EN',
  'VITE_CONTENTFUL_LOCALE_ES',
  'CONTENTFUL_MANAGEMENT_TOKEN',
];

const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name] || process.env[name].trim() === '');
if (missingEnv.length > 0) {
  console.error(`[seed-contentful] Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.VITE_CONTENTFUL_ENVIRONMENT;
const contentTypeDefinitions = [
  {
    id: 'personalInfo',
    name: 'Personal Info',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', localized: true, required: true },
      { id: 'title', name: 'Title', type: 'Symbol', localized: true },
      { id: 'tagline', name: 'Tagline', type: 'Symbol', localized: true },
      { id: 'location', name: 'Location', type: 'Symbol', localized: true },
      { id: 'linkedin', name: 'LinkedIn', type: 'Symbol', localized: true },
      { id: 'email', name: 'Email', type: 'Symbol', localized: true },
      { id: 'phone', name: 'Phone', type: 'Symbol', localized: true },
      { id: 'summary', name: 'Summary', type: 'Text', localized: true },
    ],
  },
  {
    id: 'workExperience',
    name: 'Work Experience',
    displayField: 'title',
    fields: [
      { id: 'id', name: 'ID', type: 'Integer' },
      { id: 'order', name: 'Order', type: 'Integer' },
      { id: 'title', name: 'Title', type: 'Symbol', localized: true, required: true },
      { id: 'company', name: 'Company', type: 'Symbol', localized: true, required: true },
      { id: 'period', name: 'Period', type: 'Symbol', localized: true, required: true },
      { id: 'location', name: 'Location', type: 'Symbol', localized: true },
      {
        id: 'achievements',
        name: 'Achievements',
        type: 'Array',
        localized: true,
        items: { type: 'Symbol' },
      },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    displayField: 'degree',
    fields: [
      { id: 'degree', name: 'Degree', type: 'Symbol', localized: true, required: true },
      { id: 'school', name: 'School', type: 'Symbol', localized: true, required: true },
      { id: 'period', name: 'Period', type: 'Symbol', localized: true, required: true },
      { id: 'location', name: 'Location', type: 'Symbol', localized: true },
      { id: 'order', name: 'Order', type: 'Integer' },
    ],
  },
  {
    id: 'project',
    name: 'Project',
    displayField: 'title',
    fields: [
      { id: 'id', name: 'ID', type: 'Integer' },
      { id: 'order', name: 'Order', type: 'Integer' },
      { id: 'title', name: 'Title', type: 'Symbol', localized: true, required: true },
      { id: 'period', name: 'Period', type: 'Symbol', localized: true },
      { id: 'description', name: 'Description', type: 'Text', localized: true },
      {
        id: 'technologies',
        name: 'Technologies',
        type: 'Array',
        localized: true,
        items: { type: 'Symbol' },
      },
      {
        id: 'achievements',
        name: 'Achievements',
        type: 'Array',
        localized: true,
        items: { type: 'Symbol' },
      },
      { id: 'link', name: 'Link', type: 'Symbol', localized: true },
    ],
  },
  {
    id: 'skill',
    name: 'Skill Item',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', localized: true, required: true },
      { id: 'level', name: 'Level', type: 'Integer' },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [{ in: ['languages', 'frontend', 'dataVisualization', 'cloud', 'databases', 'tools'] }],
      },
      { id: 'order', name: 'Order', type: 'Integer' },
    ],
  },
  {
    id: 'certification',
    name: 'Certification',
    displayField: 'title',
    fields: [
      { id: 'id', name: 'ID', type: 'Integer' },
      { id: 'order', name: 'Order', type: 'Integer' },
      { id: 'title', name: 'Title', type: 'Symbol', localized: true, required: true },
      { id: 'institution', name: 'Institution', type: 'Symbol', localized: true },
      { id: 'issueDate', name: 'Issue Date', type: 'Symbol', localized: true },
      { id: 'credentialId', name: 'Credential ID', type: 'Symbol', localized: true },
      {
        id: 'skills',
        name: 'Skills',
        type: 'Array',
        localized: true,
        items: { type: 'Symbol' },
      },
      { id: 'description', name: 'Description', type: 'Text', localized: true },
      { id: 'link', name: 'Link', type: 'Symbol', localized: true },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [
          { in: ['backendDevelopment', 'computerVisionAI', 'dataAnalysis', 'excelVBA', 'security'] },
        ],
      },
    ],
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    displayField: 'name',
    fields: [
      { id: 'id', name: 'ID', type: 'Integer' },
      { id: 'order', name: 'Order', type: 'Integer' },
      { id: 'name', name: 'Name', type: 'Symbol', localized: true, required: true },
      { id: 'position', name: 'Position', type: 'Symbol', localized: true },
      { id: 'company', name: 'Company', type: 'Symbol', localized: true },
      { id: 'relationship', name: 'Relationship', type: 'Symbol', localized: true },
      {
        id: 'relationshipType',
        name: 'Relationship Type',
        type: 'Symbol',
        localized: true,
        validations: [{ in: ['manager', 'colleague', 'teacher', 'client'] }],
      },
      { id: 'date', name: 'Date', type: 'Symbol', localized: true },
      { id: 'quote', name: 'Quote', type: 'Text', localized: true },
    ],
  },
  {
    id: 'language',
    name: 'Language',
    displayField: 'language',
    fields: [
      { id: 'language', name: 'Language', type: 'Symbol', localized: true, required: true },
      { id: 'proficiency', name: 'Proficiency', type: 'Symbol', localized: true },
      { id: 'order', name: 'Order', type: 'Integer' },
    ],
  },
  {
    id: 'portfolioStats',
    name: 'Portfolio Stats',
    displayField: 'yearsOfExperience',
    fields: [
      { id: 'yearsOfExperience', name: 'Years of Experience', type: 'Integer' },
      { id: 'projectsCompleted', name: 'Projects Completed', type: 'Integer' },
      { id: 'dataPointsProcessed', name: 'Data Points Processed', type: 'Symbol', localized: true },
      { id: 'satisfactionRate', name: 'Satisfaction Rate', type: 'Integer' },
    ],
  },
  {
    id: 'translations',
    name: 'UI Translations',
    fields: [
      { id: 'payload', name: 'Payload', type: 'Object', localized: true, required: true },
    ],
  },
];

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const normalizeValue = (value) => (value === undefined ? null : value);

const normalizeAchievements = (achievements) => achievements ?? [];

const withOrder = (value, index) => (value !== undefined ? value : index + 1);

const logStep = (message) => {
  console.log(`[seed-contentful] ${message}`);
};

const upsertContentType = async (environment, definition) => {
  let contentType;
  let created = false;

  try {
    contentType = await environment.getContentType(definition.id);
  } catch (error) {
    if (error?.name === 'NotFound' || error?.status === 404) {
      contentType = await environment.createContentTypeWithId(definition.id, {
        name: definition.name,
        displayField: definition.displayField,
        fields: definition.fields,
      });
      created = true;
      logStep(`Created content type ${definition.id}`);
    } else {
      throw error;
    }
  }

  let needsUpdate = false;
  if (!created) {
    if (contentType.name !== definition.name) {
      contentType.name = definition.name;
      needsUpdate = true;
    }

    if (contentType.displayField !== definition.displayField) {
      contentType.displayField = definition.displayField;
      needsUpdate = true;
    }

    const existingFields = JSON.stringify(contentType.fields);
    const desiredFields = JSON.stringify(definition.fields);
    if (existingFields !== desiredFields) {
      contentType.fields = definition.fields;
      needsUpdate = true;
    }

    if (needsUpdate) {
      contentType = await contentType.update();
      logStep(`Updated content type ${definition.id}`);
    }
  }

  if (!contentType.sys.publishedVersion || created || needsUpdate) {
    contentType = await contentType.publish();
    logStep(`Published content type ${definition.id}`);
  }
};

const ensureLocale = async (environment, { code, name, fallbackCode }) => {
  try {
    await environment.getLocale(code);
    logStep(`Locale ${code} already exists`);
    return true;
  } catch (error) {
    if (error?.name === 'NotFound' || error?.status === 404) {
      try {
        const locale = await environment.createLocale({
          name,
          code,
          fallbackCode,
          default: false,
          contentDelivery: true,
          contentManagement: true,
          optional: false,
        });
        logStep(`Created locale ${locale.code}`);
        return true;
      } catch (creationError) {
        console.warn(`[seed-contentful] Failed to create locale ${code}:`, creationError.message ?? creationError);
        return false;
      }
    } else {
      console.warn(`[seed-contentful] Unable to fetch locale ${code}:`, error.message ?? error);
      return false;
    }
  }
};

const upsertEntry = async (environment, contentTypeId, entryId, fieldsBuilder) => {
  const fields = fieldsBuilder();

  try {
    let entry;
    try {
      entry = await environment.getEntry(entryId);
      entry.fields = fields;
      entry = await entry.update();
      logStep(`Updated entry ${entryId}`);
    } catch (err) {
      if (err?.name === 'NotFound' || err?.status === 404) {
        entry = await environment.createEntryWithId(contentTypeId, entryId, { fields });
        logStep(`Created entry ${entryId}`);
      } else {
        throw err;
      }
    }

    if (!entry.sys.publishedVersion) {
      await entry.publish();
      logStep(`Published entry ${entryId}`);
    } else {
      const published = await entry.publish();
      logStep(`Republished entry ${published.sys.id}`);
    }
  } catch (error) {
    console.error(`[seed-contentful] Failed to upsert ${entryId}`, error);
    throw error;
  }
};

const importData = async () => {
  logStep('Reading portfolio-data.json');
  const raw = await readFile(path.join(projectRoot, 'public', 'data', 'portfolio-data.json'), 'utf8');
  const data = JSON.parse(raw);

  logStep('Connecting to Contentful');
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_ID);

  logStep('Ensuring content types exist');
  for (const definition of contentTypeDefinitions) {
    await upsertContentType(environment, definition);
  }

  const defaultLocaleCode = process.env.VITE_CONTENTFUL_LOCALE_EN ?? 'en-US';
  let secondaryLocaleCode = process.env.VITE_CONTENTFUL_LOCALE_ES;

  let localeCollection = await environment.getLocales();
  let availableLocales = new Set(localeCollection.items.map((item) => item.code));

  if (secondaryLocaleCode && secondaryLocaleCode !== defaultLocaleCode) {
    if (!availableLocales.has(secondaryLocaleCode)) {
      const created = await ensureLocale(environment, {
        code: secondaryLocaleCode,
        name: 'Secondary Locale',
        fallbackCode: defaultLocaleCode,
      });
      if (created) {
        localeCollection = await environment.getLocales();
        availableLocales = new Set(localeCollection.items.map((item) => item.code));
      } else {
        secondaryLocaleCode = null;
        console.warn(
          `[seed-contentful] Proceeding without secondary locale. Add ${process.env.VITE_CONTENTFUL_LOCALE_ES} manually in Contentful if needed.`,
        );
      }
    }
  }

  const localize = (enValue, esValue) => {
    const localized = {};
    if (enValue !== undefined && availableLocales.has(defaultLocaleCode)) {
      localized[defaultLocaleCode] = normalizeValue(enValue);
    }
    if (secondaryLocaleCode && availableLocales.has(secondaryLocaleCode)) {
      const value =
        esValue !== undefined
          ? normalizeValue(esValue)
          : enValue !== undefined
            ? normalizeValue(enValue)
            : null;
      localized[secondaryLocaleCode] = value;
    }
    if (Object.keys(localized).length === 0 && availableLocales.has(defaultLocaleCode)) {
      localized[defaultLocaleCode] = null;
    }
    return localized;
  };

  // Personal Info
  await upsertEntry(environment, 'personalInfo', 'personal-info', () => ({
    name: localize(data.personalInfo.name),
    title: localize(data.personalInfo.title),
    tagline: localize(data.personalInfo.tagline),
    location: localize(data.personalInfo.location),
    linkedin: localize(data.personalInfo.linkedin),
    email: localize(data.personalInfo.email),
    phone: localize(data.personalInfo.phone),
    summary: localize(data.personalInfo.summary),
  }));

  // Achievements / Stats
  await upsertEntry(environment, 'portfolioStats', 'portfolio-stats', () => ({
    yearsOfExperience: localize(data.achievements.yearsOfExperience),
    projectsCompleted: localize(data.achievements.projectsCompleted),
    dataPointsProcessed: localize(data.achievements.dataPointsProcessed),
    satisfactionRate: localize(data.achievements.satisfactionRate),
  }));

  // Work Experience
  for (const experience of data.workExperience) {
    await upsertEntry(environment, 'workExperience', `work-experience-${experience.id}`, () => ({
      id: localize(experience.id),
      order: localize(experience.id),
      title: localize(experience.title),
      company: localize(experience.company),
      period: localize(experience.period),
      location: localize(experience.location),
      achievements: localize(normalizeAchievements(experience.achievements)),
    }));
  }

  // Education
  for (const [index, educationItem] of data.education.entries()) {
    await upsertEntry(environment, 'education', `education-${index + 1}`, () => ({
      degree: localize(educationItem.degree),
      school: localize(educationItem.school),
      period: localize(educationItem.period),
      location: localize(educationItem.location),
      order: localize(withOrder(educationItem.order, index)),
    }));
  }

  // Projects
  for (const project of data.projects) {
    await upsertEntry(environment, 'project', `project-${project.id}`, () => ({
      id: localize(project.id),
      order: localize(project.id),
      title: localize(project.title),
      period: localize(project.period),
      description: localize(project.description),
      technologies: localize(project.technologies),
      achievements: localize(project.achievements),
      link: localize(project.link),
    }));
  }

  // Skills
  for (const [category, skills] of Object.entries(data.skills)) {
    for (const [index, skill] of skills.entries()) {
      await upsertEntry(environment, 'skill', `skill-${category}-${index + 1}`, () => ({
        name: localize(skill.name),
        level: localize(skill.level),
        category: localize(category),
        order: localize(withOrder(skill.order, index)),
      }));
    }
  }

  // Certifications
  for (const [category, certifications] of Object.entries(data.certifications)) {
    for (const [index, certification] of certifications.entries()) {
      await upsertEntry(environment, 'certification', `certification-${category}-${certification.id ?? index + 1}`, () => ({
        id: localize(certification.id ?? index + 1),
        order: localize(withOrder(certification.order, index)),
        title: localize(certification.title),
        institution: localize(certification.institution),
        issueDate: localize(certification.issueDate),
        credentialId: localize(certification.credentialId),
        skills: localize(certification.skills ?? []),
        description: localize(certification.description),
        link: localize(certification.link),
        category: localize(category),
      }));
    }
  }

  // Testimonials
  for (const testimonial of data.testimonials) {
    await upsertEntry(environment, 'testimonial', `testimonial-${testimonial.id}`, () => ({
      id: localize(testimonial.id),
      order: localize(testimonial.id),
      name: localize(testimonial.name),
      position: localize(testimonial.position),
      company: localize(testimonial.company),
      relationship: localize(testimonial.relationship),
      relationshipType: localize(testimonial.relationshipType),
      date: localize(testimonial.date),
      quote: localize(testimonial.quote),
    }));
  }

  // Languages
  for (const [index, languageItem] of data.languages.entries()) {
    await upsertEntry(environment, 'language', `language-${index + 1}`, () => ({
      language: localize(languageItem.language),
      proficiency: localize(languageItem.proficiency),
      order: localize(withOrder(languageItem.order, index)),
    }));
  }

  // UI Translations
  await upsertEntry(environment, 'translations', 'translations-ui', () => ({
    payload: localize(data.translations.en, data.translations.es),
  }));

  logStep('Content import completed successfully 🎉');
};

importData().catch((error) => {
  console.error('[seed-contentful] Import failed', error);
  process.exit(1);
});

