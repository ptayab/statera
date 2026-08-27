"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignTicketToSelf,
  changeTicketStatus,
  unassignTicket,
} from "@/app/supervisor/actions";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  FIELD,
  HELP_TEXT,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/controls";
import type { TicketStatus } from "@/lib/supabase/types";
import {
  SUPERVISOR_STATUS_OPTIONS,
  type SupervisorStatus,
} from "@/lib/tickets/status";

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
      <Panel>
        <PanelHeader title="Actions" />
        <p className={`px-4 py-4 ${HELP_TEXT}`}>
          This ticket is assigned to another supervisor. You can view it and the
          conversation, but only the assignee can update status or reply.
        </p>
      </Panel>
    );
  }

  if (currentStatus === "Closed") {
    return (
      <Panel>
        <PanelHeader title="Actions" />
        <p className={`px-4 py-4 ${HELP_TEXT}`}>
          This ticket was closed by the worker. Status can no longer be changed.
        </p>
      </Panel>
    );
  }

  return (
    <Panel accent="bg-statera-orange">
      <PanelHeader title="Actions" />

      <div className="space-y-4 px-4 py-4">
        {isUnassigned ? (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(() => assignTicketToSelf(ticketId))}
              className={`w-full ${PRIMARY_BUTTON}`}
            >
              Assign to me
            </button>
            <p className={HELP_TEXT}>
              Claiming a ticket moves it from Submitted to In Review and lets you
              update status and reply in the conversation.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400"
              >
                Change status
              </label>
              <select
                id="status"
                value={status}
                disabled={isPending}
                onChange={(event) =>
                  setStatus(event.target.value as SupervisorStatus)
                }
                className={FIELD}
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
                className={`w-full ${PRIMARY_BUTTON}`}
              >
                Update status
              </button>
              <p className={HELP_TEXT}>
                Mark Resolved when the fix is done — the worker closes the
                ticket. Status changes appear in the conversation.
              </p>
            </div>

            <div className="space-y-2 border-t border-hairline pt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => runAction(() => unassignTicket(ticketId))}
                className={`w-full ${SECONDARY_BUTTON}`}
              >
                Unassign
              </button>
              <p className={HELP_TEXT}>
                Releases the ticket back to Submitted so another supervisor can
                claim it.
              </p>
            </div>
          </>
        )}

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
