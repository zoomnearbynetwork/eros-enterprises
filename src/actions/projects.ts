"use server";

import {
  ActivityEntityType,
  ActivityType,
  ProjectStage,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { actionFailure, actionSuccess, type ActionResponse } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/features/crm/activity";
import { createAmcNumber, createProjectNumber } from "@/features/crm/numbering";
import { formatPersonName } from "@/features/crm/utils";
import {
  addAmcNoteSchema,
  addProjectNoteSchema,
  createAmcPlanSchema,
  createProjectSchema,
  updateAmcDatesSchema,
  updateAmcStatusSchema,
  updateProjectAssignmentsSchema,
  updateProjectProgressSchema,
  updateProjectStageSchema,
} from "@/features/projects/schemas";

type ProjectActionResponse<TData = undefined> = ActionResponse<TData>;

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

function revalidateProjectPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function createProject(
  input: unknown,
): Promise<ProjectActionResponse<{ projectId: string }>> {
  const validated = createProjectSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please review the project details.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: validated.data.customerId },
        select: {
          id: true,
          legalName: true,
        },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }

      let quotation: {
        id: string;
        quotationNumber: string;
        customerId: string | null;
        status: string;
        project: {
          id: string;
        } | null;
      } | null = null;

      if (validated.data.quotationId) {
        quotation = await tx.quotation.findUnique({
          where: { id: validated.data.quotationId },
          select: {
            id: true,
            quotationNumber: true,
            customerId: true,
            status: true,
            project: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!quotation || quotation.status !== "ACCEPTED") {
          throw new Error("Project source quotation must be accepted.");
        }

        if (quotation.project) {
          throw new Error("A project already exists for this quotation.");
        }

        if (quotation.customerId && quotation.customerId !== customer.id) {
          throw new Error("Selected customer does not match the accepted quotation.");
        }
      }

      const projectNumber = await createProjectNumber();

      const project = await tx.project.create({
        data: {
          projectNumber,
          customerId: customer.id,
          quotationId: validated.data.quotationId,
          title: validated.data.title,
          description: validated.data.description,
          startDate: validated.data.startDate,
          targetCompletionDate: validated.data.targetCompletionDate,
          projectManagerId: validated.data.projectManagerId,
          siteEngineerId: validated.data.siteEngineerId,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.PROJECT_CREATED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: customer.id,
        quotationId: validated.data.quotationId,
        userId: actorId,
        description: `Project ${project.projectNumber} created for ${customer.legalName}.`,
      });

      if (validated.data.projectManagerId) {
        const manager = await tx.user.findUnique({
          where: { id: validated.data.projectManagerId },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        if (manager) {
          await createActivityLog(tx, {
            type: ActivityType.PROJECT_MANAGER_ASSIGNED,
            entityType: ActivityEntityType.PROJECT,
            entityId: project.id,
            projectId: project.id,
            customerId: customer.id,
            quotationId: validated.data.quotationId,
            userId: actorId,
            description: `Project manager assigned to ${formatPersonName(manager)}.`,
          });
        }
      }

      if (validated.data.siteEngineerId) {
        const engineer = await tx.user.findUnique({
          where: { id: validated.data.siteEngineerId },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        if (engineer) {
          await createActivityLog(tx, {
            type: ActivityType.PROJECT_ENGINEER_ASSIGNED,
            entityType: ActivityEntityType.PROJECT,
            entityId: project.id,
            projectId: project.id,
            customerId: customer.id,
            quotationId: validated.data.quotationId,
            userId: actorId,
            description: `Site engineer assigned to ${formatPersonName(engineer)}.`,
          });
        }
      }

      return { projectId: project.id, customerId: customer.id };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/projects",
      `/dashboard/projects/${result.projectId}`,
      "/dashboard/customers",
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Project created.", { projectId: result.projectId });
  } catch (error) {
    console.error("Create project failed", error);
    return actionFailure(
      error instanceof Error ? error.message : "We could not create the project.",
    );
  }
}

export async function updateProjectStage(
  input: unknown,
): Promise<ProjectActionResponse<{ projectId: string; stage: string }>> {
  const validated = updateProjectStageSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please choose a valid project stage.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: validated.data.projectId },
        select: {
          id: true,
          projectNumber: true,
          stage: true,
          customerId: true,
        },
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      const nextStage = validated.data.stage;
      const completedAt =
        nextStage === ProjectStage.COMPLETED || nextStage === ProjectStage.CLOSED
          ? new Date()
          : null;

      const updatedProject = await tx.project.update({
        where: { id: project.id },
        data: {
          stage: nextStage,
          progressPercent:
            nextStage === ProjectStage.COMPLETED || nextStage === ProjectStage.CLOSED
              ? 100
              : undefined,
          completedAt,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.PROJECT_STAGE_CHANGED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: project.customerId,
        userId: actorId,
        description: `Project ${project.projectNumber} stage changed from ${project.stage} to ${updatedProject.stage}.`,
      });

      return {
        projectId: updatedProject.id,
        stage: updatedProject.stage,
        customerId: project.customerId,
      };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/projects",
      `/dashboard/projects/${result.projectId}`,
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Project stage updated.", {
      projectId: result.projectId,
      stage: result.stage,
    });
  } catch (error) {
    console.error("Project stage update failed", error);
    return actionFailure("We could not update the project stage.");
  }
}

export async function updateProjectAssignments(
  input: unknown,
): Promise<ProjectActionResponse<{ projectId: string }>> {
  const validated = updateProjectAssignmentsSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please review the project assignments.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: validated.data.projectId },
        select: {
          id: true,
          projectNumber: true,
          customerId: true,
          projectManager: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          siteEngineer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      const [manager, engineer] = await Promise.all([
        validated.data.projectManagerId
          ? tx.user.findUnique({
              where: { id: validated.data.projectManagerId },
              select: { id: true, firstName: true, lastName: true },
            })
          : Promise.resolve(null),
        validated.data.siteEngineerId
          ? tx.user.findUnique({
              where: { id: validated.data.siteEngineerId },
              select: { id: true, firstName: true, lastName: true },
            })
          : Promise.resolve(null),
      ]);

      const updated = await tx.project.update({
        where: { id: project.id },
        data: {
          projectManagerId: manager?.id ?? null,
          siteEngineerId: engineer?.id ?? null,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.PROJECT_MANAGER_ASSIGNED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: project.customerId,
        userId: actorId,
        description: `Project manager changed from ${formatPersonName(project.projectManager)} to ${formatPersonName(manager)}.`,
      });

      await createActivityLog(tx, {
        type: ActivityType.PROJECT_ENGINEER_ASSIGNED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: project.customerId,
        userId: actorId,
        description: `Site engineer changed from ${formatPersonName(project.siteEngineer)} to ${formatPersonName(engineer)}.`,
      });

      return {
        projectId: updated.id,
        customerId: project.customerId,
      };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/projects",
      `/dashboard/projects/${result.projectId}`,
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Project assignments updated.", { projectId: result.projectId });
  } catch (error) {
    console.error("Project assignment update failed", error);
    return actionFailure("We could not update the project assignments.");
  }
}

export async function updateProjectProgress(
  input: unknown,
): Promise<ProjectActionResponse<{ projectId: string; progressPercent: number }>> {
  const validated = updateProjectProgressSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid progress percentage.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: validated.data.projectId },
        select: {
          id: true,
          projectNumber: true,
          progressPercent: true,
          customerId: true,
        },
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      const updatedProject = await tx.project.update({
        where: { id: project.id },
        data: {
          progressPercent: validated.data.progressPercent,
          stage: validated.data.progressPercent === 100 ? ProjectStage.COMPLETED : undefined,
          completedAt: validated.data.progressPercent === 100 ? new Date() : undefined,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.PROJECT_PROGRESS_UPDATED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: project.customerId,
        userId: actorId,
        description: `Project ${project.projectNumber} progress moved from ${project.progressPercent}% to ${updatedProject.progressPercent}%.`,
      });

      return {
        projectId: updatedProject.id,
        progressPercent: updatedProject.progressPercent,
        customerId: project.customerId,
      };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/projects",
      `/dashboard/projects/${result.projectId}`,
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Project progress updated.", {
      projectId: result.projectId,
      progressPercent: result.progressPercent,
    });
  } catch (error) {
    console.error("Project progress update failed", error);
    return actionFailure("We could not update project progress.");
  }
}

export async function addProjectNote(
  input: unknown,
): Promise<ProjectActionResponse<{ projectId: string }>> {
  const validated = addProjectNoteSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid note.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: validated.data.projectId },
        select: {
          id: true,
          customerId: true,
        },
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      await createActivityLog(tx, {
        type: ActivityType.NOTE_ADDED,
        entityType: ActivityEntityType.PROJECT,
        entityId: project.id,
        projectId: project.id,
        customerId: project.customerId,
        userId: actorId,
        description: validated.data.note,
      });

      return project;
    });

    revalidateProjectPaths([
      "/dashboard/projects",
      `/dashboard/projects/${result.id}`,
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Project note added.", { projectId: result.id });
  } catch (error) {
    console.error("Project note failed", error);
    return actionFailure("We could not save this project note.");
  }
}

export async function createAmcPlan(
  input: unknown,
): Promise<ProjectActionResponse<{ amcPlanId: string }>> {
  const validated = createAmcPlanSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please review the AMC plan details.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: validated.data.customerId },
        select: {
          id: true,
          legalName: true,
        },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }

      if (validated.data.projectId) {
        const project = await tx.project.findUnique({
          where: { id: validated.data.projectId },
          select: {
            id: true,
            customerId: true,
          },
        });

        if (!project || project.customerId !== customer.id) {
          throw new Error("Selected project does not belong to this customer.");
        }
      }

      const amcNumber = await createAmcNumber();

      const plan = await tx.amcPlan.create({
        data: {
          amcNumber,
          customerId: customer.id,
          projectId: validated.data.projectId,
          serviceId: validated.data.serviceId,
          title: validated.data.title,
          description: validated.data.description,
          startDate: validated.data.startDate,
          endDate: validated.data.endDate,
          renewalDate: validated.data.renewalDate,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.AMC_PLAN_CREATED,
        entityType: ActivityEntityType.AMC_PLAN,
        entityId: plan.id,
        amcPlanId: plan.id,
        customerId: customer.id,
        projectId: validated.data.projectId,
        serviceId: validated.data.serviceId,
        userId: actorId,
        description: `AMC plan ${plan.amcNumber} created for ${customer.legalName}.`,
      });

      return {
        amcPlanId: plan.id,
        customerId: customer.id,
        projectId: validated.data.projectId,
      };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/amc",
      `/dashboard/amc/${result.amcPlanId}`,
      `/dashboard/customers/${result.customerId}`,
      ...(result.projectId ? [`/dashboard/projects/${result.projectId}`] : []),
    ]);

    return actionSuccess("AMC plan created.", { amcPlanId: result.amcPlanId });
  } catch (error) {
    console.error("Create AMC plan failed", error);
    return actionFailure(
      error instanceof Error ? error.message : "We could not create the AMC plan.",
    );
  }
}

export async function updateAmcStatus(
  input: unknown,
): Promise<ProjectActionResponse<{ amcPlanId: string; status: string }>> {
  const validated = updateAmcStatusSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please choose a valid AMC status.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.amcPlan.findUnique({
        where: { id: validated.data.amcPlanId },
        select: {
          id: true,
          amcNumber: true,
          status: true,
          customerId: true,
          projectId: true,
        },
      });

      if (!plan) {
        throw new Error("AMC plan not found.");
      }

      const updated = await tx.amcPlan.update({
        where: { id: plan.id },
        data: {
          status: validated.data.status,
          lastRenewedAt: validated.data.status === "RENEWED" ? new Date() : undefined,
        },
      });

      await createActivityLog(tx, {
        type: validated.data.status === "RENEWED"
          ? ActivityType.AMC_RENEWAL_RECORDED
          : ActivityType.AMC_STATUS_CHANGED,
        entityType: ActivityEntityType.AMC_PLAN,
        entityId: plan.id,
        amcPlanId: plan.id,
        customerId: plan.customerId,
        projectId: plan.projectId,
        userId: actorId,
        description: `AMC ${plan.amcNumber} status changed from ${plan.status} to ${updated.status}.`,
      });

      return {
        amcPlanId: updated.id,
        status: updated.status,
        customerId: plan.customerId,
        projectId: plan.projectId,
      };
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/amc",
      `/dashboard/amc/${result.amcPlanId}`,
      `/dashboard/customers/${result.customerId}`,
      ...(result.projectId ? [`/dashboard/projects/${result.projectId}`] : []),
    ]);

    return actionSuccess("AMC status updated.", {
      amcPlanId: result.amcPlanId,
      status: result.status,
    });
  } catch (error) {
    console.error("AMC status update failed", error);
    return actionFailure("We could not update the AMC status.");
  }
}

export async function updateAmcDates(
  input: unknown,
): Promise<ProjectActionResponse<{ amcPlanId: string }>> {
  const validated = updateAmcDatesSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please review the AMC dates.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.amcPlan.findUnique({
        where: { id: validated.data.amcPlanId },
        select: {
          id: true,
          amcNumber: true,
          customerId: true,
          projectId: true,
        },
      });

      if (!plan) {
        throw new Error("AMC plan not found.");
      }

      await tx.amcPlan.update({
        where: { id: plan.id },
        data: {
          startDate: validated.data.startDate,
          endDate: validated.data.endDate,
          renewalDate: validated.data.renewalDate,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.AMC_PLAN_UPDATED,
        entityType: ActivityEntityType.AMC_PLAN,
        entityId: plan.id,
        amcPlanId: plan.id,
        customerId: plan.customerId,
        projectId: plan.projectId,
        userId: actorId,
        description: `AMC ${plan.amcNumber} dates were updated.`,
      });

      return plan;
    });

    revalidateProjectPaths([
      "/dashboard",
      "/dashboard/amc",
      `/dashboard/amc/${result.id}`,
      `/dashboard/customers/${result.customerId}`,
      ...(result.projectId ? [`/dashboard/projects/${result.projectId}`] : []),
    ]);

    return actionSuccess("AMC dates updated.", { amcPlanId: result.id });
  } catch (error) {
    console.error("AMC date update failed", error);
    return actionFailure("We could not update the AMC dates.");
  }
}

export async function addAmcNote(
  input: unknown,
): Promise<ProjectActionResponse<{ amcPlanId: string }>> {
  const validated = addAmcNoteSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid note.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.amcPlan.findUnique({
        where: { id: validated.data.amcPlanId },
        select: {
          id: true,
          customerId: true,
          projectId: true,
        },
      });

      if (!plan) {
        throw new Error("AMC plan not found.");
      }

      await createActivityLog(tx, {
        type: ActivityType.NOTE_ADDED,
        entityType: ActivityEntityType.AMC_PLAN,
        entityId: plan.id,
        amcPlanId: plan.id,
        customerId: plan.customerId,
        projectId: plan.projectId,
        userId: actorId,
        description: validated.data.note,
      });

      return plan;
    });

    revalidateProjectPaths([
      "/dashboard/amc",
      `/dashboard/amc/${result.id}`,
      `/dashboard/customers/${result.customerId}`,
      ...(result.projectId ? [`/dashboard/projects/${result.projectId}`] : []),
    ]);

    return actionSuccess("AMC note added.", { amcPlanId: result.id });
  } catch (error) {
    console.error("AMC note failed", error);
    return actionFailure("We could not save this AMC note.");
  }
}
