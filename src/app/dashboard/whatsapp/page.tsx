import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WhatsAppMessageStatusBadge,
} from "@/features/crm/components/status-badges";
import { dateTimeFormatter, formatPersonName, numberFormatter } from "@/features/crm/utils";
import { WHATSAPP_PROVIDER_LABELS } from "@/features/whatsapp/constants";
import { WhatsAppInboxPanel } from "@/features/whatsapp/components/whatsapp-inbox-panel";
import { getWhatsAppInbox } from "@/features/whatsapp/repository";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardWhatsAppPage(
  props: PageProps<"/dashboard/whatsapp">,
) {
  const searchParams = await props.searchParams;
  const conversationId = getStringParam(searchParams.conversationId);
  const query = getStringParam(searchParams.query);
  const inbox = await getWhatsAppInbox({ conversationId, query });
  const totalMessages = inbox.conversations.reduce((sum, item) => sum + item._count.messages, 0);
  const linkedThreads = inbox.conversations.filter((item) => item.leadId || item.customerId).length;

  return (
    <DashboardShell title="WhatsApp">
      <div className="px-4 py-5 space-y-6">

        <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Conversations" value={numberFormatter.format(inbox.conversations.length)} />
        <MetricCard label="Messages stored" value={numberFormatter.format(totalMessages)} />
        <MetricCard label="Linked threads" value={numberFormatter.format(linkedThreads)} />
      </div>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto_auto]">
        <input
          name="query"
          defaultValue={query}
          placeholder="Search phone, display name, lead, or customer"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500"
        />
        <button
          type="submit"
          className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
        >
          Search
        </button>
        <Link
          href="/dashboard/whatsapp"
          className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
        >
          Reset
        </Link>
      </form>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Conversation List</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {inbox.conversations.length > 0 ? (
                inbox.conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/dashboard/whatsapp?conversationId=${conversation.id}`}
                    className={`block rounded-[1.5rem] border p-4 transition ${
                      inbox.selectedConversation?.id === conversation.id
                        ? "border-amber-300/40 bg-amber-200/[0.06]"
                        : "border-white/8 bg-white/[0.03] hover:border-white/15"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{conversation.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                          {conversation.phone}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {conversation.lastMessageAt
                          ? dateTimeFormatter.format(conversation.lastMessageAt)
                          : "No messages"}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-zinc-300">
                      {conversation.lastMessagePreview ?? "Conversation created. No messages yet."}
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {conversation._count.messages} messages
                      {conversation.customer
                        ? ` | ${conversation.customer.customerNumber}`
                        : conversation.lead
                          ? ` | ${conversation.lead.leadNumber}`
                          : " | Unlinked"}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No WhatsApp conversations yet. Use the panel on the right to start the first thread or simulate an inbound message.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">
                {inbox.selectedConversation ? "Message Thread" : "New Conversation"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {inbox.selectedConversation ? (
                <>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xl font-medium text-white">{inbox.selectedConversation.name}</div>
                        <div className="mt-1 text-sm text-zinc-400">{inbox.selectedConversation.phone}</div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {WHATSAPP_PROVIDER_LABELS[inbox.selectedConversation.provider]}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
                      {inbox.selectedConversation.lead ? (
                        <Link href={`/dashboard/leads/${inbox.selectedConversation.lead.id}`} className="rounded-3xl border border-white/10 px-3 py-1 transition hover:bg-white/[0.05] hover:text-white">
                          {inbox.selectedConversation.lead.leadNumber} | {inbox.selectedConversation.lead.name}
                        </Link>
                      ) : null}
                      {inbox.selectedConversation.customer ? (
                        <Link href={`/dashboard/customers/${inbox.selectedConversation.customer.id}`} className="rounded-3xl border border-white/10 px-3 py-1 transition hover:bg-white/[0.05] hover:text-white">
                          {inbox.selectedConversation.customer.customerNumber} | {inbox.selectedConversation.customer.legalName}
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {inbox.selectedConversation.messages.length > 0 ? (
                      inbox.selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[88%] rounded-[1.5rem] border p-4 ${
                            message.direction === "OUTBOUND"
                              ? "ml-auto border-amber-300/20 bg-amber-200/[0.08]"
                              : "border-white/8 bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                              {message.direction === "OUTBOUND"
                                ? `Outbound${message.sentByUser ? ` by ${formatPersonName(message.sentByUser)}` : ""}`
                                : "Inbound"}
                            </div>
                            <WhatsAppMessageStatusBadge status={message.status} />
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                            {message.body}
                          </p>
                          <div className="mt-3 text-xs text-zinc-500">
                            {dateTimeFormatter.format(message.createdAt)}
                            {message.errorMessage ? ` | ${message.errorMessage}` : ""}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                        This conversation has no messages yet.
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              <WhatsAppInboxPanel
                selectedConversation={
                  inbox.selectedConversation
                    ? {
                        id: inbox.selectedConversation.id,
                        phone: inbox.selectedConversation.phone,
                        leadId: inbox.selectedConversation.leadId,
                        customerId: inbox.selectedConversation.customerId,
                        name: inbox.selectedConversation.name,
                      }
                    : null
                }
                contactOptions={inbox.contactOptions}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
      <CardContent className="p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="mt-4 font-heading text-4xl text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
