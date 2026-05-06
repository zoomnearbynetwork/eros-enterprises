import Link from "next/link";

import { primaryNav, services } from "@/content/website";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09090b]">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-amber-300/15 bg-amber-300/8 px-4 py-1 text-[11px] font-semibold tracking-[0.28em] text-amber-100 uppercase">
            Eros Enterprises
          </span>
          <h3 className="font-heading max-w-md text-3xl font-medium text-white">
            Premium electrical execution with the polish of a modern lighting brand.
          </h3>
          <p className="max-w-xl text-sm leading-7 text-zinc-400">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-[0.24em] text-zinc-200 uppercase">
              Navigation
            </h4>
            <div className="grid gap-3 text-sm text-zinc-400">
              {primaryNav.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-[0.24em] text-zinc-200 uppercase">
              Core Services
            </h4>
            <div className="grid gap-3 text-sm text-zinc-400">
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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-zinc-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>{siteConfig.address}</div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <a href={`tel:${siteConfig.phone}`} className="hover:text-zinc-200">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-zinc-200">
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
