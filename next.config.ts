import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Without this, every route importing the Once UI root ships ~110 kB of extra JS.
    optimizePackageImports: ["@once-ui-system/core"],
  },
};

export default withNextIntl(nextConfig);
