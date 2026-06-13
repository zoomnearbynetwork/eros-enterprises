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
      <Card className="premium-card theme-transition h-full rounded-[1.9rem] py-0 text-[color:var(--foreground)] duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-strong)]">
        <CardContent className="flex h-full flex-col gap-6 p-6">
          <div className="flex size-14 items-center justify-center rounded-[1.15rem] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(0,123,255,0.14),rgba(255,204,51,0.16))] text-[#0047B3] shadow-[0_0_28px_rgba(0,123,255,0.12)] dark:text-[#F5F7FA]">
            <WebsiteIcon name={icon} className="size-6" />
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
              {name}
            </h3>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{summary}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm font-medium">
            <span className="inline-flex items-center gap-2 text-[#F4A300]">
              Learn More
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
            <span className="text-[#007BFF]">Get Quote</span>
            <span className="text-[color:var(--muted-foreground)]">Book Visit</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
