import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getUserTickets } from "@/lib/tickets/queries";

export default async function MyTicketsPage() {
  const profile = await getUserProfile();

  const tickets = profile ? await getUserTickets(profile.id) : [];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="My reports"
        title="My tickets"
        description="Reports you have submitted — open one to chat and track status."
      />

      <TicketList
        tickets={tickets}
        emptyMessage="You have not submitted any reports yet."
        detailHref={(ticketId) => `/worker/tickets/${ticketId}`}
      />
    </main>
  );
}
