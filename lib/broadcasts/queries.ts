import { createServerClient } from "@/lib/supabase/server";

export type SiteBroadcast = {
  id: string;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  created_by: string;
};

export async function getSiteBroadcasts(siteId: string): Promise<SiteBroadcast[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("site_broadcasts")
    .select("id, title, body, author_name, created_at, created_by")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}
