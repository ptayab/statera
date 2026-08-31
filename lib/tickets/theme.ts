import type { TicketStatus } from "@/lib/supabase/types";
import type { PilotTicketCategory } from "@/lib/tickets/categories";
import type { PriorityLabel } from "@/lib/tickets/scoring";

/**
 * Single source of truth for issue colour. Roles are kept separate so a row
 * never turns into a rainbow:
 *   - priority owns saturated colour (red → orange → amber → green)
 *   - closed and resolved issues drop the priority rail to grey — the work is done
 *   - status is a neutral chip with a coloured dot
 *   - category is quiet text, except Dangerous Occurrence which is regulatory
 *   - idle/dormancy has its own warm escalation
 * Class strings are written out in full so Tailwind can see them.
 */

export type PriorityVisual = {
  /** Full-height bar on the leading edge of a card. */
  rail: string;
  dot: string;
  text: string;
  chip: string;
  /** Solid fill for meters and progress bars. */
  fill: string;
  /** Tinted backdrop for the detail panel. */
  wash: string;
};

const PRIORITY_VISUALS: Record<PriorityLabel, PriorityVisual> = {
  Critical: {
    rail: "bg-rose-600",
    dot: "bg-rose-600",
    text: "text-rose-700 dark:text-rose-300",
    chip: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-300 dark:ring-rose-400/25",
    fill: "bg-rose-600",
    wash: "bg-rose-50/70 dark:bg-rose-500/[0.07]",
  },
  High: {
    rail: "bg-orange-500",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/12 dark:text-orange-300 dark:ring-orange-400/25",
    fill: "bg-orange-500",
    wash: "bg-orange-50/70 dark:bg-orange-500/[0.07]",
  },
  Medium: {
    rail: "bg-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/12 dark:text-amber-300 dark:ring-amber-400/25",
    fill: "bg-amber-400",
    wash: "bg-amber-50/70 dark:bg-amber-400/[0.07]",
  },
  Low: {
    rail: "bg-emerald-500",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:ring-emerald-400/25",
    fill: "bg-emerald-500",
    wash: "bg-emerald-50/70 dark:bg-emerald-500/[0.07]",
  },
};

export function priorityVisual(label: PriorityLabel): PriorityVisual {
  return PRIORITY_VISUALS[label] ?? PRIORITY_VISUALS.Low;
}

/** Neutral leading-edge bar used when an issue is no longer live. */
export const CLOSED_RAIL = "bg-zinc-400";

const UNRANKED_RAIL = "bg-zinc-200 dark:bg-zinc-700";

/** Leading-edge bar for a list row: priority colour, unless the work is done. */
export function issueRail(
  status: TicketStatus,
  label: PriorityLabel | null | undefined,
): string {
  if (status === "Closed" || status === "Resolved") {
    return CLOSED_RAIL;
  }
  return label ? priorityVisual(label).rail : UNRANKED_RAIL;
}

export const PRIORITY_ORDER: PriorityLabel[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

export type StatusVisual = {
  dot: string;
  /** Solid fill for the pipeline bar on the dashboard. */
  fill: string;
};

const STATUS_VISUALS: Record<TicketStatus, StatusVisual> = {
  Submitted: { dot: "bg-sky-500", fill: "bg-sky-500" },
  "In Review": { dot: "bg-violet-500", fill: "bg-violet-500" },
  "In Progress": { dot: "bg-amber-500", fill: "bg-amber-500" },
  Resolved: { dot: "bg-emerald-500", fill: "bg-emerald-500" },
  Closed: { dot: "bg-zinc-400", fill: "bg-zinc-400" },
};

export const STATUS_CHIP_CLASS =
  "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-white/[0.07] dark:text-zinc-300 dark:ring-white/10";

export function statusVisual(status: TicketStatus): StatusVisual {
  return STATUS_VISUALS[status] ?? STATUS_VISUALS.Closed;
}

/**
 * Cool sky palette for the reporter's ranking, kept distinct from the AI
 * ranking's traffic-light colours.
 */
export const USER_RANKING_CHIP_CLASS =
  "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/12 dark:text-sky-300 dark:ring-sky-400/25";

export type CategoryVisual = {
  /** Trimmed label — the full name is too long for a dense row. */
  short: string;
  text: string;
};

const CATEGORY_VISUALS: Record<PilotTicketCategory, CategoryVisual> = {
  "Dangerous Occurrence": {
    short: "Dangerous occurrence",
    text: "text-rose-600 dark:text-rose-400",
  },
  "Unsafe Condition": {
    short: "Unsafe",
    text: "text-rose-600 dark:text-rose-400",
  },
  "Near-Miss Report": {
    short: "Near-miss",
    text: "text-orange-700 dark:text-orange-400",
  },
  "Fatigue / Wellness Concern": {
    short: "Fatigue",
    text: "text-orange-700 dark:text-orange-400",
  },
  "Equipment Issue": {
    short: "Equipment",
    text: "text-zinc-500 dark:text-zinc-400",
  },
  "PPE Request": {
    short: "PPE",
    text: "text-zinc-500 dark:text-zinc-400",
  },
  "HR / Supervisor Escalation": {
    short: "HR",
    text: "text-zinc-500 dark:text-zinc-400",
  },
  "Training Request": {
    short: "Training",
    text: "text-zinc-500 dark:text-zinc-400",
  },
  "Procedure Clarification": {
    short: "Procedure",
    text: "text-zinc-500 dark:text-zinc-400",
  },
};

export function categoryVisual(category: string): CategoryVisual {
  if (category === "Unsafe Condition / Near-Miss") {
    return {
      short: "Near-miss",
      text: "text-orange-700 dark:text-orange-400",
    };
  }
  return (
    CATEGORY_VISUALS[category as PilotTicketCategory] ?? {
      short: category,
      text: "text-zinc-500 dark:text-zinc-400",
    }
  );
}

/** Mirrors the dormancy tiers used by the scoring model. */
export type IdleLevel = "active" | "quiet" | "dormant" | "stalled";

export type IdleVisual = {
  level: IdleLevel;
  label: string;
  dot: string;
  chip: string;
  text: string;
};

const IDLE_VISUALS: Record<IdleLevel, Omit<IdleVisual, "level">> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:ring-emerald-400/25",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  quiet: {
    label: "Quiet",
    dot: "bg-amber-400",
    chip: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/12 dark:text-amber-300 dark:ring-amber-400/25",
    text: "text-amber-700 dark:text-amber-300",
  },
  dormant: {
    label: "Dormant",
    dot: "bg-orange-500",
    chip: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/12 dark:text-orange-300 dark:ring-orange-400/25",
    text: "text-orange-700 dark:text-orange-300",
  },
  stalled: {
    label: "Idle",
    dot: "bg-rose-600",
    chip: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-300 dark:ring-rose-400/25",
    text: "text-rose-700 dark:text-rose-300",
  },
};

export function idleLevel(daysIdle: number): IdleLevel {
  if (daysIdle > 14) return "stalled";
  if (daysIdle > 7) return "dormant";
  if (daysIdle > 3) return "quiet";
  return "active";
}

export function idleVisual(daysIdle: number): IdleVisual {
  const level = idleLevel(daysIdle);
  return { level, ...IDLE_VISUALS[level] };
}

/** Neutral outlined chip used for secondary signals such as duplicate counts. */
export const NEUTRAL_CHIP_CLASS =
  "bg-panel text-zinc-600 ring-hairline-strong dark:text-zinc-300";
