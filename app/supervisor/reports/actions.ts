"use server";

import { getUserProfile } from "@/lib/auth/session";
import { generateSiteReportWithClaude } from "@/lib/ai/claude";
import { templateSiteBriefing, type SiteBriefing } from "@/lib/tickets/period-report";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";
import {
  anonymizedReportTickets,
  buildSiteReportStats,
} from "@/lib/tickets/trends";

type ActionResult =
  | { ok: true; briefing: SiteBriefing }
  | { ok: false; error: string };

export async function generateSiteReport(): Promise<ActionResult> {
  const profile = await getUserProfile();

  if (!profile) {
    return { ok: false, error: "You must be signed in." };
  }

  if (profile.role !== "supervisor") {
    return { ok: false, error: "Only supervisors can generate site briefings." };
  }

  const tickets = await getSiteTicketsWithRanking(profile.site_id);
  const stats = buildSiteReportStats(tickets);
  const lines = anonymizedReportTickets(tickets);

  try {
    const briefing =
      (await generateSiteReportWithClaude(stats, lines)) ??
      templateSiteBriefing(stats, lines);
    return { ok: true, briefing };
  } catch (error) {
    console.error("Could not generate site briefing.", error);
    return {
      ok: true,
      briefing: templateSiteBriefing(stats, lines),
    };
  }
}
