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
    <Card className="h-full rounded-[2rem] border border-white/10 bg-white/5 py-0 text-zinc-100 shadow-none">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <WebsiteIcon name="quote" className="size-6 text-amber-200" />
        <p className="text-base leading-8 text-zinc-200">{quote}</p>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-5">
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-zinc-400">{role}</div>
        </div>
      </CardContent>
    </Card>
  );
}
