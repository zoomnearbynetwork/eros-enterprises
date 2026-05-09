import { notFound } from "next/navigation";

import { getAssignableUsers } from "@/features/crm/repository";
import { SiteVisitDetailView } from "@/features/site-visits/components/site-visit-detail-view";
import { getSiteVisitDetail } from "@/features/site-visits/repository";

export const dynamic = "force-dynamic";

export default async function DashboardSiteVisitDetailPage(
  props: PageProps<"/dashboard/site-visits/[id]">,
) {
  const { id } = await props.params;
  const [siteVisit, assignableUsers] = await Promise.all([
    getSiteVisitDetail(id),
    getAssignableUsers(),
  ]);

  if (!siteVisit) {
    notFound();
  }

  return (
    <SiteVisitDetailView
      siteVisit={siteVisit}
      engineerUsers={assignableUsers.engineerUsers}
    />
  );
}
