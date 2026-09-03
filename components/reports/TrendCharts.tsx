import { Panel, PanelHeader } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import type { SiteReportStats } from "@/lib/tickets/trends";
import { categoryVisual, priorityVisual } from "@/lib/tickets/theme";

const CATEGORY_BAR_FILL: Record<string, string> = {
  "Dangerous Occurrence": "bg-rose-600",
  "Unsafe Condition": "bg-rose-500",
  "Near-Miss Report": "bg-orange-500",
  "Fatigue / Wellness Concern": "bg-orange-400",
  "Equipment Issue": "bg-sky-500",
  "PPE Request": "bg-violet-500",
  "HR / Supervisor Escalation": "bg-zinc-400",
  "Training Request": "bg-amber-400",
  "Procedure Clarification": "bg-emerald-500",
};

function categoryFill(name: string): string {
  return CATEGORY_BAR_FILL[name] ?? "bg-zinc-400";
}

function VolumeChart({ stats }: { stats: SiteReportStats }) {
  const max = Math.max(...stats.volume.map((bucket) => bucket.count), 0);
  const total = stats.volume.reduce((sum, bucket) => sum + bucket.count, 0);

  return (
    <Panel>
      <PanelHeader
        title="Volume"
        description="Reports filed each week, last eight weeks."
      />
      <div className="px-4 py-4">
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No reports were filed in the last eight weeks.
          </p>
        ) : (
          <div className="flex h-40 items-end gap-1.5">
            {stats.volume.map((bucket) => {
              const pct = max > 0 ? (bucket.count / max) * 100 : 0;
              return (
                <div
                  key={bucket.key}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <span className="text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
                    {bucket.count}
                  </span>
                  <div className="flex h-28 w-full items-end overflow-hidden rounded-sm bg-inset">
                    <div
                      className="w-full rounded-sm bg-statera-orange"
                      style={{ height: `${Math.max(pct, bucket.count > 0 ? 6 : 0)}%` }}
                      title={`${bucket.label}: ${bucket.count}`}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[10px] text-zinc-500 dark:text-zinc-400">
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}

function CategoryMix({ stats }: { stats: SiteReportStats }) {
  const max = Math.max(...stats.categories.map((row) => row.count), 0);

  return (
    <Panel>
      <PanelHeader
        title="Categories"
        description="Live reports that are not yet resolved or closed."
      />
      <div className="px-4 py-4">
        {stats.categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No live reports to show.
          </p>
        ) : (
          <ul className="space-y-3">
            {stats.categories.map((row) => {
              const pct = max > 0 ? (row.count / max) * 100 : 0;
              const visual = categoryVisual(row.name);
              return (
                <li key={row.name}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-xs ${visual.text}`}>{visual.short}</span>
                    <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {row.count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset">
                    <div
                      className={`h-full rounded-full ${categoryFill(row.name)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}

function PriorityMix({ stats }: { stats: SiteReportStats }) {
  const total = stats.priorities.reduce((sum, row) => sum + row.count, 0);

  return (
    <Panel>
      <PanelHeader
        title="AI ranking mix"
        description="How live reports rank today."
      />
      <div className="px-4 py-4">
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No rankings to show.
          </p>
        ) : (
          <>
            <div className="flex h-3 overflow-hidden rounded-full bg-inset">
              {stats.priorities.map((row) =>
                row.count > 0 ? (
                  <div
                    key={row.label}
                    className={priorityVisual(row.label).fill}
                    style={{ width: `${(row.count / total) * 100}%` }}
                    title={`${row.label}: ${row.count}`}
                  />
                ) : null,
              )}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {stats.priorities.map((row) => {
                const visual = priorityVisual(row.label);
                return (
                  <div key={row.label} className="border-b border-hairline pb-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${visual.dot}`}
                          aria-hidden
                        />
                        {row.label}
                      </dt>
                      <dd className="font-display text-base leading-none tabular-nums text-zinc-900 dark:text-zinc-100">
                        {row.count}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </>
        )}
      </div>
    </Panel>
  );
}

export function TrendCharts({ stats }: { stats: SiteReportStats }) {
  return (
    <div className="print:hidden">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Open"
          value={stats.open}
          hint="Not resolved or closed"
          accent="bg-amber-400"
        />
        <StatTile
          label="Hazard reports"
          value={stats.hazardReports}
          hint="Open unsafe, near-miss, and dangerous occurrence"
          accent="bg-rose-600"
          tone={
            stats.hazardReports > 0
              ? "text-rose-700 dark:text-rose-300"
              : undefined
          }
        />
        <StatTile
          label="Open over a week"
          value={stats.longOpen}
          hint="Still live from earlier"
          accent="bg-orange-500"
          tone={
            stats.longOpen > 0
              ? "text-orange-700 dark:text-orange-300"
              : undefined
          }
        />
        <StatTile
          label="New this week"
          value={stats.filedThisWeek}
          hint="Filed in the last 7 days"
          accent="bg-sky-500"
        />
        <StatTile
          label="Unassigned"
          value={stats.unassignedOpen}
          hint="Live, no supervisor yet"
          accent="bg-violet-500"
        />
        <StatTile
          label="Gone quiet"
          value={stats.goneQuiet}
          hint="Live and idle over 7 days"
          accent="bg-orange-500"
          tone={
            stats.goneQuiet > 0
              ? "text-orange-700 dark:text-orange-300"
              : undefined
          }
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <VolumeChart stats={stats} />
        <CategoryMix stats={stats} />
      </div>

      <div className="mt-4">
        <PriorityMix stats={stats} />
      </div>
    </div>
  );
}
