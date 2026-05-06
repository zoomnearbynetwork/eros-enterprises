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
      <Card className="h-full rounded-[2rem] border border-white/10 bg-white/5 py-0 text-zinc-100 shadow-none transition duration-300 hover:-translate-y-1 hover:border-amber-300/35 hover:bg-white/7">
        <CardContent className="flex h-full flex-col gap-6 p-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-300/12 text-amber-200">
            <WebsiteIcon name={icon} className="size-6" />
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl font-medium text-white">{name}</h3>
            <p className="text-sm leading-7 text-zinc-300">{summary}</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-sm font-medium text-amber-200">
            Explore service
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
