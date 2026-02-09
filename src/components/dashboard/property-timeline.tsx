import {
  Cloud,
  Building2,
  Search,
  CheckCircle2,
  FileText,
  AlertTriangle,
  DollarSign,
  HardHat,
  Brain,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

/**
 * PropertyTimeline — Evidence-grade event timeline.
 *
 * Every event in the lifecycle is documented.
 * The timeline serves dual purposes:
 * 1. User awareness — what happened and when
 * 2. Audit trail — defensible record of all actions
 *
 * Color-coded by event type for instant visual parsing.
 */
interface PropertyTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const eventTypeConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  storm_event: { icon: Cloud, color: "text-red-500", bg: "bg-red-50" },
  property_intake: { icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
  inspection_scheduled: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  inspection_completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  claim_filed: { icon: FileText, color: "text-violet-500", bg: "bg-violet-50" },
  carrier_inspection: { icon: Search, color: "text-orange-500", bg: "bg-orange-50" },
  claim_update: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  supplement_filed: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  restoration_started: { icon: HardHat, color: "text-orange-500", bg: "bg-orange-50" },
  atos_insight: { icon: Brain, color: "text-violet-500", bg: "bg-violet-50" },
  payment_received: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
};

export function PropertyTimeline({
  events,
  title = "Recent Activity",
}: PropertyTimelineProps) {
  return (
    <Card title={title} description="Complete event timeline">
      <div className="space-y-0">
        {events.map((event, index) => {
          const config = eventTypeConfig[event.type] || {
            icon: Clock,
            color: "text-slate-500",
            bg: "bg-slate-50",
          };
          const Icon = config.icon;
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="flex gap-3">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-slate-200 my-1" />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 min-w-0 pb-5", isLast && "pb-0")}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {event.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(event.date)}
                  </span>
                  {event.actorName && (
                    <>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">
                        {event.actorName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
