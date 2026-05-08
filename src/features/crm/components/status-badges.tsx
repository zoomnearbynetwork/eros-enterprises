import type {
  CustomerStatus,
  CustomerType,
  InvoiceStatus,
  LeadPriority,
  LeadStatus,
  PaymentMethod,
  QuotationStatus,
  SiteVisitStatus,
} from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_TYPE_LABELS,
  INVOICE_STATUS_LABELS,
  LEAD_PRIORITY_LABELS,
  LEAD_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  QUOTATION_STATUS_LABELS,
  SITE_VISIT_STATUS_LABELS,
} from "@/features/crm/constants";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const className =
    {
      NEW: "bg-sky-500/15 text-sky-200",
      CONTACTED: "bg-indigo-500/15 text-indigo-200",
      QUALIFIED: "bg-emerald-500/15 text-emerald-200",
      SITE_VISIT_SCHEDULED: "bg-amber-500/15 text-amber-200",
      QUOTATION_SENT: "bg-fuchsia-500/15 text-fuchsia-200",
      WON: "bg-green-500/15 text-green-200",
      LOST: "bg-rose-500/15 text-rose-200",
    }[status] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{LEAD_STATUS_LABELS[status]}</Badge>;
}

export function LeadPriorityBadge({ priority }: { priority: LeadPriority }) {
  const className =
    {
      LOW: "bg-zinc-500/15 text-zinc-200",
      MEDIUM: "bg-blue-500/15 text-blue-200",
      HIGH: "bg-amber-500/15 text-amber-200",
      URGENT: "bg-rose-500/15 text-rose-200",
    }[priority] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{LEAD_PRIORITY_LABELS[priority]}</Badge>;
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const className =
    {
      ONBOARDING: "bg-amber-500/15 text-amber-200",
      ACTIVE: "bg-emerald-500/15 text-emerald-200",
      INACTIVE: "bg-zinc-500/15 text-zinc-200",
    }[status] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{CUSTOMER_STATUS_LABELS[status]}</Badge>;
}

export function CustomerTypeBadge({ type }: { type: CustomerType }) {
  return <Badge className="bg-white/8 text-zinc-200">{CUSTOMER_TYPE_LABELS[type]}</Badge>;
}

export function SiteVisitStatusBadge({ status }: { status: SiteVisitStatus }) {
  const className =
    {
      SCHEDULED: "bg-sky-500/15 text-sky-200",
      ASSIGNED: "bg-indigo-500/15 text-indigo-200",
      COMPLETED: "bg-emerald-500/15 text-emerald-200",
      RESCHEDULED: "bg-amber-500/15 text-amber-200",
      CANCELLED: "bg-rose-500/15 text-rose-200",
    }[status] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{SITE_VISIT_STATUS_LABELS[status]}</Badge>;
}

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  const className =
    {
      DRAFT: "bg-zinc-500/15 text-zinc-200",
      SENT: "bg-sky-500/15 text-sky-200",
      VIEWED: "bg-indigo-500/15 text-indigo-200",
      ACCEPTED: "bg-emerald-500/15 text-emerald-200",
      REJECTED: "bg-rose-500/15 text-rose-200",
      EXPIRED: "bg-amber-500/15 text-amber-200",
    }[status] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{QUOTATION_STATUS_LABELS[status]}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const className =
    {
      DRAFT: "bg-zinc-500/15 text-zinc-200",
      SENT: "bg-sky-500/15 text-sky-200",
      PARTIALLY_PAID: "bg-indigo-500/15 text-indigo-200",
      PAID: "bg-emerald-500/15 text-emerald-200",
      OVERDUE: "bg-rose-500/15 text-rose-200",
      CANCELLED: "bg-zinc-700/40 text-zinc-300",
    }[status] ?? "bg-white/10 text-zinc-200";

  return <Badge className={className}>{INVOICE_STATUS_LABELS[status]}</Badge>;
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return <Badge className="bg-white/8 text-zinc-200">{PAYMENT_METHOD_LABELS[method]}</Badge>;
}
