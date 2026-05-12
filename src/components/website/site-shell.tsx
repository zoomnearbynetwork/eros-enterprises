import type { ReactNode } from "react";

import { Footer } from "@/components/website/footer";
import { Navbar } from "@/components/website/navbar";
import { WhatsAppButton } from "@/components/website/whatsapp-button";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,152,255,0.18),_transparent_28%),radial-gradient(circle_at_80%_12%,_rgba(246,177,26,0.16),_transparent_20%),linear-gradient(180deg,_#020617,_#07111f_35%,_#020617_100%)]" />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
