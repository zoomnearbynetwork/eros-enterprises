import { Card, CardContent } from "@/components/ui/card";

export function StatBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <Card className="rounded-[2rem] border border-white/10 bg-white/5 py-0 text-white shadow-none">
      <CardContent className="p-6">
        <div className="font-heading text-3xl font-medium text-amber-200">{value}</div>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{label}</p>
      </CardContent>
    </Card>
  );
}
