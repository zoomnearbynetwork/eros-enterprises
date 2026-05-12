import type { Metadata } from "next";
import { MessageCircle, PhoneCall } from "lucide-react";

import { StructuredData } from "@/components/seo/structured-data";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { contactFaq, pageMetadata } from "@/content/website";
import { siteConfig } from "@/config/site";
import { LeadCaptureForm } from "@/features/leads/components/lead-capture-form";
import { buildMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMetadata.contact);

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          buildLocalBusinessSchema(),
          buildFaqSchema(contactFaq),
        ]}
      />
      <PageHero
        eyebrow="Contact"
        title="Start the conversation with a quote request, site visit, or direct enquiry."
        description="Choose the route that matches your stage and the enquiry will flow directly into the Eros CRM."
      />
      <Section>
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Contact details"
              title="Multiple ways to reach the Eros team."
              description="For larger scopes, a site visit or scoped quotation request usually creates the best starting point."
            />
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.38))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
              <div className="grid gap-5 text-sm text-[#fff6d8]/72">
                <div>
                  <div className="text-[#fff6d8]/42">Phone</div>
                  <a href={`tel:${siteConfig.phone}`} className="mt-1 block text-white">
                    {siteConfig.phone}
                  </a>
                </div>
                <div>
                  <div className="text-[#fff6d8]/42">Email</div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 block text-white"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <div>
                  <div className="text-[#fff6d8]/42">Location</div>
                  <div className="mt-1 text-white">{siteConfig.address}</div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0098ff]/30 bg-[#0098ff]/10 px-4 py-3 text-sm font-medium text-white hover:bg-[#0098ff]/18"
                >
                  <MessageCircle className="size-4 text-[#f6b11a]" />
                  WhatsApp Now
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  <PhoneCall className="size-4 text-[#0098ff]" />
                  Call Eros
                </a>
              </div>
            </div>
            <FaqAccordion items={contactFaq} />
          </div>
          <div className="grid gap-6">
            <LeadCaptureForm
              variant="contact"
              sourcePage="/contact"
              ctaLocation="contact-page-direct-enquiry"
            />
            <LeadCaptureForm
              variant="siteVisit"
              sourcePage="/contact"
              ctaLocation="contact-page-site-visit"
            />
            <LeadCaptureForm
              variant="quote"
              sourcePage="/contact"
              ctaLocation="contact-page-quote-request"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
