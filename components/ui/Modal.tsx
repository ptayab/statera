"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * Centred dialog built on the native element so Escape, focus trapping, and
 * the top layer come from the platform rather than hand-rolled listeners.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby={titleId}
      className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-2xl bg-panel p-0 text-foreground shadow-xl ring-1 ring-hairline backdrop:bg-zinc-900/45"
    >
      <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-3">
        <div>
          <h2
            id={titleId}
            className="font-display text-[11px] uppercase leading-none tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 -mt-1 rounded-lg px-2 py-1 text-lg leading-none text-zinc-400 transition hover:bg-inset hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          ×
        </button>
      </div>

      <div className="px-4 py-4">{children}</div>
    </dialog>
  );
}
