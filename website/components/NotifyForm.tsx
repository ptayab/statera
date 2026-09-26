"use client";

import { useActionState } from "react";
import { submitEnquiry, type SubmitEnquiryResult } from "@/app/notify/actions";

type NotifyFormProps = {
  submitLabel?: string;
};

export function NotifyForm({ submitLabel = "Notify me" }: NotifyFormProps) {
  const [state, formAction, pending] = useActionState<
    SubmitEnquiryResult | null,
    FormData
  >(submitEnquiry, null);

  if (state?.ok) {
    return (
      <p className="rounded-xl bg-white px-4 py-4 text-sm font-medium text-statera-ink shadow-sm ring-1 ring-black/5">
        Thank you. Our team will be in touch shortly.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-md border border-black/10 bg-white px-3.5 py-2.5 text-base text-statera-ink placeholder:text-zinc-400 focus:border-statera-ink focus:outline-none sm:text-sm";

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-2.5">
        <label className="flex-1">
          <span className="sr-only">Work email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Work email"
            /* 16px on mobile: anything smaller makes iOS Safari zoom on focus. */
            className={fieldClass}
          />
        </label>
        <label className="flex-1">
          <span className="sr-only">Company or site</span>
          <input
            type="text"
            name="organization"
            required
            autoComplete="organization"
            placeholder="Company or site"
            className={fieldClass}
          />
        </label>
        <div className="hidden" aria-hidden>
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded-md bg-statera-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : submitLabel}
        </button>
      </div>
      {state && !state.ok ? (
        <p className="mt-2 text-xs text-rose-600">{state.error}</p>
      ) : null}
    </form>
  );
}
