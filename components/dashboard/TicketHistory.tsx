import type { TicketDetail } from "@/lib/tickets/display";

type TicketHistoryProps = {
  events: TicketDetail["events"];
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function TicketHistory({ events }: TicketHistoryProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No history yet.</p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium">{event.formatted.title}</p>
            <time className="text-xs text-zinc-500" dateTime={event.created_at}>
              {formatWhen(event.created_at)}
            </time>
          </div>
          {event.formatted.detail ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {event.formatted.detail}
            </p>
          ) : null}
          {event.actor_name ? (
            <p className="mt-1 text-xs text-zinc-500">By {event.actor_name}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
