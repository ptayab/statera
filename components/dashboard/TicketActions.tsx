"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addTicketNote,
  assignTicketToSelf,
  changeTicketStatus,
} from "@/app/supervisor/actions";
import type { TicketStatus } from "@/lib/supabase/types";
import { TICKET_STATUSES } from "@/lib/tickets/status";

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
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [note, setNote] = useState("");
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
      setNote("");
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
          This ticket is assigned to another supervisor. You can view it, but
          only the assignee can update status or add notes.
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
            update status and add notes.
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
                {TICKET_STATUSES.map((option) => (
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
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">
              Add note
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Short update for the audit trail…"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="button"
              disabled={isPending || note.trim().length === 0}
              onClick={() => runAction(() => addTicketNote(ticketId, note))}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Add note
            </button>
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
