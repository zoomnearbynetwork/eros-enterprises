import { z } from "zod";

import { normalizePhoneNumber } from "@/features/whatsapp/utils";

const normalizedPhoneSchema = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number.")
  .transform((value) => normalizePhoneNumber(value))
  .refine((value) => value.length >= 8, "Enter a valid phone number.");

const optionalIdSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => value || undefined);

export const sendWhatsAppMessageSchema = z
  .object({
    conversationId: optionalIdSchema,
    leadId: optionalIdSchema,
    customerId: optionalIdSchema,
    recipientPhone: z.string().trim().optional().default(""),
    displayName: z.string().trim().max(120).optional(),
    body: z.string().trim().min(1, "Message body is required.").max(2000),
  })
  .superRefine((value, ctx) => {
    if (!value.conversationId && !value.recipientPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a conversation or enter a recipient phone number.",
        path: ["recipientPhone"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    recipientPhone: value.recipientPhone
      ? normalizedPhoneSchema.parse(value.recipientPhone)
      : undefined,
    displayName: value.displayName || undefined,
  }));

export const simulateInboundWhatsAppMessageSchema = z
  .object({
    conversationId: optionalIdSchema,
    leadId: optionalIdSchema,
    customerId: optionalIdSchema,
    recipientPhone: normalizedPhoneSchema.optional(),
    displayName: z.string().trim().max(120).optional(),
    body: z.string().trim().min(1, "Inbound message is required.").max(2000),
  })
  .superRefine((value, ctx) => {
    if (!value.conversationId && !value.recipientPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a conversation or enter a sender phone number.",
        path: ["recipientPhone"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    displayName: value.displayName || undefined,
  }));
