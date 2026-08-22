"use server";

import { revalidatePath } from "next/cache";
import { getUserProfile } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function addWorkerTicketMessage(
  ticketId: string,
  message: string,
): Promise<ActionResult> {
  const profile = await getUserProfile();

  if (!profile) {
    return { ok: false, error: "You must be signed in." };
  }

  if (profile.role !== "worker") {
    return { ok: false, error: "Only workers can use this action." };
  }

  const trimmed = message.trim();
  if (trimmed.length < 1) {
    return { ok: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > 500) {
    return { ok: false, error: "Message is too long (max 500 characters)." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("worker_add_ticket_message", {
    p_ticket_id: ticketId,
    p_message: trimmed,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/worker/tickets");
  revalidatePath(`/worker/tickets/${ticketId}`);
  revalidatePath(`/supervisor/${ticketId}`);
  revalidatePath("/supervisor");
  revalidatePath("/supervisor/open");
  revalidatePath("/supervisor/all");

  return { ok: true };
}

export async function closeWorkerTicket(
  ticketId: string,
): Promise<ActionResult> {
  const profile = await getUserProfile();

  if (!profile) {
    return { ok: false, error: "You must be signed in." };
  }

  if (profile.role !== "worker") {
    return { ok: false, error: "Only workers can close tickets." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.rpc("worker_close_ticket", {
    p_ticket_id: ticketId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/worker/tickets");
  revalidatePath(`/worker/tickets/${ticketId}`);
  revalidatePath(`/supervisor/${ticketId}`);
  revalidatePath("/supervisor");
  revalidatePath("/supervisor/open");
  revalidatePath("/supervisor/all");

  return { ok: true };
}
