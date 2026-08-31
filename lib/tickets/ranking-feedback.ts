import type { PriorityLabel } from "@/lib/tickets/scoring";

const LABELS = new Set<PriorityLabel>(["Critical", "High", "Medium", "Low"]);

export type RankingFeedbackRecord = {
  agreed: boolean;
  label: PriorityLabel;
  score: number;
  reason: string | null;
  at: string;
};

export function isPriorityLabel(value: string): value is PriorityLabel {
  return LABELS.has(value as PriorityLabel);
}

export function parseRankingFeedback(
  value: unknown,
): RankingFeedbackRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.agreed !== "boolean") {
    return null;
  }
  if (typeof record.label !== "string" || !isPriorityLabel(record.label)) {
    return null;
  }
  if (typeof record.score !== "number" || !Number.isFinite(record.score)) {
    return null;
  }
  if (record.reason != null && typeof record.reason !== "string") {
    return null;
  }
  if (typeof record.at !== "string") {
    return null;
  }

  return {
    agreed: record.agreed,
    label: record.label,
    score: record.score,
    reason: typeof record.reason === "string" ? record.reason : null,
    at: record.at,
  };
}
