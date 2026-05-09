import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/structured-data";
import {
  ServiceTemplatePage,
  getServiceBySlug,
} from "@/components/website/service-template-page";
import { services } from "@/content/website";
import type { ServiceSlug } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
} from "@/lib/structured-data";

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

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: service.href },
          ]),
          buildServiceSchema(service),
          buildFaqSchema(service.faq),
        ]}
      />
      <ServiceTemplatePage service={service} />
    </>
  );
}
