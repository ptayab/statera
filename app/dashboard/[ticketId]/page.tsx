import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { TicketActions } from "@/components/dashboard/TicketActions";
import { TicketHistory } from "@/components/dashboard/TicketHistory";
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

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Ticket detail</h1>
        </div>
        <LogoutButton />
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
                Reported by:{" "}
              </dt>
              <dd className="inline">{ticket.reporter_name}</dd>
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
          key={ticket.status}
          ticketId={ticket.id}
          currentStatus={ticket.status}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">History</h2>
          <TicketHistory events={ticket.events} />
        </section>
      </div>
    </main>
  );
}
