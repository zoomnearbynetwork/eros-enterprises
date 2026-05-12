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
          className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)_48%,rgba(2,6,23,0.4))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.2)]"
        >
          <div className="text-sm font-semibold tracking-[0.28em] text-[#f6b11a] uppercase">
            {item.step}
          </div>
          <h3 className="mt-5 font-heading text-2xl font-medium text-white">
            {item.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#fff6d8]/72">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
