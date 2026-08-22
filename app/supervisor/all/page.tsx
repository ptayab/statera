import { Suspense } from "react";
import { TicketFilters } from "@/components/dashboard/TicketFilters";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

type AllIssuesPageProps = {
  searchParams: Promise<{ status?: string; category?: string }>;
};

export default async function AllIssuesPage({ searchParams }: AllIssuesPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;

  const tickets = profile
    ? await getSiteTickets(profile.site_id, {
        status: params.status,
        category: params.category,
      })
    : [];

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">All issues</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Every ticket at your site, with optional filters.
        </p>
      </header>

      <div className="mb-6">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading filters…</p>}>
          <TicketFilters basePath="/supervisor/all" />
        </Suspense>
      </div>

      <TicketList tickets={tickets} showRanking />
    </main>
  );
}
