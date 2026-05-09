import { prisma } from "@/lib/prisma";

async function createUniqueNumber(prefix: string) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const candidate = `${prefix}-${date}-${random}`;

    if (prefix === "ERL") {
      const existing = await prisma.lead.findUnique({
        where: { leadNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERC") {
      const existing = await prisma.customer.findUnique({
        where: { customerNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERV") {
      const existing = await prisma.siteVisit.findUnique({
        where: { visitNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERQ") {
      const existing = await prisma.quotation.findUnique({
        where: { quotationNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERI") {
      const existing = await prisma.invoice.findUnique({
        where: { invoiceNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERP") {
      const existing = await prisma.payment.findUnique({
        where: { paymentNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERPR") {
      const existing = await prisma.project.findUnique({
        where: { projectNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    if (prefix === "ERAMC") {
      const existing = await prisma.amcPlan.findUnique({
        where: { amcNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }
  }

  throw new Error(`Could not generate a unique ${prefix} number.`);
}

export function createLeadNumber() {
  return createUniqueNumber("ERL");
}

export function createCustomerNumber() {
  return createUniqueNumber("ERC");
}

export function createSiteVisitNumber() {
  return createUniqueNumber("ERV");
}

export function createQuotationNumber() {
  return createUniqueNumber("ERQ");
}

export function createInvoiceNumber() {
  return createUniqueNumber("ERI");
}

export function createPaymentNumber() {
  return createUniqueNumber("ERP");
}

export function createProjectNumber() {
  return createUniqueNumber("ERPR");
}

export function createAmcNumber() {
  return createUniqueNumber("ERAMC");
}
