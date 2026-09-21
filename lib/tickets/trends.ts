import type { TicketStatus } from "@/lib/supabase/types";
import { shortId } from "@/lib/tickets/format";
import {
  eachUtcWeekStart,
  formatVolumeWeekLabel,
  isInRange,
  recentWeeksRange,
  utcDateKey,
  type DateRange,
} from "@/lib/tickets/periods";
import type { RankedTicketListItem } from "@/lib/tickets/queries";
import type { PriorityLabel } from "@/lib/tickets/scoring";
import { isOpenTicketStatus } from "@/lib/tickets/status";
import { idleLevel, PRIORITY_ORDER } from "@/lib/tickets/theme";

const ATTENTION_LIMIT = 8;
const REPORT_TICKET_LIMIT = 40;
const DESCRIPTION_LIMIT = 280;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const VOLUME_WEEKS = 8;

/** Hazard categories shown as one count on the reports tab. */
const HAZARD_CATEGORIES = new Set([
  "Unsafe Condition",
  "Near-Miss Report",
  "Dangerous Occurrence",
  "Unsafe Condition / Near-Miss",
]);

function isHazardCategory(category: string): boolean {
  return HAZARD_CATEGORIES.has(category);
}

/** Live work — not resolved or closed. */
export function isLiveTicket(ticket: { status: TicketStatus }): boolean {
  return isOpenTicketStatus(ticket.status) && ticket.status !== "Resolved";
}

export type VolumeBucket = {
  key: string;
  label: string;
  count: number;
};

export type NamedCount = {
  name: string;
  count: number;
};

export type PriorityCount = {
  label: PriorityLabel;
  count: number;
};

export type ReportTicketLine = {
  ref: string;
  category: string;
  status: string;
  ranking: PriorityLabel;
  daysOpen: number;
  daysIdle: number;
  focus: "recent" | "lingering";
  description: string;
};

export type SiteReportStats = {
  generatedAtIso: string;
  open: number;
  hazardReports: number;
  longOpen: number;
  filedThisWeek: number;
  unassignedOpen: number;
  goneQuiet: number;
  avgCloseMs: number | null;
  volume: VolumeBucket[];
  categories: NamedCount[];
  priorities: PriorityCount[];
};

function countByCategory(tickets: RankedTicketListItem[]): NamedCount[] {
  const counts = new Map<string, number>();
  for (const ticket of tickets) {
    counts.set(ticket.category, (counts.get(ticket.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function countByPriority(tickets: RankedTicketListItem[]): PriorityCount[] {
  const counts: Record<PriorityLabel, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  for (const ticket of tickets) {
    counts[ticket.ranking.label] += 1;
  }
  return PRIORITY_ORDER.map((label) => ({
    label,
    count: counts[label],
  }));
}

function averageCloseMs(tickets: RankedTicketListItem[]): number | null {
  const durations = tickets
    .filter((ticket) => ticket.closed_at)
    .map(
      (ticket) =>
        new Date(ticket.closed_at!).getTime() -
        new Date(ticket.created_at).getTime(),
    )
    .filter((ms) => ms >= 0);
  if (durations.length === 0) return null;
  return durations.reduce((sum, ms) => sum + ms, 0) / durations.length;
}

function volumeBuckets(
  range: DateRange,
  tickets: RankedTicketListItem[],
): VolumeBucket[] {
  return eachUtcWeekStart(range).map((weekStart) => {
    const key = utcDateKey(weekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
    const start =
      weekStart.getTime() < range.start.getTime() ? range.start : weekStart;
    const end = weekEnd.getTime() > range.end.getTime() ? range.end : weekEnd;
    return {
      key,
      label: `w/c ${formatVolumeWeekLabel(key)}`,
      count: tickets.filter((ticket) =>
        isInRange(ticket.created_at, { start, end }),
      ).length,
    };
  });
}

function isRecent(ticket: RankedTicketListItem, now: number): boolean {
  return now - new Date(ticket.created_at).getTime() <= WEEK_MS;
}

function isLingering(ticket: RankedTicketListItem, now: number): boolean {
  return !isRecent(ticket, now);
}

function byRankingThenRecent(a: RankedTicketListItem, b: RankedTicketListItem) {
  const rank = b.ranking.score - a.ranking.score;
  if (rank !== 0) return rank;
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

function mergeUnique(
  ...groups: RankedTicketListItem[][]
): RankedTicketListItem[] {
  const seen = new Set<string>();
  const merged: RankedTicketListItem[] = [];
  for (const group of groups) {
    for (const ticket of group) {
      if (seen.has(ticket.id)) continue;
      seen.add(ticket.id);
      merged.push(ticket);
    }
  }
  return merged;
}

export function buildSiteReportStats(
  tickets: RankedTicketListItem[],
  now: Date = new Date(),
): SiteReportStats {
  const nowMs = now.getTime();
  const live = tickets.filter(isLiveTicket);
  const volumeRange = recentWeeksRange(VOLUME_WEEKS, now);

  return {
    generatedAtIso: now.toISOString(),
    open: live.length,
    hazardReports: live.filter((ticket) => isHazardCategory(ticket.category))
      .length,
    longOpen: live.filter((ticket) => !isRecent(ticket, nowMs)).length,
    filedThisWeek: tickets.filter((ticket) => isRecent(ticket, nowMs)).length,
    unassignedOpen: live.filter((ticket) => ticket.assigned_to === null).length,
    goneQuiet: live.filter((ticket) =>
      ["dormant", "stalled"].includes(idleLevel(ticket.ranking.daysIdle)),
    ).length,
    avgCloseMs: averageCloseMs(tickets),
    volume: volumeBuckets(volumeRange, tickets),
    categories: countByCategory(live),
    priorities: countByPriority(live),
  };
}

/**
 * Live reports only. Mixes current filings with work that has sat open.
 */
export function attentionTickets(
  tickets: RankedTicketListItem[],
  now: Date = new Date(),
): RankedTicketListItem[] {
  const nowMs = now.getTime();
  const live = tickets.filter(isLiveTicket);
  const recent = live
    .filter((ticket) => isRecent(ticket, nowMs))
    .sort(byRankingThenRecent)
    .slice(0, 4);
  const lingering = live
    .filter((ticket) => isLingering(ticket, nowMs))
    .sort(byRankingThenRecent)
    .slice(0, 4);

  return mergeUnique(recent, lingering).slice(0, ATTENTION_LIMIT);
}

export function anonymizedReportTickets(
  tickets: RankedTicketListItem[],
  now: Date = new Date(),
): ReportTicketLine[] {
  const nowMs = now.getTime();
  const live = tickets.filter(isLiveTicket);
  const recent = live
    .filter((ticket) => isRecent(ticket, nowMs))
    .sort(byRankingThenRecent);
  const lingering = live
    .filter((ticket) => isLingering(ticket, nowMs))
    .sort(byRankingThenRecent);

  return mergeUnique(recent, lingering)
    .slice(0, REPORT_TICKET_LIMIT)
    .map((ticket) => ({
      ref: shortId(ticket.id),
      category: ticket.category,
      status: ticket.status,
      ranking: ticket.ranking.label,
      daysOpen: ticket.ranking.daysOpen,
      daysIdle: ticket.ranking.daysIdle,
      focus: isRecent(ticket, nowMs) ? "recent" : "lingering",
      description: ticket.description.slice(0, DESCRIPTION_LIMIT),
    }));
}
