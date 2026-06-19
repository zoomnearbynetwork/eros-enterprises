import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy policy for ${siteConfig.name} — how we collect, use, and protect your personal information.`,
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    url: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1
          className="font-heading text-4xl font-bold mb-2"
          style={{ color: "var(--e-text)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--e-text)", opacity: 0.5 }}>
          Last updated: June 2025
        </p>

        <div className="space-y-8" style={{ color: "var(--e-text)" }}>
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              1. Information we collect
            </h2>
            <p style={{ opacity: 0.8 }}>
              We collect information you provide directly to us when you fill out a contact or quote
              form, schedule a site visit, or communicate with us via phone or WhatsApp. This may
              include your name, phone number, email address, and project details.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              2. How we use your information
            </h2>
            <p style={{ opacity: 0.8 }}>
              We use the information we collect to respond to your enquiries, prepare quotations,
              schedule site visits, process payments, send service-related communications, and
              improve our services. We do not sell or share your personal information with third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              3. Data storage and security
            </h2>
            <p style={{ opacity: 0.8 }}>
              Your data is stored securely on our servers. We implement industry-standard technical
              and organisational measures to protect your personal information against unauthorised
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">4. Communications</h2>
            <p style={{ opacity: 0.8 }}>
              By submitting a form on our website, you consent to being contacted by Eros Enterprises
              via phone, email, or WhatsApp regarding your enquiry. You may opt out of marketing
              communications at any time by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">5. Cookies</h2>
            <p style={{ opacity: 0.8 }}>
              Our website uses cookies and similar tracking technologies (including Google Tag
              Manager) to understand how visitors interact with our site. You may disable cookies in
              your browser settings, though this may affect certain functionality.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">6. Your rights</h2>
            <p style={{ opacity: 0.8 }}>
              You have the right to access, correct, or request deletion of your personal information
              held by us. To exercise these rights, please contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} style={{ color: "#1565C0" }}>
                {siteConfig.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">7. Contact us</h2>
            <p style={{ opacity: 0.8 }}>
              If you have any questions about this Privacy Policy, please contact:
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
