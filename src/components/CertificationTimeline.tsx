"use client";

import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import type { CertificationCategoryKey, TimelineCertification } from "@/types/portfolio";
import {
  Column,
  CountFx,
  Grid,
  Row,
  SmartLink,
  Tag,
  Text,
  ToggleButton,
  useInViewport,
  useReducedMotion,
} from "@once-ui-system/core";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CertificationTimeline.module.scss";

// Each subject gets a colour scheme; --cat drives its dot, card edge, swatch and tag.
const CATEGORY_SCHEME: Record<
  CertificationCategoryKey,
  "brand" | "accent" | "info" | "success" | "warning"
> = {
  dataAnalysis: "brand",
  computerVisionAI: "accent",
  backendDevelopment: "info",
  excelVBA: "success",
  security: "warning",
};

const catColor = (category: CertificationCategoryKey) =>
  ({ "--cat": `var(--${CATEGORY_SCHEME[category]}-on-background-medium)` }) as React.CSSProperties;

type Filter = "all" | CertificationCategoryKey;

interface CertificationTimelineProps {
  items: TimelineCertification[];
}

export function CertificationTimeline({ items }: CertificationTimelineProps) {
  const t = useTranslations("certifications");
  const [filter, setFilter] = useState<Filter>("all");
  const [animate, setAnimate] = useState(false);
  const { shouldAnimate } = useReducedMotion();

  // Hide not-yet-seen cards only once JS runs, so content is never invisible without it.
  useEffect(() => setAnimate(true), []);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );
  const years = useMemo(() => {
    const groups = new Map<number, TimelineCertification[]>();
    for (const item of visible) groups.set(item.year, [...(groups.get(item.year) ?? []), item]);
    return [...groups.entries()];
  }, [visible]);

  const categories = Object.keys(CATEGORY_SCHEME) as CertificationCategoryKey[];
  const allYears = items.map((item) => item.year);
  const [minYear, maxYear] = [Math.min(...allYears), Math.max(...allYears)];
  const institutions = new Set(items.map((item) => item.institution)).size;

  const { listRef, markerRef, rail, reached } = useTimelineProgress(filter);
  // Markers are numbered in render order: each year pill, then its certifications.
  let markerIndex = 0;
  let itemIndex = 0;

  return (
    <Column fillWidth gap="64">
      <Stats
        stats={[
          { value: items.length, label: t("statCertifications") },
          { value: institutions, label: t("statInstitutions") },
          { text: `${minYear}–${maxYear}`, label: t("statSpan") },
        ]}
      />

      <ActivityChart
        items={visible}
        minYear={minYear}
        maxYear={maxYear}
        title={t("activityTitle")}
        hint={t("activityHint")}
        barLabel={(year, count) => t("jumpTo", { year, count })}
      />

      {/* Subject filter */}
      <Row gap="8" wrap role="toolbar" aria-label={t("filterLabel")}>
        <ToggleButton
          selected={filter === "all"}
          onClick={() => setFilter("all")}
          variant="outline"
          label={`${t("filterAll")} · ${items.length}`}
        />
        {categories.map((category) => (
          <ToggleButton
            key={category}
            selected={filter === category}
            onClick={() => setFilter(category)}
            variant="outline"
            style={catColor(category)}
          >
            <Row gap="8" vertical="center">
              <span className={styles.swatch} aria-hidden />
              {t(`categories.${category}`)} ·{" "}
              {items.filter((item) => item.category === category).length}
            </Row>
          </ToggleButton>
        ))}
      </Row>

      {/* Timeline */}
      <div ref={listRef} className={styles.timeline} data-animate={animate && shouldAnimate}>
        <div className={styles.rail} style={{ top: rail.top, height: rail.height }} aria-hidden />
        <div className={styles.fill} style={{ top: rail.top, height: rail.fill }} aria-hidden />
        {years.map(([year, certs]) => {
          const yearMarker = markerIndex++;
          return (
            <section key={year} aria-label={String(year)}>
              <div id={`certs-${year}`} className={styles.year}>
                <div
                  ref={markerRef(yearMarker)}
                  className={styles.yearPill}
                  data-lit={yearMarker < reached}
                >
                  <Text variant="heading-strong-l">{year}</Text>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {t("count", { count: certs.length })}
                  </Text>
                </div>
              </div>
              <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {certs.map((cert) => {
                  const marker = markerIndex++;
                  const side = itemIndex++ % 2 === 0 ? "" : styles.right;
                  return (
                    <li
                      key={cert.id}
                      className={`${styles.item} ${side}`}
                      style={catColor(cert.category)}
                    >
                      <span
                        ref={markerRef(marker)}
                        className={styles.dot}
                        data-lit={marker < reached}
                        aria-hidden
                      />
                      <CertCard cert={cert} />
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </Column>
  );
}

function CertCard({ cert }: { cert: TimelineCertification }) {
  const { link } = cert;
  const t = useTranslations("certifications");
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  return (
    <Column
      ref={ref}
      className={styles.card}
      data-seen={seen}
      background="surface"
      border
      radius="l"
      padding="20"
      gap="12"
    >
      <Row horizontal="between" vertical="center" gap="8" wrap>
        <Tag size="s" scheme={CATEGORY_SCHEME[cert.category]}>
          {t(`categories.${cert.category}`)}
        </Tag>
        <Text variant="label-default-s" onBackground="neutral-weak">
          {cert.issueDate}
        </Text>
      </Row>
      <Column gap="4">
        <Text variant="heading-strong-s">{cert.title}</Text>
        <Text variant="body-default-s" style={{ color: "var(--cat)" }}>
          {cert.institution}
        </Text>
      </Column>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {cert.description}
      </Text>
      <Row gap="4" wrap>
        {cert.skills.slice(0, 4).map((skill) => (
          <Tag key={skill} size="s">
            {skill}
          </Tag>
        ))}
      </Row>
      {(cert.credentialId || link) && (
        <Row horizontal="between" vertical="center" gap="8" wrap>
          {cert.credentialId && (
            <Text variant="label-default-xs" onBackground="neutral-weak">
              {t("credentialId", { id: cert.credentialId })}
            </Text>
          )}
          {link && (
            <SmartLink href={link} suffixIcon="arrowUpRight">
              {t("viewCredential")}
            </SmartLink>
          )}
        </Row>
      )}
    </Column>
  );
}

function Stats({ stats }: { stats: { value?: number; text?: string; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  return (
    <Grid ref={ref} columns="3" gap="16" s={{ columns: 1 }}>
      {stats.map((stat) => (
        <Column key={stat.label} background="surface" border radius="l" padding="24" gap="4">
          {stat.value !== undefined ? (
            <CountFx value={seen ? stat.value : 0} speed={1000} variant="display-strong-s" />
          ) : (
            <Text variant="display-strong-s">{stat.text}</Text>
          )}
          <Text variant="label-default-s" onBackground="neutral-weak">
            {stat.label}
          </Text>
        </Column>
      ))}
    </Grid>
  );
}

interface ActivityChartProps {
  items: TimelineCertification[];
  minYear: number;
  maxYear: number;
  title: string;
  hint: string;
  barLabel: (year: number, count: number) => string;
}

/** Certifications per year as bars that grow in; a bar jumps to its year in the timeline. */
function ActivityChart({ items, minYear, maxYear, title, hint, barLabel }: ActivityChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inViewport) setSeen(true);
  }, [inViewport]);

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const counts = years.map((year) => items.filter((item) => item.year === year).length);
  const max = Math.max(1, ...counts);

  return (
    <Column ref={ref} background="surface" border radius="l" padding="24" gap="4">
      <Text variant="heading-strong-s">{title}</Text>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {hint}
      </Text>
      <div className={styles.chart}>
        {years.map((year, index) => {
          const count = counts[index];
          return (
            <button
              key={year}
              type="button"
              className={styles.bar}
              disabled={count === 0}
              aria-label={barLabel(year, count)}
              onClick={() => {
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                document
                  .getElementById(`certs-${year}`)
                  ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
              }}
            >
              <Text
                variant="label-strong-s"
                onBackground={count ? "neutral-strong" : "neutral-weak"}
              >
                {count}
              </Text>
              <span className={styles.barTrack}>
                <span
                  className={styles.barFill}
                  style={{
                    height: seen ? `${(count / max) * 100}%` : "0%",
                    transitionDelay: `${index * 60}ms`,
                  }}
                />
              </span>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                {year}
              </Text>
            </button>
          );
        })}
      </div>
    </Column>
  );
}
