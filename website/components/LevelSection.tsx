import type { ReactNode } from "react";

type LevelSectionProps = {
  id?: string;
  /** Two-digit level number painted on the rock wall. */
  level: string;
  /** Depth readout, e.g. "−140 m". */
  depth: string;
  /** Short name for this level, set vertically along the shaft. */
  label: string;
  /** Background class for the ground at this depth. */
  tone: string;
  /** Deep levels invert to light type. */
  dark?: boolean;
  /** Fleck texture class. */
  texture?: string;
  children: ReactNode;
};

export function LevelSection({
  id,
  level,
  depth,
  label,
  tone,
  dark = false,
  texture = "dust",
  children,
}: LevelSectionProps) {
  const line = dark ? "text-white/25" : "text-statera-ink/20";
  const numeral = dark
    ? "[-webkit-text-stroke:1px_rgba(255,255,255,0.45)]"
    : "[-webkit-text-stroke:1px_rgba(0,0,0,0.3)]";
  const meta = dark ? "text-white/55" : "text-statera-slate/75";

  return (
    <section
      id={id}
      className={`relative scroll-mt-20 ${tone} ${dark ? "text-white" : "text-statera-ink"}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${texture}`} aria-hidden />

      <div className="relative mx-auto flex max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        {/* Shaft rail: fixed width so the line stays plumb between levels. */}
        <div className="relative hidden w-28 shrink-0 lg:block" aria-hidden>
          <div className={`absolute inset-y-0 left-6 w-px ${line} bg-current`} />
          <div className={`shaft-ticks absolute inset-y-0 left-3 w-1.5 ${line}`} />

          <div className="sticky top-24">
            <div className="flex items-center gap-2">
              <span className={`h-px w-6 ${line} bg-current`} />
              <span
                className={`whitespace-nowrap text-[10px] font-semibold tracking-[0.16em] ${meta}`}
              >
                {depth}
              </span>
            </div>
            <p
              className={`mt-3 pl-1 font-display text-[54px] font-extrabold leading-none text-transparent ${numeral}`}
            >
              {level}
            </p>
            <p
              className={`mt-4 pl-5 text-[10px] font-semibold uppercase tracking-[0.3em] [writing-mode:vertical-rl] ${meta}`}
            >
              {label}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Compact level marker for narrow screens. */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className={`text-sm font-extrabold ${meta}`}>{level}</span>
            <span className={`h-px w-8 ${line} bg-current`} />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${meta}`}>
              {label} · {depth}
            </span>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
