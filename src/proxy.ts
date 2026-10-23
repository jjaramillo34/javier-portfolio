import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, anything with a file extension (images, resume PDF…),
  // the Keystatic editor, the generated icons, and social-card images, which must be served
  // as-is (no locale rewrite or redirect) so crawlers get them in one request.
  matcher:
    "/((?!api|_next|_vercel|keystatic|icon|apple-icon|.*opengraph-image|.*twitter-image|.*\\..*).*)",
};
