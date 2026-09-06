import { TopNav } from "@/components/nav/TopNav";
import type { TicketNotification } from "@/lib/tickets/display";

const SUPERVISOR_NAV_ITEMS = [
  { href: "/supervisor", label: "Home", match: "exact" as const },
  { href: "/supervisor/open?sort=priority", label: "Open Issues", match: "prefix" as const },
  { href: "/supervisor/all", label: "All Issues", match: "prefix" as const },
  { href: "/supervisor/reports", label: "Reports", match: "prefix" as const },
];

type SupervisorNavProps = {
  userLabel?: string | null;
  notifications?: TicketNotification[];
};

export function SupervisorNav({ userLabel, notifications }: SupervisorNavProps) {
  return (
    <TopNav
      items={SUPERVISOR_NAV_ITEMS}
      userLabel={userLabel}
      notifications={notifications}
    />
  );
}
