"use server";

import { revalidatePath } from "next/cache";

import { createLead } from "@/features/leads/repository";
import { leadCaptureServerSchema, type LeadCaptureInput } from "@/features/leads/schemas";
import type { LeadCaptureActionResponse } from "@/features/leads/types";
import { actionFailure, actionSuccess } from "@/lib/action-response";
import { getDatabaseErrorMessage, isRecoverableDatabaseError } from "@/lib/database";
import { sendLeadAlert } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function createLeadAction(
  input: LeadCaptureInput,
): Promise<LeadCaptureActionResponse> {
  const validated = leadCaptureServerSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the highlighted fields and try again.",
      validated.error.flatten().fieldErrors,
    );
  }

  try {
    const rateLimit = await checkRateLimit({
      key: `${validated.data.phone}:${validated.data.sourcePage}`,
      namespace: "lead-capture",
    });

    if (!rateLimit.allowed) {
      return actionFailure(rateLimit.reason ?? "Too many requests. Please try again later.");
    }

    const lead = await createLead(validated.data);

    revalidatePath("/dashboard/leads");

    // Fire-and-forget: admin email alert (non-blocking)
    sendLeadAlert({
      leadNumber: lead.leadNumber,
      name: validated.data.name,
      phone: validated.data.phone,
      email: validated.data.email,
      serviceInterest: validated.data.serviceInterest,
      location: validated.data.location,
      budgetRange: validated.data.budgetRange,
      message: validated.data.message,
      sourcePage: validated.data.sourcePage,
      utmSource: validated.data.utmSource,
      utmMedium: validated.data.utmMedium,
      utmCampaign: validated.data.utmCampaign,
    }).catch((err) => {
      console.error("[lead-alert] Email failed (non-fatal):", err);
    });

    return actionSuccess("Thanks. Your enquiry has been received.", {
      id: lead.id,
      leadNumber: lead.leadNumber,
    });
  } catch (error) {
    console.error("Lead creation failed", error);

    if (isRecoverableDatabaseError(error)) {
      return actionFailure(getDatabaseErrorMessage(error));
    }

    return actionFailure(
      "We could not submit your enquiry right now. Please try again in a moment.",
    );
  }
}
