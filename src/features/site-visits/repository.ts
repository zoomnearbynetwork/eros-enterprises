import "server-only";

import { Prisma, SiteVisitStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type SiteVisitFilters = {
  query?: string;
  status?: string;
  service?: string;
};

function buildSiteVisitWhere(filters: SiteVisitFilters): Prisma.SiteVisitWhereInput {
  const where: Prisma.SiteVisitWhereInput = {};

  if (filters.query) {
    where.OR = [
      { visitNumber: { contains: filters.query, mode: "insensitive" } },
      { address: { contains: filters.query, mode: "insensitive" } },
      { serviceInterest: { contains: filters.query, mode: "insensitive" } },
      { lead: { name: { contains: filters.query, mode: "insensitive" } } },
      { customer: { legalName: { contains: filters.query, mode: "insensitive" } } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as SiteVisitStatus;
  }

  if (filters.service) {
    where.serviceInterest = { contains: filters.service, mode: "insensitive" };
  }

  return where;
}

export async function getSiteVisits(filters: SiteVisitFilters = {}) {
  return prisma.siteVisit.findMany({
    where: buildSiteVisitWhere(filters),
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      visitNumber: true,
      serviceInterest: true,
      scheduledAt: true,
      address: true,
      status: true,
      createdAt: true,
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
        },
      },
      assignedEngineer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getSiteVisitDetail(siteVisitId: string) {
  return prisma.siteVisit.findUnique({
    where: { id: siteVisitId },
    include: {
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
          phone: true,
          status: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          phone: true,
          email: true,
        },
      },
      assignedEngineer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
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

export async function getUpcomingSiteVisits(limit = 5) {
  return prisma.siteVisit.findMany({
    where: {
      status: {
        in: [SiteVisitStatus.SCHEDULED, SiteVisitStatus.ASSIGNED, SiteVisitStatus.RESCHEDULED],
      },
      scheduledAt: {
        gte: new Date(),
      },
    },
    orderBy: [{ scheduledAt: "asc" }],
    take: limit,
    select: {
      id: true,
      visitNumber: true,
      scheduledAt: true,
      address: true,
      status: true,
      serviceInterest: true,
      lead: {
        select: {
          name: true,
        },
      },
      customer: {
        select: {
          legalName: true,
        },
      },
      assignedEngineer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
