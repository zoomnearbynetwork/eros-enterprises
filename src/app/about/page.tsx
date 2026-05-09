import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { StatBlock } from "@/components/website/stat-block";
import { heroMetrics, pageMetadata, whyChooseEros } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.about);

export default function AboutPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About"
        title="An electrical company shaped by technical discipline and visual sensibility."
        description="Eros Enterprises was built to serve clients who need more than functional execution. Our work is grounded in reliability, but it is equally attentive to atmosphere, material quality, and long-term usability."
      />
      <Section>
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Our point of view"
            title="We believe electrical work should disappear into confidence, not into compromise."
            description="That means better planning, cleaner detailing, stronger coordination, and a finish standard that feels intentional."
          />
          <div className="grid gap-5">
            {whyChooseEros.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/4 p-6"
              >
                <h3 className="font-heading text-2xl font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {heroMetrics.map((metric) => (
            <StatBlock key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Bring Eros into the project early."
            description="The earlier we can shape electrical and lighting decisions, the stronger the final result tends to be."
          />
        </div>
      </Section>
    </>
  );
}
