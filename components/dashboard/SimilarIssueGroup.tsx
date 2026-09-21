import {
  IssueCard,
  type IssueCardItem,
} from "@/components/dashboard/IssueCard";
import { DuplicateChip, PriorityTag } from "@/components/ui/Chip";
import type { TicketScore } from "@/lib/tickets/scoring";
import { clusterIssueTone, priorityVisual } from "@/lib/tickets/theme";

type SimilarIssueGroupProps = {
  tickets: IssueCardItem[];
  ranking: TicketScore;
  rank?: number;
  showAssignee?: boolean;
  detailHref: (ticketId: string) => string;
};

export function SimilarIssueGroup({
  tickets,
  ranking,
  rank,
  showAssignee = true,
  detailHref,
}: SimilarIssueGroupProps) {
  const visual = priorityVisual(ranking.label);
  const tone = clusterIssueTone(tickets.map((ticket) => ticket.status));
  const count = tickets.length;
  const shell = {
    open: visual.chip,
    resolved:
      "bg-zinc-50 text-zinc-600 ring-zinc-200 dark:bg-white/[0.04] dark:text-zinc-400 dark:ring-white/10",
    closed:
      "bg-zinc-100/80 text-zinc-500 ring-zinc-200 dark:bg-black/30 dark:text-zinc-500 dark:ring-white/5",
  }[tone];
  const wash = {
    open: visual.wash,
    resolved: "bg-transparent",
    closed: "bg-transparent",
  }[tone];
  const priorityClass = {
    open: "",
    resolved: "opacity-80",
    closed: "text-zinc-500 dark:text-zinc-500",
  }[tone];

  return (
    <li className={`overflow-hidden rounded-2xl ring-1 ring-inset ${shell}`}>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {rank != null ? (
          <span
            className="flex w-9 shrink-0 items-center justify-center font-display text-base tabular-nums text-zinc-300 dark:text-zinc-600"
            aria-hidden
          >
            {rank}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="flex shrink-0 items-baseline gap-1">
            <span className="font-display text-[9px] uppercase leading-none tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
              AI
            </span>
            <PriorityTag label={ranking.label} className={priorityClass} />
          </span>
          <DuplicateChip count={count} />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Same issue, different reports
          </p>
        </div>
      </div>

      <ul
        className={`flex flex-col gap-1.5 px-1.5 pb-1.5 ${wash}`}
        aria-label={`${count} similar reports, AI ranking ${ranking.label}`}
      >
        {tickets.map((ticket) => (
          <IssueCard
            key={ticket.id}
            item={ticket}
            href={detailHref(ticket.id)}
            showAssignee={showAssignee}
            nested
          />
        ))}
      </ul>
    </li>
  );
}
