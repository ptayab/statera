import type { TicketStatus } from "@/lib/supabase/types";

/** Ticket lifecycle — only humans change status (see product spec). */
export const TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
  "Resolved",
  "Closed",
];

/** Statuses that still need supervisor attention. */
export const OPEN_TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
];

export function isTicketStatus(value: string): value is TicketStatus {
  return TICKET_STATUSES.includes(value as TicketStatus);
}

export function isOpenTicketStatus(status: TicketStatus): boolean {
  return OPEN_TICKET_STATUSES.includes(status);
}
