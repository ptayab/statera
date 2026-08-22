import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getUserTickets } from "@/lib/tickets/queries";

export default async function MyTicketsPage() {
  const profile = await getUserProfile();

  const tickets = profile ? await getUserTickets(profile.id) : [];

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">My tickets</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Reports you have submitted — open one to chat and track status.
        </p>
      </header>

      <TicketList
        tickets={tickets}
        showReporter={false}
        emptyMessage="You have not submitted any tickets yet."
        detailHref={(ticketId) => `/worker/tickets/${ticketId}`}
      />
    </main>
  );
}
