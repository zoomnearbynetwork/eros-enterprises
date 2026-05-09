import type { Metadata } from "next";

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
            <div className="rounded-[2rem] border border-white/10 bg-white/4 p-7">
              <div className="grid gap-5 text-sm text-zinc-300">
                <div>
                  <div className="text-zinc-500">Phone</div>
                  <a href={`tel:${siteConfig.phone}`} className="mt-1 block text-white">
                    {siteConfig.phone}
                  </a>
                </div>
                <div>
                  <div className="text-zinc-500">Email</div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 block text-white"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <div>
                  <div className="text-zinc-500">Location</div>
                  <div className="mt-1 text-white">{siteConfig.address}</div>
                </div>
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
