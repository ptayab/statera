import Link from "next/link";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTickets } from "@/lib/tickets/queries";

export default async function SupervisorHomePage() {
  const profile = await getUserProfile();

  const openTickets = profile
    ? await getSiteTickets(profile.site_id, { openOnly: true })
    : [];
  const allTickets = profile ? await getSiteTickets(profile.site_id) : [];

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Supervisor dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Review and act on safety reports for your site.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/supervisor/open"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tabular-nums">{openTickets.length}</p>
          <p className="mt-1 text-sm font-medium">Open issues</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tickets that still need attention.
          </p>
        </Link>

        <Link
          href="/supervisor/all"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tabular-nums">{allTickets.length}</p>
          <p className="mt-1 text-sm font-medium">All issues</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Full ticket history with filters.
          </p>
        </Link>
      </div>
    </main>
  );
}
