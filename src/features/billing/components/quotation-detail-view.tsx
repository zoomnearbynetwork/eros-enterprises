import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingDocumentPreview } from "@/features/billing/components/document-preview";
import { QuotationActionPanel } from "@/features/billing/components/quotation-action-panel";
import { QuotationBuilderForm } from "@/features/billing/components/quotation-builder-form";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import { QuotationStatusBadge } from "@/features/crm/components/status-badges";
import { formatCurrency, shortDateFormatter } from "@/features/crm/utils";
import type { getBillingOptions, getQuotationDetail } from "@/features/billing/repository";

type QuotationDetail = NonNullable<Awaited<ReturnType<typeof getQuotationDetail>>>;
type BillingOptions = Awaited<ReturnType<typeof getBillingOptions>>;

export function QuotationDetailView({
  quotation,
  options,
}: {
  quotation: QuotationDetail;
  options: BillingOptions;
}) {
  const billToName = quotation.customer?.legalName ?? quotation.lead?.name ?? "Billing Contact";
  const billToMeta = [
    quotation.customer?.primaryContactName,
    quotation.customer?.email ?? quotation.lead?.email,
    quotation.customer?.phone ?? quotation.lead?.phone,
    quotation.customer?.billingAddress,
    quotation.customer?.gstin ? `GSTIN: ${quotation.customer.gstin}` : undefined,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/quotations"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to quotations
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{quotation.quotationNumber}</h1>
          <p className="mt-2 text-zinc-400">
            {quotation.title || "Commercial quotation"} | {billToName}
          </p>
        </div>
        <QuotationStatusBadge status={quotation.effectiveStatus} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <BillingDocumentPreview
            label="Quotation"
            documentNumber={quotation.quotationNumber}
            title={quotation.title}
            status={<QuotationStatusBadge status={quotation.effectiveStatus} />}
            issueDate={quotation.issueDate}
            secondaryDateLabel="Valid Until"
            secondaryDateValue={quotation.validUntil}
            billToName={billToName}
            billToMeta={billToMeta}
            notes={quotation.notes}
            items={quotation.items}
            subtotalAmount={quotation.subtotalAmount}
            taxAmount={quotation.taxAmount}
            discountAmount={quotation.discountAmount}
            totalAmount={quotation.totalAmount}
          />

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Quotation Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Lead" value={quotation.lead ? `${quotation.lead.leadNumber} | ${quotation.lead.name}` : "Not linked"} />
              <DetailItem label="Customer" value={quotation.customer ? `${quotation.customer.customerNumber} | ${quotation.customer.legalName}` : "Not linked"} />
              <DetailItem label="Issued On" value={shortDateFormatter.format(quotation.issueDate)} />
              <DetailItem label="Valid Until" value={quotation.validUntil ? shortDateFormatter.format(quotation.validUntil) : "Not set"} />
              <DetailItem label="Subtotal" value={formatCurrency(quotation.subtotalAmount)} />
              <DetailItem label="Tax" value={formatCurrency(quotation.taxAmount)} />
              <DetailItem label="Discount" value={formatCurrency(quotation.discountAmount)} />
              <DetailItem label="Grand Total" value={formatCurrency(quotation.totalAmount)} />
              <DetailItem
                label="Invoice"
                value={quotation.invoice ? `${quotation.invoice.invoiceNumber} | ${quotation.invoice.effectiveStatus.replaceAll("_", " ")}` : "Not converted yet"}
              />
            </CardContent>
          </Card>

          {!quotation.invoice ? (
            <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
              <CardHeader className="border-b border-white/10 py-6">
                <CardTitle className="text-white">Edit Draft Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <QuotationBuilderForm
                  mode="update"
                  quotationId={quotation.id}
                  leads={options.leads}
                  customers={options.customers}
                  services={options.services}
                  initialValues={{
                    leadId: quotation.leadId ?? undefined,
                    customerId: quotation.customerId ?? undefined,
                    title: quotation.title,
                    issueDate: quotation.issueDate,
                    validUntil: quotation.validUntil,
                    notes: quotation.notes,
                    discountAmount: quotation.discountAmount,
                    items: quotation.items.map((item) => ({
                      serviceId: item.serviceId,
                      name: item.name,
                      description: item.description,
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                      taxRate: item.taxRate,
                    })),
                  }}
                />
              </CardContent>
            </Card>
          ) : null}

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={quotation.activities}
                emptyMessage="No quotation activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <QuotationActionPanel
          quotation={{
            id: quotation.id,
            status: quotation.status,
            effectiveStatus: quotation.effectiveStatus,
            title: quotation.title,
            notes: quotation.notes,
            invoice: quotation.invoice
              ? {
                  id: quotation.invoice.id,
                  invoiceNumber: quotation.invoice.invoiceNumber,
                }
              : null,
          }}
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
