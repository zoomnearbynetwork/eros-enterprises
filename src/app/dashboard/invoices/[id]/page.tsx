import { notFound } from "next/navigation";

import { InvoiceDetailView } from "@/features/billing/components/invoice-detail-view";
import { getBillingOptions, getInvoiceDetail } from "@/features/billing/repository";

export const dynamic = "force-dynamic";

export default async function DashboardInvoiceDetailPage(
  props: PageProps<"/dashboard/invoices/[id]">,
) {
  const { id } = await props.params;
  const [invoice, options] = await Promise.all([
    getInvoiceDetail(id),
    getBillingOptions(),
  ]);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailView invoice={invoice} options={options} />;
}
