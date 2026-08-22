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
import {
  clusterDuplicateCounts,
  parseAiAnalysis,
  type TicketAiAnalysis,
} from "@/lib/tickets/ai-analysis";
import { OPEN_TICKET_STATUSES, isTicketStatus } from "@/lib/tickets/status";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerClient>>;

const TICKET_LIST_COLUMNS =
  "id, category, description, status, urgency, created_at, closed_at, created_by, assigned_to, ai_analysis, ai_explanation";

type TicketRow = {
  id: string;
  category: string;
  description: string;
  status: string;
  urgency: string | null;
  created_at: string;
  closed_at: string | null;
  created_by: string;
  assigned_to: string | null;
  ai_analysis?: Record<string, unknown> | null;
  ai_explanation?: string | null;
};

type UserLookup = {
  name: string;
  role: UserRole;
};

async function resolveUsers(
  supabase: SupabaseServerClient,
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

function participantIds(rows: TicketRow[]): string[] {
  return [
    ...rows.map((row) => row.created_by),
    ...rows.flatMap((row) => (row.assigned_to ? [row.assigned_to] : [])),
  ];
}

function toListItem(
  row: TicketRow,
  users: Map<string, UserLookup>,
  reporterName?: string,
): TicketListItem {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    status: row.status as TicketStatus,
    urgency: toUrgency(row.urgency),
    created_at: row.created_at,
    closed_at: row.closed_at,
    reporter_name:
      reporterName ?? users.get(row.created_by)?.name ?? "Unknown",
    assignee_name: row.assigned_to
      ? users.get(row.assigned_to)?.name ?? null
      : null,
  };
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
  ai_analysis: TicketAiAnalysis | null;
};

function siteTicketQuery(
  supabase: SupabaseServerClient,
  siteId: string,
  filters: TicketFilters,
) {
  let query = supabase
    .from("tickets")
    .select(TICKET_LIST_COLUMNS)
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

  return query;
}

/**
 * Semantic duplicate cluster sizes from Claude links.
 * Tickets Claude has not grouped stay at 1 — same category is not enough.
 */
function duplicateCountsForRows(
  rows: Pick<TicketRow, "id" | "ai_analysis">[],
): Map<string, number> {
  return clusterDuplicateCounts(
    rows.map((row) => ({
      id: row.id,
      duplicateIds: parseAiAnalysis(row.ai_analysis)?.duplicateIds ?? [],
    })),
  );
}

function rankRow(
  row: TicketRow,
  item: TicketListItem,
  lastEventAt: string | null,
  duplicateCount: number,
): RankedTicketListItem {
  const analysis = parseAiAnalysis(row.ai_analysis);
  return {
    ...item,
    last_event_at: lastEventAt,
    duplicate_count: duplicateCount,
    ai_analysis: analysis,
    ranking: scoreTicket(item, lastEventAt, duplicateCount, new Date(), {
      descriptionPts: analysis?.descriptionPts,
    }),
  };
}

async function getOpenDuplicateContext(
  supabase: SupabaseServerClient,
  siteId: string,
): Promise<Map<string, number>> {
  const { data } = await supabase
    .from("tickets")
    .select("id, ai_analysis")
    .eq("site_id", siteId)
    .in("status", OPEN_TICKET_STATUSES);

  return duplicateCountsForRows(
    (data ?? []) as Pick<TicketRow, "id" | "ai_analysis">[],
  );
}

async function getLastEventTimestamps(
  supabase: SupabaseServerClient,
  ticketIds: string[],
): Promise<Map<string, string>> {
  if (ticketIds.length === 0) return new Map();

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
  return lastEventByTicket;
}

/**
 * Site tickets in reverse-chronological order, each carrying its AI ranking.
 *
 * Round trips are grouped into two waves: the ticket rows and the site-wide
 * category counts are independent, and the user lookup and last-activity
 * lookup both depend only on the rows. Chaining all four would cost roughly
 * twice the latency.
 */
export async function getSiteTicketsWithRanking(
  siteId: string,
  filters: TicketFilters = {},
): Promise<RankedTicketListItem[]> {
  const supabase = await createServerClient();

  const [ticketResult, duplicateContext] = await Promise.all([
    siteTicketQuery(supabase, siteId, filters),
    getOpenDuplicateContext(supabase, siteId),
  ]);

  const rows = ticketResult.data as TicketRow[] | null;
  if (ticketResult.error || !rows?.length) {
    return [];
  }

  const [users, lastEvents] = await Promise.all([
    resolveUsers(supabase, participantIds(rows)),
    getLastEventTimestamps(
      supabase,
      rows.map((row) => row.id),
    ),
  ]);

  const duplicateCounts = duplicateContext;

  return rows.map((row) =>
    rankRow(
      row,
      toListItem(row, users),
      lastEvents.get(row.id) ?? null,
      duplicateCounts.get(row.id) ?? 1,
    ),
  );
}

/** Open tickets ordered by AI score, highest risk first. */
export async function getSiteTicketsRanked(
  siteId: string,
): Promise<RankedTicketListItem[]> {
  const ranked = await getSiteTicketsWithRanking(siteId, { openOnly: true });
  return [...ranked].sort((a, b) => b.ranking.score - a.ranking.score);
}

export async function getUserTickets(userId: string): Promise<TicketListItem[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("tickets")
    .select(TICKET_LIST_COLUMNS)
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  const rows = data as TicketRow[] | null;
  if (error || !rows?.length) {
    return [];
  }

  const users = await resolveUsers(
    supabase,
    rows.flatMap((row) => (row.assigned_to ? [row.assigned_to] : [])),
  );

  return rows.map((row) => toListItem(row, users, "You"));
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
      "id, category, description, status, urgency, created_at, closed_at, photo_url, created_by, site_id, assigned_to, ai_analysis, ai_explanation",
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

  // Events, duplicate counts, and the photo URL are all independent of one
  // another once the ticket row is known.
  const [eventResult, duplicateContext, photoSignedUrl] = await Promise.all([
    supabase
      .from("ticket_events")
      .select("id, ticket_id, event_type, actor, payload, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true }),
    getOpenDuplicateContext(supabase, ticket.site_id),
    ticket.photo_url
      ? supabase.storage
          .from("ticket-photos")
          .createSignedUrl(ticket.photo_url, 3600)
          .then(({ data }) => data?.signedUrl ?? null)
      : Promise.resolve(null),
  ]);

  const events = eventResult.data ?? [];
  const actorIds = [
    ...new Set(events.map((event) => event.actor).filter(Boolean)),
  ] as string[];

  const users = await resolveUsers(supabase, [
    ticket.created_by,
    ...(ticket.assigned_to ? [ticket.assigned_to] : []),
    ...actorIds,
  ]);

  const urgency = toUrgency(ticket.urgency);
  const lastEventAt = events.length
    ? events[events.length - 1].created_at
    : null;
  const analysis = parseAiAnalysis(ticket.ai_analysis);
  const clusterSize = duplicateContext.get(ticket.id) ?? 1;

  return {
    id: ticket.id,
    category: ticket.category,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    urgency,
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
    last_event_at: lastEventAt,
    duplicate_count: clusterSize,
    ai_analysis: analysis,
    ranking: scoreTicket(
      {
        category: ticket.category,
        description: ticket.description,
        urgency,
        created_at: ticket.created_at,
      },
      lastEventAt,
      clusterSize,
      new Date(),
      { descriptionPts: analysis?.descriptionPts },
    ),
    events: events.map((event) => {
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
