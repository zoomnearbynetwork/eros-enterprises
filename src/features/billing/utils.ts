import type {
  InvoiceStatus,
  Prisma,
  QuotationStatus,
} from "@prisma/client";

export type BillingItemInput = {
  serviceId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

export type CalculatedBillingItem = BillingItemInput & {
  lineSubtotal: number;
  lineTaxAmount: number;
  lineTotal: number;
};

export type BillingTotals = {
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
};

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function decimalToNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return 0;
  }

  return roundCurrency(Number(value));
}

export function formatDateInput(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function calculateBillingItem(item: BillingItemInput): CalculatedBillingItem {
  const quantity = roundCurrency(item.quantity);
  const unitPrice = roundCurrency(item.unitPrice);
  const taxRate = roundCurrency(item.taxRate);
  const lineSubtotal = roundCurrency(quantity * unitPrice);
  const lineTaxAmount = roundCurrency((lineSubtotal * taxRate) / 100);
  const lineTotal = roundCurrency(lineSubtotal + lineTaxAmount);

  return {
    ...item,
    quantity,
    unitPrice,
    taxRate,
    lineSubtotal,
    lineTaxAmount,
    lineTotal,
  };
}

export function calculateBillingTotals(items: BillingItemInput[], discountAmount: number) {
  const calculatedItems = items.map(calculateBillingItem);
  const subtotalAmount = roundCurrency(
    calculatedItems.reduce((sum, item) => sum + item.lineSubtotal, 0),
  );
  const taxAmount = roundCurrency(
    calculatedItems.reduce((sum, item) => sum + item.lineTaxAmount, 0),
  );
  const safeDiscountAmount = roundCurrency(Math.max(0, discountAmount));
  const totalAmount = roundCurrency(
    Math.max(0, subtotalAmount + taxAmount - safeDiscountAmount),
  );

  return {
    calculatedItems,
    totals: {
      subtotalAmount,
      taxAmount,
      discountAmount: safeDiscountAmount,
      totalAmount,
    } satisfies BillingTotals,
  };
}

export function getDerivedQuotationStatus(
  status: QuotationStatus,
  validUntil: Date | null,
) {
  if (
    validUntil &&
    validUntil.getTime() < Date.now() &&
    status !== "ACCEPTED" &&
    status !== "REJECTED"
  ) {
    return "EXPIRED" as const;
  }

  return status;
}

export function getDerivedInvoiceStatus(
  status: InvoiceStatus,
  dueDate: Date | null,
  balanceAmount: number,
) {
  if (status === "CANCELLED" || status === "PAID") {
    return status;
  }

  if (balanceAmount <= 0) {
    return "PAID" as const;
  }

  if (balanceAmount > 0 && status === "PARTIALLY_PAID") {
    if (dueDate && dueDate.getTime() < Date.now()) {
      return "OVERDUE" as const;
    }

    return status;
  }

  if (dueDate && dueDate.getTime() < Date.now() && status !== "DRAFT") {
    return "OVERDUE" as const;
  }

  return status;
}
