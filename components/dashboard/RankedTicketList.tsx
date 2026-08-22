import Link from "next/link";
import type { RankedTicketListItem } from "@/lib/tickets/queries";
import { priorityBadgeClass } from "@/lib/tickets/scoring";
import { statusBadgeClass } from "@/lib/tickets/status";

type RankedTicketListProps = {
  tickets: RankedTicketListItem[];
  emptyMessage?: string;
};

const RELATIVE_DIVISIONS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
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

export function RankedTicketList({
  tickets,
  emptyMessage = "No open issues to rank right now.",
}: RankedTicketListProps) {
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
        const { ranking } = ticket;
        const when = `${formatTimeAgo(ticket.created_at)} · ${formatWhen(ticket.created_at)}`;
        const metaParts = [
          ticket.reporter_name,
          ticket.assignee_name ? `Assignee: ${ticket.assignee_name}` : null,
          `Urgency: ${ticket.urgency}`,
          when,
        ].filter(Boolean);
        const meta = metaParts.join(" · ");
        const isDormant = ranking.daysIdle > 7;

        return (
          <li key={ticket.id}>
            <Link
              href={`/supervisor/${ticket.id}`}
              className="block px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${priorityBadgeClass(ranking.label)}`}
                  title={`AI score ${ranking.score}`}
                >
                  {ranking.label} · {ranking.score}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-zinc-500">{ticket.category}</span>
                {ticket.duplicate_count > 1 ? (
                  <span
                    className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200"
                    title={`${ticket.duplicate_count} open reports in this category`}
                  >
                    ×{ticket.duplicate_count} similar
                  </span>
                ) : null}
                {isDormant ? (
                  <span
                    className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                    title={`No updates for ${Math.round(ranking.daysIdle)} days`}
                  >
                    Idle {Math.round(ranking.daysIdle)}d
                  </span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium">
                {ticket.description}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{meta}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
