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
        "relative overflow-hidden rounded-[2rem] border border-[#f6b11a]/18 bg-[linear-gradient(135deg,rgba(246,177,26,0.18),rgba(0,152,255,0.08)_42%,rgba(2,6,23,0.74))] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.26)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(246,177,26,0.24),transparent_24%),radial-gradient(circle_at_84%_28%,rgba(0,152,255,0.18),transparent_24%)]" />
      <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/80 to-transparent" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8] uppercase">
            Start your project
          </span>
          <h3 className="font-heading text-3xl font-medium text-white sm:text-4xl lg:text-5xl">
            {title}
          </h3>
          <p className="text-base leading-8 text-[#fff6d8]/76">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-6 font-semibold text-[#07111f] shadow-[0_12px_34px_rgba(246,177,26,0.28)]"
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
            className="h-12 rounded-full border-[#0098ff]/30 bg-[#0098ff]/10 px-6 text-white hover:bg-[#0098ff]/18"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-full bg-white/6 px-6 text-[#fff6d8] hover:bg-white/10"
          >
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="size-4 text-[#f6b11a]" />
              WhatsApp Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
