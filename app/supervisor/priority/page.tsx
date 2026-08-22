import { RankedTicketList } from "@/components/dashboard/RankedTicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsRanked } from "@/lib/tickets/queries";
import { PRIORITY_ORDER, priorityVisual } from "@/lib/tickets/theme";

export default async function PriorityIssuesPage() {
  const profile = await getUserProfile();

  const tickets = profile ? await getSiteTicketsRanked(profile.site_id) : [];

  const counts = PRIORITY_ORDER.map((label) => ({
    label,
    visual: priorityVisual(label),
    count: tickets.filter((ticket) => ticket.ranking.label === label).length,
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Priority queue"
        title="Work top to bottom"
        description="Open issues ordered by AI ranking — category, age, idle time, similar reports, wording, and the reporter’s own ranking as a multiplier. User ranking is shown separately on each issue."
      />

      {tickets.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {counts.map(({ label, visual, count }) => (
            <div
              key={label}
              className={`flex items-baseline gap-2 rounded-lg px-3 py-2 ring-1 ring-inset ${visual.chip}`}
            >
              <span className="font-display text-xl leading-none tabular-nums">
                {count}
              </span>
              <span className="font-display text-[11px] uppercase tracking-[0.14em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <RankedTicketList tickets={tickets} />
    </main>
  );
}
