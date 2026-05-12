import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cable,
  Camera,
  CheckCircle2,
  Cpu,
  FileText,
  Gauge,
  House,
  Lightbulb,
  MessageCircle,
  PanelTop,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/structured-data";

const services = [
  {
    name: "Residential Wiring",
    href: "/services/residential-wiring",
    icon: House,
    copy: "Clean, concealed wiring planned around premium interiors, safety, and future automation.",
  },
  {
    name: "Decorative Lighting",
    href: "/services/decorative-lighting",
    icon: Lightbulb,
    copy: "Layered cove, facade, landscape, chandelier, and feature lighting that gives spaces presence.",
  },
  {
    name: "Smart Automation",
    href: "/services/smart-automation",
    icon: Cpu,
    copy: "Scene controls, scheduling, and smart upgrades that feel simple for homes and offices.",
  },
  {
    name: "Commercial Electrical",
    href: "/services/commercial-electrical",
    icon: Building2,
    copy: "Reliable fit-out, workstation, utility, and lighting distribution for active business spaces.",
  },
  {
    name: "Panels",
    href: "/services/electrical-panels",
    icon: PanelTop,
    copy: "Panel planning, upgrades, labeling, and protection for easier service and safer loads.",
  },
  {
    name: "Cable Systems",
    href: "/services/cable-systems",
    icon: Cable,
    copy: "Structured cable routes that keep complex sites neat, scalable, and maintenance-ready.",
  },
  {
    name: "AMC",
    href: "/services/amc-services",
    icon: Wrench,
    copy: "Preventive maintenance and priority support for properties that need dependable uptime.",
  },
  {
    name: "Energy Optimization",
    href: "/services/energy-optimization",
    icon: Gauge,
    copy: "Lighting and control improvements that reduce waste without flattening ambience.",
  },
];

const products = [
  ["Decorative Lighting", "Chandeliers, cove lighting, facade lights, pendants, profile lights.", Lightbulb],
  ["Security Systems", "Integrated intrusion, access, and safety layers for homes and businesses.", ShieldCheck],
  ["CCTV", "Camera planning, coverage guidance, cabling, and reliable installation.", Camera],
  ["Smart Switches", "Modern touch, modular, and automation-ready switching experiences.", Zap],
  ["Automation Devices", "Scene controllers, schedules, sensors, and centralized control hardware.", Cpu],
  ["Cable & Panel Accessories", "Distribution, routing, labeling, and long-life infrastructure components.", Cable],
] as const;

const process = [
  ["01", "Enquiry", "Tell us the space, scope, and urgency."],
  ["02", "Site Visit", "We inspect load, layout, finish, and access."],
  ["03", "Quotation", "You receive a clear scope and material plan."],
  ["04", "Installation", "Our team executes with neat site discipline."],
  ["05", "AMC Support", "We stay available for upkeep and upgrades."],
];

const projects = [
  ["Villa Lighting Suite", "Decorative Lighting", "Warm cove, landscape, facade, and chandelier layers for a luxury residence."],
  ["Office Security Upgrade", "Security + CCTV", "Coverage-led camera and control planning for a busy commercial floor."],
  ["Retail Automation Refresh", "Smart Automation", "Scene-based lighting controls for opening, display, evening, and closing modes."],
];

const reviews = [
  ["Rohan Mehta", "The team handled lighting and electrical execution with the polish we wanted and the discipline the site needed."],
  ["Anika Shah", "Our home feels completely different after the lighting work. Warm, premium, and still practical."],
  ["Karan Desai", "Clear quotation, fast communication, and reliable post-install support. That made the project easy to trust."],
];

const blogPosts = [
  ["How premium lighting changes the perceived value of a space", "/blog#premium-lighting-value"],
  ["Electrical planning mistakes that increase retrofit costs", "/blog#electrical-planning-mistakes"],
  ["What to include in an electrical AMC for business continuity", "/blog#electrical-amc-business-continuity"],
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
              description: service.copy,
            })),
          ),
        ]}
      />
      <Hero />
      <ServiceGrid />
      <ProductGrid />
      <WhyChoose />
      <HowItWorks />
      <AboutPreview />
      <ProjectPreview />
      <ReviewsPreview />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#020617] pt-28 text-white sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(0,152,255,0.32),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(246,177,26,0.24),transparent_26%),linear-gradient(135deg,#020617_0%,#07111f_48%,#020617_100%)]" />
      <div className="absolute left-1/2 top-32 -z-10 h-52 w-[120vw] -translate-x-1/2 rotate-[-7deg] bg-[linear-gradient(90deg,transparent,rgba(246,177,26,0.12),rgba(255,138,0,0.24),rgba(0,152,255,0.12),transparent)] blur-xl" />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-18 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#f6b11a]/25 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#fff6d8] shadow-[0_0_30px_rgba(246,177,26,0.16)] backdrop-blur">
            <Sparkles className="size-4 text-[#f6b11a]" />
            Luxury lighting and automation
          </div>
          <div className="space-y-5">
            <h1 className="max-w-5xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              Premium Decorative Lighting & Security Automation Solutions
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#fff6d8]/82 sm:text-lg">
              Design, installation, maintenance and AMC services for homes, villas,
              apartments, offices and commercial spaces.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 rounded-full bg-[#f6b11a] px-6 font-semibold text-[#07111f] shadow-[0_0_34px_rgba(246,177,26,0.35)] hover:bg-[#ffcf5a]">
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[#0098ff]/45 bg-[#0098ff]/12 px-6 text-white hover:bg-[#0098ff]/20">
              <Link href="/services">View Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/7 px-6 text-white hover:bg-white/12">
              <a href="https://wa.me/919920111774">WhatsApp: 9920111774</a>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Decorative Lighting", "Security Systems", "AMC Support", "Smart Automation"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm text-[#fff6d8] backdrop-blur">
                <BadgeCheck className="mb-2 size-4 text-[#0098ff]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/7 p-5 shadow-[0_34px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_22%,rgba(246,177,26,0.34),transparent_22%),radial-gradient(circle_at_70%_68%,rgba(0,152,255,0.26),transparent_30%)]" />
      <div className="absolute left-8 right-8 top-10 h-24 rounded-full border-t border-[#f6b11a]/60 shadow-[0_-26px_60px_rgba(246,177,26,0.38)]" />
      <div className="absolute left-1/2 top-20 h-48 w-1 -translate-x-1/2 bg-gradient-to-b from-[#f6b11a] to-transparent" />
      <div className="absolute left-1/2 top-44 size-32 -translate-x-1/2 rounded-full border border-[#f6b11a]/40 bg-[#ff8a00]/18 shadow-[0_0_80px_rgba(255,138,0,0.55)]" />
      <div className="absolute bottom-8 left-6 right-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Lighting", Lightbulb],
          ["CCTV", Camera],
          ["Automation", Cpu],
        ].map(([label, Icon]) => (
          <div key={label as string} className="rounded-2xl border border-white/12 bg-[#020617]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Icon className="size-6 text-[#0098ff]" />
            <div className="mt-3 text-sm font-semibold text-white">{label as string}</div>
            <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-[#f6b11a] to-[#0098ff]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceGrid() {
  return (
    <LightSection eyebrow="Services" title="Lighting, wiring, security, and maintenance under one premium execution team." description="Each service is built around the result clients care about: safer infrastructure, richer ambience, cleaner controls, and dependable support.">
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, ...service }) => (
          <Link key={service.name} href={service.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(7,17,31,0.08)] transition hover:-translate-y-1 hover:border-[#0098ff]/45 hover:shadow-[0_24px_70px_rgba(0,91,207,0.14)]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#07111f] text-[#f6b11a] shadow-[0_0_28px_rgba(246,177,26,0.2)]">
              <Icon className="size-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#07111f]">{service.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{service.copy}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#005bcf]">
              Explore service <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </LightSection>
  );
}

function ProductGrid() {
  return (
    <section className="bg-[#07111f] py-18 text-white sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading light eyebrow="Products" title="Premium product categories selected for ambience, security, and reliable control." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map(([title, copy, Icon]) => (
            <div key={title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-6 shadow-[0_26px_80px_rgba(0,0,0,0.24)]">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#ff8a00]/20 blur-2xl" />
              <Icon className="size-8 text-[#f6b11a]" />
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#fff6d8]/75">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <LightSection eyebrow="Why Choose Eros Enterprises" title="A premium partner for spaces where finish quality and reliability both matter.">
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {[
          ["Design-led execution", "We coordinate technical electrical work with lighting mood, finish details, and visual hierarchy.", Sparkles],
          ["Security-aware planning", "CCTV, safety, access, and automation are treated as part of the property experience.", ShieldCheck],
          ["AMC-ready support", "Documentation, service access, and maintenance routines are planned before handover.", Workflow],
        ].map(([title, copy, Icon]) => (
          <div key={title as string} className="rounded-2xl border border-slate-200 bg-[#fffdf7] p-7">
            <Icon className="size-8 text-[#005bcf]" />
            <h3 className="mt-6 text-2xl font-semibold text-[#07111f]">{title as string}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy as string}</p>
          </div>
        ))}
      </div>
    </LightSection>
  );
}

function HowItWorks() {
  return (
    <section className="bg-[#fff8e8] py-18 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="How It Works" title="A clear path from first enquiry to long-term support." />
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {process.map(([step, title, copy]) => (
            <div key={step} className="rounded-2xl border border-[#f6b11a]/25 bg-white p-5 shadow-[0_18px_50px_rgba(246,177,26,0.12)]">
              <div className="text-sm font-bold text-[#ff8a00]">{step}</div>
              <h3 className="mt-4 text-xl font-semibold text-[#07111f]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <LightSection eyebrow="About Eros" title="Premium electrical craftsmanship with lighting showroom sensibility." description="Eros Enterprises helps homeowners, architects, facility teams, and business owners bring together safe electrical infrastructure, elegant lighting, security systems, and long-term maintenance in one accountable workflow.">
      <Button asChild className="mt-8 rounded-full bg-[#07111f] px-6 text-white hover:bg-[#0d1b30]">
        <Link href="/about">Know Eros Enterprises</Link>
      </Button>
    </LightSection>
  );
}

function ProjectPreview() {
  return (
    <LightSection eyebrow="Projects" title="Portfolio previews across luxury homes, offices, and commercial environments.">
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {projects.map(([title, category, copy]) => (
          <div key={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(7,17,31,0.08)]">
            <div className="h-36 bg-[radial-gradient(circle_at_25%_25%,rgba(246,177,26,0.7),transparent_24%),radial-gradient(circle_at_80%_55%,rgba(0,152,255,0.55),transparent_30%),linear-gradient(135deg,#07111f,#020617)]" />
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#005bcf]">{category}</span>
              <h3 className="mt-3 text-2xl font-semibold text-[#07111f]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </LightSection>
  );
}

function ReviewsPreview() {
  return (
    <section className="bg-white py-18 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="Reviews" title="Trusted by clients who need spaces to look refined and work reliably." />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {reviews.map(([name, quote]) => (
            <div key={name} className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-6">
              <div className="flex gap-1 text-[#f6b11a]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-700">&quot;{quote}&quot;</p>
              <div className="mt-5 font-semibold text-[#07111f]">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  return (
    <LightSection eyebrow="Blog" title="Practical guidance before you invest in lighting, wiring, automation, or AMC.">
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {blogPosts.map(([title, href]) => (
          <Link key={title} href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#f6b11a]/60">
            <FileText className="size-7 text-[#ff8a00]" />
            <h3 className="mt-5 text-xl font-semibold leading-snug text-[#07111f]">{title}</h3>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#005bcf]">
              Read insight <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </LightSection>
  );
}

function ContactCTA() {
  return (
    <section className="bg-[#020617] py-18 text-white sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(246,177,26,0.2),transparent_34%),rgba(255,255,255,0.05)] p-8">
          <MessageCircle className="size-10 text-[#f6b11a]" />
          <h2 className="mt-6 font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Need Lighting or Security Work? Get a Free Site Visit Today.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#fff6d8]/75">
            Share your requirement and Eros will help plan the right electrical,
            lighting, security, automation, or AMC next step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-[#f6b11a] text-[#07111f] hover:bg-[#ffcf5a]">
              <Link href="/contact" className="inline-flex items-center gap-2"><PhoneCall className="size-4" /> Get Free Site Visit</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-[#0098ff]/50 bg-[#0098ff]/10 text-white hover:bg-[#0098ff]/20">
              <a href="https://wa.me/919920111774">WhatsApp Now</a>
            </Button>
          </div>
        </div>
        <LeadCaptureForm variant="siteVisit" sourcePage="/" ctaLocation="homepage-contact-cta" />
      </div>
    </section>
  );
}

function LightSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#f8fbff] py-18 text-[#07111f] sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] ${light ? "border-[#f6b11a]/25 bg-white/8 text-[#fff6d8]" : "border-[#0098ff]/20 bg-[#0098ff]/8 text-[#005bcf]"}`}>
        <CheckCircle2 className="size-4" />
        {eyebrow}
      </div>
      <h2 className={`mt-5 font-heading text-3xl font-semibold leading-tight sm:text-5xl ${light ? "text-white" : "text-[#07111f]"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-8 ${light ? "text-[#fff6d8]/74" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
