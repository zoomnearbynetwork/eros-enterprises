import "server-only";

import {
  LeadStatus,
  SiteVisitStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  getDaysUntil,
  getDerivedAmcStatus,
  isProjectCompletedStage,
} from "@/features/projects/utils";

export async function getAssignableUsers() {
  const [salesUsers, engineerUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: {
          name: {
            in: ["SUPER_ADMIN", "SALES_MANAGER"],
          },
        },
      },
      orderBy: [{ firstName: "asc" }],
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
    }),
    prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: {
          name: {
            in: ["SUPER_ADMIN", "OPERATIONS_MANAGER"],
          },
        },
      },
      orderBy: [{ firstName: "asc" }],
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
    }),
  ]);

  return {
    salesUsers,
    engineerUsers,
  };
}

export async function getDashboardOverview() {
  const now = new Date();

  const [
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    lostLeads,
    totalCustomers,
    siteVisitsScheduled,
    recentLeads,
    upcomingSiteVisits,
    leadStatuses,
    projects,
    amcPlans,
  ] = await prisma.$transaction([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: LeadStatus.NEW } }),
    prisma.lead.count({ where: { status: LeadStatus.CONTACTED } }),
    prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
    prisma.lead.count({ where: { status: LeadStatus.WON } }),
    prisma.lead.count({ where: { status: LeadStatus.LOST } }),
    prisma.customer.count(),
    prisma.siteVisit.count({
      where: {
        status: {
          in: [SiteVisitStatus.SCHEDULED, SiteVisitStatus.ASSIGNED, SiteVisitStatus.RESCHEDULED],
        },
      },
    }),
    prisma.lead.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        leadNumber: true,
        name: true,
        phone: true,
        serviceInterest: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    }),
    prisma.siteVisit.findMany({
      where: {
        scheduledAt: { gte: now },
        status: {
          in: [SiteVisitStatus.SCHEDULED, SiteVisitStatus.ASSIGNED, SiteVisitStatus.RESCHEDULED],
        },
      },
      orderBy: [{ scheduledAt: "asc" }],
      take: 5,
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
      },
    }),
    prisma.lead.findMany({
      select: {
        status: true,
      },
    }),
    prisma.project.findMany({
      select: {
        stage: true,
        targetCompletionDate: true,
      },
    }),
    prisma.amcPlan.findMany({
      orderBy: [{ renewalDate: "asc" }],
      select: {
        id: true,
        amcNumber: true,
        title: true,
        status: true,
        renewalDate: true,
        endDate: true,
        customer: {
          select: {
            legalName: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  const statusSummaryMap = new Map<string, number>();

  for (const lead of leadStatuses) {
    statusSummaryMap.set(lead.status, (statusSummaryMap.get(lead.status) ?? 0) + 1);
  }

  const funnel = [
    { label: "New", value: newLeads },
    { label: "Contacted", value: contactedLeads },
    { label: "Qualified", value: qualifiedLeads },
    { label: "Won", value: wonLeads },
  ];

  let activeProjects = 0;
  let completedProjects = 0;
  let delayedOrOnHoldProjects = 0;

  for (const project of projects) {
    if (isProjectCompletedStage(project.stage)) {
      completedProjects += 1;
      continue;
    }

    if (project.stage === "ON_HOLD") {
      delayedOrOnHoldProjects += 1;
      continue;
    }

    activeProjects += 1;

    if (project.targetCompletionDate && project.targetCompletionDate.getTime() < now.getTime()) {
      delayedOrOnHoldProjects += 1;
    }
  }

  const enrichedAmcPlans = amcPlans.map((plan) => ({
    ...plan,
    effectiveStatus: getDerivedAmcStatus(plan.status, plan.renewalDate, plan.endDate),
    daysUntilRenewal: getDaysUntil(plan.renewalDate, now),
  }));

  const dueSoonAmcCount = enrichedAmcPlans.filter((plan) => plan.effectiveStatus === "DUE_SOON").length;
  const expiredAmcCount = enrichedAmcPlans.filter((plan) => plan.effectiveStatus === "EXPIRED").length;

  return {
    metrics: {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      siteVisitsScheduled,
      wonLeads,
      lostLeads,
      totalCustomers,
      activeProjects,
      completedProjects,
      delayedOrOnHoldProjects,
      dueSoonAmcCount,
      expiredAmcCount,
    },
    recentLeads,
    upcomingSiteVisits,
    upcomingRenewals: enrichedAmcPlans
      .filter((plan) => plan.effectiveStatus !== "EXPIRED" && plan.effectiveStatus !== "CANCELLED")
      .slice(0, 5),
    statusSummary: Array.from(statusSummaryMap.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    funnel,
  };
}

export async function getCrmServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  return services;
}
