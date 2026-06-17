import "server-only";

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER ?? "919920111774";
const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WA_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erosenterprises.in";

async function sendViaMetaCloud(to: string, text: string): Promise<void> {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    console.info("[wa-notify] WHATSAPP env vars not set — skipping Meta Cloud send");
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${WA_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta Cloud API error ${res.status}: ${err}`);
  }
}

type LeadNotifyData = {
  leadNumber: string;
  name: string;
  phone: string;
  serviceInterest?: string | null;
  sourcePage?: string | null;
  budgetRange?: string | null;
};

export async function notifyAdminNewLead(data: LeadNotifyData): Promise<void> {
  const lines = [
    `🔔 *New Lead: ${data.leadNumber}*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📞 *Phone:* ${data.phone}`,
    data.serviceInterest ? `🔧 *Service:* ${data.serviceInterest}` : null,
    data.budgetRange ? `💰 *Budget:* ${data.budgetRange}` : null,
    data.sourcePage ? `📍 *Source:* ${data.sourcePage}` : null,
    ``,
    `🔗 ${SITE_URL}/dashboard/leads`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendViaMetaCloud(ADMIN_WHATSAPP, lines);
}

type SiteVisitNotifyData = {
  leadNumber: string;
  name: string;
  phone: string;
  location?: string | null;
  serviceInterest?: string | null;
};

export async function notifyAdminSiteVisit(data: SiteVisitNotifyData): Promise<void> {
  const lines = [
    `📅 *Site Visit Request: ${data.leadNumber}*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📞 *Phone:* ${data.phone}`,
    data.location ? `📍 *Location:* ${data.location}` : null,
    data.serviceInterest ? `🔧 *Service:* ${data.serviceInterest}` : null,
    ``,
    `🔗 ${SITE_URL}/dashboard/leads`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendViaMetaCloud(ADMIN_WHATSAPP, lines);
}

export type IncomingWAMessage = {
  from: string;
  messageId: string;
  text?: string;
  timestamp: number;
  type: string;
};

export function parseIncomingWebhook(body: Record<string, unknown>): IncomingWAMessage[] {
  const messages: IncomingWAMessage[] = [];
  try {
    const entries =
      (body.entry as Array<{
        changes: Array<{
          value: {
            messages?: Array<Record<string, unknown>>;
          };
        }>;
      }>) ?? [];
    for (const entry of entries) {
      for (const change of entry.changes ?? []) {
        for (const msg of change.value?.messages ?? []) {
          messages.push({
            from: msg.from as string,
            messageId: msg.id as string,
            text: (msg.text as { body?: string } | undefined)?.body,
            timestamp: Number(msg.timestamp),
            type: msg.type as string,
          });
        }
      }
    }
  } catch (e) {
    console.error("[wa-notify] parseIncomingWebhook error:", e);
  }
  return messages;
}
