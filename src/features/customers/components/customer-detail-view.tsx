import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import { CustomerNotePanel } from "@/features/crm/components/mutation-controls";
import {
  CustomerStatusBadge,
  CustomerTypeBadge,
  InvoiceStatusBadge,
  PaymentMethodBadge,
  QuotationStatusBadge,
} from "@/features/crm/components/status-badges";
import { dateTimeFormatter, formatCurrency } from "@/features/crm/utils";
import type { getCustomerDetail } from "@/features/customers/repository";

type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerDetail>>>;

export function CustomerDetailView({ customer }: { customer: CustomerDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/customers"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to customers
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{customer.legalName}</h1>
          <p className="mt-2 text-zinc-400">{customer.customerNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CustomerStatusBadge status={customer.status} />
          <CustomerTypeBadge type={customer.type} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Primary contact" value={customer.primaryContactName ?? "Not provided"} />
              <DetailItem label="Phone" value={customer.phone ?? "Not provided"} />
              <DetailItem label="Email" value={customer.email ?? "Not provided"} />
              <DetailItem label="Billing address" value={customer.billingAddress ?? "Not provided"} />
              <DetailItem label="Shipping address" value={customer.shippingAddress ?? "Not provided"} />
              <DetailItem label="GSTIN" value={customer.gstin ?? "Not provided"} />
              <DetailItem label="Created at" value={dateTimeFormatter.format(customer.createdAt)} />
              <DetailItem label="Source lead" value={customer.lead ? `${customer.lead.leadNumber} | ${customer.lead.name}` : "Direct customer"} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Linked Site Visits</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {customer.siteVisits.length > 0 ? (
                <div className="space-y-4">
                  {customer.siteVisits.map((siteVisit) => (
                    <Link
                      key={siteVisit.id}
                      href={`/dashboard/site-visits/${siteVisit.id}`}
                      className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                    >
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                        {siteVisit.visitNumber}
                      </div>
                      <div className="mt-2 text-sm text-white">
                        {dateTimeFormatter.format(siteVisit.scheduledAt)}
                      </div>
                      <div className="mt-2 text-sm text-zinc-400">{siteVisit.address}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                        {siteVisit.status.replaceAll("_", " ")} | {siteVisit.serviceInterest}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No site visits linked to this customer yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Commercial Records</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 md:grid-cols-3">
              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Quotations</div>
                {customer.quotations.length > 0 ? customer.quotations.map((quotation) => (
                  <Link
                    key={quotation.id}
                    href={`/dashboard/quotations/${quotation.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{quotation.quotationNumber}</div>
                      <QuotationStatusBadge status={quotation.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(Number(quotation.totalAmount))}</div>
                  </Link>
                )) : (
                  <PlaceholderCard title="Quotations" description="No quotations have been linked to this customer yet." />
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Invoices</div>
                {customer.invoices.length > 0 ? customer.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{invoice.invoiceNumber}</div>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(Number(invoice.totalAmount))}</div>
                    <div className="mt-1 text-xs text-zinc-500">Balance {formatCurrency(Number(invoice.balanceAmount))}</div>
                  </Link>
                )) : (
                  <PlaceholderCard title="Invoices" description="No invoices have been issued for this customer yet." />
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Payments</div>
                {customer.payments.length > 0 ? customer.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{payment.paymentNumber}</div>
                      <PaymentMethodBadge method={payment.method} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(Number(payment.amount))}</div>
                  </div>
                )) : (
                  <PlaceholderCard title="Payments" description="Payments will start showing here once invoices are collected." />
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
                activities={customer.activities}
                emptyMessage="No customer activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CustomerNotePanel customerId={customer.id} />
          </CardContent>
        </Card>
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

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-5">
      <div className="text-sm font-medium text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
