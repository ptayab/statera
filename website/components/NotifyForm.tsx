"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error" | "unconfigured";

type NotifyFormProps = {
  submitLabel?: string;
  showOrganization?: boolean;
};

export function NotifyForm({
  submitLabel = "Notify me",
  showOrganization = false,
}: NotifyFormProps) {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formId) {
      setState("unconfigured");
      return;
    }

    setState("submitting");
    setError(null);

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          organization: organization.trim() || undefined,
          _subject: showOrganization
            ? "Statera pilot enquiry"
            : "Statera enquiry",
        }),
      });

      if (!response.ok) {
        throw new Error("Could not send that address.");
      }

      setState("success");
      setEmail("");
      setOrganization("");
    } catch {
      setState("error");
      setError("Could not send that just now. Try again.");
    }
  }

  if (state === "success") {
    return (
      <p className="rounded-xl bg-white px-4 py-4 text-sm font-medium text-statera-ink shadow-sm ring-1 ring-black/5">
        Thanks. We’ll follow up about a conversation.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-xl border-0 bg-white px-4 py-3 text-base text-statera-ink shadow-sm ring-1 ring-black/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-statera-orange sm:text-sm";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={
          showOrganization
            ? "flex flex-col gap-2.5"
            : "flex flex-col gap-2.5 sm:flex-row"
        }
      >
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            /* 16px on mobile: anything smaller makes iOS Safari zoom on focus. */
            className={fieldClass}
          />
        </label>
        {showOrganization ? (
          <label className="flex-1">
            <span className="sr-only">Site or company</span>
            <input
              type="text"
              name="organization"
              autoComplete="organization"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              placeholder="Site or company (optional)"
              className={fieldClass}
            />
          </label>
        ) : null}
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-xl bg-statera-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd7509] disabled:opacity-60 sm:w-auto"
        >
          {state === "submitting" ? "Sending…" : submitLabel}
        </button>
      </div>
      {state === "error" && error ? (
        <p className="mt-2 text-xs text-rose-600">{error}</p>
      ) : null}
      {state === "unconfigured" ? (
        <p className="mt-2 text-xs text-amber-700">
          This form is not connected yet. Set NEXT_PUBLIC_FORMSPREE_FORM_ID when
          you are ready to collect addresses.
        </p>
      ) : null}
    </form>
  );
}
