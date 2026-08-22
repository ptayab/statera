import Link from "next/link";

export const OPEN_ISSUE_VIEWS = ["all", "unassigned", "mine"] as const;

export type OpenIssueView = (typeof OPEN_ISSUE_VIEWS)[number];

export function isOpenIssueView(value: string | undefined): value is OpenIssueView {
  return OPEN_ISSUE_VIEWS.includes(value as OpenIssueView);
}

type OpenIssueViewsProps = {
  currentView: OpenIssueView;
  counts: Record<OpenIssueView, number>;
  category?: string;
};

function viewHref(view: OpenIssueView, category?: string) {
  const params = new URLSearchParams();

  if (view !== "mine") {
    params.set("view", view);
  }

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/supervisor/open?${query}` : "/supervisor/open";
}

const VIEW_OPTIONS: { view: OpenIssueView; label: string }[] = [
  { view: "mine", label: "Assigned to you" },
  { view: "unassigned", label: "Unassigned" },
  { view: "all", label: "All open" },
];

export function OpenIssueViews({
  currentView,
  counts,
  category,
}: OpenIssueViewsProps) {
  return (
    <nav
      aria-label="Open issue views"
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
