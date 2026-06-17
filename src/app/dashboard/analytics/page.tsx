import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardOverview } from "@/features/crm/repository";
import {
  getBillingDashboardMetrics,
  getPayments,
  getInvoices,
} from "@/features/billing/repository";
import { formatCurrency } from "@/features/crm/utils";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [overview, billing, payments, invoices] = await Promise.all([
    getDashboardOverview(),
    getBillingDashboardMetrics(),
    getPayments(),
    getInvoices(),
  ]);

  // Monthly revenue — last 6 months from payments array
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("en-IN", { month: "short" });
    const total = (payments as Array<{ amount: unknown; createdAt: Date | string }>)
      .filter((p) => {
        const pd = new Date(p.createdAt);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { month: label, revenue: Math.round(total) };
  });

  // Lead funnel — use the pre-computed funnel from getDashboardOverview
  const leadFunnel = overview.funnel.map((f: { label: string; value: number }) => ({
    stage: f.label,
    count: f.value,
  }));

  // Invoice status breakdown
  const invoiceItems = (invoices as Array<{ status: string }>);
  const invoiceBreakdown = [
    { name: "Paid",    value: invoiceItems.filter((i) => i.status === "PAID").length,             color: "#25D366" },
    { name: "Sent",    value: invoiceItems.filter((i) => i.status === "SENT").length,             color: "#1565C0" },
    { name: "Overdue", value: invoiceItems.filter((i) => i.status === "OVERDUE").length,          color: "#EF5350" },
    { name: "Partial", value: invoiceItems.filter((i) => i.status === "PARTIALLY_PAID").length,   color: "#F5A623" },
    { name: "Draft",   value: invoiceItems.filter((i) => i.status === "DRAFT").length,            color: "#8896AA" },
  ].filter((d) => d.value > 0);

  // KPI cards — use overview.metrics (pre-computed counts)
  const m = overview.metrics;
  const conversionRate = m.totalLeads > 0
    ? `${Math.round((m.wonLeads / m.totalLeads) * 100)}%`
    : "0%";

  const kpis = [
    { label: "Total Revenue",     value: formatCurrency(Number(billing.totalPaidAmount ?? 0)),    icon: "💰", color: "#25D366" },
    { label: "Pending Payments",  value: formatCurrency(Number(billing.totalBalanceAmount ?? 0)), icon: "⏳", color: "#F5A623" },
    { label: "Total Leads",       value: String(m.totalLeads),                                    icon: "👤", color: "#1565C0" },
    { label: "Conversion Rate",   value: conversionRate,                                          icon: "📈", color: "#8B5CF6" },
    { label: "Active AMC Plans",  value: String(m.dueSoonAmcCount),                               icon: "🔧", color: "#1565C0" },
    { label: "Overdue Invoices",  value: String(invoiceItems.filter(i => i.status === "OVERDUE").length), icon: "🔴", color: "#EF5350" },
  ];

  return (
    <DashboardShell title="Analytics" subtitle="Revenue, leads and conversion overview">
      <div className="px-4 py-5 space-y-6">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[12px] p-4"
              style={{ background: "#0F1F3D", border: "1px solid rgba(21,101,192,0.22)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[18px]">{kpi.icon}</span>
                <span
                  className="text-[10px] uppercase tracking-[0.08em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {kpi.label}
                </span>
              </div>
              <div className="font-bold text-[22px]" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <AnalyticsCharts
          monthlyRevenue={monthlyRevenue}
          leadFunnel={leadFunnel}
          invoiceBreakdown={invoiceBreakdown}
        />
      </div>
    </DashboardShell>
  );
}
