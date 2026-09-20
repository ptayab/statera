"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error" | "unconfigured";

export function NotifyForm() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  const [email, setEmail] = useState("");
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
          _subject: "Statera enquiry",
        }),
      });

      if (!response.ok) {
        throw new Error("Could not send that address.");
      }

      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setError("Could not send that just now. Try again.");
    }
  }

  if (state === "success") {
    return (
      <p className="rounded-xl bg-white px-4 py-4 text-sm font-medium text-statera-ink shadow-sm ring-1 ring-black/5">
        Thanks. We’ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2.5 sm:flex-row">
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
            className="w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-statera-ink shadow-sm ring-1 ring-black/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-statera-orange"
          />
        </label>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-xl bg-statera-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd7509] disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Notify me"}
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
