import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import { LeadMutationPanel } from "@/features/crm/components/mutation-controls";
import {
  InvoiceStatusBadge,
  LeadPriorityBadge,
  LeadStatusBadge,
  QuotationStatusBadge,
} from "@/features/crm/components/status-badges";
import { LEAD_SOURCE_LABELS } from "@/features/leads/constants";
import type { LeadDetailRecord } from "@/features/leads/types";
import { dateTimeFormatter, formatCurrency, formatPersonName } from "@/features/crm/utils";

type AssignableUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: {
    name: string;
  };
};

export function LeadDetailView({
  lead,
  salesUsers,
  engineerUsers,
}: {
  lead: LeadDetailRecord;
  salesUsers: AssignableUser[];
  engineerUsers: AssignableUser[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/leads"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to leads
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{lead.name}</h1>
          <p className="mt-2 text-zinc-400">
            {lead.leadNumber} | {lead.serviceInterest}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LeadStatusBadge status={lead.status} />
          <LeadPriorityBadge priority={lead.priority} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Lead Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Phone" value={lead.phone} />
              <DetailItem label="Email" value={lead.email ?? "Not provided"} />
              <DetailItem label="Service interest" value={lead.serviceInterest} />
              <DetailItem label="Source" value={LEAD_SOURCE_LABELS[lead.source]} />
              <DetailItem label="Source page" value={lead.sourcePage} />
              <DetailItem label="CTA location" value={lead.ctaLocation} />
              <DetailItem label="Assigned user" value={formatPersonName(lead.assignedTo)} />
              <DetailItem
                label="Linked customer"
                value={lead.customer ? `${lead.customer.customerNumber} | ${lead.customer.legalName}` : "Not converted yet"}
              />
              <DetailItem label="Location" value={lead.location ?? "Not provided"} />
              <DetailItem label="Budget range" value={lead.budgetRange ?? "Not provided"} />
              <DetailItem label="UTM source" value={lead.utmSource ?? "Not captured"} />
              <DetailItem label="UTM medium" value={lead.utmMedium ?? "Not captured"} />
              <DetailItem label="UTM campaign" value={lead.utmCampaign ?? "Not captured"} />
              <DetailItem label="Created at" value={dateTimeFormatter.format(lead.createdAt)} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                {lead.message ?? "No message was provided with this lead."}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Site Visits</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {lead.siteVisits.length > 0 ? (
                <div className="space-y-4">
                  {lead.siteVisits.map((siteVisit) => (
                    <Link
                      key={siteVisit.id}
                      href={`/dashboard/site-visits/${siteVisit.id}`}
                      className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                            {siteVisit.visitNumber}
                          </div>
                          <div className="mt-2 text-sm text-white">
                            {dateTimeFormatter.format(siteVisit.scheduledAt)}
                          </div>
                        </div>
                        <div className="text-sm text-zinc-400">{siteVisit.status.replaceAll("_", " ")}</div>
                      </div>
                      <div className="mt-3 text-sm text-zinc-300">{siteVisit.address}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                        {siteVisit.assignedEngineer
                          ? `Engineer: ${formatPersonName(siteVisit.assignedEngineer)}`
                          : "Engineer pending"}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No site visits scheduled yet for this lead.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Commercial Flow</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Quotations</div>
                {lead.quotations.length > 0 ? lead.quotations.map((quotation) => (
                  <Link
                    key={quotation.id}
                    href={`/dashboard/quotations/${quotation.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                        {quotation.quotationNumber}
                      </div>
                      <QuotationStatusBadge status={quotation.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(Number(quotation.totalAmount))}</div>
                  </Link>
                )) : (
                  <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                    No quotations have been created for this lead yet.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Invoices</div>
                {lead.invoices.length > 0 ? lead.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                        {invoice.invoiceNumber}
                      </div>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(Number(invoice.totalAmount))}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Balance {formatCurrency(Number(invoice.balanceAmount))}
                    </div>
                  </Link>
                )) : (
                  <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                    No invoices have been generated for this lead yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={lead.activities}
                emptyMessage="No activity has been recorded for this lead yet."
              />
            </CardContent>
          </Card>
        </div>

        <LeadMutationPanel
          lead={{
            id: lead.id,
            status: lead.status,
            priority: lead.priority,
            assignedToId: lead.assignedToId,
            customer: lead.customer ? { id: lead.customer.id } : null,
            serviceInterest: lead.serviceInterest,
            location: lead.location,
          }}
          salesUsers={salesUsers}
          engineerUsers={engineerUsers}
        />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}
