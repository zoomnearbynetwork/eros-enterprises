"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { updateInvoiceStatus } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import {
  INVOICE_STATUS_LABELS,
} from "@/features/crm/constants";
import { PaymentRecorder } from "@/features/billing/components/payment-recorder";

function FieldLabel({ children }: { children: string }) {
  return <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">{children}</label>;
}

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function InvoiceActionPanel({
  invoice,
  openInvoices,
}: {
  invoice: {
    id: string;
    status: "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";
    effectiveStatus: "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";
    balanceAmount: number;
  };
  openInvoices: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    customer: {
      legalName: string;
    } | null;
    lead: {
      name: string;
    } | null;
  }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"DRAFT" | "SENT" | "CANCELLED">(
    invoice.effectiveStatus === "CANCELLED"
      ? "CANCELLED"
      : invoice.effectiveStatus === "SENT" || invoice.effectiveStatus === "OVERDUE"
        ? "SENT"
        : "DRAFT",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleStatusUpdate() {
    setErrorMessage(null);
    setMessage(null);
    setIsPending(true);

    const result = await updateInvoiceStatus({
      invoiceId: invoice.id,
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

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Invoice Controls</div>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <FieldLabel>Manual Status</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={status}
              onChange={(event) => setStatus(event.target.value as "DRAFT" | "SENT" | "CANCELLED")}
            >
              {(["DRAFT", "SENT", "CANCELLED"] as const).map((invoiceStatus) => (
                <option key={invoiceStatus} value={invoiceStatus} className="bg-[#101113]">
                  {INVOICE_STATUS_LABELS[invoiceStatus]}
                </option>
              ))}
            </select>
          </div>
          <Button disabled={isPending} onClick={() => startTransition(handleStatusUpdate)}>
            Update Invoice Status
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Record Payment</div>
        <div className="mt-4">
          {invoice.balanceAmount > 0 && invoice.effectiveStatus !== "CANCELLED" ? (
            <PaymentRecorder invoices={openInvoices} lockedInvoiceId={invoice.id} />
          ) : (
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4 text-sm text-zinc-300">
              This invoice does not have an outstanding balance to collect.
            </div>
          )}
        </div>
      </div>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
