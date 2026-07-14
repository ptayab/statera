import type { TicketEvent, TicketStatus } from "@/lib/supabase/types";

type EventPayload = Record<string, unknown>;

export function formatTicketEvent(event: TicketEvent & { actor_name?: string | null }) {
  const actor = event.actor_name ?? "Unknown user";
  const payload = (event.payload ?? {}) as EventPayload;

  switch (event.event_type) {
    case "created":
      return {
        title: "Report submitted",
        detail: payload.category
          ? `Category: ${String(payload.category)}`
          : undefined,
      };
    case "status_changed":
      return {
        title: "Status changed",
        detail: `${String(payload.from_status ?? "?")} → ${String(payload.to_status ?? "?")}`,
      };
    case "assigned":
      return {
        title: "Assigned",
        detail: payload.assignee_name
          ? `Assigned to ${String(payload.assignee_name)}`
          : "Ticket assigned",
      };
    case "note_added":
      return {
        title: "Note added",
        detail: payload.note ? String(payload.note) : undefined,
      };
    default:
      return {
        title: event.event_type.replaceAll("_", " "),
        detail: undefined,
      };
  }
}

export type TicketListItem = {
  id: string;
  category: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  closed_at: string | null;
  reporter_name: string;
};

export type TicketDetail = TicketListItem & {
  photo_url: string | null;
  photo_signed_url: string | null;
  events: Array<
    TicketEvent & {
      actor_name: string | null;
      formatted: ReturnType<typeof formatTicketEvent>;
    }
  >;
};
