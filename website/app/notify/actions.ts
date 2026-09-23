"use server";

export type SubmitEnquiryResult =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FORM_ID = "xqpaqdlg";

function formId(): string | undefined {
  const value =
    process.env.FORMSPREE_FORM_ID?.trim() ||
    process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim() ||
    DEFAULT_FORM_ID;
  return value || undefined;
}

export async function submitEnquiry(
  _prev: SubmitEnquiryResult | null,
  formData: FormData,
): Promise<SubmitEnquiryResult> {
  // Honeypot: bots fill hidden fields; treat as success without sending.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const organization = String(formData.get("organization") ?? "").trim();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (organization.length < 2) {
    return { ok: false, error: "Please enter your company or site name." };
  }

  if (organization.length > 200) {
    return {
      ok: false,
      error: "Company or site name must be 200 characters or fewer.",
    };
  }

  const id = formId();
  if (!id) {
    console.error(
      "Enquiry form is not connected. Set FORMSPREE_FORM_ID (or NEXT_PUBLIC_FORMSPREE_FORM_ID).",
    );
    return {
      ok: false,
      error:
        process.env.NODE_ENV === "development"
          ? "Set FORMSPREE_FORM_ID in website/.env.local (see website/.env.example)."
          : "We could not send your request. Please try again shortly.",
    };
  }

  const body = new FormData();
  body.set("email", email);
  body.set("_replyto", email);
  body.set("_subject", "Statera enquiry");
  body.set("organization", organization);
  body.set(
    "message",
    `${email} from ${organization} asked to talk about a Statera pilot.`,
  );

  try {
    const response = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string; errors?: Array<{ message?: string }> }
      | null;

    if (!response.ok) {
      const detail =
        payload?.error ||
        payload?.errors?.map((item) => item.message).filter(Boolean).join(" ") ||
        null;
      console.error("Formspree rejected the enquiry.", response.status, detail);
      return {
        ok: false,
        error: detail || "We could not send your request. Please try again shortly.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Enquiry submit failed.", error);
    return {
      ok: false,
      error: "We could not send your request. Please try again shortly.",
    };
  }
}
