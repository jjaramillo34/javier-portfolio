# Javier Jaramillo Portfolio

A bilingual, data-driven portfolio for Javier Jaramillo, built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. It presents professional experience, selected projects, technical skills, certifications, testimonials, and contact options for recruiters and potential clients.

## Features

- Responsive portfolio layout with dark/light theme support.
- English/Spanish language switching with synchronized document metadata.
- Accessible vertical navigation with mobile dismissal and keyboard support.
- Hero conversion area with availability status, verified results, resume download, and social links.
- Featured projects, case-study previews, category filters, achievement highlights, and project detail dialogs.
- Contentful CMS integration with a local JSON fallback for graceful degradation.
- Searchable and filterable certifications with credential links.
- Technical skills grouped by category and separated into core and additional tools.
- Experience timeline with current-role and measurable-impact emphasis.
- Testimonials with relationship context, filtering, featured recommendations, and progressive quote display.
- Contact form through Formspree with optional reCAPTCHA protection.
- Vercel Web Analytics integration and an optional server-side visitor count.
- Reduced-motion support, SEO metadata, Open Graph tags, and lazy-loaded project images.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Contentful
- Formspree
- Vercel Analytics
- Lucide React
- PNPM

## Getting started

### Prerequisites

- Node.js 18 or newer
- PNPM

### Install and run locally

```bash
git clone https://github.com/jjaramillo34/javier-portfolio.git
cd javier-portfolio
pnpm install
pnpm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173).

### Validate and build

```bash
pnpm run lint
pnpm run build
pnpm run preview
```

The local fallback data can be checked independently with:

```bash
node -e "JSON.parse(require('fs').readFileSync('public/data/portfolio-data.json')); console.log('portfolio data valid')"
```

## Environment variables

Create a `.env.local` file for local development. Never commit this file or put secret tokens in client-side source code.

### Contact form

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_FORMSPREE_ID` | Recommended | Formspree form ID used by the contact form. Without it, submissions are not connected to a Formspree form. |
| `VITE_RECAPTCHA_SITE_KEY` | Optional | Public reCAPTCHA site key. The challenge is skipped when unset and is also skipped on localhost. |

### Contentful

Contentful is optional. When these values are not configured, the site uses `public/data/portfolio-data.json`.

| Variable | Required for Contentful | Description |
| --- | --- | --- |
| `VITE_CONTENTFUL_SPACE_ID` | Yes | Contentful space ID. |
| `VITE_CONTENTFUL_DELIVERY_TOKEN` | Yes, unless preview is used | Content delivery API token. |
| `VITE_CONTENTFUL_PREVIEW_TOKEN` | Only for preview mode | Contentful preview API token. |
| `VITE_CONTENTFUL_USE_PREVIEW` | Optional | Set to `true` to use the preview API and preview token. |
| `VITE_CONTENTFUL_ENVIRONMENT` | Optional | Contentful environment; defaults to `master`. |
| `VITE_CONTENTFUL_LOCALE_EN` | Optional | English locale; defaults to `en-US`. |
| `VITE_CONTENTFUL_LOCALE_ES` | Optional | Spanish locale; defaults to `es-ES`. |

### Vercel visitor count

The visitor count endpoint runs server-side so the API token is not exposed in the browser.

| Variable | Required for visitor count | Description |
| --- | --- | --- |
| `VERCEL_API_TOKEN` | Yes | Vercel API token with permission to query Web Analytics for the `javier-portfolio` project. |

If `VERCEL_API_TOKEN` is missing or the analytics request fails, the visitor count is hidden and the rest of the site remains available.

## Deploying to Vercel

1. Import the repository into Vercel.
2. Select the Vite framework preset.
3. Add the environment variables required by the features you use under **Project Settings → Environment Variables**.
4. For the full CMS-backed deployment, add the Contentful variables. For the local JSON fallback, no Contentful variables are needed.
5. Add `VERCEL_API_TOKEN` if the footer visitor count should be displayed.
6. Add `VITE_FORMSPREE_ID` if the contact form should submit to Formspree.
7. Deploy. Vercel serves the generated `dist` directory from the project build.

For local Vercel-style development, use:

```bash
vercel dev
```

## Project structure

- `src/components/sections/` — Portfolio sections and page content.
- `src/components/ui/` — Reusable UI primitives.
- `src/contexts/` — Theme and language state.
- `src/services/contentful.ts` — Contentful client and normalization.
- `src/types/` — TypeScript data contracts.
- `public/data/portfolio-data.json` — Local content and translation fallback.
- `public/images/` — Portfolio imagery.
- `api/visitor-count.ts` — Server-side Vercel visitor-count endpoint.

## Credits

- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Contentful](https://www.contentful.com/)
- [Formspree](https://formspree.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)

## License

This project is open source and available under the [MIT License](LICENSE).
