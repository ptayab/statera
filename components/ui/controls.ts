/** Shared control classes so buttons and fields match across client components. */

export const PRIMARY_BUTTON =
  "inline-flex items-center justify-center rounded-lg bg-statera-dark px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white";

export const SECONDARY_BUTTON =
  "inline-flex items-center justify-center rounded-lg bg-panel px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-inset ring-hairline-strong transition hover:bg-inset disabled:cursor-not-allowed disabled:opacity-45 dark:text-zinc-100";

export const FIELD =
  "w-full rounded-lg bg-panel px-3 py-2 text-sm text-zinc-900 ring-1 ring-inset ring-hairline-strong transition focus:outline-none focus:ring-2 focus:ring-statera-orange disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100";

export const HELP_TEXT = "text-xs leading-relaxed text-zinc-500 dark:text-zinc-400";
