import type { TicketStatus } from "@/lib/supabase/types";

/** Ticket lifecycle — only humans change status (see product spec). */
export const TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
  "Resolved",
  "Closed",
];

export function isTicketStatus(value: string): value is TicketStatus {
  return TICKET_STATUSES.includes(value as TicketStatus);
}

export function statusBadgeClass(status: TicketStatus): string {
  switch (status) {
    case "Submitted":
      return "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200";
    case "In Review":
      return "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200";
    case "In Progress":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";
    case "Resolved":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";
    case "Closed":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}
