import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuotationBuilderForm } from "@/features/billing/components/quotation-builder-form";
import {
  getBillingDashboardMetrics,
  getBillingOptions,
  getQuotations,
} from "@/features/billing/repository";
import {
  QUOTATION_STATUSES,
  QUOTATION_STATUS_LABELS,
} from "@/features/crm/constants";
import { QuotationStatusBadge } from "@/features/crm/components/status-badges";
import { formatCurrency, numberFormatter, shortDateFormatter } from "@/features/crm/utils";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardQuotationsPage(
  props: PageProps<"/dashboard/quotations">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
  };

  const [quotations, options, metrics] = await Promise.all([
    getQuotations(filters),
    getBillingOptions(),
    getBillingDashboardMetrics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Sales Billing</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Quotations</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Build itemized commercial quotations, track customer responses, and hand accepted scopes into invoicing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Quoted Value" value={formatCurrency(metrics.quotedValue)} />
        <MetricCard label="Total Quotations" value={numberFormatter.format(quotations.length)} />
        <MetricCard label="Accepted" value={numberFormatter.format(quotations.filter((item) => item.effectiveStatus === "ACCEPTED").length)} />
        <MetricCard label="Awaiting Reply" value={numberFormatter.format(quotations.filter((item) => item.effectiveStatus === "SENT" || item.effectiveStatus === "VIEWED").length)} />
      </div>

      <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
        <CardHeader className="border-b border-white/10 py-6">
          <CardTitle className="text-white">New Quotation</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <QuotationBuilderForm
            mode="create"
            leads={options.leads}
            customers={options.customers}
            services={options.services}
          />
        </CardContent>
      </Card>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search number, title, lead, customer"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {QUOTATION_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {QUOTATION_STATUS_LABELS[status]}
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
            href="/dashboard/quotations"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="space-y-4">
        {quotations.length > 0 ? (
          quotations.map((quotation) => (
            <Link
              key={quotation.id}
              href={`/dashboard/quotations/${quotation.id}`}
              className="block rounded-[1.75rem] border border-white/10 bg-[#101113]/92 p-5 transition hover:border-white/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                    {quotation.quotationNumber}
                  </div>
                  <div className="mt-2 text-lg font-medium text-white">
                    {quotation.title || "Commercial Quotation"}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {quotation.customer?.legalName ?? quotation.lead?.name ?? "Unlinked quotation"}
                  </div>
                </div>
                <QuotationStatusBadge status={quotation.effectiveStatus} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                <div>Issued: {shortDateFormatter.format(quotation.issueDate)}</div>
                <div>Valid Until: {quotation.validUntil ? shortDateFormatter.format(quotation.validUntil) : "Not set"}</div>
                <div>Items: {quotation._count.items}</div>
                <div>Total: {formatCurrency(quotation.totalAmount)}</div>
              </div>
              {quotation.invoice ? (
                <div className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Invoice linked: {quotation.invoice.invoiceNumber}
                </div>
              ) : null}
            </Link>
          ))
        ) : (
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardContent className="p-10 text-center text-zinc-400">
              No quotations match the current filters yet.
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
