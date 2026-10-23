"use client";

import type { Testimonial } from "@/types/portfolio";
import { Column, IconButton, Row, Text } from "@once-ui-system/core";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { TestimonialCard } from "./TestimonialCard";
import styles from "./Testimonials.module.scss";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  /** Section title, rendered beside the carousel controls. */
  header: React.ReactNode;
}

export function TestimonialCarousel({ testimonials, header }: TestimonialCarouselProps) {
  const t = useTranslations("testimonials");
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  // How many cards fit in view (3 on desktop, 2 on tablets, 1 on phones).
  const [visible, setVisible] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild as HTMLElement | null;
    const step = slide ? slide.offsetWidth : track.clientWidth;
    setCurrent(Math.round(track.scrollLeft / step));
    setVisible(Math.max(1, Math.floor((track.clientWidth + 1) / step)));
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollBySlide = (direction: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;
    track.scrollBy({ left: direction * slide.offsetWidth });
  };

  return (
    <Column fillWidth gap="40">
      <Row
        fillWidth
        horizontal="between"
        vertical="end"
        gap="24"
        s={{ direction: "column", vertical: "start" }}
      >
        {header}
        <Row gap="8" vertical="center" data-border="rounded">
          <Text
            variant="label-default-s"
            onBackground="neutral-weak"
            aria-live="polite"
            style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
          >
            {visible > 1
              ? t("positionRange", {
                  start: current + 1,
                  end: Math.min(current + visible, testimonials.length),
                  total: testimonials.length,
                })
              : t("position", { current: current + 1, total: testimonials.length })}
          </Text>
          <IconButton
            icon="chevronLeft"
            variant="secondary"
            aria-label={t("previous")}
            disabled={atStart}
            onClick={() => scrollBySlide(-1)}
          />
          <IconButton
            icon="chevronRight"
            variant="secondary"
            aria-label={t("next")}
            disabled={atEnd}
            onClick={() => scrollBySlide(1)}
          />
        </Row>
      </Row>
      <Reveal>
        <section
          ref={trackRef}
          className={styles.track}
          aria-roledescription="carousel"
          aria-label={t("carouselLabel")}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable
          tabIndex={0}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={styles.slide}
              // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern uses role="group" for slides
              role="group"
              aria-roledescription="slide"
              aria-label={t("position", { current: index + 1, total: testimonials.length })}
            >
              <TestimonialCard
                testimonial={testimonial}
                relationshipLabel={t(`relationship.${testimonial.relationshipType}`)}
                readMoreLabel={t("readMore")}
                readLessLabel={t("readLess")}
              />
            </div>
          ))}
        </section>
      </Reveal>
    </Column>
  );
}
