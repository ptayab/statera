import Link from "next/link";
import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Background class for the 3px bar on the leading edge. */
  accent?: string;
  /** Text colour class for the value. */
  tone?: string;
};

export function StatTile({ label, value, hint, accent, tone }: StatTileProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-panel py-3.5 pr-4 ring-1 ring-hairline ${
        accent ? "pl-5" : "pl-4"
      }`}
    >
      {accent ? (
        <span className={`absolute inset-y-0 left-0 w-[3px] ${accent}`} aria-hidden />
      ) : null}
      <p
        className={`font-display text-3xl leading-none tabular-nums ${
          tone ?? "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

type NavCardProps = {
  href: string;
  title: string;
  description: string;
  /** Headline count. Omit for cards that have nothing to count. */
  value?: ReactNode;
  accent: string;
  tone?: string;
};

export function NavCard({
  href,
  title,
  description,
  value,
  accent,
  tone,
}: NavCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-panel p-5 ring-1 ring-hairline shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition duration-150 hover:ring-hairline-strong hover:shadow-[0_8px_24px_-8px_rgba(24,24,27,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-statera-orange"
    >
      <span className={`absolute inset-x-0 top-0 h-[2px] ${accent}`} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        {value != null ? (
          <p
            className={`font-display text-[42px] leading-none tabular-nums ${
              tone ?? "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {value}
          </p>
        ) : (
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </p>
        )}
        <span
          className="text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-statera-orange dark:text-zinc-600"
          aria-hidden
        >
          →
        </span>
      </div>
      {value != null ? (
        <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
      ) : null}
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </Link>
  );
}
