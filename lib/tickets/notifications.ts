import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { TicketEvent } from "@/lib/supabase/types";
import type { UserProfile } from "@/lib/auth/session";
import {
  formatTicketEvent,
  type TicketNotification,
} from "@/lib/tickets/display";

const MAX_NOTIFICATIONS = 20;

type FollowedTicket = {
  id: string;
  category: string;
};

function truncate(text: string, max: number): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, Math.max(0, max - 1))}…`;
}

function previewForEvent(event: TicketEvent): string {
  const formatted = formatTicketEvent(event);
  if (formatted.kind === "message") {
    const body = formatted.body?.trim();
    return body ? truncate(body, 80) : "New message";
  }
  return formatted.detail ?? formatted.title;
}

function hrefForTicket(role: UserProfile["role"], ticketId: string): string {
  return role === "worker"
    ? `/worker/tickets/${ticketId}`
    : `/supervisor/${ticketId}`;
}

async function followedTickets(
  profile: UserProfile,
): Promise<FollowedTicket[]> {
  const supabase = await createServerClient();

  if (profile.role === "worker") {
    const { data, error } = await supabase
      .from("tickets")
      .select("id, category")
      .eq("created_by", profile.id);

    if (error) return [];
    return data ?? [];
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("id, category")
    .eq("site_id", profile.site_id)
    .eq("assigned_to", profile.id);

  if (error) return [];
  return data ?? [];
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

  const unread: TicketNotification[] = [];

  for (const [ticketId, event] of latestEvents) {
    if (event.actor === profile.id) continue;

    const seenAt = lastSeen.get(ticketId);
    if (
      seenAt &&
      new Date(event.created_at).getTime() <= new Date(seenAt).getTime()
    ) {
      continue;
    }

    const ticket = ticketById.get(ticketId);
    if (!ticket) continue;

    unread.push({
      ticketId,
      href: hrefForTicket(profile.role, ticketId),
      title: ticket.category,
      preview: previewForEvent(event),
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
