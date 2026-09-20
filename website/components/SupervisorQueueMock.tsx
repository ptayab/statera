const ISSUES: {
  rank: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  priorityClass: string;
  rail: string;
  category: string;
  description: string;
  meta: string;
}[] = [
  {
    rank: 1,
    priority: "Critical",
    priorityClass: "bg-rose-50 text-rose-700",
    rail: "bg-rose-500",
    category: "Dangerous occurrence",
    description: "Hydraulic oil on the floor beside pump 3",
    meta: "Open 2d · no update 18h",
  },
  {
    rank: 2,
    priority: "High",
    priorityClass: "bg-orange-50 text-orange-700",
    rail: "bg-orange-400",
    category: "Unsafe condition",
    description: "Isolation lock missing on crusher MCC",
    meta: "Open 1d · North pit",
  },
  {
    rank: 3,
    priority: "High",
    priorityClass: "bg-orange-50 text-orange-700",
    rail: "bg-orange-400",
    category: "Unsafe condition",
    description: "Haul road berm washed out at 12.4 km",
    meta: "Open 5d · neglected",
  },
  {
    rank: 4,
    priority: "Medium",
    priorityClass: "bg-amber-50 text-amber-700",
    rail: "bg-amber-300",
    category: "Equipment",
    description: "Conveyor 2 tracking off at the transfer",
    meta: "Open 3d · Plant",
  },
  {
    rank: 5,
    priority: "Low",
    priorityClass: "bg-emerald-50 text-emerald-700",
    rail: "bg-emerald-400",
    category: "Fatigue",
    description: "Fatigue report after night shift, truck 18",
    meta: "Submitted today",
  },
];

export function SupervisorQueueMock() {
  return (
    <div className="bg-white text-statera-ink">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            North pit
          </p>
          <p className="mt-0.5 font-display text-base font-bold tracking-[-0.01em]">
            Open issues
          </p>
        </div>
        <span className="rounded-full bg-statera-mist px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-statera-slate">
          Ranked
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-white px-3 py-3">
        {[
          { value: "2", label: "Need triage", accent: "bg-rose-500" },
          { value: "3", label: "Unassigned", accent: "bg-orange-400" },
          { value: "1", label: "Gone quiet", accent: "bg-amber-300" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-lg bg-[#f7f8fc] py-2.5 pl-3 pr-2 ring-1 ring-black/5"
          >
            <span className={`absolute inset-y-0 left-0 w-[3px] ${stat.accent}`} />
            <p className="font-display text-lg font-bold leading-none">{stat.value}</p>
            <p className="mt-1 text-[9px] font-medium text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <ul className="px-3 pb-3">
        {ISSUES.map((issue) => (
          <li
            key={issue.rank}
            className="mb-2 flex items-stretch overflow-hidden rounded-lg bg-white ring-1 ring-black/5 last:mb-0"
          >
            <span className={`w-1 shrink-0 ${issue.rail}`} aria-hidden />
            <div className="min-w-0 flex-1 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${issue.priorityClass}`}
                >
                  {issue.priority}
                </span>
                <p className="truncate text-[12px] font-semibold">{issue.description}</p>
              </div>
              <p className="mt-1 truncate text-[10px] text-zinc-500">
                {issue.category}
                <span className="mx-1.5 text-zinc-300">·</span>
                {issue.meta}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
