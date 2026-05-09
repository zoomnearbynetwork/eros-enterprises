import type { ReactNode } from "react";

import { DashboardNav } from "@/features/crm/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(245,199,107,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_36px_120px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10">
        <DashboardNav />
        {children}
      </div>
    </div>
  );
}
