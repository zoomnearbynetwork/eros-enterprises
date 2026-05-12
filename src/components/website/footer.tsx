import Link from "next/link";

import { primaryNav, services } from "@/content/website";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-[#f6b11a]/20 bg-[#020617]">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-[#f6b11a]/25 bg-[#f6b11a]/10 px-4 py-1 text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8] uppercase">
            Eros Enterprises
          </span>
          <h3 className="font-heading max-w-md text-3xl font-medium text-white">
            Premium lighting, security automation, electrical execution, and AMC support.
          </h3>
          <p className="max-w-xl text-sm leading-7 text-[#fff6d8]/62">
            {siteConfig.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="rounded-full bg-[#f6b11a] px-5 py-3 text-center text-sm font-semibold text-[#07111f] hover:bg-[#ffcf5a]">
              Get Free Site Visit
            </Link>
            <a href="https://wa.me/919920111774" className="rounded-full border border-[#0098ff]/35 bg-[#0098ff]/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#0098ff]/18">
              WhatsApp Now
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-[0.24em] text-[#fff6d8] uppercase">
              Navigation
            </h4>
            <div className="grid gap-3 text-sm text-[#fff6d8]/62">
              {primaryNav.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-[0.24em] text-[#fff6d8] uppercase">
              Core Services
            </h4>
            <div className="grid gap-3 text-sm text-[#fff6d8]/62">
              {services.slice(0, 5).map((service) => (
                <Link
                  key={service.slug}
                  href={service.href}
                  className="transition hover:text-white"
                >
                  {service.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-[#fff6d8]/48 sm:px-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>{siteConfig.address}</div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
