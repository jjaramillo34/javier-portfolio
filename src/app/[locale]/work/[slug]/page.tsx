import { accentTags } from "@/components/Accent";
import { BrowserFrame, DeviceShowcase } from "@/components/DeviceShowcase";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { getProject, getProjects } from "@/content";
import { type Locale, localePath, routing } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import {
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  Line,
  Media,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  const project = getProject(locale as Locale, slug);
  if (!project) return {};
  return buildMetadata({
    locale: locale as Locale,
    path: `/work/${slug}`,
    title: project.title,
    description: project.description,
  });
}

const domain = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Column gap="4">
      <Text variant="label-default-xs" onBackground="neutral-weak">
        {label}
      </Text>
      {children}
    </Column>
  );
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("work");
  const { media } = project;
  const others = getProjects(locale)
    .filter((other) => other.slug !== project.slug)
    .slice(0, 2);
  const capturedOn =
    media &&
    new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
      new Date(media.capturedAt),
    );

  return (
    <Column maxWidth="m" gap="64" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      {/* Header */}
      <Column gap="16">
        <SmartLink href={localePath(locale, "/work")} prefixIcon="arrowLeft">
          {t("back")}
        </SmartLink>
        <Row gap="8" vertical="center">
          <Tag scheme="brand" size="s">
            {t(`categories.${project.category}`)}
          </Tag>
          <Text variant="label-default-s" onBackground="neutral-weak">
            {project.period}
          </Text>
        </Row>
        <Heading as="h1" variant="display-strong-m">
          {project.title}
        </Heading>
        <Text variant="body-default-xl" onBackground="neutral-weak">
          {project.description}
        </Text>
        {project.link && (
          <Row paddingTop="8" gap="12" vertical="center" wrap data-border="rounded">
            <Button href={project.link} suffixIcon="arrowUpRight">
              {t("visit")}
            </Button>
            <Text variant="label-default-s" onBackground="neutral-weak">
              {domain(project.link)}
            </Text>
          </Row>
        )}
      </Column>

      {/* Showcase: live captures when available, otherwise the curated cover image. */}
      {media ? (
        <DeviceShowcase
          media={media}
          desktopAlt={t("desktopAlt", { title: project.title })}
          mobileAlt={t("mobileAlt", { title: project.title })}
        />
      ) : project.image ? (
        <Media
          src={project.image}
          alt={project.title}
          aspectRatio="16 / 9"
          radius="l"
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
        />
      ) : (
        <Column fillWidth radius="l" border overflow="hidden">
          <ProjectCover
            title={project.title}
            category={project.category}
            technologies={project.technologies}
            aspectRatio="21 / 9"
          />
        </Column>
      )}

      {/* Highlights and details */}
      <Grid columns="3" gap="24" s={{ columns: 1 }}>
        <Column
          background="surface"
          border
          radius="l"
          padding="24"
          gap="16"
          style={{ gridColumn: "span 2" }}
          s={{ style: { gridColumn: "auto" } }}
        >
          <Text variant="heading-strong-s">{t("highlights")}</Text>
          <Column as="ul" gap="12" margin="0" padding="0" style={{ listStyle: "none" }}>
            {project.achievements.map((achievement) => (
              <Row as="li" key={achievement} gap="12">
                <Icon name="check" size="s" onBackground="brand-medium" />
                <Text variant="body-default-m">{achievement}</Text>
              </Row>
            ))}
          </Column>
          {media?.siteDescription && (
            <Column gap="8" marginTop="8" paddingTop="16" borderTop>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                {t("inTheirWords")}
              </Text>
              <Text
                as="blockquote"
                variant="body-default-m"
                onBackground="neutral-medium"
                margin="0"
                paddingLeft="16"
                style={{ borderLeft: "2px solid var(--brand-on-background-medium)" }}
              >
                “{media.siteDescription}”
              </Text>
            </Column>
          )}
        </Column>

        <Column background="surface" border radius="l" padding="24" gap="20">
          <Text variant="heading-strong-s">{t("details")}</Text>
          {project.link && (
            <DetailRow label={t("liveSite")}>
              <SmartLink href={project.link} suffixIcon="arrowUpRight">
                {domain(project.link)}
              </SmartLink>
            </DetailRow>
          )}
          <Row gap="24">
            <DetailRow label={t("year")}>
              <Text variant="body-default-m">{project.period}</Text>
            </DetailRow>
            <DetailRow label={t("category")}>
              <Text variant="body-default-m">{t(`categories.${project.category}`)}</Text>
            </DetailRow>
          </Row>
          <Line />
          <DetailRow label={t("technologies")}>
            <Row gap="8" wrap paddingTop="4">
              {project.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </Row>
          </DetailRow>
        </Column>
      </Grid>

      {/* Gallery */}
      {media && media.gallery.length > 0 && (
        <Column gap="32">
          <SectionTitle eyebrow={t("galleryEyebrow")} title={t.rich("galleryTitle", accentTags)} />
          <Reveal>
            <Grid columns="3" gap="16" m={{ columns: 2 }} s={{ columns: 1 }}>
              {media.gallery.map((src, index) => (
                <BrowserFrame
                  key={src}
                  compact
                  url={media.url}
                  src={src}
                  alt={t("sectionAlt", { title: project.title, n: index + 1 })}
                />
              ))}
            </Grid>
          </Reveal>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {t("captured", { date: capturedOn ?? "" })}
          </Text>
        </Column>
      )}

      {others.length > 0 && (
        <Column gap="24" paddingTop="40">
          <Heading as="h2" variant="display-strong-xs">
            {t.rich("more", accentTags)}
          </Heading>
          <Reveal>
            <Grid columns="2" gap="24" s={{ columns: 1 }}>
              {others.map((other) => (
                <ProjectCard
                  key={other.slug}
                  project={other}
                  href={localePath(locale, `/work/${other.slug}`)}
                  categoryLabel={t(`categories.${other.category}`)}
                />
              ))}
            </Grid>
          </Reveal>
        </Column>
      )}
    </Column>
  );
}
