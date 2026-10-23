import { SectionHeader } from "@/components/SectionHeader";
import { education, languages, personalInfo, skills, workExperience } from "@/content";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { avatar } from "@/resources/site";
import type { SkillCategoryKey } from "@/types/portfolio";
import { Avatar, Column, Grid, Heading, Icon, Line, Row, Tag, Text } from "@once-ui-system/core";
import { getTranslations, setRequestLocale } from "next-intl/server";

const SKILL_CATEGORIES: SkillCategoryKey[] = [
  "languages",
  "dataVisualization",
  "frontend",
  "databases",
  "cloud",
  "tools",
];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

export default async function About({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  return (
    <Column maxWidth="m" gap="104" paddingTop="80" paddingBottom="104" s={{ paddingTop: "40" }}>
      {/* Intro */}
      <Row gap="40" vertical="center" s={{ direction: "column", horizontal: "center" }}>
        <Avatar src={avatar} size="xl" />
        <Column gap="16" flex={1} s={{ horizontal: "center", align: "center" }}>
          <Text variant="label-default-s" onBackground="brand-medium">
            {t("eyebrow")}
          </Text>
          <Heading as="h1" variant="display-strong-m">
            {personalInfo.name}
          </Heading>
          <Text variant="heading-default-m" onBackground="neutral-weak">
            {tHome("role")}
          </Text>
          <Text variant="body-default-l" onBackground="neutral-medium">
            {locale === "es" ? tHome("summary") : personalInfo.summary}
          </Text>
          <Row gap="8" wrap s={{ horizontal: "center" }}>
            {languages.map((language) => (
              <Tag key={language.language} size="m" prefixIcon="globe">
                {language.language} · {language.proficiency}
              </Tag>
            ))}
          </Row>
        </Column>
      </Row>

      {/* Experience timeline */}
      <Column gap="40">
        <Heading as="h2" variant="display-strong-xs">
          {t("experience")}
        </Heading>
        <Column as="ol" gap="0" margin="0" padding="0" style={{ listStyle: "none" }}>
          {workExperience.map((job, index) => {
            const current = /present/i.test(job.period);
            const last = index === workExperience.length - 1;
            return (
              <Row as="li" key={job.id} gap="24">
                {/* Timeline rail */}
                <Column horizontal="center" minWidth="16" paddingTop="8">
                  <Row
                    width="12"
                    height="12"
                    radius="full"
                    solid={current ? "brand-strong" : undefined}
                    background={current ? undefined : "neutral-alpha-medium"}
                    border={current ? "brand-alpha-strong" : true}
                  />
                  {!last && <Line vert flex={1} marginTop="8" background="neutral-alpha-medium" />}
                </Column>
                <Column flex={1} gap="8" paddingBottom="40">
                  <Row
                    fillWidth
                    horizontal="between"
                    vertical="center"
                    gap="12"
                    s={{ direction: "column", vertical: "start" }}
                  >
                    <Column gap="4">
                      <Text variant="heading-strong-m">{job.title}</Text>
                      <Text variant="body-default-s" onBackground="brand-medium">
                        {job.company} · {job.location}
                      </Text>
                    </Column>
                    <Tag size="s" scheme={current ? "brand" : "neutral"}>
                      {job.period.replace("Present", t("present"))}
                    </Tag>
                  </Row>
                  <Column as="ul" gap="8" margin="0" paddingLeft="20">
                    {job.achievements.map((achievement) => (
                      <Text
                        as="li"
                        key={achievement}
                        variant="body-default-m"
                        onBackground="neutral-weak"
                      >
                        {achievement}
                      </Text>
                    ))}
                  </Column>
                </Column>
              </Row>
            );
          })}
        </Column>
      </Column>

      {/* Education */}
      <Column gap="40">
        <Heading as="h2" variant="display-strong-xs">
          {t("education")}
        </Heading>
        <Grid columns="3" gap="16" s={{ columns: 1 }}>
          {education.map((item) => (
            <Column key={item.degree} background="surface" border radius="l" padding="24" gap="8">
              <Icon name="book" onBackground="brand-medium" />
              <Text variant="heading-strong-s">{item.degree}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {item.school} · {item.period}
              </Text>
            </Column>
          ))}
        </Grid>
      </Column>

      {/* Skills */}
      <Column gap="40">
        <Column gap="12">
          <Heading as="h2" variant="display-strong-xs">
            {t("skills")}
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            {t("skillsSubheading")}
          </Text>
        </Column>
        <Grid columns="2" gap="16" s={{ columns: 1 }}>
          {SKILL_CATEGORIES.map((category) => (
            <Column key={category} background="surface" border radius="l" padding="24" gap="16">
              <Text variant="heading-strong-s">{t(`skillCategories.${category}`)}</Text>
              <Column gap="12">
                {skills[category].map((skill) => (
                  <Column key={skill.name} gap="4">
                    <Row horizontal="between" textVariant="label-default-s">
                      <Text>{skill.name}</Text>
                      <Text onBackground="neutral-weak">{skill.level}%</Text>
                    </Row>
                    {/* Proficiency meter */}
                    <Row
                      fillWidth
                      height="4"
                      radius="full"
                      background="neutral-alpha-weak"
                      aria-hidden
                    >
                      <Row
                        height="4"
                        radius="full"
                        solid="brand-strong"
                        style={{ width: `${skill.level}%` }}
                      />
                    </Row>
                  </Column>
                ))}
              </Column>
            </Column>
          ))}
        </Grid>
      </Column>

      {/* Dedication */}
      <Column
        background="surface"
        border="brand-alpha-medium"
        radius="xl"
        padding="40"
        gap="16"
        s={{ padding: "24" }}
      >
        <SectionHeader eyebrow={t("storyEyebrow")} title={t("storyLead")} />
        <Text variant="body-default-l" onBackground="neutral-medium">
          {t("storyBody")}
        </Text>
        <Row gap="8" vertical="center">
          <Icon name="heart" onBackground="brand-medium" size="s" />
          <Text variant="body-default-m" onBackground="neutral-weak">
            {t("storyThanks")}
          </Text>
        </Row>
      </Column>
    </Column>
  );
}
