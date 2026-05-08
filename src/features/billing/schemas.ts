import { z } from "zod";

import {
  INVOICE_STATUSES,
  PAYMENT_METHODS,
  QUOTATION_STATUSES,
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

const optionalText = optionalString.transform((value) =>
  typeof value === "string" ? sanitizeTextInput(value) : undefined,
);

const optionalMultilineText = optionalString.transform((value) =>
  typeof value === "string" ? sanitizeMultilineTextInput(value) : undefined,
);

const requiredText = z
  .string()
  .transform(sanitizeTextInput)
  .pipe(z.string().min(1, "This field is required."));

const numberField = z.coerce.number().finite();

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

const dateTimeField = z
  .string()
  .min(1, "Please choose a date and time.")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid date and time.");

const billingItemSchema = z.object({
  serviceId: optionalString,
  name: requiredText,
  description: optionalMultilineText,
  quantity: numberField.positive("Quantity must be greater than zero."),
  unitPrice: numberField.min(0, "Unit price cannot be negative."),
  taxRate: numberField.min(0, "Tax rate cannot be negative.").max(100, "Tax rate cannot exceed 100."),
});

export const quotationInputSchema = z.object({
  leadId: optionalString,
  customerId: optionalString,
  title: optionalText,
  issueDate: dateOnlyField,
  validUntil: optionalDateOnlyField,
  notes: optionalMultilineText,
  discountAmount: numberField.min(0, "Discount cannot be negative."),
  items: z.array(billingItemSchema).min(1, "At least one quotation item is required."),
}).superRefine((value, ctx) => {
  if (!value.leadId && !value.customerId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select a lead or a customer before saving the quotation.",
      path: ["leadId"],
    });
  }
});

export const createQuotationSchema = quotationInputSchema;

export const updateQuotationSchema = quotationInputSchema.extend({
  quotationId: z.string().min(1),
});

export const updateQuotationStatusSchema = z.object({
  quotationId: z.string().min(1),
  status: z.enum(QUOTATION_STATUSES),
});

export const convertQuotationToInvoiceSchema = z.object({
  quotationId: z.string().min(1),
  issueDate: dateOnlyField,
  dueDate: optionalDateOnlyField,
  title: optionalText,
  notes: optionalMultilineText,
});

export const updateInvoiceStatusSchema = z.object({
  invoiceId: z.string().min(1),
  status: z.enum(INVOICE_STATUSES),
});

export const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: numberField.positive("Payment amount must be greater than zero."),
  method: z.enum(PAYMENT_METHODS),
  paidAt: dateTimeField,
  reference: optionalText,
  notes: optionalMultilineText,
});
