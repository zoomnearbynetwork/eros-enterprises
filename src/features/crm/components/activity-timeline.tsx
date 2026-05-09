import type { ActivityType } from "@prisma/client";

import { ACTIVITY_TYPE_LABELS } from "@/features/crm/constants";
import { dateTimeFormatter, formatPersonName } from "@/features/crm/utils";

type ActivityItem = {
  id: string;
  type: ActivityType;
  action: string;
  description: string | null;
  occurredAt: Date;
  user: {
    firstName: string;
    lastName: string | null;
  } | null;
};

export function ActivityTimeline({
  activities,
  emptyMessage,
}: {
  activities: ActivityItem[];
  emptyMessage: string;
}) {
  if (activities.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-amber-200/90">
              {ACTIVITY_TYPE_LABELS[activity.type]}
            </div>
            <div className="text-xs text-zinc-500">{dateTimeFormatter.format(activity.occurredAt)}</div>
          </div>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {activity.description ?? activity.action.replaceAll("_", " ")}
          </p>
          <div className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
            {activity.user ? `By ${formatPersonName(activity.user)}` : "System recorded"}
          </div>
        </div>
      ))}
    </div>
  );
}
