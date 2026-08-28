import type { TicketStatus } from "@/lib/supabase/types";

/** Ticket lifecycle — only humans change status (see product spec). */
export const TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
  "Resolved",
  "Closed",
];

/** Statuses a supervisor can set. Closed is reserved for the worker. */
export const SUPERVISOR_STATUS_OPTIONS = [
  "In Review",
  "In Progress",
  "Resolved",
] as const satisfies readonly TicketStatus[];

export type SupervisorStatus = (typeof SUPERVISOR_STATUS_OPTIONS)[number];

export const SUPERVISOR_STATUS_GUIDANCE: Record<SupervisorStatus, string> = {
  "In Review":
    "This issue is still being assessed by the supervisor.",
  "In Progress":
    "A solution has been implemented, but it will take time to finish.",
  Resolved:
    "The issue is finished. To close the loop, the worker will close the ticket themselves.",
};

export const PIPELINE_STATUS_GUIDANCE: Partial<Record<TicketStatus, string>> = {
  Submitted: "Waiting for a supervisor to claim this report.",
  ...SUPERVISOR_STATUS_GUIDANCE,
};

export const SUPERVISOR_HANDLING_REMINDERS = [
  "Write back to the worker in the conversation so they know what is happening.",
  "Thank the worker for reporting the issue.",
  "Keep a no-blame policy to encourage reporting — people speak up when they know they will not be punished.",
];

/** Statuses that are not yet closed — Resolved stays assigned until the worker closes. */
export const OPEN_TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
  "Resolved",
];

export function isTicketStatus(value: string): value is TicketStatus {
  return TICKET_STATUSES.includes(value as TicketStatus);
}

export function isOpenTicketStatus(status: TicketStatus): boolean {
  return OPEN_TICKET_STATUSES.includes(status);
}
