import type { ReactNode } from "react";
import type { TicketStatus, TicketUrgency } from "@/lib/supabase/types";
import { formatDayCount, initials } from "@/lib/tickets/format";
import type { PriorityLabel } from "@/lib/tickets/scoring";
import {
  NEUTRAL_CHIP_CLASS,
  STATUS_CHIP_CLASS,
  USER_RANKING_CHIP_CLASS,
  idleVisual,
  priorityVisual,
  statusVisual,
} from "@/lib/tickets/theme";

type ChipProps = {
  children: ReactNode;
  /** Background + text + ring classes from the theme. */
  tone?: string;
  /** Background class for the leading dot; omitted for dotless chips. */
  dot?: string;
  title?: string;
};

export function Chip({ children, tone = NEUTRAL_CHIP_CLASS, dot, title }: ChipProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[11px] font-medium ring-1 ring-inset ${tone}`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      ) : null}
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: TicketStatus }) {
  return (
    <Chip tone={STATUS_CHIP_CLASS} dot={statusVisual(status).dot}>
      {status}
    </Chip>
  );
}

/** Priority as a bare coloured word — the card rail already carries the colour. */
export function PriorityTag({
  label,
  className = "",
}: {
  label: PriorityLabel;
  className?: string;
}) {
  return (
    <span
      className={`font-display text-[13px] uppercase leading-none tracking-[0.14em] ${priorityVisual(label).text} ${className}`}
    >
      {label}
    </span>
  );
}

export function PriorityChip({ label }: { label: PriorityLabel }) {
  const visual = priorityVisual(label);
  return (
    <Chip tone={visual.chip} title="Computed AI ranking">
      AI ranking · {label}
    </Chip>
  );
}

export function UserRankingChip({ urgency }: { urgency: TicketUrgency }) {
  return (
    <Chip
      tone={USER_RANKING_CHIP_CLASS}
      title="Ranking chosen by the reporter"
    >
      User ranking · {urgency}
    </Chip>
  );
}

export function IdleChip({ daysIdle }: { daysIdle: number }) {
  const visual = idleVisual(daysIdle);
  return (
    <Chip
      tone={visual.chip}
      title={`No activity for ${formatDayCount(daysIdle)}`}
    >
      {daysIdle < 1 ? "Idle" : `${formatDayCount(daysIdle)} idle`}
    </Chip>
  );
}

export function DuplicateChip({ count }: { count: number }) {
  return (
    <Chip title={`${count} open reports in this category`}>
      <span className="tabular-nums">×{count}</span> similar
    </Chip>
  );
}

export function Avatar({ name }: { name: string | null }) {
  if (!name) {
    return (
      <span
        title="Unassigned"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-zinc-300 text-[10px] text-zinc-400 dark:border-zinc-600 dark:text-zinc-500"
      >
        <span aria-hidden>–</span>
        <span className="sr-only">Unassigned</span>
      </span>
    );
  }

  return (
    <span
      title={`Assigned to ${name}`}
      className="flex h-6 w-6 items-center justify-center rounded-full bg-statera-dark text-[10px] font-semibold tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900"
    >
      <span aria-hidden>{initials(name)}</span>
      <span className="sr-only">Assigned to {name}</span>
    </span>
  );
}
