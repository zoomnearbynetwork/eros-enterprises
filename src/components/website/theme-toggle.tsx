"use client";

import { useTheme } from "@/components/website/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative w-[56px] h-[28px] rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: theme === "dark"
          ? "rgba(21,101,192,0.25)"
          : "rgba(21,101,192,0.15)",
        border: theme === "dark"
          ? "1px solid rgba(21,101,192,0.4)"
          : "1px solid rgba(21,101,192,0.3)",
      }}
    >
      {/* Track icons */}
      <span className="absolute left-[6px] top-1/2 -translate-y-1/2 text-[12px] select-none">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[12px] select-none opacity-40">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
      {/* Knob */}
      <span
        className="absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md transition-all duration-300 flex items-center justify-center text-[11px]"
        style={{
          left: theme === "dark" ? "calc(100% - 25px)" : "3px",
          background: theme === "dark" ? "#1565C0" : "#F5A623",
          color: "#fff",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
