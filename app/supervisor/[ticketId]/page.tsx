import Link from "next/link";
import { notFound } from "next/navigation";
import { addTicketMessage } from "@/app/supervisor/actions";
import { AiRankingPanel } from "@/components/dashboard/AiRankingPanel";
import { ClosedIssueSummary } from "@/components/dashboard/ClosedIssueSummary";
import { SupervisorReminders } from "@/components/dashboard/SupervisorReminders";
import { TicketActions } from "@/components/dashboard/TicketActions";
import { TicketChat } from "@/components/dashboard/TicketChat";
import { CategoryGuidance } from "@/components/tickets/CategoryGuidance";
import { IdleChip, PriorityChip, StatusChip, UserRankingChip } from "@/components/ui/Chip";
import { Eyebrow, Panel, PanelHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getCategoryMeta } from "@/lib/tickets/categories";
import { formatFullDateTime, shortId } from "@/lib/tickets/format";
import { buildClosedIssueHistory } from "@/lib/tickets/history";
import { markTicketSeen } from "@/lib/tickets/notifications";
import { getTicketDetail } from "@/lib/tickets/queries";

type TicketDetailPageProps = {
  params: Promise<{ ticketId: string }>;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-hairline pb-2.5 last:border-0 last:pb-0">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { ticketId } = await params;
  const profile = await getUserProfile();

  if (!profile || profile.role !== "supervisor") {
    notFound();
  }

  const ticket = await getTicketDetail(ticketId, profile.site_id);

  if (!ticket) {
    notFound();
  }

  await markTicketSeen(ticket.id);

  const assignedToMe = ticket.assigned_to === profile.id;
  const isClosed = ticket.status === "Closed";
  const canSend = assignedToMe && !isClosed;
  const disabledReason = isClosed
    ? "This ticket is closed."
    : ticket.assigned_to
      ? assignedToMe
        ? null
        : "Only the assigned supervisor can reply in this conversation."
      : "Assign this ticket to yourself to reply.";
  const closedHistory = isClosed
    ? buildClosedIssueHistory(
        ticket,
        ticket.events,
        ticket.duplicate_count,
        ticket.ai_analysis?.descriptionPts,
      )
    : null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <Link
          href="/supervisor/open"
          className="text-xs text-zinc-500 transition hover:text-statera-orange dark:text-zinc-400"
        >
          ← Back to open issues
        </Link>

        <div className="mt-3">
          <Eyebrow>Issue {shortId(ticket.id)}</Eyebrow>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {ticket.category}
          </h1>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {isClosed ? null : <PriorityChip label={ticket.ranking.label} />}
          <UserRankingChip urgency={ticket.urgency} />
          <StatusChip status={ticket.status} />
          {isClosed ? null : <IdleChip daysIdle={ticket.ranking.daysIdle} />}
        </div>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="flex flex-col gap-4">
          {getCategoryMeta(ticket.category)?.warnSupervisor ? (
            <CategoryGuidance category={ticket.category} />
          ) : null}

          <Panel>
            <PanelHeader title="Report" />
            <div className="px-4 py-4">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100">
                {ticket.description}
              </p>
            </div>

            {ticket.photo_signed_url ? (
              <div className="border-t border-hairline bg-inset p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.photo_signed_url}
                  alt="Photo attached to this report"
                  className="h-auto w-full rounded-lg object-contain"
                />
              </div>
            ) : null}
          </Panel>

          <TicketChat
            ticketId={ticket.id}
            events={ticket.events}
            currentUserId={profile.id}
            canSend={canSend}
            disabledReason={disabledReason}
            sendMessage={addTicketMessage}
          />

          <SupervisorReminders />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          {isClosed ? (
            <ClosedIssueSummary
              history={
                closedHistory ?? {
                  openedAt: ticket.created_at,
                  closedAt: ticket.closed_at ?? ticket.created_at,
                  rankings: [
                    {
                      label: ticket.ranking.label,
                      score: ticket.ranking.score,
                      from: ticket.created_at,
                      to: ticket.closed_at ?? ticket.created_at,
                    },
                  ],
                  dormancy: [],
                }
              }
            />
          ) : (
            <AiRankingPanel
              ranking={ticket.ranking}
              urgency={ticket.urgency}
              category={ticket.category}
              createdAt={ticket.created_at}
              lastEventAt={ticket.last_event_at}
              duplicateCount={ticket.duplicate_count}
              analysis={ticket.ai_analysis}
            />
          )}

          <Panel>
            <PanelHeader title="Details" />
            <dl className="space-y-2.5 px-4 py-4">
              <DetailRow label="Reported by" value={ticket.reporter_name} />
              {isClosed ? null : (
                <DetailRow label="AI ranking" value={ticket.ranking.label} />
              )}
              <DetailRow label="User ranking" value={ticket.urgency} />
              <DetailRow
                label="Assignee"
                value={ticket.assignee_name ?? "Unassigned"}
              />
              <DetailRow
                label="Submitted"
                value={formatFullDateTime(ticket.created_at)}
              />
              {ticket.closed_at ? (
                <DetailRow
                  label="Closed"
                  value={formatFullDateTime(ticket.closed_at)}
                />
              ) : null}
            </dl>
          </Panel>

          <TicketActions
            key={`${ticket.status}-${ticket.assigned_to ?? "none"}`}
            ticketId={ticket.id}
            currentStatus={ticket.status}
            assignedTo={ticket.assigned_to}
            currentUserId={profile.id}
          />
        </aside>
      </div>
    </main>
  );
}
