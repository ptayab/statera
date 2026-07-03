type DangerousOccurrenceAlertProps = {
  /** When true, styles the alert for post-submit confirmation */
  submitted?: boolean;
};

/**
 * Prominent regulatory reminder — required trust feature per product spec.
 * Shown when Dangerous Occurrence is selected and again after submit.
 */
export function DangerousOccurrenceAlert({
  submitted = false,
}: DangerousOccurrenceAlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border-2 px-4 py-4 ${
        submitted
          ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/40"
          : "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30"
      }`}
    >
      <p className="text-base font-semibold text-amber-950 dark:text-amber-100">
        {submitted
          ? "Important — also report through official channels"
          : "Dangerous occurrence selected"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
        If anyone is hurt, at risk, or in immediate danger, follow your
        site&apos;s official emergency and regulatory reporting process{" "}
        <strong>right now</strong>. Do not wait for this app — Statera is an
        additional record, not a replacement for required site procedures.
      </p>
    </div>
  );
}
