import "server-only";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { parseIncomingWebhook } from "@/lib/whatsapp-notify";
import { WhatsAppMessageDirection, WhatsAppMessageStatus, WhatsAppProvider } from "@prisma/client";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "eros-webhook-token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[webhook/whatsapp] Webhook verified");
    return new Response(challenge ?? "", { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = parseIncomingWebhook(body);

  processMessages(messages).catch((err) =>
    console.error("[webhook/whatsapp] processMessages error:", err),
  );

  return NextResponse.json({ received: true });
}

async function processMessages(messages: ReturnType<typeof parseIncomingWebhook>) {
  for (const msg of messages) {
    if (!msg.text) continue;

    try {
      let conversation = await prisma.whatsAppConversation.findFirst({
        where: { phone: msg.from },
      });

      if (!conversation) {
        conversation = await prisma.whatsAppConversation.create({
          data: {
            phone: msg.from,
            displayName: msg.from,
            provider: WhatsAppProvider.META_CLOUD,
            status: "OPEN",
            lastMessageAt: new Date(msg.timestamp * 1000),
            lastDirection: WhatsAppMessageDirection.INBOUND,
            lastMessagePreview: msg.text.slice(0, 100),
          },
        });
      } else {
        await prisma.whatsAppConversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(msg.timestamp * 1000),
            lastDirection: WhatsAppMessageDirection.INBOUND,
            lastMessagePreview: msg.text.slice(0, 100),
          },
        });
      }

      await prisma.whatsAppMessage.create({
        data: {
          conversationId: conversation.id,
          direction: WhatsAppMessageDirection.INBOUND,
          status: WhatsAppMessageStatus.DELIVERED,
          body: msg.text,
          externalMessageId: msg.messageId,
          provider: WhatsAppProvider.META_CLOUD,
        },
      });

      revalidatePath("/dashboard/whatsapp");
      console.log(`[webhook/whatsapp] Saved message from ${msg.from}`);
    } catch (err) {
      console.error("[webhook/whatsapp] Error saving message:", err);
    }
  }
}
