"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NotificationBell } from "@/components/nav/NotificationBell";
import type { TicketNotification } from "@/lib/tickets/display";

export type NavItem = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
};

type TopNavProps = {
  items: NavItem[];
  userLabel?: string | null;
  notifications?: TicketNotification[];
};

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match === "prefix") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return pathname === item.href;
}

export function TopNav({ items, userLabel, notifications = [] }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-panel/85 backdrop-blur-md">
      <span
        className="absolute inset-x-0 top-0 h-[2px] bg-statera-orange"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
          <BrandLogo href={items[0]?.href ?? "/"} size={32} priority />

          <nav className="flex flex-wrap items-center gap-0.5">
            {items.map((item) => {
              const active = isActive(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-statera-orange/10 font-semibold text-statera-orange"
                      : "text-zinc-500 hover:bg-inset hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {active ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-statera-orange"
                      aria-hidden
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          <NotificationBell items={notifications} />
          {userLabel ? (
            <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
              {userLabel}
            </span>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
