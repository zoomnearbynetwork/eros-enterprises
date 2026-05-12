import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { WebsiteIcon } from "@/components/website/icon-map";
import type { IconKey } from "@/content/website";

export function ServiceCard({
  href,
  name,
  summary,
  icon,
}: {
  href: string;
  name: string;
  summary: string;
  icon: IconKey;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full rounded-[1.9rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.4))] py-0 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1.5 hover:border-[#f6b11a]/34">
        <CardContent className="flex h-full flex-col gap-6 p-6">
          <div className="flex size-14 items-center justify-center rounded-[1.15rem] border border-[#f6b11a]/20 bg-[linear-gradient(135deg,rgba(246,177,26,0.2),rgba(0,152,255,0.16))] text-[#fff6d8] shadow-[0_0_28px_rgba(0,152,255,0.12)]">
            <WebsiteIcon name={icon} className="size-6" />
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl font-medium text-white">{name}</h3>
            <p className="text-sm leading-7 text-[#fff6d8]/72">{summary}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm font-medium">
            <span className="inline-flex items-center gap-2 text-[#f6b11a]">
              Learn More
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
            <span className="text-[#0098ff]">Get Quote</span>
            <span className="text-white/70">Book Visit</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
