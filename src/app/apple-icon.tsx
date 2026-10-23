import { renderIcon } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds home-screen icons itself, so this one is square.
export default async function AppleIcon() {
  return renderIcon(180, { rounded: false });
}
