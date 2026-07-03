import { Suspense } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { TicketFilters } from "@/components/dashboard/TicketFilters";
import { TicketList } from "@/components/dashboard/TicketList";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

type DashboardPageProps = {
  searchParams: Promise<{ status?: string; category?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Supervisor dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as {profile?.name ?? profile?.email}
          </p>
        </div>
        <LogoutButton />
      </header>

      <div className="mb-6">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading filters…</p>}>
          <TicketFilters />
        </Suspense>
      </div>

      <TicketList tickets={tickets} />
    </main>
  );
}
