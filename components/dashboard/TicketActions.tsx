"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignTicketToSelf,
  changeTicketStatus,
  unassignTicket,
} from "@/app/supervisor/actions";
import type { TicketStatus } from "@/lib/supabase/types";
import { TICKET_STATUSES } from "@/lib/tickets/status";

/** Supervisor-managed statuses — Closed is reserved for the worker. */
const SUPERVISOR_STATUS_OPTIONS = TICKET_STATUSES.filter(
  (status) => status !== "Submitted" && status !== "Closed",
);

type TicketActionsProps = {
  ticketId: string;
  currentStatus: TicketStatus;
  assignedTo: string | null;
  currentUserId: string;
};

export function TicketActions({
  ticketId,
  currentStatus,
  assignedTo,
  currentUserId,
}: TicketActionsProps) {
  const router = useRouter();
  const initialStatus =
    currentStatus === "Submitted" ? "In Review" : currentStatus;
  const [status, setStatus] = useState<TicketStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const assignedToMe = assignedTo === currentUserId;
  const isUnassigned = assignedTo === null;
  const assignedToOther = assignedTo !== null && !assignedToMe;

  function runAction(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setMessage("Saved.");
      router.refresh();
    });
  }

  if (assignedToOther) {
    return (
      <div className="space-y-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Actions
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This ticket is assigned to another supervisor. You can view it and the
          conversation, but only the assignee can update status or reply.
        </p>
      </div>
    );
  }

  if (currentStatus === "Closed") {
    return (
      <div className="space-y-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Actions
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This ticket was closed by the worker. Status can no longer be changed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Actions
      </h2>

      {isUnassigned ? (
        <div className="space-y-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => assignTicketToSelf(ticketId))}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Assign to me
          </button>
          <p className="text-xs text-zinc-500">
            Claiming a ticket moves it from Submitted to In Review and lets you
            update status and reply in the conversation.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Assigned to you
            </p>
            <label htmlFor="status" className="text-sm font-medium">
              Change status
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                id="status"
                value={status}
                disabled={isPending}
                onChange={(event) =>
                  setStatus(event.target.value as TicketStatus)
                }
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
              >
                {SUPERVISOR_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={isPending || status === currentStatus}
                onClick={() =>
                  runAction(() => changeTicketStatus(ticketId, status))
                }
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Update status
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Mark Resolved when the fix is done — the worker closes the ticket.
              Status changes appear in the conversation. To return a ticket to
              Submitted, unassign it below.
            </p>
          </div>

          <div className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(() => unassignTicket(ticketId))}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Unassign
            </button>
            <p className="text-xs text-zinc-500">
              Releases the ticket back to Submitted so another supervisor can
              claim it.
            </p>
          </div>
        </>
      )}

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
      ) : null}
    </div>
  );
}
