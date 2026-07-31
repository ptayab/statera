"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { closeWorkerTicket } from "@/app/worker/actions";

type WorkerTicketActionsProps = {
  ticketId: string;
  status: string;
};

export function WorkerTicketActions({
  ticketId,
  status,
}: WorkerTicketActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (status === "Closed") {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This ticket is closed. You can still read the conversation below.
        </p>
      </div>
    );
  }

  if (status !== "Resolved") {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          When a supervisor marks this ticket Resolved, you can close it here
          to confirm the issue is done.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Ready to close
      </h2>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        A supervisor marked this issue Resolved. Close it if you agree the fix
        is complete.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          setMessage(null);
          startTransition(async () => {
            const result = await closeWorkerTicket(ticketId);
            if (!result.ok) {
              setError(result.error ?? "Could not close ticket.");
              return;
            }
            setMessage("Ticket closed.");
            router.refresh();
          });
        }}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Close ticket
      </button>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}
    </div>
  );
}
