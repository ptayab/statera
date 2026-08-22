import { createServerClient } from "@/lib/supabase/server";
import type {
  TicketStatus,
  TicketUrgency,
  UserRole,
} from "@/lib/supabase/types";
import { isPilotTicketCategory } from "@/lib/tickets/categories";
import {
  formatTicketEvent,
  type TicketDetail,
  type TicketListItem,
} from "@/lib/tickets/display";
import { scoreTicket, type TicketScore } from "@/lib/tickets/scoring";
import { isTicketStatus } from "@/lib/tickets/status";

const OPEN_TICKET_STATUSES: TicketStatus[] = [
  "Submitted",
  "In Review",
  "In Progress",
];

type UserLookup = {
  name: string;
  role: UserRole;
};

async function resolveUsers(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userIds: string[],
): Promise<Map<string, UserLookup>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, role")
    .in("id", uniqueIds);

  return new Map(
    (users ?? []).map((user) => [
      user.id,
      {
        name: user.name ?? user.email,
        role: user.role as UserRole,
      },
    ]),
  );
}

function toUrgency(value: string | null | undefined): TicketUrgency {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }
  return "Medium";
}

export type TicketFilters = {
  status?: string;
  category?: string;
  openOnly?: boolean;
};

export type RankedTicketListItem = TicketListItem & {
  last_event_at: string | null;
  duplicate_count: number;
  ranking: TicketScore;
};

export async function getSiteTickets(
  siteId: string,
  filters: TicketFilters = {},
): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("tickets")
    .select(
      "id, category, description, status, urgency, created_at, closed_at, created_by, assigned_to",
    )
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

  const users = await resolveUsers(supabase, [
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
    urgency: toUrgency(ticket.urgency),
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    reporter_name: users.get(ticket.created_by)?.name ?? "Unknown",
    assignee_name: ticket.assigned_to
      ? users.get(ticket.assigned_to)?.name ?? null
      : null,
  }));
}

/** Open tickets ranked by AI score (highest first), with duplicate grouping metadata. */
export async function getSiteTicketsRanked(
  siteId: string,
): Promise<RankedTicketListItem[]> {
  const supabase = await createServerClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      "id, category, description, status, urgency, created_at, closed_at, created_by, assigned_to",
    )
    .eq("site_id", siteId)
    .in("status", OPEN_TICKET_STATUSES);

  if (error || !tickets?.length) {
    return [];
  }

  const ticketIds = tickets.map((ticket) => ticket.id);

  const { data: events } = await supabase
    .from("ticket_events")
    .select("ticket_id, created_at")
    .in("ticket_id", ticketIds)
    .order("created_at", { ascending: false });

  const lastEventByTicket = new Map<string, string>();
  for (const event of events ?? []) {
    if (!lastEventByTicket.has(event.ticket_id)) {
      lastEventByTicket.set(event.ticket_id, event.created_at);
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const ticket of tickets) {
    categoryCounts.set(
      ticket.category,
      (categoryCounts.get(ticket.category) ?? 0) + 1,
    );
  }

  const users = await resolveUsers(supabase, [
    ...tickets.map((ticket) => ticket.created_by),
    ...tickets.flatMap((ticket) =>
      ticket.assigned_to ? [ticket.assigned_to] : [],
    ),
  ]);

  const ranked: RankedTicketListItem[] = tickets.map((ticket) => {
    const urgency = toUrgency(ticket.urgency);
    const lastEventAt = lastEventByTicket.get(ticket.id) ?? null;
    const duplicateCount = categoryCounts.get(ticket.category) ?? 1;
    const ranking = scoreTicket(
      {
        category: ticket.category,
        description: ticket.description,
        urgency,
        created_at: ticket.created_at,
      },
      lastEventAt,
      duplicateCount,
    );

    return {
      id: ticket.id,
      category: ticket.category,
      description: ticket.description,
      status: ticket.status as TicketStatus,
      urgency,
      created_at: ticket.created_at,
      closed_at: ticket.closed_at,
      reporter_name: users.get(ticket.created_by)?.name ?? "Unknown",
      assignee_name: ticket.assigned_to
        ? users.get(ticket.assigned_to)?.name ?? null
        : null,
      last_event_at: lastEventAt,
      duplicate_count: duplicateCount,
      ranking,
    };
  });

  ranked.sort((a, b) => b.ranking.score - a.ranking.score);
  return ranked;
}

export async function getUserTickets(userId: string): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      "id, category, description, status, urgency, created_at, closed_at, created_by, assigned_to",
    )
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error || !tickets?.length) {
    return [];
  }

  const users = await resolveUsers(
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
    urgency: toUrgency(ticket.urgency),
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    reporter_name: "You",
    assignee_name: ticket.assigned_to
      ? users.get(ticket.assigned_to)?.name ?? null
      : null,
  }));
}

async function loadTicketDetail(
  ticketId: string,
  scope:
    | { kind: "site"; siteId: string }
    | { kind: "owner"; userId: string },
): Promise<TicketDetail | null> {
  const supabase = await createServerClient();

  let query = supabase
    .from("tickets")
    .select(
      "id, category, description, status, urgency, created_at, closed_at, photo_url, created_by, site_id, assigned_to",
    )
    .eq("id", ticketId);

  if (scope.kind === "site") {
    query = query.eq("site_id", scope.siteId);
  } else {
    query = query.eq("created_by", scope.userId);
  }

  const { data: ticket, error } = await query.maybeSingle();

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

  const users = await resolveUsers(supabase, [
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
    urgency: toUrgency(ticket.urgency),
    created_at: ticket.created_at,
    closed_at: ticket.closed_at,
    created_by: ticket.created_by,
    assigned_to: ticket.assigned_to,
    photo_url: ticket.photo_url,
    photo_signed_url: photoSignedUrl,
    reporter_name: users.get(ticket.created_by)?.name ?? "Unknown",
    assignee_name: ticket.assigned_to
      ? users.get(ticket.assigned_to)?.name ?? null
      : null,
    events: (events ?? []).map((event) => {
      const actor = event.actor ? users.get(event.actor) : null;
      const actorName = actor?.name ?? null;
      const formatted = formatTicketEvent({ ...event, actor_name: actorName });
      return {
        ...event,
        actor_name: actorName,
        actor_role: actor?.role ?? null,
        formatted,
      };
    }),
  };
}

export async function getTicketDetail(
  ticketId: string,
  siteId: string,
): Promise<TicketDetail | null> {
  return loadTicketDetail(ticketId, { kind: "site", siteId });
}

export async function getWorkerTicketDetail(
  ticketId: string,
  userId: string,
): Promise<TicketDetail | null> {
  return loadTicketDetail(ticketId, { kind: "owner", userId });
}
