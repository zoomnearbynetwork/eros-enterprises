import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowRight, Globe, Mail, MessageCircle, PhoneCall } from "lucide-react";

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
    <footer className="relative overflow-hidden border-t border-[#f6b11a]/16 bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(0,152,255,0.16),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(246,177,26,0.18),transparent_20%),linear-gradient(180deg,rgba(7,17,31,0.96),rgba(2,6,23,1))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr] lg:p-9">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-[1.1rem] border border-[#0098ff]/28 bg-[radial-gradient(circle_at_30%_20%,rgba(246,177,26,0.55),transparent_34%),linear-gradient(160deg,#0a1630,#020617)] text-sm font-bold tracking-[0.22em] text-[#fff6d8] uppercase shadow-[0_0_26px_rgba(0,152,255,0.2)]">
                EE
              </div>
              <div>
                <div className="font-heading text-2xl font-medium text-white">
                  Eros Enterprises
                </div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8]/70 uppercase">
                  Premium lighting and security automation
                </div>
              </div>
            </div>

            <p className="max-w-md text-base leading-8 text-[#fff6d8]/72">
              Premium decorative lighting, security systems, smart automation, electrical execution,
              and AMC support for refined residential and commercial spaces.
            </p>

            <div className="grid gap-3 text-sm text-[#fff6d8]/76">
              <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-3 hover:text-white">
                <PhoneCall className="size-4 text-[#f6b11a]" />
                {siteConfig.phone}
              </a>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} className="inline-flex items-center gap-3 hover:text-white">
                <MessageCircle className="size-4 text-[#0098ff]" />
                WhatsApp: {siteConfig.phone.replace("+91 ", "")}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-3 hover:text-white">
                <Mail className="size-4 text-[#f6b11a]" />
                {siteConfig.email}
              </a>
              <a href={siteConfig.url} className="inline-flex items-center gap-3 hover:text-white">
                <Globe className="size-4 text-[#0098ff]" />
                {siteConfig.url.replace("https://", "")}
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-5 py-3 text-sm font-semibold text-[#07111f] shadow-[0_12px_30px_rgba(246,177,26,0.28)]"
              >
                Get Free Site Visit
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                className="inline-flex items-center justify-center rounded-full border border-[#0098ff]/30 bg-[#0098ff]/10 px-5 py-3 text-sm font-semibold text-white hover:bg-[#0098ff]/16"
              >
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

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 px-1 pt-6 text-sm text-[#fff6d8]/56 sm:flex-row sm:items-center sm:justify-between">
          <div>{siteConfig.address}</div>
          <div>Premium decorative lighting and security automation solutions by Eros Enterprises.</div>
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
      <h3 className="text-sm font-semibold tracking-[0.26em] text-[#fff6d8] uppercase">
        {title}
      </h3>
      <div className="grid gap-3 text-sm text-[#fff6d8]/72">{children}</div>
    </div>
  );
}
