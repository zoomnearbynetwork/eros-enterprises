import { Card, CardContent } from "@/components/ui/card";

export function StatBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <Card className="premium-card rounded-[1.8rem] py-0 text-[color:var(--foreground)]">
      <CardContent className="p-6">
        <div className="headline-gradient font-heading text-4xl leading-none font-semibold">
          {value}
        </div>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{label}</p>
      </CardContent>
    </Card>
  );
}
