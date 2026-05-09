"use server";

import {
  ActivityEntityType,
  ActivityType,
  CustomerStatus,
  SiteVisitStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { actionFailure, actionSuccess, type ActionResponse } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/features/crm/activity";
import { createCustomerNumber, createSiteVisitNumber } from "@/features/crm/numbering";
import {
  addCustomerNoteSchema,
  addLeadNoteSchema,
  addSiteVisitNoteSchema,
  assignLeadSchema,
  assignSiteVisitEngineerSchema,
  convertLeadToCustomerSchema,
  createSiteVisitSchema,
  updateLeadPrioritySchema,
  updateLeadStatusSchema,
  updateSiteVisitStatusSchema,
} from "@/features/crm/schemas";
import { findExistingCustomerByContact } from "@/features/customers/repository";
import { formatPersonName } from "@/features/crm/utils";

type CrmActionResponse<TData = undefined> = ActionResponse<TData>;

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

function revalidateCrmPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function updateLeadStatus(
  input: unknown,
): Promise<CrmActionResponse<{ leadId: string; status: string }>> {
  const validated = updateLeadStatusSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please choose a valid lead status.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: validated.data.leadId },
        select: {
          id: true,
          leadNumber: true,
          status: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found.");
      }

      if (lead.status === validated.data.status) {
        return {
          leadId: lead.id,
          status: lead.status,
        };
      }

      const updatedLead = await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: validated.data.status,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.LEAD_STATUS_CHANGED,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        userId: actorId,
        description: `Lead ${lead.leadNumber} status changed from ${lead.status} to ${updatedLead.status}.`,
        metadata: {
          previousStatus: lead.status,
          nextStatus: updatedLead.status,
        },
      });

      return {
        leadId: updatedLead.id,
        status: updatedLead.status,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/leads",
      `/dashboard/leads/${result.leadId}`,
    ]);

    return actionSuccess("Lead status updated.", result);
  } catch (error) {
    console.error("Lead status update failed", error);
    return actionFailure("We could not update the lead status.");
  }
}

export async function updateLeadPriority(
  input: unknown,
): Promise<CrmActionResponse<{ leadId: string; priority: string }>> {
  const validated = updateLeadPrioritySchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please choose a valid lead priority.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: validated.data.leadId },
        select: {
          id: true,
          leadNumber: true,
          priority: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found.");
      }

      if (lead.priority === validated.data.priority) {
        return {
          leadId: lead.id,
          priority: lead.priority,
        };
      }

      const updatedLead = await tx.lead.update({
        where: { id: lead.id },
        data: {
          priority: validated.data.priority,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.LEAD_PRIORITY_CHANGED,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        userId: actorId,
        description: `Lead ${lead.leadNumber} priority changed from ${lead.priority} to ${updatedLead.priority}.`,
        metadata: {
          previousPriority: lead.priority,
          nextPriority: updatedLead.priority,
        },
      });

      return {
        leadId: updatedLead.id,
        priority: updatedLead.priority,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/leads",
      `/dashboard/leads/${result.leadId}`,
    ]);

    return actionSuccess("Lead priority updated.", result);
  } catch (error) {
    console.error("Lead priority update failed", error);
    return actionFailure("We could not update the lead priority.");
  }
}

export async function assignLead(
  input: unknown,
): Promise<CrmActionResponse<{ leadId: string; assignedUserId: string }>> {
  const validated = assignLeadSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please choose a valid assignee.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [lead, user] = await Promise.all([
        tx.lead.findUnique({
          where: { id: validated.data.leadId },
          select: {
            id: true,
            leadNumber: true,
            assignedTo: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        tx.user.findUnique({
          where: { id: validated.data.userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        }),
      ]);

      if (!lead || !user) {
        throw new Error("Lead or assignee not found.");
      }

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          assignedToId: user.id,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.LEAD_ASSIGNED,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        userId: actorId,
        description: `Lead ${lead.leadNumber} assigned to ${formatPersonName(user)}.`,
        metadata: {
          previousAssignee: formatPersonName(lead.assignedTo),
          nextAssignee: formatPersonName(user),
        },
      });

      return {
        leadId: lead.id,
        assignedUserId: user.id,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/leads",
      `/dashboard/leads/${result.leadId}`,
    ]);

    return actionSuccess("Lead assignment updated.", result);
  } catch (error) {
    console.error("Lead assignment failed", error);
    return actionFailure("We could not assign this lead.");
  }
}

export async function convertLeadToCustomer(
  input: unknown,
): Promise<CrmActionResponse<{ customerId: string; leadId: string }>> {
  const validated = convertLeadToCustomerSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the customer conversion details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: validated.data.leadId },
        include: {
          customer: {
            select: {
              id: true,
              customerNumber: true,
            },
          },
        },
      });

      if (!lead) {
        throw new Error("Lead not found.");
      }

      if (lead.customer) {
        return {
          customerId: lead.customer.id,
          leadId: lead.id,
        };
      }

      const existingCustomer = await findExistingCustomerByContact({
        phone: lead.phone,
        email: lead.email,
      });

      let customerId = existingCustomer?.id;

      if (existingCustomer) {
        await tx.customer.update({
          where: { id: existingCustomer.id },
          data: {
            leadId: lead.id,
            status: CustomerStatus.ACTIVE,
          },
        });
      } else {
        const customerNumber = await createCustomerNumber();

        const customer = await tx.customer.create({
          data: {
            customerNumber,
            legalName: lead.name,
            primaryContactName: lead.name,
            phone: lead.phone,
            email: lead.email,
            leadId: lead.id,
            type: validated.data.customerType,
            status: CustomerStatus.ACTIVE,
            notes: lead.message,
          },
        });

        customerId = customer.id;
      }

      if (!customerId) {
        throw new Error("Customer could not be created or linked.");
      }

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: "WON",
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.LEAD_CONVERTED_TO_CUSTOMER,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        customerId,
        userId: actorId,
        description: `Lead ${lead.leadNumber} converted to a customer record.`,
      });

      await createActivityLog(tx, {
        type: ActivityType.CUSTOMER_CREATED,
        entityType: ActivityEntityType.CUSTOMER,
        entityId: customerId,
        leadId: lead.id,
        customerId,
        userId: actorId,
        description: `Customer created from lead ${lead.leadNumber}.`,
      });

      return {
        customerId,
        leadId: lead.id,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/leads",
      `/dashboard/leads/${result.leadId}`,
      "/dashboard/customers",
      `/dashboard/customers/${result.customerId}`,
    ]);

    return actionSuccess("Lead converted to customer.", result);
  } catch (error) {
    console.error("Lead conversion failed", error);
    return actionFailure("We could not convert this lead to a customer.");
  }
}

export async function addLeadNote(
  input: unknown,
): Promise<CrmActionResponse<{ leadId: string }>> {
  const validated = addLeadNoteSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid note.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: validated.data.leadId },
        select: {
          id: true,
          customer: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!lead) {
        throw new Error("Lead not found.");
      }

      await createActivityLog(tx, {
        type: ActivityType.NOTE_ADDED,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        customerId: lead.customer?.id ?? null,
        userId: actorId,
        description: validated.data.note,
      });
    });

    revalidateCrmPaths([
      "/dashboard/leads",
      `/dashboard/leads/${validated.data.leadId}`,
    ]);

    return actionSuccess("Lead note added.", { leadId: validated.data.leadId });
  } catch (error) {
    console.error("Lead note failed", error);
    return actionFailure("We could not save this note.");
  }
}

export async function createSiteVisit(
  input: unknown,
): Promise<CrmActionResponse<{ siteVisitId: string; leadId: string }>> {
  const validated = createSiteVisitSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the site visit details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: validated.data.leadId },
        include: {
          customer: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!lead) {
        throw new Error("Lead not found.");
      }

      const visitNumber = await createSiteVisitNumber();
      const nextStatus = validated.data.assignedEngineerId
        ? SiteVisitStatus.ASSIGNED
        : SiteVisitStatus.SCHEDULED;

      const siteVisit = await tx.siteVisit.create({
        data: {
          visitNumber,
          leadId: lead.id,
          customerId: lead.customer?.id ?? null,
          serviceInterest: validated.data.serviceInterest,
          scheduledAt: validated.data.scheduledAt,
          address: validated.data.address,
          notes: validated.data.notes,
          status: nextStatus,
          assignedEngineerId: validated.data.assignedEngineerId,
        },
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: "SITE_VISIT_SCHEDULED",
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.SITE_VISIT_SCHEDULED,
        entityType: ActivityEntityType.SITE_VISIT,
        entityId: siteVisit.id,
        leadId: lead.id,
        customerId: lead.customer?.id ?? null,
        siteVisitId: siteVisit.id,
        userId: actorId,
        description: `Site visit ${siteVisit.visitNumber} scheduled for ${siteVisit.address}.`,
        metadata: {
          scheduledAt: siteVisit.scheduledAt.toISOString(),
          status: siteVisit.status,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.SITE_VISIT_SCHEDULED,
        entityType: ActivityEntityType.LEAD,
        entityId: lead.id,
        leadId: lead.id,
        customerId: lead.customer?.id ?? null,
        siteVisitId: siteVisit.id,
        userId: actorId,
        description: `Site visit ${siteVisit.visitNumber} scheduled.`,
      });

      if (validated.data.notes) {
        await createActivityLog(tx, {
          type: ActivityType.NOTE_ADDED,
          entityType: ActivityEntityType.SITE_VISIT,
          entityId: siteVisit.id,
          leadId: lead.id,
          customerId: lead.customer?.id ?? null,
          siteVisitId: siteVisit.id,
          userId: actorId,
          description: validated.data.notes,
        });
      }

      return {
        siteVisitId: siteVisit.id,
        leadId: lead.id,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/leads",
      `/dashboard/leads/${result.leadId}`,
      "/dashboard/site-visits",
      `/dashboard/site-visits/${result.siteVisitId}`,
    ]);

    return actionSuccess("Site visit scheduled.", result);
  } catch (error) {
    console.error("Create site visit failed", error);
    return actionFailure("We could not schedule the site visit.");
  }
}

export async function updateSiteVisitStatus(
  input: unknown,
): Promise<CrmActionResponse<{ siteVisitId: string; status: string }>> {
  const validated = updateSiteVisitStatusSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please choose a valid site visit status.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const siteVisit = await tx.siteVisit.findUnique({
        where: { id: validated.data.siteVisitId },
        select: {
          id: true,
          visitNumber: true,
          status: true,
          leadId: true,
          customerId: true,
        },
      });

      if (!siteVisit) {
        throw new Error("Site visit not found.");
      }

      if (siteVisit.status === validated.data.status) {
        return {
          siteVisitId: siteVisit.id,
          status: siteVisit.status,
          leadId: siteVisit.leadId,
          customerId: siteVisit.customerId,
        };
      }

      const updatedSiteVisit = await tx.siteVisit.update({
        where: { id: siteVisit.id },
        data: {
          status: validated.data.status,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.SITE_VISIT_UPDATED,
        entityType: ActivityEntityType.SITE_VISIT,
        entityId: siteVisit.id,
        leadId: siteVisit.leadId,
        customerId: siteVisit.customerId,
        siteVisitId: siteVisit.id,
        userId: actorId,
        description: `Site visit ${siteVisit.visitNumber} status changed from ${siteVisit.status} to ${updatedSiteVisit.status}.`,
      });

      return {
        siteVisitId: updatedSiteVisit.id,
        status: updatedSiteVisit.status,
        leadId: siteVisit.leadId,
        customerId: siteVisit.customerId,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/site-visits",
      `/dashboard/site-visits/${result.siteVisitId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Site visit status updated.", {
      siteVisitId: result.siteVisitId,
      status: result.status,
    });
  } catch (error) {
    console.error("Site visit status failed", error);
    return actionFailure("We could not update the site visit status.");
  }
}

export async function assignSiteVisitEngineer(
  input: unknown,
): Promise<CrmActionResponse<{ siteVisitId: string; assignedUserId: string }>> {
  const validated = assignSiteVisitEngineerSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please choose a valid engineer.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [siteVisit, user] = await Promise.all([
        tx.siteVisit.findUnique({
          where: { id: validated.data.siteVisitId },
          select: {
            id: true,
            visitNumber: true,
            leadId: true,
            customerId: true,
          },
        }),
        tx.user.findUnique({
          where: { id: validated.data.userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        }),
      ]);

      if (!siteVisit || !user) {
        throw new Error("Site visit or engineer not found.");
      }

      await tx.siteVisit.update({
        where: { id: siteVisit.id },
        data: {
          assignedEngineerId: user.id,
          status: SiteVisitStatus.ASSIGNED,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.SITE_VISIT_UPDATED,
        entityType: ActivityEntityType.SITE_VISIT,
        entityId: siteVisit.id,
        leadId: siteVisit.leadId,
        customerId: siteVisit.customerId,
        siteVisitId: siteVisit.id,
        userId: actorId,
        description: `Site visit ${siteVisit.visitNumber} assigned to ${formatPersonName(user)}.`,
      });

      return {
        siteVisitId: siteVisit.id,
        assignedUserId: user.id,
        leadId: siteVisit.leadId,
        customerId: siteVisit.customerId,
      };
    });

    revalidateCrmPaths([
      "/dashboard",
      "/dashboard/site-visits",
      `/dashboard/site-visits/${result.siteVisitId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Site visit engineer assigned.", {
      siteVisitId: result.siteVisitId,
      assignedUserId: result.assignedUserId,
    });
  } catch (error) {
    console.error("Site visit engineer assignment failed", error);
    return actionFailure("We could not assign this site visit.");
  }
}

export async function addCustomerNote(
  input: unknown,
): Promise<CrmActionResponse<{ customerId: string }>> {
  const validated = addCustomerNoteSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid note.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: validated.data.customerId },
        select: { id: true },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }

      await createActivityLog(tx, {
        type: ActivityType.NOTE_ADDED,
        entityType: ActivityEntityType.CUSTOMER,
        entityId: customer.id,
        customerId: customer.id,
        userId: actorId,
        description: validated.data.note,
      });
    });

    revalidateCrmPaths([
      "/dashboard/customers",
      `/dashboard/customers/${validated.data.customerId}`,
    ]);

    return actionSuccess("Customer note added.", {
      customerId: validated.data.customerId,
    });
  } catch (error) {
    console.error("Customer note failed", error);
    return actionFailure("We could not save this note.");
  }
}

export async function addSiteVisitNote(
  input: unknown,
): Promise<CrmActionResponse<{ siteVisitId: string }>> {
  const validated = addSiteVisitNoteSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure("Please enter a valid note.", validated.error.flatten().fieldErrors);
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const siteVisit = await tx.siteVisit.findUnique({
        where: { id: validated.data.siteVisitId },
        select: {
          id: true,
          leadId: true,
          customerId: true,
        },
      });

      if (!siteVisit) {
        throw new Error("Site visit not found.");
      }

      await createActivityLog(tx, {
        type: ActivityType.NOTE_ADDED,
        entityType: ActivityEntityType.SITE_VISIT,
        entityId: siteVisit.id,
        leadId: siteVisit.leadId,
        customerId: siteVisit.customerId,
        siteVisitId: siteVisit.id,
        userId: actorId,
        description: validated.data.note,
      });

      return siteVisit;
    });

    revalidateCrmPaths([
      "/dashboard/site-visits",
      `/dashboard/site-visits/${validated.data.siteVisitId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Site visit note added.", {
      siteVisitId: validated.data.siteVisitId,
    });
  } catch (error) {
    console.error("Site visit note failed", error);
    return actionFailure("We could not save this note.");
  }
}
