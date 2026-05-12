"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/website/footer";
import { Navbar } from "@/components/website/navbar";
import { WhatsAppButton } from "@/components/website/whatsapp-button";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = !pathname.startsWith("/dashboard");

  if (!isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_0%,rgba(0,152,255,0.12),transparent_24%),radial-gradient(circle_at_85%_8%,rgba(246,177,26,0.12),transparent_20%),linear-gradient(180deg,#020617,#07111f_34%,#020617)]" />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(0,152,255,0.2),transparent_23%),radial-gradient(circle_at_88%_10%,rgba(246,177,26,0.22),transparent_18%),radial-gradient(circle_at_50%_28%,rgba(0,91,207,0.1),transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_36%,#020617_100%)]" />
        <div className="absolute inset-x-[-10%] top-24 h-52 rotate-[-7deg] bg-[linear-gradient(90deg,transparent,rgba(246,177,26,0.08),rgba(255,138,0,0.2),rgba(0,152,255,0.08),transparent)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(2,6,23,0.4)_100%)]" />
      </div>
      <Navbar />
      <main className={cn("relative")}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
