import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBillingDashboardMetrics,
  getConvertibleQuotations,
  getInvoices,
} from "@/features/billing/repository";
import { InvoiceStatusBadge } from "@/features/crm/components/status-badges";
import {
  INVOICE_STATUSES,
  INVOICE_STATUS_LABELS,
} from "@/features/crm/constants";
import { formatCurrency, numberFormatter, shortDateFormatter } from "@/features/crm/utils";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardInvoicesPage(
  props: PageProps<"/dashboard/invoices">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
  };

  const [invoices, metrics, convertibleQuotations] = await Promise.all([
    getInvoices(filters),
    getBillingDashboardMetrics(),
    getConvertibleQuotations(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Sales Billing</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Invoices</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Convert accepted quotations into collectible invoices, watch balances move, and surface overdue follow-ups early.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Invoiced Value" value={formatCurrency(metrics.invoicedValue)} />
        <MetricCard label="Collected" value={formatCurrency(metrics.collectedAmount)} />
        <MetricCard label="Pending" value={formatCurrency(metrics.pendingAmount)} />
        <MetricCard label="Overdue / Partial" value={numberFormatter.format(invoices.filter((item) => item.effectiveStatus === "OVERDUE" || item.effectiveStatus === "PARTIALLY_PAID").length)} />
      </div>

      {convertibleQuotations.length > 0 ? (
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Ready to Invoice</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {convertibleQuotations.map((quotation) => (
                <Link
                  key={quotation.id}
                  href={`/dashboard/quotations/${quotation.id}`}
                  className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                    {quotation.quotationNumber}
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {quotation.customer?.legalName ?? quotation.lead?.name ?? "Accepted quotation"}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">{formatCurrency(quotation.totalAmount)}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search invoice, quote, lead, customer"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {INVOICE_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {INVOICE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <div className="flex gap-2 xl:col-span-1">
          <button
            type="submit"
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
          >
            Apply Filters
          </button>
          <Link
            href="/dashboard/invoices"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="space-y-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/dashboard/invoices/${invoice.id}`}
              className="block rounded-[1.75rem] border border-white/10 bg-[#101113]/92 p-5 transition hover:border-white/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="mt-2 text-lg font-medium text-white">
                    {invoice.title || "Commercial Invoice"}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {invoice.customer?.legalName ?? invoice.lead?.name ?? "Unlinked invoice"}
                  </div>
                </div>
                <InvoiceStatusBadge status={invoice.effectiveStatus} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-5">
                <div>Issued: {shortDateFormatter.format(invoice.issueDate)}</div>
                <div>Due: {invoice.dueDate ? shortDateFormatter.format(invoice.dueDate) : "Not set"}</div>
                <div>Total: {formatCurrency(invoice.totalAmount)}</div>
                <div>Collected: {formatCurrency(invoice.paidAmount)}</div>
                <div>Balance: {formatCurrency(invoice.balanceAmount)}</div>
              </div>
            </Link>
          ))
        ) : (
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardContent className="p-10 text-center text-zinc-400">
              No invoices match the current filters yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
      <CardContent className="p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="mt-4 font-heading text-3xl text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
