"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FIELD } from "@/components/ui/controls";
import { PILOT_TICKET_CATEGORIES } from "@/lib/tickets/categories";
import {
  ISSUE_LIFECYCLES,
  parseIssueLifecycle,
  type IssueLifecycleId,
} from "@/lib/tickets/sort";

type CategoryFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
        Category
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-auto ${FIELD}`}
      >
        <option value="">All categories</option>
        {PILOT_TICKET_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

type TicketFiltersProps = {
  basePath?: string;
  lifecycleCounts: Record<IssueLifecycleId, number>;
};

export function TicketFilters({
  basePath = "/supervisor/all",
  lifecycleCounts,
}: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = parseIssueLifecycle(searchParams.get("view") ?? undefined);
  const currentCategory = searchParams.get("category") ?? "";

  function push(nextView: IssueLifecycleId, category: string) {
    const params = new URLSearchParams();
    if (nextView !== "all") {
      params.set("view", nextView);
    }
    if (category) {
      params.set("category", category);
    }
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div
        role="group"
        aria-label="Filter by all or closed"
        className="inline-flex flex-wrap rounded-lg p-0.5 ring-1 ring-inset ring-hairline-strong"
      >
        {ISSUE_LIFECYCLES.map((option) => {
          const selected = view === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => push(option.id, currentCategory)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
                selected
                  ? "bg-inset font-semibold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {option.label}
              <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
                {lifecycleCounts[option.id]}
              </span>
            </button>
          );
        })}
      </div>

      <CategoryFilter
        value={currentCategory}
        onChange={(category) => push(view, category)}
      />
    </div>
  );
}
