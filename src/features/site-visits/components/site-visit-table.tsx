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
import { SiteVisitStatusBadge } from "@/features/crm/components/status-badges";
import { dateTimeFormatter, formatPersonName } from "@/features/crm/utils";
import type { getSiteVisits } from "@/features/site-visits/repository";

type SiteVisitListItem = Awaited<ReturnType<typeof getSiteVisits>>[number];

export function SiteVisitTable({ siteVisits }: { siteVisits: SiteVisitListItem[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101113]/90 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
      <Table className="min-w-[1160px]">
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Visit Number
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Lead / Customer
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Service
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Scheduled
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Address
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Assigned Engineer
            </TableHead>
            <TableHead className="px-3 py-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Status
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
          {siteVisits.map((siteVisit) => (
            <TableRow key={siteVisit.id} className="border-white/8 hover:bg-white/[0.03]">
              <TableCell className="px-6 py-5 text-[11px] uppercase tracking-[0.2em] text-amber-200/80">
                {siteVisit.visitNumber}
              </TableCell>
              <TableCell className="px-3 py-5 whitespace-normal">
                <div className="font-medium text-white">
                  {siteVisit.customer?.legalName ?? siteVisit.lead?.name ?? "Unlinked visit"}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {siteVisit.customer?.customerNumber ?? siteVisit.lead?.leadNumber ?? "No reference"}
                </div>
              </TableCell>
              <TableCell className="px-3 py-5 text-zinc-300">{siteVisit.serviceInterest}</TableCell>
              <TableCell className="px-3 py-5 text-zinc-300">
                {dateTimeFormatter.format(siteVisit.scheduledAt)}
              </TableCell>
              <TableCell className="px-3 py-5 whitespace-normal text-zinc-300">{siteVisit.address}</TableCell>
              <TableCell className="px-3 py-5 whitespace-normal text-zinc-300">
                {formatPersonName(siteVisit.assignedEngineer)}
              </TableCell>
              <TableCell className="px-3 py-5">
                <SiteVisitStatusBadge status={siteVisit.status} />
              </TableCell>
              <TableCell className="px-3 py-5 text-zinc-400">
                {dateTimeFormatter.format(siteVisit.createdAt)}
              </TableCell>
              <TableCell className="px-3 py-5">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/site-visits/${siteVisit.id}`}>View Visit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
