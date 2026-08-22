"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteBroadcast } from "@/app/supervisor/actions";
import type { SiteBroadcast } from "@/lib/broadcasts/queries";

type BroadcastListProps = {
  broadcasts: SiteBroadcast[];
  canDelete?: boolean;
  emptyMessage?: string;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function BroadcastWhen({ iso }: { iso: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(formatWhen(iso));
  }, [iso]);

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {label || "\u00a0"}
    </time>
  );
}

export function BroadcastList({
  broadcasts,
  canDelete = false,
  emptyMessage = "No broadcasts yet.",
}: BroadcastListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (broadcasts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        {emptyMessage}
      </p>
    );
  }

  function handleDelete(broadcastId: string) {
    setError(null);
    setPendingId(broadcastId);

    startTransition(async () => {
      const result = await deleteBroadcast(broadcastId);
      setPendingId(null);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {broadcasts.map((broadcast) => (
          <li key={broadcast.id} className="px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{broadcast.title}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {broadcast.body}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {broadcast.author_name} · <BroadcastWhen iso={broadcast.created_at} />
                </p>
              </div>

              {canDelete ? (
                <button
                  type="button"
                  disabled={isPending && pendingId === broadcast.id}
                  onClick={() => handleDelete(broadcast.id)}
                  className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  {isPending && pendingId === broadcast.id ? "Removing…" : "Remove"}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
