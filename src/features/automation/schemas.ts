import { z } from "zod";

export const automationRuleSchema = z
  .object({
    ruleId: z.string().trim().optional(),
    name: z.string().trim().min(3, "Rule name must be at least 3 characters.").max(120),
    description: z.string().trim().max(400).optional(),
    triggerType: z.enum([
      "LEAD_CREATED",
      "SITE_VISIT_SCHEDULED",
      "QUOTATION_SENT",
      "INVOICE_SENT",
      "PAYMENT_DUE",
      "AMC_RENEWAL_DUE",
    ]),
    actionType: z.enum([
      "SEND_WHATSAPP_MESSAGE",
      "CREATE_TASK",
      "INTERNAL_NOTIFICATION",
    ]),
    isActive: z.boolean(),
    delayMinutes: z.coerce.number().int().min(0).max(525600),
    messageTemplate: z.string().trim().max(2000).optional(),
    taskTitle: z.string().trim().max(160).optional(),
    taskDescription: z.string().trim().max(2000).optional(),
    notificationTitle: z.string().trim().max(160).optional(),
    notificationMessage: z.string().trim().max(2000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.actionType === "SEND_WHATSAPP_MESSAGE" && !value.messageTemplate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A WhatsApp template is required for this action.",
        path: ["messageTemplate"],
      });
    }

    if (value.actionType === "CREATE_TASK" && !value.taskTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A task title is required for this action.",
        path: ["taskTitle"],
      });
    }

    if (value.actionType === "INTERNAL_NOTIFICATION" && !value.notificationMessage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A notification message is required for this action.",
        path: ["notificationMessage"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    ruleId: value.ruleId || undefined,
    description: value.description || undefined,
    messageTemplate: value.messageTemplate || undefined,
    taskTitle: value.taskTitle || undefined,
    taskDescription: value.taskDescription || undefined,
    notificationTitle: value.notificationTitle || undefined,
    notificationMessage: value.notificationMessage || undefined,
  }));
