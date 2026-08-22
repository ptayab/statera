import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketActions } from "@/components/dashboard/TicketActions";
import { TicketChat } from "@/components/dashboard/TicketChat";
import { addTicketMessage } from "@/app/supervisor/actions";
import { getUserProfile } from "@/lib/auth/session";
import { getTicketDetail } from "@/lib/tickets/queries";
import { statusBadgeClass } from "@/lib/tickets/status";

type TicketDetailPageProps = {
  params: Promise<{ ticketId: string }>;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
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

  const assignedToMe = ticket.assigned_to === profile.id;
  const canSend = assignedToMe && ticket.status !== "Closed";
  const disabledReason =
    ticket.status === "Closed"
      ? "This ticket is closed."
      : ticket.assigned_to
        ? assignedToMe
          ? null
          : "Only the assigned supervisor can reply in this conversation."
        : "Assign this ticket to yourself to reply.";

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <Link
          href="/supervisor/all"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to all issues
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Ticket detail</h1>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <section className="space-y-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <span className="text-sm text-zinc-500">{ticket.category}</span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

          <dl className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              <dt className="inline font-medium text-zinc-900 dark:text-zinc-100">
                Worker urgency:{" "}
              </dt>
              <dd className="inline">{ticket.urgency}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-zinc-900 dark:text-zinc-100">
                Reported by:{" "}
              </dt>
              <dd className="inline">{ticket.reporter_name}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-zinc-900 dark:text-zinc-100">
                Assignee:{" "}
              </dt>
              <dd className="inline">{ticket.assignee_name ?? "Unassigned"}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-zinc-900 dark:text-zinc-100">
                Submitted:{" "}
              </dt>
              <dd className="inline">{formatWhen(ticket.created_at)}</dd>
            </div>
          </dl>

          {ticket.photo_signed_url ? (
            <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.photo_signed_url}
                alt="Ticket photo"
                className="h-auto w-full object-contain"
              />
            </div>
          ) : null}
        </section>

        <TicketActions
          key={`${ticket.status}-${ticket.assigned_to ?? "none"}`}
          ticketId={ticket.id}
          currentStatus={ticket.status}
          assignedTo={ticket.assigned_to}
          currentUserId={profile.id}
        />

        <TicketChat
          ticketId={ticket.id}
          events={ticket.events}
          currentUserId={profile.id}
          canSend={canSend}
          disabledReason={disabledReason}
          sendMessage={addTicketMessage}
        />
      </div>
    </main>
  );
}
