import type { UserRole } from "@/lib/supabase/types";

/** Default site id for the pilot — all test accounts share this until multi-site is needed. */
export const PILOT_SITE_ID = "00000000-0000-0000-0000-000000000001";

export function homePathForRole(role: UserRole): string {
  return role === "supervisor" ? "/dashboard" : "/submit";
}
