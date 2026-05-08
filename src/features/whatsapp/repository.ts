import { prisma } from "@/lib/prisma";
import { resolveConversationName } from "@/features/whatsapp/utils";

export async function getWhatsAppInbox(search: {
  conversationId?: string;
  query?: string;
}) {
  const conversations = await prisma.whatsAppConversation.findMany({
    where: search.query
      ? {
          OR: [
            { phone: { contains: search.query, mode: "insensitive" } },
            { displayName: { contains: search.query, mode: "insensitive" } },
            { lead: { name: { contains: search.query, mode: "insensitive" } } },
            { customer: { legalName: { contains: search.query, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      phone: true,
      displayName: true,
      status: true,
      provider: true,
      leadId: true,
      customerId: true,
      lastMessageAt: true,
      lastDirection: true,
      lastMessagePreview: true,
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const selectedConversationId = search.conversationId ?? conversations[0]?.id;

  const selectedConversation = selectedConversationId
    ? await prisma.whatsAppConversation.findUnique({
        where: { id: selectedConversationId },
        select: {
          id: true,
          phone: true,
          displayName: true,
          status: true,
          provider: true,
          providerThreadKey: true,
          leadId: true,
          customerId: true,
          lastMessageAt: true,
          lastDirection: true,
          lastMessagePreview: true,
          lead: {
            select: {
              id: true,
              leadNumber: true,
              name: true,
            },
          },
          customer: {
            select: {
              id: true,
              customerNumber: true,
              legalName: true,
            },
          },
          messages: {
            orderBy: [{ createdAt: "asc" }],
            select: {
              id: true,
              direction: true,
              status: true,
              provider: true,
              body: true,
              errorMessage: true,
              createdAt: true,
              deliveredAt: true,
              readAt: true,
              sentByUser: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      })
    : null;

  const contactOptions = await getWhatsAppContactOptions();

  return {
    conversations: conversations.map((conversation) => ({
      ...conversation,
      name: resolveConversationName({
        displayName: conversation.displayName,
        leadName: conversation.lead?.name,
        customerName: conversation.customer?.legalName,
      }),
    })),
    selectedConversation: selectedConversation
      ? {
          ...selectedConversation,
          name: resolveConversationName({
            displayName: selectedConversation.displayName,
            leadName: selectedConversation.lead?.name,
            customerName: selectedConversation.customer?.legalName,
          }),
        }
      : null,
    contactOptions,
  };
}

export async function getWhatsAppContactOptions() {
  const [leads, customers] = await Promise.all([
    prisma.lead.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 50,
      select: {
        id: true,
        leadNumber: true,
        name: true,
        phone: true,
      },
    }),
    prisma.customer.findMany({
      where: {
        phone: {
          not: null,
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
      select: {
        id: true,
        customerNumber: true,
        legalName: true,
        phone: true,
      },
    }),
  ]);

  return {
    leads,
    customers,
  };
}
