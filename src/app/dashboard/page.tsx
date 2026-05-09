import Link from "next/link";
import type { AmcStatus, LeadStatus } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmcStatusBadge, LeadPriorityBadge, LeadStatusBadge, SiteVisitStatusBadge } from "@/features/crm/components/status-badges";
import { getBillingDashboardMetrics } from "@/features/billing/repository";
import { getDashboardOverview } from "@/features/crm/repository";
import {
  LEAD_STATUS_LABELS,
} from "@/features/crm/constants";
import {
  dateTimeFormatter,
  formatCurrency,
  numberFormatter,
  shortDateFormatter,
} from "@/features/crm/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [overview, billingMetrics] = await Promise.all([
    getDashboardOverview(),
    getBillingDashboardMetrics(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">CRM</div>
          <h1 className="mt-3 font-heading text-4xl text-white">Overview</h1>
          <p className="mt-2 max-w-3xl text-zinc-400">
            A live snapshot of lead flow, conversions, customer growth, and upcoming field activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Leads" value={numberFormatter.format(overview.metrics.totalLeads)} />
        <MetricCard label="New Leads" value={numberFormatter.format(overview.metrics.newLeads)} />
        <MetricCard label="Contacted Leads" value={numberFormatter.format(overview.metrics.contactedLeads)} />
        <MetricCard label="Qualified Leads" value={numberFormatter.format(overview.metrics.qualifiedLeads)} />
        <MetricCard label="Site Visits Scheduled" value={numberFormatter.format(overview.metrics.siteVisitsScheduled)} />
        <MetricCard label="Won Leads" value={numberFormatter.format(overview.metrics.wonLeads)} />
        <MetricCard label="Lost Leads" value={numberFormatter.format(overview.metrics.lostLeads)} />
        <MetricCard label="Total Customers" value={numberFormatter.format(overview.metrics.totalCustomers)} />
        <MetricCard label="Active Projects" value={numberFormatter.format(overview.metrics.activeProjects)} />
        <MetricCard label="Completed Projects" value={numberFormatter.format(overview.metrics.completedProjects)} />
        <MetricCard label="Delayed / On Hold" value={numberFormatter.format(overview.metrics.delayedOrOnHoldProjects)} />
        <MetricCard label="AMC Due Soon" value={numberFormatter.format(overview.metrics.dueSoonAmcCount)} />
        <MetricCard label="Expired AMC" value={numberFormatter.format(overview.metrics.expiredAmcCount)} />
        <MetricCard label="Quoted Value" value={formatCurrency(billingMetrics.quotedValue)} />
        <MetricCard label="Invoiced Value" value={formatCurrency(billingMetrics.invoicedValue)} />
        <MetricCard label="Collected Amount" value={formatCurrency(billingMetrics.collectedAmount)} />
        <MetricCard label="Pending Amount" value={formatCurrency(billingMetrics.pendingAmount)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {overview.recentLeads.length > 0 ? (
              <div className="space-y-4">
                {overview.recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                          {lead.leadNumber}
                        </div>
                        <div className="mt-2 font-medium text-white">{lead.name}</div>
                        <div className="mt-1 text-sm text-zinc-400">{lead.phone}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <LeadStatusBadge status={lead.status} />
                        <LeadPriorityBadge priority={lead.priority} />
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-zinc-300">{lead.serviceInterest}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel message="New website and CRM leads will appear here once the pipeline starts receiving enquiries." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Upcoming Site Visits</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {overview.upcomingSiteVisits.length > 0 ? (
                overview.upcomingSiteVisits.map((siteVisit) => (
                  <Link
                    key={siteVisit.id}
                    href={`/dashboard/site-visits/${siteVisit.id}`}
                    className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                        {siteVisit.visitNumber}
                      </div>
                      <SiteVisitStatusBadge status={siteVisit.status} />
                    </div>
                    <div className="mt-3 text-sm font-medium text-white">
                      {siteVisit.customer?.legalName ?? siteVisit.lead?.name ?? "Unlinked visit"}
                    </div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {dateTimeFormatter.format(siteVisit.scheduledAt)}
                    </div>
                    <div className="mt-2 text-sm text-zinc-500">{siteVisit.address}</div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No upcoming site visits right now.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Upcoming AMC Renewals</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {overview.upcomingRenewals.length > 0 ? (
                overview.upcomingRenewals.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/dashboard/amc/${plan.id}`}
                    className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
                        {plan.amcNumber}
                      </div>
                      <AmcStatusBadge status={plan.effectiveStatus as AmcStatus} />
                    </div>
                    <div className="mt-3 text-sm font-medium text-white">{plan.title}</div>
                    <div className="mt-1 text-sm text-zinc-400">{plan.customer.legalName}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      Renewal {shortDateFormatter.format(plan.renewalDate)} | {plan.daysUntilRenewal >= 0 ? `${plan.daysUntilRenewal} days left` : "Overdue"}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No renewal reminders are due right now.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Lead Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {overview.statusSummary.length > 0 ? (
              <div className="space-y-4">
                {overview.statusSummary.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>{LEAD_STATUS_LABELS[item.status as LeadStatus]}</span>
                      <span>{numberFormatter.format(item.count)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/6">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(245,199,107,0.95),rgba(216,145,56,0.75))]"
                        style={{
                          width: `${overview.metrics.totalLeads > 0 ? (item.count / overview.metrics.totalLeads) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel message="Lead status analytics will populate after the first enquiries are stored." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Conversion Funnel Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {overview.funnel.some((item) => item.value > 0) ? (
              <div className="space-y-4">
                {overview.funnel.map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                    style={{
                      width: `${100 - index * 8}%`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-sm text-zinc-400">{numberFormatter.format(item.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel message="The conversion funnel will appear after the first lead records move through the CRM." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
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

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm leading-7 text-zinc-500">
      {message}
    </div>
  );
}
