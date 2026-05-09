"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  convertQuotationToInvoice,
  updateQuotationStatus,
} from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QUOTATION_STATUSES,
  QUOTATION_STATUS_LABELS,
} from "@/features/crm/constants";
import { formatDateInput } from "@/features/billing/utils";

function FieldLabel({ children }: { children: string }) {
  return <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">{children}</label>;
}

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function QuotationActionPanel({
  quotation,
}: {
  quotation: {
    id: string;
    status: (typeof QUOTATION_STATUSES)[number];
    effectiveStatus: (typeof QUOTATION_STATUSES)[number];
    title: string | null;
    notes: string | null;
    invoice: {
      id: string;
      invoiceNumber: string;
    } | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(quotation.effectiveStatus);
  const [issueDate, setIssueDate] = useState(formatDateInput(new Date()));
  const [dueDate, setDueDate] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState(quotation.title ?? "");
  const [invoiceNotes, setInvoiceNotes] = useState(quotation.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleStatusUpdate() {
    setErrorMessage(null);
    setMessage(null);
    setIsPending(true);

    const result = await updateQuotationStatus({
      quotationId: quotation.id,
      status,
    });

    setIsPending(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleConvert() {
    setErrorMessage(null);
    setMessage(null);
    setIsPending(true);

    const result = await convertQuotationToInvoice({
      quotationId: quotation.id,
      issueDate,
      dueDate,
      title: invoiceTitle,
      notes: invoiceNotes,
    });

    setIsPending(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    startTransition(() => {
      router.push(`/dashboard/invoices/${result.data.invoiceId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Quotation Controls</div>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <FieldLabel>Status</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={status}
              onChange={(event) => setStatus(event.target.value as (typeof QUOTATION_STATUSES)[number])}
            >
              {QUOTATION_STATUSES.map((quotationStatus) => (
                <option key={quotationStatus} value={quotationStatus} className="bg-[#101113]">
                  {QUOTATION_STATUS_LABELS[quotationStatus]}
                </option>
              ))}
            </select>
          </div>
          <Button disabled={isPending} onClick={() => startTransition(handleStatusUpdate)}>
            Update Quotation Status
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Invoice Conversion</div>
        {quotation.invoice ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4 text-sm text-zinc-300">
              This quotation already has invoice <span className="font-medium text-white">{quotation.invoice.invoiceNumber}</span>.
            </div>
            <Button onClick={() => router.push(`/dashboard/invoices/${quotation.invoice?.id}`)}>
              Open Invoice
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <FieldLabel>Invoice Title</FieldLabel>
              <Input
                value={invoiceTitle}
                onChange={(event) => setInvoiceTitle(event.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Issue Date</FieldLabel>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Due Date</FieldLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FieldLabel>Invoice Notes</FieldLabel>
              <Input
                value={invoiceNotes}
                onChange={(event) => setInvoiceNotes(event.target.value)}
              />
            </div>
            <Button disabled={isPending} onClick={() => startTransition(handleConvert)}>
              Convert to Invoice
            </Button>
          </div>
        )}
      </div>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
