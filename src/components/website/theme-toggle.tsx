"use client";

import { MonitorCog, MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/website/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={cn(
        "theme-transition relative size-11 rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] shadow-[var(--shadow-soft)] hover:bg-[color:var(--surface-accent)]",
        className,
      )}
    >
      <SunMedium
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <MoonStar
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
      <MonitorCog className="sr-only" />
    </Button>
  );
}
