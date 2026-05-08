export const AUTOMATION_TRIGGER_TYPES = [
  "LEAD_CREATED",
  "SITE_VISIT_SCHEDULED",
  "QUOTATION_SENT",
  "INVOICE_SENT",
  "PAYMENT_DUE",
  "AMC_RENEWAL_DUE",
] as const;

export const AUTOMATION_ACTION_TYPES = [
  "SEND_WHATSAPP_MESSAGE",
  "CREATE_TASK",
  "INTERNAL_NOTIFICATION",
] as const;

export const AUTOMATION_TRIGGER_LABELS: Record<
  (typeof AUTOMATION_TRIGGER_TYPES)[number],
  string
> = {
  LEAD_CREATED: "Lead Created",
  SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
  QUOTATION_SENT: "Quotation Sent",
  INVOICE_SENT: "Invoice Sent",
  PAYMENT_DUE: "Payment Due",
  AMC_RENEWAL_DUE: "AMC Renewal Due",
};

export const AUTOMATION_ACTION_LABELS: Record<
  (typeof AUTOMATION_ACTION_TYPES)[number],
  string
> = {
  SEND_WHATSAPP_MESSAGE: "Send WhatsApp Message",
  CREATE_TASK: "Create Task",
  INTERNAL_NOTIFICATION: "Internal Notification",
};
