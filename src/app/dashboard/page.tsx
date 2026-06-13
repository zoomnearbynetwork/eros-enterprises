import Link from "next/link";
import {
  Calendar,
  FileText,
  MessageSquare,
  Receipt,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBillingDashboardMetrics, getInvoices } from "@/features/billing/repository";
import { getDashboardOverview } from "@/features/crm/repository";
import { formatCurrency, getInitials } from "@/features/crm/utils";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getLeadStatusStyle(status: string): { bg: string; color: string } {
  switch (status) {
    case "NEW": return { bg: "rgba(245,166,35,0.15)", color: "#F5A623" };
    case "CONTACTED": return { bg: "rgba(21,101,192,0.15)", color: "#64B5F6" };
    case "QUALIFIED": return { bg: "rgba(156,39,176,0.15)", color: "#CE93D8" };
    case "SITE_VISIT_SCHEDULED": return { bg: "rgba(0,150,136,0.15)", color: "#4DB6AC" };
    case "QUOTATION_SENT": return { bg: "rgba(33,150,243,0.15)", color: "#90CAF9" };
    case "WON": return { bg: "rgba(76,175,80,0.15)", color: "#4CAF50" };
    case "LOST": return { bg: "rgba(239,83,80,0.15)", color: "#EF5350" };
    default: return { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" };
  }
}

function getLeadStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    SITE_VISIT_SCHEDULED: "Site Visit",
    QUOTATION_SENT: "Quoted",
    WON: "Won",
    LOST: "Lost",
  };
  return labels[status] ?? status;
}

export default async function DashboardPage() {
  const [overview, billingMetrics, invoices] = await Promise.all([
    getDashboardOverview(),
    getBillingDashboardMetrics(),
    getInvoices({}),
  ]);

  const openInvoiceCount = invoices.filter(
    (inv) => inv.effectiveStatus === "SENT" || inv.effectiveStatus === "PARTIALLY_PAID",
  ).length;

  const kpis = [
    {
      label: "Total leads",
      value: overview.metrics.totalLeads.toString(),
      delta: overview.metrics.totalLeads === 0 ? "Ready to start" : `${overview.metrics.newLeads} new`,
    },
    {
      label: "Quoted value",
      value: formatCurrency(billingMetrics.quotedValue),
      delta: billingMetrics.quotedValue === 0 ? "Ready to start" : "Pipeline value",
    },
    {
      label: "Site visits",
      value: overview.metrics.siteVisitsScheduled.toString(),
      delta: overview.metrics.siteVisitsScheduled === 0 ? "Ready to start" : "Scheduled",
    },
    {
      label: "Open invoices",
      value: openInvoiceCount.toString(),
      delta: openInvoiceCount === 0 ? "Ready to start" : "Awaiting payment",
    },
  ];

  const quickTiles = [
    { label: "Lead pipeline", href: "/dashboard/leads", color: "#1565C0", bg: "rgba(21,101,192,0.12)", Icon: Users },
    { label: "Quotations", href: "/dashboard/quotations", color: "#F5A623", bg: "rgba(245,166,35,0.1)", Icon: FileText },
    { label: "WhatsApp inbox", href: "/dashboard/whatsapp", color: "#25D366", bg: "rgba(37,211,102,0.1)", Icon: MessageSquare },
    { label: "Site visits", href: "/dashboard/site-visits", color: "#EF5350", bg: "rgba(239,83,80,0.1)", Icon: Calendar },
  ];

  return (
    <DashboardShell title="Overview" subtitle="Live CRM snapshot">
      <div className="px-4 py-5 space-y-6">

        {/* Section A — KPI 2×2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[10px] p-4"
              style={{
                background: "#0F1F3D",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#F5A623",
                  lineHeight: 1.15,
                  wordBreak: "break-all",
                }}
              >
                {kpi.value}
              </div>
              <div
                className="mt-1 uppercase tracking-[0.04em]"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)" }}
              >
                {kpi.label}
              </div>
              <div
                className="mt-1.5"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}
              >
                {kpi.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Section B — Quick access tiles 2×2 */}
        <div>
          <div
            className="mb-3 uppercase tracking-[0.06em]"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
          >
            Quick access
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickTiles.map((tile) => (
              <Link
                key={tile.label}
                href={tile.href}
                className="flex items-center gap-3 rounded-[10px] p-4 transition-opacity active:opacity-70"
                style={{
                  background: tile.bg,
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${tile.color}18`, color: tile.color }}
                >
                  <tile.Icon size={18} />
                </div>
                <span
                  style={{ fontSize: "12px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.3 }}
                >
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section C — Recent leads */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div
              className="uppercase tracking-[0.06em]"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
            >
              Recent leads
            </div>
            <Link
              href="/dashboard/leads"
              style={{ fontSize: "11px", color: "#F5A623", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              See all
            </Link>
          </div>

          {overview.recentLeads.length > 0 ? (
            <div className="space-y-2">
              {overview.recentLeads.slice(0, 5).map((lead) => {
                const statusStyle = getLeadStatusStyle(lead.status);
                const isHot = lead.priority === "HIGH" || lead.priority === "URGENT";
                const initials = getInitials(lead.name);

                return (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="flex items-center gap-3 rounded-[10px] px-3 py-3 transition-opacity active:opacity-70"
                    style={{
                      background: "#0F1F3D",
                      border: "0.5px solid rgba(255,255,255,0.07)",
                      borderLeft: `2.5px solid ${isHot ? "#EF5350" : "#1565C0"}`,
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: "rgba(21,101,192,0.25)", color: "#90CAF9" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1" style={{ overflow: "hidden" }}>
                      <div
                        className="font-medium"
                        style={{
                          fontSize: "13px",
                          color: "#FFFFFF",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {lead.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.4)",
                          marginTop: "1px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {lead.serviceInterest} · {timeAgo(new Date(lead.createdAt))}
                      </div>
                    </div>
                    <div
                      className="shrink-0 rounded-full px-2 py-0.5 text-center"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {getLeadStatusLabel(lead.status)}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="rounded-[10px] p-6 text-center"
              style={{
                border: "1px dashed rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
                No leads yet — enquiries will appear here
              </div>
            </div>
          )}
        </div>

        {/* Section D — WhatsApp connect banner */}
        <Link
          href="/dashboard/whatsapp"
          className="flex items-center gap-4 rounded-[12px] p-4 transition-opacity active:opacity-80"
          style={{
            background: "#0F3028",
            border: "1px solid rgba(37,211,102,0.2)",
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(37,211,102,0.15)", color: "#25D366" }}
          >
            <MessageSquare size={22} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>
              Activate WhatsApp automation
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
              Auto-reply, lead capture, follow-ups
            </div>
          </div>
          <Receipt size={16} color="rgba(37,211,102,0.6)" />
        </Link>

      </div>
    </DashboardShell>
  );
}
