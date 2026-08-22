import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Signing out on the server clears the auth cookies as part of the response, so
 * it works even when the client bundle is wedged and cannot run its own
 * sign-out call or refresh the router.
 */
export async function POST(request: Request) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
