"use client";

import { usePathname } from "@/i18n/navigation";
import { type Locale, localePath } from "@/i18n/routing";
import { Fade, IconButton, Line, Row, ToggleButton, useTheme } from "@once-ui-system/core";
import type { IconName } from "@once-ui-system/core";
import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";

const navItems: {
  path: string;
  icon: IconName;
  key: "about" | "work" | "certifications" | "contact";
}[] = [
  { path: "/about", icon: "person", key: "about" },
  { path: "/work", icon: "grid", key: "work" },
  { path: "/certifications", icon: "book", key: "certifications" },
  { path: "/contact", icon: "mail", key: "contact" },
];

function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <IconButton
      icon={resolvedTheme === "dark" ? "light" : "dark"}
      variant="ghost"
      tooltip={label}
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    />
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  // Path without the locale prefix, e.g. "/work/miles-for-mbc".
  const pathname = usePathname();
  const otherLocale: Locale = locale === "en" ? "es" : "en";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        as="header"
        fillWidth
        horizontal="center"
        padding="8"
        position="sticky"
        top="0"
        zIndex={9}
        // On phones the nav docks to the bottom edge, within thumb reach.
        s={{ position: "fixed", bottom: "0", style: { top: "auto" } }}
      >
        <Row
          background="page"
          border
          radius="m-4"
          shadow="l"
          padding="4"
          gap="4"
          vertical="center"
          textVariant="body-default-s"
          data-border="rounded"
        >
          <ToggleButton
            prefixIcon="home"
            href={localePath(locale, "/")}
            aria-label={t("home")}
            selected={pathname === "/"}
          />
          <Line background="neutral-alpha-medium" vert maxHeight="24" />
          {navItems.map((item) => {
            const href = localePath(locale, item.path);
            const selected = pathname.startsWith(item.path);
            return (
              <Fragment key={item.path}>
                <Row s={{ hide: true }}>
                  <ToggleButton
                    prefixIcon={item.icon}
                    href={href}
                    label={t(item.key)}
                    selected={selected}
                  />
                </Row>
                <Row hide s={{ hide: false }}>
                  <ToggleButton
                    prefixIcon={item.icon}
                    href={href}
                    aria-label={t(item.key)}
                    selected={selected}
                  />
                </Row>
              </Fragment>
            );
          })}
          <Line background="neutral-alpha-medium" vert maxHeight="24" />
          <ToggleButton
            href={localePath(otherLocale, pathname)}
            label={t("languageShort")}
            aria-label={t("switchLanguage")}
          />
          <ThemeToggle label={t("toggleTheme")} />
        </Row>
      </Row>
    </>
  );
}
