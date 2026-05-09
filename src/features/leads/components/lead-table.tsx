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
import type { LeadListItem } from "@/features/leads/types";
import {
  LeadPriorityBadge,
  LeadStatusBadge,
} from "@/features/leads/components/lead-status-badge";
import { LEAD_SOURCE_LABELS } from "@/features/leads/constants";
import { formatPersonName } from "@/features/crm/utils";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function LeadTable({ leads }: { leads: LeadListItem[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101113]/90 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
      <Table className="min-w-[1180px]">
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Lead Number
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Name
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Phone
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Service
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Source
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Status
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Priority
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Assigned User
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
          {leads.map((lead) => (
            <TableRow key={lead.id} className="border-white/8 hover:bg-white/[0.03]">
              <TableCell className="px-6 py-5 align-top whitespace-normal">
                <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/80">
                  {lead.leadNumber}
                </div>
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal">
                <div className="font-medium text-white">{lead.name}</div>
                <div className="mt-1 text-sm text-zinc-500">{lead.email ?? "No email provided"}</div>
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal text-zinc-300">
                {lead.phone}
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal text-zinc-200">
                <div className="font-medium text-white">{lead.serviceInterest}</div>
                <div className="mt-1 text-sm text-zinc-500">{lead.ctaLocation}</div>
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal">
                <div className="text-white">{LEAD_SOURCE_LABELS[lead.source]}</div>
                <div className="mt-1 text-sm text-zinc-500">{lead.sourcePage}</div>
              </TableCell>
              <TableCell className="px-3 py-5 align-top">
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="px-3 py-5 align-top">
                <LeadPriorityBadge priority={lead.priority} />
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal">
                <div className="text-white">{formatPersonName(lead.assignedTo)}</div>
                <div className="mt-1 text-sm text-zinc-500">{lead.location ?? "Location not provided"}</div>
              </TableCell>
              <TableCell className="px-3 py-5 align-top whitespace-normal text-zinc-400">
                {dateFormatter.format(lead.createdAt)}
              </TableCell>
              <TableCell className="px-3 py-5 align-top">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/leads/${lead.id}`}>View Lead</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
