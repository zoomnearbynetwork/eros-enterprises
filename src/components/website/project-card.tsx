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
    <Card className="premium-card theme-transition h-full overflow-hidden rounded-[1.9rem] py-0 text-[color:var(--foreground)] hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <div className="relative h-56 bg-[radial-gradient(circle_at_18%_18%,rgba(255,204,51,0.6),transparent_22%),radial-gradient(circle_at_82%_62%,rgba(0,166,255,0.45),transparent_28%),linear-gradient(135deg,#0A1B2E,#102B46)]">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute inset-x-8 top-10 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="absolute left-8 right-8 top-16 h-16 rounded-full border-t border-[#FFCC33]/60 shadow-[0_-20px_50px_rgba(255,204,51,0.28)]" />
        <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-white uppercase backdrop-blur">
          Signature Project
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="text-[11px] font-semibold tracking-[0.24em] text-[#F4A300] uppercase">
          {category}
        </div>
        <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{description}</p>
      </CardContent>
    </Card>
  );
}
