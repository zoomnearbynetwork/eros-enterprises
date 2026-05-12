import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileText,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Star,
} from "lucide-react";

import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/website/cta-banner";
import { ProjectCard } from "@/components/website/project-card";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { ServiceCard } from "@/components/website/service-card";
import { StatBlock } from "@/components/website/stat-block";
import { TestimonialCard } from "@/components/website/testimonial-card";
import {
  blogPosts,
  featuredProjects,
  heroMetrics,
  processSteps,
  productCategories,
  services,
  testimonialHighlights,
  whyChooseEros,
} from "@/content/website";
import { siteConfig } from "@/config/site";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/structured-data";

const trustChips = [
  "Decorative Lighting",
  "Security Systems",
  "Smart Automation",
  "AMC Support",
];

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
      <Hero />
      <ServicesSection />
      <ProductsSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <AboutSection />
      <ProjectsSection />
      <ReviewsSection />
      <BlogSection />
      <LeadSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-3 pt-6 sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(7,17,31,0.96)_46%,rgba(2,6,23,0.98))] px-6 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.36)] sm:px-8 lg:px-10 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(0,152,255,0.24),transparent_18%),radial-gradient(circle_at_82%_14%,rgba(246,177,26,0.26),transparent_18%),radial-gradient(circle_at_58%_70%,rgba(0,91,207,0.18),transparent_24%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:78px_78px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/80 to-transparent" />
          <div className="absolute left-1/2 top-28 h-48 w-[112%] -translate-x-1/2 rotate-[-7deg] bg-[linear-gradient(90deg,transparent,rgba(246,177,26,0.08),rgba(255,138,0,0.22),rgba(0,152,255,0.12),transparent)] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#f6b11a]/20 bg-[linear-gradient(135deg,rgba(246,177,26,0.14),rgba(0,152,255,0.1))] px-4 py-2 text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8] uppercase">
                <ShieldCheck className="size-4 text-[#f6b11a]" />
                Premium decorative lighting + security automation
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl font-heading text-4xl leading-[1] font-medium text-white sm:text-5xl lg:text-7xl">
                  Premium Decorative Lighting & Security Automation Solutions
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#fff6d8]/76 sm:text-lg">
                  Design, installation, maintenance, and AMC support for homes,
                  villas, offices, retail spaces, and premium commercial environments.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-6 font-semibold text-[#07111f] shadow-[0_12px_34px_rgba(246,177,26,0.3)]"
                >
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Book Free Site Visit
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[#0098ff]/34 bg-[#0098ff]/10 px-6 text-white hover:bg-[#0098ff]/18"
                >
                  <Link href="/services">Explore Services</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/12 bg-white/6 px-6 text-white hover:bg-white/10"
                >
                  <a href={`https://wa.me/${siteConfig.whatsapp}`}>
                    WhatsApp {siteConfig.phone.replace("+91 ", "")}
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {trustChips.map((chip) => (
                  <div
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-[#fff6d8]"
                  >
                    <BadgeCheck className="size-4 text-[#f6b11a]" />
                    {chip}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="font-heading text-3xl font-medium text-[#f6b11a]">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[#fff6d8]/68">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.42))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(246,177,26,0.34),transparent_20%),radial-gradient(circle_at_74%_70%,rgba(0,152,255,0.26),transparent_28%)]" />
      <div className="absolute inset-x-8 top-8 h-24 rounded-full border-t border-[#f6b11a]/60 shadow-[0_-24px_60px_rgba(246,177,26,0.38)]" />
      <div className="absolute left-1/2 top-18 h-52 w-1 -translate-x-1/2 bg-gradient-to-b from-[#f6b11a] to-transparent" />
      <div className="absolute left-1/2 top-40 size-36 -translate-x-1/2 rounded-full border border-[#f6b11a]/36 bg-[#ff8a00]/18 shadow-[0_0_90px_rgba(255,138,0,0.56)]" />
      <div className="absolute left-10 right-10 top-28 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

      <div className="absolute bottom-6 left-6 right-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Decorative Lighting", "Golden ambience with layered scenes"],
          ["Security Systems", "Coverage-led planning with cleaner routing"],
          ["Smart Automation", "Centralized control built for daily ease"],
        ].map(([title, copy]) => (
          <div
            key={title}
            className="rounded-[1.5rem] border border-white/10 bg-[#020617]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-2 text-xs leading-6 text-[#fff6d8]/68">{copy}</div>
            <div className="mt-4 h-1.5 rounded-full bg-gradient-to-r from-[#f6b11a] via-[#ff8a00] to-[#0098ff]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <Section className="bg-[#fffaf0] text-[#07111f]">
      <SectionHeader
        eyebrow="Services"
        title="Lighting, wiring, security, and maintenance delivered under one premium execution team."
        description="Each service is positioned around the client outcome that matters most: safer infrastructure, richer ambience, more reliable control, and smoother long-term support."
        theme="light"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
    </Section>
  );
}

function ProductsSection() {
  return (
    <Section className="bg-transparent">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(2,6,23,0.9),rgba(7,17,31,0.92)_50%,rgba(2,6,23,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
        <SectionHeader
          eyebrow="Products"
          title="Premium product ecosystems selected for ambience, control, and long-term reliability."
          description="The product side stays curated rather than catalogue-heavy, so every category supports a more polished project outcome."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {productCategories.map((category) => (
            <Card
              key={category.title}
              className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.4))] py-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <CardContent className="p-6">
                <div className="inline-flex rounded-full border border-[#0098ff]/18 bg-[#0098ff]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#fff6d8] uppercase">
                  Product category
                </div>
                <h3 className="mt-5 font-heading text-3xl font-medium">
                  {category.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#fff6d8]/72">
                  {category.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f6b11a]">
                  Get Quote
                  <ArrowRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function WhyChooseSection() {
  return (
    <Section className="bg-[#fff4dc] text-[#07111f]">
      <SectionHeader
        eyebrow="Why Choose Eros"
        title="A premium partner for spaces where finish quality and technical reliability both matter."
        description="The difference is not just what gets installed. It is how the scope is planned, how the site is handled, and how usable the result feels after handover."
        theme="light"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {whyChooseEros.map((item) => (
          <Card
            key={item.title}
            className="rounded-[1.8rem] border border-[#f6b11a]/18 bg-white/85 py-0 text-[#07111f] shadow-[0_22px_70px_rgba(7,17,31,0.1)]"
          >
            <CardContent className="p-6">
              <div className="inline-flex size-14 items-center justify-center rounded-[1.15rem] border border-[#f6b11a]/18 bg-[linear-gradient(135deg,rgba(246,177,26,0.16),rgba(0,152,255,0.12))] text-[#005bcf]">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="mt-5 font-heading text-3xl font-medium">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section className="bg-[#fffaf0] text-[#07111f]">
      <SectionHeader
        eyebrow="How It Works"
        title="A clear sales path from first enquiry to handover and long-term support."
        description="Simple for the client, organized behind the scenes, and built to move quickly once the project scope is clear."
        theme="light"
      />
      <div className="mt-10 grid gap-4 xl:grid-cols-4">
        {processSteps.map((step) => (
          <Card
            key={step.step}
            className="rounded-[1.7rem] border border-[#f6b11a]/16 bg-white py-0 text-[#07111f] shadow-[0_18px_60px_rgba(7,17,31,0.08)]"
          >
            <CardContent className="p-6">
              <div className="text-sm font-semibold tracking-[0.2em] text-[#ff8a00] uppercase">
                {step.step}
              </div>
              <h3 className="mt-4 font-heading text-2xl font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function AboutSection() {
  return (
    <Section className="bg-transparent">
      <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="About Eros"
            title="Premium electrical craftsmanship with decorative lighting showroom sensibility."
            description="Eros Enterprises helps homeowners, architects, facility teams, and business owners bring together electrical infrastructure, lighting mood, automation, security, and maintenance in one accountable workflow."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {heroMetrics.map((metric) => (
              <StatBlock key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
          <Button
            asChild
            className="h-12 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-6 font-semibold text-[#07111f]"
          >
            <Link href="/about">Know Eros Enterprises</Link>
          </Button>
        </div>

        <Card className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04)_46%,rgba(2,6,23,0.42))] py-0 text-white shadow-[0_28px_90px_rgba(0,0,0,0.26)]">
          <CardContent className="grid gap-4 p-6 sm:p-8">
            {[
              "Technical planning that respects design intent and material finishes.",
              "Stronger coordination between decorative lighting, panels, controls, and site teams.",
              "A premium brand experience from quotation clarity to post-install support.",
            ].map((point) => (
              <div
                key={point}
                className="flex gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
              >
                <BadgeCheck className="mt-1 size-4 text-[#f6b11a]" />
                <p className="text-sm leading-7 text-[#fff6d8]/76">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section className="bg-[#fff4dc] text-[#07111f]">
      <SectionHeader
        eyebrow="Projects"
        title="Portfolio previews across luxury homes, offices, and commercial environments."
        description="The work is positioned to sell confidence: better finish control, cleaner coordination, and more premium ambience once the systems go live."
        theme="light"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
      <div className="mt-10">
        <CtaBanner
          title="Want a site plan shaped around your actual project?"
          description="We can help define the right electrical, lighting, security, and automation mix before execution starts."
          primaryLabel="Book Free Site Visit"
          secondaryLabel="Explore Projects"
          secondaryHref="/projects"
        />
      </div>
    </Section>
  );
}

function ReviewsSection() {
  return (
    <Section className="bg-transparent">
      <SectionHeader
        eyebrow="Reviews"
        title="Trusted by clients who need spaces to look refined and work reliably."
        description="Great reviews usually come from strong communication, tight execution, and a final result that feels worth the investment."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {testimonialHighlights.map((testimonial) => (
          <div key={testimonial.name} className="space-y-3">
            <TestimonialCard {...testimonial} />
            <div className="flex gap-1 pl-2 text-[#f6b11a]">
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

function BlogSection() {
  return (
    <Section className="bg-[#fffaf0] text-[#07111f]">
      <SectionHeader
        eyebrow="Blog Preview"
        title="Practical insights before you invest in lighting, wiring, security, or AMC."
        description="The blog preview keeps the same premium visual system while reinforcing expertise and helping hesitant buyers move forward."
        theme="light"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.title} href={post.href} className="group block h-full">
            <Card className="h-full rounded-[1.7rem] border border-[#f6b11a]/16 bg-white py-0 text-[#07111f] shadow-[0_18px_60px_rgba(7,17,31,0.08)] transition hover:-translate-y-1 hover:border-[#0098ff]/24">
              <CardContent className="p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] border border-[#0098ff]/18 bg-[linear-gradient(135deg,rgba(0,152,255,0.12),rgba(246,177,26,0.12))] text-[#005bcf]">
                  <FileText className="size-6" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-medium leading-snug">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#005bcf]">
                  Read insight
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function LeadSection() {
  return (
    <Section className="bg-transparent pt-0">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(2,6,23,0.92),rgba(7,17,31,0.95)_54%,rgba(2,6,23,0.98))] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#f6b11a]/20 bg-[linear-gradient(135deg,rgba(246,177,26,0.14),rgba(0,152,255,0.1))] px-4 py-2 text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8] uppercase">
              <MessageCircle className="size-4 text-[#f6b11a]" />
              Contact CTA
            </div>
            <h2 className="font-heading text-4xl leading-[1.04] font-medium text-white sm:text-5xl">
              Need lighting or security work? Get a free site visit today.
            </h2>
            <p className="text-base leading-8 text-[#fff6d8]/76">
              Share your requirement and we will help you plan the right next step for
              decorative lighting, security systems, electrical upgrades, automation,
              or AMC support.
            </p>

            <div className="grid gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                className="inline-flex items-center gap-3 rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-4 text-[#fff6d8] hover:bg-white/8"
              >
                <MessageCircle className="size-5 text-[#f6b11a]" />
                WhatsApp quick action
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-3 rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-4 text-[#fff6d8] hover:bg-white/8"
              >
                <PhoneCall className="size-5 text-[#0098ff]" />
                Phone quick action
              </a>
            </div>
          </div>

          <LeadCaptureForm
            variant="siteVisit"
            sourcePage="/"
            ctaLocation="homepage-contact-cta"
          />
        </div>
      </div>
    </Section>
  );
}
