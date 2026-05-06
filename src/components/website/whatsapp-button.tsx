import { MessageCircleMore } from "lucide-react";

import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:right-6 sm:bottom-6"
    >
      <MessageCircleMore className="size-5" />
      WhatsApp
    </a>
  );
}
