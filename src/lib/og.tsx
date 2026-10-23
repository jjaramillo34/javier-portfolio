import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared Open Graph / Twitter card renderer. Images are generated at build time.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BRAND = "#E8862A";
const BRAND_DEEP = "#C46A12";
const ACCENT = "#5FD4E0";
const INK = "#F7F1EA";
const MUTED = "#BFB2A5";
const BG = "#120D09";

// Each read is scoped to a fixed folder so the bundler doesn't trace the whole project.
const readFont = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));
const readAsset = (file: string) => readFile(join(process.cwd(), "src/assets", file));
const readProjectImage = (file: string) =>
  readFile(join(process.cwd(), "public/images/projects", file));

const fonts = async () => {
  const [regular, medium, bold] = await Promise.all(
    ["Regular", "Medium", "Bold"].map((weight) => readFont(`Geist-${weight}.ttf`)),
  );
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: bold, weight: 700 as const, style: "normal" as const },
  ];
};

const jpegDataUrl = (data: Buffer) => `data:image/jpeg;base64,${data.toString("base64")}`;

/** Splits "Things I have <em>built</em>" into its plain and accented parts. */
export const splitAccent = (text: string) => {
  const match = text.match(/^(.*?)<em>(.*?)<\/em>(.*)$/s);
  return match
    ? { before: match[1], accent: match[2], after: match[3] }
    : { before: text, accent: "", after: "" };
};

interface OgCardOptions {
  eyebrow: string;
  /** Title text; wrap the highlighted part in <em>…</em>. */
  title: string;
  subtitle: string;
  tags?: string[];
  /** Project screenshot path ("/images/projects/x.jpg"); defaults to the portrait. */
  screenshot?: string | null;
}

export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  tags = [],
  screenshot,
}: OgCardOptions) {
  const { before, accent, after } = splitAccent(title);
  const visual = jpegDataUrl(
    screenshot
      ? await readProjectImage(screenshot.replace(/^\/images\/projects\//, ""))
      : await readAsset("og-avatar.jpg"),
  );
  // The column beside a screenshot is narrower, so long titles shrink sooner there.
  const titleLength = title.replace(/<\/?em>/g, "").length;
  const titleSize = screenshot ? (titleLength > 18 ? 54 : 66) : titleLength > 34 ? 58 : 72;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: BG,
        // Orange glow top-left, cyan glow bottom-right, and a faint dot grid.
        backgroundImage: [
          "radial-gradient(circle at 12% 0%, rgba(232,134,42,0.42), transparent 55%)",
          "radial-gradient(circle at 100% 100%, rgba(95,212,224,0.18), transparent 50%)",
          "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
        ].join(", "),
        backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        fontFamily: "Geist",
        color: INK,
        position: "relative",
      }}
    >
      {/* Copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 0 60px 72px",
          width: screenshot ? 640 : 760,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(135deg, #F0B14A, ${BRAND_DEEP})`,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              color: "white",
            }}
          >
            JJ
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: MUTED }}>jaramillohub.com</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              color: BRAND,
              fontWeight: 500,
            }}
          >
            <div style={{ width: 36, height: 3, backgroundColor: BRAND, borderRadius: 2 }} />
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {before && <span style={{ marginRight: accent ? 18 : 0 }}>{before.trim()}</span>}
            {accent && (
              <span
                style={{
                  backgroundImage: `linear-gradient(100deg, ${BRAND}, ${ACCENT})`,
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {accent}
              </span>
            )}
            {after && <span>{after}</span>}
          </div>
          <div
            style={{
              fontSize: 27,
              color: MUTED,
              lineHeight: 1.35,
              maxWidth: screenshot ? 540 : 660,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {tags.slice(0, screenshot ? 3 : 4).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1.5px solid rgba(232,134,42,0.45)",
                backgroundColor: "rgba(232,134,42,0.12)",
                fontSize: 20,
                fontWeight: 500,
                color: INK,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Visual: portrait, or a tilted project screenshot bleeding off the edge. */}
      {screenshot ? (
        <div style={{ display: "flex", position: "absolute", right: -60, top: 110 }}>
          <img
            src={visual}
            alt=""
            width={620}
            height={388}
            style={{
              borderRadius: 20,
              border: "2px solid rgba(255,255,255,0.12)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              transform: "rotate(-4deg)",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 84,
            top: 135,
            padding: 10,
            borderRadius: 999,
            backgroundImage: `linear-gradient(135deg, ${BRAND}, ${ACCENT})`,
            boxShadow: "0 0 120px rgba(232,134,42,0.45)",
          }}
        >
          <img
            src={visual}
            alt=""
            width={340}
            height={340}
            style={{ borderRadius: 999, border: `8px solid ${BG}`, objectFit: "cover" }}
          />
        </div>
      )}
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}

/** The "JJ" monogram used for favicons and app icons. */
export async function renderIcon(size: number, { rounded = true } = {}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: rounded ? size * 0.22 : 0,
        backgroundImage: `linear-gradient(135deg, #F0B14A 0%, ${BRAND} 45%, ${BRAND_DEEP} 100%)`,
        color: "white",
        fontFamily: "Geist",
        fontWeight: 700,
        fontSize: size * 0.5,
        letterSpacing: "-0.07em",
        paddingRight: size * 0.03,
      }}
    >
      JJ
    </div>,
    { width: size, height: size, fonts: await fonts() },
  );
}
