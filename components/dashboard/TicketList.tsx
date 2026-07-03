import Link from "next/link";
import type { TicketListItem } from "@/lib/tickets/display";
import { statusBadgeClass } from "@/lib/tickets/status";

type TicketListProps = {
  tickets: TicketListItem[];
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No tickets match these filters yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/dashboard/${ticket.id}`}
            className="block px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
              >
                {ticket.status}
              </span>
              <span className="text-xs text-zinc-500">{ticket.category}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-medium">{ticket.description}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {ticket.reporter_name} · {formatWhen(ticket.created_at)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
