import "server-only";

import {
  InvoiceStatus,
  Prisma,
  QuotationStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  decimalToNumber,
  getDerivedInvoiceStatus,
  getDerivedQuotationStatus,
} from "@/features/billing/utils";

type BillingFilters = {
  query?: string;
  status?: string;
};

function buildQuotationWhere(filters: BillingFilters): Prisma.QuotationWhereInput {
  const where: Prisma.QuotationWhereInput = {};

  if (filters.query) {
    where.OR = [
      { quotationNumber: { contains: filters.query, mode: "insensitive" } },
      { title: { contains: filters.query, mode: "insensitive" } },
      { lead: { name: { contains: filters.query, mode: "insensitive" } } },
      { customer: { legalName: { contains: filters.query, mode: "insensitive" } } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as QuotationStatus;
  }

  return where;
}

function buildInvoiceWhere(filters: BillingFilters): Prisma.InvoiceWhereInput {
  const where: Prisma.InvoiceWhereInput = {};

  if (filters.query) {
    where.OR = [
      { invoiceNumber: { contains: filters.query, mode: "insensitive" } },
      { title: { contains: filters.query, mode: "insensitive" } },
      { quotation: { quotationNumber: { contains: filters.query, mode: "insensitive" } } },
      { customer: { legalName: { contains: filters.query, mode: "insensitive" } } },
      { lead: { name: { contains: filters.query, mode: "insensitive" } } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as InvoiceStatus;
  }

  return where;
}

function buildPaymentWhere(query?: string): Prisma.PaymentWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { paymentNumber: { contains: query, mode: "insensitive" } },
      { reference: { contains: query, mode: "insensitive" } },
      { invoice: { invoiceNumber: { contains: query, mode: "insensitive" } } },
      { customer: { legalName: { contains: query, mode: "insensitive" } } },
    ],
  };
}

function mapQuotationSummary<
  T extends {
    subtotalAmount: Prisma.Decimal | number;
    taxAmount: Prisma.Decimal | number;
    discountAmount: Prisma.Decimal | number;
    totalAmount: Prisma.Decimal | number;
    status: QuotationStatus;
    validUntil: Date | null;
  },
>(quotation: T) {
  const totalAmount = decimalToNumber(quotation.totalAmount);
  const subtotalAmount = decimalToNumber(quotation.subtotalAmount);
  const taxAmount = decimalToNumber(quotation.taxAmount);
  const discountAmount = decimalToNumber(quotation.discountAmount);

  return {
    ...quotation,
    subtotalAmount,
    taxAmount,
    discountAmount,
    totalAmount,
    effectiveStatus: getDerivedQuotationStatus(quotation.status, quotation.validUntil),
  };
}

function mapInvoiceSummary<
  T extends {
    subtotalAmount: Prisma.Decimal | number;
    taxAmount: Prisma.Decimal | number;
    discountAmount: Prisma.Decimal | number;
    totalAmount: Prisma.Decimal | number;
    paidAmount: Prisma.Decimal | number;
    balanceAmount: Prisma.Decimal | number;
    status: InvoiceStatus;
    dueDate: Date | null;
  },
>(invoice: T) {
  const subtotalAmount = decimalToNumber(invoice.subtotalAmount);
  const taxAmount = decimalToNumber(invoice.taxAmount);
  const discountAmount = decimalToNumber(invoice.discountAmount);
  const totalAmount = decimalToNumber(invoice.totalAmount);
  const paidAmount = decimalToNumber(invoice.paidAmount);
  const balanceAmount = decimalToNumber(invoice.balanceAmount);

  return {
    ...invoice,
    subtotalAmount,
    taxAmount,
    discountAmount,
    totalAmount,
    paidAmount,
    balanceAmount,
    effectiveStatus: getDerivedInvoiceStatus(invoice.status, invoice.dueDate, balanceAmount),
  };
}

function mapPaymentSummary<
  T extends {
    amount: Prisma.Decimal | number;
  },
>(payment: T) {
  return {
    ...payment,
    amount: decimalToNumber(payment.amount),
  };
}

function mapQuotationLink<
  T extends {
    id: string;
    quotationNumber: string;
    status: QuotationStatus;
    validUntil: Date | null;
    totalAmount: Prisma.Decimal | number;
  },
>(quotation: T) {
  return {
    ...quotation,
    totalAmount: decimalToNumber(quotation.totalAmount),
    effectiveStatus: getDerivedQuotationStatus(quotation.status, quotation.validUntil),
  };
}

function mapInvoiceLink<
  T extends {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    dueDate: Date | null;
    totalAmount?: Prisma.Decimal | number;
    paidAmount?: Prisma.Decimal | number;
    balanceAmount: Prisma.Decimal | number;
  },
>(invoice: T) {
  const balanceAmount = decimalToNumber(invoice.balanceAmount);

  return {
    ...invoice,
    totalAmount: invoice.totalAmount == null ? undefined : decimalToNumber(invoice.totalAmount),
    paidAmount: invoice.paidAmount == null ? undefined : decimalToNumber(invoice.paidAmount),
    balanceAmount,
    effectiveStatus: getDerivedInvoiceStatus(invoice.status, invoice.dueDate, balanceAmount),
  };
}

export async function getBillingDashboardMetrics() {
  const [quotations, invoices, payments] = await prisma.$transaction([
    prisma.quotation.findMany({
      select: {
        totalAmount: true,
        status: true,
        validUntil: true,
      },
    }),
    prisma.invoice.findMany({
      select: {
        totalAmount: true,
        balanceAmount: true,
        status: true,
        dueDate: true,
      },
    }),
    prisma.payment.findMany({
      select: {
        amount: true,
      },
    }),
  ]);

  const quotedValue = quotations.reduce((sum, quotation) => {
    const status = getDerivedQuotationStatus(quotation.status, quotation.validUntil);

    if (status === "REJECTED") {
      return sum;
    }

    return sum + decimalToNumber(quotation.totalAmount);
  }, 0);

  const invoicedValue = invoices.reduce((sum, invoice) => {
    if (invoice.status === "CANCELLED") {
      return sum;
    }

    return sum + decimalToNumber(invoice.totalAmount);
  }, 0);

  const collectedAmount = payments.reduce(
    (sum, payment) => sum + decimalToNumber(payment.amount),
    0,
  );

  const pendingAmount = invoices.reduce((sum, invoice) => {
    const effectiveStatus = getDerivedInvoiceStatus(
      invoice.status,
      invoice.dueDate,
      decimalToNumber(invoice.balanceAmount),
    );

    if (effectiveStatus === "CANCELLED" || effectiveStatus === "PAID") {
      return sum;
    }

    return sum + decimalToNumber(invoice.balanceAmount);
  }, 0);

  return {
    quotedValue,
    invoicedValue,
    collectedAmount,
    pendingAmount,
  };
}

export async function getBillingOptions() {
  const leads = await prisma.lead.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      leadNumber: true,
      name: true,
      serviceInterest: true,
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
        },
      },
    },
  });
  const customers = await prisma.customer.findMany({
    orderBy: [{ legalName: "asc" }],
    select: {
      id: true,
      customerNumber: true,
      legalName: true,
      primaryContactName: true,
    },
  });
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
    },
  });
  const openInvoices = await prisma.invoice.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      invoiceNumber: true,
      totalAmount: true,
      paidAmount: true,
      balanceAmount: true,
      dueDate: true,
      status: true,
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
  });

  return {
    leads,
    customers,
    services,
    openInvoices: openInvoices
      .map((invoice) => ({
        ...invoice,
        totalAmount: decimalToNumber(invoice.totalAmount),
        paidAmount: decimalToNumber(invoice.paidAmount),
        balanceAmount: decimalToNumber(invoice.balanceAmount),
        effectiveStatus: getDerivedInvoiceStatus(
          invoice.status,
          invoice.dueDate,
          decimalToNumber(invoice.balanceAmount),
        ),
      }))
      .filter((invoice) => invoice.balanceAmount > 0),
  };
}

export async function getQuotations(filters: BillingFilters = {}) {
  const quotations = await prisma.quotation.findMany({
    where: buildQuotationWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    include: {
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
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          balanceAmount: true,
          dueDate: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return quotations.map((quotation) => {
    const mapped = mapQuotationSummary(quotation);

    return {
      ...mapped,
      invoice: quotation.invoice ? mapInvoiceLink(quotation.invoice) : null,
    };
  });
}

export async function getQuotationDetail(quotationId: string) {
  const quotation = await prisma.quotation.findUnique({
    where: { id: quotationId },
    include: {
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
          phone: true,
          email: true,
          serviceInterest: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          primaryContactName: true,
          phone: true,
          email: true,
          billingAddress: true,
          shippingAddress: true,
          gstin: true,
        },
      },
      items: {
        orderBy: [{ sortOrder: "asc" }],
        select: {
          id: true,
          serviceId: true,
          name: true,
          description: true,
          quantity: true,
          unitPrice: true,
          taxRate: true,
          lineSubtotal: true,
          lineTaxAmount: true,
          lineTotal: true,
          sortOrder: true,
          service: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          totalAmount: true,
          paidAmount: true,
          balanceAmount: true,
          dueDate: true,
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

  if (!quotation) {
    return null;
  }

  return {
    ...mapQuotationSummary(quotation),
    items: quotation.items.map((item) => ({
      ...item,
      quantity: decimalToNumber(item.quantity),
      unitPrice: decimalToNumber(item.unitPrice),
      taxRate: decimalToNumber(item.taxRate),
      lineSubtotal: decimalToNumber(item.lineSubtotal),
      lineTaxAmount: decimalToNumber(item.lineTaxAmount),
      lineTotal: decimalToNumber(item.lineTotal),
    })),
    invoice: quotation.invoice ? mapInvoiceLink(quotation.invoice) : null,
  };
}

export async function getConvertibleQuotations() {
  const quotations = await prisma.quotation.findMany({
    where: {
      status: "ACCEPTED",
      invoice: null,
    },
    orderBy: [{ acceptedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      quotationNumber: true,
      title: true,
      totalAmount: true,
      acceptedAt: true,
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
  });

  return quotations.map((quotation) => ({
    ...quotation,
    totalAmount: decimalToNumber(quotation.totalAmount),
  }));
}

export async function getInvoices(filters: BillingFilters = {}) {
  const invoices = await prisma.invoice.findMany({
    where: buildInvoiceWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    include: {
      quotation: {
        select: {
          id: true,
          quotationNumber: true,
          status: true,
          totalAmount: true,
          validUntil: true,
        },
      },
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
      _count: {
        select: {
          payments: true,
        },
      },
    },
  });

  return invoices.map((invoice) => {
    const mapped = mapInvoiceSummary(invoice);

    return {
      ...mapped,
      quotation: invoice.quotation ? mapQuotationLink(invoice.quotation) : null,
    };
  });
}

export async function getInvoiceDetail(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      quotation: {
        select: {
          id: true,
          quotationNumber: true,
          status: true,
          title: true,
          issueDate: true,
          validUntil: true,
          totalAmount: true,
        },
      },
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
          phone: true,
          email: true,
          serviceInterest: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
          primaryContactName: true,
          phone: true,
          email: true,
          billingAddress: true,
          shippingAddress: true,
          gstin: true,
        },
      },
      items: {
        orderBy: [{ sortOrder: "asc" }],
        select: {
          id: true,
          serviceId: true,
          name: true,
          description: true,
          quantity: true,
          unitPrice: true,
          taxRate: true,
          lineSubtotal: true,
          lineTaxAmount: true,
          lineTotal: true,
          sortOrder: true,
          service: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      payments: {
        orderBy: [{ paidAt: "desc" }],
        select: {
          id: true,
          paymentNumber: true,
          amount: true,
          method: true,
          paidAt: true,
          reference: true,
          notes: true,
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

  if (!invoice) {
    return null;
  }

  return {
    ...mapInvoiceSummary(invoice),
    quotation: invoice.quotation ? mapQuotationLink(invoice.quotation) : null,
    items: invoice.items.map((item) => ({
      ...item,
      quantity: decimalToNumber(item.quantity),
      unitPrice: decimalToNumber(item.unitPrice),
      taxRate: decimalToNumber(item.taxRate),
      lineSubtotal: decimalToNumber(item.lineSubtotal),
      lineTaxAmount: decimalToNumber(item.lineTaxAmount),
      lineTotal: decimalToNumber(item.lineTotal),
    })),
    payments: invoice.payments.map((payment) => mapPaymentSummary(payment)),
  };
}

export async function getPayments(query?: string) {
  const payments = await prisma.payment.findMany({
    where: buildPaymentWhere(query),
    orderBy: [{ paidAt: "desc" }],
    include: {
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          dueDate: true,
          balanceAmount: true,
        },
      },
      customer: {
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
        },
      },
      lead: {
        select: {
          id: true,
          leadNumber: true,
          name: true,
        },
      },
    },
  });

  return payments.map((payment) => ({
    ...mapPaymentSummary(payment),
    invoice: payment.invoice ? mapInvoiceLink(payment.invoice) : null,
  }));
}
