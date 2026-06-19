import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/website/quote-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Get a Free Quote | Eros Enterprises",
  description:
    "Request a free, no-obligation quote for decorative lighting, security systems, smart automation, or AMC services across Mumbai.",
  openGraph: {
    title: "Get a Free Quote | Eros Enterprises",
    description:
      "Request a free quote for decorative lighting, security systems, smart automation, or AMC services.",
    url: `${siteConfig.url}/quote`,
  },
};

export default function QuotePage() {
  return (
    <>
      <div
        className="px-6 lg:px-10 py-14 lg:py-20"
        style={{
          background: "linear-gradient(145deg,#0C1E42 0%,#050A14 65%)",
          borderBottom: "1px solid rgba(21,101,192,0.22)",
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-start">
            <div className="lg:pt-4">
              <div className="eros-bc">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span className="text-[#8896AA]">›</span>
                <span className="bc-cur">Get a Quote</span>
              </div>

              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
                style={{
                  background: "rgba(245,166,35,0.12)",
                  border: "1px solid rgba(245,166,35,0.3)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#F5A623]">
                  Free & No Obligation
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-[36px] lg:text-[44px] text-white leading-[1.1] mb-4">
                Get a Detailed
                <br />
                <span style={{ color: "#F5A623" }}>Quote in 24 Hours</span>
              </h1>
              <p
                className="text-[15px] leading-[1.75] mb-8 max-w-[440px]"
                style={{ color: "#8896AA" }}
              >
                Tell us about your lighting, security, or automation project.
                We&apos;ll send a transparent, line-item quotation — no
                surprises, no pressure.
              </p>
            </div>

            <div>
              <QuoteForm sourcePage="/quote" compact={false} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-6 lg:px-10 py-6"
        style={{
          background: "#0A1628",
          borderBottom: "1px solid rgba(21,101,192,0.15)",
        }}
      >
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px]" style={{ color: "#8896AA" }}>
            Prefer to talk directly? Our team is available Mon–Sat, 9am–7pm.
          </p>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[12px] font-bold transition-colors"
              style={{
                background: "rgba(37,211,102,0.1)",
                border: "1px solid rgba(37,211,102,0.3)",
                color: "#25D366",
              }}
            >
              WhatsApp Us
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 bg-[#1565C0] hover:bg-[#1E7FE8] text-white px-4 py-2.5 rounded-[8px] text-[12px] font-bold transition-colors"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
