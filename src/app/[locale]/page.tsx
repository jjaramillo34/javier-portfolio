import { Accent, accentTags } from "@/components/Accent";
import { ParticleHero } from "@/components/ParticleHero";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { Stats } from "@/components/Stats";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { achievements, getProjects, personalInfo, testimonials } from "@/content";
import { type Locale, localePath } from "@/i18n/routing";
import { avatar, baseURL, resumeHref } from "@/resources/site";
import {
  Avatar,
  Background,
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  IconButton,
  Row,
  StatusIndicator,
  Text,
  TypeFx,
  VisuallyHidden,
} from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

const FEATURED_PROJECTS = 4;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tWork = await getTranslations("work");

  const [firstName, ...rest] = personalInfo.name.split(" ");
  const lastName = rest.join(" ");
  const projects = getProjects(locale).slice(0, FEATURED_PROJECTS);
  const stats = [
    { value: `${achievements.yearsOfExperience}+`, label: t("stats.years") },
    { value: `${achievements.projectsCompleted}+`, label: t("stats.projects") },
    { value: achievements.dataPointsProcessed, label: t("stats.dataPoints") },
    { value: `${achievements.satisfactionRate}%`, label: t("stats.satisfaction") },
  ];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    url: baseURL,
    image: `${baseURL}${avatar}`,
    email: `mailto:${personalInfo.email}`,
    sameAs: [personalInfo.linkedin, personalInfo.github],
  };

  return (
    <Column fillWidth horizontal="center" gap="104" paddingBottom="104">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      <ParticleHero>
        <Row
          maxWidth="l"
          zIndex={1}
          gap="64"
          vertical="center"
          s={{ direction: "column-reverse", gap: "32" }}
        >
          <Column flex={3} gap="24" s={{ horizontal: "center", align: "center" }}>
            {/* A Row rather than Badge so the label can wrap on narrow phones. */}
            <Row
              fitWidth
              background="success-alpha-weak"
              border="success-alpha-medium"
              radius="full"
              paddingX="12"
              paddingY="4"
              gap="8"
              vertical="center"
            >
              <StatusIndicator color="green" size="s" ariaLabel="" />
              <Text variant="label-default-s" onBackground="neutral-strong">
                {t("available")}
              </Text>
            </Row>
            <Column gap="12" s={{ horizontal: "center" }}>
              <Heading as="h1" variant="display-strong-xl">
                {firstName} <Accent>{lastName}</Accent>
              </Heading>
              <Text variant="heading-default-l" onBackground="brand-medium">
                <VisuallyHidden>{t("role")}</VisuallyHidden>
                <span aria-hidden>
                  <TypeFx words={t.raw("roles") as string[]} speed={60} hold={2400} />
                </span>
              </Text>
            </Column>
            <Text variant="body-default-xl" onBackground="neutral-weak" wrap="balance">
              {t("summary")}
            </Text>
            <Row gap="12" vertical="center" wrap s={{ horizontal: "center" }} data-border="rounded">
              <Button href={localePath(locale, "/contact")} arrowIcon>
                {t("getInTouch")}
              </Button>
              <Button href={resumeHref} variant="secondary" prefixIcon="download">
                {t("downloadResume")}
              </Button>
              <Row gap="4">
                <IconButton
                  href={personalInfo.linkedin}
                  icon="linkedin"
                  variant="ghost"
                  size="l"
                  tooltip="LinkedIn"
                />
                <IconButton
                  href={personalInfo.github}
                  icon="github"
                  variant="ghost"
                  size="l"
                  tooltip="GitHub"
                />
              </Row>
            </Row>
            <Row
              gap="8"
              vertical="center"
              textVariant="label-default-s"
              onBackground="neutral-weak"
            >
              <Icon name="mapPin" size="xs" />
              {personalInfo.location}
            </Row>
          </Column>
          <Column flex={2} horizontal="center">
            <Row
              radius="full"
              padding="8"
              border="brand-alpha-medium"
              background="brand-alpha-weak"
              shadow="xl"
            >
              <Avatar src={avatar} size={16} s={{ hide: true }} />
              <Avatar src={avatar} size={10} hide s={{ hide: false }} />
            </Row>
          </Column>
        </Row>
      </ParticleHero>

      {/* Stats */}
      <Column maxWidth="l">
        <Stats stats={stats} />
      </Column>

      {/* Selected work */}
      <Column maxWidth="l" gap="40">
        <Row
          fillWidth
          horizontal="between"
          vertical="end"
          gap="24"
          s={{ direction: "column", vertical: "start" }}
        >
          <SectionTitle
            index={1}
            eyebrow={t("workEyebrow")}
            title={t.rich("workHeading", accentTags)}
          />
          <Button
            href={localePath(locale, "/work")}
            variant="secondary"
            size="s"
            arrowIcon
            data-border="rounded"
          >
            {t("viewAllWork")}
          </Button>
        </Row>
        <Reveal>
          <Grid columns="2" gap="24" s={{ columns: 1 }}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                href={localePath(locale, `/work/${project.slug}`)}
                categoryLabel={tWork(`categories.${project.category}`)}
                priority={index < 2}
              />
            ))}
          </Grid>
        </Reveal>
      </Column>

      {/* Testimonials */}
      <Column maxWidth="l">
        <TestimonialCarousel
          testimonials={testimonials}
          header={
            <SectionTitle
              index={2}
              eyebrow={t("testimonialsEyebrow")}
              title={t.rich("testimonialsHeading", accentTags)}
            />
          }
        />
      </Column>

      {/* Call to action */}
      <Column maxWidth="l">
        <Column
          fillWidth
          background="surface"
          border="brand-alpha-medium"
          radius="xl"
          padding="64"
          gap="24"
          horizontal="center"
          align="center"
          overflow="hidden"
          s={{ padding: "32" }}
        >
          <Background
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            gradient={{
              display: true,
              colorStart: "brand-alpha-medium",
              colorEnd: "static-transparent",
              x: 50,
              y: 100,
              width: 150,
              height: 80,
              opacity: 60,
            }}
          />
          <Column zIndex={1} gap="12" horizontal="center" maxWidth={32}>
            <Heading as="h2" variant="display-strong-s">
              {t.rich("ctaHeading", accentTags)}
            </Heading>
            <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
              {t("ctaBody")}
            </Text>
          </Column>
          <Row zIndex={1} data-border="rounded">
            <Button href={localePath(locale, "/contact")} size="l" arrowIcon>
              {t("ctaButton")}
            </Button>
          </Row>
        </Column>
      </Column>
    </Column>
  );
}
