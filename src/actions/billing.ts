"use server";

import {
  ActivityEntityType,
  ActivityType,
  InvoiceStatus,
  type Prisma,
  type QuotationStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { actionFailure, actionSuccess, type ActionResponse } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/features/crm/activity";
import {
  createInvoiceNumber,
  createPaymentNumber,
  createQuotationNumber,
} from "@/features/crm/numbering";
import {
  convertQuotationToInvoiceSchema,
  createQuotationSchema,
  recordPaymentSchema,
  updateInvoiceStatusSchema,
  updateQuotationSchema,
  updateQuotationStatusSchema,
} from "@/features/billing/schemas";
import {
  calculateBillingTotals,
  getDerivedInvoiceStatus,
  getDerivedQuotationStatus,
  roundCurrency,
} from "@/features/billing/utils";

type BillingActionResponse<TData = undefined> = ActionResponse<TData>;

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

function revalidateBillingPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

async function resolveBillingLinks(
  tx: Prisma.TransactionClient,
  input: { leadId?: string; customerId?: string },
) {
  const lead = input.leadId
    ? await tx.lead.findUnique({
        where: { id: input.leadId },
        select: {
          id: true,
          leadNumber: true,
          name: true,
          customer: {
            select: {
              id: true,
              customerNumber: true,
              legalName: true,
            },
          },
        },
      })
    : null;

  const customer = input.customerId
    ? await tx.customer.findUnique({
        where: { id: input.customerId },
        select: {
          id: true,
          customerNumber: true,
          legalName: true,
        },
      })
    : lead?.customer ?? null;

  if (input.leadId && !lead) {
    throw new Error("Lead not found.");
  }

  if (input.customerId && !customer) {
    throw new Error("Customer not found.");
  }

  return {
    lead,
    customer,
  };
}

function getQuotationStatusTimestamps(status: QuotationStatus) {
  const now = new Date();

  return {
    sentAt: status === "SENT" ? now : undefined,
    viewedAt: status === "VIEWED" ? now : undefined,
    acceptedAt: status === "ACCEPTED" ? now : undefined,
    rejectedAt: status === "REJECTED" ? now : undefined,
    expiredAt: status === "EXPIRED" ? now : undefined,
  };
}

function getInvoiceStatusPayload(status: InvoiceStatus) {
  const now = new Date();

  return {
    status,
    sentAt: status === "SENT" ? now : undefined,
    cancelledAt: status === "CANCELLED" ? now : undefined,
  };
}

export async function createQuotation(
  input: unknown,
): Promise<BillingActionResponse<{ quotationId: string }>> {
  const validated = createQuotationSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the quotation details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const { lead, customer } = await resolveBillingLinks(tx, validated.data);
      const { calculatedItems, totals } = calculateBillingTotals(
        validated.data.items,
        validated.data.discountAmount,
      );
      const quotationNumber = await createQuotationNumber();

      const quotation = await tx.quotation.create({
        data: {
          quotationNumber,
          leadId: lead?.id,
          customerId: customer?.id,
          title: validated.data.title,
          issueDate: validated.data.issueDate,
          validUntil: validated.data.validUntil,
          notes: validated.data.notes,
          subtotalAmount: totals.subtotalAmount,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
          items: {
            create: calculatedItems.map((item, index) => ({
              serviceId: item.serviceId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              lineSubtotal: item.lineSubtotal,
              lineTaxAmount: item.lineTaxAmount,
              lineTotal: item.lineTotal,
              sortOrder: index,
            })),
          },
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.QUOTATION_CREATED,
        entityType: ActivityEntityType.QUOTATION,
        entityId: quotation.id,
        quotationId: quotation.id,
        leadId: lead?.id,
        customerId: customer?.id,
        userId: actorId,
        description: `Quotation ${quotation.quotationNumber} created for ${customer?.legalName ?? lead?.name ?? "a billing contact"}.`,
        metadata: {
          totalAmount: totals.totalAmount,
          itemCount: calculatedItems.length,
        },
      });

      return {
        quotationId: quotation.id,
        leadId: lead?.id ?? null,
        customerId: customer?.id ?? null,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/quotations",
      `/dashboard/quotations/${result.quotationId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Quotation created.", {
      quotationId: result.quotationId,
    });
  } catch (error) {
    console.error("Quotation creation failed", error);
    return actionFailure("We could not create this quotation.");
  }
}

export async function updateQuotation(
  input: unknown,
): Promise<BillingActionResponse<{ quotationId: string }>> {
  const validated = updateQuotationSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the quotation details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.quotation.findUnique({
        where: { id: validated.data.quotationId },
        include: {
          invoice: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!existing) {
        throw new Error("Quotation not found.");
      }

      if (existing.invoice) {
        throw new Error("Quoted items cannot be edited after invoice conversion.");
      }

      const { lead, customer } = await resolveBillingLinks(tx, validated.data);
      const { calculatedItems, totals } = calculateBillingTotals(
        validated.data.items,
        validated.data.discountAmount,
      );

      await tx.quotation.update({
        where: { id: existing.id },
        data: {
          leadId: lead?.id,
          customerId: customer?.id,
          title: validated.data.title,
          issueDate: validated.data.issueDate,
          validUntil: validated.data.validUntil,
          notes: validated.data.notes,
          subtotalAmount: totals.subtotalAmount,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
          items: {
            deleteMany: {},
            create: calculatedItems.map((item, index) => ({
              serviceId: item.serviceId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              lineSubtotal: item.lineSubtotal,
              lineTaxAmount: item.lineTaxAmount,
              lineTotal: item.lineTotal,
              sortOrder: index,
            })),
          },
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.QUOTATION_UPDATED,
        entityType: ActivityEntityType.QUOTATION,
        entityId: existing.id,
        quotationId: existing.id,
        leadId: lead?.id,
        customerId: customer?.id,
        userId: actorId,
        description: `Quotation ${existing.quotationNumber} details updated.`,
        metadata: {
          totalAmount: totals.totalAmount,
          itemCount: calculatedItems.length,
        },
      });

      return {
        quotationId: existing.id,
        leadId: lead?.id ?? null,
        customerId: customer?.id ?? null,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/quotations",
      `/dashboard/quotations/${result.quotationId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Quotation updated.", {
      quotationId: result.quotationId,
    });
  } catch (error) {
    console.error("Quotation update failed", error);
    return actionFailure("We could not update this quotation.");
  }
}

export async function updateQuotationStatus(
  input: unknown,
): Promise<BillingActionResponse<{ quotationId: string; status: string }>> {
  const validated = updateQuotationStatusSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please choose a valid quotation status.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.findUnique({
        where: { id: validated.data.quotationId },
        select: {
          id: true,
          quotationNumber: true,
          status: true,
          validUntil: true,
          leadId: true,
          customerId: true,
        },
      });

      if (!quotation) {
        throw new Error("Quotation not found.");
      }

      const effectiveStatus = getDerivedQuotationStatus(quotation.status, quotation.validUntil);

      if (effectiveStatus === validated.data.status) {
        return {
          quotationId: quotation.id,
          status: effectiveStatus,
          leadId: quotation.leadId,
          customerId: quotation.customerId,
        };
      }

      const updated = await tx.quotation.update({
        where: { id: quotation.id },
        data: {
          status: validated.data.status,
          ...getQuotationStatusTimestamps(validated.data.status),
        },
      });

      if (validated.data.status === "SENT" && quotation.leadId) {
        await tx.lead.update({
          where: { id: quotation.leadId },
          data: {
            status: "QUOTATION_SENT",
          },
        });
      }

      await createActivityLog(tx, {
        type: ActivityType.QUOTATION_STATUS_CHANGED,
        entityType: ActivityEntityType.QUOTATION,
        entityId: quotation.id,
        quotationId: quotation.id,
        leadId: quotation.leadId,
        customerId: quotation.customerId,
        userId: actorId,
        description: `Quotation ${quotation.quotationNumber} status changed from ${effectiveStatus} to ${updated.status}.`,
        metadata: {
          previousStatus: effectiveStatus,
          nextStatus: updated.status,
        },
      });

      return {
        quotationId: updated.id,
        status: updated.status,
        leadId: quotation.leadId,
        customerId: quotation.customerId,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/quotations",
      `/dashboard/quotations/${result.quotationId}`,
      "/dashboard/invoices",
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Quotation status updated.", {
      quotationId: result.quotationId,
      status: result.status,
    });
  } catch (error) {
    console.error("Quotation status update failed", error);
    return actionFailure("We could not update the quotation status.");
  }
}

export async function convertQuotationToInvoice(
  input: unknown,
): Promise<BillingActionResponse<{ invoiceId: string; quotationId: string }>> {
  const validated = convertQuotationToInvoiceSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the invoice conversion details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.findUnique({
        where: { id: validated.data.quotationId },
        include: {
          items: {
            orderBy: [{ sortOrder: "asc" }],
          },
          invoice: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!quotation) {
        throw new Error("Quotation not found.");
      }

      const effectiveStatus = getDerivedQuotationStatus(quotation.status, quotation.validUntil);

      if (effectiveStatus !== "ACCEPTED") {
        throw new Error("Only accepted quotations can be converted.");
      }

      if (quotation.invoice) {
        return {
          invoiceId: quotation.invoice.id,
          quotationId: quotation.id,
          leadId: quotation.leadId,
          customerId: quotation.customerId,
        };
      }

      const invoiceNumber = await createInvoiceNumber();

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          quotationId: quotation.id,
          leadId: quotation.leadId,
          customerId: quotation.customerId,
          title: validated.data.title ?? quotation.title,
          issueDate: validated.data.issueDate,
          dueDate: validated.data.dueDate,
          notes: validated.data.notes ?? quotation.notes,
          subtotalAmount: quotation.subtotalAmount,
          taxAmount: quotation.taxAmount,
          discountAmount: quotation.discountAmount,
          totalAmount: quotation.totalAmount,
          paidAmount: 0,
          balanceAmount: quotation.totalAmount,
          items: {
            create: quotation.items.map((item) => ({
              serviceId: item.serviceId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              lineSubtotal: item.lineSubtotal,
              lineTaxAmount: item.lineTaxAmount,
              lineTotal: item.lineTotal,
              sortOrder: item.sortOrder,
            })),
          },
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.QUOTATION_CONVERTED_TO_INVOICE,
        entityType: ActivityEntityType.QUOTATION,
        entityId: quotation.id,
        quotationId: quotation.id,
        invoiceId: invoice.id,
        leadId: quotation.leadId,
        customerId: quotation.customerId,
        userId: actorId,
        description: `Quotation ${quotation.quotationNumber} converted to invoice ${invoice.invoiceNumber}.`,
      });

      await createActivityLog(tx, {
        type: ActivityType.INVOICE_CREATED,
        entityType: ActivityEntityType.INVOICE,
        entityId: invoice.id,
        invoiceId: invoice.id,
        quotationId: quotation.id,
        leadId: quotation.leadId,
        customerId: quotation.customerId,
        userId: actorId,
        description: `Invoice ${invoice.invoiceNumber} created from quotation ${quotation.quotationNumber}.`,
      });

      return {
        invoiceId: invoice.id,
        quotationId: quotation.id,
        leadId: quotation.leadId,
        customerId: quotation.customerId,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/quotations",
      `/dashboard/quotations/${result.quotationId}`,
      "/dashboard/invoices",
      `/dashboard/invoices/${result.invoiceId}`,
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Invoice created from quotation.", {
      invoiceId: result.invoiceId,
      quotationId: result.quotationId,
    });
  } catch (error) {
    console.error("Quotation conversion failed", error);
    return actionFailure("We could not convert this quotation to an invoice.");
  }
}

export async function updateInvoiceStatus(
  input: unknown,
): Promise<BillingActionResponse<{ invoiceId: string; status: string }>> {
  const validated = updateInvoiceStatusSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please choose a valid invoice status.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: validated.data.invoiceId },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          dueDate: true,
          leadId: true,
          customerId: true,
          paidAmount: true,
          balanceAmount: true,
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found.");
      }

      const paidAmount = roundCurrency(Number(invoice.paidAmount));
      const balanceAmount = roundCurrency(Number(invoice.balanceAmount));
      const effectiveStatus = getDerivedInvoiceStatus(invoice.status, invoice.dueDate, balanceAmount);

      if (validated.data.status === "PARTIALLY_PAID" || validated.data.status === "PAID") {
        throw new Error("Paid statuses are updated automatically from payments.");
      }

      if (validated.data.status === "CANCELLED" && paidAmount > 0) {
        throw new Error("Invoices with payments cannot be cancelled.");
      }

      if (effectiveStatus === validated.data.status) {
        return {
          invoiceId: invoice.id,
          status: effectiveStatus,
          leadId: invoice.leadId,
          customerId: invoice.customerId,
        };
      }

      const updated = await tx.invoice.update({
        where: { id: invoice.id },
        data: getInvoiceStatusPayload(validated.data.status),
      });

      await createActivityLog(tx, {
        type: ActivityType.INVOICE_STATUS_CHANGED,
        entityType: ActivityEntityType.INVOICE,
        entityId: invoice.id,
        invoiceId: invoice.id,
        leadId: invoice.leadId,
        customerId: invoice.customerId,
        userId: actorId,
        description: `Invoice ${invoice.invoiceNumber} status changed from ${effectiveStatus} to ${updated.status}.`,
        metadata: {
          previousStatus: effectiveStatus,
          nextStatus: updated.status,
        },
      });

      return {
        invoiceId: updated.id,
        status: updated.status,
        leadId: invoice.leadId,
        customerId: invoice.customerId,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/invoices",
      `/dashboard/invoices/${result.invoiceId}`,
      "/dashboard/payments",
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Invoice status updated.", {
      invoiceId: result.invoiceId,
      status: result.status,
    });
  } catch (error) {
    console.error("Invoice status update failed", error);
    return actionFailure("We could not update the invoice status.");
  }
}

export async function recordPayment(
  input: unknown,
): Promise<BillingActionResponse<{ paymentId: string; invoiceId: string }>> {
  const validated = recordPaymentSchema.safeParse(input);

  if (!validated.success) {
    return actionFailure(
      "Please review the payment details.",
      validated.error.flatten().fieldErrors,
    );
  }

  const actorId = await getSystemActorId();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: validated.data.invoiceId },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          dueDate: true,
          leadId: true,
          customerId: true,
          totalAmount: true,
          paidAmount: true,
          balanceAmount: true,
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found.");
      }

      const currentBalance = roundCurrency(Number(invoice.balanceAmount));

      if (invoice.status === "CANCELLED") {
        throw new Error("Cancelled invoices cannot receive payments.");
      }

      if (validated.data.amount > currentBalance) {
        throw new Error("Payment amount cannot exceed the outstanding balance.");
      }

      const paymentNumber = await createPaymentNumber();
      const nextPaidAmount = roundCurrency(Number(invoice.paidAmount) + validated.data.amount);
      const nextBalanceAmount = roundCurrency(
        Math.max(0, Number(invoice.totalAmount) - nextPaidAmount),
      );
      const nextStatus =
        nextBalanceAmount === 0
          ? InvoiceStatus.PAID
          : getDerivedInvoiceStatus(
              InvoiceStatus.PARTIALLY_PAID,
              invoice.dueDate,
              nextBalanceAmount,
            );

      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId: invoice.id,
          leadId: invoice.leadId,
          customerId: invoice.customerId,
          amount: validated.data.amount,
          method: validated.data.method,
          paidAt: validated.data.paidAt,
          reference: validated.data.reference,
          notes: validated.data.notes,
        },
      });

      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: nextPaidAmount,
          balanceAmount: nextBalanceAmount,
          status: nextStatus,
          paidAt: nextBalanceAmount === 0 ? validated.data.paidAt : undefined,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.PAYMENT_RECORDED,
        entityType: ActivityEntityType.PAYMENT,
        entityId: payment.id,
        paymentId: payment.id,
        invoiceId: invoice.id,
        leadId: invoice.leadId,
        customerId: invoice.customerId,
        userId: actorId,
        description: `Payment ${payment.paymentNumber} of Rs. ${validated.data.amount.toFixed(2)} recorded against invoice ${invoice.invoiceNumber}.`,
        metadata: {
          amount: validated.data.amount,
          method: validated.data.method,
          reference: validated.data.reference,
        },
      });

      await createActivityLog(tx, {
        type: ActivityType.INVOICE_UPDATED,
        entityType: ActivityEntityType.INVOICE,
        entityId: invoice.id,
        invoiceId: invoice.id,
        paymentId: payment.id,
        leadId: invoice.leadId,
        customerId: invoice.customerId,
        userId: actorId,
        description: `Invoice ${invoice.invoiceNumber} payment ledger updated. Paid Rs. ${nextPaidAmount.toFixed(2)}, balance Rs. ${nextBalanceAmount.toFixed(2)}.`,
      });

      return {
        paymentId: payment.id,
        invoiceId: invoice.id,
        leadId: invoice.leadId,
        customerId: invoice.customerId,
      };
    });

    revalidateBillingPaths([
      "/dashboard",
      "/dashboard/invoices",
      `/dashboard/invoices/${result.invoiceId}`,
      "/dashboard/payments",
      ...(result.leadId ? [`/dashboard/leads/${result.leadId}`] : []),
      ...(result.customerId ? [`/dashboard/customers/${result.customerId}`] : []),
    ]);

    return actionSuccess("Payment recorded.", {
      paymentId: result.paymentId,
      invoiceId: result.invoiceId,
    });
  } catch (error) {
    console.error("Payment record failed", error);
    return actionFailure("We could not record this payment.");
  }
}
