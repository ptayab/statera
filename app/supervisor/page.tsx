import Link from "next/link";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";
import { TICKET_STATUSES } from "@/lib/tickets/status";

export default async function SupervisorHomePage() {
  const profile = await getUserProfile();

  const openTickets = profile
    ? await getSiteTickets(profile.site_id, { openOnly: true })
    : [];
  const allTickets = profile ? await getSiteTickets(profile.site_id) : [];
  const recentReports = allTickets
    .filter((ticket) => ticket.status === "Submitted")
    .slice(0, 5);

  const statusCounts = Object.fromEntries(
    TICKET_STATUSES.map((status) => [
      status,
      allTickets.filter((ticket) => ticket.status === status).length,
    ]),
  ) as Record<(typeof TICKET_STATUSES)[number], number>;

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const submittedThisWeek = allTickets.filter(
    (ticket) => new Date(ticket.created_at).getTime() >= weekAgo,
  ).length;

  const closedDurations = allTickets
    .filter((ticket) => ticket.closed_at)
    .map(
      (ticket) =>
        new Date(ticket.closed_at!).getTime() - new Date(ticket.created_at).getTime(),
    )
    .filter((ms) => ms >= 0);
  const averageClosingMs =
    closedDurations.length > 0
      ? closedDurations.reduce((sum, ms) => sum + ms, 0) / closedDurations.length
      : null;
  const averageClosingLabel =
    averageClosingMs == null
      ? "—"
      : averageClosingMs < 60 * 60 * 1000
        ? `${Math.round(averageClosingMs / (60 * 1000))}m`
        : averageClosingMs < 48 * 60 * 60 * 1000
          ? `${(averageClosingMs / (60 * 60 * 1000)).toFixed(1)}h`
          : `${(averageClosingMs / (24 * 60 * 60 * 1000)).toFixed(1)}d`;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{profile?.name ? `, ${profile.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Review and act on safety reports for your site.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/supervisor/priority"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tabular-nums">{openTickets.length}</p>
          <p className="mt-1 text-sm font-medium">Priority</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            AI-ranked triage — highest risk first.
          </p>
        </Link>

        <Link
          href="/supervisor/open"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tabular-nums">{openTickets.length}</p>
          <p className="mt-1 text-sm font-medium">Open issues</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tickets that still need attention.
          </p>
        </Link>

        <Link
          href="/supervisor/all"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tabular-nums">{allTickets.length}</p>
          <p className="mt-1 text-sm font-medium">All issues</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Full ticket history with filters.
          </p>
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Statistics</h2>
        <p className="mt-1 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          A quick look at ticket volume for your site.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-2xl font-semibold tabular-nums">{submittedThisWeek}</p>
            <p className="mt-1 text-xs text-zinc-500">This week</p>
          </div>
          <div className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-2xl font-semibold tabular-nums">{averageClosingLabel}</p>
            <p className="mt-1 text-xs text-zinc-500">Avg. closing time</p>
          </div>
          {TICKET_STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <p className="text-2xl font-semibold tabular-nums">
                {statusCounts[status]}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Recent reports</h2>
        <p className="mt-1 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          The five latest submitted reports for your site.
        </p>
        <TicketList
          tickets={recentReports}
          emptyMessage="No submitted reports right now."
        />
      </section>
    </main>
  );
}
