"use server";

import { revalidatePath } from "next/cache";
import { getUserProfile } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import type { TicketStatus } from "@/lib/supabase/types";
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
