export function WorkerReportMock() {
  return (
    <div className="bg-white p-4 text-statera-ink">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        New report
      </p>
      <p className="mt-1 font-display text-base font-bold tracking-[-0.01em]">
        What did you see?
      </p>

      <div className="mt-3 rounded-lg bg-[#f7f8fc] p-3 ring-1 ring-black/5">
        <p className="text-[11px] leading-5 text-statera-slate">
          Oil pooling under pump 3, floor is slick near the walkway.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Unsafe condition", "Equipment", "Near miss"].map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              index === 0
                ? "bg-statera-ink text-white"
                : "bg-statera-mist text-statera-slate"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-12 flex-1 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-100 ring-1 ring-black/5" />
        <div className="h-12 w-12 rounded-lg bg-[#f7f8fc] ring-1 ring-black/5" />
      </div>

      <div className="mt-3 rounded-lg bg-statera-orange py-2 text-center text-[11px] font-semibold text-white">
        Submit report
      </div>

      <p className="mt-2 text-center text-[9px] text-zinc-400">
        Saved offline · sends when back in range
      </p>
    </div>
  );
}
