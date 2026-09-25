const STATS = [
  { value: "5", label: "Open", detail: "Not resolved or closed", accent: "bg-zinc-400" },
  { value: "3", label: "Hazard reports", detail: "Unsafe, near-miss, occurrence", accent: "bg-rose-500" },
  { value: "1", label: "Open over a week", detail: "Still live from earlier", accent: "bg-orange-400" },
  { value: "4", label: "New this week", detail: "Filed in the last 7 days", accent: "bg-sky-500" },
  { value: "3", label: "Unassigned", detail: "Live, no supervisor yet", accent: "bg-violet-500" },
  { value: "1", label: "Gone quiet", detail: "Live and idle over 7 days", accent: "bg-amber-400" },
];

const VOLUME = [1, 0, 2, 1, 0, 3, 4, 2];

const CATEGORIES = [
  { name: "Unsafe condition", count: 2, bar: "bg-rose-500", width: "100%" },
  { name: "Dangerous occurrence", count: 1, bar: "bg-rose-600", width: "50%" },
  { name: "Equipment", count: 1, bar: "bg-sky-500", width: "50%" },
  { name: "Fatigue", count: 1, bar: "bg-amber-400", width: "50%" },
];

const RANKS = [
  { label: "Critical", count: 1, bar: "bg-rose-500", width: "20%" },
  { label: "High", count: 2, bar: "bg-orange-400", width: "40%" },
  { label: "Medium", count: 1, bar: "bg-amber-300", width: "20%" },
  { label: "Low", count: 1, bar: "bg-emerald-400", width: "20%" },
];

export function ReportsMock() {
  return (
    <div className="bg-white p-4 text-statera-ink sm:p-5">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
        Site briefing
      </p>
      <p className="mt-1 font-display text-lg font-medium">Reports</p>
      <p className="mt-1 max-w-xl text-xs leading-5 text-statera-slate">
        A live picture of open work. Counts include older reports that are still
        not resolved.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-lg bg-[#f7f8fc] px-3 py-2.5 ring-1 ring-black/5"
          >
            <span className={`absolute inset-y-0 left-0 w-[3px] ${stat.accent}`} />
            <p className="font-display text-xl leading-none font-medium">{stat.value}</p>
            <p className="mt-1 text-[11px] font-semibold">{stat.label}</p>
            <p className="text-[10px] text-zinc-500">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg bg-[#f7f8fc] p-3 ring-1 ring-black/5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
            Volume
          </p>
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {VOLUME.map((count, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-400">{count}</span>
                <span
                  className="w-full rounded-sm bg-statera-orange"
                  style={{ height: `${Math.max(count * 10, 2)}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-[#f7f8fc] p-3 ring-1 ring-black/5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
            Categories
          </p>
          <ul className="mt-2 space-y-1.5">
            {CATEGORIES.map((row) => (
              <li key={row.name} className="grid grid-cols-[1fr_auto] items-center gap-2">
                <span className="truncate text-[11px]">{row.name}</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-black/5">
                    <span className={`block h-full ${row.bar}`} style={{ width: row.width }} />
                  </span>
                  <span className="w-3 text-right text-[10px] text-zinc-500">{row.count}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-[#f7f8fc] p-3 ring-1 ring-black/5">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
          AI ranking mix
        </p>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full">
          {RANKS.map((rank) => (
            <span key={rank.label} className={rank.bar} style={{ width: rank.width }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {RANKS.map((rank) => (
            <p key={rank.label} className="text-[10px] text-zinc-500">
              <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${rank.bar}`} />
              {rank.label} {rank.count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
