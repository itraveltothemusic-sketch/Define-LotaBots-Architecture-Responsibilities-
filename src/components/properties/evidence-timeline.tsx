/**
 * EvidenceTimeline — Chronological evidence display.
 * 
 * Displays all evidence and events for a property in chronological order.
 * Every event is treated as an immutable forensic record with timestamps,
 * attribution, and categorization.
 * 
 * This is the "audit trail" that gives the platform its forensic authority.
 */

'use client';

import { cn, formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Camera,
  FileText,
  FileSearch,
  Shield,
  HardHat,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'inspection' | 'photo' | 'document' | 'claim' | 'contractor' | 'verification' | 'alert' | 'equity';
  title: string;
  description: string;
  actor: string;
  severity?: 'info' | 'warning' | 'critical';
}

const typeConfig = {
  inspection: { icon: FileSearch, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  photo: { icon: Camera, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  document: { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  claim: { icon: Shield, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  contractor: { icon: HardHat, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  verification: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  equity: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

interface EvidenceTimelineProps {
  propertyId: string;
}

/**
 * Generate a realistic timeline for a property.
 * In production, this would be assembled from database queries.
 */
function getPropertyTimeline(propertyId: string): TimelineEvent[] {
  // Example timeline for prop-001 (Westfield Commerce Center)
  if (propertyId === 'prop-001') {
    return [
      {
        id: 'evt-001',
        date: '2026-02-07T11:00:00Z',
        type: 'contractor',
        title: 'Progress Update — East Facade',
        description: 'Metro Structural Solutions reported 78% completion. All connection points reinforced. Weather barrier installation scheduled for next week.',
        actor: 'Lisa Huang',
      },
      {
        id: 'evt-002',
        date: '2026-02-01T09:00:00Z',
        type: 'contractor',
        title: 'Roof Work Milestone',
        description: 'Apex Roofing completed membrane removal on sections A-D. New drainage system installation underway. 62% overall progress.',
        actor: 'Daniel Brooks',
      },
      {
        id: 'evt-003',
        date: '2026-01-20T14:00:00Z',
        type: 'contractor',
        title: 'Facade Repair Commenced',
        description: 'Metro Structural Solutions mobilized for east facade structural repair. Damaged panels removed, assessment of underlying structure complete.',
        actor: 'Lisa Huang',
      },
      {
        id: 'evt-004',
        date: '2026-01-10T10:00:00Z',
        type: 'contractor',
        title: 'Roof Restoration Started',
        description: 'Apex Roofing & Restoration began roof membrane replacement. Initial setup and material staging complete.',
        actor: 'Daniel Brooks',
      },
      {
        id: 'evt-005',
        date: '2025-12-10T14:00:00Z',
        type: 'claim',
        title: 'Claim Approved — Full Disbursement',
        description: 'National Property Insurance approved claim WCC-2025-4421 for $412,000. Full amount disbursed. 15% scope discrepancy noted between claimed and approved amounts.',
        actor: 'Patricia Wells',
        severity: 'info',
      },
      {
        id: 'evt-006',
        date: '2025-10-25T10:00:00Z',
        type: 'claim',
        title: 'Insurance Claim Filed',
        description: 'Claim WCC-2025-4421 filed with National Property Insurance for $485,000 covering roof, water, and facade damage.',
        actor: 'Marcus Reid',
      },
      {
        id: 'evt-007',
        date: '2025-10-22T16:00:00Z',
        type: 'inspection',
        title: 'Initial Inspection Complete',
        description: 'Severity 7/10. Wind damage to roof membrane, ponding water in multiple areas, HVAC units displaced, east facade impact damage from wind-borne debris.',
        actor: 'James Thornton',
        severity: 'warning',
      },
      {
        id: 'evt-008',
        date: '2025-10-20T10:00:00Z',
        type: 'document',
        title: 'Property Entered System',
        description: 'Westfield Commerce Center added to Equity Builders platform following storm damage report from October 15, 2025.',
        actor: 'Marcus Reid',
      },
    ];
  }

  // Default timeline for other properties
  return [
    {
      id: 'evt-default-001',
      date: new Date().toISOString(),
      type: 'document',
      title: 'Property Added to Platform',
      description: 'Property case file created. Initial documentation pending.',
      actor: 'System',
    },
  ];
}

export function EvidenceTimeline({ propertyId }: EvidenceTimelineProps) {
  const events = getPropertyTimeline(propertyId);

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">Evidence & Activity Timeline</h3>
        </div>
        <span className="text-xs text-slate-500">{events.length} events</span>
      </div>
      <div className="p-5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            {events.map((event) => {
              const config = typeConfig[event.type];
              const Icon = config.icon;

              return (
                <div key={event.id} className="relative flex gap-4 pl-1">
                  {/* Icon on timeline */}
                  <div className={cn(
                    'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border',
                    config.bg,
                    config.border,
                  )}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{event.title}</span>
                      {event.severity === 'critical' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">CRITICAL</span>
                      )}
                      {event.severity === 'warning' && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">ATTENTION</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>{event.actor}</span>
                      <span>·</span>
                      <span>{formatDate(event.date)}</span>
                      <span>·</span>
                      <span>{formatRelativeTime(event.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
