import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/crm/constants";
import { numberFormatter } from "@/features/crm/utils";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { getCustomers } from "@/features/customers/repository";

export const dynamic = "force-dynamic";

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardCustomersPage(
  props: PageProps<"/dashboard/customers">,
) {
  const searchParams = await props.searchParams;
  const filters = {
    query: getStringParam(searchParams.query),
    status: getStringParam(searchParams.status),
    type: getStringParam(searchParams.type),
  };

  const customers = await getCustomers(filters);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">CRM</div>
        <h1 className="mt-3 font-heading text-4xl text-white">Customers</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Converted leads, retained customers, and all future commercial modules start here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total customers" value={numberFormatter.format(customers.length)} />
        <MetricCard label="Active" value={numberFormatter.format(customers.filter((item) => item.status === "ACTIVE").length)} />
        <MetricCard label="From leads" value={numberFormatter.format(customers.filter((item) => item.lead).length)} />
      </div>

      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="query"
          defaultValue={filters.query}
          placeholder="Search number, name, phone, email"
          className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-zinc-500 xl:col-span-2"
        />
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All statuses</option>
          {CUSTOMER_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#101113]">
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={filters.type ?? ""} className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
          <option value="" className="bg-[#101113]">All types</option>
          {CUSTOMER_TYPES.map((type) => (
            <option key={type} value={type} className="bg-[#101113]">
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <div className="flex gap-2 xl:col-span-4">
          <button
            type="submit"
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(245,199,107,0.96),rgba(216,145,56,0.88))] px-4 py-2 text-sm font-medium text-black"
          >
            Apply Filters
          </button>
          <Link
            href="/dashboard/customers"
            className="rounded-3xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Reset
          </Link>
        </div>
      </form>

      {customers.length > 0 ? (
        <CustomerTable customers={customers} />
      ) : (
        <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
          <CardContent className="p-10 text-center text-zinc-400">
            No customers yet. Convert a lead to customer from the lead detail page to start building the customer base.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-white/10 bg-[#101113]/92 py-0 shadow-none">
      <CardContent className="p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="mt-4 font-heading text-4xl text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
