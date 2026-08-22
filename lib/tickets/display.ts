import type {
  TicketEvent,
  TicketStatus,
  TicketUrgency,
  UserRole,
} from "@/lib/supabase/types";

type EventPayload = Record<string, unknown>;

export type ChatEventKind = "system" | "message";

export type FormattedTicketEvent = {
  kind: ChatEventKind;
  title: string;
  detail?: string;
  body?: string;
};

const MESSAGE_EVENT_TYPES = new Set(["message", "note_added"]);

export function isMessageEvent(eventType: string): boolean {
  return MESSAGE_EVENT_TYPES.has(eventType);
}

export function formatTicketEvent(
  event: TicketEvent & { actor_name?: string | null },
): FormattedTicketEvent {
  const payload = (event.payload ?? {}) as EventPayload;

  if (isMessageEvent(event.event_type)) {
    const body =
      (payload.text ? String(payload.text) : null) ??
      (payload.note ? String(payload.note) : null) ??
      "";
    return {
      kind: "message",
      title: "Message",
      body,
    };
  }

  switch (event.event_type) {
    case "created":
      return {
        kind: "system",
        title: "Report submitted",
        detail: payload.category
          ? `Category: ${String(payload.category)}`
          : undefined,
      };
    case "status_changed":
      return {
        kind: "system",
        title: "Status updated",
        detail: `${String(payload.from_status ?? "?")} → ${String(payload.to_status ?? "?")}`,
      };
    case "assigned":
      return {
        kind: "system",
        title: "Assigned",
        detail: payload.assignee_name
          ? `Assigned to ${String(payload.assignee_name)}`
          : "Ticket assigned",
      };
    case "unassigned":
      return {
        kind: "system",
        title: "Unassigned",
        detail: "Returned to Submitted for another supervisor to claim",
      };
    default:
      return {
        kind: "system",
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
  urgency: TicketUrgency;
  created_at: string;
  closed_at: string | null;
  reporter_name: string;
  assignee_name: string | null;
};

export type TicketDetailEvent = TicketEvent & {
  actor_name: string | null;
  actor_role: UserRole | null;
  formatted: FormattedTicketEvent;
};

export type TicketDetail = TicketListItem & {
  created_by: string;
  assigned_to: string | null;
  photo_url: string | null;
  photo_signed_url: string | null;
  events: TicketDetailEvent[];
};
