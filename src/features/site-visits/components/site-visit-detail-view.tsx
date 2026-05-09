import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import { SiteVisitMutationPanel } from "@/features/crm/components/mutation-controls";
import { SiteVisitStatusBadge } from "@/features/crm/components/status-badges";
import { dateTimeFormatter, formatPersonName } from "@/features/crm/utils";
import type { getSiteVisitDetail } from "@/features/site-visits/repository";

type SiteVisitDetail = NonNullable<Awaited<ReturnType<typeof getSiteVisitDetail>>>;

type AssignableUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: {
    name: string;
  };
};

export function SiteVisitDetailView({
  siteVisit,
  engineerUsers,
}: {
  siteVisit: SiteVisitDetail;
  engineerUsers: AssignableUser[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/site-visits"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to site visits
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{siteVisit.visitNumber}</h1>
          <p className="mt-2 text-zinc-400">{siteVisit.serviceInterest}</p>
        </div>
        <SiteVisitStatusBadge status={siteVisit.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Visit Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Scheduled at" value={dateTimeFormatter.format(siteVisit.scheduledAt)} />
              <DetailItem label="Status" value={siteVisit.status.replaceAll("_", " ")} />
              <DetailItem label="Address" value={siteVisit.address} />
              <DetailItem label="Assigned engineer" value={formatPersonName(siteVisit.assignedEngineer)} />
              <DetailItem
                label="Lead"
                value={siteVisit.lead ? `${siteVisit.lead.leadNumber} | ${siteVisit.lead.name}` : "No linked lead"}
              />
              <DetailItem
                label="Customer"
                value={siteVisit.customer ? `${siteVisit.customer.customerNumber} | ${siteVisit.customer.legalName}` : "No linked customer"}
              />
              <DetailItem label="Created at" value={dateTimeFormatter.format(siteVisit.createdAt)} />
              <DetailItem label="Last updated" value={dateTimeFormatter.format(siteVisit.updatedAt)} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Visit Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                {siteVisit.notes ?? "No structured visit note has been added yet."}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={siteVisit.activities}
                emptyMessage="No site visit activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <SiteVisitMutationPanel
          siteVisit={{
            id: siteVisit.id,
            status: siteVisit.status,
            assignedEngineerId: siteVisit.assignedEngineerId,
          }}
          engineerUsers={engineerUsers}
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
