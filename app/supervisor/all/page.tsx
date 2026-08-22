import { Suspense } from "react";
import { TicketFilters } from "@/components/dashboard/TicketFilters";
import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";

type AllIssuesPageProps = {
  searchParams: Promise<{ status?: string; category?: string }>;
};

export default async function AllIssuesPage({ searchParams }: AllIssuesPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;

  const tickets = profile
    ? await getSiteTicketsWithRanking(profile.site_id, {
        status: params.status,
        category: params.category,
      })
    : [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Archive"
        title="All issues"
        description="Every report at your site, newest first."
        action={
          <span className="font-display text-3xl leading-none tabular-nums text-zinc-300 dark:text-zinc-600">
            {tickets.length}
          </span>
        }
      />

      <div className="mb-5">
        <Suspense
          fallback={
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading filters…
            </p>
          }
        >
          <TicketFilters basePath="/supervisor/all" />
        </Suspense>
      </div>

      <TicketList tickets={tickets} />
    </main>
  );
}
