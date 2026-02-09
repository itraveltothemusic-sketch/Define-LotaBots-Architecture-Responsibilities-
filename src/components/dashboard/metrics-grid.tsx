/**
 * MetricsGrid — Top-level KPI display for the Intelligence Center.
 * 
 * Shows the most critical numbers at a glance. Each metric is
 * designed to answer a specific question:
 * - How many properties are we managing?
 * - What needs immediate attention?
 * - How much value have we created?
 * - How effective are our claims?
 */

'use client';

import { MetricCard } from '@/components/ui/metric-card';
import { Building2, Search, Shield, HardHat, TrendingUp, Target } from 'lucide-react';
import { formatCurrencyCompact, formatPercent } from '@/lib/utils';
import type { DashboardMetrics } from '@/types';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        label="Total Properties"
        value={metrics.totalProperties}
        icon={Building2}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        trend="up"
        trendValue="+2 this month"
      />
      <MetricCard
        label="Active Inspections"
        value={metrics.activeInspections}
        icon={Search}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
        trend="neutral"
        trendValue="On schedule"
      />
      <MetricCard
        label="Pending Claims"
        value={metrics.pendingClaims}
        icon={Shield}
        iconColor="text-violet-600"
        iconBg="bg-violet-50"
        trend="down"
        trendValue="1 resolved"
      />
      <MetricCard
        label="Active Repairs"
        value={metrics.activeRepairs}
        icon={HardHat}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        trend="up"
        trendValue="62% avg progress"
      />
      <MetricCard
        label="Equity Gained"
        value={formatCurrencyCompact(metrics.totalEquityGained)}
        icon={TrendingUp}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        trend="up"
        trendValue="$350K verified"
      />
      <MetricCard
        label="Approval Rate"
        value={formatPercent(metrics.avgClaimApprovalRate)}
        icon={Target}
        iconColor="text-rose-600"
        iconBg="bg-rose-50"
        trend="up"
        trendValue="Above average"
      />
    </div>
  );
}
