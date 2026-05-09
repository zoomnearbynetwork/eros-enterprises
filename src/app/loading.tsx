function LoadingBlock({ className }: { className?: string }) {
  return <div className={`rounded-3xl bg-white/8 ${className ?? ""}`.trim()} />;
}

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-4">
        <LoadingBlock className="h-6 w-40" />
        <LoadingBlock className="h-16 max-w-3xl" />
        <LoadingBlock className="h-24 max-w-4xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <LoadingBlock className="h-72" />
        <LoadingBlock className="h-72" />
        <LoadingBlock className="h-72" />
      </div>
    </div>
  );
}
