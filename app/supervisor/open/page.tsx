import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

export default async function OpenIssuesPage() {
  const profile = await getUserProfile();

  const tickets = profile
    ? await getSiteTickets(profile.site_id, { openOnly: true })
    : [];

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Open issues</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Tickets that are not yet resolved or closed.
        </p>
      </header>

      <TicketList tickets={tickets} emptyMessage="No open issues right now." showRanking />
    </main>
  );
}
