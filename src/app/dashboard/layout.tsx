import type { ReactNode } from "react";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

import { DashboardNav } from "@/features/crm/components/dashboard-nav";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  let authorized = false;
  if (authHeader?.startsWith("Basic ")) {
    const base64 = authHeader.slice(6);
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(":");
    if (colonIndex !== -1) {
      const user = decoded.slice(0, colonIndex);
      const pass = decoded.slice(colonIndex + 1);
      const expectedUser = process.env.DASHBOARD_USER ?? "";
      const expectedPass = process.env.DASHBOARD_PASSWORD ?? "";
      if (
        expectedUser.length > 0 &&
        expectedPass.length > 0 &&
        timingSafeEqual(user, expectedUser) &&
        timingSafeEqual(pass, expectedPass)
      ) {
        authorized = true;
      }
    }
  }

  if (!authorized) {
    unauthorized();
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:px-8 lg:px-10">
      <div className="rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(245,199,107,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_36px_120px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10">
        <DashboardNav />
        {children}
      </div>
    </div>
  );
}
