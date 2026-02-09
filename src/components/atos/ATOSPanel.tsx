/**
 * ATOS Panel Component
 * 
 * The primary interface for ATOS guidance. Shows contextual intelligence,
 * suggested actions, risks, and opportunities.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ATOSGuidance } from '@/types';
import clsx from 'clsx';

interface ATOSPanelProps {
  guidance: ATOSGuidance;
  onActionClick?: (action: string) => void;
  compact?: boolean;
}

export function ATOSPanel({ guidance, onActionClick, compact = false }: ATOSPanelProps) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <Card className={clsx('border-blue-200 bg-blue-50/50 shadow-atos', compact ? 'p-4' : 'p-6')}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-brand-primary">ATOS Intelligence</h3>
            <p className="text-xs text-brand-muted">Forensic guidance powered by AI</p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-brand-muted hover:text-brand-primary transition-colors"
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>

      {expanded && (
        <>
          {/* Main Guidance */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-brand-primary mb-2">Guidance</h4>
            <p className="text-slate-700 leading-relaxed">{guidance.guidance}</p>
          </div>

          {/* Reasoning */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-brand-primary mb-2">Why This Matters</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{guidance.reasoning}</p>
          </div>

          {/* Suggested Actions */}
          {guidance.suggestedActions && guidance.suggestedActions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-brand-primary mb-2">Suggested Actions</h4>
              <div className="space-y-2">
                {guidance.suggestedActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          action.priority === 'HIGH'
                            ? 'danger'
                            : action.priority === 'MEDIUM'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {action.priority}
                      </Badge>
                      <span className="text-sm text-slate-700">{action.label}</span>
                    </div>
                    {onActionClick && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onActionClick(action.action)}
                      >
                        Act
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {guidance.risks && guidance.risks.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-brand-primary mb-2 flex items-center gap-2">
                <span className="text-brand-danger">⚠</span> Risks to Watch
              </h4>
              <ul className="space-y-1.5">
                {guidance.risks.map((risk, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-brand-danger mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities */}
          {guidance.opportunities && guidance.opportunities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-brand-primary mb-2 flex items-center gap-2">
                <span className="text-brand-success">✓</span> Opportunities
              </h4>
              <ul className="space-y-1.5">
                {guidance.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-brand-success mt-0.5">•</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
