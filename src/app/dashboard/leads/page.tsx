import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { LeadTable } from "@/features/leads/components/lead-table";
import {
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "@/features/crm/constants";
import leadRepository from "@/features/leads/repository";
import { numberFormatter } from "@/features/crm/utils";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardLeadsPage(
  props: PageProps<"/dashboard/leads">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
    service: getStringParam(searchParams.service),
    source: getStringParam(searchParams.source),
    priority: getStringParam(searchParams.priority),
    assignee: getStringParam(searchParams.assignee),
  };

  const [leads, filterOptions] = await Promise.all([
    leadRepository.getLeadsForDashboard(filters),
    leadRepository.getLeadFilterOptions(),
  ]);
  const newLeadsCount = leads.filter((lead) => lead.status === "NEW").length;
  const hotLeadsCount = leads.filter(
    (lead) => lead.priority === "HIGH" || lead.priority === "URGENT",
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
            CRM
          </div>
          <h1 className="mt-3 font-heading text-4xl text-white">Lead Pipeline</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Website enquiries, quote requests, site visits, and service CTAs land here with source attribution and activity history.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total leads" value={numberFormatter.format(leads.length)} />
        <MetricCard label="New enquiries" value={numberFormatter.format(newLeadsCount)} />
        <MetricCard label="High-priority" value={numberFormatter.format(hotLeadsCount)} />
      </div>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search name, phone, lead number"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="service" defaultValue={filters.service ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All services</option>
          {filterOptions.services.map((service) => (
            <option key={service} value={service} className="bg-[#101113]">
              {service}
            </option>
          ))}
        </select>
        <select name="source" defaultValue={filters.source ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All sources</option>
          {LEAD_SOURCES.map((source) => (
            <option key={source} value={source} className="bg-[#101113]">
              {source.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={filters.priority ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All priorities</option>
          {LEAD_PRIORITIES.map((priority) => (
            <option key={priority} value={priority} className="bg-[#101113]">
              {priority}
            </option>
          ))}
        </select>
        <select name="assignee" defaultValue={filters.assignee ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All assignees</option>
          {filterOptions.users.map((user) => (
            <option key={user.id} value={user.id} className="bg-[#101113]">
              {[user.firstName, user.lastName].filter(Boolean).join(" ")}
            </option>
          ))}
        </select>
        <div className="flex gap-2 xl:col-span-6">
          <button
            type="submit"
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
          >
            Apply Filters
          </button>
          <Link
            href="/dashboard/leads"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      {leads.length > 0 ? (
        <LeadTable leads={leads} />
      ) : (
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardContent className="p-10 text-center text-zinc-400">
            No leads yet. Public website submissions will start appearing here once they are received.
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
