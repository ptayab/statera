const HIGHLIGHTS = [
  "Four reports filed this week, including a critical hydraulic leak at pump 3.",
  "Three hazard reports are still open, led by the missing isolation lock.",
  "One haul-road berm has been open five days with no update.",
];

const CONCERNS = [
  "Hydraulic oil on the floor beside pump 3 needs isolation before the next shift.",
  "Three live reports still have no supervisor assigned.",
  "The haul-road berm has gone quiet and is the oldest open item.",
];

export function BriefingMock() {
  return (
    <div className="bg-white p-4 text-statera-ink sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            AI briefing
          </p>
          <p className="mt-1 max-w-xl text-xs leading-5 text-statera-slate">
            Written from the live counts above. It does not invent numbers.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md bg-statera-ink px-2.5 py-1.5 text-[11px] font-medium text-white">
            Regenerate report
          </span>
          <span className="rounded-md px-2.5 py-1.5 text-[11px] font-medium ring-1 ring-black/10">
            Export PDF
          </span>
        </div>
      </div>

      <p className="mt-4 font-display text-base leading-snug font-medium">
        5 live reports — one critical leak and an idle haul-road berm need action
      </p>
      <p className="mt-1 text-[10px] text-zinc-400">Narrated from live open work</p>
      <p className="mt-3 text-sm leading-6 text-statera-slate">
        Five reports are open. One is a critical hydraulic leak beside pump 3,
        two more are high-priority unsafe conditions, and the haul-road berm has
        had no update for five days. Three reports are still unassigned.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <section>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            Highlights
          </p>
          <ul className="mt-2 space-y-1.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="text-xs leading-5 text-statera-slate">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            Concerns
          </p>
          <ul className="mt-2 space-y-1.5">
            {CONCERNS.map((item) => (
              <li key={item} className="text-xs leading-5 text-statera-slate">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
