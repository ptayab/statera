"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FIELD } from "@/components/ui/controls";
import { PILOT_TICKET_CATEGORIES } from "@/lib/tickets/categories";
import { TICKET_STATUSES } from "@/lib/tickets/status";

type TicketFiltersProps = {
  basePath?: string;
};

export function TicketFilters({ basePath = "/supervisor/all" }: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const hasFilters = Boolean(currentStatus || currentCategory);

  function updateFilter(key: "status" | "category", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
          Status
        </span>
        <select
          value={currentStatus}
          onChange={(event) => updateFilter("status", event.target.value)}
          className={`w-auto ${FIELD}`}
        >
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
          Category
        </span>
        <select
          value={currentCategory}
          onChange={(event) => updateFilter("category", event.target.value)}
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

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.push(basePath)}
          className="pb-2.5 text-xs font-medium text-zinc-500 transition hover:text-statera-orange dark:text-zinc-400"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
