import { notFound } from "next/navigation";

import { CustomerDetailView } from "@/features/customers/components/customer-detail-view";
import { getCustomerDetail } from "@/features/customers/repository";

export const dynamic = "force-dynamic";

export default async function DashboardCustomerDetailPage(
  props: PageProps<"/dashboard/customers/[id]">,
) {
  const { id } = await props.params;
  const customer = await getCustomerDetail(id);

  if (!customer) {
    notFound();
  }

  return <CustomerDetailView customer={customer} />;
}
