const COLUMNS = 10;
const UNREPORTED_ROWS = 9;

// Mirrors the .stat-count animation in globals.css (0.25s delay, 1.7s ease-out
// quad) so each row sinks as the headline count passes it.
const COUNT_DELAY_MS = 250;
const COUNT_DURATION_MS = 1700;

function rowDelay(row: number) {
  return COUNT_DELAY_MS + COUNT_DURATION_MS * (1 - Math.sqrt(1 - row / UNREPORTED_ROWS));
}

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
        {Array.from({ length: COLUMNS * UNREPORTED_ROWS }, (_, i) => {
          const jitter = ((i % COLUMNS) * 7) % COLUMNS;
          const delay = rowDelay(Math.floor(i / COLUMNS)) + jitter * 12;
          return (
            <span
              key={i}
              className="gap-cell aspect-square rounded-[3px] bg-white/10"
              style={{ animationDelay: `${Math.round(delay)}ms` }}
            />
          );
        })}
      </div>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
        Unreported
      </p>
    </div>
  );
}
