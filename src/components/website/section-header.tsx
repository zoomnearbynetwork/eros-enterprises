import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-300/8 px-4 py-1 text-[11px] font-semibold tracking-[0.28em] text-amber-200 uppercase">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="font-heading text-3xl leading-tight font-medium text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-zinc-300 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
