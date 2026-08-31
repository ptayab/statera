import type { TicketStatus } from "@/lib/supabase/types";
import { duplicateClusters } from "@/lib/tickets/ai-analysis";
import type { TicketScore } from "@/lib/tickets/scoring";

export type SimilarGroupTicket = {
  id: string;
  duplicateIds?: string[];
  ranking?: TicketScore | null;
};

export type SimilarIssueGroup<T extends SimilarGroupTicket> =
  | { kind: "single"; ticket: T }
  | { kind: "cluster"; tickets: T[]; ranking: TicketScore };

function maxRanking<T extends SimilarGroupTicket>(
  tickets: T[],
): TicketScore | null {
  let best: TicketScore | null = null;
  for (const ticket of tickets) {
    const ranking = ticket.ranking;
    if (!ranking) continue;
    if (!best || ranking.score > best.score) {
      best = ranking;
    }
  }
  return best;
}

/**
 * Keep Claude-linked similar reports adjacent. Walks the list in the order
 * the page already sorted it, so a cluster sits where its first (highest /
 * newest) member would have appeared.
 */
export function groupSimilarIssues<T extends SimilarGroupTicket>(
  tickets: T[],
): SimilarIssueGroup<T>[] {
  const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]));
  const clusters = duplicateClusters(
    tickets.map((ticket) => ({
      id: ticket.id,
      duplicateIds: ticket.duplicateIds ?? [],
    })),
  );
  const seen = new Set<string>();
  const groups: SimilarIssueGroup<T>[] = [];

  for (const ticket of tickets) {
    if (seen.has(ticket.id)) continue;

    const memberIds = clusters.get(ticket.id) ?? [ticket.id];
    const members = memberIds
      .map((id) => byId.get(id))
      .filter((row): row is T => row != null);

    for (const member of members) {
      seen.add(member.id);
    }

    const ranking = maxRanking(members);
    if (members.length > 1 && ranking) {
      groups.push({ kind: "cluster", tickets: members, ranking });
    } else {
      groups.push({ kind: "single", ticket });
    }
  }

  return groups;
}

function isLiveStatus(status: TicketStatus): boolean {
  return status !== "Resolved" && status !== "Closed";
}

/**
 * Keep mixed similar groups together on Open issues: a resolved sibling
 * stays in the live list with its still-open match, instead of splitting
 * across “Waiting to close”.
 */
export function splitLiveAndWaiting<
  T extends SimilarGroupTicket & { status: TicketStatus },
>(tickets: T[]): { live: T[]; waiting: T[] } {
  const live: T[] = [];
  const waiting: T[] = [];

  for (const group of groupSimilarIssues(tickets)) {
    const members = group.kind === "cluster" ? group.tickets : [group.ticket];
    const bucket = members.some((ticket) => isLiveStatus(ticket.status))
      ? live
      : waiting;
    bucket.push(...members);
  }

  return { live, waiting };
}
