const COLUMNS = 10;
const UNREPORTED_ROWS = 9;

/**
 * One hundred incidents. The ten that get reported sit above the surface line;
 * the other ninety stay buried beneath it.
 */
export function UnreportedGrid() {
  return (
    <div aria-hidden className="w-[240px] max-w-full">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-statera-orange">
        Reported
      </p>
      <div className="mt-2.5 grid grid-cols-10 gap-1.5">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px] bg-statera-orange"
          />
        ))}
      </div>

      <div className="my-3 flex items-center gap-3">
        <span className="flex-1 border-t border-dashed border-white/35" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
          Surface
        </span>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: COLUMNS * UNREPORTED_ROWS }, (_, i) => (
          <span
            key={i}
            className="aspect-square rounded-[3px] bg-white/10"
          />
        ))}
      </div>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
        Unreported
      </p>
    </div>
  );
}
