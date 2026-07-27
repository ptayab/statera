import Link from "next/link";
import type { TicketListItem } from "@/lib/tickets/display";
import { statusBadgeClass } from "@/lib/tickets/status";

type TicketListProps = {
  tickets: TicketListItem[];
  showReporter?: boolean;
  emptyMessage?: string;
  detailHref?: (ticketId: string) => string;
};

const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatTimeAgo(iso: string) {
  const created = new Date(iso).getTime();
  let duration = (created - Date.now()) / 1000;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
        Math.round(duration),
        division.unit,
      );
    }
    duration /= division.amount;
  }

  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    Math.round(duration),
    "year",
  );
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
        const when = `${formatTimeAgo(ticket.created_at)} · ${formatWhen(ticket.created_at)}`;
        const metaParts = [
          showReporter ? ticket.reporter_name : null,
          ticket.assignee_name ? `Assignee: ${ticket.assignee_name}` : null,
          when,
        ].filter(Boolean);
        const meta = metaParts.join(" · ");

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
