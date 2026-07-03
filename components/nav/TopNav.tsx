"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

export type NavItem = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
};

type TopNavProps = {
  items: NavItem[];
  userLabel?: string | null;
};

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match === "prefix") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return pathname === item.href;
}

export function TopNav({ items, userLabel }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href={items[0]?.href ?? "/"}
            className="font-display text-xl tracking-wide text-zinc-900 dark:text-zinc-100"
          >
            STATERA
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {items.map((item) => {
              const active = isActive(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-statera-orange/10 font-medium text-statera-orange"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:justify-end">
          {userLabel ? (
            <span className="hidden text-sm text-zinc-500 sm:inline">{userLabel}</span>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
