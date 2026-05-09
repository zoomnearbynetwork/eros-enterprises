import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SITE_VISIT_STATUSES } from "@/features/crm/constants";
import { numberFormatter } from "@/features/crm/utils";
import { SiteVisitTable } from "@/features/site-visits/components/site-visit-table";
import { getSiteVisits } from "@/features/site-visits/repository";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardSiteVisitsPage(
  props: PageProps<"/dashboard/site-visits">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
    service: getStringParam(searchParams.service),
  };

  const siteVisits = await getSiteVisits(filters);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">CRM</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Site Visits</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Schedule, assign, and complete technical site visits with clean field visibility.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total visits" value={numberFormatter.format(siteVisits.length)} />
        <MetricCard label="Scheduled" value={numberFormatter.format(siteVisits.filter((item) => item.status === "SCHEDULED").length)} />
        <MetricCard label="Completed" value={numberFormatter.format(siteVisits.filter((item) => item.status === "COMPLETED").length)} />
      </div>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-3">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search visit, customer, lead, address"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {SITE_VISIT_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <input
          name="service"
          defaultValue={filters.service}
          placeholder="Filter by service"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500"
        />
        <div className="flex gap-2 xl:col-span-3">
          <button
            type="submit"
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
          >
            Apply Filters
          </button>
          <Link
            href="/dashboard/site-visits"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      {siteVisits.length > 0 ? (
        <SiteVisitTable siteVisits={siteVisits} />
      ) : (
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardContent className="p-10 text-center text-zinc-400">
            No site visits yet. Schedule the first one from a lead detail page.
          </CardContent>
        </Card>
      )}
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
