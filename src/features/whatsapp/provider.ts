import { WhatsAppProvider } from "@prisma/client";

type SendMessageInput = {
  to: string;
  body: string;
  conversationKey?: string | null;
};

export type SendMessageResult = {
  provider: WhatsAppProvider;
  providerMessageId: string;
  status: "SENT" | "FAILED";
  metadata?: Record<string, string>;
  errorMessage?: string;
};

export interface WhatsAppProviderClient {
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
}

class MockWhatsAppProvider implements WhatsAppProviderClient {
  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    return {
      provider: WhatsAppProvider.MOCK,
      providerMessageId: `mock_${Date.now()}`,
      status: "SENT",
      metadata: {
        to: input.to,
      },
    };
  }
}

export function getWhatsAppProviderClient(provider: WhatsAppProvider = WhatsAppProvider.MOCK) {
  switch (provider) {
    case WhatsAppProvider.META_CLOUD:
    case WhatsAppProvider.BAILEYS:
    case WhatsAppProvider.MOCK:
    default:
      return new MockWhatsAppProvider();
  }
}
