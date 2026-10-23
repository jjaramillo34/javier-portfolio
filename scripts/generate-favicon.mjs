// Builds src/app/favicon.ico from the generated "JJ" icon so the .ico matches src/lib/og.tsx.
// Usage: start the app (pnpm build && pnpm start), then: node scripts/generate-favicon.mjs [baseUrl]
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";
const SIZES = [16, 32, 48];

const response = await fetch(`${base}/icon/512`);
if (!response.ok) throw new Error(`Could not fetch ${base}/icon/512: ${response.status}`);
const source = Buffer.from(await response.arrayBuffer());

const images = await Promise.all(
  SIZES.map((size) => sharp(source).resize(size, size).png().toBuffer()),
);

// ICO container with PNG-encoded entries: 6-byte header, 16 bytes per entry, then image data.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

let offset = header.length + images.length * 16;
const entries = images.map((data, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(SIZES[index], 0); // width
  entry.writeUInt8(SIZES[index], 1); // height
  entry.writeUInt8(0, 2); // palette colors
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});

await writeFile("src/app/favicon.ico", Buffer.concat([header, ...entries, ...images]));
console.log(`Wrote src/app/favicon.ico (${SIZES.join(", ")} px)`);
