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
    <Card className="premium-card h-full rounded-[1.9rem] py-0 text-[color:var(--foreground)]">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <WebsiteIcon name="quote" className="size-7 text-[#F4A300]" />
        <p className="text-base leading-8 text-[color:var(--foreground)]/82">{quote}</p>
        <div className="mt-auto space-y-1 border-t border-[color:var(--border)] pt-5">
          <div className="font-semibold text-[color:var(--foreground)]">{name}</div>
          <div className="text-sm text-[#007BFF]">{role}</div>
        </div>
      </CardContent>
    </Card>
  );
}
