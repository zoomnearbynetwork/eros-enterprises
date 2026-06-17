"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { services } from "@/content/website";
import { siteConfig } from "@/config/site";
import { useLeadCaptureForm } from "@/features/leads/hooks/use-lead-capture-form";
import { CalendlyEmbed } from "@/components/website/calendly-embed";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/erosenterprises/site-visit";

const trustPoints = [
  { icon: "🆓", title: "Completely Free", sub: "Zero cost, no obligation" },
  { icon: "📍", title: "We Come to You", sub: "All of Mumbai covered" },
  { icon: "⏱️", title: "Within 48 Hours", sub: "Fast scheduling" },
  { icon: "📋", title: "Expert Assessment", sub: "Written recommendations" },
];

const areas = [
  "South Mumbai", "Western Suburbs", "Bandra to Virar", "BKC & Kurla",
  "Powai & Thane", "Navi Mumbai", "Pune (on request)", "Lonavala (on request)",
];

type BookingMode = "calendly" | "form";

function SiteVisitForm() {
  const { form, response, isPending, submit } = useLeadCaptureForm({
    defaultValues: {
      sourcePage: "/site-visit",
      ctaLocation: "site_visit_page",
      source: "WEBSITE",
      status: "NEW",
      priority: "HIGH",
    },
  });

  const errors = form.formState.errors;
  const inputCls = "w-full h-[46px] rounded-[10px] px-4 text-[13px] font-medium transition-all outline-none focus:ring-2 focus:ring-[#1565C0]";
  const inputStyle = { background: "rgba(10,22,40,0.8)", border: "1px solid rgba(21,101,192,0.25)", color: "#E8EAF0" };
  const labelCls = "block text-[11px] font-bold uppercase tracking-[0.07em] mb-1.5 text-[#8896AA]";

  if (response.success) {
    return (
      <div className="rounded-[20px] overflow-hidden text-center p-10"
           style={{ background: "rgba(10,22,40,0.92)", border: "1px solid rgba(21,101,192,0.25)", boxShadow: "0 24px 60px rgba(5,10,20,0.5)" }}>
        <div className="text-[48px] mb-4">✅</div>
        <h3 className="font-heading font-bold text-[20px] text-white mb-3">Site Visit Requested!</h3>
        <p className="text-[13px] mb-2" style={{ color: "#8896AA" }}>
          Reference: <span className="text-[#F5A623] font-bold">{response.data?.leadNumber}</span>
        </p>
        <p className="text-[13px]" style={{ color: "#8896AA" }}>
          Our team will contact you within 2 hours to confirm your visit.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] overflow-hidden"
         style={{ background: "rgba(10,22,40,0.92)", border: "1px solid rgba(21,101,192,0.25)", boxShadow: "0 24px 60px rgba(5,10,20,0.5)", backdropFilter: "blur(12px)" }}>
      <div className="px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3"
             style={{ background: "rgba(21,101,192,0.15)", border: "1px solid rgba(21,101,192,0.3)" }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#93C5FD" }}>Lead Capture</span>
        </div>
        <h3 className="font-heading font-bold text-[22px] text-white mb-1.5">Site visit form</h3>
        <p className="text-[12px] leading-[1.6]" style={{ color: "#8896AA" }}>
          Request an on-site assessment for planning, coordination, upgrades, or maintenance review.
        </p>
      </div>
      <form onSubmit={submit} className="px-6 pb-6 space-y-3">
        <input type="hidden" {...form.register("source")} value="WEBSITE" />
        <input type="hidden" {...form.register("sourcePage")} />
        <input type="hidden" {...form.register("ctaLocation")} />
        <input type="hidden" {...form.register("utmSource")} />
        <input type="hidden" {...form.register("utmMedium")} />
        <input type="hidden" {...form.register("utmCampaign")} />
        <input type="hidden" {...form.register("status")} value="NEW" />
        <input type="hidden" {...form.register("priority")} value="HIGH" />
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...form.register("honeypot")} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Name</label>
            <input placeholder="Your full name" {...form.register("name")} className={inputCls} style={inputStyle} />
            {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input placeholder="Phone number" {...form.register("phone")} className={inputCls} style={inputStyle} />
            {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" placeholder="name@company.com" {...form.register("email")} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls}>Service interest</label>
            <select {...form.register("serviceInterest")} className={inputCls} style={{ ...inputStyle, appearance: "none" }}>
              <option value="" style={{ background: "#0A1628" }}>Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name} style={{ background: "#0A1628" }}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input placeholder="Project city or site location" {...form.register("location")} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Message</label>
          <textarea rows={3} placeholder="Tell us about the project, scope, urgency, or support requirement."
            {...form.register("message")}
            className="w-full rounded-[10px] px-4 py-3 text-[13px] font-medium transition-all outline-none focus:ring-2 focus:ring-[#1565C0] resize-none"
            style={inputStyle} />
        </div>

        <div className="rounded-[10px] p-3 flex items-center gap-3"
             style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "#25D366" }}>
            💬 WhatsApp now
          </a>
          <div className="flex-1 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>or</div>
          <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "#93C5FD" }}>
            📞 Call {siteConfig.phone}
          </a>
        </div>

        {!response.success && response.message && (
          <div className="rounded-[10px] px-4 py-3 text-[12px]"
               style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            {response.message}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[10px] leading-[1.5]" style={{ color: "#5A6B82" }}>
            Leads go directly into the CRM with source tracking and activity logging.
          </p>
          <button type="submit" disabled={isPending}
            className="h-[42px] px-6 rounded-[10px] text-[13px] font-bold transition-all hover:brightness-110 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg,#F5A623,#FFCC33)", color: "#050A14", boxShadow: "0 8px 24px rgba(245,166,35,0.3)" }}>
            {isPending ? "Submitting..." : "Request site visit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SiteVisitPage() {
  const [mode, setMode] = useState<BookingMode>("calendly");

  return (
    <>
      <div className="px-6 lg:px-10 py-14 lg:py-20"
           style={{ background: "linear-gradient(145deg,#0C1E42 0%,#050A14 65%)", borderBottom: "1px solid rgba(21,101,192,0.22)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-start">

            {/* Left — copy */}
            <div className="lg:pt-4">
              <div className="eros-bc">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span className="text-[#8896AA]">›</span>
                <span className="bc-cur">Request Site Visit</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
                   style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)" }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#25D366]">100% Free — No Obligation</span>
              </div>

              <h1 className="font-heading font-extrabold text-[36px] lg:text-[44px] text-white leading-[1.1] mb-4">
                Book Your<br /><span style={{ color: "#F5A623" }}>Free Site Visit</span>
              </h1>
              <p className="text-[15px] leading-[1.75] mb-8 max-w-[440px]" style={{ color: "#8896AA" }}>
                Our expert visits your site, understands your requirement, and provides a comprehensive
                written assessment — at absolutely no cost.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {trustPoints.map((t) => (
                  <div key={t.title} className="flex items-center gap-3 rounded-[12px] p-3"
                       style={{ background: "rgba(15,31,61,0.6)", border: "1px solid rgba(21,101,192,0.2)" }}>
                    <span className="text-[20px] flex-shrink-0">{t.icon}</span>
                    <div>
                      <div className="text-[12px] font-bold text-white">{t.title}</div>
                      <div className="text-[10px]" style={{ color: "#8896AA" }}>{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(99,153,255,0.7)" }}>Areas we cover</div>
                <div className="flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <span key={a} className="px-3 py-1 rounded-full text-[11px] font-medium"
                          style={{ background: "rgba(21,101,192,0.12)", border: "1px solid rgba(21,101,192,0.22)", color: "#93C5FD" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Booking tabs */}
            <div>
              {/* Mode switcher */}
              <div className="flex gap-1 p-1 rounded-[12px] mb-4"
                   style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(21,101,192,0.22)" }}>
                <button onClick={() => setMode("calendly")}
                  className="flex-1 py-2.5 rounded-[9px] text-[12px] font-semibold transition-all"
                  style={mode === "calendly"
                    ? { background: "#1565C0", color: "#fff" }
                    : { background: "transparent", color: "#8896AA" }}>
                  📅 Pick a Time Slot
                </button>
                <button onClick={() => setMode("form")}
                  className="flex-1 py-2.5 rounded-[9px] text-[12px] font-semibold transition-all"
                  style={mode === "form"
                    ? { background: "#1565C0", color: "#fff" }
                    : { background: "transparent", color: "#8896AA" }}>
                  ✍️ Fill Request Form
                </button>
              </div>

              {mode === "calendly" ? (
                <div className="rounded-[20px] overflow-hidden"
                     style={{ background: "rgba(10,22,40,0.92)", border: "1px solid rgba(21,101,192,0.25)" }}>
                  <div className="px-5 pt-5 pb-2">
                    <h3 className="font-heading font-bold text-[16px] text-white mb-1">
                      Choose a date & time
                    </h3>
                    <p className="text-[11px]" style={{ color: "#8896AA" }}>
                      Pick a slot that works for you — we&apos;ll come to you.
                    </p>
                  </div>
                  <Suspense fallback={
                    <div className="h-[500px] animate-pulse mx-4 mb-4 rounded-[12px]"
                         style={{ background: "rgba(21,101,192,0.08)" }} />
                  }>
                    <CalendlyEmbed url={CALENDLY_URL} className="mx-0" />
                  </Suspense>
                </div>
              ) : (
                <Suspense fallback={
                  <div className="rounded-[20px] h-96 animate-pulse"
                       style={{ background: "rgba(10,22,40,0.92)" }} />
                }>
                  <SiteVisitForm />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6"
           style={{ background: "#0A1628", borderBottom: "1px solid rgba(21,101,192,0.15)" }}>
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px]" style={{ color: "#8896AA" }}>
            Questions before booking? Chat with our team instantly.
          </p>
          <div className="flex gap-3">
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[12px] font-bold"
               style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
              💬 WhatsApp Us
            </a>
            <a href={`tel:${siteConfig.phone}`}
               className="inline-flex items-center gap-2 bg-[#1565C0] hover:bg-[#1E7FE8] text-white px-4 py-2.5 rounded-[8px] text-[12px] font-bold transition-colors">
              📞 {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
