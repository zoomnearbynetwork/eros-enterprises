import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/website/cta-banner";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/website/motion";
import { PageHero } from "@/components/website/page-hero";
import { ProcessSteps } from "@/components/website/process-steps";
import { ProjectCard } from "@/components/website/project-card";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { ServiceCard } from "@/components/website/service-card";
import { StatBlock } from "@/components/website/stat-block";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { WebsiteIcon } from "@/components/website/icon-map";
import {
  featuredProjects,
  heroMetrics,
  homeFaq,
  processSteps,
  serviceCategories,
  testimonialHighlights,
  trustIndicators,
  whyChooseEros,
} from "@/content/website";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
} from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
          ]),
          buildFaqSchema(homeFaq),
          buildItemListSchema(
            "Eros Enterprises service categories",
            serviceCategories.map((service) => ({
              name: service.name,
              path: service.href,
              description: service.summary,
            })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Premium electrical + decorative lighting"
        title="Electrical infrastructure with the poise of a luxury lighting brand."
        description="Eros Enterprises delivers residential wiring, decorative lighting, automation, commercial electrical systems, and long-term maintenance with a premium modern aesthetic."
        stats={heroMetrics}
        actions={
          <>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-amber-300 px-6 font-semibold text-zinc-950 hover:bg-amber-200"
            >
              <Link href="/contact">Request a quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/10 bg-white/6 px-6 text-white hover:bg-white/10"
            >
              <Link href="/services">Explore services</Link>
            </Button>
          </>
        }
      />

      <Section className="pt-8 sm:pt-10">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustIndicators.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
              <WebsiteIcon name="badge" className="size-4 text-amber-200" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="Service categories"
            title="One company for infrastructure, ambience, and support."
            description="The offer is intentionally broad enough to support complete project delivery while staying refined in execution."
            align="center"
          />
        </FadeIn>
        <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {serviceCategories.map((service) => (
            <StaggerItem key={service.href}>
              <ServiceCard {...service} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section className="border-y border-white/10 bg-white/[0.02]">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <SectionHeader
              eyebrow="Why choose Eros"
              title="A stronger answer than generic contractors or generic showroom lighting."
              description="We operate in the space between technical electrical delivery and design-conscious visual quality."
            />
          </FadeIn>
          <div className="grid gap-5">
            {whyChooseEros.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.08}>
                <div className="rounded-[2rem] border border-white/10 bg-white/4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
                    <WebsiteIcon name={item.icon} className="size-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="Project showcase"
            title="Work shaped for homes, retail environments, and operating businesses."
            description="Representative execution types that reflect the quality, coordination, and atmosphere we aim to deliver."
          />
        </FadeIn>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </Section>

      <Section className="border-y border-white/10 bg-white/[0.02]">
        <FadeIn>
          <SectionHeader
            eyebrow="Process workflow"
            title="A measured process from consultation to commissioning."
            description="Clear project flow helps protect workmanship, communication, and long-term maintainability."
            align="center"
          />
        </FadeIn>
        <div className="mt-12">
          <ProcessSteps steps={processSteps} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <FadeIn>
              <SectionHeader
                eyebrow="Testimonials"
                title="What clients say once the site is live."
                description="The strongest signal for this kind of work is repeat trust after the final switch-on."
              />
            </FadeIn>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {heroMetrics.slice(0, 3).map((metric) => (
                <StatBlock key={metric.label} value={metric.value} label={metric.label} />
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            {testimonialHighlights.map((testimonial) => (
              <FadeIn key={testimonial.name}>
                <TestimonialCard {...testimonial} />
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-y border-white/10 bg-white/[0.02]">
        <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <div className="space-y-8">
              <SectionHeader
                eyebrow="FAQ"
                title="Questions clients typically ask before starting."
                description="A few quick answers on delivery scope, support model, and coordination."
              />
              <div className="rounded-[2rem] border border-white/10 bg-white/4 p-6">
                <p className="text-sm leading-7 text-zinc-300">
                  Need a faster answer? Our team can guide the next step for residential, commercial, lighting, or AMC enquiries.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-4 h-auto p-0 text-amber-200 hover:text-amber-100"
                >
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Talk to Eros
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <FaqAccordion items={homeFaq} />
          </FadeIn>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <SectionHeader
            eyebrow="Lead capture"
            title="Start with the form that matches your buying stage."
            description="Whether you need first contact, a site visit, or a full quotation, the flow stays clear and premium."
            align="center"
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          <LeadCaptureForm
            variant="homepageEnquiry"
            sourcePage="/"
            ctaLocation="homepage-lead-capture-enquiry"
          />
          <LeadCaptureForm
            variant="siteVisit"
            sourcePage="/"
            ctaLocation="homepage-lead-capture-site-visit"
          />
          <LeadCaptureForm
            variant="quote"
            sourcePage="/"
            ctaLocation="homepage-lead-capture-quote"
          />
        </div>
        <div className="mt-12">
          <CtaBanner
            title="Ready to scope your electrical or lighting project?"
            description="Bring us in early for better infrastructure planning, stronger ambience, and smoother execution."
          />
        </div>
      </Section>
    </>
  );
}
