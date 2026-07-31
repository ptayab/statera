"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

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
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Conversation
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Messages and status updates for this ticket.
        </p>
      </div>

      <div className="flex max-h-[28rem] min-h-[16rem] flex-col gap-3 overflow-y-auto bg-zinc-50 px-3 py-4 dark:bg-zinc-950/40">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No messages yet. Say hello to start the conversation.
          </p>
        ) : (
          events.map((event) => {
            if (event.formatted.kind === "system") {
              return (
                <div key={event.id} className="flex justify-center px-2">
                  <div className="max-w-[90%] rounded-full bg-zinc-200/80 px-3 py-1.5 text-center dark:bg-zinc-800">
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                      {event.formatted.title}
                      {event.formatted.detail
                        ? ` · ${event.formatted.detail}`
                        : ""}
                    </p>
                    <time
                      className="mt-0.5 block text-[10px] text-zinc-500"
                      dateTime={event.created_at}
                    >
                      {formatWhen(event.created_at)}
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
                      ? "rounded-br-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "rounded-bl-md border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  <p
                    className={`text-[11px] font-medium ${
                      mine
                        ? "text-zinc-300 dark:text-zinc-600"
                        : "text-zinc-500"
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
                        ? "text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-400"
                    }`}
                    dateTime={event.created_at}
                  >
                    {formatWhen(event.created_at)}
                  </time>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
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
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-zinc-500">Enter to send · Shift+Enter for new line</p>
              <button
                type="button"
                disabled={isPending || draft.trim().length === 0}
                onClick={handleSend}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            {disabledReason ?? "Messaging is unavailable for this ticket."}
          </p>
        )}
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
