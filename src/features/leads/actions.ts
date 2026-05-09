"use server";

import { revalidatePath } from "next/cache";

import { createLead } from "@/features/leads/repository";
import { leadCaptureServerSchema, type LeadCaptureInput } from "@/features/leads/schemas";
import type { LeadCaptureActionResponse } from "@/features/leads/types";
import { actionFailure, actionSuccess } from "@/lib/action-response";
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

    return actionSuccess("Thanks. Your enquiry has been received.", {
      id: lead.id,
      leadNumber: lead.leadNumber,
    });
  } catch (error) {
    console.error("Lead creation failed", error);

    return actionFailure(
      "We could not submit your enquiry right now. Please try again in a moment.",
    );
  }
}
