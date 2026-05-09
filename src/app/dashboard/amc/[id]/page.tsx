import { notFound } from "next/navigation";

import { AmcDetailView } from "@/features/projects/components/amc-detail-view";
import { getAmcDetail } from "@/features/projects/repository";

export const dynamic = "force-dynamic";

export default async function DashboardAmcDetailPage(
  props: PageProps<"/dashboard/amc/[id]">,
) {
  const { id } = await props.params;
  const plan = await getAmcDetail(id);

  if (!plan) {
    notFound();
  }

  return <AmcDetailView plan={plan} />;
}
