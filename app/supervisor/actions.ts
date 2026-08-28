"use server";

import { revalidatePath } from "next/cache";
import { getUserProfile } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import type { TicketStatus } from "@/lib/supabase/types";
import {
  isPriorityLabel,
  type RankingFeedbackRecord,
} from "@/lib/tickets/ranking-feedback";
import { isTicketStatus } from "@/lib/tickets/status";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireSupervisor(): Promise<
  { ok: true; siteId: string } | { ok: false; error: string }
> {
  const profile = await getUserProfile();

  if (!profile) {
    return { ok: false, error: "You must be signed in." };
  }

  if (profile.role !== "supervisor") {
    return { ok: false, error: "Only supervisors can perform this action." };
  }

  return { ok: true, siteId: profile.site_id };
}

function revalidateTicket(ticketId: string) {
  revalidatePath("/supervisor");
  revalidatePath("/supervisor/open");
  revalidatePath("/supervisor/all");
  revalidatePath(`/supervisor/${ticketId}`);
  revalidatePath("/worker/tickets");
  revalidatePath(`/worker/tickets/${ticketId}`);
}

export async function changeTicketStatus(
  ticketId: string,
  newStatus: string,
): Promise<ActionResult> {
  const auth = await requireSupervisor();
  if (!auth.ok) {
    return auth;
  }

  if (!isTicketStatus(newStatus)) {
    return { ok: false, error: "Invalid status." };
  }

  if (newStatus === "Submitted") {
    return {
      ok: false,
      error: "Unassign the ticket to return it to Submitted.",
    };
  }

  if (newStatus === "Closed") {
    return {
      ok: false,
      error: "Only the worker who reported this ticket can close it.",
    };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("supervisor_change_ticket_status", {
    p_ticket_id: ticketId,
    p_new_status: newStatus as TicketStatus,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateTicket(ticketId);
  return { ok: true };
}

export async function assignTicketToSelf(ticketId: string): Promise<ActionResult> {
  const auth = await requireSupervisor();
  if (!auth.ok) {
    return auth;
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("supervisor_assign_ticket", {
    p_ticket_id: ticketId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateTicket(ticketId);
  return { ok: true };
}

export async function unassignTicket(ticketId: string): Promise<ActionResult> {
  const auth = await requireSupervisor();
  if (!auth.ok) {
    return auth;
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("supervisor_unassign_ticket", {
    p_ticket_id: ticketId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateTicket(ticketId);
  return { ok: true };
}

export async function addTicketMessage(
  ticketId: string,
  message: string,
): Promise<ActionResult> {
  const auth = await requireSupervisor();
  if (!auth.ok) {
    return auth;
  }

  const trimmed = message.trim();
  if (trimmed.length < 1) {
    return { ok: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > 500) {
    return { ok: false, error: "Message is too long (max 500 characters)." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("supervisor_add_ticket_note", {
    p_ticket_id: ticketId,
    p_note: trimmed,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateTicket(ticketId);
  return { ok: true };
}

export async function submitRankingFeedback(
  ticketId: string,
  agreed: boolean,
  reason: string,
  ranking: { label: string; score: number },
): Promise<ActionResult> {
  const auth = await requireSupervisor();
  if (!auth.ok) {
    return auth;
  }

  if (typeof agreed !== "boolean") {
    return { ok: false, error: "Choose whether the ranking looks right." };
  }

  if (!isPriorityLabel(ranking.label) || !Number.isFinite(ranking.score)) {
    return { ok: false, error: "Invalid ranking snapshot." };
  }

  const trimmedReason = reason.trim();
  if (!agreed && trimmedReason.length < 3) {
    return {
      ok: false,
      error: "Add a short reason so the AI can learn what was wrong.",
    };
  }
  if (trimmedReason.length > 500) {
    return { ok: false, error: "Reason is too long (max 500 characters)." };
  }

  const supabase = await createServerClient();
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("id")
    .eq("id", ticketId)
    .eq("site_id", auth.siteId)
    .maybeSingle();

  if (ticketError) {
    return { ok: false, error: ticketError.message };
  }

  if (!ticket) {
    return { ok: false, error: "Ticket not found." };
  }

  const feedback: RankingFeedbackRecord = {
    agreed,
    label: ranking.label,
    score: ranking.score,
    reason: trimmedReason || null,
    at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("tickets")
    .update({ ai_ranking_feedback: feedback })
    .eq("id", ticketId)
    .eq("site_id", auth.siteId);

  if (error) {
    return { ok: false, error: error.message };
  }

  const { data: interaction } = await supabase
    .from("ai_interactions")
    .select("id")
    .eq("ticket_id", ticketId)
    .eq("prompt_type", "pattern_check")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (interaction) {
    await supabase
      .from("ai_interactions")
      .update({ human_agreed: agreed })
      .eq("id", interaction.id);
  }

  revalidateTicket(ticketId);
  return { ok: true };
}
