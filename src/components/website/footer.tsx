import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowRight, Globe, Mail, MessageCircle, PhoneCall } from "lucide-react";

import { BrandMark } from "@/components/website/brand-mark";
import { primaryNav, services } from "@/content/website";
import { siteConfig } from "@/config/site";

const publicProducts = [
  "Decorative Lighting",
  "Security Systems",
  "CCTV Solutions",
  "Smart Automation",
  "Panel Accessories",
];

export function Footer() {
  return (
    <footer className="surface-divider relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(0,166,255,0.12),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(244,163,0,0.16),transparent_20%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="premium-card-strong grid gap-10 rounded-[2rem] p-7 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr] lg:p-9">
          <div className="space-y-5">
            <BrandMark />

            <p className="max-w-md text-base leading-8 text-[color:var(--muted-foreground)]">
              Premium decorative lighting, smart automation, electrical execution, and AMC support for refined residential and commercial environments.
            </p>

            <div className="grid gap-3 text-sm text-[color:var(--muted-foreground)]">
              <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-3 hover:text-[color:var(--foreground)]">
                <PhoneCall className="size-4 text-[#F4A300]" />
                {siteConfig.phone}
              </a>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} className="inline-flex items-center gap-3 hover:text-[color:var(--foreground)]">
                <MessageCircle className="size-4 text-[#007BFF]" />
                WhatsApp: {siteConfig.phone.replace("+91 ", "")}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-3 hover:text-[color:var(--foreground)]">
                <Mail className="size-4 text-[#F4A300]" />
                {siteConfig.email}
              </a>
              <a href={siteConfig.url} className="inline-flex items-center gap-3 hover:text-[color:var(--foreground)]">
                <Globe className="size-4 text-[#007BFF]" />
                {siteConfig.url.replace("https://", "")}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="premium-chip rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.28em] uppercase">
                Lighting
              </span>
              <span className="premium-chip rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.28em] uppercase">
                Automation
              </span>
              <span className="premium-chip rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.28em] uppercase">
                AMC
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="theme-transition inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0047B3,#00A6FF)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,123,255,0.22)]"
              >
                Request Site Visit
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                className="theme-transition inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
              >
                <MessageCircle className="size-4 text-[#F4A300]" />
                WhatsApp Now
              </a>
            </div>
          </div>

          <FooterColumn title="Navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Services">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.slug}
                href={service.href}
                className="transition hover:text-white"
              >
                {service.shortName}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Products">
            {publicProducts.map((product) => (
              <div key={product} className="transition hover:text-white">
                {product}
              </div>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--border)] px-1 pt-6 text-sm text-[color:var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <div>{siteConfig.address}</div>
          <div>Premium decorative lighting and smart automation solutions by Eros Enterprises.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-[0.26em] text-[color:var(--foreground)] uppercase">
        {title}
      </h3>
      <div className="grid gap-3 text-sm text-[color:var(--muted-foreground)]">{children}</div>
    </div>
  );
}
