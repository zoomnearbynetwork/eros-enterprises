function DashboardLoadingCard({
  className,
}: {
  className?: string;
}) {
  return <div className={`rounded-[1.75rem] bg-white/8 ${className ?? ""}`.trim()} />;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-3">
        <DashboardLoadingCard className="h-6 w-28" />
        <DashboardLoadingCard className="h-12 w-56" />
        <DashboardLoadingCard className="h-5 max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <DashboardLoadingCard key={index} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardLoadingCard className="h-80" />
        <DashboardLoadingCard className="h-80" />
      </div>
    </div>
  );
}
