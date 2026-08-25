import { TopNav } from "@/components/nav/TopNav";
import type { TicketNotification } from "@/lib/tickets/display";

const WORKER_NAV_ITEMS = [
  { href: "/worker", label: "Home", match: "exact" as const },
  { href: "/worker/tickets", label: "my tickets", match: "prefix" as const },
  { href: "/worker/submit", label: "create ticket", match: "exact" as const },
];

type WorkerNavProps = {
  userLabel?: string | null;
  notifications?: TicketNotification[];
};

export function WorkerNav({ userLabel, notifications }: WorkerNavProps) {
  return (
    <TopNav
      items={WORKER_NAV_ITEMS}
      userLabel={userLabel}
      notifications={notifications}
    />
  );
}
