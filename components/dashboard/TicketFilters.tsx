"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PILOT_TICKET_CATEGORIES } from "@/lib/tickets/categories";
import { TICKET_STATUSES } from "@/lib/tickets/status";

export function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  function updateFilter(key: "status" | "category", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `/dashboard?${query}` : "/dashboard");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Status</span>
        <select
          value={currentStatus}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Category</span>
        <select
          value={currentCategory}
          onChange={(event) => updateFilter("category", event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">All categories</option>
          {PILOT_TICKET_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
