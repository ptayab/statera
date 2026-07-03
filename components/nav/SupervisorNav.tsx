import { TopNav } from "@/components/nav/TopNav";

const SUPERVISOR_NAV_ITEMS = [
  { href: "/supervisor", label: "Home", match: "exact" as const },
  { href: "/supervisor/open", label: "Open Issue", match: "prefix" as const },
  { href: "/supervisor/all", label: "All Issues", match: "prefix" as const },
];

type SupervisorNavProps = {
  userLabel?: string | null;
};

export function SupervisorNav({ userLabel }: SupervisorNavProps) {
  return <TopNav items={SUPERVISOR_NAV_ITEMS} userLabel={userLabel} />;
}
