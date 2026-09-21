import { formatDuration } from "@/lib/tickets/format";
import type { SiteReportStats, ReportTicketLine } from "@/lib/tickets/trends";

export type SiteBriefing = {
  headline: string;
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  model: string;
  generatedAt: string;
};

function stringList(
  value: unknown,
  maxItems: number,
  maxLen: number,
): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => item.slice(0, maxLen))
    .slice(0, maxItems);
}

export function parseSiteBriefing(
  value: unknown,
  model: string,
): SiteBriefing | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.headline !== "string" || typeof row.summary !== "string") {
    return null;
  }

  const highlights = stringList(row.highlights, 6, 400);
  const concerns = stringList(row.concerns, 6, 400);
  const recommendations = stringList(row.recommendations, 6, 400);
  if (highlights.length === 0 || concerns.length === 0 || recommendations.length === 0) {
    return null;
  }

  return {
    headline: row.headline.trim().slice(0, 180),
    summary: row.summary.trim().slice(0, 1200),
    highlights,
    concerns,
    recommendations,
    model,
    generatedAt: new Date().toISOString(),
  };
}

export function templateSiteBriefing(
  stats: SiteReportStats,
  tickets: ReportTicketLine[],
): SiteBriefing {
  const highlights: string[] = [
    `${stats.open} live report${stats.open === 1 ? "" : "s"} still need work.`,
    `${stats.filedThisWeek} filed in the last 7 days.`,
  ];

  if (stats.longOpen > 0) {
    highlights.push(
      `${stats.longOpen} have been open longer than a week.`,
    );
  }

  const topCategory = stats.categories[0];
  if (topCategory) {
    highlights.push(
      `${topCategory.name} is the most common open category (${topCategory.count}).`,
    );
  }

  const highPriority = stats.priorities
    .filter((row) => row.label === "Critical" || row.label === "High")
    .reduce((sum, row) => sum + row.count, 0);
  if (highPriority > 0) {
    highlights.push(
      `${highPriority} open report${highPriority === 1 ? "" : "s"} currently rank Critical or High.`,
    );
  }

  const concerns: string[] = [];
  if (stats.hazardReports > 0) {
    concerns.push(
      `${stats.hazardReports} open hazard report${stats.hazardReports === 1 ? "" : "s"} (unsafe condition, near-miss, or dangerous occurrence). Follow official site procedures as well as this app.`,
    );
  }
  if (stats.longOpen > 0) {
    concerns.push(
      `${stats.longOpen} report${stats.longOpen === 1 ? "" : "s"} have been open more than 7 days.`,
    );
  }
  if (stats.goneQuiet > 0) {
    concerns.push(
      `${stats.goneQuiet} open report${stats.goneQuiet === 1 ? "" : "s"} have gone quiet (idle over 7 days).`,
    );
  }
  if (stats.unassignedOpen > 0) {
    concerns.push(
      `${stats.unassignedOpen} live report${stats.unassignedOpen === 1 ? "" : "s"} have no supervisor assigned.`,
    );
  }
  if (concerns.length === 0) {
    concerns.push("No elevated concerns from the live counts.");
  }

  const recommendations: string[] = [];
  if (tickets.some((ticket) => ticket.focus === "recent" && ticket.ranking === "Critical")) {
    recommendations.push("Work the newest Critical reports first.");
  }
  if (stats.unassignedOpen > 0) {
    recommendations.push(
      "Assign unclaimed reports so workers know someone has them.",
    );
  }
  if (stats.longOpen > 0 || stats.goneQuiet > 0) {
    recommendations.push(
      "Write back on long-open and idle tickets. Keep a no-blame tone so people keep reporting.",
    );
  }
  recommendations.push(
    "This briefing is an extra record — it does not replace official incident or emergency reporting.",
  );

  const summary =
    stats.open === 0
      ? "There are no live reports right now."
      : `${stats.open} live reports are still open, including ${stats.longOpen} older than a week. ${stats.filedThisWeek} were filed in the last 7 days. Average time to close: ${formatDuration(stats.avgCloseMs)}.`;

  return {
    headline: "Site safety briefing",
    summary,
    highlights: highlights.slice(0, 6),
    concerns: concerns.slice(0, 6),
    recommendations: recommendations.slice(0, 6),
    model: "template",
    generatedAt: new Date().toISOString(),
  };
}
