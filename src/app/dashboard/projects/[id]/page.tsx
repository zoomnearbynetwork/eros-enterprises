import { notFound } from "next/navigation";

import { ProjectDetailView } from "@/features/projects/components/project-detail-view";
import {
  getProjectDetail,
  getProjectManagementOptions,
} from "@/features/projects/repository";

export const dynamic = "force-dynamic";

export default async function DashboardProjectDetailPage(
  props: PageProps<"/dashboard/projects/[id]">,
) {
  const { id } = await props.params;
  const [project, options] = await Promise.all([
    getProjectDetail(id),
    getProjectManagementOptions(),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} options={options} />;
}
