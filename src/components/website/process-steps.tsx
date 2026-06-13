export function ProcessSteps({
  steps,
}: {
  steps: Array<{ step: string; title: string; description: string }>;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {steps.map((item) => (
        <div
          key={item.step}
          className="premium-card relative rounded-[1.8rem] p-6"
        >
          <div className="absolute right-5 top-5 text-5xl font-semibold text-[color:var(--border-strong)]">
            {item.step}
          </div>
          <div className="text-sm font-semibold tracking-[0.28em] text-[#F4A300] uppercase">
            {item.step}
          </div>
          <h3 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
            {item.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
