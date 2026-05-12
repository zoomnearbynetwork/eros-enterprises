import { Card, CardContent } from "@/components/ui/card";

export function StatBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <Card className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_45%,rgba(2,6,23,0.32))] py-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <CardContent className="p-6">
        <div className="font-heading text-4xl leading-none font-medium text-[#f6b11a]">{value}</div>
        <p className="mt-4 text-sm leading-7 text-[#fff6d8]/72">{label}</p>
      </CardContent>
    </Card>
  );
}
