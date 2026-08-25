"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { TicketNotification } from "@/lib/tickets/display";
import { formatTimeAgo } from "@/lib/tickets/format";

const TICKET_PATH =
  /\/(?:supervisor|worker\/tickets)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function ticketIdFromPath(pathname: string): string | null {
  return pathname.match(TICKET_PATH)?.[1] ?? null;
}

type NotificationBellProps = {
  items: TicketNotification[];
};

export function NotificationBell({ items }: NotificationBellProps) {
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [seenHere, setSeenHere] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const id = ticketIdFromPath(pathname);
    if (!id) return;
    setSeenHere((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const visible = items.filter((item) => !seenHere.has(item.ticketId));
  const count = visible.length;
  const label =
    count === 0
      ? "Notifications"
      : `Notifications, ${count} unread`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-inset hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
          <path d="M10 20h4" />
        </svg>
        {count > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-statera-orange px-1 text-[10px] font-semibold leading-none text-white">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="menu"
          aria-label="Unread ticket updates"
          className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-panel shadow-[0_8px_24px_rgba(24,24,27,0.12)] ring-1 ring-hairline-strong"
        >
          <div className="border-b border-hairline px-3 py-2.5">
            <p className="font-display text-[11px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Updates
            </p>
          </div>

          {count === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              You&apos;re up to date
            </p>
          ) : (
            <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
              {visible.map((item) => (
                <li key={item.ticketId}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 transition hover:bg-inset"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                        {formatTimeAgo(item.at)}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {item.preview}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
