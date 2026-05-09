import "server-only";

import {
  AmcStatus,
  Prisma,
  ProjectStage,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/features/billing/utils";
import {
  getAmcReminderSchedule,
  getDaysUntil,
  getDerivedAmcStatus,
  isProjectCompletedStage,
} from "@/features/projects/utils";

export type ProjectFilters = {
  query?: string;
  stage?: string;
};

export type AmcFilters = {
  query?: string;
  status?: string;
};

function buildProjectWhere(filters: ProjectFilters): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {};

  if (filters.query) {
    where.OR = [
      { projectNumber: { contains: filters.query, mode: "insensitive" } },
      { title: { contains: filters.query, mode: "insensitive" } },
      { customer: { legalName: { contains: filters.query, mode: "insensitive" } } },
      { quotation: { quotationNumber: { contains: filters.query, mode: "insensitive" } } },
    ];
  }

  if (filters.stage) {
    where.stage = filters.stage as ProjectStage;
  }

  return where;
}

function buildAmcWhere(filters: AmcFilters): Prisma.AmcPlanWhereInput {
  const where: Prisma.AmcPlanWhereInput = {};

  if (filters.query) {
    where.OR = [
      { amcNumber: { contains: filters.query, mode: "insensitive" } },
      { title: { contains: filters.query, mode: "insensitive" } },
      { customer: { legalName: { contains: filters.query, mode: "insensitive" } } },
      { project: { title: { contains: filters.query, mode: "insensitive" } } },
      { service: { name: { contains: filters.query, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getProjectManagementOptions() {
  const [acceptedQuotations, customers, managers, engineers] = await Promise.all([
    prisma.quotation.findMany({
      where: {
        status: "ACCEPTED",
        project: null,
      },
      orderBy: [{ acceptedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        quotationNumber: true,
        title: true,
        customerId: true,
        totalAmount: true,
        customer: {
          select: {
            legalName: true,
          },
        },
        lead: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.customer.findMany({
      orderBy: [{ legalName: "asc" }],
      select: {
        id: true,
        customerNumber: true,
        legalName: true,
        primaryContactName: true,
      },
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
    acceptedQuotations: acceptedQuotations.map((quotation) => ({
      ...quotation,
      totalAmount: decimalToNumber(quotation.totalAmount),
    })),
    customers,
    managers,
    engineers,
  };
}

export async function getAmcManagementOptions() {
  const [customers, projects, services] = await Promise.all([
    prisma.customer.findMany({
      orderBy: [{ legalName: "asc" }],
      select: {
        id: true,
        customerNumber: true,
        legalName: true,
        primaryContactName: true,
      },
    }),
    prisma.project.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        projectNumber: true,
        title: true,
        customerId: true,
        customer: {
          select: {
            legalName: true,
          },
        },
      },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
      },
    }),
  ]);

  return {
    customers,
    projects,
    services,
  };
}

export async function getProjects(filters: ProjectFilters = {}) {
  const projects = await prisma.project.findMany({
    where: buildProjectWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      projectNumber: true,
      title: true,
      stage: true,
      progressPercent: true,
      startDate: true,
      targetCompletionDate: true,
      customer: {
        select: {
          id: true,
          legalName: true,
        },
      },
      quotation: {
        select: {
          id: true,
          quotationNumber: true,
          totalAmount: true,
        },
      },
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
      _count: {
        select: {
          amcPlans: true,
        },
      },
    },
  });

  return projects.map((project) => ({
    ...project,
    quotation: project.quotation
      ? {
          ...project.quotation,
          totalAmount: decimalToNumber(project.quotation.totalAmount),
        }
      : null,
  }));
}

export async function getProjectDetail(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          primaryContactName: true,
          phone: true,
          email: true,
          billingAddress: true,
        },
      },
      quotation: {
        select: {
          id: true,
          quotationNumber: true,
          title: true,
          status: true,
          totalAmount: true,
          acceptedAt: true,
          issueDate: true,
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              status: true,
              totalAmount: true,
              paidAmount: true,
              balanceAmount: true,
              dueDate: true,
              payments: {
                orderBy: [{ paidAt: "desc" }],
                select: {
                  id: true,
                  paymentNumber: true,
                  amount: true,
                  method: true,
                  paidAt: true,
                },
              },
            },
          },
        },
      },
      projectManager: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      siteEngineer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      amcPlans: {
        orderBy: [{ renewalDate: "asc" }],
        select: {
          id: true,
          amcNumber: true,
          title: true,
          status: true,
          renewalDate: true,
          endDate: true,
        },
      },
      activities: {
        orderBy: [{ occurredAt: "desc" }],
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

  if (!project) {
    return null;
  }

  const paymentTotal = project.quotation?.invoice?.payments.reduce(
    (sum, payment) => sum + decimalToNumber(payment.amount),
    0,
  ) ?? 0;

  return {
    ...project,
    quotation: project.quotation
      ? {
          ...project.quotation,
          totalAmount: decimalToNumber(project.quotation.totalAmount),
          invoice: project.quotation.invoice
            ? {
                ...project.quotation.invoice,
                totalAmount: decimalToNumber(project.quotation.invoice.totalAmount),
                paidAmount: decimalToNumber(project.quotation.invoice.paidAmount),
                balanceAmount: decimalToNumber(project.quotation.invoice.balanceAmount),
                payments: project.quotation.invoice.payments.map((payment) => ({
                  ...payment,
                  amount: decimalToNumber(payment.amount),
                })),
              }
            : null,
        }
      : null,
    financialSummary: {
      quotationTotalAmount: decimalToNumber(project.quotation?.totalAmount),
      invoiceTotalAmount: decimalToNumber(project.quotation?.invoice?.totalAmount),
      invoicePaidAmount: decimalToNumber(project.quotation?.invoice?.paidAmount),
      invoiceBalanceAmount: decimalToNumber(project.quotation?.invoice?.balanceAmount),
      paymentAmount: paymentTotal,
    },
  };
}

export async function getAmcPlans(filters: AmcFilters = {}) {
  const plans = await prisma.amcPlan.findMany({
    where: buildAmcWhere(filters),
    orderBy: [{ renewalDate: "asc" }],
    select: {
      id: true,
      amcNumber: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      renewalDate: true,
      renewalReminderDays: true,
      customer: {
        select: {
          id: true,
          legalName: true,
        },
      },
      project: {
        select: {
          id: true,
          projectNumber: true,
          title: true,
        },
      },
      service: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  });

  return plans
    .map((plan) => ({
      ...plan,
      effectiveStatus: getDerivedAmcStatus(plan.status, plan.renewalDate, plan.endDate),
      daysUntilRenewal: getDaysUntil(plan.renewalDate),
    }))
    .filter((plan) => !filters.status || plan.effectiveStatus === (filters.status as AmcStatus));
}

export async function getAmcDetail(amcPlanId: string) {
  const plan = await prisma.amcPlan.findUnique({
    where: { id: amcPlanId },
    include: {
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          primaryContactName: true,
          phone: true,
          email: true,
          billingAddress: true,
        },
      },
      project: {
        select: {
          id: true,
          projectNumber: true,
          title: true,
          stage: true,
          progressPercent: true,
        },
      },
      service: {
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
        },
      },
      activities: {
        orderBy: [{ occurredAt: "desc" }],
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

  if (!plan) {
    return null;
  }

  const effectiveStatus = getDerivedAmcStatus(plan.status, plan.renewalDate, plan.endDate);

  return {
    ...plan,
    effectiveStatus,
    daysUntilRenewal: getDaysUntil(plan.renewalDate),
    reminderSchedule: getAmcReminderSchedule(plan.renewalDate, plan.renewalReminderDays),
  };
}

export async function getProjectDashboardMetrics() {
  const projects = await prisma.project.findMany({
    select: {
      stage: true,
      targetCompletionDate: true,
    },
  });

  const now = new Date();
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

  return {
    totalProjects: projects.length,
    activeProjects,
    completedProjects,
    delayedOrOnHoldProjects,
  };
}

export async function getAmcDashboardMetrics() {
  const plans = await prisma.amcPlan.findMany({
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
  });

  const enriched = plans.map((plan) => ({
    ...plan,
    effectiveStatus: getDerivedAmcStatus(plan.status, plan.renewalDate, plan.endDate),
    daysUntilRenewal: getDaysUntil(plan.renewalDate),
  }));

  return {
    totalAmcPlans: enriched.length,
    dueSoonCount: enriched.filter((plan) => plan.effectiveStatus === "DUE_SOON").length,
    expiredCount: enriched.filter((plan) => plan.effectiveStatus === "EXPIRED").length,
    upcomingRenewals: enriched
      .filter((plan) => plan.effectiveStatus !== "CANCELLED" && plan.effectiveStatus !== "EXPIRED")
      .slice(0, 5),
  };
}
