import Link from "next/link";

import { Button } from "@/components/ui/button";
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
        "relative overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(255,255,255,0.04)_45%,rgba(12,10,9,0.7))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]",
        className
      )}
    >
      <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-1 text-[11px] font-semibold tracking-[0.28em] text-amber-100 uppercase">
            Start your project
          </span>
          <h3 className="font-heading text-3xl font-medium text-white sm:text-4xl">
            {title}
          </h3>
          <p className="text-base leading-7 text-zinc-200">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-amber-300 px-6 font-semibold text-zinc-950 hover:bg-amber-200"
          >
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/15 bg-white/6 px-6 text-white hover:bg-white/10"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
