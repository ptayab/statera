"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PanelHeader } from "@/components/ui/Panel";
import { FIELD, HELP_TEXT, PRIMARY_BUTTON } from "@/components/ui/controls";
import { formatDateTime } from "@/lib/tickets/format";
import type { TicketDetailEvent } from "@/lib/tickets/display";

type TicketChatProps = {
  ticketId: string;
  events: TicketDetailEvent[];
  currentUserId: string;
  canSend: boolean;
  disabledReason?: string | null;
  sendMessage: (
    ticketId: string,
    message: string,
  ) => Promise<{ ok: boolean; error?: string }>;
};

function roleLabel(role: string | null) {
  if (role === "supervisor") return "Supervisor";
  if (role === "worker") return "Worker";
  return "User";
}

export function TicketChat({
  ticketId,
  events,
  currentUserId,
  canSend,
  disabledReason,
  sendMessage,
}: TicketChatProps) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events.length]);

  function handleSend() {
    const text = draft.trim();
    if (!text || isPending || !canSend) return;

    setError(null);
    startTransition(async () => {
      const result = await sendMessage(ticketId, text);
      if (!result.ok) {
        setError(result.error ?? "Could not send message.");
        return;
      }
      setDraft("");
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl bg-panel ring-1 ring-hairline shadow-[0_1px_2px_rgba(24,24,27,0.05)]">
      <PanelHeader
        title="Conversation"
        description="Messages and status updates for this issue."
      />

      <div className="flex max-h-[28rem] min-h-[16rem] flex-col gap-3 overflow-y-auto bg-inset px-3 py-4">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No messages yet. Say hello to start the conversation.
          </p>
        ) : (
          events.map((event) => {
            if (event.formatted.kind === "system") {
              return (
                <div key={event.id} className="flex justify-center px-2">
                  <div className="max-w-[90%] rounded-full bg-panel px-3 py-1.5 text-center ring-1 ring-hairline">
                    <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-200">
                      {event.formatted.title}
                      {event.formatted.detail
                        ? ` · ${event.formatted.detail}`
                        : ""}
                    </p>
                    <time
                      className="mt-0.5 block text-[10px] text-zinc-400 dark:text-zinc-500"
                      dateTime={event.created_at}
                    >
                      {formatDateTime(event.created_at)}
                    </time>
                  </div>
                </div>
              );
            }

            const mine = event.actor === currentUserId;
            return (
              <div
                key={event.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                    mine
                      ? "rounded-br-md bg-statera-dark text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "rounded-bl-md bg-panel text-zinc-900 ring-1 ring-hairline dark:text-zinc-100"
                  }`}
                >
                  <p
                    className={`text-[11px] font-medium ${
                      mine
                        ? "text-zinc-400 dark:text-zinc-600"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {mine
                      ? "You"
                      : (event.actor_name ?? roleLabel(event.actor_role))}
                    {!mine && event.actor_role
                      ? ` · ${roleLabel(event.actor_role)}`
                      : ""}
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed">
                    {event.formatted.body || "(empty message)"}
                  </p>
                  <time
                    className={`mt-1 block text-[10px] ${
                      mine
                        ? "text-zinc-500 dark:text-zinc-500"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                    dateTime={event.created_at}
                  >
                    {formatDateTime(event.created_at)}
                  </time>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t border-hairline p-3">
        {canSend ? (
          <>
            <label htmlFor={`chat-${ticketId}`} className="sr-only">
              Write a message
            </label>
            <textarea
              id={`chat-${ticketId}`}
              rows={2}
              value={draft}
              disabled={isPending}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write a message…"
              className={`resize-none ${FIELD}`}
            />
            <div className="flex items-center justify-between gap-2">
              <p className={HELP_TEXT}>
                Enter to send · Shift+Enter for new line
              </p>
              <button
                type="button"
                disabled={isPending || draft.trim().length === 0}
                onClick={handleSend}
                className={PRIMARY_BUTTON}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className={HELP_TEXT}>
            {disabledReason ?? "Messaging is unavailable for this ticket."}
          </p>
        )}
        {error ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
