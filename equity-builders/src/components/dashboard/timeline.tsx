"use client";

/**
 * Evidence & Documentation Timeline.
 * 
 * Shows a chronological view of all events across properties.
 * Each event type gets a distinct visual treatment to allow
 * quick scanning of the forensic documentation trail.
 */

import {
  Search,
  FileText,
  Shield,
  Camera,
  HardHat,
  Milestone,
  Brain,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { timelineEvents } from "@/lib/mock-data";
import type { TimelineEvent } from "@/types";

const eventTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  inspection: {
    icon: <Search className="w-3.5 h-3.5" />,
    color: "bg-brand-500/20 text-brand-400 border-brand-500/30",
  },
  claim: {
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "bg-alert-500/20 text-alert-400 border-alert-500/30",
  },
  evidence: {
    icon: <Camera className="w-3.5 h-3.5" />,
    color: "bg-forensic-500/20 text-forensic-400 border-forensic-500/30",
  },
  contractor: {
    icon: <HardHat className="w-3.5 h-3.5" />,
    color: "bg-navy-500/20 text-navy-300 border-navy-500/30",
  },
  milestone: {
    icon: <Milestone className="w-3.5 h-3.5" />,
    color: "bg-forensic-500/20 text-forensic-400 border-forensic-500/30",
  },
  atos_insight: {
    icon: <Brain className="w-3.5 h-3.5" />,
    color: "bg-brand-400/20 text-brand-300 border-brand-400/30",
  },
};

function TimelineItem({ event }: { event: TimelineEvent }) {
  const config = eventTypeConfig[event.type] || eventTypeConfig.milestone;

  return (
    <div className="flex gap-3 group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0",
            config.color,
          )}
        >
          {config.icon}
        </div>
        <div className="w-px flex-1 bg-navy-700/50 mt-1" />
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-medium text-white truncate">
            {event.title}
          </h4>
        </div>
        <p className="text-xs text-navy-400 leading-relaxed">
          {event.description}
        </p>
        <p className="text-[11px] text-navy-500 mt-1">
          {timeAgo(event.timestamp)}
        </p>
      </div>
    </div>
  );
}

interface TimelineProps {
  propertyId?: string;
  limit?: number;
}

export function Timeline({ propertyId, limit }: TimelineProps) {
  let events = timelineEvents;
  
  if (propertyId) {
    events = events.filter((e) => e.propertyId === propertyId);
  }

  if (limit) {
    events = events.slice(0, limit);
  }

  return (
    <Card>
      <div className="px-5 py-4 border-b border-navy-700/50">
        <h3 className="text-sm font-semibold text-white">Documentation Timeline</h3>
        <p className="text-xs text-navy-400 mt-0.5">
          Chronological forensic documentation trail
        </p>
      </div>
      <div className="p-4">
        {events.map((event) => (
          <TimelineItem key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-navy-600 mx-auto mb-2" />
            <p className="text-sm text-navy-400">No timeline events yet</p>
          </div>
        )}
      </div>
    </Card>
  );
}
