/**
 * MetricCard — Dashboard metric display component.
 * 
 * Displays a key metric with label, value, and optional trend indicator.
 * Designed for the Intelligence Center dashboard where data density
 * must be high but cognitive load must be low.
 */

'use client';

import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  /** Optional previous value to calculate trend */
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  className,
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400';

  return (
    <div className={cn(
      'bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && trendValue && (
            <div className={cn('flex items-center mt-2 text-xs font-medium', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5 mr-1" />
              {trendValue}
            </div>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}
