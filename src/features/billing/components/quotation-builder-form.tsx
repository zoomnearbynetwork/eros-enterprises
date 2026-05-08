"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  createQuotation,
  updateQuotation,
} from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateInput } from "@/features/billing/utils";
import { calculateBillingTotals } from "@/features/billing/utils";
import { formatCurrency } from "@/features/crm/utils";

type LeadOption = {
  id: string;
  leadNumber: string;
  name: string;
  serviceInterest: string;
  customer: {
    id: string;
    customerNumber: string;
    legalName: string;
  } | null;
};

type CustomerOption = {
  id: string;
  customerNumber: string;
  legalName: string;
  primaryContactName: string | null;
};

type ServiceOption = {
  id: string;
  code: string;
  name: string;
};

type QuotationFormValues = {
  leadId?: string;
  customerId?: string;
  title?: string | null;
  issueDate: Date;
  validUntil?: Date | null;
  notes?: string | null;
  discountAmount: number;
  items: Array<{
    serviceId?: string | null;
    name: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }>;
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

export function QuotationBuilderForm({
  mode,
  quotationId,
  leads,
  customers,
  services,
  initialValues,
}: {
  mode: "create" | "update";
  quotationId?: string;
  leads: LeadOption[];
  customers: CustomerOption[];
  services: ServiceOption[];
  initialValues?: QuotationFormValues;
}) {
  const router = useRouter();
  const [leadId, setLeadId] = useState(initialValues?.leadId ?? "");
  const [customerId, setCustomerId] = useState(initialValues?.customerId ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [issueDate, setIssueDate] = useState(
    formatDateInput(initialValues?.issueDate ?? new Date()),
  );
  const [validUntil, setValidUntil] = useState(formatDateInput(initialValues?.validUntil));
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [discountAmount, setDiscountAmount] = useState(
    String(initialValues?.discountAmount ?? 0),
  );
  const [items, setItems] = useState(
    initialValues?.items ?? [
      {
        serviceId: services[0]?.id ?? "",
        name: services[0]?.name ?? "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
      },
    ],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const totals = calculateBillingTotals(
    items.map((item) => ({
      serviceId: item.serviceId || undefined,
      name: item.name,
      description: item.description ?? undefined,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      taxRate: Number(item.taxRate) || 0,
    })),
    Number(discountAmount) || 0,
  );

  function handleLeadChange(nextLeadId: string) {
    setLeadId(nextLeadId);

    if (!nextLeadId) {
      return;
    }

    const selectedLead = leads.find((lead) => lead.id === nextLeadId);

    if (selectedLead?.customer && !customerId) {
      setCustomerId(selectedLead.customer.id);
    }

    if (!title) {
      setTitle(`Quotation for ${selectedLead?.name ?? "Customer Requirement"}`);
    }
  }

  function updateItem(
    index: number,
    patch: Partial<(typeof items)[number]>,
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        serviceId: "",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setMessage(null);
    setIsPending(true);

    const payload = {
      ...(mode === "update" ? { quotationId } : {}),
      leadId: leadId || undefined,
      customerId: customerId || undefined,
      title,
      issueDate,
      validUntil,
      notes,
      discountAmount: Number(discountAmount) || 0,
      items: items.map((item) => ({
        serviceId: item.serviceId || undefined,
        name: item.name,
        description: item.description,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        taxRate: Number(item.taxRate) || 0,
      })),
    };

    const result =
      mode === "create"
        ? await createQuotation(payload)
        : await updateQuotation(payload);

    setIsPending(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);

    startTransition(() => {
      router.push(`/dashboard/quotations/${result.data.quotationId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Lead</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={leadId}
              onChange={(event) => handleLeadChange(event.target.value)}
            >
              <option value="" className="bg-[#101113]">Select a lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id} className="bg-[#101113]">
                  {lead.leadNumber} | {lead.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <FieldLabel>Customer</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id} className="bg-[#101113]">
                  {customer.customerNumber} | {customer.legalName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <FieldLabel>Title</FieldLabel>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Issue Date</FieldLabel>
            <Input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Valid Until</FieldLabel>
            <Input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Discount</FieldLabel>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={discountAmount}
              onChange={(event) => setDiscountAmount(event.target.value)}
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add scope assumptions, payment terms, or delivery notes."
            />
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-medium text-white">Item Builder</div>
          <Button variant="secondary" onClick={addItem}>
            Add Item
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div
              key={`${index}-${item.name}`}
              className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4"
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="grid gap-2 xl:col-span-2">
                  <FieldLabel>Service</FieldLabel>
                  <select
                    className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
                    value={item.serviceId ?? ""}
                    onChange={(event) => {
                      const nextServiceId = event.target.value;
                      const service = services.find((entry) => entry.id === nextServiceId);

                      updateItem(index, {
                        serviceId: nextServiceId,
                        name: item.name || service?.name || "",
                      });
                    }}
                  >
                    <option value="" className="bg-[#101113]">Custom line item</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id} className="bg-[#101113]">
                        {service.code} | {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 xl:col-span-2">
                  <FieldLabel>Item Name</FieldLabel>
                  <Input
                    value={item.name}
                    onChange={(event) => updateItem(index, { name: event.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Quantity</FieldLabel>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Unit Price</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })}
                  />
                </div>

                <div className="grid gap-2 xl:col-span-4">
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    value={item.description ?? ""}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Tax %</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.taxRate}
                    onChange={(event) => updateItem(index, { taxRate: Number(event.target.value) })}
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Line Total</FieldLabel>
                  <div className="flex h-10 items-center rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-200">
                    {formatCurrency(totals.calculatedItems[index]?.lineTotal ?? 0)}
                  </div>
                </div>

                <div className="flex items-end xl:justify-end">
                  <Button
                    variant="outline"
                    disabled={items.length === 1}
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Subtotal" value={formatCurrency(totals.totals.subtotalAmount)} />
        <SummaryTile label="Tax" value={formatCurrency(totals.totals.taxAmount)} />
        <SummaryTile label="Discount" value={formatCurrency(totals.totals.discountAmount)} />
        <SummaryTile label="Grand Total" value={formatCurrency(totals.totals.totalAmount)} emphasized />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} onClick={() => startTransition(handleSubmit)}>
          {mode === "create" ? "Create Quotation" : "Update Quotation"}
        </Button>
        <MessageLine message={message} />
        <MessageLine message={errorMessage} error />
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#101113]/92 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className={`mt-3 text-lg ${emphasized ? "font-semibold text-white" : "text-zinc-200"}`}>
        {value}
      </div>
    </div>
  );
}
