"use server";

import {
  ActivityEntityType,
  ActivityType,
  Prisma,
  WhatsAppMessageDirection,
  WhatsAppMessageStatus,
  WhatsAppProvider,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { actionFailure, actionSuccess, type ActionResponse } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/features/crm/activity";
import {
  getWhatsAppProviderClient,
  type SendMessageResult,
} from "@/features/whatsapp/provider";
import {
  sendWhatsAppMessageSchema,
  simulateInboundWhatsAppMessageSchema,
} from "@/features/whatsapp/schemas";
import { buildConversationPreview } from "@/features/whatsapp/utils";

type WhatsAppActionResponse<TData = undefined> = ActionResponse<TData>;

async function getSystemActorId() {
  const actor = await prisma.user.findFirst({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
    },
  });

  return actor?.id ?? null;
}

function revalidateWhatsAppPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

async function resolveConversationContext(
  tx: Prisma.TransactionClient,
  input: {
    conversationId?: string;
    leadId?: string;
    customerId?: string;
    recipientPhone?: string;
    displayName?: string;
  },
) {
  const conversation = input.conversationId
    ? await tx.whatsAppConversation.findUnique({
        where: { id: input.conversationId },
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          customer: {
            select: {
              id: true,
              legalName: true,
              phone: true,
            },
          },
        },
      })
    : input.recipientPhone
      ? await tx.whatsAppConversation.findUnique({
          where: { phone: input.recipientPhone },
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            customer: {
              select: {
                id: true,
                legalName: true,
                phone: true,
              },
            },
          },
        })
      : null;

  if (input.conversationId && !conversation) {
    throw new Error("Conversation not found.");
  }

  const lead = input.leadId
    ? await tx.lead.findUnique({
        where: { id: input.leadId },
        select: {
          id: true,
          name: true,
          phone: true,
        },
      })
    : conversation?.lead ?? null;

  const customer = input.customerId
    ? await tx.customer.findUnique({
        where: { id: input.customerId },
        select: {
          id: true,
          legalName: true,
          phone: true,
        },
      })
    : conversation?.customer ?? null;

  if (input.leadId && !lead) {
    throw new Error("Lead not found.");
  }

  if (input.customerId && !customer) {
    throw new Error("Customer not found.");
  }

  const phone = conversation?.phone ?? input.recipientPhone ?? customer?.phone ?? lead?.phone;

  if (!phone) {
    throw new Error("A phone number is required for the WhatsApp conversation.");
  }

  return {
    conversation,
    lead,
    customer,
    phone,
    displayName: input.displayName ?? conversation?.displayName ?? customer?.legalName ?? lead?.name,
    provider: conversation?.provider ?? WhatsAppProvider.MOCK,
  };
}

function getRevalidationTargets(input: {
  conversationId: string;
  leadId?: string | null;
  customerId?: string | null;
}) {
  return [
    "/dashboard/whatsapp",
    `/dashboard/whatsapp?conversationId=${input.conversationId}`,
    ...(input.leadId ? [`/dashboard/leads/${input.leadId}`] : []),
    ...(input.customerId ? [`/dashboard/customers/${input.customerId}`] : []),
  ];
}

export async function sendWhatsAppMessage(
  input: unknown,
): Promise<WhatsAppActionResponse<{ conversationId: string; messageId: string }>> {
  const validated = sendWhatsAppMessageSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the message details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const context = await prisma.$transaction((tx) =>
      resolveConversationContext(tx, validated.data),
    );
    const providerClient = getWhatsAppProviderClient(context.provider);

    let providerResult: SendMessageResult;

    try {
      providerResult = await providerClient.sendMessage({
        to: context.phone,
        body: validated.data.body,
        conversationKey: context.conversation?.providerThreadKey,
      });
    } catch (error) {
      providerResult = {
        provider: context.provider,
        providerMessageId: `failed_${Date.now()}`,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown provider failure.",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const conversation = context.conversation
        ? await tx.whatsAppConversation.update({
            where: { id: context.conversation.id },
            data: {
              phone: context.phone,
              displayName: context.displayName,
              leadId: context.lead?.id,
              customerId: context.customer?.id,
              provider: providerResult.provider,
              lastMessageAt: new Date(),
              lastDirection: WhatsAppMessageDirection.OUTBOUND,
              lastMessagePreview: buildConversationPreview(validated.data.body),
            },
          })
        : await tx.whatsAppConversation.create({
            data: {
              phone: context.phone,
              displayName: context.displayName,
              leadId: context.lead?.id,
              customerId: context.customer?.id,
              provider: providerResult.provider,
              lastMessageAt: new Date(),
              lastDirection: WhatsAppMessageDirection.OUTBOUND,
              lastMessagePreview: buildConversationPreview(validated.data.body),
            },
          });

      const now = new Date();
      const message = await tx.whatsAppMessage.create({
        data: {
          conversationId: conversation.id,
          direction: WhatsAppMessageDirection.OUTBOUND,
          status:
            providerResult.status === "SENT"
              ? WhatsAppMessageStatus.SENT
              : WhatsAppMessageStatus.FAILED,
          provider: providerResult.provider,
          externalMessageId: providerResult.providerMessageId,
          body: validated.data.body,
          errorMessage: providerResult.errorMessage,
          metadata: providerResult.metadata as Prisma.InputJsonValue | undefined,
          leadId: context.lead?.id,
          customerId: context.customer?.id,
          sentByUserId: actorId,
          failedAt: providerResult.status === "FAILED" ? now : undefined,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.WHATSAPP_MESSAGE_SENT,
        entityType: ActivityEntityType.WHATSAPP_MESSAGE,
        entityId: message.id,
        leadId: context.lead?.id,
        customerId: context.customer?.id,
        userId: actorId,
        whatsappConversationId: conversation.id,
        whatsappMessageId: message.id,
        description:
          providerResult.status === "FAILED"
            ? `WhatsApp send failed for ${context.displayName ?? context.phone}.`
            : `WhatsApp message sent to ${context.displayName ?? context.phone}.`,
        metadata: {
          phone: context.phone,
          provider: providerResult.provider,
          status: providerResult.status,
        },
      });

      return {
        conversationId: conversation.id,
        messageId: message.id,
        leadId: context.lead?.id ?? null,
        customerId: context.customer?.id ?? null,
      };
    });

    revalidateWhatsAppPaths(getRevalidationTargets(result));

    return actionSuccess(
      providerResult.status === "FAILED"
        ? "Message was recorded, but the provider send failed."
        : "WhatsApp message sent.",
      {
        conversationId: result.conversationId,
        messageId: result.messageId,
      },
    );
  } catch (error) {
    console.error("WhatsApp send failed", error);
    return actionFailure("We could not send this WhatsApp message.");
  }
}

export async function simulateInboundWhatsAppMessage(
  input: unknown,
): Promise<WhatsAppActionResponse<{ conversationId: string; messageId: string }>> {
  const validated = simulateInboundWhatsAppMessageSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the inbound message details.",
      validated.error.flatten().fieldErrors,
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const context = await resolveConversationContext(tx, validated.data);
      const conversation = context.conversation
        ? await tx.whatsAppConversation.update({
            where: { id: context.conversation.id },
            data: {
              phone: context.phone,
              displayName: context.displayName,
              leadId: context.lead?.id,
              customerId: context.customer?.id,
              provider: WhatsAppProvider.MOCK,
              lastMessageAt: new Date(),
              lastDirection: WhatsAppMessageDirection.INBOUND,
              lastMessagePreview: buildConversationPreview(validated.data.body),
            },
          })
        : await tx.whatsAppConversation.create({
            data: {
              phone: context.phone,
              displayName: context.displayName,
              leadId: context.lead?.id,
              customerId: context.customer?.id,
              provider: WhatsAppProvider.MOCK,
              lastMessageAt: new Date(),
              lastDirection: WhatsAppMessageDirection.INBOUND,
              lastMessagePreview: buildConversationPreview(validated.data.body),
            },
          });

      const message = await tx.whatsAppMessage.create({
        data: {
          conversationId: conversation.id,
          direction: WhatsAppMessageDirection.INBOUND,
          status: WhatsAppMessageStatus.RECEIVED,
          provider: WhatsAppProvider.MOCK,
          body: validated.data.body,
          leadId: context.lead?.id,
          customerId: context.customer?.id,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.WHATSAPP_MESSAGE_RECEIVED,
        entityType: ActivityEntityType.WHATSAPP_MESSAGE,
        entityId: message.id,
        leadId: context.lead?.id,
        customerId: context.customer?.id,
        whatsappConversationId: conversation.id,
        whatsappMessageId: message.id,
        description: `WhatsApp message received from ${context.displayName ?? context.phone}.`,
        metadata: {
          phone: context.phone,
          provider: WhatsAppProvider.MOCK,
          status: WhatsAppMessageStatus.RECEIVED,
        },
      });

      return {
        conversationId: conversation.id,
        messageId: message.id,
        leadId: context.lead?.id ?? null,
        customerId: context.customer?.id ?? null,
      };
    });

    revalidateWhatsAppPaths(getRevalidationTargets(result));

    return actionSuccess("Inbound WhatsApp message recorded.", {
      conversationId: result.conversationId,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Inbound WhatsApp simulation failed", error);
    return actionFailure("We could not record this inbound message.");
  }
}
