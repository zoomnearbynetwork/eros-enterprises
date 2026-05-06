"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/content/website";
import { cn } from "@/lib/utils";

const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.email("Please enter a valid email address."),
  serviceInterest: z.string().min(1, "Please choose a service."),
  message: z.string().min(10, "Please add a few project details."),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const formLabels = {
  contact: {
    title: "Contact form",
    description: "Tell us what you are planning and our team will follow up.",
    submitLabel: "Send enquiry",
  },
  siteVisit: {
    title: "Site visit form",
    description:
      "Request an on-site assessment for electrical planning, lighting, or maintenance needs.",
    submitLabel: "Request site visit",
  },
  quote: {
    title: "Quote request form",
    description:
      "Share your scope and we will shape the next step toward a formal quotation.",
    submitLabel: "Request quote",
  },
} as const;

export function LeadCaptureForm({
  type,
  className,
}: {
  type: keyof typeof formLabels;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const copy = formLabels[type];

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceInterest: "",
      message: "",
    },
  });

  return (
    <Card
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/5 py-0 text-zinc-100 shadow-none",
        className
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 space-y-2">
          <h3 className="font-heading text-2xl font-medium text-white">
            {copy.title}
          </h3>
          <p className="text-sm leading-7 text-zinc-300">{copy.description}</p>
        </div>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(() => {
            setSubmitted(true);
            form.reset();
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              error={form.formState.errors.name?.message}
              input={
                <Input
                  placeholder="Your full name"
                  {...form.register("name")}
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
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
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
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
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
                />
              }
            />
            <Field
              label="Service interest"
              error={form.formState.errors.serviceInterest?.message}
              input={
                <select
                  {...form.register("serviceInterest")}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-amber-300/40"
                >
                  <option value="" className="bg-zinc-950">
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option
                      key={service.slug}
                      value={service.name}
                      className="bg-zinc-950"
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              }
            />
          </div>

          <Field
            label="Message"
            error={form.formState.errors.message?.message}
            input={
              <Textarea
                rows={5}
                placeholder="Tell us about the project, location, scope, or urgency."
                {...form.register("message")}
                className="rounded-[1.5rem] border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
              />
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-zinc-400">
              UI-only in this phase. Submission feedback is local and not stored.
            </p>
            <Button
              type="submit"
              className="h-12 rounded-full bg-amber-300 px-6 font-semibold text-zinc-950 hover:bg-amber-200"
            >
              {copy.submitLabel}
            </Button>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Thanks. Your details were captured in the UI flow for this phase.
            </div>
          ) : null}
        </form>
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
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {input}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
