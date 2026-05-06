import { WebsiteIcon } from "@/components/website/icon-map";

export function PainPoints({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-[2rem] border border-white/10 bg-white/4 p-6"
        >
          <WebsiteIcon name="star" className="size-5 text-amber-200" />
          <p className="mt-4 text-sm leading-7 text-zinc-300">{item}</p>
        </div>
      ))}
    </div>
  );
}
