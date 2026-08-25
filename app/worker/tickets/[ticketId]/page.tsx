import Link from "next/link";
import { notFound } from "next/navigation";
import { addWorkerTicketMessage } from "@/app/worker/actions";
import { TicketChat } from "@/components/dashboard/TicketChat";
import { WorkerTicketActions } from "@/components/dashboard/WorkerTicketActions";
import { StatusChip } from "@/components/ui/Chip";
import { Eyebrow, Panel, PanelHeader } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { formatFullDateTime, shortId } from "@/lib/tickets/format";
import { markTicketSeen } from "@/lib/tickets/notifications";
import { getWorkerTicketDetail } from "@/lib/tickets/queries";

type WorkerTicketDetailPageProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function WorkerTicketDetailPage({
  params,
}: WorkerTicketDetailPageProps) {
  const { ticketId } = await params;
  const profile = await getUserProfile();

  if (!profile || profile.role !== "worker") {
    notFound();
  }

  const ticket = await getWorkerTicketDetail(ticketId, profile.id);

  if (!ticket) {
    notFound();
  }

  await markTicketSeen(ticket.id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <Link
          href="/worker/tickets"
          className="text-xs text-zinc-500 transition hover:text-statera-orange dark:text-zinc-400"
        >
          ← Back to my tickets
        </Link>

        <div className="mt-3">
          <Eyebrow>Report {shortId(ticket.id)}</Eyebrow>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {ticket.category}
          </h1>
        </div>

        <div className="mt-3">
          <StatusChip status={ticket.status} />
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <Panel>
          <PanelHeader title="What you reported" />
          <div className="px-4 py-4">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100">
              {ticket.description}
            </p>
          </div>

          <dl className="space-y-2.5 border-t border-hairline px-4 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-hairline pb-2.5">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                Assignee
              </dt>
              <dd className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {ticket.assignee_name ?? "Unassigned"}
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                Submitted
              </dt>
              <dd className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {formatFullDateTime(ticket.created_at)}
              </dd>
            </div>
          </dl>

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

        <WorkerTicketActions ticketId={ticket.id} status={ticket.status} />

        <TicketChat
          ticketId={ticket.id}
          events={ticket.events}
          currentUserId={profile.id}
          canSend={ticket.status !== "Closed"}
          disabledReason={
            ticket.status === "Closed" ? "This ticket is closed." : undefined
          }
          sendMessage={addWorkerTicketMessage}
        />
      </div>
    </main>
  );
}
