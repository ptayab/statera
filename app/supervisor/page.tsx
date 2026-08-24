import { TicketList } from "@/components/dashboard/TicketList";
import { Panel, PanelHeader, PageHeader, Section } from "@/components/ui/Panel";
import { NavCard, StatTile } from "@/components/ui/StatTile";
import { getUserProfile } from "@/lib/auth/session";
import { formatDuration } from "@/lib/tickets/format";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";
import { TICKET_STATUSES, isOpenTicketStatus } from "@/lib/tickets/status";
import { idleLevel, statusVisual } from "@/lib/tickets/theme";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function SupervisorHomePage() {
  const profile = await getUserProfile();

  // One fetch covers both panels; the open subset is just a filter on it.
  const allTickets = profile
    ? await getSiteTicketsWithRanking(profile.site_id)
    : [];
  const openTickets = allTickets.filter((ticket) =>
    isOpenTicketStatus(ticket.status),
  );

  const needsTriage = openTickets.filter((ticket) =>
    ["Critical", "High"].includes(ticket.ranking.label),
  ).length;
  const unassigned = openTickets.filter(
    (ticket) => ticket.assignee_name === null,
  ).length;
  const goneQuiet = openTickets.filter((ticket) =>
    ["dormant", "stalled"].includes(idleLevel(ticket.ranking.daysIdle)),
  ).length;

  const pipelineStatuses = TICKET_STATUSES.filter((status) => status !== "Closed");
  const pipelineTickets = allTickets.filter((ticket) => ticket.status !== "Closed");
  const statusCounts = Object.fromEntries(
    pipelineStatuses.map((status) => [
      status,
      pipelineTickets.filter((ticket) => ticket.status === status).length,
    ]),
  ) as Record<(typeof pipelineStatuses)[number], number>;

  const submittedThisWeek = allTickets.filter(
    (ticket) => new Date(ticket.created_at).getTime() >= Date.now() - WEEK_MS,
  ).length;

  const closedDurations = allTickets
    .filter((ticket) => ticket.closed_at)
    .map(
      (ticket) =>
        new Date(ticket.closed_at!).getTime() -
        new Date(ticket.created_at).getTime(),
    )
    .filter((ms) => ms >= 0);
  const averageClosingMs =
    closedDurations.length > 0
      ? closedDurations.reduce((sum, ms) => sum + ms, 0) / closedDurations.length
      : null;

  const recentReports = openTickets
    .filter((ticket) => ticket.status === "Submitted")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Site overview"
        title={`Welcome${profile?.name ? `, ${profile.name}` : ""}`}
        description="Review and act on safety reports for your site."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <NavCard
          href="/supervisor/open?sort=priority"
          value={needsTriage}
          title="Needs triage"
          description="Critical and high AI ranking — work these first."
          accent="bg-rose-600"
          tone="text-rose-700 dark:text-rose-300"
        />
        <NavCard
          href="/supervisor/open?sort=time"
          value={openTickets.length}
          title="Open issues"
          description="Everything still awaiting a resolution."
          accent="bg-amber-400"
        />
        <NavCard
          href="/supervisor/all"
          value={allTickets.length}
          title="All issues"
          description="Full report history with filters."
          accent="bg-statera-orange"
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Pipeline"
            description="Where reports currently sit."
          />
          <div className="px-4 py-4">
            {pipelineTickets.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No reports in the pipeline.
              </p>
            ) : (
              <>
                <div className="flex h-3 overflow-hidden rounded-full bg-inset">
                  {pipelineStatuses.map((status) =>
                    statusCounts[status] > 0 ? (
                      <div
                        key={status}
                        className={statusVisual(status).fill}
                        style={{
                          width: `${(statusCounts[status] / pipelineTickets.length) * 100}%`,
                        }}
                        title={`${status}: ${statusCounts[status]}`}
                      />
                    ) : null,
                  )}
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-4">
                  {pipelineStatuses.map((status) => (
                    <div
                      key={status}
                      className="flex items-baseline justify-between gap-2 border-b border-hairline pb-2"
                    >
                      <dt className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${statusVisual(status).dot}`}
                          aria-hidden
                        />
                        {status}
                      </dt>
                      <dd className="font-display text-base leading-none tabular-nums text-zinc-900 dark:text-zinc-100">
                        {statusCounts[status]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
          <StatTile
            label="New this week"
            value={submittedThisWeek}
            accent="bg-sky-500"
          />
          <StatTile
            label="Avg. to close"
            value={formatDuration(averageClosingMs)}
            accent="bg-emerald-500"
          />
          <StatTile
            label="Unassigned"
            value={unassigned}
            hint="No supervisor yet"
            accent="bg-violet-500"
          />
          <StatTile
            label="Gone quiet"
            value={goneQuiet}
            hint="Idle over 7 days"
            accent="bg-orange-500"
            tone={
              goneQuiet > 0
                ? "text-orange-700 dark:text-orange-300"
                : undefined
            }
          />
        </div>
      </div>

      <Section
        title="Awaiting triage"
        description="The newest reports nobody has picked up yet."
        className="mt-8"
      >
        <TicketList
          tickets={recentReports}
          emptyMessage="Every report has been picked up."
        />
      </Section>
    </main>
  );
}
