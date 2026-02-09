/**
 * InsightCard — ATOS intelligence insight component.
 * 
 * Displays proactive insights from ATOS with severity-based
 * visual treatment. Critical items demand attention, opportunities
 * invite exploration. Every insight links to an actionable destination.
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Lightbulb, X } from 'lucide-react';
import type { AtosInsight } from '@/types';

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    label: 'Critical',
    labelBg: 'bg-red-100 text-red-700',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900',
    label: 'Warning',
    labelBg: 'bg-amber-100 text-amber-700',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    label: 'Info',
    labelBg: 'bg-blue-100 text-blue-700',
  },
  opportunity: {
    icon: Lightbulb,
    bg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-900',
    label: 'Opportunity',
    labelBg: 'bg-emerald-100 text-emerald-700',
  },
};

interface InsightCardProps {
  insight: AtosInsight;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

export function InsightCard({ insight, onDismiss, compact = false }: InsightCardProps) {
  const config = severityConfig[insight.severity];
  const Icon = config.icon;

  return (
    <div className={cn('relative rounded-lg border p-4', config.bg)}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', config.labelBg)}>
              {config.label}
            </span>
          </div>
          <h4 className={cn('text-sm font-semibold', config.titleColor)}>
            {insight.title}
          </h4>
          {!compact && (
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              {insight.description}
            </p>
          )}
          {insight.actionLabel && insight.actionUrl && (
            <Link
              href={insight.actionUrl}
              className={cn(
                'inline-flex items-center mt-2.5 text-sm font-medium',
                config.iconColor,
                'hover:underline'
              )}
            >
              {insight.actionLabel} →
            </Link>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss(insight.id)}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Dismiss insight"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}
