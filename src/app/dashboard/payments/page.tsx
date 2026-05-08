import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentRecorder } from "@/features/billing/components/payment-recorder";
import {
  getBillingDashboardMetrics,
  getBillingOptions,
  getPayments,
} from "@/features/billing/repository";
import {
  InvoiceStatusBadge,
  PaymentMethodBadge,
} from "@/features/crm/components/status-badges";
import { formatCurrency, numberFormatter, shortDateFormatter } from "@/features/crm/utils";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardPaymentsPage(
  props: PageProps<"/dashboard/payments">,
) {
  const searchParams = await props.searchParams;
  const query = getStringParam(searchParams.query);

  const [payments, options, metrics] = await Promise.all([
    getPayments(query),
    getBillingOptions(),
    getBillingDashboardMetrics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Sales Billing</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Payments</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Record collections, keep invoice balances in sync, and maintain a clean finance activity trail.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Collected Amount" value={formatCurrency(metrics.collectedAmount)} />
        <MetricCard label="Pending Amount" value={formatCurrency(metrics.pendingAmount)} />
        <MetricCard label="Payments Logged" value={numberFormatter.format(payments.length)} />
        <MetricCard label="Open Invoices" value={numberFormatter.format(options.openInvoices.length)} />
      </div>

      <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
        <CardHeader className="border-b border-white/10 py-6">
          <CardTitle className="text-white">Record New Payment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {options.openInvoices.length > 0 ? (
            <PaymentRecorder invoices={options.openInvoices} />
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
              No open invoices are waiting for collection right now.
            </div>
          )}
        </CardContent>
      </Card>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto_auto]">
        <input
          name="query"
          defaultValue={query}
          placeholder="Search payment, invoice, reference, customer"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500"
        />
        <button
          type="submit"
          className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
        >
          Search
        </button>
        <Link
          href="/dashboard/payments"
          className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
        >
          Reset
        </Link>
      </form>

      <div className="space-y-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-[1.75rem] border border-white/10 bg-[#101113]/92 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                    {payment.paymentNumber}
                  </div>
                  <div className="mt-2 text-lg font-medium text-white">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {payment.customer?.legalName ?? payment.lead?.name ?? "Payment record"}
                  </div>
                </div>
                <PaymentMethodBadge method={payment.method} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                <div>Paid On: {shortDateFormatter.format(payment.paidAt)}</div>
                <div>Invoice: {payment.invoice?.invoiceNumber ?? "Deleted invoice"}</div>
                <div>Reference: {payment.reference ?? "Not provided"}</div>
                <div>
                  Status: {payment.invoice ? <InvoiceStatusBadge status={payment.invoice.effectiveStatus} /> : "N/A"}
                </div>
              </div>
              {payment.notes ? (
                <div className="mt-3 text-sm text-zinc-500">{payment.notes}</div>
              ) : null}
            </div>
          ))
        ) : (
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardContent className="p-10 text-center text-zinc-400">
              No payments match the current search yet.
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
