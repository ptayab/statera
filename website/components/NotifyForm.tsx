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
        Thanks. We’ll follow up about a conversation.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-xl border-0 bg-white px-4 py-3 text-base text-statera-ink shadow-sm ring-1 ring-black/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-statera-orange sm:text-sm";

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-2.5">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            /* 16px on mobile: anything smaller makes iOS Safari zoom on focus. */
            className={fieldClass}
          />
        </label>
        <label className="flex-1">
          <span className="sr-only">Site or company</span>
          <input
            type="text"
            name="organization"
            required
            autoComplete="organization"
            placeholder="Site or company"
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
          className="w-full rounded-xl bg-statera-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd7509] disabled:opacity-60"
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
