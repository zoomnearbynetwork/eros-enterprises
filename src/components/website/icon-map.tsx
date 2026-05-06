import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  Cable,
  Cpu,
  Gauge,
  House,
  PhoneCall,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Workflow,
} from "lucide-react";

import type { IconKey } from "@/content/website";
import { cn } from "@/lib/utils";

const iconMap: Record<IconKey, LucideIcon> = {
  badge: BadgeCheck,
  building: Building2,
  cable: Cable,
  cpu: Cpu,
  house: House,
  leaf: Gauge,
  panel: BadgeCheck,
  phone: PhoneCall,
  quote: Quote,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  clock: TimerReset,
  workflow: Workflow,
};

export function WebsiteIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const Icon = iconMap[name];

  return <Icon className={cn("size-5", className)} aria-hidden="true" />;
}
