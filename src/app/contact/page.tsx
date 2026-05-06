import type { Metadata } from "next";

import { FaqAccordion } from "@/components/website/faq-accordion";
import { LeadCaptureForm } from "@/components/website/lead-capture-form";
import { PageHero } from "@/components/website/page-hero";
import { Section } from "@/components/website/section";
import { SectionHeader } from "@/components/website/section-header";
import { contactFaq, pageMetadata } from "@/content/website";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(pageMetadata.contact);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start the conversation with a quote request, site visit, or direct enquiry."
        description="The public-site forms in this phase are intentionally UI-only, but the experience is ready for production integration."
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
            <LeadCaptureForm type="contact" />
            <LeadCaptureForm type="siteVisit" />
            <LeadCaptureForm type="quote" />
          </div>
        </div>
      </Section>
    </>
  );
}
