import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  href = "/",
  className,
}: {
  compact?: boolean;
  href?: string;
  className?: string;
}) {
  const content = (
    <div className={cn("flex min-w-0 items-center", className)}>
      <div className="theme-transition relative overflow-hidden rounded-[1.25rem] border border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-2 py-1.5 shadow-[var(--shadow-soft)]">
        <Image
          src="/logo.png"
          alt="EROS Enterprises"
          width={560}
          height={320}
          priority
          className={cn(
            "h-auto object-contain",
            compact ? "w-[7.25rem] min-w-[7.25rem]" : "w-[11.5rem] min-w-[11.5rem] sm:w-[13rem]",
          )}
        />
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
