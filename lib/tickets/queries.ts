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
};

export async function getSiteTickets(
  siteId: string,
  filters: TicketFilters = {},
): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("tickets")
    .select("id, category, description, status, created_at, closed_at, created_by")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (filters.openOnly) {
    query = query.in("status", OPEN_TICKET_STATUSES);
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

  const creatorIds = [...new Set(tickets.map((ticket) => ticket.created_by))];
  const { data: reporters } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", creatorIds);

  const reporterMap = new Map(
    (reporters ?? []).map((user) => [
      user.id,
      user.name ?? user.email,
    ]),
  );

  return tickets.map((ticket) => ({
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    reporter_name: reporterMap.get(ticket.created_by) ?? "Unknown",
  }));
}

export async function getUserTickets(userId: string): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("id, category, description, status, created_at, closed_at, created_by")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error || !tickets?.length) {
    return [];
  }

  return tickets.map((ticket) => ({
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    reporter_name: "You",
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
      "id, category, description, status, created_at, closed_at, photo_url, created_by, site_id",
    )
    .eq("id", ticketId)
    .eq("site_id", siteId)
    .maybeSingle();

  if (error || !ticket) {
    return null;
  }

  const { data: reporter } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", ticket.created_by)
    .maybeSingle();

  const { data: events } = await supabase
    .from("ticket_events")
    .select("id, ticket_id, event_type, actor, payload, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  const actorIds = [
    ...new Set((events ?? []).map((event) => event.actor).filter(Boolean)),
  ] as string[];

  const { data: actors } = actorIds.length
    ? await supabase.from("users").select("id, name, email").in("id", actorIds)
    : { data: [] };

  const actorMap = new Map(
    (actors ?? []).map((user) => [user.id, user.name ?? user.email]),
  );

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
    photo_url: ticket.photo_url,
    photo_signed_url: photoSignedUrl,
    reporter_name: reporter?.name ?? reporter?.email ?? "Unknown",
    events: (events ?? []).map((event) => {
      const actorName = event.actor ? actorMap.get(event.actor) ?? null : null;
      const formatted = formatTicketEvent({ ...event, actor_name: actorName });
      return {
        ...event,
        actor_name: actorName,
        formatted,
      };
    }),
  };
}
