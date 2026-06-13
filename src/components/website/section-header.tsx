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
            "premium-chip inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.3em] uppercase",
            theme === "dark"
              ? "text-[color:var(--foreground)]"
              : "text-[#0047B3]"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-4">
        <h2
          className={cn(
            "font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl",
            theme === "dark" ? "text-[color:var(--foreground)]" : "text-[#091221]"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-3xl text-base leading-8 sm:text-lg",
              theme === "dark" ? "text-[color:var(--muted-foreground)]" : "text-[#5A6D84]"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
