import { RankedTicketList } from "@/components/dashboard/RankedTicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsRanked } from "@/lib/tickets/queries";

export default async function PriorityIssuesPage() {
  const profile = await getUserProfile();

  const tickets = profile
    ? await getSiteTicketsRanked(profile.site_id)
    : [];

  const criticalCount = tickets.filter(
    (ticket) => ticket.ranking.label === "Critical",
  ).length;
  const highCount = tickets.filter(
    (ticket) => ticket.ranking.label === "High",
  ).length;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Priority</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Open issues ranked by AI score — highest risk first. Score factors in
          category, worker urgency, age, dormancy, similar reports, and
          description language.
        </p>
        {tickets.length > 0 ? (
          <p className="mt-3 text-xs text-zinc-500">
            {criticalCount} critical · {highCount} high · {tickets.length} open
            total
          </p>
        ) : null}
      </header>

      <RankedTicketList tickets={tickets} />
    </main>
  );
}
