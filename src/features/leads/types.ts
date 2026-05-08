import type {
  ActivityType,
  InvoiceStatus,
  Lead,
  LeadPriority,
  LeadSource,
  LeadStatus,
  Prisma,
  QuotationStatus,
  SiteVisitStatus,
} from "@prisma/client";

import type { ActionResponse } from "@/lib/action-response";
import type { LeadCaptureField } from "@/features/leads/schemas";

export type LeadCaptureResultData = {
  id: Lead["id"];
  leadNumber: Lead["leadNumber"];
};

export type LeadCaptureActionResponse = ActionResponse<
  LeadCaptureResultData,
  LeadCaptureField
>;

export type LeadFilters = {
  query?: string;
  status?: string;
  service?: string;
  source?: string;
  priority?: string;
  assignee?: string;
};

export type LeadListItem = Pick<
  Lead,
  | "id"
  | "leadNumber"
  | "name"
  | "phone"
  | "email"
  | "serviceInterest"
  | "source"
  | "sourcePage"
  | "ctaLocation"
  | "location"
  | "budgetRange"
  | "status"
  | "priority"
  | "createdAt"
> & {
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string | null;
  } | null;
};

export type LeadActivityItem = {
  id: string;
  type: ActivityType;
  action: string;
  description: string | null;
  occurredAt: Date;
  user: {
    firstName: string;
    lastName: string | null;
  } | null;
};

export type LeadDetailRecord = Lead & {
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    role: {
      name: string;
    };
  } | null;
  customer: {
    id: string;
    customerNumber: string;
    legalName: string;
    status: string;
  } | null;
  siteVisits: Array<{
    id: string;
    visitNumber: string;
    scheduledAt: Date;
    address: string;
    status: SiteVisitStatus;
    assignedEngineer: {
      firstName: string;
      lastName: string | null;
    } | null;
  }>;
  quotations: Array<{
    id: string;
    quotationNumber: string;
    status: QuotationStatus;
    totalAmount: Prisma.Decimal;
    issueDate: Date;
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    totalAmount: Prisma.Decimal;
    balanceAmount: Prisma.Decimal;
    issueDate: Date;
  }>;
  activities: LeadActivityItem[];
};

export type LeadStatusValue = LeadStatus;
export type LeadPriorityValue = LeadPriority;
export type LeadSourceValue = LeadSource;
