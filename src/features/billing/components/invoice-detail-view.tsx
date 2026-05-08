import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingDocumentPreview } from "@/features/billing/components/document-preview";
import { InvoiceActionPanel } from "@/features/billing/components/invoice-action-panel";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import {
  InvoiceStatusBadge,
  PaymentMethodBadge,
} from "@/features/crm/components/status-badges";
import { formatCurrency, shortDateFormatter } from "@/features/crm/utils";
import type { getBillingOptions, getInvoiceDetail } from "@/features/billing/repository";

type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoiceDetail>>>;
type BillingOptions = Awaited<ReturnType<typeof getBillingOptions>>;

export function InvoiceDetailView({
  invoice,
  options,
}: {
  invoice: InvoiceDetail;
  options: BillingOptions;
}) {
  const billToName = invoice.customer?.legalName ?? invoice.lead?.name ?? "Billing Contact";
  const billToMeta = [
    invoice.customer?.primaryContactName,
    invoice.customer?.email ?? invoice.lead?.email,
    invoice.customer?.phone ?? invoice.lead?.phone,
    invoice.customer?.billingAddress,
    invoice.customer?.gstin ? `GSTIN: ${invoice.customer.gstin}` : undefined,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/invoices"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to invoices
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{invoice.invoiceNumber}</h1>
          <p className="mt-2 text-zinc-400">
            {invoice.title || "Invoice"} | {billToName}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.effectiveStatus} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <BillingDocumentPreview
            label="Invoice"
            documentNumber={invoice.invoiceNumber}
            title={invoice.title}
            status={<InvoiceStatusBadge status={invoice.effectiveStatus} />}
            issueDate={invoice.issueDate}
            secondaryDateLabel="Due Date"
            secondaryDateValue={invoice.dueDate}
            billToName={billToName}
            billToMeta={billToMeta}
            notes={invoice.notes}
            items={invoice.items}
            subtotalAmount={invoice.subtotalAmount}
            taxAmount={invoice.taxAmount}
            discountAmount={invoice.discountAmount}
            totalAmount={invoice.totalAmount}
          />

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Invoice Ledger</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Quotation" value={invoice.quotation ? invoice.quotation.quotationNumber : "Direct invoice"} />
              <DetailItem label="Due Date" value={invoice.dueDate ? shortDateFormatter.format(invoice.dueDate) : "Not set"} />
              <DetailItem label="Total" value={formatCurrency(invoice.totalAmount)} />
              <DetailItem label="Collected" value={formatCurrency(invoice.paidAmount)} />
              <DetailItem label="Pending" value={formatCurrency(invoice.balanceAmount)} />
              <DetailItem label="Effective Status" value={invoice.effectiveStatus.replaceAll("_", " ")} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Payments Received</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {invoice.payments.length > 0 ? (
                <div className="space-y-4">
                  {invoice.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                            {payment.paymentNumber}
                          </div>
                          <div className="mt-2 text-sm text-white">
                            {formatCurrency(payment.amount)}
                          </div>
                        </div>
                        <PaymentMethodBadge method={payment.method} />
                      </div>
                      <div className="mt-3 text-sm text-zinc-400">
                        {shortDateFormatter.format(payment.paidAt)}
                        {payment.reference ? ` | Ref: ${payment.reference}` : ""}
                      </div>
                      {payment.notes ? (
                        <div className="mt-2 text-sm text-zinc-500">{payment.notes}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No payments have been recorded against this invoice yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={invoice.activities}
                emptyMessage="No invoice activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <InvoiceActionPanel
          invoice={{
            id: invoice.id,
            status: invoice.status,
            effectiveStatus: invoice.effectiveStatus,
            balanceAmount: invoice.balanceAmount,
          }}
          openInvoices={options.openInvoices}
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
