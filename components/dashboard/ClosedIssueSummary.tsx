import type { ReactNode } from "react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { PriorityTag } from "@/components/ui/Chip";
import { formatCompactAge, formatDateTime, formatDayCount } from "@/lib/tickets/format";
import type { ClosedIssueHistory } from "@/lib/tickets/history";
import { CLOSED_RAIL, idleVisual } from "@/lib/tickets/theme";

function SummaryRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-hairline py-2.5 last:border-0 last:pb-0 first:pt-0">
      {children}
    </li>
  );
}

export function ClosedIssueSummary({
  history,
  languageSummary,
}: {
  history: ClosedIssueHistory;
  languageSummary?: string | null;
}) {
  const timeOpen = formatCompactAge(history.openedAt, history.closedAt);
  const wording = languageSummary?.trim() ?? "";

  return (
    <Panel accent={CLOSED_RAIL}>
      <PanelHeader
        title="Summary"
        description="What the AI ranking did while this issue was open."
      />

      {wording ? (
        <div className="px-4 py-4">
          <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
            Wording
          </h3>
          <p className="mt-3 rounded-lg bg-inset px-3 py-2.5 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {wording}
          </p>
        </div>
      ) : null}

      <div className={`${wording ? "border-t border-hairline " : ""}px-4 py-4`}>
        <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          Time open
        </h3>
        <p className="mt-2 font-display text-4xl leading-none tabular-nums text-zinc-900 dark:text-zinc-100">
          {timeOpen}
        </p>
        <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {formatDateTime(history.openedAt)} – {formatDateTime(history.closedAt)}
        </p>
      </div>

      <div className="border-t border-hairline px-4 py-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          AI rankings
        </h3>
        {history.rankings.length === 0 ? (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            No ranking history for this issue.
          </p>
        ) : (
          <ol className="mt-1">
            {history.rankings.map((period) => (
              <SummaryRow key={`${period.label}-${period.from}`}>
                <PriorityTag label={period.label} />
                <span className="min-w-0 text-right text-[11px] text-zinc-500 dark:text-zinc-400">
                  {period.from === period.to
                    ? formatDateTime(period.from)
                    : `${formatDateTime(period.from)} – ${formatDateTime(period.to)}`}
                </span>
              </SummaryRow>
            ))}
          </ol>
        )}
      </div>

      <div className="border-t border-hairline px-4 py-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          Dormancy
        </h3>
        {history.dormancy.length === 0 ? (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            No idle stretch longer than 3 days while this issue was open.
          </p>
        ) : (
          <ol className="mt-1">
            {history.dormancy.map((period) => {
              const idle = idleVisual(period.days);
              return (
                <SummaryRow key={`${period.from}-${period.to}`}>
                  <span className={`text-xs font-medium ${idle.text}`}>
                    {formatDayCount(period.days)} idle · {idle.label}
                  </span>
                  <span className="min-w-0 text-right text-[11px] text-zinc-500 dark:text-zinc-400">
                    {formatDateTime(period.from)} – {formatDateTime(period.to)}
                  </span>
                </SummaryRow>
              );
            })}
          </ol>
        )}
      </div>
    </Panel>
  );
}
