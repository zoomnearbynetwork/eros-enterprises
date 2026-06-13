import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function CtaBanner({
  title,
  description,
  primaryLabel = "Request a quote",
  primaryHref = "/contact",
  secondaryLabel = "Book a site visit",
  secondaryHref = "/contact",
  className,
}: {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "premium-card-strong relative overflow-hidden rounded-[2rem] p-8",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,71,179,0.92),rgba(0,166,255,0.58)_48%,rgba(244,163,0,0.42)_82%,rgba(255,204,51,0.34))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,204,51,0.28),transparent_24%),radial-gradient(circle_at_84%_28%,rgba(255,255,255,0.18),transparent_24%)]" />
      <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-white uppercase">
            Start your project
          </span>
          <h3 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            {title}
          </h3>
          <p className="text-base leading-8 text-white/78">{description}</p>
        </div>
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] px-6 font-semibold text-[#06111f] shadow-[0_12px_34px_rgba(244,163,0,0.28)]"
          >
            <Link href={primaryHref} className="inline-flex items-center gap-2">
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/25 bg-white/10 px-6 text-white hover:bg-white/16"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-full bg-[#06111f]/20 px-6 text-white hover:bg-[#06111f]/32"
          >
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="size-4 text-[#FFCC33]" />
              WhatsApp Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
