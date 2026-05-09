import { notFound } from "next/navigation";

import { getAssignableUsers } from "@/features/crm/repository";
import { LeadDetailView } from "@/features/leads/components/lead-detail-view";
import { getLeadDetail } from "@/features/leads/repository";

export const dynamic = "force-dynamic";

export default async function DashboardLeadDetailPage(
  props: PageProps<"/dashboard/leads/[leadId]">,
) {
  const { leadId } = await props.params;
  const [lead, assignableUsers] = await Promise.all([
    getLeadDetail(leadId),
    getAssignableUsers(),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <LeadDetailView
      lead={lead}
      salesUsers={assignableUsers.salesUsers}
      engineerUsers={assignableUsers.engineerUsers}
    />
  );
}
