"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { closeWorkerTicket } from "@/app/worker/actions";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { HELP_TEXT, PRIMARY_BUTTON } from "@/components/ui/controls";

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
      <Panel>
        <p className={`px-4 py-4 ${HELP_TEXT}`}>
          This ticket is closed. You can still read the conversation below.
        </p>
      </Panel>
    );
  }

  if (status !== "Resolved") {
    return (
      <Panel>
        <p className={`px-4 py-4 ${HELP_TEXT}`}>
          When a supervisor marks this ticket Resolved, you can close it here to
          confirm the issue is done.
        </p>
      </Panel>
    );
  }

  return (
    <Panel accent="bg-emerald-500">
      <PanelHeader title="Ready to close" />
      <div className="space-y-3 px-4 py-4">
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
          className={PRIMARY_BUTTON}
        >
          Close ticket
        </button>
        {error ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
