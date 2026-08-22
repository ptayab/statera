import { Suspense } from "react";
import { OpenIssueViews, isOpenIssueView } from "@/components/dashboard/OpenIssueViews";
import { TicketFilters } from "@/components/dashboard/TicketFilters";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

type OpenIssuesPageProps = {
  searchParams: Promise<{ view?: string; category?: string }>;
};

const EMPTY_MESSAGES = {
  all: "No open issues match these filters yet.",
  unassigned: "No unassigned open issues match these filters yet.",
  mine: "No open issues assigned to you match these filters yet.",
} as const;

const VIEW_DESCRIPTIONS = {
  all: "Tickets that are not yet resolved or closed.",
  unassigned: "Open tickets that still need an assignee.",
  mine: "Open tickets currently assigned to you.",
} as const;

export default async function OpenIssuesPage({ searchParams }: OpenIssuesPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;
  const view = isOpenIssueView(params.view) ? params.view : "mine";
  const category = params.category;

  const tickets = profile
    ? await getSiteTickets(profile.site_id, {
        openOnly: true,
        category,
      })
    : [];

  const unassignedTickets = tickets.filter((ticket) => !ticket.assigned_to);
  const assignedToMeTickets = profile
    ? tickets.filter((ticket) => ticket.assigned_to === profile.id)
    : [];

  const visibleTickets =
    view === "unassigned"
      ? unassignedTickets
      : view === "mine"
        ? assignedToMeTickets
        : tickets;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Open issues</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {VIEW_DESCRIPTIONS[view]}
        </p>
      </header>

      <div className="mb-6 space-y-4">
        <OpenIssueViews
          currentView={view}
          category={category}
          counts={{
            all: tickets.length,
            unassigned: unassignedTickets.length,
            mine: assignedToMeTickets.length,
          }}
        />

        <Suspense fallback={<p className="text-sm text-zinc-500">Loading filters…</p>}>
          <TicketFilters basePath="/supervisor/open" showStatus={false} />
        </Suspense>
      </div>

      <TicketList tickets={visibleTickets} emptyMessage={EMPTY_MESSAGES[view]} />
    </main>
  );
}
