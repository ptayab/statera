import { createServerClient } from "@/lib/supabase/server";
import type { TicketStatus } from "@/lib/supabase/types";
import { isPilotTicketCategory } from "@/lib/tickets/categories";
import { formatTicketEvent, type TicketDetail, type TicketListItem } from "@/lib/tickets/display";
import { isTicketStatus } from "@/lib/tickets/status";

const OPEN_TICKET_STATUSES: TicketStatus[] = ["Submitted", "In Review", "In Progress"];

export type TicketFilters = {
  status?: string;
  category?: string;
  openOnly?: boolean;
  closedOnly?: boolean;
};

async function resolveUserNames(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", uniqueIds);

  return new Map(
    (users ?? []).map((user) => [user.id, user.name ?? user.email]),
  );
}

export async function getSiteTickets(
  siteId: string,
  filters: TicketFilters = {},
): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("tickets")
    .select(
      "id, category, description, status, created_at, closed_at, created_by, assigned_to",
    )
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (filters.openOnly) {
    query = query.in("status", OPEN_TICKET_STATUSES);
  } else if (filters.closedOnly) {
    query = query.eq("status", "Closed");
  } else if (filters.status && isTicketStatus(filters.status)) {
    query = query.eq("status", filters.status);
  }

  if (filters.category && isPilotTicketCategory(filters.category)) {
    query = query.eq("category", filters.category);
  }

  const { data: tickets, error } = await query;

  if (error || !tickets?.length) {
    return [];
  }

  const nameMap = await resolveUserNames(supabase, [
    ...tickets.map((ticket) => ticket.created_by),
    ...tickets.flatMap((ticket) =>
      ticket.assigned_to ? [ticket.assigned_to] : [],
    ),
  ]);

  return tickets.map((ticket) => ({
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    assigned_to: ticket.assigned_to,
    reporter_name: nameMap.get(ticket.created_by) ?? "Unknown",
    assignee_name: ticket.assigned_to
      ? nameMap.get(ticket.assigned_to) ?? null
      : null,
  }));
}

export async function getUserTickets(userId: string): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      "id, category, description, status, created_at, closed_at, created_by, assigned_to",
    )
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error || !tickets?.length) {
    return [];
  }

  const nameMap = await resolveUserNames(
    supabase,
    tickets.flatMap((ticket) =>
      ticket.assigned_to ? [ticket.assigned_to] : [],
    ),
  );

  return tickets.map((ticket) => ({
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    assigned_to: ticket.assigned_to,
    reporter_name: "You",
    assignee_name: ticket.assigned_to
      ? nameMap.get(ticket.assigned_to) ?? null
      : null,
  }));
}

export async function getTicketDetail(
  ticketId: string,
  siteId: string,
): Promise<TicketDetail | null> {
  const supabase = await createServerClient();

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(
      "id, category, description, status, created_at, closed_at, photo_url, created_by, site_id, assigned_to",
    )
    .eq("id", ticketId)
    .eq("site_id", siteId)
    .maybeSingle();

  if (error || !ticket) {
    return null;
  }

  const { data: events } = await supabase
    .from("ticket_events")
    .select("id, ticket_id, event_type, actor, payload, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  const actorIds = [
    ...new Set((events ?? []).map((event) => event.actor).filter(Boolean)),
  ] as string[];

  const nameMap = await resolveUserNames(supabase, [
    ticket.created_by,
    ...(ticket.assigned_to ? [ticket.assigned_to] : []),
    ...actorIds,
  ]);

  let photoSignedUrl: string | null = null;
  if (ticket.photo_url) {
    const { data: signed } = await supabase.storage
      .from("ticket-photos")
      .createSignedUrl(ticket.photo_url, 3600);
    photoSignedUrl = signed?.signedUrl ?? null;
  }

  return {
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    assigned_to: ticket.assigned_to,
    photo_url: ticket.photo_url,
    photo_signed_url: photoSignedUrl,
    reporter_name: nameMap.get(ticket.created_by) ?? "Unknown",
    assignee_name: ticket.assigned_to
      ? nameMap.get(ticket.assigned_to) ?? null
      : null,
    events: (events ?? []).map((event) => {
      const actorName = event.actor ? nameMap.get(event.actor) ?? null : null;
      const formatted = formatTicketEvent({ ...event, actor_name: actorName });
      return {
        ...event,
        actor_name: actorName,
        formatted,
      };
    }),
  };
}
