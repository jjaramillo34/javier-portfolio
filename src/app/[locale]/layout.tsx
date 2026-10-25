import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/resources/metadata";
import { dataStyle, style } from "@/resources/once-ui.config";
import { Background, Column, Flex, ThemeInit, VisuallyHidden } from "@once-ui-system/core";
import { Analytics } from "@vercel/analytics/next";
import type { Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

// Once UI reads these four font variables.
const heading = Geist({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const body = Geist({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const label = Geist({ variable: "--font-label", subsets: ["latin"], display: "swap" });
const code = Geist_Mono({ variable: "--font-code", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the phone bottom nav sit above the home indicator.
  viewportFit: "cover",
  themeColor: "#C46A12",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...buildMetadata({
      locale,
      path: "/",
      title: t("homeTitle"),
      description: t("homeDescription"),
    }),
    title: { default: t("homeTitle"), template: "%s · Javier Jaramillo" },
    authors: [{ name: "Javier Jaramillo" }],
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <Flex
      as="html"
      lang={locale}
      suppressHydrationWarning
      className={[heading.variable, body.variable, label.variable, code.variable].join(" ")}
    >
      <head>
        {/* Sets data-theme and the colour scheme before first paint, so there is no flash. */}
        <ThemeInit config={style} dataStyle={dataStyle} />
      </head>
      <NextIntlClientProvider>
        <Providers>
          <Column as="body" background="page" fillWidth margin="0" padding="0" minHeight="100vh">
            <VisuallyHidden as="a" href="#main" focusable>
              {t("skipToContent")}
            </VisuallyHidden>
            <Background
              position="fixed"
              top="0"
              left="0"
              fill
              pointerEvents="none"
              mask={{ x: 50, y: 0, radius: 100 }}
              gradient={{
                display: true,
                colorStart: "brand-alpha-medium",
                colorEnd: "static-transparent",
                x: 50,
                y: 0,
                width: 150,
                height: 60,
                opacity: 50,
              }}
              dots={{ display: true, color: "neutral-alpha-weak", size: "2", opacity: 40 }}
            />
            <Header />
            <Column
              as="main"
              id="main"
              fillWidth
              flex={1}
              horizontal="center"
              paddingX="l"
              zIndex={1}
              // Full-bleed section bands span 100vw; clip (not hidden) keeps sticky/scroll intact.
              style={{ overflowX: "clip" }}
            >
              {children}
            </Column>
            <Footer />
            <Analytics />
          </Column>
        </Providers>
      </NextIntlClientProvider>
    </Flex>
  );
}
