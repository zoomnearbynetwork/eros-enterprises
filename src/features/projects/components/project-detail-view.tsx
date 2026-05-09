import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/crm/components/activity-timeline";
import {
  InvoiceStatusBadge,
  PaymentMethodBadge,
  ProjectStageBadge,
  QuotationStatusBadge,
} from "@/features/crm/components/status-badges";
import { dateTimeFormatter, formatCurrency, formatPersonName, shortDateFormatter } from "@/features/crm/utils";
import { ProjectMutationPanel } from "@/features/projects/components/mutation-controls";
import type { getProjectDetail, getProjectManagementOptions } from "@/features/projects/repository";

type ProjectDetail = NonNullable<Awaited<ReturnType<typeof getProjectDetail>>>;
type ProjectOptions = Awaited<ReturnType<typeof getProjectManagementOptions>>;

export function ProjectDetailView({
  project,
  options,
}: {
  project: ProjectDetail;
  options: ProjectOptions;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          >
            Back to projects
          </Link>
          <h1 className="mt-3 font-heading text-4xl text-white">{project.title}</h1>
          <p className="mt-2 text-zinc-400">{project.projectNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ProjectStageBadge stage={project.stage} />
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200">
            Progress {project.progressPercent}%
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Project Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <DetailItem label="Customer" value={project.customer.legalName} />
              <DetailItem label="Project manager" value={formatPersonName(project.projectManager)} />
              <DetailItem label="Site engineer" value={formatPersonName(project.siteEngineer)} />
              <DetailItem label="Start date" value={project.startDate ? shortDateFormatter.format(project.startDate) : "Not set"} />
              <DetailItem label="Target completion" value={project.targetCompletionDate ? shortDateFormatter.format(project.targetCompletionDate) : "Not set"} />
              <DetailItem label="Completed at" value={project.completedAt ? dateTimeFormatter.format(project.completedAt) : "Not completed"} />
              <DetailItem label="Contact phone" value={project.customer.phone ?? "Not provided"} />
              <DetailItem label="Billing address" value={project.customer.billingAddress ?? "Not provided"} />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Linked Commercials</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 md:grid-cols-3">
              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Quotation</div>
                {project.quotation ? (
                  <Link
                    href={`/dashboard/quotations/${project.quotation.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{project.quotation.quotationNumber}</div>
                      <QuotationStatusBadge status={project.quotation.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(project.quotation.totalAmount)}</div>
                  </Link>
                ) : (
                  <PlaceholderCard title="Quotation" description="This project was created without an accepted quotation link." />
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Invoice</div>
                {project.quotation?.invoice ? (
                  <Link
                    href={`/dashboard/invoices/${project.quotation.invoice.id}`}
                    className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{project.quotation.invoice.invoiceNumber}</div>
                      <InvoiceStatusBadge status={project.quotation.invoice.status} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(project.quotation.invoice.totalAmount)}</div>
                    <div className="mt-1 text-xs text-zinc-500">Balance {formatCurrency(project.quotation.invoice.balanceAmount)}</div>
                  </Link>
                ) : (
                  <PlaceholderCard title="Invoice" description="No invoice has been linked to this project yet." />
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Payments</div>
                {project.quotation?.invoice?.payments.length ? project.quotation.invoice.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{payment.paymentNumber}</div>
                      <PaymentMethodBadge method={payment.method} />
                    </div>
                    <div className="mt-3 text-sm text-white">{formatCurrency(payment.amount)}</div>
                    <div className="mt-1 text-xs text-zinc-500">{dateTimeFormatter.format(payment.paidAt)}</div>
                  </div>
                )) : (
                  <PlaceholderCard title="Payments" description="Payments will appear here once invoice collections begin." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-4">
              <SummaryTile label="Quoted" value={formatCurrency(project.financialSummary.quotationTotalAmount)} />
              <SummaryTile label="Invoiced" value={formatCurrency(project.financialSummary.invoiceTotalAmount)} />
              <SummaryTile label="Collected" value={formatCurrency(project.financialSummary.paymentAmount)} />
              <SummaryTile label="Balance" value={formatCurrency(project.financialSummary.invoiceBalanceAmount)} emphasized />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">AMC Plans</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {project.amcPlans.length > 0 ? (
                <div className="space-y-4">
                  {project.amcPlans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/dashboard/amc/${plan.id}`}
                      className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-amber-200/90">{plan.amcNumber}</div>
                        <div className="text-xs text-zinc-500">Renewal {shortDateFormatter.format(plan.renewalDate)}</div>
                      </div>
                      <div className="mt-2 text-sm text-white">{plan.title}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No AMC plans have been linked to this project yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
            <CardHeader className="border-b border-white/10 py-6">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline
                activities={project.activities}
                emptyMessage="No project activity has been recorded yet."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">Project Controls</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ProjectMutationPanel
              project={{
                id: project.id,
                stage: project.stage,
                progressPercent: project.progressPercent,
                projectManagerId: project.projectManagerId,
                siteEngineerId: project.siteEngineerId,
              }}
              managers={options.managers}
              engineers={options.engineers}
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

function PlaceholderCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-5">
      <div className="text-sm font-medium text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className={`mt-3 text-lg ${emphasized ? "font-semibold text-white" : "text-zinc-200"}`}>
        {value}
      </div>
    </div>
  );
}
