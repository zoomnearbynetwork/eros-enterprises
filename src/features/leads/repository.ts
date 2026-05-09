import "server-only";

import {
  ActivityEntityType,
  ActivityType,
  LeadPriority,
  LeadSource,
  LeadStatus,
  Prisma,
} from "@prisma/client";

import { createActivityLog } from "@/features/crm/activity";
import { createLeadNumber } from "@/features/crm/numbering";
import { prisma } from "@/lib/prisma";
import type { LeadCreateInput } from "@/features/leads/schemas";
import type {
  LeadDetailRecord,
  LeadFilters,
  LeadListItem,
} from "@/features/leads/types";
import { isUniqueConstraintError } from "@/features/leads/utils";

function buildLeadWhere(filters: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  if (filters.query) {
    where.OR = [
      { leadNumber: { contains: filters.query, mode: "insensitive" } },
      { name: { contains: filters.query, mode: "insensitive" } },
      { phone: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as LeadStatus;
  }

  if (filters.service) {
    where.serviceInterest = { contains: filters.service, mode: "insensitive" };
  }

  if (filters.source) {
    where.source = filters.source as LeadSource;
  }

  if (filters.priority) {
    where.priority = filters.priority as LeadPriority;
  }

  if (filters.assignee) {
    where.assignedToId = filters.assignee;
  }

  return where;
}

export async function createLead(input: LeadCreateInput) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const leadNumber = await createLeadNumber();

    try {
      return await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.create({
          data: {
            leadNumber,
            name: input.name,
            phone: input.phone,
            email: input.email,
            serviceInterest: input.serviceInterest,
            source: input.source as LeadSource,
            sourcePage: input.sourcePage,
            ctaLocation: input.ctaLocation,
            utmSource: input.utmSource,
            utmMedium: input.utmMedium,
            utmCampaign: input.utmCampaign,
            message: input.message,
            location: input.location,
            budgetRange: input.budgetRange,
            status: input.status as LeadStatus,
            priority: input.priority as LeadPriority,
            assignedToId: input.assignedToId,
          },
        });

        await createActivityLog(tx, {
          type: ActivityType.LEAD_CREATED,
          entityType: ActivityEntityType.LEAD,
          entityId: lead.id,
          leadId: lead.id,
          description: `Lead ${lead.leadNumber} created from ${lead.sourcePage}.`,
          metadata: {
            serviceInterest: lead.serviceInterest,
            source: lead.source,
            sourcePage: lead.sourcePage,
            ctaLocation: lead.ctaLocation,
            budgetRange: lead.budgetRange,
          },
        });

        return lead;
      });
    } catch (error) {
      if (isUniqueConstraintError(error, "leadNumber")) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not create lead after multiple attempts.");
}

export async function getLeadsForDashboard(
  filters: LeadFilters = {},
): Promise<LeadListItem[]> {
  return prisma.lead.findMany({
    where: buildLeadWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      leadNumber: true,
      name: true,
      phone: true,
      email: true,
      serviceInterest: true,
      source: true,
      sourcePage: true,
      ctaLocation: true,
      location: true,
      budgetRange: true,
      status: true,
      priority: true,
      createdAt: true,
      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getLeadFilterOptions() {
  const [services, users] = await Promise.all([
    prisma.lead.findMany({
      distinct: ["serviceInterest"],
      orderBy: { serviceInterest: "asc" },
      select: { serviceInterest: true },
    }),
    prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: {
          name: {
            in: ["SUPER_ADMIN", "SALES_MANAGER", "OPERATIONS_MANAGER"],
          },
        },
      },
      orderBy: [{ firstName: "asc" }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    }),
  ]);

  return {
    services: services
      .map((item) => item.serviceInterest)
      .filter((service, index, allServices) => allServices.indexOf(service) === index),
    users,
  };
}

export async function getLeadDetail(leadId: string): Promise<LeadDetailRecord | null> {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          status: true,
        },
      },
      siteVisits: {
        orderBy: [{ scheduledAt: "asc" }],
        select: {
          id: true,
          visitNumber: true,
          scheduledAt: true,
          address: true,
          status: true,
          assignedEngineer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      quotations: {
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          quotationNumber: true,
          status: true,
          totalAmount: true,
          issueDate: true,
        },
      },
      invoices: {
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          totalAmount: true,
          balanceAmount: true,
          issueDate: true,
        },
      },
      activities: {
        orderBy: { occurredAt: "desc" },
        select: {
          id: true,
          type: true,
          action: true,
          description: true,
          occurredAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

const leadRepository = {
  createLead,
  getLeadsForDashboard,
  getLeadFilterOptions,
  getLeadDetail,
};

export default leadRepository;
