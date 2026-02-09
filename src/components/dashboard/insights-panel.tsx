/**
 * InsightsPanel — ATOS intelligence insights display.
 * 
 * Shows proactive insights sorted by severity. Critical items
 * appear first because they demand immediate attention.
 * This panel is what makes the dashboard feel "intelligent" —
 * it doesn't just display data, it interprets it.
 */

'use client';

import { useState } from 'react';
import { InsightCard } from '@/components/ui/insight-card';
import { Brain } from 'lucide-react';
import type { AtosInsight } from '@/types';

interface InsightsPanelProps {
  insights: AtosInsight[];
}

const severityOrder = { critical: 0, warning: 1, opportunity: 2, info: 3 };

export function InsightsPanel({ insights: initialInsights }: InsightsPanelProps) {
  const [insights, setInsights] = useState(initialInsights);

  const visibleInsights = insights
    .filter(i => !i.dismissed)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const handleDismiss = (id: string) => {
    setInsights(prev =>
      prev.map(i => (i.id === id ? { ...i, dismissed: true } : i))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">ATOS Insights</h3>
            <p className="text-xs text-slate-500">
              {visibleInsights.filter(i => i.severity === 'critical').length} critical · {' '}
              {visibleInsights.filter(i => i.severity === 'warning').length} warnings · {' '}
              {visibleInsights.filter(i => i.severity === 'opportunity').length} opportunities
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {visibleInsights.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No active insights. ATOS is monitoring your portfolio.
          </p>
        ) : (
          visibleInsights.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}
