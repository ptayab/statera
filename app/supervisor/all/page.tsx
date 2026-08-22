import { Suspense } from "react";
import { AllIssueViews, isAllIssueView } from "@/components/dashboard/AllIssueViews";
import { TicketFilters } from "@/components/dashboard/TicketFilters";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

type AllIssuesPageProps = {
  searchParams: Promise<{ view?: string; category?: string }>;
};

const EMPTY_MESSAGES = {
  all: "No issues match these filters yet.",
  closed: "No closed issues match these filters yet.",
} as const;

const VIEW_DESCRIPTIONS = {
  all: "Every open and closed ticket at your site.",
  closed: "Tickets that have been closed at your site.",
} as const;

export default async function AllIssuesPage({ searchParams }: AllIssuesPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;
  const view = isAllIssueView(params.view) ? params.view : "all";
  const category = params.category;

  const allTickets = profile
    ? await getSiteTickets(profile.site_id, { category })
    : [];
  const closedTickets = allTickets.filter((ticket) => ticket.status === "Closed");

  const visibleTickets = view === "closed" ? closedTickets : allTickets;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">All issues</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {VIEW_DESCRIPTIONS[view]}
        </p>
      </header>

      <div className="mb-6 space-y-4">
        <AllIssueViews
          currentView={view}
          category={category}
          counts={{
            all: allTickets.length,
            closed: closedTickets.length,
          }}
        />

        <Suspense fallback={<p className="text-sm text-zinc-500">Loading filters…</p>}>
          <TicketFilters basePath="/supervisor/all" showStatus={false} />
        </Suspense>
      </div>

      <TicketList tickets={visibleTickets} emptyMessage={EMPTY_MESSAGES[view]} />
    </main>
  );
}
