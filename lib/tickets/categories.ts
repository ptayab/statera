/** Pilot ticket categories — labels, ranking weight, and worker-facing copy. */

export const PILOT_TICKET_CATEGORIES = [
  "Unsafe Condition",
  "Near-Miss Report",
  "PPE Request",
  "Training Request",
  "Procedure Clarification",
  "Equipment Issue",
  "Fatigue / Wellness Concern",
  "HR / Supervisor Escalation",
  "Dangerous Occurrence",
] as const;

export type PilotTicketCategory = (typeof PILOT_TICKET_CATEGORIES)[number];

export const DANGEROUS_OCCURRENCE_CATEGORY: PilotTicketCategory =
  "Dangerous Occurrence";

export type CategoryWarning = {
  title: string;
  body: string;
  submittedTitle: string;
  submittedBody: string;
};

export type TicketCategoryMeta = {
  name: PilotTicketCategory;
  short: string;
  description: string;
  rankingPts: number;
  warning?: CategoryWarning;
  /** Repeat the warning after a successful submit. */
  warnOnSubmit?: boolean;
  /** Show the same alert on the supervisor ticket view. */
  warnSupervisor?: boolean;
};

const OFFICIAL_CHANNELS: CategoryWarning = {
  title: "Dangerous occurrence selected",
  body: "If anyone is hurt, at risk, or in immediate danger, follow your site's official emergency and regulatory reporting process right now. Do not wait for this app — Statera is an additional record, not a replacement for required site procedures.",
  submittedTitle: "Important — also report through official channels",
  submittedBody:
    "If anyone is hurt, at risk, or in immediate danger, follow your site's official emergency and regulatory reporting process right now. Do not wait for this app — Statera is an additional record, not a replacement for required site procedures.",
};

export const TICKET_CATEGORY_META: Record<
  PilotTicketCategory,
  TicketCategoryMeta
> = {
  "Unsafe Condition": {
    name: "Unsafe Condition",
    short: "Unsafe",
    rankingPts: 40,
    description:
      "Report a hazardous condition or situation that could cause an accident if left uncorrected (e.g., exposed wiring, unstable ground, missing guardrails, or poor lighting).",
    warning: {
      title: "Uncorrected hazard",
      body: "This is a condition that could cause an accident if nobody acts. If people are in immediate danger, follow your site's emergency process now — this app does not replace it.",
      submittedTitle: "If anyone is still at risk",
      submittedBody:
        "Your supervisor has been notified. If the hazard is still live, keep people away and follow your site’s emergency process until it is made safe.",
    },
    warnOnSubmit: true,
    warnSupervisor: true,
  },
  "Near-Miss Report": {
    name: "Near-Miss Report",
    short: "Near-miss",
    rankingPts: 35,
    description:
      "Report an incident where an accident almost occurred but no injury or damage resulted. Helps prevent future incidents.",
    warning: {
      title: "Near-miss — still report it",
      body: "Nobody was hurt this time, but the next time might be different. If anyone was injured or is still in danger, use official emergency channels immediately instead of waiting on this form.",
      submittedTitle: "If the situation is still unsafe",
      submittedBody:
        "Your report is in. If anyone was hurt or remains at risk, follow official emergency and medical procedures now.",
    },
    warnOnSubmit: true,
    warnSupervisor: true,
  },
  "PPE Request": {
    name: "PPE Request",
    short: "PPE",
    rankingPts: 18,
    description:
      "Request new, replacement, or additional personal protective equipment such as helmets, gloves, safety glasses, respirators, or high-visibility clothing.",
  },
  "Training Request": {
    name: "Training Request",
    short: "Training",
    rankingPts: 12,
    description:
      "Request training, certification, refresher courses, or additional guidance to safely perform work.",
  },
  "Procedure Clarification": {
    name: "Procedure Clarification",
    short: "Procedure",
    rankingPts: 8,
    description:
      "Ask questions about work procedures, safety instructions, permits, or standard operating procedures when requirements are unclear.",
  },
  "Equipment Issue": {
    name: "Equipment Issue",
    short: "Equipment",
    rankingPts: 25,
    description:
      "Report damaged, malfunctioning, or poorly performing equipment, tools, or vehicles.",
  },
  "Fatigue / Wellness Concern": {
    name: "Fatigue / Wellness Concern",
    short: "Fatigue",
    rankingPts: 30,
    description:
      "Report fatigue, stress, illness, mental well-being concerns, or fitness-for-duty issues that may affect safe work.",
    warning: {
      title: "Fitness for duty",
      body: "If you or a colleague cannot work safely right now, stop work and tell a supervisor in person. This report is a record — it does not take you off the job.",
      submittedTitle: "If you cannot work safely",
      submittedBody:
        "Your supervisor has been notified. Do not start or continue work if you are unfit — tell someone on site now.",
    },
    warnOnSubmit: true,
    warnSupervisor: true,
  },
  "HR / Supervisor Escalation": {
    name: "HR / Supervisor Escalation",
    short: "HR",
    rankingPts: 16,
    description:
      "Report workplace concerns requiring management attention, such as scheduling issues, policy concerns, or confidential matters.",
    warning: {
      title: "Supervisors will see this",
      body: "This goes to site supervisors. Use it for scheduling, policy, or other workplace concerns that need management attention. If you are in immediate danger, follow emergency procedures first.",
      submittedTitle: "Your supervisor has this report",
      submittedBody:
        "Site supervisors can read this ticket. If this is an emergency or you are not safe, follow official site procedures now.",
    },
    warnOnSubmit: true,
  },
  "Dangerous Occurrence": {
    name: "Dangerous Occurrence",
    short: "Dangerous occurrence",
    rankingPts: 50,
    description:
      "Report a serious incident that may need official or regulatory notification, such as a collapse, fire, electrical shock, or other dangerous occurrence.",
    warning: OFFICIAL_CHANNELS,
    warnOnSubmit: true,
    warnSupervisor: true,
  },
};

/** Combined label used before Unsafe Condition and Near-Miss were split. */
const LEGACY_RANKING_POINTS: Record<string, number> = {
  "Unsafe Condition / Near-Miss": 35,
};

export function isPilotTicketCategory(
  value: string,
): value is PilotTicketCategory {
  return PILOT_TICKET_CATEGORIES.includes(value as PilotTicketCategory);
}

export function getCategoryMeta(
  category: string,
): TicketCategoryMeta | undefined {
  if (!isPilotTicketCategory(category)) return undefined;
  return TICKET_CATEGORY_META[category];
}

export function categoryRankingPoints(category: string): number {
  if (isPilotTicketCategory(category)) {
    return TICKET_CATEGORY_META[category].rankingPts;
  }
  return LEGACY_RANKING_POINTS[category] ?? 15;
}
