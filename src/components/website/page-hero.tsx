import type { ReactNode } from "react";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/website/brand-mark";
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
        <div className="premium-card-strong relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
          <div className="site-grid absolute inset-0 opacity-[0.08]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFCC33]/75 to-transparent" />
          <div className="absolute left-1/2 top-28 h-40 w-[110%] -translate-x-1/2 rotate-[-6deg] bg-[linear-gradient(90deg,transparent,rgba(255,204,51,0.08),rgba(244,163,0,0.18),rgba(0,166,255,0.1),transparent)] blur-3xl" />

          <div className="relative grid gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-16">
            <FadeIn className="space-y-8">
              <div className="space-y-5">
                <span className="premium-chip inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.3em] uppercase">
                  {eyebrow}
                </span>
                <h1 className="max-w-4xl font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)] sm:text-lg">
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
                    className="h-12 rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] px-6 font-semibold text-[#06111f] shadow-[0_12px_34px_rgba(244,163,0,0.3)]"
                  >
                    <a href="/contact" className="inline-flex items-center gap-2">
                      Request Site Visit
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-6 text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
                  >
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      className="inline-flex items-center gap-2"
                    >
                      <MessageCircle className="size-4 text-[#F4A300]" />
                      WhatsApp Now
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {quickBenefits.map((item) => (
                  <div
                    key={item}
                    className="premium-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  >
                    <CheckCircle2 className="size-4 text-[#F4A300]" />
                    {item}
                  </div>
                ))}
              </div>

              {stats?.length ? (
                <div className="grid gap-4 border-t border-[color:var(--border)] pt-6 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="premium-card rounded-[1.6rem] px-5 py-4"
                    >
                      <div className="text-xs font-semibold tracking-[0.22em] text-[color:var(--muted-foreground)] uppercase">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
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
    <div className="premium-card relative overflow-hidden rounded-[1.9rem] p-7">
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#FFCC33]/80 to-transparent" />
      <div className="absolute -right-12 top-12 size-32 rounded-full bg-[#007BFF]/16 blur-3xl" />
      <div className="absolute left-6 top-6 size-28 rounded-full bg-[#F4A300]/14 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <BrandMark compact />
          <div className="flex size-13 items-center justify-center rounded-[1.2rem] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(244,163,0,0.2),rgba(0,166,255,0.12))] text-[color:var(--foreground)]">
            <WebsiteIcon name="sparkles" className="size-6 text-[#F4A300]" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-[color:var(--muted-foreground)] uppercase">
              Premium execution
            </p>
            <p className="text-xl font-semibold text-[color:var(--foreground)]">
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
              className="premium-card flex gap-3 rounded-[1.5rem] px-4 py-4"
            >
              <WebsiteIcon name="badge" className="mt-1 size-4 text-[#F4A300]" />
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{item}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(0,123,255,0.14),rgba(255,204,51,0.12))] px-5 py-4">
          <p className="text-sm leading-7 text-[color:var(--foreground)]/82">
            The goal is simple: make every space feel technically dependable and visually elevated the moment the lights come on.
          </p>
        </div>
      </div>
    </div>
  );
}
