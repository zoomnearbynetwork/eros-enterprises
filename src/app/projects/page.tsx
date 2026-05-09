import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { CtaBanner } from "@/components/website/cta-banner";
import { PageHero } from "@/components/website/page-hero";
import { ProjectCard } from "@/components/website/project-card";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { featuredProjects, pageMetadata } from "@/content/website";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.projects);

export default function ProjectsPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          buildItemListSchema(
            "Selected electrical and lighting projects",
            featuredProjects.map((project) => ({
              name: project.title,
              path: "/projects",
              description: project.description,
            })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Projects"
        title="Selected work that reflects premium execution and site control."
        description="These showcases demonstrate the kind of residential, retail, and commercial environments Eros Enterprises is built to support."
      />
      <Section>
        <SectionHeader
          eyebrow="Project profiles"
          title="Execution stories that combine power planning, lighting, and finish care."
          description="The emphasis is on clarity, ambience, and operational performance rather than volume alone."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredProjects.concat(featuredProjects).map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} {...project} />
          ))}
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Want a project roadmap shaped around your site?"
            description="We can help define scope, sequencing, and the right service mix for a new execution or upgrade."
          />
        </div>
      </Section>
    </>
  );
}
