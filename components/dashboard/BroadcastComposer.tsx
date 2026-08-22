"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { publishBroadcast } from "@/app/supervisor/actions";

export function BroadcastComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await publishBroadcast(title, body);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setTitle("");
      setBody("");
      setMessage("Broadcast posted.");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          placeholder="Shift notice, safety reminder…"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          disabled={isPending}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Message</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Write a broadcast for workers at your site."
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          disabled={isPending}
        />
      </label>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-statera-orange px-4 py-2 text-sm font-medium text-zinc-900 transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Posting…" : "Post broadcast"}
      </button>
    </form>
  );
}
