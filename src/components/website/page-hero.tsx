import type { ReactNode } from "react";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/website/motion";
import { WebsiteIcon } from "@/components/website/icon-map";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type HeroStat = {
  label: string;
  value: string;
};

const quickBenefits = [
  "Decorative lighting",
  "Security systems",
  "Smart automation",
  "AMC support",
];

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
    <section className={cn("relative overflow-hidden px-3 pt-8 sm:px-5", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(2,6,23,0.95),rgba(7,17,31,0.94)_55%,rgba(2,6,23,0.98))] shadow-[0_36px_120px_rgba(0,0,0,0.34)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,152,255,0.22),transparent_20%),radial-gradient(circle_at_82%_16%,rgba(246,177,26,0.24),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(0,91,207,0.18),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:82px_82px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/80 to-transparent" />
          <div className="absolute left-1/2 top-28 h-40 w-[110%] -translate-x-1/2 rotate-[-6deg] bg-[linear-gradient(90deg,transparent,rgba(246,177,26,0.08),rgba(255,138,0,0.2),rgba(0,152,255,0.1),transparent)] blur-3xl" />

          <div className="relative grid gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-16">
            <FadeIn className="space-y-8">
              <div className="space-y-5">
                <span className="inline-flex rounded-full border border-[#f6b11a]/20 bg-[linear-gradient(135deg,rgba(246,177,26,0.16),rgba(0,152,255,0.1))] px-4 py-1.5 text-[11px] font-semibold tracking-[0.3em] text-[#fff6d8] uppercase">
                  {eyebrow}
                </span>
                <h1 className="max-w-4xl font-heading text-4xl leading-[1.02] font-medium text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#fff6d8]/74 sm:text-lg">
                  {description}
                </p>
              </div>

              {actions ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {actions}
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-6 font-semibold text-[#07111f] shadow-[0_12px_34px_rgba(246,177,26,0.3)]"
                  >
                    <a href="/contact" className="inline-flex items-center gap-2">
                      Book Free Site Visit
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-[#0098ff]/36 bg-[#0098ff]/12 px-6 text-white hover:bg-[#0098ff]/18"
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
              )}

              <div className="flex flex-wrap gap-3">
                {quickBenefits.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-[#fff6d8]"
                  >
                    <CheckCircle2 className="size-4 text-[#f6b11a]" />
                    {item}
                  </div>
                ))}
              </div>

              {stats?.length ? (
                <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                    >
                      <div className="text-xs font-semibold tracking-[0.22em] text-[#fff6d8]/48 uppercase">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </FadeIn>

            <FadeIn delay={0.08} className="lg:pl-4">
              {aside ?? <HeroAsideCard />}
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAsideCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04)_46%,rgba(2,6,23,0.44))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/80 to-transparent" />
      <div className="absolute -right-12 top-12 size-32 rounded-full bg-[#0098ff]/16 blur-3xl" />
      <div className="absolute left-6 top-6 size-28 rounded-full bg-[#ff8a00]/14 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-13 items-center justify-center rounded-[1.2rem] border border-[#f6b11a]/22 bg-[linear-gradient(135deg,rgba(246,177,26,0.2),rgba(0,152,255,0.12))] text-[#fff6d8]">
            <WebsiteIcon name="sparkles" className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-[#fff6d8]/48 uppercase">
              Premium execution
            </p>
            <p className="text-xl font-semibold text-white">
              Built for ambience, control, and uptime
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            "Lighting, security, and electrical planning aligned from day one",
            "Luxury finish discipline with commercial-grade execution control",
            "Fast follow-up, clear quotations, and long-term AMC readiness",
          ].map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-[1.5rem] border border-white/10 bg-[#020617]/44 px-4 py-4"
            >
              <WebsiteIcon name="badge" className="mt-1 size-4 text-[#f6b11a]" />
              <p className="text-sm leading-7 text-[#fff6d8]/76">{item}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-[#0098ff]/18 bg-[linear-gradient(135deg,rgba(0,152,255,0.14),rgba(246,177,26,0.1))] px-5 py-4">
          <p className="text-sm leading-7 text-[#fff6d8]/82">
            The goal is simple: make every space feel technically dependable and visually elevated the moment the lights come on.
          </p>
        </div>
      </div>
    </div>
  );
}
