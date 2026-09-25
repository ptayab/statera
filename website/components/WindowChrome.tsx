import type { ReactNode } from "react";

type WindowChromeProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function WindowChrome({ title, children, className = "" }: WindowChromeProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_-28px_rgba(22,21,19,0.45)] ring-1 ring-black/10 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-white px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
        </span>
        <p className="min-w-0 flex-1 truncate text-center text-[10px] font-medium text-zinc-400">
          {title}
        </p>
        <span className="w-8" aria-hidden />
      </div>
      {children}
    </div>
  );
}
