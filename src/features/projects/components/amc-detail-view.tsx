import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import {
  AmcStatusBadge,
  ProjectStageBadge,
} from "@/features/crm/components/status-badges";
import { dateTimeFormatter, shortDateFormatter } from "@/features/crm/utils";
import { AmcMutationPanel } from "@/features/projects/components/mutation-controls";
import type { getAmcDetail } from "@/features/projects/repository";

type AmcDetail = NonNullable<Awaited<ReturnType<typeof getAmcDetail>>>;

export function AmcDetailView({ plan }: { plan: AmcDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/amc"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to AMC plans
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{plan.title}</h1>
          <p className="mt-2 text-zinc-400">{plan.amcNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AmcStatusBadge status={plan.effectiveStatus} />
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200">
            {plan.daysUntilRenewal >= 0 ? `${plan.daysUntilRenewal} days to renewal` : "Renewal overdue"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">AMC Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Customer" value={plan.customer.legalName} />
              <DetailItem label="Service" value={plan.service?.name ?? "Not linked"} />
              <DetailItem label="Start date" value={shortDateFormatter.format(plan.startDate)} />
              <DetailItem label="End date" value={shortDateFormatter.format(plan.endDate)} />
              <DetailItem label="Renewal date" value={shortDateFormatter.format(plan.renewalDate)} />
              <DetailItem label="Last renewed" value={plan.lastRenewedAt ? dateTimeFormatter.format(plan.lastRenewedAt) : "Not recorded"} />
              <DetailItem label="Contact phone" value={plan.customer.phone ?? "Not provided"} />
              <DetailItem label="Billing address" value={plan.customer.billingAddress ?? "Not provided"} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Linked Project</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {plan.project ? (
                <Link
                  href={`/dashboard/projects/${plan.project.id}`}
                  className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{plan.project.projectNumber}</div>
                    <ProjectStageBadge stage={plan.project.stage} />
                  </div>
                  <div className="mt-3 text-sm text-white">{plan.project.title}</div>
                  <div className="mt-2 text-xs text-zinc-500">Progress {plan.project.progressPercent}%</div>
                </Link>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  This AMC plan is not linked to a project yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Renewal Reminders</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-3">
              {plan.reminderSchedule.map((item) => (
                <div
                  key={item.day}
                  className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.day}-day reminder</div>
                  <div className="mt-3 text-sm text-white">{shortDateFormatter.format(item.reminderDate)}</div>
                  <div className={`mt-2 text-xs ${item.isDue ? "text-amber-200" : "text-zinc-500"}`}>
                    {item.isDue ? "Reminder window reached" : "Pending"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={plan.activities}
                emptyMessage="No AMC activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">AMC Controls</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AmcMutationPanel
              plan={{
                id: plan.id,
                effectiveStatus: plan.effectiveStatus,
                startDate: plan.startDate,
                endDate: plan.endDate,
                renewalDate: plan.renewalDate,
              }}
            />
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
