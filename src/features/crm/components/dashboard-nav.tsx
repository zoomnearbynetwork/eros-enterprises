import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/site-visits", label: "Site Visits" },
  { href: "/dashboard/quotations", label: "Quotations" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/whatsapp", label: "WhatsApp" },
  { href: "/dashboard/automation", label: "Automation" },
];

export function DashboardNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 rounded-[1.75rem] border border-white/10 bg-black/20 p-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-3xl px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
