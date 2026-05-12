import { MessageCircleMore } from "lucide-react";

import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-3 rounded-full border border-[#f6b11a]/18 bg-[linear-gradient(135deg,#0b162c,#07111f)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,152,255,0.1)] transition hover:-translate-y-0.5 hover:border-[#0098ff]/24 sm:right-6 sm:bottom-6"
    >
      <MessageCircleMore className="size-5 text-[#f6b11a]" />
      WhatsApp
    </a>
  );
}
