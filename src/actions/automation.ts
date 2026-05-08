"use server";

import {
  ActivityEntityType,
  ActivityType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { actionFailure, actionSuccess, type ActionResponse } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/features/crm/activity";
import { automationRuleSchema } from "@/features/automation/schemas";

type AutomationActionResponse<TData = undefined> = ActionResponse<TData>;

async function getSystemActorId() {
  const actor = await prisma.user.findFirst({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
    },
  });

  return actor?.id ?? null;
}

function revalidateAutomationPaths(ruleId?: string) {
  revalidatePath("/dashboard/automation");

  if (ruleId) {
    revalidatePath(`/dashboard/automation?ruleId=${ruleId}`);
  }
}

export async function createAutomationRule(
  input: unknown,
): Promise<AutomationActionResponse<{ ruleId: string }>> {
  const validated = automationRuleSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the automation rule details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const rule = await tx.automationRule.create({
        data: {
          name: validated.data.name,
          description: validated.data.description,
          triggerType: validated.data.triggerType,
          actionType: validated.data.actionType,
          isActive: validated.data.isActive,
          delayMinutes: validated.data.delayMinutes,
          messageTemplate: validated.data.messageTemplate,
          taskTitle: validated.data.taskTitle,
          taskDescription: validated.data.taskDescription,
          notificationTitle: validated.data.notificationTitle,
          notificationMessage: validated.data.notificationMessage,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.AUTOMATION_RULE_CREATED,
        entityType: ActivityEntityType.AUTOMATION_RULE,
        entityId: rule.id,
        automationRuleId: rule.id,
        userId: actorId,
        description: `Automation rule ${rule.name} created for ${rule.triggerType}.`,
      });

      return {
        ruleId: rule.id,
      };
    });

    revalidateAutomationPaths(result.ruleId);

    return actionSuccess("Automation rule created.", result);
  } catch (error) {
    console.error("Automation rule creation failed", error);
    return actionFailure("We could not create this automation rule.");
  }
}

export async function updateAutomationRule(
  input: unknown,
): Promise<AutomationActionResponse<{ ruleId: string }>> {
  const validated = automationRuleSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the automation rule details.",
      validated.error.flatten().fieldErrors,
    );
  }

  if (!validated.data.ruleId) {
    return actionFailure("The automation rule could not be identified.");
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.automationRule.findUnique({
        where: { id: validated.data.ruleId },
        select: { id: true, name: true },
      });

      if (!existing) {
        throw new Error("Automation rule not found.");
      }

      const rule = await tx.automationRule.update({
        where: { id: existing.id },
        data: {
          name: validated.data.name,
          description: validated.data.description,
          triggerType: validated.data.triggerType,
          actionType: validated.data.actionType,
          isActive: validated.data.isActive,
          delayMinutes: validated.data.delayMinutes,
          messageTemplate: validated.data.messageTemplate,
          taskTitle: validated.data.taskTitle,
          taskDescription: validated.data.taskDescription,
          notificationTitle: validated.data.notificationTitle,
          notificationMessage: validated.data.notificationMessage,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.AUTOMATION_RULE_UPDATED,
        entityType: ActivityEntityType.AUTOMATION_RULE,
        entityId: rule.id,
        automationRuleId: rule.id,
        userId: actorId,
        description: `Automation rule ${rule.name} updated.`,
      });

      return {
        ruleId: rule.id,
      };
    });

    revalidateAutomationPaths(result.ruleId);

    return actionSuccess("Automation rule updated.", result);
  } catch (error) {
    console.error("Automation rule update failed", error);
    return actionFailure("We could not update this automation rule.");
  }
}
