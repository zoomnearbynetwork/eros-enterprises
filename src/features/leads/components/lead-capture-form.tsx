"use client";

import { Suspense, type ReactNode } from "react";
import { MessageCircle, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUDGET_RANGES } from "@/features/leads/constants";
import { useLeadCaptureForm } from "@/features/leads/hooks/use-lead-capture-form";
import { services } from "@/content/website";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type LeadFormVariant = "homepageEnquiry" | "contact" | "siteVisit" | "quote" | "serviceCta";

const formCopy: Record<
  LeadFormVariant,
  {
    title: string;
    description: string;
    submitLabel: string;
    showLocation?: boolean;
    showBudgetRange?: boolean;
  }
> = {
  homepageEnquiry: {
    title: "Homepage enquiry",
    description: "Tell us what you are planning and our team will follow up with the right next step.",
    submitLabel: "Send enquiry",
  },
  contact: {
    title: "Contact form",
    description: "Start the conversation for electrical execution, lighting, automation, or maintenance.",
    submitLabel: "Contact Eros",
    showLocation: true,
  },
  siteVisit: {
    title: "Site visit form",
    description: "Request an on-site assessment for planning, coordination, upgrades, or maintenance review.",
    submitLabel: "Request site visit",
    showLocation: true,
  },
  quote: {
    title: "Quote request form",
    description: "Share the scope so we can shape the project into a clear quotation path.",
    submitLabel: "Request quote",
    showLocation: true,
    showBudgetRange: true,
  },
  serviceCta: {
    title: "Request this service",
    description: "Send the essentials and the team will follow up around this service scope.",
    submitLabel: "Submit enquiry",
    showLocation: true,
    showBudgetRange: true,
  },
};

type LeadCaptureFormProps = {
  variant: LeadFormVariant;
  sourcePage: string;
  ctaLocation: string;
  defaultServiceInterest?: string;
  className?: string;
};

export function LeadCaptureForm({
  variant,
  sourcePage,
  ctaLocation,
  defaultServiceInterest,
  className,
}: LeadCaptureFormProps) {
  return (
    <Suspense
      fallback={
        <LeadCaptureFormFrame
          copy={formCopy[variant]}
          className={className}
          isLoading
        />
      }
    >
      <LeadCaptureFormContent
        variant={variant}
        sourcePage={sourcePage}
        ctaLocation={ctaLocation}
        defaultServiceInterest={defaultServiceInterest}
        className={className}
      />
    </Suspense>
  );
}

function LeadCaptureFormContent({
  variant,
  sourcePage,
  ctaLocation,
  defaultServiceInterest,
  className,
}: LeadCaptureFormProps) {
  const copy = formCopy[variant];
  const { form, response, isPending, submit } = useLeadCaptureForm({
    defaultValues: {
      serviceInterest: defaultServiceInterest ?? "",
      sourcePage,
      ctaLocation,
      priority: variant === "siteVisit" ? "HIGH" : "MEDIUM",
    },
  });

  return (
    <LeadCaptureFormFrame copy={copy} className={className}>
      <form className="grid gap-4" onSubmit={submit}>
        <input type="hidden" {...form.register("source")} value="WEBSITE" />
        <input type="hidden" {...form.register("sourcePage")} />
        <input type="hidden" {...form.register("ctaLocation")} />
        <input type="hidden" {...form.register("utmSource")} />
        <input type="hidden" {...form.register("utmMedium")} />
        <input type="hidden" {...form.register("utmCampaign")} />
        <input type="hidden" {...form.register("status")} value="NEW" />
        <input type="hidden" {...form.register("priority")} />
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...form.register("honeypot")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            error={form.formState.errors.name?.message}
            input={
              <Input
                placeholder="Your full name"
                {...form.register("name")}
                className="h-12 rounded-[1.15rem] border-white/10 bg-[#020617]/55 text-white placeholder:text-[#fff6d8]/32"
              />
            }
          />
          <Field
            label="Phone"
            error={form.formState.errors.phone?.message}
            input={
              <Input
                placeholder="Phone number"
                {...form.register("phone")}
                className="h-12 rounded-[1.15rem] border-white/10 bg-[#020617]/55 text-white placeholder:text-[#fff6d8]/32"
              />
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            error={form.formState.errors.email?.message}
            input={
              <Input
                type="email"
                placeholder="name@company.com"
                {...form.register("email")}
                className="h-12 rounded-[1.15rem] border-white/10 bg-[#020617]/55 text-white placeholder:text-[#fff6d8]/32"
              />
            }
          />
          <Field
            label="Service interest"
            error={form.formState.errors.serviceInterest?.message}
            input={
              <select
                {...form.register("serviceInterest")}
                className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-[#020617]/55 px-4 text-sm text-white outline-none focus:border-[#f6b11a]/45"
              >
                <option value="" className="bg-zinc-950">
                  Select a service
                </option>
                {services.map((service) => (
                  <option key={service.slug} value={service.name} className="bg-zinc-950">
                    {service.name}
                  </option>
                ))}
              </select>
            }
          />
        </div>

        {copy.showLocation ? (
          <Field
            label="Location"
            error={form.formState.errors.location?.message}
            input={
              <Input
                placeholder="Project city or site location"
                {...form.register("location")}
                className="h-12 rounded-[1.15rem] border-white/10 bg-[#020617]/55 text-white placeholder:text-[#fff6d8]/32"
              />
            }
          />
        ) : null}

        {copy.showBudgetRange ? (
          <Field
            label="Budget range"
            error={form.formState.errors.budgetRange?.message}
            input={
              <select
                {...form.register("budgetRange")}
                className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-[#020617]/55 px-4 text-sm text-white outline-none focus:border-[#f6b11a]/45"
              >
                <option value="" className="bg-zinc-950">
                  Select budget range
                </option>
                {BUDGET_RANGES.map((budgetRange) => (
                  <option key={budgetRange} value={budgetRange} className="bg-zinc-950">
                    {budgetRange}
                  </option>
                ))}
              </select>
            }
          />
        ) : null}

        <Field
          label="Message"
          error={form.formState.errors.message?.message}
          input={
            <Textarea
              rows={5}
              placeholder="Tell us about the project, scope, urgency, or support requirement."
              {...form.register("message")}
              className="rounded-[1.35rem] border-white/10 bg-[#020617]/55 text-white placeholder:text-[#fff6d8]/32"
            />
          }
        />

        <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#fff6d8] hover:text-white"
            >
              <MessageCircle className="size-4 text-[#f6b11a]" />
              WhatsApp now
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#fff6d8] hover:text-white"
            >
              <PhoneCall className="size-4 text-[#0098ff]" />
              Call {siteConfig.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#fff6d8]/56">
            Leads go directly into the CRM with source tracking and activity logging.
          </p>
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-6 font-semibold text-[#07111f] shadow-[0_12px_30px_rgba(246,177,26,0.28)]"
          >
            {isPending ? "Submitting..." : copy.submitLabel}
          </Button>
        </div>

        {!response.success && response.message ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {response.message}
          </div>
        ) : null}

        {response.success ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {response.message} Reference: {response.data.leadNumber}
          </div>
        ) : null}
      </form>
    </LeadCaptureFormFrame>
  );
}

function LeadCaptureFormFrame({
  copy,
  className,
  isLoading = false,
  children,
}: {
  copy: (typeof formCopy)[LeadFormVariant];
  className?: string;
  isLoading?: boolean;
  children?: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04)_45%,rgba(2,6,23,0.42))] py-0 text-zinc-100 shadow-[0_28px_90px_rgba(0,0,0,0.24)]",
        className,
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 space-y-3">
          <div className="inline-flex rounded-full border border-[#f6b11a]/18 bg-[linear-gradient(135deg,rgba(246,177,26,0.14),rgba(0,152,255,0.1))] px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#fff6d8] uppercase">
            Lead capture
          </div>
          <h3 className="font-heading text-3xl font-medium text-white">{copy.title}</h3>
          <p className="text-sm leading-7 text-[#fff6d8]/72">{copy.description}</p>
        </div>
        {isLoading ? (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-12 rounded-2xl bg-white/8" />
              <div className="h-12 rounded-2xl bg-white/8" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-12 rounded-2xl bg-white/8" />
              <div className="h-12 rounded-2xl bg-white/8" />
            </div>
            <div className="h-32 rounded-[1.5rem] bg-white/8" />
            <div className="h-12 rounded-full bg-amber-300/20" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#fff6d8]">{label}</span>
      {input}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
