const TRAIL = [
  { label: "Submitted", meta: "Worker 03 · Tue 07:42", done: true },
  { label: "In review", meta: "Supervisor notified", done: true },
  { label: "Work started", meta: "Assigned to maintenance", done: true },
  { label: "Resolved", meta: "Worker emailed", done: false },
];

export function StatusTrailMock() {
  return (
    <div className="bg-white p-4 text-statera-ink">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        Report STR-1184
      </p>
      <p className="mt-1 font-display text-base font-bold tracking-[-0.01em]">
        Followed through to done
      </p>

      <ol className="mt-4 space-y-3.5">
        {TRAIL.map((step) => (
          <li key={step.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                step.done ? "bg-emerald-500" : "bg-zinc-200"
              }`}
              aria-hidden
            >
              {step.done ? (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
                  <path d="M2.5 6.2 5 8.6l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold leading-none">{step.label}</p>
              <p className="mt-1 truncate text-[10px] text-zinc-500">{step.meta}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
