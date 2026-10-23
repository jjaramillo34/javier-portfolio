import { ProjectCard } from "@/components/ProjectCard";
import { getProject, getProjects } from "@/content";
import { type Locale, localePath, routing } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import {
  Button,
  Column,
  Grid,
  Heading,
  Icon,
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
    image: project.image ?? undefined,
  });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("work");
  const others = getProjects(locale)
    .filter((other) => other.slug !== project.slug)
    .slice(0, 2);

  return (
    <Column maxWidth="m" gap="40" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
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
          <Row paddingTop="8" data-border="rounded">
            <Button href={project.link} suffixIcon="arrowUpRight">
              {t("visit")}
            </Button>
          </Row>
        )}
      </Column>

      {project.image && (
        <Media
          src={project.image}
          alt={project.title}
          aspectRatio="16 / 9"
          radius="l"
          border
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
        />
      )}

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
        </Column>
        <Column background="surface" border radius="l" padding="24" gap="16">
          <Text variant="heading-strong-s">{t("technologies")}</Text>
          <Row gap="8" wrap>
            {project.technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </Row>
        </Column>
      </Grid>

      {others.length > 0 && (
        <Column gap="24" paddingTop="40">
          <Heading as="h2" variant="display-strong-xs">
            {t("more")}
          </Heading>
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
        </Column>
      )}
    </Column>
  );
}
