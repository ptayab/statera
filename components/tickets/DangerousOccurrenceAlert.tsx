import { DANGEROUS_OCCURRENCE_CATEGORY } from "@/lib/tickets/categories";
import { CategoryGuidance } from "@/components/tickets/CategoryGuidance";

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
    <CategoryGuidance
      category={DANGEROUS_OCCURRENCE_CATEGORY}
      submitted={submitted}
    />
  );
}
