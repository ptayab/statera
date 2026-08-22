import { getCategoryMeta } from "@/lib/tickets/categories";

type CategoryGuidanceProps = {
  category: string;
  /** After submit, uses the follow-up warning copy. */
  submitted?: boolean;
  showDescription?: boolean;
};

export function CategoryGuidance({
  category,
  submitted = false,
  showDescription = false,
}: CategoryGuidanceProps) {
  const meta = getCategoryMeta(category);
  if (!meta) return null;

  const warning = meta.warning;
  const showWarning = Boolean(warning) && (!submitted || meta.warnOnSubmit);

  if (!showDescription && !showWarning) return null;

  return (
    <div className="space-y-3">
      {showDescription ? (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {meta.description}
        </p>
      ) : null}

      {showWarning && warning ? (
        <div
          role="alert"
          className={`rounded-xl border-2 px-4 py-4 ${
            submitted
              ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/40"
              : "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30"
          }`}
        >
          <p className="text-base font-semibold text-amber-950 dark:text-amber-100">
            {submitted ? warning.submittedTitle : warning.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
            {submitted ? warning.submittedBody : warning.body}
          </p>
        </div>
      ) : null}
    </div>
  );
}
