import type { ReactNode } from "react";

import { Footer } from "@/components/website/footer";
import { Navbar } from "@/components/website/navbar";
import { WhatsAppButton } from "@/components/website/whatsapp-button";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.07),_transparent_18%),linear-gradient(180deg,_#050505,_#09090b_24%,_#0f0f12_100%)]" />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
