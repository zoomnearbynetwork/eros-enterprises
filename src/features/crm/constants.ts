export const LEAD_SOURCES = [
  "WEBSITE",
  "WHATSAPP",
  "REFERRAL",
  "CALL",
  "WALK_IN",
  "OTHER",
] as const;

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "SITE_VISIT_SCHEDULED",
  "QUOTATION_SENT",
  "WON",
  "LOST",
] as const;

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const BUDGET_RANGES = [
  "Below Rs. 50,000",
  "Rs. 50,000 - Rs. 2,00,000",
  "Rs. 2,00,000 - Rs. 5,00,000",
  "Rs. 5,00,000 - Rs. 10,00,000",
  "Above Rs. 10,00,000",
] as const;

export const CUSTOMER_STATUSES = ["ONBOARDING", "ACTIVE", "INACTIVE"] as const;

export const CUSTOMER_TYPES = ["INDIVIDUAL", "BUSINESS", "INSTITUTIONAL"] as const;

export const SITE_VISIT_STATUSES = [
  "SCHEDULED",
  "ASSIGNED",
  "COMPLETED",
  "RESCHEDULED",
  "CANCELLED",
] as const;

export const QUOTATION_STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
] as const;

export const INVOICE_STATUSES = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

export const PROJECT_STAGES = [
  "PLANNED",
  "MATERIAL_ORDERED",
  "WORK_STARTED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CLOSED",
] as const;

export const AMC_STATUSES = [
  "ACTIVE",
  "DUE_SOON",
  "EXPIRED",
  "RENEWED",
  "CANCELLED",
] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
  "CARD",
  "OTHER",
] as const;

export const ACTIVITY_TYPES = [
  "LEAD_CREATED",
  "LEAD_STATUS_CHANGED",
  "LEAD_PRIORITY_CHANGED",
  "LEAD_ASSIGNED",
  "LEAD_CONVERTED_TO_CUSTOMER",
  "SITE_VISIT_SCHEDULED",
  "SITE_VISIT_UPDATED",
  "CUSTOMER_CREATED",
  "NOTE_ADDED",
  "QUOTATION_CREATED",
  "QUOTATION_UPDATED",
  "QUOTATION_STATUS_CHANGED",
  "QUOTATION_CONVERTED_TO_INVOICE",
  "INVOICE_CREATED",
  "INVOICE_UPDATED",
  "INVOICE_STATUS_CHANGED",
  "PAYMENT_RECORDED",
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_STAGE_CHANGED",
  "PROJECT_MANAGER_ASSIGNED",
  "PROJECT_ENGINEER_ASSIGNED",
  "PROJECT_PROGRESS_UPDATED",
  "AMC_PLAN_CREATED",
  "AMC_PLAN_UPDATED",
  "AMC_STATUS_CHANGED",
  "AMC_RENEWAL_RECORDED",
  "WHATSAPP_MESSAGE_RECEIVED",
  "WHATSAPP_MESSAGE_SENT",
  "AUTOMATION_RULE_CREATED",
  "AUTOMATION_RULE_UPDATED",
] as const;

export const LEAD_SOURCE_LABELS: Record<(typeof LEAD_SOURCES)[number], string> = {
  WEBSITE: "Website",
  WHATSAPP: "WhatsApp",
  REFERRAL: "Referral",
  CALL: "Call",
  WALK_IN: "Walk-in",
  OTHER: "Other",
};

export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
  QUOTATION_SENT: "Quotation Sent",
  WON: "Won",
  LOST: "Lost",
};

export const LEAD_PRIORITY_LABELS: Record<(typeof LEAD_PRIORITIES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const CUSTOMER_STATUS_LABELS: Record<(typeof CUSTOMER_STATUSES)[number], string> = {
  ONBOARDING: "Onboarding",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const CUSTOMER_TYPE_LABELS: Record<(typeof CUSTOMER_TYPES)[number], string> = {
  INDIVIDUAL: "Individual",
  BUSINESS: "Business",
  INSTITUTIONAL: "Institutional",
};

export const SITE_VISIT_STATUS_LABELS: Record<
  (typeof SITE_VISIT_STATUSES)[number],
  string
> = {
  SCHEDULED: "Scheduled",
  ASSIGNED: "Assigned",
  COMPLETED: "Completed",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
};

export const QUOTATION_STATUS_LABELS: Record<
  (typeof QUOTATION_STATUSES)[number],
  string
> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export const INVOICE_STATUS_LABELS: Record<
  (typeof INVOICE_STATUSES)[number],
  string
> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export const PROJECT_STAGE_LABELS: Record<
  (typeof PROJECT_STAGES)[number],
  string
> = {
  PLANNED: "Planned",
  MATERIAL_ORDERED: "Material Ordered",
  WORK_STARTED: "Work Started",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

export const AMC_STATUS_LABELS: Record<
  (typeof AMC_STATUSES)[number],
  string
> = {
  ACTIVE: "Active",
  DUE_SOON: "Due Soon",
  EXPIRED: "Expired",
  RENEWED: "Renewed",
  CANCELLED: "Cancelled",
};

export const PAYMENT_METHOD_LABELS: Record<
  (typeof PAYMENT_METHODS)[number],
  string
> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CHEQUE: "Cheque",
  CARD: "Card",
  OTHER: "Other",
};

export const ACTIVITY_TYPE_LABELS: Record<(typeof ACTIVITY_TYPES)[number], string> = {
  LEAD_CREATED: "Lead Created",
  LEAD_STATUS_CHANGED: "Status Updated",
  LEAD_PRIORITY_CHANGED: "Priority Updated",
  LEAD_ASSIGNED: "Lead Assigned",
  LEAD_CONVERTED_TO_CUSTOMER: "Converted to Customer",
  SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
  SITE_VISIT_UPDATED: "Site Visit Updated",
  CUSTOMER_CREATED: "Customer Created",
  NOTE_ADDED: "Note Added",
  QUOTATION_CREATED: "Quotation Created",
  QUOTATION_UPDATED: "Quotation Updated",
  QUOTATION_STATUS_CHANGED: "Quotation Status Updated",
  QUOTATION_CONVERTED_TO_INVOICE: "Converted to Invoice",
  INVOICE_CREATED: "Invoice Created",
  INVOICE_UPDATED: "Invoice Updated",
  INVOICE_STATUS_CHANGED: "Invoice Status Updated",
  PAYMENT_RECORDED: "Payment Recorded",
  PROJECT_CREATED: "Project Created",
  PROJECT_UPDATED: "Project Updated",
  PROJECT_STAGE_CHANGED: "Project Stage Updated",
  PROJECT_MANAGER_ASSIGNED: "Project Manager Assigned",
  PROJECT_ENGINEER_ASSIGNED: "Site Engineer Assigned",
  PROJECT_PROGRESS_UPDATED: "Project Progress Updated",
  AMC_PLAN_CREATED: "AMC Plan Created",
  AMC_PLAN_UPDATED: "AMC Plan Updated",
  AMC_STATUS_CHANGED: "AMC Status Updated",
  AMC_RENEWAL_RECORDED: "AMC Renewal Recorded",
  WHATSAPP_MESSAGE_RECEIVED: "WhatsApp Message Received",
  WHATSAPP_MESSAGE_SENT: "WhatsApp Message Sent",
  AUTOMATION_RULE_CREATED: "Automation Rule Created",
  AUTOMATION_RULE_UPDATED: "Automation Rule Updated",
};
