import Anthropic from "@anthropic-ai/sdk";
import type { TicketAiAnalysis } from "@/lib/tickets/ai-analysis";

export const CLAUDE_MODEL = "claude-sonnet-4-5";

export type OpenReportCandidate = {
  id: string;
  category: string;
  description: string;
};

type ClaudeAnalysisInput = {
  category: string;
  urgency: string;
  description: string;
  candidates: OpenReportCandidate[];
};

function extractJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function analyzeReportWithClaude(
  input: ClaudeAnalysisInput,
): Promise<TicketAiAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn(
      "ANTHROPIC_API_KEY is not set — skipping Claude analysis and using the keyword fallback.",
    );
    return null;
  }

  const client = new Anthropic({ apiKey });
  const candidateIds = new Set(input.candidates.map((row) => row.id));

  const candidateBlock =
    input.candidates.length === 0
      ? "(none)"
      : input.candidates
          .map(
            (row) =>
              `- id: ${row.id}\n  category: ${row.category}\n  description: ${row.description.slice(0, 500)}`,
          )
          .join("\n");

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are ranking workplace safety reports for a supervisor.

New report:
- category: ${input.category}
- worker-rated urgency: ${input.urgency}
- description: ${input.description}

Open reports at the same site (may describe the SAME incident in different words):
${candidateBlock}

Return ONLY a JSON object with:
{
  "descriptionPts": <integer 0-20>,
  "suggestedPriority": "Low" | "Medium" | "High" | "Critical",
  "languageSummary": "<1-2 sentences on how severe the wording is and why>",
  "duplicateIds": ["<uuid>", ...],
  "duplicateReason": "<why they are the same incident, or null>"
}

Rules for descriptionPts:
- 20: immediate harm, injury, fire, collapse, electrical shock, emergency
- 10: broken equipment, leak, blockage, serious risk language
- 5: general concern / unsafe / problem without imminent harm
- 0: routine, unclear, or no safety urgency in the wording
Judge meaning, including paraphrases, slang, and negation (e.g. "no fire" is not urgent).

Rules for duplicateIds:
- Include an id only if it is very likely the SAME real-world issue (same hazard, place, or incident), even if the wording differs.
- Do NOT match just because the category is the same.
- Only use ids from the open-reports list.
- If none match, use [].`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const parsed = extractJsonObject(text);
  if (!parsed) {
    console.warn("Claude returned no JSON for ticket analysis.");
    return null;
  }

  const ptsRaw = Number(parsed.descriptionPts);
  const descriptionPts = Number.isFinite(ptsRaw)
    ? Math.max(0, Math.min(20, Math.round(ptsRaw)))
    : 0;

  const duplicateIds = Array.isArray(parsed.duplicateIds)
    ? parsed.duplicateIds.filter(
        (id): id is string =>
          typeof id === "string" && candidateIds.has(id),
      )
    : [];

  return {
    descriptionPts,
    languageSummary:
      typeof parsed.languageSummary === "string"
        ? parsed.languageSummary.slice(0, 600)
        : "Claude analysed this report.",
    suggestedPriority:
      typeof parsed.suggestedPriority === "string"
        ? parsed.suggestedPriority
        : "Medium",
    duplicateIds,
    duplicateReason:
      typeof parsed.duplicateReason === "string"
        ? parsed.duplicateReason.slice(0, 400)
        : null,
    model: CLAUDE_MODEL,
    analyzedAt: new Date().toISOString(),
  };
}
