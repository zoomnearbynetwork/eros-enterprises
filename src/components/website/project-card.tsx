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
    <Card className="h-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.42))] py-0 text-zinc-100 shadow-[0_26px_90px_rgba(0,0,0,0.24)]">
      <div className="relative h-52 bg-[radial-gradient(circle_at_22%_24%,rgba(246,177,26,0.75),transparent_22%),radial-gradient(circle_at_82%_64%,rgba(0,152,255,0.5),transparent_28%),linear-gradient(135deg,#07111f,#020617)]">
        <div className="absolute inset-x-8 top-10 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="absolute left-8 right-8 top-16 h-16 rounded-full border-t border-[#f6b11a]/50 shadow-[0_-20px_50px_rgba(246,177,26,0.32)]" />
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="text-[11px] font-semibold tracking-[0.24em] text-[#f6b11a] uppercase">
          {category}
        </div>
        <h3 className="font-heading text-2xl font-medium text-white">{title}</h3>
        <p className="text-sm leading-7 text-[#fff6d8]/72">{description}</p>
      </CardContent>
    </Card>
  );
}
