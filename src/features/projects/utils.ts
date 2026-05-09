import type {
  AmcStatus,
  ProjectStage,
  Prisma,
} from "@prisma/client";

import { decimalToNumber } from "@/features/billing/utils";

export function getDerivedAmcStatus(
  status: AmcStatus,
  renewalDate: Date,
  endDate: Date,
  now = new Date(),
) {
  if (status === "CANCELLED" || status === "RENEWED") {
    return status;
  }

  if (endDate.getTime() < now.getTime() || renewalDate.getTime() < now.getTime()) {
    return "EXPIRED" as const;
  }

  const daysUntilRenewal = getDaysUntil(renewalDate, now);

  if (daysUntilRenewal <= 30) {
    return "DUE_SOON" as const;
  }

  return "ACTIVE" as const;
}

export function getDaysUntil(targetDate: Date, now = new Date()) {
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getAmcReminderSchedule(
  renewalDate: Date,
  reminderDays: number[],
  now = new Date(),
) {
  return [...reminderDays]
    .sort((left, right) => right - left)
    .map((day) => {
      const reminderDate = new Date(renewalDate);
      reminderDate.setDate(reminderDate.getDate() - day);

      return {
        day,
        reminderDate,
        isDue: reminderDate.getTime() <= now.getTime(),
      };
    });
}

export function isProjectCompletedStage(stage: ProjectStage) {
  return stage === "COMPLETED" || stage === "CLOSED";
}

export function isProjectActiveStage(stage: ProjectStage) {
  return !isProjectCompletedStage(stage) && stage !== "ON_HOLD";
}

export function mapProjectFinancialSummary(input: {
  quotationTotalAmount?: Prisma.Decimal | number | null;
  invoiceTotalAmount?: Prisma.Decimal | number | null;
  invoicePaidAmount?: Prisma.Decimal | number | null;
  invoiceBalanceAmount?: Prisma.Decimal | number | null;
  paymentAmount?: Prisma.Decimal | number | null;
}) {
  return {
    quotationTotalAmount: decimalToNumber(input.quotationTotalAmount),
    invoiceTotalAmount: decimalToNumber(input.invoiceTotalAmount),
    invoicePaidAmount: decimalToNumber(input.invoicePaidAmount),
    invoiceBalanceAmount: decimalToNumber(input.invoiceBalanceAmount),
    paymentAmount: decimalToNumber(input.paymentAmount),
  };
}
