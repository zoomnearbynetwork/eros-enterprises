import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { formatCurrency, shortDateFormatter } from "@/features/crm/utils";

type DocumentItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
};

export function BillingDocumentPreview({
  label,
  documentNumber,
  title,
  status,
  issueDate,
  secondaryDateLabel,
  secondaryDateValue,
  billToName,
  billToMeta,
  notes,
  items,
  subtotalAmount,
  taxAmount,
  discountAmount,
  totalAmount,
}: {
  label: string;
  documentNumber: string;
  title?: string | null;
  status: ReactNode;
  issueDate: Date;
  secondaryDateLabel: string;
  secondaryDateValue?: Date | null;
  billToName: string;
  billToMeta: string[];
  notes?: string | null;
  items: DocumentItem[];
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}) {
  return (
    <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none print:border-zinc-200 print:bg-white">
      <CardHeader className="border-b border-white/10 py-6 print:border-zinc-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80 print:text-zinc-500">
              {label}
            </div>
            <CardTitle className="mt-3 text-white print:text-zinc-950">{documentNumber}</CardTitle>
            <p className="mt-2 text-sm text-zinc-400 print:text-zinc-600">
              {title || `${label} prepared for internal review and customer-ready export.`}
            </p>
          </div>
          {status}
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6 print:text-zinc-900">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 print:border-zinc-200 print:bg-zinc-50">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">From</div>
            <div className="mt-3 text-xl font-semibold text-white print:text-zinc-950">
              {siteConfig.legalName}
            </div>
            <div className="mt-3 space-y-1 text-sm text-zinc-400 print:text-zinc-700">
              <div>{siteConfig.address}</div>
              <div>{siteConfig.email}</div>
              <div>{siteConfig.phone}</div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 print:border-zinc-200 print:bg-zinc-50">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Bill To</div>
            <div className="mt-3 text-xl font-semibold text-white print:text-zinc-950">{billToName}</div>
            <div className="mt-3 space-y-1 text-sm text-zinc-400 print:text-zinc-700">
              {billToMeta.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetaTile label="Issued On" value={shortDateFormatter.format(issueDate)} />
          <MetaTile
            label={secondaryDateLabel}
            value={secondaryDateValue ? shortDateFormatter.format(secondaryDateValue) : "Not set"}
          />
          <MetaTile label="Items" value={`${items.length}`} />
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/8 print:border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-zinc-400 print:bg-zinc-50 print:text-zinc-700">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Unit Price</th>
                <th className="px-4 py-3 font-medium">Tax</th>
                <th className="px-4 py-3 font-medium text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/8 text-zinc-200 print:border-zinc-200 print:text-zinc-900"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium text-white print:text-zinc-950">{item.name}</div>
                    {item.description ? (
                      <div className="mt-1 text-xs text-zinc-500 print:text-zinc-600">
                        {item.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">{item.quantity.toFixed(2)}</td>
                  <td className="px-4 py-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-4">{item.taxRate.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 print:border-zinc-200 print:bg-zinc-50">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Notes</div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300 print:text-zinc-700">
              {notes || "No additional notes were added to this document."}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 print:border-zinc-200 print:bg-zinc-50">
            <div className="space-y-3 text-sm text-zinc-300 print:text-zinc-700">
              <TotalRow label="Subtotal" value={formatCurrency(subtotalAmount)} />
              <TotalRow label="Tax" value={formatCurrency(taxAmount)} />
              <TotalRow label="Discount" value={formatCurrency(discountAmount)} />
              <div className="border-t border-white/10 pt-3 print:border-zinc-300">
                <TotalRow
                  label="Grand Total"
                  value={formatCurrency(totalAmount)}
                  emphasized
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 print:border-zinc-200 print:bg-zinc-50">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-white print:text-zinc-950">{value}</div>
    </div>
  );
}

function TotalRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={emphasized ? "font-medium text-white print:text-zinc-950" : ""}>{label}</span>
      <span className={emphasized ? "font-semibold text-white print:text-zinc-950" : ""}>{value}</span>
    </div>
  );
}
