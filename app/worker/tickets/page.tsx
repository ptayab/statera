import { Suspense } from "react";
import { WorkerTicketFilters } from "@/components/dashboard/IssueSort";
import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getUserTickets } from "@/lib/tickets/queries";
import { parseWorkerTicketView } from "@/lib/tickets/sort";

type MyTicketsPageProps = {
  searchParams: Promise<{ view?: string }>;
};

export default async function MyTicketsPage({ searchParams }: MyTicketsPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;
  const view = parseWorkerTicketView(params.view);

  const tickets = profile ? await getUserTickets(profile.id) : [];
  const openTickets = tickets.filter((ticket) => ticket.status !== "Closed");
  const closedTickets = tickets.filter((ticket) => ticket.status === "Closed");
  const visible = view === "closed" ? closedTickets : openTickets;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="My reports"
        title="My tickets"
        description="Reports you have submitted — open one to chat and track status."
      />

      <div className="mb-5">
        <Suspense
          fallback={
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading filters…
            </p>
          }
        >
          <WorkerTicketFilters
            counts={{ open: openTickets.length, closed: closedTickets.length }}
          />
        </Suspense>
      </div>

      <TicketList
        tickets={visible}
        emptyMessage={
          view === "closed"
            ? "You have not closed any reports yet."
            : "You have no open reports."
        }
        detailHref={(ticketId) => `/worker/tickets/${ticketId}`}
      />
    </main>
  );
}
