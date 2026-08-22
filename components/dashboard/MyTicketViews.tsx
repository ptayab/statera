import Link from "next/link";

export const MY_TICKET_VIEWS = ["open", "closed"] as const;

export type MyTicketView = (typeof MY_TICKET_VIEWS)[number];

export function isMyTicketView(value: string | undefined): value is MyTicketView {
  return MY_TICKET_VIEWS.includes(value as MyTicketView);
}

type MyTicketViewsProps = {
  currentView: MyTicketView;
  counts: Record<MyTicketView, number>;
};

function viewHref(view: MyTicketView) {
  if (view === "open") {
    return "/worker/tickets";
  }

  return `/worker/tickets?view=${view}`;
}

const VIEW_OPTIONS: { view: MyTicketView; label: string }[] = [
  { view: "open", label: "Open tickets" },
  { view: "closed", label: "Closed tickets" },
];

export function MyTicketViews({ currentView, counts }: MyTicketViewsProps) {
  return (
    <nav
      aria-label="My ticket views"
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
    >
      {VIEW_OPTIONS.map(({ view, label }) => {
        const isActive = currentView === view;

        return (
          <Link
            key={view}
            href={viewHref(view)}
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
