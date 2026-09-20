type StrataDividerProps = {
  /** Text colour class for the incoming ground, e.g. text-level-2. */
  tone: string;
  /** Seam line colour class. */
  seam?: string;
};

/**
 * The irregular rock seam between two levels. The path is painted in the
 * incoming ground tone, so the next level appears to cut into the last one.
 */
export function StrataDivider({
  tone,
  seam = "stroke-statera-ink/15",
}: StrataDividerProps) {
  return (
    <div className={`relative -mb-px h-10 sm:h-14 ${tone}`} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0 34 C 180 8 330 62 520 44 C 700 27 880 68 1080 42 C 1230 22 1350 50 1440 32 L1440 80 L0 80 Z"
          fill="currentColor"
        />
        <path
          d="M0 34 C 180 8 330 62 520 44 C 700 27 880 68 1080 42 C 1230 22 1350 50 1440 32"
          fill="none"
          strokeWidth="1"
          className={seam}
        />
        <path
          d="M0 34 C 180 8 330 62 520 44 C 700 27 880 68 1080 42 C 1230 22 1350 50 1440 32"
          fill="none"
          strokeWidth="6"
          strokeDasharray="1 22"
          className={seam}
        />
      </svg>
    </div>
  );
}
