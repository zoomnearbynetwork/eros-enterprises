"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { recordPayment } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/features/crm/constants";
import { formatDateTimeLocalInput } from "@/features/crm/utils";

type InvoiceOption = {
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
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">{children}</label>;
}

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function PaymentRecorder({
  invoices,
  lockedInvoiceId,
}: {
  invoices: InvoiceOption[];
  lockedInvoiceId?: string;
}) {
  const router = useRouter();
  const [invoiceId, setInvoiceId] = useState(lockedInvoiceId ?? invoices[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]>("BANK_TRANSFER");
  const [paidAt, setPaidAt] = useState(formatDateTimeLocalInput(new Date()));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);

  async function handleSubmit() {
    setErrorMessage(null);
    setMessage(null);
    setIsPending(true);

    const result = await recordPayment({
      invoiceId,
      amount: Number(amount),
      method,
      paidAt,
      reference,
      notes,
    });

    setIsPending(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setAmount("");
    setReference("");
    setNotes("");
    setMessage(result.message);

    startTransition(() => {
      router.push(`/dashboard/invoices/${result.data.invoiceId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div className="grid gap-2">
          <FieldLabel>Invoice</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={invoiceId}
            onChange={(event) => setInvoiceId(event.target.value)}
            disabled={Boolean(lockedInvoiceId)}
          >
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id} className="bg-[#101113]">
                {invoice.invoiceNumber} | {invoice.customer?.legalName ?? invoice.lead?.name ?? "Invoice"}
              </option>
            ))}
          </select>
        </div>

        {selectedInvoice ? (
          <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4 text-sm text-zinc-300">
            Outstanding balance: <span className="font-medium text-white">Rs. {selectedInvoice.balanceAmount.toFixed(2)}</span>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Amount</FieldLabel>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Payment Method</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={method}
              onChange={(event) => setMethod(event.target.value as (typeof PAYMENT_METHODS)[number])}
            >
              {PAYMENT_METHODS.map((paymentMethod) => (
                <option key={paymentMethod} value={paymentMethod} className="bg-[#101113]">
                  {PAYMENT_METHOD_LABELS[paymentMethod]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Paid At</FieldLabel>
            <Input
              type="datetime-local"
              value={paidAt}
              onChange={(event) => setPaidAt(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Reference</FieldLabel>
            <Input value={reference} onChange={(event) => setReference(event.target.value)} />
          </div>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Notes</FieldLabel>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Bank memo, cheque note, or payment context."
          />
        </div>
      </div>

      <Button disabled={isPending || !invoiceId} onClick={() => startTransition(handleSubmit)}>
        Record Payment
      </Button>
      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
