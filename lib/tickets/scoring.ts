import type { TicketUrgency } from "@/lib/supabase/types";
import type { PilotTicketCategory } from "@/lib/tickets/categories";

export type PriorityLabel = "Critical" | "High" | "Medium" | "Low";

export type ScoreFactors = {
  categoryPts: number;
  agePts: number;
  dormancyPts: number;
  descriptionPts: number;
  urgencyMultiplier: number;
  duplicateMultiplier: number;
};

export type TicketScore = {
  score: number;
  label: PriorityLabel;
  factors: ScoreFactors;
  daysIdle: number;
};

export type ScoreableTicket = {
  category: string;
  description: string;
  urgency: TicketUrgency;
  created_at: string;
};

const CATEGORY_POINTS: Record<PilotTicketCategory, number> = {
  "Dangerous Occurrence": 50,
  "Unsafe Condition / Near-Miss": 30,
  "Equipment Issue": 15,
};

const URGENCY_MULTIPLIER: Record<TicketUrgency, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const URGENT_KEYWORDS = [
  "injur",
  "bleed",
  "hospitaliz",
  "immedi",
  "critical",
  "emergency",
  "collapse",
  "fire",
  "electr",
  "fatal",
];

const WARNING_KEYWORDS = [
  "danger",
  "broken",
  "fail",
  "leak",
  "block",
  "stuck",
  "severe",
  "risk",
];

const MODERATE_KEYWORDS = [
  "concern",
  "unsafe",
  "wrong",
  "issue",
  "problem",
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(fromIso: string, to: Date = new Date()): number {
  const from = new Date(fromIso).getTime();
  if (Number.isNaN(from)) return 0;
  return Math.max(0, (to.getTime() - from) / MS_PER_DAY);
}

function categoryPoints(category: string): number {
  return CATEGORY_POINTS[category as PilotTicketCategory] ?? 15;
}

function descriptionPoints(description: string): number {
  const text = description.toLowerCase();
  if (URGENT_KEYWORDS.some((kw) => text.includes(kw))) return 20;
  if (WARNING_KEYWORDS.some((kw) => text.includes(kw))) return 10;
  if (MODERATE_KEYWORDS.some((kw) => text.includes(kw))) return 5;
  return 0;
}

function dormancyPoints(daysIdle: number): number {
  if (daysIdle > 14) return 30;
  if (daysIdle > 7) return 15;
  if (daysIdle > 3) return 5;
  return 0;
}

function duplicateMultiplier(
  duplicateCount: number,
  categoryPts: number,
): number {
  if (duplicateCount < 2) return 1;
  const isHighCategory = categoryPts >= 30;
  if (duplicateCount >= 4) {
    return isHighCategory ? 2.0 : 1.2;
  }
  // 2–3 similar reports
  return isHighCategory ? 1.5 : 1.1;
}

export function priorityLabelFromScore(score: number): PriorityLabel {
  if (score >= 150) return "Critical";
  if (score >= 80) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

/** Upper bound used to draw the score meter — scores above this simply peg. */
export const SCORE_METER_MAX = 200;

export const PRIORITY_THRESHOLDS: { label: PriorityLabel; min: number }[] = [
  { label: "Critical", min: 150 },
  { label: "High", min: 80 },
  { label: "Medium", min: 40 },
  { label: "Low", min: 0 },
];

export function scoreTicket(
  ticket: ScoreableTicket,
  lastEventAt: string | null,
  duplicateCount: number,
  now: Date = new Date(),
): TicketScore {
  const categoryPts = categoryPoints(ticket.category);
  const daysOpen = daysBetween(ticket.created_at, now);
  const agePts = Math.min(daysOpen * 2, 40);
  const daysIdle = daysBetween(lastEventAt ?? ticket.created_at, now);
  const dormancyPts = dormancyPoints(daysIdle);
  const descriptionPts = descriptionPoints(ticket.description);
  const urgencyMultiplier = URGENCY_MULTIPLIER[ticket.urgency] ?? 2;
  const dupeMult = duplicateMultiplier(duplicateCount, categoryPts);

  const base =
    categoryPts + agePts + dormancyPts + descriptionPts;
  const score = Math.round(base * urgencyMultiplier * dupeMult);

  return {
    score,
    label: priorityLabelFromScore(score),
    factors: {
      categoryPts,
      agePts: Math.round(agePts * 10) / 10,
      dormancyPts,
      descriptionPts,
      urgencyMultiplier,
      duplicateMultiplier: dupeMult,
    },
    daysIdle: Math.round(daysIdle * 10) / 10,
  };
}

export const TICKET_URGENCIES: TicketUrgency[] = ["Low", "Medium", "High"];

export function isTicketUrgency(value: string): value is TicketUrgency {
  return TICKET_URGENCIES.includes(value as TicketUrgency);
}
