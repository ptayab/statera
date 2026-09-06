import type {
  TicketEvent,
  TicketStatus,
  TicketUrgency,
  UserRole,
} from "@/lib/supabase/types";
import type { TicketAiAnalysis } from "@/lib/tickets/ai-analysis";
import type { RankingFeedbackRecord } from "@/lib/tickets/ranking-feedback";
import type { TicketScore } from "@/lib/tickets/scoring";

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

/** Unseen ticket activity shown in the nav bell. */
export type TicketNotification = {
  ticketId: string;
  href: string;
  /** Ticket category (full label). */
  title: string;
  /** What happened — e.g. "Status updated", "Message". */
  eventLabel: string;
  /** Detail or message body for the latest unseen event. */
  preview: string;
  status: TicketStatus;
  urgency: TicketUrgency;
  /** Who triggered the latest event, when known. */
  actorName: string | null;
  at: string;
};

export type TicketListItem = {
  id: string;
  category: string;
  description: string;
  status: TicketStatus;
  urgency: TicketUrgency;
  created_at: string;
  closed_at: string | null;
  reporter_name: string;
  assigned_to: string | null;
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
  /** Timestamp of the most recent event, used for the idle/dormancy signal. */
  last_event_at: string | null;
  /** Open reports Claude grouped as the same incident, including this one. */
  duplicate_count: number;
  ai_analysis: TicketAiAnalysis | null;
  ranking: TicketScore;
  ranking_feedback: RankingFeedbackRecord | null;
};
