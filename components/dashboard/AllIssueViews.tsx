import Link from "next/link";

export const ALL_ISSUE_VIEWS = ["all", "closed"] as const;

export type AllIssueView = (typeof ALL_ISSUE_VIEWS)[number];

export function isAllIssueView(value: string | undefined): value is AllIssueView {
  return ALL_ISSUE_VIEWS.includes(value as AllIssueView);
}

type AllIssueViewsProps = {
  currentView: AllIssueView;
  counts: Record<AllIssueView, number>;
  category?: string;
};

function viewHref(view: AllIssueView, category?: string) {
  const params = new URLSearchParams();

  if (view !== "all") {
    params.set("view", view);
  }

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/supervisor/all?${query}` : "/supervisor/all";
}

const VIEW_OPTIONS: { view: AllIssueView; label: string }[] = [
  { view: "all", label: "Open and Closed" },
  { view: "closed", label: "Closed" },
];

export function AllIssueViews({
  currentView,
  counts,
  category,
}: AllIssueViewsProps) {
  return (
    <nav
      aria-label="All issue views"
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
    >
      {VIEW_OPTIONS.map(({ view, label }) => {
        const isActive = currentView === view;

        return (
          <Link
            key={view}
            href={viewHref(view, category)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition sm:justify-start ${
              isActive
                ? "border-statera-orange/40 bg-statera-orange/10 font-medium text-statera-orange"
                : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            }`}
          >
            <span>{label}</span>
            <span
              className={`tabular-nums ${
                isActive ? "text-statera-orange" : "text-zinc-500"
              }`}
            >
              {counts[view]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
