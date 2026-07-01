import { createServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  site_id: string;
};

export async function getSessionUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, name, role, site_id")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
}
