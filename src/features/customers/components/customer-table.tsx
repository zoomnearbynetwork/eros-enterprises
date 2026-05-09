import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CustomerStatusBadge,
  CustomerTypeBadge,
} from "@/features/crm/components/status-badges";
import { shortDateFormatter } from "@/features/crm/utils";
import type { getCustomers } from "@/features/customers/repository";

type CustomerListItem = Awaited<ReturnType<typeof getCustomers>>[number];

export function CustomerTable({ customers }: { customers: CustomerListItem[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101113]/90 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
      <Table className="min-w-[1080px]">
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Customer Number
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Name
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Phone
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Email
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Type
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Status
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Source Lead
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Created
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="border-white/8 hover:bg-white/[0.03]">
              <TableCell className="px-6 py-5 text-[11px] uppercase tracking-[0.2em] text-amber-200/80">
                {customer.customerNumber}
              </TableCell>
              <TableCell className="px-3 py-5 whitespace-normal">
                <div className="font-medium text-white">{customer.legalName}</div>
                <div className="mt-1 text-sm text-zinc-500">
                  {customer.primaryContactName ?? "Primary contact not set"}
                </div>
              </TableCell>
              <TableCell className="px-3 py-5 text-zinc-300">{customer.phone ?? "Not provided"}</TableCell>
              <TableCell className="px-3 py-5 text-zinc-300">{customer.email ?? "Not provided"}</TableCell>
              <TableCell className="px-3 py-5">
                <CustomerTypeBadge type={customer.type} />
              </TableCell>
              <TableCell className="px-3 py-5">
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
              <TableCell className="px-3 py-5 whitespace-normal text-zinc-300">
                {customer.lead ? `${customer.lead.leadNumber} | ${customer.lead.name}` : "Direct customer"}
              </TableCell>
              <TableCell className="px-3 py-5 text-zinc-400">
                {shortDateFormatter.format(customer.createdAt)}
              </TableCell>
              <TableCell className="px-3 py-5">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/customers/${customer.id}`}>View Customer</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
