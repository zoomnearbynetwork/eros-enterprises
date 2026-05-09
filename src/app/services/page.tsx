import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { FadeIn } from "@/components/website/motion";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { ServiceCard } from "@/components/website/service-card";
import { services, pageMetadata } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.services);

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          buildItemListSchema(
            "Electrical and lighting services",
            services.map((service) => ({
              name: service.name,
              path: service.href,
              description: service.summary,
            })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Services"
        title="Full-spectrum electrical and lighting services for premium spaces."
        description="Our service stack covers residential, commercial, decorative, maintenance, and optimization work so clients can move from concept to support with one coordinated partner."
      />

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="What we deliver"
            title="Specialized services built to work better together."
            description="Each service can stand alone, but the strongest outcomes usually come from coordinated planning across multiple layers."
            align="center"
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              href={service.href}
              name={service.name}
              summary={service.summary}
              icon={service.icon}
            />
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Need help combining the right services into one scope?"
            description="We can help shape the right mix of electrical infrastructure, lighting, control, and support before execution begins."
          />
        </div>
      </Section>
    </>
  );
}
