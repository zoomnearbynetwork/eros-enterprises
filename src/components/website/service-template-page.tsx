import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/website/cta-banner";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/website/motion";
import { PageHero } from "@/components/website/page-hero";
import { PainPoints } from "@/components/website/pain-points";
import { ProcessSteps } from "@/components/website/process-steps";
import { ProjectCard } from "@/components/website/project-card";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { ServiceCard } from "@/components/website/service-card";
import { WebsiteIcon } from "@/components/website/icon-map";
import { servicesBySlug } from "@/content/website";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import type { ServiceDefinition, ServiceSlug } from "@/content/website";

export function ServiceTemplatePage({ service }: { service: ServiceDefinition }) {
  const relatedServices = service.relatedServices.map(
    (slug) => servicesBySlug[slug]
  );

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.heroTitle}
        description={service.heroDescription}
        stats={service.heroStats}
        actions={
          <>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-amber-300 px-6 font-semibold text-zinc-950 hover:bg-amber-200"
            >
              <Link href="/contact">Request this service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/10 bg-white/6 px-6 text-white hover:bg-white/10"
            >
              <Link href="/services">View all services</Link>
            </Button>
          </>
        }
        aside={
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
              <WebsiteIcon name={service.icon} className="size-7" />
            </div>
            <h2 className="mt-6 font-heading text-3xl font-medium text-white">
              {service.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {service.summary}
            </p>
            <div className="mt-6 space-y-3">
              {service.highlights.slice(0, 3).map((highlight) => (
                <div
                  key={highlight}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                >
                  <WebsiteIcon name="badge" className="mt-0.5 size-4 text-amber-200" />
                  <p className="text-sm leading-7 text-zinc-300">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="Pain points"
            title="What this service is designed to solve"
            description="We focus on the on-site issues that create risk, visual compromise, or operational friction."
          />
        </FadeIn>
        <div className="mt-10">
          <PainPoints items={service.painPoints} />
        </div>
      </Section>

      <Section className="border-y border-white/10 bg-white/[0.02]">
        <FadeIn>
          <SectionHeader
            eyebrow="Highlights"
            title="What Eros brings into the execution"
            description="The outcome is not just installation work. It is a cleaner, more usable, more premium operating environment."
          />
        </FadeIn>
        <StaggerGroup className="mt-10 grid gap-4 lg:grid-cols-2">
          {service.highlights.map((highlight) => (
            <StaggerItem key={highlight}>
              <div className="flex h-full gap-4 rounded-[2rem] border border-white/10 bg-white/4 p-6">
                <WebsiteIcon name="badge" className="mt-1 size-5 text-amber-200" />
                <p className="text-sm leading-7 text-zinc-300">{highlight}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="Process"
            title="A delivery path that stays clear from planning to handover"
            description="Every service follows a structured sequence that protects both quality and communication."
          />
        </FadeIn>
        <div className="mt-10">
          <ProcessSteps
            steps={service.process.map((step, index) => ({
              step: `0${index + 1}`,
              title: step,
              description:
                "Planned with precision so the final installation is easier to manage, expand, and maintain.",
            }))}
          />
        </div>
      </Section>

      <Section className="border-y border-white/10 bg-white/[0.02]">
        <FadeIn>
          <SectionHeader
            eyebrow="Project examples"
            title="Representative ways this service shows up on real sites"
            description="Sample scenarios that reflect the type of environments we support."
          />
        </FadeIn>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {service.examples.map((example) => (
            <ProjectCard key={example.title} {...example} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <FadeIn>
              <SectionHeader
                eyebrow="FAQ"
                title="Answers before your project starts"
                description="A few practical questions clients often ask about this service."
              />
            </FadeIn>
            <div className="mt-8">
              <LeadCaptureForm
                variant="serviceCta"
                sourcePage={service.href}
                ctaLocation={`service-page-${service.slug}-quote-form`}
                defaultServiceInterest={service.name}
              />
            </div>
          </div>
          <FadeIn delay={0.1}>
            <FaqAccordion items={service.faq} />
          </FadeIn>
        </div>
      </Section>

      <Section className="border-t border-white/10">
        <FadeIn>
          <SectionHeader
            eyebrow="Related services"
            title="Build a more complete project scope"
            description="Many clients combine this service with adjacent electrical, lighting, or support work."
          />
        </FadeIn>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {relatedServices.map((related) => (
            <ServiceCard
              key={related.slug}
              href={related.href}
              name={related.name}
              summary={related.summary}
              icon={related.icon}
            />
          ))}
        </div>
        <div className="mt-10">
          <CtaBanner
            title={`Discuss ${service.shortName.toLowerCase()} for your site.`}
            description="We can help shape the right next step whether you need a quotation, a site assessment, or a wider project roadmap."
            primaryLabel="Talk to Eros"
            secondaryLabel="See contact options"
          />
        </div>
      </Section>
    </>
  );
}

export function getServiceBySlug(slug: ServiceSlug) {
  return servicesBySlug[slug];
}
