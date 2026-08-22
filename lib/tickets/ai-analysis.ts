export type TicketAiAnalysis = {
  descriptionPts: number;
  languageSummary: string;
  suggestedPriority: string;
  duplicateIds: string[];
  duplicateReason: string | null;
  model: string;
  analyzedAt: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseAiAnalysis(value: unknown): TicketAiAnalysis | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.descriptionPts !== "number") return null;
  if (typeof row.languageSummary !== "string") return null;

  const duplicateIds = Array.isArray(row.duplicateIds)
    ? row.duplicateIds.filter(
        (id): id is string => typeof id === "string" && UUID_RE.test(id),
      )
    : [];

  return {
    descriptionPts: Math.max(0, Math.min(20, Math.round(row.descriptionPts))),
    languageSummary: row.languageSummary,
    suggestedPriority:
      typeof row.suggestedPriority === "string"
        ? row.suggestedPriority
        : "Medium",
    duplicateIds,
    duplicateReason:
      typeof row.duplicateReason === "string" ? row.duplicateReason : null,
    model: typeof row.model === "string" ? row.model : "unknown",
    analyzedAt:
      typeof row.analyzedAt === "string"
        ? row.analyzedAt
        : new Date().toISOString(),
  };
}

/**
 * Connected-component sizes from Claude duplicate links.
 * An edge A–B exists if A listed B or B listed A.
 */
export function clusterDuplicateCounts(
  tickets: { id: string; duplicateIds: string[] }[],
): Map<string, number> {
  const ids = new Set(tickets.map((ticket) => ticket.id));
  const neighbors = new Map<string, Set<string>>();

  function addEdge(a: string, b: string) {
    if (a === b || !ids.has(a) || !ids.has(b)) return;
    if (!neighbors.has(a)) neighbors.set(a, new Set());
    if (!neighbors.has(b)) neighbors.set(b, new Set());
    neighbors.get(a)!.add(b);
    neighbors.get(b)!.add(a);
  }

  for (const ticket of tickets) {
    if (!neighbors.has(ticket.id)) neighbors.set(ticket.id, new Set());
    for (const other of ticket.duplicateIds) {
      addEdge(ticket.id, other);
    }
  }

  const counts = new Map<string, number>();
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) continue;
    const stack = [id];
    const component: string[] = [];
    seen.add(id);

    while (stack.length > 0) {
      const current = stack.pop()!;
      component.push(current);
      for (const next of neighbors.get(current) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }

    for (const member of component) {
      counts.set(member, component.length);
    }
  }

  return counts;
}
