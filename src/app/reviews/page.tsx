import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { StatBlock } from "@/components/website/stat-block";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { pageMetadata, reviewStats, testimonialHighlights } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildReviewSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.reviews);

export default function ReviewsPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
          buildLocalBusinessSchema(testimonialHighlights),
          ...buildReviewSchema(testimonialHighlights),
        ]}
      />
      <PageHero
        eyebrow="Reviews"
        title="Client confidence built on execution quality and responsiveness."
        description="Strong reviews usually come from how a team behaves under real project pressure. That is the standard we aim to keep."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {reviewStats.map((stat) => (
            <StatBlock key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </div>
        <div className="mt-12">
          <SectionHeader
            eyebrow="Client voices"
            title="Proof that aesthetics and reliability can live in the same project."
            description="A sample of the reactions we want every client experience to earn."
          />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonialHighlights.concat(testimonialHighlights).map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              {...testimonial}
            />
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="See how Eros can support your next project."
            description="If you value finish quality, communication, and dependable delivery, we should talk."
          />
        </div>
      </Section>
    </>
  );
}
