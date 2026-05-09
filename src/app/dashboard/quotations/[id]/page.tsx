import { notFound } from "next/navigation";

import { QuotationDetailView } from "@/features/billing/components/quotation-detail-view";
import { getBillingOptions, getQuotationDetail } from "@/features/billing/repository";

export const dynamic = "force-dynamic";

export default async function DashboardQuotationDetailPage(
  props: PageProps<"/dashboard/quotations/[id]">,
) {
  const { id } = await props.params;
  const [quotation, options] = await Promise.all([
    getQuotationDetail(id),
    getBillingOptions(),
  ]);

  if (!quotation) {
    notFound();
  }

  return <QuotationDetailView quotation={quotation} options={options} />;
}
