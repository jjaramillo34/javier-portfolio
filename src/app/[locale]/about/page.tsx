import { Accent, accentTags } from "@/components/Accent";
import { Dedication } from "@/components/Dedication";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { SkillCard } from "@/components/SkillCard";
import { education, languages, personalInfo, skills, workExperience } from "@/content";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { avatar } from "@/resources/site";
import type { SkillCategoryKey } from "@/types/portfolio";
import { Avatar, Column, Grid, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
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
  const [firstName, ...rest] = personalInfo.name.split(" ");
  const lastName = rest.join(" ");

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
            {firstName} <Accent>{lastName}</Accent>
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
        <SectionTitle
          index={1}
          eyebrow={t("experience")}
          title={t.rich("experienceTitle", accentTags)}
        />
        <ExperienceTimeline jobs={workExperience} presentLabel={t("present")} />
      </Column>

      {/* Education */}
      <Column gap="40">
        <SectionTitle
          index={2}
          eyebrow={t("education")}
          title={t.rich("educationTitle", accentTags)}
        />
        <Reveal>
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
        </Reveal>
      </Column>

      {/* Skills */}
      <Column gap="40">
        <SectionTitle
          index={3}
          eyebrow={t("skills")}
          title={t.rich("skillsTitle", accentTags)}
          description={t("skillsSubheading")}
        />
        <Grid columns="2" gap="16" s={{ columns: 1 }}>
          {SKILL_CATEGORIES.map((category) => (
            <SkillCard
              key={category}
              title={t(`skillCategories.${category}`)}
              skills={skills[category]}
            />
          ))}
        </Grid>
      </Column>

      {/* Dedication */}
      <Dedication />
    </Column>
  );
}
