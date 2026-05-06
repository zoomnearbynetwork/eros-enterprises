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
          className="rounded-[2rem] border border-white/10 bg-white/4 p-6"
        >
          <div className="text-sm font-semibold tracking-[0.28em] text-amber-200 uppercase">
            {item.step}
          </div>
          <h3 className="mt-5 font-heading text-2xl font-medium text-white">
            {item.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
