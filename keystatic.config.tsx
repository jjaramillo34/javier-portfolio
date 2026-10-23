import { collection, config, fields, singleton } from "@keystatic/core";

// Content editor at /keystatic. In `pnpm dev` it edits the files on disk. In production it signs
// in with GitHub and commits changes to the repo, which triggers a normal Vercel deploy.
//
// Only NEXT_PUBLIC_ vars are read here, because the editor UI also evaluates this file in the
// browser and both sides must agree on the storage mode.
const isDev = process.env.NODE_ENV === "development";
// Set once the GitHub App exists (Keystatic's setup writes it to .env).
const githubAppReady = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
// Run `pnpm dev` with this set to "github" to go through the one-time GitHub App setup.
const forceGitHub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

/** The editor is available locally, and in production once the GitHub App is configured. */
export const keystaticEnabled = isDev || githubAppReady;

const storage =
  isDev && !forceGitHub
    ? ({ kind: "local" } as const)
    : ({ kind: "github", repo: "jjaramillo34/javier-portfolio" } as const);

const list = (label: string, itemLabel = "Item") =>
  fields.array(fields.text({ label: itemLabel }), {
    label,
    itemLabel: (props) => props.value || itemLabel,
  });

const order = fields.integer({
  label: "Order",
  description: "Lower numbers appear first.",
  defaultValue: 100,
  validation: { isRequired: true },
});

export default config({
  storage,
  ui: {
    brand: { name: "Jaramillo Hub" },
    navigation: {
      Portfolio: ["projects", "experience", "certifications", "testimonials"],
      About: ["profile", "skills"],
    },
  },
  collections: {
    projects: collection({
      label: "Projects",
      path: "src/content/projects/*",
      format: { data: "json" },
      slugField: "title",
      columns: ["title", "category", "period"],
      schema: {
        title: fields.slug({
          name: { label: "Title (English)" },
          slug: {
            label: "URL slug",
            description: "Used in /work/<slug>. Changing it changes the page URL.",
          },
        }),
        titleEs: fields.text({
          label: "Title (Spanish)",
          description: "Leave empty to reuse the English title.",
        }),
        order,
        category: fields.select({
          label: "Category",
          options: [
            { label: "Full-stack", value: "full-stack" },
            { label: "Data", value: "data" },
            { label: "Automation", value: "automation" },
            { label: "APIs & backend", value: "api" },
          ],
          defaultValue: "full-stack",
        }),
        period: fields.text({
          label: "Period",
          description: 'e.g. "2026" or "May 2014 - Jul 2014".',
        }),
        description: fields.text({ label: "Description (English)", multiline: true }),
        descriptionEs: fields.text({ label: "Description (Spanish)", multiline: true }),
        technologies: list("Technologies", "Technology"),
        achievements: list("Highlights (English)", "Highlight"),
        achievementsEs: list("Highlights (Spanish)", "Highlight"),
        link: fields.url({
          label: "Live site",
          description: "Projects with a link get screenshots via pnpm capture:projects.",
        }),
        image: fields.text({
          label: "Cover image path",
          description:
            "Optional, e.g. /images/projects/name.jpg (used for social cards). Live captures override it on cards.",
        }),
      },
    }),

    experience: collection({
      label: "Experience",
      path: "src/content/experience/*",
      format: { data: "json" },
      slugField: "title",
      columns: ["title", "company", "period"],
      schema: {
        title: fields.slug({ name: { label: "Role" } }),
        company: fields.text({ label: "Company" }),
        period: fields.text({
          label: "Period",
          description: 'e.g. "Oct 2024 - Present". "Present" marks a current role.',
        }),
        location: fields.text({ label: "Location" }),
        order,
        achievements: list("Achievements", "Achievement"),
      },
    }),

    certifications: collection({
      label: "Certifications",
      path: "src/content/certifications/*",
      format: { data: "json" },
      slugField: "title",
      columns: ["title", "institution", "issueDate"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        institution: fields.text({ label: "Institution" }),
        issueDate: fields.text({
          label: "Issue date",
          description: 'Month and year, e.g. "Sep 2020".',
          validation: {
            pattern: {
              regex: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/,
              message: 'Use "Mon YYYY", e.g. "Sep 2020".',
            },
          },
        }),
        category: fields.select({
          label: "Subject",
          options: [
            { label: "Data analysis & databases", value: "dataAnalysis" },
            { label: "Computer vision & AI", value: "computerVisionAI" },
            { label: "Backend & development", value: "backendDevelopment" },
            { label: "Microsoft Excel & VBA", value: "excelVBA" },
            { label: "Security & system administration", value: "security" },
          ],
          defaultValue: "dataAnalysis",
        }),
        description: fields.text({ label: "Description", multiline: true }),
        skills: list("Skills", "Skill"),
        credentialId: fields.text({ label: "Credential ID" }),
        link: fields.url({ label: "Credential link" }),
      },
    }),

    testimonials: collection({
      label: "Recommendations",
      path: "src/content/testimonials/*",
      format: { data: "json" },
      slugField: "name",
      columns: ["name", "company", "relationshipType"],
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        position: fields.text({ label: "Position" }),
        company: fields.text({ label: "Company" }),
        relationship: fields.text({
          label: "Relationship",
          description: 'e.g. "Worked with Javier at different companies".',
        }),
        relationshipType: fields.select({
          label: "Relationship type",
          options: [
            { label: "Manager", value: "manager" },
            { label: "Colleague", value: "colleague" },
            { label: "Teacher", value: "teacher" },
            { label: "Client", value: "client" },
          ],
          defaultValue: "colleague",
        }),
        date: fields.text({ label: "Date", description: 'e.g. "March 19, 2021".' }),
        order,
        quote: fields.text({ label: "Quote", multiline: true }),
      },
    }),
  },

  singletons: {
    profile: singleton({
      label: "Profile",
      path: "src/content/profile",
      format: { data: "json" },
      schema: {
        personalInfo: fields.object(
          {
            name: fields.text({ label: "Name" }),
            title: fields.text({ label: "Title" }),
            tagline: fields.text({ label: "Tagline", multiline: true }),
            summary: fields.text({ label: "Summary (English)", multiline: true }),
            location: fields.text({ label: "Location" }),
            email: fields.text({ label: "Email" }),
            phone: fields.text({ label: "Phone" }),
            linkedin: fields.text({ label: "LinkedIn URL" }),
            github: fields.text({ label: "GitHub URL" }),
          },
          { label: "Personal info" },
        ),
        achievements: fields.object(
          {
            yearsOfExperience: fields.integer({
              label: "Years of experience",
              validation: { isRequired: true },
            }),
            projectsCompleted: fields.integer({
              label: "Projects completed",
              validation: { isRequired: true },
            }),
            dataPointsProcessed: fields.text({
              label: "Data points processed",
              description: 'e.g. "1M+".',
            }),
            satisfactionRate: fields.integer({
              label: "Client satisfaction (%)",
              validation: { isRequired: true },
            }),
          },
          { label: "Home page stats" },
        ),
        education: fields.array(
          fields.object({
            degree: fields.text({ label: "Degree" }),
            school: fields.text({ label: "School" }),
            period: fields.text({ label: "Period" }),
            location: fields.text({ label: "Location" }),
          }),
          { label: "Education", itemLabel: (props) => props.fields.degree.value || "Degree" },
        ),
        languages: fields.array(
          fields.object({
            language: fields.text({ label: "Language" }),
            proficiency: fields.text({ label: "Proficiency" }),
          }),
          { label: "Languages", itemLabel: (props) => props.fields.language.value || "Language" },
        ),
      },
    }),

    skills: singleton({
      label: "Skills",
      path: "src/content/skills",
      format: { data: "json" },
      schema: Object.fromEntries(
        (
          [
            ["languages", "Programming languages"],
            ["frontend", "Frontend development"],
            ["dataVisualization", "Data visualization"],
            ["cloud", "Cloud & platforms"],
            ["databases", "Databases"],
            ["tools", "Tools & technologies"],
          ] as const
        ).map(([key, label]) => [
          key,
          fields.array(
            fields.object({
              name: fields.text({ label: "Skill" }),
              level: fields.integer({
                label: "Proficiency (%)",
                validation: { isRequired: true, min: 0, max: 100 },
              }),
            }),
            {
              label,
              itemLabel: (props) =>
                `${props.fields.name.value} · ${props.fields.level.value ?? 0}%`,
            },
          ),
        ]),
      ),
    }),
  },
});
