"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";
import { MessageCircleMore, PhoneCall } from "lucide-react";

import { Footer } from "@/components/website/footer";
import { Navbar } from "@/components/website/navbar";
import { WhatsAppButton } from "@/components/website/whatsapp-button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = !pathname.startsWith("/dashboard");

  if (!isPublicRoute) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[var(--shell-gradient)]" />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--shell-gradient)]" />
        <div className="absolute inset-x-[-10%] top-24 h-52 rotate-[-7deg] bg-[linear-gradient(90deg,transparent,rgba(255,204,51,0.08),rgba(244,163,0,0.16),rgba(0,166,255,0.08),transparent)] blur-3xl" />
        <div className="site-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(6,17,31,0.08)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_46%,rgba(6,17,31,0.4)_100%)]" />
      </div>
      <Navbar />
      <main className={cn("relative pb-24 md:pb-0")}>{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileLeadBar />
    </div>
  );
}

function MobileLeadBar() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="premium-card-strong flex items-center gap-2 rounded-full px-3 py-2">
        <a
          href={`tel:${siteConfig.phone}`}
          className="theme-transition inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0047B3,#00A6FF)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(0,123,255,0.24)]"
        >
          <PhoneCall className="size-4" />
          Call
        </a>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          className="theme-transition inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] px-4 py-3 text-sm font-semibold text-[#06111f] shadow-[0_16px_35px_rgba(244,163,0,0.24)]"
        >
          <MessageCircleMore className="size-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
