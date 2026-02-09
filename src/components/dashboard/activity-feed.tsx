/**
 * ActivityFeed — Real-time activity timeline.
 * 
 * Shows the most recent actions across the entire platform.
 * Each entry links to its source entity so users can quickly
 * navigate to what changed. The feed builds situational awareness
 * without requiring users to check each module individually.
 */

'use client';

import Link from 'next/link';
import { cn, formatRelativeTime, getInitials, stringToColor } from '@/lib/utils';
import {
  Building2,
  Search,
  Shield,
  HardHat,
  TrendingUp,
  Settings,
} from 'lucide-react';
import type { ActivityEntry } from '@/types';

const typeIcons = {
  property: Building2,
  inspection: Search,
  claim: Shield,
  contractor: HardHat,
  equity: TrendingUp,
  system: Settings,
};

const typeColors = {
  property: 'text-blue-600 bg-blue-50',
  inspection: 'text-amber-600 bg-amber-50',
  claim: 'text-violet-600 bg-violet-50',
  contractor: 'text-orange-600 bg-orange-50',
  equity: 'text-emerald-600 bg-emerald-50',
  system: 'text-slate-600 bg-slate-50',
};

interface ActivityFeedProps {
  activities: ActivityEntry[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
        <p className="text-xs text-slate-500 mt-0.5">Latest actions across all modules</p>
      </div>
      <div className="divide-y divide-slate-50">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          const colorClass = typeColors[activity.type];

          return (
            <div key={activity.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-3">
                {/* Icon */}
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold',
                      stringToColor(activity.userName)
                    )}>
                      {getInitials(activity.userName).charAt(0)}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {activity.userName} · {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Link */}
                {activity.entityUrl && (
                  <Link
                    href={activity.entityUrl}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex-shrink-0 self-center"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
