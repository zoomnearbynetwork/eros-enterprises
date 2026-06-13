import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Lightbulb,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  Zap,
} from "lucide-react";

import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/website/cta-banner";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/website/motion";
import { ProjectCard } from "@/components/website/project-card";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { ServiceCard } from "@/components/website/service-card";
import { StatBlock } from "@/components/website/stat-block";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { WebsiteIcon } from "@/components/website/icon-map";
import {
  blogPosts,
  featuredProjects,
  heroMetrics,
  productCategories,
  services,
  testimonialHighlights,
  whyChooseEros,
} from "@/content/website";
import { siteConfig } from "@/config/site";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/structured-data";

const trustBadges = [
  "Licensed Experts",
  "AMC Support",
  "Smart Automation",
  "Residential & Commercial",
];

const showcaseCards = [
  {
    title: "Interior Glow Systems",
    description: "Cove, pendant, niche, and feature lighting shaped around mood, zoning, and finish quality.",
    tone: "Luxury residences",
  },
  {
    title: "Exterior Presence Lighting",
    description: "Facade, landscape, and gate lighting that extends brand character and curb appeal after sunset.",
    tone: "Villas and premium entries",
  },
  {
    title: "Commercial Experience Lighting",
    description: "Retail and office lighting plans designed to support productivity, visual merchandising, and client confidence.",
    tone: "Showrooms and workspaces",
  },
  {
    title: "Smart Scene Automation",
    description: "Preset moods, scheduled routines, and intuitive controls that make luxury systems actually easy to use.",
    tone: "Integrated control",
  },
];

const valueBlocks = [
  {
    title: "Expert Engineers",
    description: "Execution teams that understand load planning, detailing, and on-site coordination.",
    icon: ShieldCheck,
  },
  {
    title: "Site Inspection First",
    description: "We start with spatial reality, usage patterns, and technical risk before we recommend scope.",
    icon: Sparkles,
  },
  {
    title: "Transparent Pricing",
    description: "Quotes built to reduce ambiguity and create better decision-making for clients and consultants.",
    icon: BadgeCheck,
  },
  {
    title: "Premium Materials",
    description: "Fixtures, controls, and infrastructure components chosen for reliability and long-term finish quality.",
    icon: Lightbulb,
  },
  {
    title: "AMC Support",
    description: "Preventive maintenance and responsive follow-up for properties that need continuity after handover.",
    icon: Zap,
  },
  {
    title: "Automation Specialists",
    description: "Controls and scene logic aligned to how people actually live, work, and host in the space.",
    icon: Workflow,
  },
];

const projectFilters = ["Residential", "Commercial", "Showrooms", "Smart Automation"];

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([{ name: "Home", path: "/" }]),
          buildItemListSchema(
            "Eros Enterprises services",
            services.map((service) => ({
              name: service.name,
              path: service.href,
              description: service.summary,
            })),
          ),
        ]}
      />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <LightingShowcaseSection />
      <WhyChooseSection />
      <ProjectsSection />
      <LeadSection />
      <ReviewsSection />
      <InsightsSection />
      <FinalCtaSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-3 pt-6 sm:px-5 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="premium-card-strong relative overflow-hidden rounded-[2.25rem]">
          <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
          <div className="site-grid absolute inset-0 opacity-[0.08]" />
          <div className="absolute -left-12 top-14 size-44 rounded-full bg-[#007BFF]/18 blur-3xl" />
          <div className="absolute right-0 top-8 size-52 rounded-full bg-[#F4A300]/16 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFCC33]/80 to-transparent" />

          <div className="relative grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-14">
            <FadeIn className="space-y-8">
              <div className="space-y-5">
                <div className="premium-chip inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.3em] uppercase">
                  Lighting with Purpose
                </div>
                <h1 className="max-w-4xl font-heading text-5xl leading-[0.96] font-semibold tracking-[-0.05em] text-[color:var(--foreground)] sm:text-6xl lg:text-[4.7rem]">
                  Premium decorative lighting and smart electrical solutions.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)] sm:text-lg">
                  EROS Enterprises designs, installs, and supports luxury lighting, automation, electrical infrastructure, and maintenance systems for residential and commercial spaces that need to feel elevated from day one.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-[linear-gradient(135deg,#0047B3,#00A6FF)] px-7 text-base font-semibold text-white shadow-[0_18px_44px_rgba(0,123,255,0.24)]"
                >
                  <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2">
                    Call Now
                    <PhoneCall className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-7 text-base text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
                >
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    className="inline-flex items-center gap-2"
                  >
                    WhatsApp
                    <MessageCircle className="size-4 text-[#F4A300]" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] px-7 text-base font-semibold text-[#06111F] shadow-[0_18px_44px_rgba(244,163,0,0.24)]"
                >
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Get Free Quote
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {trustBadges.map((item) => (
                  <div
                    key={item}
                    className="premium-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  >
                    <BadgeCheck className="size-4 text-[#F4A300]" />
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="premium-card relative overflow-hidden rounded-[2rem] p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,204,51,0.18),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(0,166,255,0.18),transparent_22%)]" />
                  <Image
                    src="/logo.png"
                    alt="EROS Enterprises logo"
                    width={560}
                    height={320}
                    className="relative h-auto w-full object-contain"
                    priority
                  />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <FloatingMetric label="Licensed Experts" value="12+ years" />
                    <FloatingMetric label="AMC Support" value="24/7 care" />
                    <FloatingMetric label="Automation" value="Scene-ready" />
                    <FloatingMetric label="Execution" value="End-to-end" />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="premium-card rounded-[1.6rem] p-5">
                    <p className="text-[11px] font-semibold tracking-[0.3em] text-[color:var(--muted-foreground)] uppercase">
                      Smart control
                    </p>
                    <div className="mt-4 grid gap-3">
                      {[
                        ["Ambient scene", "72%"],
                        ["Facade lighting", "88%"],
                        ["Security routing", "Optimized"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-[1.1rem] border border-[color:var(--border)] bg-[color:var(--surface-accent)] px-4 py-3"
                        >
                          <span className="text-sm text-[color:var(--muted-foreground)]">{label}</span>
                          <span className="text-sm font-semibold text-[color:var(--foreground)]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#0047B3,#00A6FF_55%,#F4A300)] p-[1px] shadow-[0_24px_55px_rgba(0,123,255,0.18)]">
                    <div className="rounded-[1.55rem] bg-[color:var(--background)]/92 p-5">
                      <p className="text-[11px] font-semibold tracking-[0.3em] text-[color:var(--muted-foreground)] uppercase">
                        Signature promise
                      </p>
                      <h2 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
                        Luxury presentation. Disciplined engineering.
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                        Every EROS project is planned to make the space look exceptional and operate reliably long after installation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-accent)] px-4 py-3">
      <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--muted-foreground)] uppercase">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{value}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <Section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {heroMetrics.map((metric) => (
          <StatBlock key={metric.label} value={metric.value} label={metric.label} />
        ))}
      </div>
    </Section>
  );
}

function ServicesSection() {
  return (
    <Section className="surface-divider">
      <SectionHeader
        eyebrow="Services"
        title="A premium electrical and lighting stack built to convert enquiries into serious projects."
        description="From decorative lighting and smart automation to core electrical systems and AMC support, every service is positioned around trust, finish quality, and operational confidence."
      />
      <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {services.slice(0, 8).map((service) => (
          <StaggerItem key={service.slug}>
            <ServiceCard
              href={service.href}
              name={service.name}
              summary={service.summary}
              icon={service.icon}
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

function LightingShowcaseSection() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <SectionHeader
          eyebrow="Lighting Showcase"
          title="Interior, exterior, commercial, and smart lighting concepts presented like a luxury showroom."
          description="We do not have site photography in the repo yet, so the section is built as a polished, image-ready showcase system that can accept future project visuals without redesign."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {showcaseCards.map((card, index) => (
            <div
              key={card.title}
              className="premium-card relative overflow-hidden rounded-[1.8rem] p-5"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    index % 2 === 0
                      ? "radial-gradient(circle at 18% 18%, rgba(255, 204, 51, 0.18), transparent 22%), linear-gradient(140deg, rgba(6, 17, 31, 0.9), rgba(16, 43, 70, 0.72))"
                      : "radial-gradient(circle at 82% 18%, rgba(0, 166, 255, 0.18), transparent 22%), linear-gradient(140deg, rgba(16, 43, 70, 0.82), rgba(6, 17, 31, 0.96))",
                }}
              />
              <div className="relative">
                <div className="mb-8 h-44 rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_80%_70%,rgba(255,204,51,0.18),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                <div className="text-[11px] font-semibold tracking-[0.28em] text-white/68 uppercase">
                  {card.tone}
                </div>
                <h3 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em] text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function WhyChooseSection() {
  return (
    <Section className="surface-divider">
      <SectionHeader
        eyebrow="Why Choose EROS"
        title="The difference is not only what gets installed. It is how the project feels before, during, and after delivery."
        description="We pair expert engineering with premium presentation so clients get cleaner planning, stronger confidence, and better on-site outcomes."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {valueBlocks.map((item) => (
          <div key={item.title} className="premium-card rounded-[1.8rem] p-6">
            <div className="flex size-14 items-center justify-center rounded-[1.15rem] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(0,123,255,0.14),rgba(255,204,51,0.14))]">
              <item.icon className="size-6 text-[#F4A300]" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {whyChooseEros.map((item) => (
          <div key={item.title} className="premium-card rounded-[1.8rem] p-6">
            <WebsiteIcon name={item.icon} className="size-6 text-[#007BFF]" />
            <h3 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Projects Showcase"
        title="Luxury project storytelling designed to build trust before the first site call."
        description="The portfolio cards are framed to feel like a premium case-study wall, with room for real project photography and category-based filtering as the library grows."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        {projectFilters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={
              index === 0
                ? "rounded-full bg-[linear-gradient(135deg,#0047B3,#00A6FF)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(0,123,255,0.2)]"
                : "premium-chip rounded-full px-4 py-2 text-sm font-semibold"
            }
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </Section>
  );
}

function LeadSection() {
  return (
    <Section className="surface-divider">
      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Free Consultation"
            title="A conversion-focused enquiry experience for premium clients."
            description="Use the short form to request a quote, site visit, or consultation. We pair the form with direct WhatsApp and phone actions so enquiries can convert however the client is most comfortable."
          />
          <div className="premium-card rounded-[1.9rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <QuickAction
                href={`https://wa.me/${siteConfig.whatsapp}`}
                icon={MessageCircle}
                label="WhatsApp instantly"
                value="Fast project response"
                accent="text-[#F4A300]"
              />
              <QuickAction
                href={`tel:${siteConfig.phone}`}
                icon={PhoneCall}
                label="Call expert team"
                value={siteConfig.phone}
                accent="text-[#007BFF]"
              />
            </div>
          </div>
        </div>
        <LeadCaptureForm
          variant="homepageEnquiry"
          sourcePage="/"
          ctaLocation="homepage-premium-lead-section"
        />
      </div>
    </Section>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  value,
  accent,
}: {
  href: string;
  icon: typeof PhoneCall;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      className="theme-transition rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-accent)] px-4 py-4 hover:shadow-[var(--shadow-soft)]"
    >
      <Icon className={`size-5 ${accent}`} />
      <div className="mt-3 text-sm font-semibold text-[color:var(--foreground)]">{label}</div>
      <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">{value}</div>
    </a>
  );
}

function ReviewsSection() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Client Reviews"
        title="Trust signals shaped like a premium hospitality brand, not a generic contractor website."
        description="Testimonials are displayed as conversion tools: clear praise, visual polish, and enough detail to reassure higher-intent buyers."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {testimonialHighlights.map((testimonial) => (
          <div key={testimonial.name} className="space-y-3">
            <TestimonialCard {...testimonial} />
            <div className="flex gap-1 pl-2 text-[#F4A300]">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function InsightsSection() {
  return (
    <Section className="surface-divider">
      <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
        <SectionHeader
          eyebrow="Insights"
          title="SEO-friendly editorial previews with the same premium brand language."
          description="These cards can later connect to a CMS, but they already work as high-end knowledge panels that reinforce EROS expertise."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Link
              key={post.title}
              href={post.href}
              className="premium-card theme-transition rounded-[1.8rem] p-6 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
            >
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[#007BFF] uppercase">
                Insight 0{index + 1}
              </div>
              <h3 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {productCategories.map((category) => (
          <div key={category.title} className="premium-card rounded-[1.6rem] p-5">
            <div className="text-[11px] font-semibold tracking-[0.28em] text-[#F4A300] uppercase">
              Product Ecosystem
            </div>
            <h3 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
              {category.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FinalCtaSection() {
  return (
    <Section>
      <CtaBanner
        title="Transform your space with premium lighting solutions."
        description="Request a site visit, talk to the expert team, or move directly into a quotation conversation with EROS Enterprises."
        primaryLabel="Request Site Visit"
        secondaryLabel="Call Expert Team"
        secondaryHref="/contact"
      />
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
        <div className="inline-flex items-center gap-2">
          <Building2 className="size-4 text-[#007BFF]" />
          Residential and commercial execution
        </div>
        <div className="inline-flex items-center gap-2">
          <Workflow className="size-4 text-[#F4A300]" />
          Smart automation expertise
        </div>
        <div className="inline-flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#007BFF]" />
          AMC-backed support continuity
        </div>
      </div>
    </Section>
  );
}
