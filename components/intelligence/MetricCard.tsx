/**
 * Metric Card Component
 * 
 * Displays key metrics with icons and trends
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function MetricCard({ title, value, icon: Icon, trend, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-forensic-50 text-forensic-600',
    green: 'bg-equity-50 text-equity-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-warning-50 text-warning-600',
    red: 'bg-critical-50 text-critical-600',
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
