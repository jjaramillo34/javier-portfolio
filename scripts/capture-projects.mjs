// Captures live screenshots and basic metadata for every project that has a website.
//
//   pnpm capture:projects                 # all projects with a link
//   pnpm capture:projects miles-for-mbc   # only these slugs
//
// Writes public/images/projects/<slug>/{desktop,section-N,mobile}.webp and merges results
// into src/content/project-media.json. Uses the locally installed Chrome (set CHROME_PATH
// to use another Chromium build). A site that fails keeps its previous captures.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const DATA = "src/content/portfolio-data.json";
const MANIFEST = "src/content/project-media.json";
const OUT_DIR = "public/images/projects";
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const SECTIONS = 3;

// Must match slugify in src/content/index.ts.
const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const only = process.argv.slice(2);
const data = JSON.parse(await readFile(DATA, "utf8"));
const projects = data.projects
  .filter((project) => project.link && project.link !== "#")
  .map((project) => ({ slug: slugify(project.title), url: project.link }))
  .filter((project) => only.length === 0 || only.includes(project.slug));

let manifest = {};
try {
  manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch {
  // First run.
}

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);
// Headless Chrome announces itself as "HeadlessChrome", which bot protection often blocks.
const userAgent = (
  await browser.newPage().then(async (page) => {
    const ua = await page.evaluate(() => navigator.userAgent);
    await page.close();
    return ua;
  })
).replace("HeadlessChrome", "Chrome");

const toWebp = (png, width) => sharp(png).resize({ width }).webp({ quality: 80 }).toBuffer();

async function open(context, url) {
  const page = await context.newPage();
  const response = await page
    .goto(url, { waitUntil: "networkidle", timeout: 45_000 })
    .catch(async () => page.goto(url, { waitUntil: "load", timeout: 45_000 }));
  if (!response || response.status() >= 400) {
    throw new Error(`HTTP ${response?.status() ?? "no response"}`);
  }
  // Sites with CSS smooth scrolling would still be moving when we take a screenshot.
  await page.addStyleTag({ content: "html, body { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1500);
  return page;
}

// Scroll through once so lazy images and scroll-triggered animations have loaded.
async function warmUp(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
}

async function capture({ slug, url }) {
  const dir = join(OUT_DIR, slug);
  await mkdir(dir, { recursive: true });
  const base = `/images/projects/${slug}`;

  const desktop = await browser.newContext({ viewport: DESKTOP, userAgent, deviceScaleFactor: 1 });
  const page = await open(desktop, url);
  await warmUp(page);

  const meta = await page.evaluate(() => ({
    title: document.title.trim(),
    description:
      document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "",
    height: document.documentElement.scrollHeight,
  }));

  await writeFile(join(dir, "desktop.webp"), await toWebp(await page.screenshot(), DESKTOP.width));

  // Evenly spaced views down the page, skipping the hero, when the page is long enough.
  const gallery = [];
  const scrollable = meta.height - DESKTOP.height;
  if (scrollable > DESKTOP.height) {
    for (let i = 1; i <= SECTIONS; i++) {
      const y = Math.round((scrollable * i) / SECTIONS);
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(700);
      const file = `section-${i}.webp`;
      await writeFile(join(dir, file), await toWebp(await page.screenshot(), DESKTOP.width));
      gallery.push(`${base}/${file}`);
    }
  }
  await desktop.close();

  const mobileContext = await browser.newContext({
    viewport: MOBILE,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: `${userAgent} Mobile`,
  });
  const mobilePage = await open(mobileContext, url);
  await warmUp(mobilePage);
  await writeFile(join(dir, "mobile.webp"), await toWebp(await mobilePage.screenshot(), 520));
  await mobileContext.close();

  return {
    url,
    capturedAt: new Date().toISOString().slice(0, 10),
    siteTitle: meta.title,
    siteDescription: meta.description,
    desktop: `${base}/desktop.webp`,
    mobile: `${base}/mobile.webp`,
    gallery,
  };
}

for (const project of projects) {
  process.stdout.write(`${project.slug} … `);
  try {
    manifest[project.slug] = await capture(project);
    console.log(`ok (${manifest[project.slug].gallery.length} sections)`);
  } catch (error) {
    console.log(`skipped: ${error.message}`);
  }
}

await browser.close();
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Updated ${MANIFEST}`);
