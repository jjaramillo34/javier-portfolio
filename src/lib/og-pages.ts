import { getCertificationTimeline, getProject } from "@/content";
import type { Locale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { renderOgCard } from "./og";

export type OgPage = "home" | "about" | "work" | "certifications" | "contact";

const certificationCount = getCertificationTimeline().length;

/** Social card for one of the top-level pages, in the given language. */
export async function renderPageOg(locale: Locale, page: OgPage) {
  // Without this, next-intl reads request headers and the image can't be prerendered.
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  // t.raw keeps the <em> markup, which renderOgCard turns into the gradient accent.
  const raw = (key: string) => t.raw(key) as string;
  const baseTags = [t("og.years"), t("og.projects"), t("og.languages")];

  switch (page) {
    case "home":
      return renderOgCard({
        eyebrow: t("og.homeEyebrow"),
        title: "Javier <em>Jaramillo</em>",
        subtitle: t("home.role"),
        tags: baseTags,
      });
    case "about":
      return renderOgCard({
        eyebrow: t("nav.about"),
        title: raw("about.experienceTitle"),
        subtitle: t("meta.aboutDescription"),
        tags: baseTags,
      });
    case "work":
      return renderOgCard({
        eyebrow: t("nav.work"),
        title: raw("work.heading"),
        subtitle: t("work.subheading"),
        tags: [
          t("og.projects"),
          t("work.categories.data"),
          t("work.categories.automation"),
          t("work.categories.full-stack"),
        ],
      });
    case "certifications":
      return renderOgCard({
        eyebrow: t("nav.certifications"),
        title: raw("certifications.heading"),
        subtitle: t("certifications.subheading"),
        tags: [t("og.certifications", { count: certificationCount })],
      });
    case "contact":
      return renderOgCard({
        eyebrow: t("nav.contact"),
        title: raw("contact.heading"),
        subtitle: t("contact.subheading"),
        tags: ["jaramillohub.com", "LinkedIn", "GitHub"],
      });
  }
}

/** Social card for a project page: its title, summary, stack and screenshot. */
export async function renderProjectOg(locale: Locale, slug: string) {
  setRequestLocale(locale);
  const project = getProject(locale, slug);
  if (!project) return renderPageOg(locale, "work");
  const t = await getTranslations({ locale, namespace: "work" });
  const summary =
    project.description.length > 105
      ? `${project.description.slice(0, 102).trimEnd()}…`
      : project.description;

  return renderOgCard({
    eyebrow: `${t(`categories.${project.category}`)} · ${project.period}`,
    title: project.title,
    subtitle: summary,
    tags: project.technologies,
    screenshot: project.image,
  });
}
