export function normalizePhoneNumber(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");

  if (!normalized) {
    return "";
  }

  if (normalized.startsWith("+")) {
    return `+${normalized.slice(1).replace(/\+/g, "")}`;
  }

  return normalized;
}

export function buildConversationPreview(body: string) {
  const trimmed = body.trim().replace(/\s+/g, " ");

  if (trimmed.length <= 96) {
    return trimmed;
  }

  return `${trimmed.slice(0, 93)}...`;
}

export function resolveConversationName(input: {
  displayName?: string | null;
  customerName?: string | null;
  leadName?: string | null;
}) {
  return input.displayName ?? input.customerName ?? input.leadName ?? "Unknown contact";
}
