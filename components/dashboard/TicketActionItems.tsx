"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addActionItem,
  removeActionItem,
  setActionItemDone,
} from "@/app/supervisor/actions";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { FIELD, HELP_TEXT, PRIMARY_BUTTON } from "@/components/ui/controls";
import {
  isActionItemOverdue,
  type TicketActionItem,
} from "@/lib/tickets/action-items";
import { formatDate } from "@/lib/tickets/format";

type TicketActionItemsProps = {
  ticketId: string;
  items: TicketActionItem[];
  canEdit: boolean;
  disabledReason?: string | null;
};

function dueCopy(item: TicketActionItem): { text: string; overdue: boolean } | null {
  if (!item.dueOn) return null;
  const overdue = isActionItemOverdue(item);
  return {
    overdue,
    text: overdue
      ? `Overdue · ${formatDate(item.dueOn)}`
      : `Due ${formatDate(item.dueOn)}`,
  };
}

export function TicketActionItems({
  ticketId,
  items,
  canEdit,
  disabledReason,
}: TicketActionItemsProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  function handleAdd() {
    const nextTitle = title.trim();
    if (!nextTitle || isPending || !canEdit) return;

    runAction(async () => {
      const result = await addActionItem(ticketId, nextTitle, dueOn);
      if (result.ok) {
        setTitle("");
        setDueOn("");
      }
      return result;
    });
  }

  const openCount = items.filter((item) => !item.completedAt).length;

  return (
    <Panel accent="bg-statera-orange">
      <PanelHeader
        title="Action items"
        description={
          items.length === 0
            ? "Follow-up work for this report."
            : `${openCount} open · ${items.length} total`
        }
      />

      <div className="space-y-4 px-4 py-4">
        {items.length === 0 ? (
          <p className={HELP_TEXT}>
            {canEdit
              ? "Add the first follow-up so the worker can see what you are doing."
              : "No action items yet."}
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const done = Boolean(item.completedAt);
              const due = dueCopy(item);

              return (
                <li
                  key={item.id}
                  className="rounded-xl bg-inset px-3 py-2.5 ring-1 ring-hairline"
                >
                  <div className="flex items-start gap-3">
                    {canEdit ? (
                      <input
                        type="checkbox"
                        checked={done}
                        disabled={isPending}
                        onChange={(event) =>
                          runAction(() =>
                            setActionItemDone(
                              ticketId,
                              item.id,
                              event.target.checked,
                            ),
                          )
                        }
                        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-statera-orange focus:ring-statera-orange"
                        aria-label={`Mark ${item.title} done`}
                      />
                    ) : (
                      <span
                        className={`mt-1 h-4 w-4 shrink-0 rounded border ${
                          done
                            ? "border-emerald-400 bg-emerald-500"
                            : "border-zinc-300 bg-panel dark:border-zinc-600"
                        }`}
                        aria-hidden
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          done
                            ? "text-zinc-500 line-through dark:text-zinc-500"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {item.title}
                      </p>
                      {due ? (
                        <p
                          className={`mt-1 text-[11px] font-medium ${
                            due.overdue
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {due.text}
                        </p>
                      ) : null}
                    </div>

                    {canEdit ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          runAction(() => removeActionItem(ticketId, item.id))
                        }
                        className="shrink-0 text-[11px] font-medium text-zinc-500 transition hover:text-rose-600 disabled:opacity-45 dark:text-zinc-400 dark:hover:text-rose-400"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {canEdit ? (
          <form
            className="space-y-3 border-t border-hairline pt-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleAdd();
            }}
          >
            <div className="space-y-2">
              <label
                htmlFor="action-item-title"
                className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400"
              >
                New action item
              </label>
              <input
                id="action-item-title"
                value={title}
                maxLength={200}
                disabled={isPending}
                placeholder="Install temporary lights next shift"
                onChange={(event) => setTitle(event.target.value)}
                className={FIELD}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="action-item-due"
                className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400"
              >
                Due date (optional)
              </label>
              <input
                id="action-item-due"
                type="date"
                value={dueOn}
                disabled={isPending}
                onChange={(event) => setDueOn(event.target.value)}
                className={FIELD}
              />
            </div>
            <button
              type="submit"
              disabled={isPending || title.trim().length < 1}
              className={`w-full ${PRIMARY_BUTTON}`}
            >
              Add action item
            </button>
          </form>
        ) : disabledReason ? (
          <p className={`${HELP_TEXT} border-t border-hairline pt-4`}>
            {disabledReason}
          </p>
        ) : null}

        {error ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}

      </div>
    </Panel>
  );
}

export function WorkerActionItems({ items }: { items: TicketActionItem[] }) {
  return (
    <TicketActionItems
      ticketId=""
      items={items}
      canEdit={false}
      disabledReason={
        items.length === 0
          ? "Your supervisor will add follow-up work here."
          : null
      }
    />
  );
}

export function ActionItemInbox({
  items,
}: {
  items: Array<TicketActionItem & { ticketId: string; ticketCategory: string }>;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-panel px-4 py-8 text-center text-sm text-zinc-500 ring-1 ring-hairline dark:text-zinc-400">
        No open action items. Add follow-up work from a claimed ticket.
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-2xl bg-panel ring-1 ring-hairline">
      {items.map((item) => {
        const due = dueCopy(item);
        return (
          <li key={`${item.ticketId}-${item.id}`} className="border-b border-hairline last:border-0">
            <Link
              href={`/supervisor/${item.ticketId}`}
              className="block px-4 py-3 transition hover:bg-inset"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {item.ticketCategory}
                {due ? (
                  <span
                    className={
                      due.overdue
                        ? "text-rose-600 dark:text-rose-400"
                        : undefined
                    }
                  >
                    {` · ${due.text}`}
                  </span>
                ) : null}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}