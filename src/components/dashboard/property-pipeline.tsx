/**
 * PropertyPipeline — Visual pipeline showing properties by status.
 * 
 * This is a key intelligence visualization: it shows at a glance
 * how properties flow through the system. Bottlenecks become visible
 * immediately — if too many properties are stuck in "claim-review",
 * something needs attention.
 */

'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { PROPERTY_STATUS_CONFIG, ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Property } from '@/types';

interface PropertyPipelineProps {
  properties: Property[];
}

export function PropertyPipeline({ properties }: PropertyPipelineProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Property Pipeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">All properties by current stage</p>
        </div>
        <Link
          href={ROUTES.properties}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {properties.map(property => {
          const statusConfig = PROPERTY_STATUS_CONFIG[property.status];
          const isActive = ['inspection', 'claim-review', 'in-repair'].includes(property.status);

          return (
            <Link
              key={property.id}
              href={ROUTES.propertyDetail(property.id)}
              className="block px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {property.name}
                    </p>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {property.estimatedValue && (
                    <span className="text-xs font-medium text-slate-600 tabular-nums">
                      {formatCurrency(property.estimatedValue)}
                    </span>
                  )}
                  {statusConfig && (
                    <StatusBadge
                      label={statusConfig.label}
                      color={statusConfig.color}
                      bgColor={statusConfig.bgColor}
                    />
                  )}
                </div>
              </div>
              {/* Damage classifications */}
              <div className="flex flex-wrap gap-1 mt-2">
                {property.damageClassifications.map(dc => (
                  <span
                    key={dc}
                    className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize"
                  >
                    {dc}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
