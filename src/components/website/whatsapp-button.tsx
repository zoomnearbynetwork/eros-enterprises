import { MessageCircleMore } from "lucide-react";

import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="theme-transition fixed right-4 bottom-4 z-50 hidden items-center gap-3 rounded-full border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,#0047B3,#00A6FF)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,71,179,0.28)] hover:-translate-y-0.5 sm:right-6 sm:bottom-6 md:inline-flex"
    >
      <MessageCircleMore className="size-5 text-[#FFCC33]" />
      WhatsApp
    </a>
  );
}
