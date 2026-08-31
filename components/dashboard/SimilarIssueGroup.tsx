import {
  IssueCard,
  type IssueCardItem,
} from "@/components/dashboard/IssueCard";
import { DuplicateChip, PriorityTag } from "@/components/ui/Chip";
import type { TicketScore } from "@/lib/tickets/scoring";
import { priorityVisual } from "@/lib/tickets/theme";

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
  const count = tickets.length;

  return (
    <li
      className={`overflow-hidden rounded-2xl ring-1 ring-inset ${visual.chip}`}
    >
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
            <PriorityTag label={ranking.label} />
          </span>
          <DuplicateChip count={count} />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Same issue, different reports
          </p>
        </div>
      </div>

      <ul
        className={`flex flex-col gap-1.5 px-1.5 pb-1.5 ${visual.wash}`}
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
