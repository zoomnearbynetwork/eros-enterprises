import { z } from "zod";

import { LEAD_SOURCES, LEAD_STATUSES } from "@/constants/lead";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const optionalTrimmedString = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).optional(),
);

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").optional().or(z.literal("")).transform((value) => value || undefined),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits.").max(20),
  companyName: optionalTrimmedString,
  projectName: optionalTrimmedString,
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  requirements: optionalTrimmedString,
  estimatedValue: z
    .coerce
    .number()
    .nonnegative("Estimated value must be zero or greater.")
    .optional(),
  siteAddress: optionalTrimmedString,
  city: optionalTrimmedString,
  state: optionalTrimmedString,
  notes: optionalTrimmedString,
  assignedToUserId: optionalTrimmedString,
  serviceId: optionalTrimmedString,
});

export type LeadInput = z.infer<typeof leadSchema>;
