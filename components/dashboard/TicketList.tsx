import Link from "next/link";
import type { TicketListItem } from "@/lib/tickets/display";
import { statusBadgeClass } from "@/lib/tickets/status";

type TicketListProps = {
  tickets: TicketListItem[];
  showReporter?: boolean;
  emptyMessage?: string;
  detailHref?: (ticketId: string) => string;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function TicketList({
  tickets,
  showReporter = true,
  emptyMessage = "No tickets match these filters yet.",
  detailHref = (ticketId) => `/supervisor/${ticketId}`,
}: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {tickets.map((ticket) => {
        const href = detailHref(ticket.id);
        const meta = showReporter
          ? `${ticket.reporter_name} · ${formatWhen(ticket.created_at)}`
          : formatWhen(ticket.created_at);

        const content = (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
              >
                {ticket.status}
              </span>
              <span className="text-xs text-zinc-500">{ticket.category}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-medium">{ticket.description}</p>
            <p className="mt-1 text-xs text-zinc-500">{meta}</p>
          </>
        );

        return (
          <li key={ticket.id}>
            {href ? (
              <Link
                href={href}
                className="block px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                {content}
              </Link>
            ) : (
              <div className="px-4 py-4">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
