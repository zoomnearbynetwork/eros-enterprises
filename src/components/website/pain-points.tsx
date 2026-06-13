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
          className="premium-card rounded-[1.8rem] p-6"
        >
          <WebsiteIcon name="star" className="size-5 text-[#F4A300]" />
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{item}</p>
        </div>
      ))}
    </div>
  );
}
