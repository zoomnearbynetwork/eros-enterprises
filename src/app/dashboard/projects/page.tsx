import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStageBadge } from "@/features/crm/components/status-badges";
import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from "@/features/crm/constants";
import { formatCurrency, formatPersonName, numberFormatter, shortDateFormatter } from "@/features/crm/utils";
import { ProjectCreateForm } from "@/features/projects/components/mutation-controls";
import {
  getProjectDashboardMetrics,
  getProjectManagementOptions,
  getProjects,
} from "@/features/projects/repository";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardProjectsPage(
  props: PageProps<"/dashboard/projects">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    stage: getStringParam(searchParams.stage),
  };

  const [projects, options, metrics] = await Promise.all([
    getProjects(filters),
    getProjectManagementOptions(),
    getProjectDashboardMetrics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Operations</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Projects</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Move accepted work into delivery, track execution stage by stage, and keep commercial records attached all the way through closure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Projects" value={numberFormatter.format(metrics.totalProjects)} />
        <MetricCard label="Active" value={numberFormatter.format(metrics.activeProjects)} />
        <MetricCard label="Completed" value={numberFormatter.format(metrics.completedProjects)} />
        <MetricCard label="Delayed / On Hold" value={numberFormatter.format(metrics.delayedOrOnHoldProjects)} />
      </div>

      <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
        <CardHeader className="border-b border-white/10 py-6">
          <CardTitle className="text-white">Create Project</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProjectCreateForm
            customers={options.customers}
            acceptedQuotations={options.acceptedQuotations}
            managers={options.managers}
            engineers={options.engineers}
          />
        </CardContent>
      </Card>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search number, title, customer, quotation"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="stage" defaultValue={filters.stage ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All stages</option>
          {PROJECT_STAGES.map((stage) => (
            <option key={stage} value={stage} className="bg-[#101113]">
              {PROJECT_STAGE_LABELS[stage]}
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
            href="/dashboard/projects"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="block rounded-[1.75rem] border border-white/10 bg-[#101113]/92 p-5 transition hover:border-white/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{project.projectNumber}</div>
                  <div className="mt-2 text-lg font-medium text-white">{project.title}</div>
                  <div className="mt-2 text-sm text-zinc-400">{project.customer.legalName}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ProjectStageBadge stage={project.stage} />
                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200">
                    {project.progressPercent}%
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                <div>Start: {project.startDate ? shortDateFormatter.format(project.startDate) : "Not set"}</div>
                <div>Target: {project.targetCompletionDate ? shortDateFormatter.format(project.targetCompletionDate) : "Not set"}</div>
                <div>Manager: {formatPersonName(project.projectManager)}</div>
                <div>Engineer: {formatPersonName(project.siteEngineer)}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <span>AMC Plans {project._count.amcPlans}</span>
                {project.quotation ? <span>Quotation {project.quotation.quotationNumber}</span> : null}
                {project.quotation ? <span>Value {formatCurrency(project.quotation.totalAmount)}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardContent className="p-10 text-center text-zinc-400">
              No projects match the current filters yet.
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
