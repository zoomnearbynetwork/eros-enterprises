import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AutomationActionBadge,
  AutomationTriggerBadge,
} from "@/features/crm/components/status-badges";
import { dateTimeFormatter, numberFormatter } from "@/features/crm/utils";
import { AutomationRuleForm } from "@/features/automation/components/automation-rule-form";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_TRIGGER_LABELS,
} from "@/features/automation/constants";
import { getAutomationDashboard } from "@/features/automation/repository";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardAutomationPage(
  props: PageProps<"/dashboard/automation">,
) {
  const searchParams = await props.searchParams;
  const ruleId = getStringParam(searchParams.ruleId);
  const automation = await getAutomationDashboard(ruleId);
  const activeRules = automation.rules.filter((rule) => rule.isActive).length;
  const whatsappRules = automation.rules.filter(
    (rule) => rule.actionType === "SEND_WHATSAPP_MESSAGE",
  ).length;

  return (
    <DashboardShell title="Automation">
      <div className="px-4 py-5 space-y-6">

        <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Rules" value={numberFormatter.format(automation.rules.length)} />
        <MetricCard label="Active" value={numberFormatter.format(activeRules)} />
        <MetricCard label="WhatsApp actions" value={numberFormatter.format(whatsappRules)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 py-6">
            <CardTitle className="text-white">Rule List</CardTitle>
            <Link
              href="/dashboard/automation"
              className="rounded-3xl border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              New rule
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {automation.rules.length > 0 ? (
                automation.rules.map((rule) => (
                  <Link
                    key={rule.id}
                    href={`/dashboard/automation?ruleId=${rule.id}`}
                    className={`block rounded-[1.5rem] border p-4 transition ${
                      automation.selectedRule?.id === rule.id
                        ? "border-amber-300/40 bg-amber-200/[0.06]"
                        : "border-white/8 bg-white/[0.03] hover:border-white/15"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{rule.name}</div>
                      <div
                        className={`rounded-3xl px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                          rule.isActive
                            ? "bg-emerald-500/15 text-emerald-200"
                            : "bg-zinc-500/15 text-zinc-300"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Paused"}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AutomationTriggerBadge trigger={rule.triggerType} />
                      <AutomationActionBadge action={rule.actionType} />
                    </div>
                    <div className="mt-3 text-sm text-zinc-400">
                      {rule.description ?? `${AUTOMATION_TRIGGER_LABELS[rule.triggerType]} -> ${AUTOMATION_ACTION_LABELS[rule.actionType]}`}
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      Delay {numberFormatter.format(rule.delayMinutes)} min | Updated {dateTimeFormatter.format(rule.updatedAt)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
                  No automation rules yet. Create the first rule to start defining follow-up behavior for leads, visits, quotations, invoices, and renewals.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardHeader className="border-b border-white/10 py-6">
            <CardTitle className="text-white">
              {automation.selectedRule ? "Edit Rule" : "Create Rule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-sm leading-7 text-zinc-400">
              Rules are stored as typed trigger/action records so background workers can execute them later without changing the configuration model. Message templates, task payloads, and notification payloads are already separated for that handoff.
            </div>
            <AutomationRuleForm
              key={automation.selectedRule?.id ?? "new-rule"}
              selectedRule={automation.selectedRule}
            />
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardShell>
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
