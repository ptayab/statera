import { TopNav } from "@/components/nav/TopNav";

const WORKER_NAV_ITEMS = [
  { href: "/worker", label: "Home", match: "exact" as const },
  { href: "/worker/tickets", label: "my tickets", match: "prefix" as const },
  { href: "/worker/submit", label: "new tickets", match: "exact" as const },
  { href: "/worker/messages", label: "messages", match: "prefix" as const },
];

type WorkerNavProps = {
  userLabel?: string | null;
};

export function WorkerNav({ userLabel }: WorkerNavProps) {
  return <TopNav items={WORKER_NAV_ITEMS} userLabel={userLabel} />;
}
