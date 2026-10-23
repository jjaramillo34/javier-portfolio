import { makeRouteHandler } from "@keystatic/next/route-handler";
import config, { keystaticEnabled } from "../../../../../keystatic.config";

// Until the GitHub App is configured, production has no editor (and GitHub mode would fail
// the build for missing credentials), so the API answers 404.
const notFound = () => new Response("Not found", { status: 404 });

export const { GET, POST } = keystaticEnabled
  ? makeRouteHandler({ config })
  : { GET: notFound, POST: notFound };
