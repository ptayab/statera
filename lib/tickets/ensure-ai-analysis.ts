import "server-only";

import { analyzeReportWithClaude } from "@/lib/ai/claude";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TicketUrgency } from "@/lib/supabase/types";
import type { TicketAiAnalysis } from "@/lib/tickets/ai-analysis";

type Supabase = SupabaseClient<Database>;

type AnalyzableTicket = {
  id: string;
  category: string;
  description: string;
  urgency: TicketUrgency;
};

export async function storeClaudeAnalysisForTicket(
  supabase: Supabase,
  ticket: AnalyzableTicket,
): Promise<TicketAiAnalysis | null> {
  const [{ data: openReports }, { data: priorFeedback }] = await Promise.all([
    supabase.rpc("list_open_reports_for_ai"),
    supabase.rpc("list_ranking_feedback_for_ai"),
  ]);

  const analysis = await analyzeReportWithClaude({
    category: ticket.category,
    urgency: ticket.urgency,
    description: ticket.description,
    candidates: (openReports ?? [])
      .filter((row) => row.id !== ticket.id)
      .map((row) => ({
        id: row.id,
        category: row.category,
        description: row.description,
      })),
    feedback: (priorFeedback ?? []).map((row) => ({
      category: row.category,
      description: row.description,
      rankingLabel: row.ranking_label,
      rankingScore: row.ranking_score,
      agreed: row.agreed,
      reason: row.reason,
    })),
  });

  if (!analysis) return null;

  const { error } = await supabase
    .from("tickets")
    .update({
      ai_analysis: analysis,
      ai_explanation: analysis.languageSummary,
      ai_suggested_priority: analysis.suggestedPriority,
    })
    .eq("id", ticket.id);

  if (error) {
    console.error("Could not save Claude analysis for ticket.", error);
    return null;
  }

  await supabase.from("ai_interactions").insert({
    ticket_id: ticket.id,
    prompt_type: "pattern_check",
    output: analysis,
  });

  return analysis;
}
