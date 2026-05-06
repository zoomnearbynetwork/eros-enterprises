import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/website/motion";
import { WebsiteIcon } from "@/components/website/icon-map";
import { cn } from "@/lib/utils";

type HeroStat = {
  label: string;
  value: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  stats,
  actions,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats?: HeroStat[];
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-28 pb-14 sm:pt-34", className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#09090b,_#09090b_28%,_#111113_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-10">
        <FadeIn className="space-y-8">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-1 text-[11px] font-semibold tracking-[0.3em] text-amber-100 uppercase">
              {eyebrow}
            </span>
            <h1 className="font-heading max-w-4xl text-4xl leading-tight font-medium text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              {description}
            </p>
          </div>

          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {actions}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-amber-300 px-6 font-semibold text-zinc-950 hover:bg-amber-200"
              >
                <a href="/contact">Request a consultation</a>
              </Button>
            </div>
          )}

          {stats?.length ? (
            <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/4 px-5 py-4 backdrop-blur"
                >
                  <div className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </FadeIn>

        <FadeIn delay={0.1} className="lg:pl-8">
          {aside ?? <HeroAsideCard />}
        </FadeIn>
      </div>
    </section>
  );
}

function HeroAsideCard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-[0_32px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/15 text-amber-200">
            <WebsiteIcon name="sparkles" className="size-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">
              Premium execution
            </p>
            <p className="text-lg font-semibold text-white">
              Built for aesthetics and uptime
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            "Lighting, power, and automation planned together",
            "Luxury-residential detail with commercial reliability",
            "Structured handover and long-term support readiness",
          ].map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-3xl border border-white/10 bg-black/20 px-4 py-4"
            >
              <WebsiteIcon name="badge" className="mt-0.5 size-4 text-amber-200" />
              <p className="text-sm leading-7 text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-200/12 to-transparent px-5 py-4">
          <p className="text-sm leading-7 text-zinc-200">
            From electrical foundations to decorative lighting finishes, Eros
            creates spaces that feel technically sound and visually elevated.
          </p>
        </div>
      </div>
    </div>
  );
}
