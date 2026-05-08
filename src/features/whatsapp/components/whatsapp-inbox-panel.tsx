"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  sendWhatsAppMessage,
  simulateInboundWhatsAppMessage,
} from "@/actions/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactOptions = {
  leads: Array<{
    id: string;
    leadNumber: string;
    name: string;
    phone: string;
  }>;
  customers: Array<{
    id: string;
    customerNumber: string;
    legalName: string;
    phone: string | null;
  }>;
};

type SelectedConversation = {
  id: string;
  phone: string;
  leadId: string | null;
  customerId: string | null;
  name: string;
} | null;

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function WhatsAppInboxPanel({
  selectedConversation,
  contactOptions,
}: {
  selectedConversation: SelectedConversation;
  contactOptions: ContactOptions;
}) {
  const router = useRouter();
  const [outboundBody, setOutboundBody] = useState("");
  const [inboundBody, setInboundBody] = useState("");
  const [recipientPhone, setRecipientPhone] = useState(selectedConversation?.phone ?? "");
  const [displayName, setDisplayName] = useState(selectedConversation?.name ?? "");
  const [leadId, setLeadId] = useState(selectedConversation?.leadId ?? "");
  const [customerId, setCustomerId] = useState(selectedConversation?.customerId ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSend() {
    setErrorMessage(null);
    setMessage(null);

    const result = await sendWhatsAppMessage({
      conversationId: selectedConversation?.id,
      recipientPhone,
      displayName,
      leadId: leadId || undefined,
      customerId: customerId || undefined,
      body: outboundBody,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setOutboundBody("");
    setMessage(result.message);
    router.push(`/dashboard/whatsapp?conversationId=${result.data.conversationId}`);
    router.refresh();
  }

  async function handleSimulateInbound() {
    setErrorMessage(null);
    setMessage(null);

    const result = await simulateInboundWhatsAppMessage({
      conversationId: selectedConversation?.id,
      recipientPhone,
      displayName,
      leadId: leadId || undefined,
      customerId: customerId || undefined,
      body: inboundBody,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setInboundBody("");
    setMessage(result.message);
    router.push(`/dashboard/whatsapp?conversationId=${result.data.conversationId}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!selectedConversation ? (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-zinc-400">
          Start a new conversation by choosing a linked lead or customer, or just type a phone number for an unlinked thread.
        </div>
      ) : null}

      {!selectedConversation ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Lead link</label>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={leadId}
              onChange={(event) => setLeadId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">
                No lead linked
              </option>
              {contactOptions.leads.map((lead) => (
                <option key={lead.id} value={lead.id} className="bg-[#101113]">
                  {lead.leadNumber} | {lead.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Customer link</label>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">
                No customer linked
              </option>
              {contactOptions.customers.map((customer) => (
                <option key={customer.id} value={customer.id} className="bg-[#101113]">
                  {customer.customerNumber} | {customer.legalName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Recipient phone</label>
            <Input value={recipientPhone} onChange={(event) => setRecipientPhone(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Display name</label>
            <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </div>
        </div>
      ) : null}

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Send message</div>
        <div className="mt-4 grid gap-3">
          <Textarea
            placeholder="Write the outgoing WhatsApp message."
            value={outboundBody}
            onChange={(event) => setOutboundBody(event.target.value)}
          />
          <Button disabled={isPending} onClick={() => startTransition(handleSend)}>
            {selectedConversation ? "Send reply" : "Start conversation"}
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Simulate inbound message</div>
        <p className="mt-2 text-sm text-zinc-500">
          Use this to test the inbox flow until a real WhatsApp provider is connected.
        </p>
        <div className="mt-4 grid gap-3">
          <Textarea
            placeholder="Type the message that should appear as if it came from the contact."
            value={inboundBody}
            onChange={(event) => setInboundBody(event.target.value)}
          />
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => startTransition(handleSimulateInbound)}
          >
            Record inbound message
          </Button>
        </div>
      </div>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
