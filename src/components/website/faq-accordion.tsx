export function FaqAccordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <details
          key={item.question}
          className="premium-card theme-transition group rounded-[1.75rem] px-6 py-5 text-[color:var(--foreground)]"
        >
          <summary className="cursor-pointer list-none pr-8 text-lg font-medium marker:hidden">
            <div className="flex items-start justify-between gap-4">
              <span>{item.question}</span>
              <span className="text-[#F4A300] transition group-open:rotate-45">+</span>
            </div>
          </summary>
          <p className="pt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
