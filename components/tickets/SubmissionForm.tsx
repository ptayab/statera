"use client";

import { useState, useTransition } from "react";
import { CategoryGuidance } from "@/components/tickets/CategoryGuidance";
import { submitTicket } from "@/app/worker/submit/actions";
import {
  PILOT_TICKET_CATEGORIES,
  getCategoryMeta,
  type PilotTicketCategory,
} from "@/lib/tickets/categories";
import { TICKET_URGENCIES } from "@/lib/tickets/scoring";
import type { TicketUrgency } from "@/lib/supabase/types";

export function SubmissionForm() {
  const [category, setCategory] = useState<PilotTicketCategory | "">("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<TicketUrgency>("Medium");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    ticketId: string;
    category: PilotTicketCategory;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedMeta = category ? getCategoryMeta(category) : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!category) {
      setError("Please choose a category.");
      return;
    }

    const formData = new FormData();
    formData.set("category", category);
    formData.set("description", description);
    formData.set("urgency", urgency);
    if (photo) {
      formData.set("photo", photo);
    }

    startTransition(async () => {
      const result = await submitTicket(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setConfirmation({
        ticketId: result.ticketId,
        category: result.category,
      });
      setCategory("");
      setDescription("");
      setUrgency("Medium");
      setPhoto(null);
    });
  }

  function handleSubmitAnother() {
    setConfirmation(null);
    setError(null);
  }

  if (confirmation) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <p className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">
            Report submitted
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
            Got it — your supervisor has been notified. Reference:{" "}
            <span className="font-mono text-xs">
              {confirmation.ticketId.slice(0, 8)}
            </span>
          </p>
        </div>

        <CategoryGuidance category={confirmation.category} submitted />

        <button
          type="button"
          onClick={handleSubmitAnother}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium">
          What happened?
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as PilotTicketCategory | "")
          }
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="" disabled>
            Choose a category
          </option>
          {PILOT_TICKET_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {selectedMeta ? (
          <CategoryGuidance category={selectedMeta.name} showDescription />
        ) : (
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Pick the closest match. You can explain the details below.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Brief description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What did you see? Where? Who might be affected?"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Your ranking</legend>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          How serious this feels to you. Supervisors also see a separate AI
          ranking computed from this and other signals.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TICKET_URGENCIES.map((option) => {
            const selected = urgency === option;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm transition ${
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={option}
                  checked={selected}
                  onChange={() => setUrgency(option)}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="photo" className="text-sm font-medium">
          Photo <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          capture="environment"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-900 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-100"
        />
        {photo ? (
          <p className="text-xs text-zinc-500">Selected: {photo.name}</p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
