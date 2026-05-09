import { z } from "zod";

import {
  CUSTOMER_TYPES,
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  SITE_VISIT_STATUSES,
} from "@/features/crm/constants";
import {
  sanitizeMultilineTextInput,
  sanitizePhoneInput,
  sanitizeTextInput,
} from "@/features/leads/sanitizers";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const requiredText = z
  .string()
  .transform(sanitizeTextInput)
  .pipe(z.string().min(1, "This field is required."));

const requiredNote = z
  .string()
  .transform(sanitizeMultilineTextInput)
  .pipe(z.string().min(2, "Please enter a note.").max(2000, "Note is too long."));

const datetimeStringSchema = z
  .string()
  .min(1, "Please choose a date and time.")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid date and time.");

export const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(LEAD_STATUSES),
});

export const updateLeadPrioritySchema = z.object({
  leadId: z.string().min(1),
  priority: z.enum(LEAD_PRIORITIES),
});

export const assignLeadSchema = z.object({
  leadId: z.string().min(1),
  userId: z.string().min(1),
});

export const convertLeadToCustomerSchema = z.object({
  leadId: z.string().min(1),
  customerType: z.enum(CUSTOMER_TYPES).default("INDIVIDUAL"),
});

export const addLeadNoteSchema = z.object({
  leadId: z.string().min(1),
  note: requiredNote,
});

export const createSiteVisitSchema = z.object({
  leadId: z.string().min(1),
  scheduledAt: datetimeStringSchema,
  address: requiredText,
  serviceInterest: requiredText,
  notes: optionalString.transform((value) =>
    typeof value === "string" ? sanitizeMultilineTextInput(value) : undefined,
  ),
  assignedEngineerId: optionalString,
});

export const updateSiteVisitStatusSchema = z.object({
  siteVisitId: z.string().min(1),
  status: z.enum(SITE_VISIT_STATUSES),
});

export const assignSiteVisitEngineerSchema = z.object({
  siteVisitId: z.string().min(1),
  userId: z.string().min(1),
});

export const addCustomerNoteSchema = z.object({
  customerId: z.string().min(1),
  note: requiredNote,
});

export const addSiteVisitNoteSchema = z.object({
  siteVisitId: z.string().min(1),
  note: requiredNote,
});

export const crmListSearchSchema = z.object({
  query: optionalString.transform((value) =>
    typeof value === "string" ? sanitizeTextInput(value) : undefined,
  ),
  status: optionalString,
  priority: optionalString,
  source: optionalString,
  service: optionalString,
  type: optionalString,
  assignee: optionalString,
});

export const customerCreateInputSchema = z.object({
  legalName: requiredText,
  primaryContactName: optionalString.transform((value) =>
    typeof value === "string" ? sanitizeTextInput(value) : undefined,
  ),
  email: optionalString.pipe(z.email().optional()),
  phone: optionalString.transform((value) =>
    typeof value === "string" ? sanitizePhoneInput(value) : undefined,
  ),
});
