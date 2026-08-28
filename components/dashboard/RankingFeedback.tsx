"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitRankingFeedback } from "@/app/supervisor/actions";
import { Modal } from "@/components/ui/Modal";
import {
  FIELD,
  HELP_TEXT,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/controls";
import { formatDateTime } from "@/lib/tickets/format";
import type { RankingFeedbackRecord } from "@/lib/tickets/ranking-feedback";
import type { PriorityLabel } from "@/lib/tickets/scoring";

function FeedbackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className ?? "h-[17px] w-[17px]"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H11l-4 4v-4H7.5A2.5 2.5 0 0 1 5 12.5z" />
    </svg>
  );
}

function feedbackButtonLabel(
  feedback: RankingFeedbackRecord | null,
  rankingChanged: boolean,
): string {
  if (!feedback) return "Give feedback on this ranking";
  if (rankingChanged) return "Update feedback — ranking has changed";
  return feedback.agreed
    ? "Feedback given: ranking was accurate"
    : "Feedback given: ranking was not accurate";
}

type Verdict = "accurate" | "off";

const REASON_MAX = 500;

const VERDICT_OPTIONS: { value: Verdict; label: string; hint: string }[] = [
  {
    value: "accurate",
    label: "Accurate",
    hint: "The ranking matches the real risk.",
  },
  {
    value: "off",
    label: "Not accurate",
    hint: "It was ranked too high or too low.",
  },
];

type RankingFeedbackProps = {
  ticketId: string;
  rankingLabel: PriorityLabel;
  rankingScore: number;
  initialFeedback: RankingFeedbackRecord | null;
};

export function RankingFeedback({
  ticketId,
  rankingLabel,
  rankingScore,
  initialFeedback,
}: RankingFeedbackProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const ratedDifferentLabel =
    feedback != null && feedback.label !== rankingLabel;
  const reasonRequired = verdict === "off";

  function openModal() {
    setVerdict(feedback ? (feedback.agreed ? "accurate" : "off") : null);
    setReason(feedback?.reason ?? "");
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    if (isPending) return;
    setOpen(false);
  }

  function save() {
    if (verdict == null) {
      setError("Choose whether the ranking was accurate.");
      return;
    }

    const agreed = verdict === "accurate";
    const trimmedReason = reason.trim();

    if (!agreed && trimmedReason.length < 3) {
      setError("Add a short reason so the AI can learn what was wrong.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await submitRankingFeedback(
        ticketId,
        agreed,
        trimmedReason,
        {
          label: rankingLabel,
          score: rankingScore,
        },
      );

      if (!result.ok) {
        setError(result.error ?? "Could not save feedback.");
        return;
      }

      setFeedback({
        agreed,
        label: rankingLabel,
        score: rankingScore,
        reason: trimmedReason || null,
        at: new Date().toISOString(),
      });
      setOpen(false);
      router.refresh();
    });
  }

  const buttonLabel = feedbackButtonLabel(feedback, ratedDifferentLabel);
  const iconTone = !feedback
    ? "text-zinc-500 dark:text-zinc-400"
    : ratedDifferentLabel
      ? "text-zinc-400 dark:text-zinc-500"
      : feedback.agreed
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={buttonLabel}
        title={buttonLabel}
        className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-panel text-zinc-600 ring-1 ring-inset ring-hairline-strong transition hover:bg-inset dark:text-zinc-300"
      >
        <FeedbackIcon className={`h-[17px] w-[17px] ${iconTone}`} />
        {feedback ? (
          <span
            className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${
              ratedDifferentLabel
                ? "bg-zinc-400"
                : feedback.agreed
                  ? "bg-emerald-500"
                  : "bg-amber-500"
            }`}
            aria-hidden
          />
        ) : null}
      </button>

      <Modal
        open={open}
        onClose={closeModal}
        title="Give feedback"
        description={`This issue is currently ranked ${rankingLabel}. Tell the AI whether that is right.`}
      >
        {feedback ? (
          <div className="mb-4 rounded-lg bg-inset px-3 py-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`text-xs font-semibold ${
                  feedback.agreed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {feedback.agreed
                  ? "You said this ranking was accurate"
                  : "You said this ranking was not accurate"}
              </span>
              <time
                className="shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400"
                dateTime={feedback.at}
                suppressHydrationWarning
              >
                {formatDateTime(feedback.at)}
              </time>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              {ratedDifferentLabel
                ? `Given when this issue was ${feedback.label}.`
                : "Saving again replaces this feedback."}
            </p>
            {feedback.reason ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                “{feedback.reason}”
              </p>
            ) : null}
          </div>
        ) : null}

        <fieldset>
          <legend className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Was this ranking accurate?
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {VERDICT_OPTIONS.map((option) => {
              const selected = verdict === option.value;
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 ring-1 ring-inset transition ${
                    selected
                      ? "bg-statera-dark text-white ring-statera-dark dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-100"
                      : "bg-panel ring-hairline-strong hover:bg-inset"
                  }`}
                >
                  <input
                    type="radio"
                    name={`ranking-verdict-${ticketId}`}
                    value={option.value}
                    checked={selected}
                    disabled={isPending}
                    onChange={() => setVerdict(option.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium">
                    {option.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-relaxed ${
                      selected
                        ? "text-white/70 dark:text-zinc-900/70"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {option.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4">
          <label
            htmlFor={`ranking-reason-${ticketId}`}
            className="text-xs font-medium text-zinc-700 dark:text-zinc-200"
          >
            Reason{" "}
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              {reasonRequired ? "(required)" : "(optional)"}
            </span>
          </label>
          <textarea
            id={`ranking-reason-${ticketId}`}
            value={reason}
            disabled={isPending}
            maxLength={REASON_MAX}
            rows={4}
            onChange={(event) => setReason(event.target.value)}
            placeholder="For example: reports about the packing line conveyor should rank lower unless someone is injured."
            className={`mt-1.5 resize-y ${FIELD}`}
          />
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <p className={HELP_TEXT}>
              Future reports at this site are ranked with this in mind.
            </p>
            <span className="shrink-0 text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
              {reason.length}/{REASON_MAX}
            </span>
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={isPending}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className={PRIMARY_BUTTON}
          >
            {isPending ? "Saving…" : "Save feedback"}
          </button>
        </div>
      </Modal>
    </>
  );
}
