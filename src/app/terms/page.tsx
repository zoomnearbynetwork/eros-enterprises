import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: `Terms and conditions for using ${siteConfig.name} services and website.`,
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.name}`,
    url: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1
          className="font-heading text-4xl font-bold mb-2"
          style={{ color: "var(--e-text)" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--e-text)", opacity: 0.5 }}>
          Last updated: June 2025
        </p>

        <div className="space-y-8" style={{ color: "var(--e-text)" }}>
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">1. Acceptance of terms</h2>
            <p style={{ opacity: 0.8 }}>
              By accessing or using the Eros Enterprises website and services, you agree to be bound
              by these Terms &amp; Conditions. If you do not agree, please do not use our website or
              services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">2. Services</h2>
            <p style={{ opacity: 0.8 }}>
              Eros Enterprises provides decorative lighting, security systems, smart home automation,
              and annual maintenance contract (AMC) services across Mumbai and surrounding areas. All
              services are subject to a separate service agreement and quotation accepted by both
              parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              3. Quotations and payments
            </h2>
            <p style={{ opacity: 0.8 }}>
              All quotations are valid for 30 days from the date of issue unless otherwise stated.
              Prices are inclusive of applicable GST. Payment terms are as specified in the individual
              quotation or invoice. Eros Enterprises reserves the right to revise pricing due to
              material cost changes or project scope changes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">4. Warranties</h2>
            <p style={{ opacity: 0.8 }}>
              Eros Enterprises provides workmanship warranties as specified in individual service
              agreements. Product warranties are subject to manufacturer terms and conditions.
              Warranty claims must be reported within the warranty period and do not cover damage
              caused by misuse, tampering, or acts of nature.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              5. Limitation of liability
            </h2>
            <p style={{ opacity: 0.8 }}>
              To the maximum extent permitted by applicable law, Eros Enterprises shall not be
              liable for any indirect, incidental, or consequential damages arising from the use of
              our services or website. Our total liability shall not exceed the amount paid for the
              specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              6. Intellectual property
            </h2>
            <p style={{ opacity: 0.8 }}>
              All content on this website — including text, images, logos, and design — is the
              property of Eros Enterprises and may not be reproduced without prior written
              permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">7. Governing law</h2>
            <p style={{ opacity: 0.8 }}>
              These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be
              subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">8. Contact</h2>
            <p style={{ opacity: 0.8 }}>
              For any questions regarding these terms, please contact:
              <br />
              <strong>{siteConfig.name}</strong>
              <br />
              {siteConfig.address}
              <br />
              <a href={`mailto:${siteConfig.email}`} style={{ color: "#1565C0" }}>
                {siteConfig.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
