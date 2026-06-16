"use client";

import dynamic from "next/dynamic";

const QuoteFormLazy = dynamic(
  () => import("@/components/website/quote-form").then((m) => m.QuoteForm),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-[20px] overflow-hidden animate-pulse w-full"
        style={{
          background: "rgba(10,22,40,0.92)",
          border: "1px solid rgba(21,101,192,0.25)",
          minHeight: "460px",
        }}
      />
    ),
  }
);

export function HeroQuoteForm({
  sourcePage,
  compact,
}: {
  sourcePage: string;
  compact: boolean;
}) {
  return <QuoteFormLazy sourcePage={sourcePage} compact={compact} />;
}
