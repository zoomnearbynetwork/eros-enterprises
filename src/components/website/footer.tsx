import Link from "next/link";
// Social icons as inline SVG (lucide-react version in this project lacks these)
function IconInstagram() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>; }
function IconFacebook() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function IconLinkedin() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }
function IconYoutube() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>; }

import { siteConfig } from "@/config/site";

const serviceLinks = [
  { href: "/services/decorative-lighting", label: "Decorative Lighting" },
  { href: "/services/security-systems", label: "Security Systems" },
  { href: "/services/smart-automation", label: "Smart Automation" },
  { href: "/services/amc-services", label: "AMC Contracts" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
];

const supportLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/contact#faq", label: "FAQ" },
  { href: "/contact#amc", label: "Request AMC" },
];

export function Footer() {
  return (
    <footer className="bg-[#02060E] pt-12 pb-6 border-t border-[rgba(21,101,192,0.15)]">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#1565C0] rounded-[9px] flex items-center justify-center text-lg">💡</div>
              <div>
                <div className="font-heading font-bold text-[15px] text-white leading-none">Eros Enterprises</div>
                <div className="text-[9px] text-[#F5A623] uppercase tracking-[0.1em]">Lighting with Purpose</div>
              </div>
            </div>
            <p className="text-[13px] text-[#8896AA] leading-[1.7] mb-4 max-w-[230px]">
              Mumbai's trusted partner for decorative lighting, security systems, smart automation, and AMC services since 2009.
            </p>
            <div className="space-y-1.5">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-[12px] text-[#8896AA] hover:text-white transition-colors">
                <span className="text-[#1565C0] text-[13px]">📞</span> {siteConfig.phone}
              </a>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} className="flex items-center gap-2 text-[12px] text-[#8896AA] hover:text-white transition-colors">
                <span className="text-[#25D366] text-[13px]">💬</span> {siteConfig.phone.replace("+91 ", "")} (WhatsApp)
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-[12px] text-[#8896AA] hover:text-white transition-colors">
                <span className="text-[#1565C0] text-[13px]">✉️</span> {siteConfig.email}
              </a>
              <div className="flex items-center gap-2 text-[12px] text-[#8896AA]">
                <span className="text-[#1565C0] text-[13px]">📍</span> Mumbai, Maharashtra
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#F5A623] mb-3">Services</div>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[#8896AA] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#F5A623] mb-3">Company</div>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[#8896AA] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#F5A623] mb-3">Support</div>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[#8896AA] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(255,255,255,0.05)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-[#5A6B82]">
            © {new Date().getFullYear()} Eros Enterprises. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-[#0F1F3D] border border-[rgba(21,101,192,0.2)] rounded-[7px] flex items-center justify-center text-[#8896AA] hover:text-white transition-colors">
              <IconInstagram />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-[#0F1F3D] border border-[rgba(21,101,192,0.2)] rounded-[7px] flex items-center justify-center text-[#8896AA] hover:text-white transition-colors">
              <IconFacebook />
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-[#0F1F3D] border border-[rgba(21,101,192,0.2)] rounded-[7px] flex items-center justify-center text-[#8896AA] hover:text-white transition-colors">
              <IconLinkedin />
            </a>
            <div className="w-8 h-8 bg-[#0F1F3D] border border-[rgba(21,101,192,0.2)] rounded-[7px] flex items-center justify-center text-[#8896AA]">
              <IconYoutube />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
