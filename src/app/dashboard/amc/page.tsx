import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmcStatusBadge } from "@/features/crm/components/status-badges";
import { AMC_STATUSES, AMC_STATUS_LABELS } from "@/features/crm/constants";
import { numberFormatter, shortDateFormatter } from "@/features/crm/utils";
import { AmcCreateForm } from "@/features/projects/components/mutation-controls";
import {
  getAmcDashboardMetrics,
  getAmcManagementOptions,
  getAmcPlans,
} from "@/features/projects/repository";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardAmcPage(
  props: PageProps<"/dashboard/amc">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
  };

  const [plans, options, metrics] = await Promise.all([
    getAmcPlans(filters),
    getAmcManagementOptions(),
    getAmcDashboardMetrics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Retention</div>
        <h1 className="mt-3 font-heading text-4xl text-white">AMC Plans</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Track maintenance contracts, renewal windows, and customer retention opportunities without sending real reminders yet.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total AMC Plans" value={numberFormatter.format(metrics.totalAmcPlans)} />
        <MetricCard label="Due Soon" value={numberFormatter.format(metrics.dueSoonCount)} />
        <MetricCard label="Expired" value={numberFormatter.format(metrics.expiredCount)} />
        <MetricCard label="Upcoming Renewals" value={numberFormatter.format(metrics.upcomingRenewals.length)} />
      </div>

      <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
        <CardHeader className="border-b border-white/10 py-6">
          <CardTitle className="text-white">Create AMC Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AmcCreateForm
            customers={options.customers}
            projects={options.projects}
            services={options.services}
          />
        </CardContent>
      </Card>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search AMC, customer, project, service"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {AMC_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {AMC_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
          >
            Apply Filters
          </button>
          <Link
            href="/dashboard/amc"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="space-y-4">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/dashboard/amc/${plan.id}`}
              className="block rounded-[1.75rem] border border-white/10 bg-[#101113]/92 p-5 transition hover:border-white/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{plan.amcNumber}</div>
                  <div className="mt-2 text-lg font-medium text-white">{plan.title}</div>
                  <div className="mt-2 text-sm text-zinc-400">{plan.customer.legalName}</div>
                </div>
                <AmcStatusBadge status={plan.effectiveStatus} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                <div>Start: {shortDateFormatter.format(plan.startDate)}</div>
                <div>End: {shortDateFormatter.format(plan.endDate)}</div>
                <div>Renewal: {shortDateFormatter.format(plan.renewalDate)}</div>
                <div>{plan.daysUntilRenewal >= 0 ? `${plan.daysUntilRenewal} days left` : "Renewal overdue"}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-zinc-500">
                {plan.project ? <span>Project {plan.project.projectNumber}</span> : <span>Standalone AMC</span>}
                {plan.service ? <span>Service {plan.service.name}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardContent className="p-10 text-center text-zinc-400">
              No AMC plans match the current filters yet.
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
