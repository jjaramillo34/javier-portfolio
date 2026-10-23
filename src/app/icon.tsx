import { renderIcon } from "@/lib/og";

// Browser tab, Android, and PWA icons generated from the "JJ" monogram.
const SIZES = [32, 192, 512];

export function generateImageMetadata() {
  return SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return renderIcon(Number(await id));
}
