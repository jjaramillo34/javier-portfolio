# Javier Jaramillo Portfolio

A bilingual (English/Spanish) portfolio for Javier Jaramillo, built with Next.js and the open-source [Once UI](https://once-ui.com) design system. It presents experience, projects, skills, certifications, recommendations, and a contact form for recruiters and potential clients.

Every page is rendered to static HTML at build time, so search engines and link previews see the full content.

## Features

- Home page with availability status, animated stats, selected projects, recommendations, and a call to action.
- About page with an experience timeline, education, skill proficiency, languages, and a personal dedication.
- Work page with category filters and a dedicated page per project.
- Certifications grouped by subject, with credential links.
- Contact page with a Formspree form (optional reCAPTCHA) and direct contact channels.
- English at `/…` and Spanish at `/es/…`, with `hreflang` alternates, per-page Open Graph metadata, a sitemap, and `robots.txt`.
- Light/dark theme that follows the system setting, set before first paint.
- Vercel Web Analytics and an optional server-side visitor count.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- [Once UI core](https://github.com/once-ui-system/core) (MIT)
- next-intl for routing and translations
- Formspree
- Vercel Analytics
- Biome for linting and formatting
- PNPM

## Getting started

Requires Node.js 20.9 or newer and PNPM.

```bash
git clone https://github.com/jjaramillo34/javier-portfolio.git
cd javier-portfolio
pnpm install
pnpm dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

```bash
pnpm lint        # Biome
pnpm typecheck   # TypeScript
pnpm build       # production build
pnpm start       # serve the production build
```

## Editing content

- **Portfolio data** (experience, projects, skills, certifications, testimonials, stats): `src/content/portfolio-data.json`. Projects accept optional `titleEs`, `descriptionEs`, and `achievementsEs`; other entries are shown as written in both languages.
- **Interface text** (headings, buttons, labels, home summary): `src/messages/en.json` and `src/messages/es.json`. Both files must have the same keys.
- **Theme** (brand colors, borders, surfaces): `src/resources/once-ui.config.ts`.
- **Site URL, resume, avatar, and social image**: `src/resources/site.ts`.

Project pages live at `/work/<slug>`, where the slug comes from the English project title.

## Environment variables

Copy `.env.example` to `.env.local` for local development.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Recommended | Formspree form ID. Without it, the contact page asks visitors to email instead. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional | reCAPTCHA v2 site key. Skipped when unset and on localhost. |
| `VERCEL_API_TOKEN` | Optional | Vercel API token with access to Web Analytics. Enables the footer visitor count. |

`VERCEL_PROJECT_ID` is provided automatically on Vercel. If the token or project ID is missing, the visitor count is hidden.

## Deploying to Vercel

`vercel.json` sets the framework to Next.js, so the project builds correctly even if its dashboard preset is still Vite. Add the environment variables above under **Project Settings → Environment Variables** and deploy.

## Project structure

- `src/app/[locale]/` — Pages (home, about, work, certifications, contact) and the root layout.
- `src/app/api/visitor-count/` — Server-side visitor count.
- `src/components/` — Header, footer, cards, stats, and the contact form.
- `src/content/` — Portfolio data and typed, locale-aware accessors.
- `src/i18n/` and `src/proxy.ts` — Locale routing.
- `src/messages/` — Interface translations.
- `src/resources/` — Theme, icons, metadata helpers, and site constants.
- `public/` — Images, favicons, resume PDF, and the social sharing image.

## License

This project is open source and available under the [MIT License](LICENSE).
