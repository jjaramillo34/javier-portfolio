import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { keystaticEnabled } from "../../../keystatic.config";
import KeystaticApp from "./keystatic";

// The editor renders its own <html>; it sits outside [locale], so the site layout doesn't apply.
export const metadata: Metadata = {
  title: "Content editor · Jaramillo Hub",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  if (!keystaticEnabled) notFound();
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
