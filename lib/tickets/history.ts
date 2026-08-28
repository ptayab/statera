import type { TicketUrgency } from "@/lib/supabase/types";
import { scoreTicket, type PriorityLabel } from "@/lib/tickets/scoring";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type RankingPeriod = {
  label: PriorityLabel;
  score: number;
  from: string;
  to: string;
};

export type DormancyPeriod = {
  from: string;
  to: string;
  days: number;
};

export type ClosedIssueHistory = {
  openedAt: string;
  closedAt: string;
  rankings: RankingPeriod[];
  dormancy: DormancyPeriod[];
};

type HistoryTicket = {
  category: string;
  description: string;
  urgency: TicketUrgency;
  created_at: string;
  closed_at: string | null;
};

function validTime(iso: string): number | null {
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function lastActivityAt(activity: number[], asOf: number, openedAt: number): number {
  let last = openedAt;
  for (const time of activity) {
    if (time <= asOf) last = time;
    else break;
  }
  return last;
}

/**
 * Rebuild how AI ranking and idle time moved while the issue was open.
 * Rankings are sampled at open, close, each update, and daily in between so
 * age-driven climbs are visible without storing a snapshot on every view.
 */
export function buildClosedIssueHistory(
  ticket: HistoryTicket,
  events: { created_at: string }[],
  duplicateCount: number,
  descriptionPts?: number | null,
  feedbackAdjustment?: number | null,
): ClosedIssueHistory | null {
  const openedAt = validTime(ticket.created_at);
  const closedAt =
    (ticket.closed_at ? validTime(ticket.closed_at) : null) ??
    (events.length ? validTime(events[events.length - 1].created_at) : null);

  if (openedAt == null || closedAt == null || closedAt < openedAt) {
    return null;
  }

  const activity = [
    ...new Set(
      events
        .map((event) => validTime(event.created_at))
        .filter((time): time is number => time != null && time >= openedAt && time <= closedAt),
    ),
  ].sort((a, b) => a - b);

  const dormancy: DormancyPeriod[] = [];
  const idleAnchors = [openedAt, ...activity, closedAt];
  for (let i = 1; i < idleAnchors.length; i += 1) {
    const from = idleAnchors[i - 1];
    const to = idleAnchors[i];
    const days = (to - from) / MS_PER_DAY;
    if (days > 3) {
      dormancy.push({
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
        days: Math.round(days * 10) / 10,
      });
    }
  }

  const samples = new Set<number>([openedAt, closedAt]);
  for (const time of activity) {
    if (time > openedAt) samples.add(time - 1);
    samples.add(time);
  }
  for (let time = openedAt + MS_PER_DAY; time < closedAt; time += MS_PER_DAY) {
    samples.add(time);
  }

  const scoreable = {
    category: ticket.category,
    description: ticket.description,
    urgency: ticket.urgency,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
  };
  const options = { descriptionPts, feedbackAdjustment };

  const rankings: RankingPeriod[] = [];
  for (const asOf of [...samples].sort((a, b) => a - b)) {
    const lastEventMs = lastActivityAt(activity, asOf, openedAt);
    const score = scoreTicket(
      scoreable,
      new Date(lastEventMs).toISOString(),
      duplicateCount,
      new Date(asOf),
      options,
    );
    const iso = new Date(asOf).toISOString();
    const current = rankings[rankings.length - 1];
    if (!current || current.label !== score.label) {
      if (current) current.to = iso;
      rankings.push({
        label: score.label,
        score: score.score,
        from: iso,
        to: iso,
      });
    } else {
      current.to = iso;
      current.score = score.score;
    }
  }

  if (rankings.length > 0) {
    rankings[rankings.length - 1].to = new Date(closedAt).toISOString();
  }

  return {
    openedAt: new Date(openedAt).toISOString(),
    closedAt: new Date(closedAt).toISOString(),
    rankings,
    dormancy,
  };
}
