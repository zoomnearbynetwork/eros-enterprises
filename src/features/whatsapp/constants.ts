export const WHATSAPP_CONVERSATION_STATUSES = ["OPEN", "ARCHIVED"] as const;

export const WHATSAPP_MESSAGE_DIRECTIONS = ["INBOUND", "OUTBOUND"] as const;

export const WHATSAPP_MESSAGE_STATUSES = [
  "QUEUED",
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
  "RECEIVED",
] as const;

export const WHATSAPP_PROVIDER_TYPES = ["MOCK", "META_CLOUD", "BAILEYS"] as const;

export const WHATSAPP_CONVERSATION_STATUS_LABELS: Record<
  (typeof WHATSAPP_CONVERSATION_STATUSES)[number],
  string
> = {
  OPEN: "Open",
  ARCHIVED: "Archived",
};

export const WHATSAPP_MESSAGE_DIRECTION_LABELS: Record<
  (typeof WHATSAPP_MESSAGE_DIRECTIONS)[number],
  string
> = {
  INBOUND: "Inbound",
  OUTBOUND: "Outbound",
};

export const WHATSAPP_MESSAGE_STATUS_LABELS: Record<
  (typeof WHATSAPP_MESSAGE_STATUSES)[number],
  string
> = {
  QUEUED: "Queued",
  SENT: "Sent",
  DELIVERED: "Delivered",
  READ: "Read",
  FAILED: "Failed",
  RECEIVED: "Received",
};

export const WHATSAPP_PROVIDER_LABELS: Record<
  (typeof WHATSAPP_PROVIDER_TYPES)[number],
  string
> = {
  MOCK: "Mock Provider",
  META_CLOUD: "Meta Cloud API",
  BAILEYS: "Baileys",
};
