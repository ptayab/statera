"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { homePathForRole } from "@/lib/auth/routes";

type LoginFormProps = {
  initialError?: string | null;
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.5a3 3 0 0 0 4 4M9.9 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.2 5.2M6.4 6.4A18.5 18.5 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 5.1-1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginForm({ initialError }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Sign-in succeeded but no user was returned. Try again.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile?.role) {
      await supabase.auth.signOut();
      setError(
        "Your account is not set up yet. Ask a supervisor to add your profile in Supabase.",
      );
      setLoading(false);
      return;
    }

    router.push(homePathForRole(profile.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600"
        >
          EMAIL ADDRESS
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="operator@minesite.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg bg-zinc-100 px-4 py-3 text-sm font-normal text-zinc-900 outline-none ring-statera-orange transition placeholder:text-zinc-400 focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600"
          >
            PASSWORD
          </label>
          <button
            type="button"
            className="text-xs font-medium normal-case text-statera-orange transition hover:opacity-80"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg bg-zinc-100 py-3 pl-4 pr-12 text-sm font-normal text-zinc-900 outline-none ring-statera-orange transition focus:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-statera-orange px-4 py-4 font-display text-lg leading-none tracking-[0.12em] text-zinc-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "SIGNING IN…" : "ACCESS PLATFORM"}
      </button>
    </form>
  );
}
