import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn("relative py-18 sm:py-22 lg:py-28", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {children}
      </div>
    </section>
  );
}
