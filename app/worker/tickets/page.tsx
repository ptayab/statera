import { MyTicketViews, isMyTicketView } from "@/components/dashboard/MyTicketViews";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import type { TicketStatus } from "@/lib/supabase/types";
import { getUserTickets } from "@/lib/tickets/queries";

const OPEN_STATUSES = new Set<TicketStatus>([
  "Submitted",
  "In Review",
  "In Progress",
]);

type MyTicketsPageProps = {
  searchParams: Promise<{ view?: string }>;
};

const EMPTY_MESSAGES = {
  open: "You have no open tickets right now.",
  closed: "You have no closed tickets yet.",
} as const;

const VIEW_DESCRIPTIONS = {
  open: "Tickets that are still being handled.",
  closed: "Tickets that have been resolved or closed.",
} as const;

export default async function MyTicketsPage({ searchParams }: MyTicketsPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;
  const view = isMyTicketView(params.view) ? params.view : "open";

  const tickets = profile ? await getUserTickets(profile.id) : [];
  const openTickets = tickets.filter((ticket) => OPEN_STATUSES.has(ticket.status));
  const closedTickets = tickets.filter((ticket) => !OPEN_STATUSES.has(ticket.status));
  const visibleTickets = view === "closed" ? closedTickets : openTickets;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">My tickets</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {VIEW_DESCRIPTIONS[view]}
        </p>
      </header>

      <div className="mb-6">
        <MyTicketViews
          currentView={view}
          counts={{
            open: openTickets.length,
            closed: closedTickets.length,
          }}
        />
      </div>

      <TicketList
        tickets={visibleTickets}
        showReporter={false}
        emptyMessage={EMPTY_MESSAGES[view]}
        detailHref={() => ""}
      />
    </main>
  );
}
