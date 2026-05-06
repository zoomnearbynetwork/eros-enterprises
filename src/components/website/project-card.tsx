import { Card, CardContent } from "@/components/ui/card";

export function ProjectCard({
  category,
  title,
  description,
}: {
  category: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 py-0 text-zinc-100 shadow-none">
      <div className="h-48 bg-[linear-gradient(135deg,rgba(245,158,11,0.3),rgba(245,158,11,0.06)_40%,rgba(24,24,27,0.7)),radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />
      <CardContent className="space-y-4 p-6">
        <div className="text-[11px] font-semibold tracking-[0.24em] text-amber-200 uppercase">
          {category}
        </div>
        <h3 className="font-heading text-2xl font-medium text-white">{title}</h3>
        <p className="text-sm leading-7 text-zinc-300">{description}</p>
      </CardContent>
    </Card>
  );
}
