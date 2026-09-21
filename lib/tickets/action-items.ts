export const ACTION_ITEM_EVENT_TYPES = [
  "action_added",
  "action_completed",
  "action_reopened",
  "action_removed",
] as const;

export type ActionItemEventType = (typeof ACTION_ITEM_EVENT_TYPES)[number];

export type TicketActionItem = {
  id: string;
  title: string;
  dueOn: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type OpenActionItem = TicketActionItem & {
  ticketId: string;
  ticketCategory: string;
};

type FoldableEvent = {
  event_type: string;
  created_at: string;
  payload: Record<string, unknown> | null;
};

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isActionItemEventType(
  value: string,
): value is ActionItemEventType {
  return (ACTION_ITEM_EVENT_TYPES as readonly string[]).includes(value);
}

export function parseDueOn(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return DATE_ONLY.test(trimmed) ? trimmed : null;
}

export function dueOnDate(dueOn: string): Date | null {
  const match = DATE_ONLY.exec(dueOn);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function isActionItemOverdue(
  item: Pick<TicketActionItem, "dueOn" | "completedAt">,
  today = new Date(),
): boolean {
  if (item.completedAt || !item.dueOn) return false;
  const due = dueOnDate(item.dueOn);
  if (!due) return false;
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return due < startOfToday;
}

function payloadText(payload: Record<string, unknown> | null, key: string) {
  const value = payload?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function foldActionItems(events: FoldableEvent[]): TicketActionItem[] {
  const items = new Map<string, TicketActionItem>();

  for (const event of events) {
    if (!isActionItemEventType(event.event_type)) continue;

    const payload = event.payload;
    const actionId = payloadText(payload, "action_id");
    if (!actionId) continue;

    if (event.event_type === "action_added") {
      const title = payloadText(payload, "title");
      if (!title) continue;
      items.set(actionId, {
        id: actionId,
        title,
        dueOn: parseDueOn(payload?.due_on),
        createdAt: event.created_at,
        completedAt: null,
      });
      continue;
    }

    const existing = items.get(actionId);
    if (!existing) continue;

    if (event.event_type === "action_completed") {
      items.set(actionId, { ...existing, completedAt: event.created_at });
    } else if (event.event_type === "action_reopened") {
      items.set(actionId, { ...existing, completedAt: null });
    } else if (event.event_type === "action_removed") {
      items.delete(actionId);
    }
  }

  return [...items.values()].sort((a, b) => {
    const aDone = Boolean(a.completedAt);
    const bDone = Boolean(b.completedAt);
    if (aDone !== bDone) return aDone ? 1 : -1;

    const aOverdue = isActionItemOverdue(a);
    const bOverdue = isActionItemOverdue(b);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

    if (a.dueOn && b.dueOn && a.dueOn !== b.dueOn) {
      return a.dueOn.localeCompare(b.dueOn);
    }
    if (a.dueOn !== b.dueOn) return a.dueOn ? -1 : 1;

    return a.createdAt.localeCompare(b.createdAt);
  });
}
