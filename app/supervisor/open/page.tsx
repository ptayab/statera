import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";

export default async function OpenIssuesPage() {
  const profile = await getUserProfile();

  const tickets = profile
    ? await getSiteTicketsWithRanking(profile.site_id, { openOnly: true })
    : [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Open"
        title="Open issues"
        description="Newest first. Everything that is not yet resolved or closed."
        action={
          <span className="font-display text-3xl leading-none tabular-nums text-zinc-300 dark:text-zinc-600">
            {tickets.length}
          </span>
        }
      />

      <TicketList tickets={tickets} emptyMessage="No open issues right now." />
    </main>
  );
}
