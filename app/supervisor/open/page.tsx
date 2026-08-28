import { Suspense } from "react";
import { OpenIssueControls } from "@/components/dashboard/IssueSort";
import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";
import { parseIssueAssignment, parseIssueSort } from "@/lib/tickets/sort";
import { PRIORITY_ORDER, priorityVisual } from "@/lib/tickets/theme";

type OpenIssuesPageProps = {
  searchParams: Promise<{ sort?: string; assigned?: string }>;
};

export default async function OpenIssuesPage({ searchParams }: OpenIssuesPageProps) {
  const profile = await getUserProfile();
  const params = await searchParams;
  const sort = parseIssueSort(params.sort);
  const assigned = parseIssueAssignment(params.assigned);

  const tickets = profile
    ? await getSiteTicketsWithRanking(profile.site_id, { openOnly: true })
    : [];

  const assignmentCounts = {
    me: tickets.filter((ticket) => ticket.assigned_to === profile?.id).length,
    unassigned: tickets.filter((ticket) => ticket.assigned_to === null).length,
    all: tickets.length,
  };

  const visible = tickets.filter((ticket) => {
    if (assigned === "me") {
      return ticket.assigned_to === profile?.id;
    }
    if (assigned === "unassigned") {
      return ticket.assigned_to === null;
    }
    return true;
  });

  const ordered =
    sort === "priority"
      ? [...visible].sort((a, b) => b.ranking.score - a.ranking.score)
      : visible;

  const counts = PRIORITY_ORDER.map((label) => ({
    label,
    visual: priorityVisual(label),
    count: visible.filter((ticket) => ticket.ranking.label === label).length,
  }));

  const emptyMessage =
    assigned === "me"
      ? "None of the open issues are assigned to you."
      : assigned === "unassigned"
        ? "Every open issue has an assignee."
        : "No open issues right now.";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Open"
        title="Open issues"
        description="Everything that is not yet closed, including issues waiting on the worker. Rank by AI priority or by how recently it was reported."
        action={
          <span className="font-display text-3xl leading-none tabular-nums text-zinc-300 dark:text-zinc-600">
            {visible.length}
          </span>
        }
      />

      <div className="mb-5 flex flex-col gap-3">
        <Suspense
          fallback={
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading filters…
            </p>
          }
        >
          <OpenIssueControls assignmentCounts={assignmentCounts} />
        </Suspense>

        {visible.length > 0 ? (
          <div className="flex flex-wrap gap-2">
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
      </div>

      <TicketList
        tickets={ordered}
        ranked={sort === "priority"}
        emptyMessage={emptyMessage}
      />
    </main>
  );
}
