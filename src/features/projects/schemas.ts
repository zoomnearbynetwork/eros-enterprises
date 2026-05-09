import { z } from "zod";

import {
  AMC_STATUSES,
  PROJECT_STAGES,
} from "@/features/crm/constants";
import {
  sanitizeMultilineTextInput,
  sanitizeTextInput,
} from "@/features/leads/sanitizers";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const optionalMultilineText = optionalString.transform((value) =>
  typeof value === "string" ? sanitizeMultilineTextInput(value) : undefined,
);

const requiredText = z
  .string()
  .transform(sanitizeTextInput)
  .pipe(z.string().min(1, "This field is required."));

const dateOnlyField = z
  .string()
  .min(1, "Please choose a date.")
  .transform((value) => new Date(`${value}T00:00:00.000Z`))
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid date.");

const optionalDateOnlyField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional()).transform((value) => {
  if (!value) {
    return undefined;
  }

  return new Date(`${value}T00:00:00.000Z`);
}).refine((value) => value === undefined || !Number.isNaN(value.getTime()), "Invalid date.");

export const createProjectSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  quotationId: optionalString,
  title: requiredText,
  description: optionalMultilineText,
  startDate: optionalDateOnlyField,
  targetCompletionDate: optionalDateOnlyField,
  projectManagerId: optionalString,
  siteEngineerId: optionalString,
}).superRefine((value, ctx) => {
  if (
    value.startDate &&
    value.targetCompletionDate &&
    value.targetCompletionDate.getTime() < value.startDate.getTime()
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Target completion date must be on or after the start date.",
      path: ["targetCompletionDate"],
    });
  }
});

export const updateProjectStageSchema = z.object({
  projectId: z.string().min(1),
  stage: z.enum(PROJECT_STAGES),
});

export const updateProjectAssignmentsSchema = z.object({
  projectId: z.string().min(1),
  projectManagerId: optionalString,
  siteEngineerId: optionalString,
});

export const updateProjectProgressSchema = z.object({
  projectId: z.string().min(1),
  progressPercent: z.coerce.number().int().min(0).max(100),
});

export const addProjectNoteSchema = z.object({
  projectId: z.string().min(1),
  note: z.string().transform(sanitizeMultilineTextInput).pipe(
    z.string().min(1, "Please enter a note."),
  ),
});

export const createAmcPlanSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  projectId: optionalString,
  serviceId: optionalString,
  title: requiredText,
  description: optionalMultilineText,
  startDate: dateOnlyField,
  endDate: dateOnlyField,
  renewalDate: dateOnlyField,
}).superRefine((value, ctx) => {
  if (value.endDate.getTime() < value.startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    });
  }

  if (value.renewalDate.getTime() < value.startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Renewal date must be on or after the start date.",
      path: ["renewalDate"],
    });
  }
});

export const updateAmcStatusSchema = z.object({
  amcPlanId: z.string().min(1),
  status: z.enum(AMC_STATUSES),
});

export const updateAmcDatesSchema = z.object({
  amcPlanId: z.string().min(1),
  startDate: dateOnlyField,
  endDate: dateOnlyField,
  renewalDate: dateOnlyField,
}).superRefine((value, ctx) => {
  if (value.endDate.getTime() < value.startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    });
  }

  if (value.renewalDate.getTime() < value.startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Renewal date must be on or after the start date.",
      path: ["renewalDate"],
    });
  }
});

export const addAmcNoteSchema = z.object({
  amcPlanId: z.string().min(1),
  note: z.string().transform(sanitizeMultilineTextInput).pipe(
    z.string().min(1, "Please enter a note."),
  ),
});
