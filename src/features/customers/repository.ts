import "server-only";

import {
  CustomerStatus,
  CustomerType,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CustomerFilters = {
  query?: string;
  status?: string;
  type?: string;
};

function buildCustomerWhere(filters: CustomerFilters): Prisma.CustomerWhereInput {
  const where: Prisma.CustomerWhereInput = {};

  if (filters.query) {
    where.OR = [
      { customerNumber: { contains: filters.query, mode: "insensitive" } },
      { legalName: { contains: filters.query, mode: "insensitive" } },
      { email: { contains: filters.query, mode: "insensitive" } },
      { phone: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as CustomerStatus;
  }

  if (filters.type) {
    where.type = filters.type as CustomerType;
  }

  return where;
}

export async function getCustomers(filters: CustomerFilters = {}) {
  return prisma.customer.findMany({
    where: buildCustomerWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      customerNumber: true,
      legalName: true,
      primaryContactName: true,
      phone: true,
      email: true,
      type: true,
      status: true,
      createdAt: true,
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
        },
      },
    },
  });
}

export async function getCustomerDetail(customerId: string) {
  return prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
          serviceInterest: true,
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
          serviceInterest: true,
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
      payments: {
        orderBy: [{ paidAt: "desc" }],
        select: {
          id: true,
          paymentNumber: true,
          amount: true,
          paidAt: true,
          method: true,
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

export async function findExistingCustomerByContact(input: {
  phone?: string | null;
  email?: string | null;
}) {
  const orConditions: Prisma.CustomerWhereInput[] = [];

  if (input.phone) {
    orConditions.push({ phone: input.phone });
  }

  if (input.email) {
    orConditions.push({ email: input.email });
  }

  if (orConditions.length === 0) {
    return null;
  }

  return prisma.customer.findFirst({
    where: {
      OR: orConditions,
    },
    select: {
      id: true,
      customerNumber: true,
      legalName: true,
    },
  });
}

export async function getCustomerMetrics() {
  const [totalCustomers, activeCustomers, onboardingCustomers] = await prisma.$transaction([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: CustomerStatus.ACTIVE } }),
    prisma.customer.count({ where: { status: CustomerStatus.ONBOARDING } }),
  ]);

  return { totalCustomers, activeCustomers, onboardingCustomers };
}
