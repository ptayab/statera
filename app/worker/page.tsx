import Link from "next/link";
import { getUserProfile } from "@/lib/auth/session";

export default async function WorkerHomePage() {
  const profile = await getUserProfile();

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{profile?.name ? `, ${profile.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Report safety concerns and track your submitted tickets.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/worker/submit"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-sm font-medium">new tickets</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Submit a new safety report for your site.
          </p>
        </Link>

        <Link
          href="/worker/tickets"
          className="rounded-xl border border-zinc-200 p-5 transition hover:border-statera-orange/40 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
        >
          <p className="text-sm font-medium">my tickets</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Check status, chat with supervisors, and close resolved issues.
          </p>
        </Link>
      </div>
    </main>
  );
}
