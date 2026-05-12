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
          className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.4))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.2)]"
        >
          <WebsiteIcon name="star" className="size-5 text-[#f6b11a]" />
          <p className="mt-4 text-sm leading-7 text-[#fff6d8]/72">{item}</p>
        </div>
      ))}
    </div>
  );
}
