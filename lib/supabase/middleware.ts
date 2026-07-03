import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Refreshes the Supabase auth session on every matched request and enforces
 * route protection before pages render.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isWorkerRoute = pathname.startsWith("/worker");
  const isSupervisorRoute = pathname.startsWith("/supervisor");
  const isProtected = isWorkerRoute || isSupervisorRoute;

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (isProtected && !profile) {
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "no_profile");
      const redirectResponse = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    if (profile) {
      if (isSupervisorRoute && profile.role !== "supervisor") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/worker";
        return NextResponse.redirect(redirectUrl);
      }

      if (isWorkerRoute && profile.role !== "worker") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/supervisor";
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (pathname === "/login") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = profile
        ? profile.role === "supervisor"
          ? "/supervisor"
          : "/worker"
        : "/";
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}
