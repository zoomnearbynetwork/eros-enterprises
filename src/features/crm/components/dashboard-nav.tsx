"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/site-visits", label: "Site Visits" },
  { href: "/dashboard/quotations", label: "Quotations" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/amc", label: "AMC" },
  { href: "/dashboard/whatsapp", label: "WhatsApp" },
  { href: "/dashboard/automation", label: "Automation" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 overflow-x-auto rounded-[1.75rem] border border-white/10 bg-black/20 p-2">
      <div className="flex min-w-max flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "page"
                : undefined
            }
            className={cn(
              "rounded-3xl px-4 py-2 text-sm transition",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-white/10 text-white"
                : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
