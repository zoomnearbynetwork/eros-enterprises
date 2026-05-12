import { Card, CardContent } from "@/components/ui/card";
import { WebsiteIcon } from "@/components/website/icon-map";

export function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <Card className="h-full rounded-[1.9rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.38))] py-0 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <WebsiteIcon name="quote" className="size-7 text-[#f6b11a]" />
        <p className="text-base leading-8 text-[#fff6d8]/82">{quote}</p>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-5">
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-[#0098ff]">{role}</div>
        </div>
      </CardContent>
    </Card>
  );
}
