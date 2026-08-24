import Link from "next/link";
import { Avatar, DuplicateChip, IdleChip, PriorityTag, StatusChip } from "@/components/ui/Chip";
import { formatCompactAge, formatDateTime } from "@/lib/tickets/format";
import type { TicketListItem } from "@/lib/tickets/display";
import type { TicketScore } from "@/lib/tickets/scoring";
import { categoryVisual, idleLevel, issueRail } from "@/lib/tickets/theme";

export type IssueCardItem = TicketListItem & {
  ranking?: TicketScore | null;
  duplicate_count?: number;
  last_event_at?: string | null;
};

type IssueCardProps = {
  item: IssueCardItem;
  href: string | null;
  /** Position in an explicitly ordered list; shown in the leading gutter. */
  rank?: number;
  showAssignee?: boolean;
};

/**
 * One issue, reduced to what a supervisor can act on at a glance: priority,
 * what happened, where it stands, and how long it has been waiting. Everything
 * else — score maths, reporter, urgency, exact timestamps — lives on the
 * detail page.
 */
export function IssueCard({
  item,
  href,
  rank,
  showAssignee = true,
}: IssueCardProps) {
  const ranking = item.ranking ?? null;
  const rail = issueRail(item.status, ranking?.label);
  const category = categoryVisual(item.category);
  const duplicates = item.duplicate_count ?? 1;
  const isClosed = item.status === "Closed";
  const isNeglected =
    !isClosed &&
    ranking != null &&
    ["dormant", "stalled"].includes(idleLevel(ranking.daysIdle));

  const content = (
    <>
      <span className={`w-1 shrink-0 ${rail}`} aria-hidden />

      {rank != null ? (
        <span
          className="flex w-9 shrink-0 items-center justify-center font-display text-base tabular-nums text-zinc-300 dark:text-zinc-600"
          aria-hidden
        >
          {rank}
        </span>
      ) : null}

      <div className="min-w-0 flex-1 py-3.5 pl-4 pr-3">
        <div className="flex items-baseline gap-2.5">
          {ranking ? (
            <span className="flex shrink-0 items-baseline gap-1">
              <span className="font-display text-[9px] uppercase leading-none tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                AI
              </span>
              <PriorityTag label={ranking.label} />
            </span>
          ) : null}
          <p className="min-w-0 flex-1 truncate text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
            {item.description}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span
            className={`font-semibold uppercase tracking-[0.08em] ${category.text}`}
          >
            {category.short}
          </span>
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-600" aria-hidden>
            ·
          </span>
          <span>User ranking {item.urgency}</span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <StatusChip status={item.status} />
          {isNeglected && ranking ? <IdleChip daysIdle={ranking.daysIdle} /> : null}
          {duplicates > 1 ? <DuplicateChip count={duplicates} /> : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center gap-2 py-3.5 pr-4">
        <time
          dateTime={item.created_at}
          title={
            item.closed_at
              ? `Open ${formatDateTime(item.created_at)} – ${formatDateTime(item.closed_at)}`
              : formatDateTime(item.created_at)
          }
          className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500"
        >
          {formatCompactAge(item.created_at, item.closed_at)}
        </time>
        {showAssignee ? <Avatar name={item.assignee_name} /> : null}
      </div>
    </>
  );

  return (
    <li className="overflow-hidden rounded-xl bg-panel ring-1 ring-hairline shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition duration-150 hover:ring-hairline-strong hover:shadow-[0_6px_20px_-6px_rgba(24,24,27,0.18)]">
      {href ? (
        <Link
          href={href}
          className="flex items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-statera-orange"
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-stretch">{content}</div>
      )}
    </li>
  );
}

export function IssueListEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong px-6 py-14 text-center">
      <p className="font-display text-sm uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
        All clear
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}

export function IssueList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2">{children}</ul>;
}
