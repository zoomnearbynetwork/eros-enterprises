import { prisma } from "@/lib/prisma";

export async function getAutomationDashboard(selectedRuleId?: string) {
  const rules = await prisma.automationRule.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      triggerType: true,
      actionType: true,
      isActive: true,
      delayMinutes: true,
      messageTemplate: true,
      taskTitle: true,
      taskDescription: true,
      notificationTitle: true,
      notificationMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const selectedRule = selectedRuleId
    ? (rules.find((rule) => rule.id === selectedRuleId) ?? null)
    : null;

  return {
    rules,
    selectedRule,
  };
}
