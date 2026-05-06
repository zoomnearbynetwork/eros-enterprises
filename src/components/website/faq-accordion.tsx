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
          className="group rounded-[1.75rem] border border-white/10 bg-white/4 px-6 py-5 text-zinc-100"
        >
          <summary className="cursor-pointer list-none pr-8 text-lg font-medium marker:hidden">
            <div className="flex items-start justify-between gap-4">
              <span>{item.question}</span>
              <span className="text-amber-200 transition group-open:rotate-45">+</span>
            </div>
          </summary>
          <p className="pt-4 text-sm leading-7 text-zinc-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
