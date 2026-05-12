import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-4xl space-y-5",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.28em] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            theme === "dark"
              ? "border border-[#f6b11a]/22 bg-[linear-gradient(135deg,rgba(246,177,26,0.16),rgba(0,152,255,0.1))] text-[#fff6d8]"
              : "border border-[#f6b11a]/18 bg-[linear-gradient(135deg,rgba(246,177,26,0.12),rgba(0,152,255,0.08))] text-[#005bcf]"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-4">
        <h2
          className={cn(
            "font-heading text-4xl leading-[1.04] font-medium sm:text-5xl lg:text-6xl",
            theme === "dark" ? "text-white" : "text-[#07111f]"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-3xl text-base leading-8 sm:text-lg",
              theme === "dark" ? "text-[#fff6d8]/72" : "text-slate-600"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
