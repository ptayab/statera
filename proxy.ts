import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

/**
 * Session refresh costs two Supabase round trips, so it must only run for real
 * page navigations. Asset requests and service-worker probes such as /sw.js
 * were previously paying the full auth cost to produce a 404.
 *
 * Everything under /_next/ is excluded, not just static and image: the dev
 * server's hot-reload channel lives at /_next/webpack-hmr, and putting auth in
 * front of it breaks hot reloading.
 */
export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|sw\\.js|workbox-|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|js|mjs|css|map|json|txt|xml|woff|woff2|ttf)$).*)",
  ],
};
