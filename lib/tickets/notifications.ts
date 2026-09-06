import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type {
  TicketEvent,
  TicketStatus,
  TicketUrgency,
} from "@/lib/supabase/types";
import type { UserProfile } from "@/lib/auth/session";
import {
  formatTicketEvent,
  type TicketNotification,
} from "@/lib/tickets/display";
import { isTicketStatus } from "@/lib/tickets/status";

const MAX_NOTIFICATIONS = 20;

type FollowedTicket = {
  id: string;
  category: string;
  status: TicketStatus;
  urgency: TicketUrgency;
};

function truncate(text: string, max: number): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, Math.max(0, max - 1))}…`;
}

function toUrgency(value: string | null | undefined): TicketUrgency {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }
  return "Medium";
}

function toStatus(value: string | null | undefined): TicketStatus {
  if (value && isTicketStatus(value)) return value;
  return "Submitted";
}

function labelForEvent(event: TicketEvent): string {
  return formatTicketEvent(event).title;
}

function previewForEvent(event: TicketEvent): string {
  const formatted = formatTicketEvent(event);
  if (formatted.kind === "message") {
    const body = formatted.body?.trim();
    return body ? truncate(body, 100) : "New message";
  }
  return formatted.detail ?? formatted.title;
}

function hrefForTicket(role: UserProfile["role"], ticketId: string): string {
  return role === "worker"
    ? `/worker/tickets/${ticketId}`
    : `/supervisor/${ticketId}`;
}

function mapFollowedRows(
  rows: {
    id: string;
    category: string;
    status: string;
    urgency: string | null;
  }[],
): FollowedTicket[] {
  return rows.map((row) => ({
    id: row.id,
    category: row.category,
    status: toStatus(row.status),
    urgency: toUrgency(row.urgency),
  }));
}

async function followedTickets(
  profile: UserProfile,
): Promise<FollowedTicket[]> {
  const supabase = await createServerClient();
  const select = "id, category, status, urgency";

  if (profile.role === "worker") {
    const { data, error } = await supabase
      .from("tickets")
      .select(select)
      .eq("created_by", profile.id);

    if (error) return [];
    return mapFollowedRows(data ?? []);
  }

  const { data, error } = await supabase
    .from("tickets")
    .select(select)
    .eq("site_id", profile.site_id)
    .eq("assigned_to", profile.id);

  if (error) return [];
  return mapFollowedRows(data ?? []);
}

function latestEventByTicket(
  events: TicketEvent[],
): Map<string, TicketEvent> {
  const latest = new Map<string, TicketEvent>();
  for (const event of events) {
    if (!latest.has(event.ticket_id)) {
      latest.set(event.ticket_id, event);
    }
  }
  return latest;
}

async function resolveActorNames(
  actorIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(actorIds.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", uniqueIds);

  return new Map(
    (data ?? []).map((user) => [user.id, user.name ?? user.email]),
  );
}

/**
 * Activity on tickets this person follows that they have not opened since.
 * Workers follow tickets they filed. Supervisors follow only tickets
 * assigned to them.
 */
export async function getUnreadTicketNotifications(
  profile: UserProfile,
): Promise<TicketNotification[]> {
  const tickets = await followedTickets(profile);
  if (tickets.length === 0) return [];

  const supabase = await createServerClient();
  const ticketIds = tickets.map((ticket) => ticket.id);
  const ticketById = new Map(tickets.map((ticket) => [ticket.id, ticket]));

  const [eventsResult, readsResult] = await Promise.all([
    supabase
      .from("ticket_events")
      .select("id, ticket_id, event_type, actor, payload, created_at")
      .in("ticket_id", ticketIds)
      .order("created_at", { ascending: false }),
    supabase
      .from("ticket_reads")
      .select("ticket_id, last_seen_at")
      .eq("user_id", profile.id)
      .in("ticket_id", ticketIds),
  ]);

  if (eventsResult.error || readsResult.error) {
    return [];
  }

  const lastSeen = new Map(
    (readsResult.data ?? []).map((row) => [row.ticket_id, row.last_seen_at]),
  );
  const latestEvents = latestEventByTicket(
    (eventsResult.data ?? []) as TicketEvent[],
  );

  const candidateEvents: TicketEvent[] = [];
  for (const [ticketId, event] of latestEvents) {
    if (event.actor === profile.id) continue;

    const seenAt = lastSeen.get(ticketId);
    if (
      seenAt &&
      new Date(event.created_at).getTime() <= new Date(seenAt).getTime()
    ) {
      continue;
    }

    if (!ticketById.has(ticketId)) continue;
    candidateEvents.push(event);
  }

  const actorNames = await resolveActorNames(
    candidateEvents.map((event) => event.actor).filter((id): id is string => Boolean(id)),
  );

  const unread: TicketNotification[] = [];

  for (const event of candidateEvents) {
    const ticket = ticketById.get(event.ticket_id);
    if (!ticket) continue;

    unread.push({
      ticketId: event.ticket_id,
      href: hrefForTicket(profile.role, event.ticket_id),
      title: ticket.category,
      eventLabel: labelForEvent(event),
      preview: previewForEvent(event),
      status: ticket.status,
      urgency: ticket.urgency,
      actorName: event.actor ? actorNames.get(event.actor) ?? null : null,
      at: event.created_at,
    });
  }

  unread.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return unread.slice(0, MAX_NOTIFICATIONS);
}

export async function markTicketSeen(ticketId: string): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("ticket_reads").upsert(
    {
      user_id: user.id,
      ticket_id: ticketId,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "user_id,ticket_id" },
  );
}
