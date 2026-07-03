/** Pilot-only categories — see docs/02_product_spec.md */
export const PILOT_TICKET_CATEGORIES = [
  "Unsafe Condition / Near-Miss",
  "Equipment Issue",
  "Dangerous Occurrence",
] as const;

export type PilotTicketCategory = (typeof PILOT_TICKET_CATEGORIES)[number];

export const DANGEROUS_OCCURRENCE_CATEGORY: PilotTicketCategory =
  "Dangerous Occurrence";

export function isPilotTicketCategory(
  value: string,
): value is PilotTicketCategory {
  return PILOT_TICKET_CATEGORIES.includes(value as PilotTicketCategory);
}
