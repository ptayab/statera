"use server";

import { revalidatePath } from "next/cache";
import { getUserProfile } from "@/lib/auth/session";
import { analyzeReportWithClaude } from "@/lib/ai/claude";
import { createServerClient } from "@/lib/supabase/server";
import {
  DANGEROUS_OCCURRENCE_CATEGORY,
  isPilotTicketCategory,
} from "@/lib/tickets/categories";
import { isTicketUrgency } from "@/lib/tickets/scoring";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export type SubmitTicketResult =
  | { ok: true; ticketId: string; isDangerousOccurrence: boolean }
  | { ok: false; error: string };

export async function submitTicket(
  formData: FormData,
): Promise<SubmitTicketResult> {
  const profile = await getUserProfile();

  if (!profile) {
    return { ok: false, error: "You must be signed in to submit a report." };
  }

  if (profile.role !== "worker") {
    return { ok: false, error: "Only workers can submit reports." };
  }

  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const urgencyRaw = String(formData.get("urgency") ?? "Medium").trim();
  const photo = formData.get("photo");

  if (!isPilotTicketCategory(category)) {
    return { ok: false, error: "Please choose a valid category." };
  }

  if (!isTicketUrgency(urgencyRaw)) {
    return { ok: false, error: "Please choose a valid urgency." };
  }

  if (description.length < 3) {
    return {
      ok: false,
      error: "Please add a short description (at least 3 characters).",
    };
  }

  if (description.length > 5000) {
    return { ok: false, error: "Description is too long (max 5000 characters)." };
  }

  let photoPath: string | null = null;
  const supabase = await createServerClient();

  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return { ok: false, error: "Photo must be 5 MB or smaller." };
    }

    if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
      return {
        ok: false,
        error: "Photo must be JPEG, PNG, or WebP.",
      };
    }

    const extension = photo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const objectPath = `${profile.site_id}/${profile.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("ticket-photos")
      .upload(objectPath, photo, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        ok: false,
        error: `Photo upload failed: ${uploadError.message}`,
      };
    }

    photoPath = objectPath;
  }

  let analysis = null;
  try {
    const { data: openReports } = await supabase.rpc(
      "list_open_reports_for_ai",
    );
    analysis = await analyzeReportWithClaude({
      category,
      urgency: urgencyRaw,
      description,
      candidates: (openReports ?? []).map((row) => ({
        id: row.id,
        category: row.category,
        description: row.description,
      })),
    });
  } catch (error) {
    console.error("Claude analysis failed; submitting without it.", error);
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      created_by: profile.id,
      site_id: profile.site_id,
      category,
      description,
      urgency: urgencyRaw,
      photo_url: photoPath,
      status: "Submitted",
      ai_suggested_priority: analysis?.suggestedPriority ?? null,
      ai_explanation: analysis?.languageSummary ?? null,
      ai_analysis: analysis,
    })
    .select("id")
    .single();

  if (ticketError || !ticket) {
    return {
      ok: false,
      error: ticketError?.message ?? "Could not save your report. Try again.",
    };
  }

  const { error: eventError } = await supabase.from("ticket_events").insert({
    ticket_id: ticket.id,
    event_type: "created",
    actor: profile.id,
    payload: {
      category,
      description,
      urgency: urgencyRaw,
      has_photo: Boolean(photoPath),
    },
  });

  if (eventError) {
    return {
      ok: false,
      error: eventError.message,
    };
  }

  if (analysis) {
    await supabase.from("ai_interactions").insert({
      ticket_id: ticket.id,
      prompt_type: "pattern_check",
      output: analysis,
    });
  }

  revalidatePath("/worker");
  revalidatePath("/worker/submit");
  revalidatePath("/worker/tickets");
  revalidatePath("/supervisor");
  revalidatePath("/supervisor/open");
  revalidatePath("/supervisor/all");
  revalidatePath("/supervisor/priority");

  return {
    ok: true,
    ticketId: ticket.id,
    isDangerousOccurrence: category === DANGEROUS_OCCURRENCE_CATEGORY,
  };
}
