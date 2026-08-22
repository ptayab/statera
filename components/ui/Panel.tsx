import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  /** Background class for the 2px bar along the top edge. */
  accent?: string;
  className?: string;
};

export function Panel({ children, accent, className = "" }: PanelProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-panel ring-1 ring-hairline shadow-[0_1px_2px_rgba(24,24,27,0.05)] ${className}`}
    >
      {accent ? (
        <span
          className={`absolute inset-x-0 top-0 h-[2px] ${accent}`}
          aria-hidden
        />
      ) : null}
      {children}
    </section>
  );
}

type PanelHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PanelHeader({ title, description, action }: PanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-3">
      <div>
        <h2 className="font-display text-[11px] uppercase leading-none tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Small caps label with the orange tick that marks every section on a page. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-[11px] uppercase leading-none tracking-[0.16em] text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      <span
        className="h-3 w-[3px] shrink-0 rounded-full bg-statera-orange"
        aria-hidden
      />
      {children}
    </span>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  title,
  description,
  action,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <Eyebrow>{title}</Eyebrow>
          {description ? (
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
