import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ServiceTemplatePage,
  getServiceBySlug,
} from "@/components/website/service-template-page";
import { services } from "@/content/website";
import type { ServiceSlug } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug as ServiceSlug);

  if (!service) {
    return {};
  }

  return buildMetadata({
    title: service.name,
    description: service.seoDescription,
    path: service.href,
  });
}

export default async function ServiceDetailPage(
  props: PageProps<"/services/[slug]">
) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug as ServiceSlug);

  if (!service) {
    notFound();
  }

  return <ServiceTemplatePage service={service} />;
}
