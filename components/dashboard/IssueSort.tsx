"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ISSUE_ASSIGNMENTS,
  ISSUE_SORTS,
  WORKER_TICKET_VIEWS,
  parseIssueAssignment,
  parseIssueSort,
  parseWorkerTicketView,
  type IssueAssignmentId,
  type WorkerTicketViewId,
} from "@/lib/tickets/sort";

type OpenIssueControlsProps = {
  basePath?: string;
  assignmentCounts: Record<IssueAssignmentId, number>;
};

export function OpenIssueControls({
  basePath = "/supervisor/open",
  assignmentCounts,
}: OpenIssueControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = parseIssueSort(searchParams.get("sort") ?? undefined);
  const assigned = parseIssueAssignment(
    searchParams.get("assigned") ?? undefined,
  );

  function update(key: "sort" | "assigned", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        role="group"
        aria-label="Filter by assignee"
        className="inline-flex flex-wrap rounded-lg p-0.5 ring-1 ring-inset ring-hairline-strong"
      >
        {ISSUE_ASSIGNMENTS.map((option) => {
          const selected = assigned === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => update("assigned", option.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
                selected
                  ? "bg-inset font-semibold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {option.label}
              <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
                {assignmentCounts[option.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Rank issues"
        className="inline-flex rounded-lg p-0.5 ring-1 ring-inset ring-hairline-strong"
      >
        {ISSUE_SORTS.map((option) => {
          const selected = sort === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => update("sort", option.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                selected
                  ? "bg-inset font-semibold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type WorkerTicketFiltersProps = {
  basePath?: string;
  counts: Record<WorkerTicketViewId, number>;
};

export function WorkerTicketFilters({
  basePath = "/worker/tickets",
  counts,
}: WorkerTicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = parseWorkerTicketView(searchParams.get("view") ?? undefined);

  function select(next: WorkerTicketViewId) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "open") {
      params.delete("view");
    } else {
      params.set("view", next);
    }
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="inline-flex flex-wrap rounded-lg p-0.5 ring-1 ring-inset ring-hairline-strong"
    >
      {WORKER_TICKET_VIEWS.map((option) => {
        const selected = view === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => select(option.id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
              selected
                ? "bg-inset font-semibold text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {option.label}
            <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
              {counts[option.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
