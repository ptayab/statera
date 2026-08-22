import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

/**
 * Session refresh costs two Supabase round trips, so it must only run for real
 * page navigations. Asset requests and service-worker probes such as /sw.js
 * were previously paying the full auth cost to produce a 404.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|workbox-|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|js|mjs|css|map|json|txt|xml|woff|woff2|ttf)$).*)",
  ],
};
