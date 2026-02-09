/**
 * Intelligence Center — The heart of the platform.
 * 
 * This is the first page users see after authentication.
 * It provides a comprehensive, at-a-glance view of:
 * - Key performance metrics
 * - Property pipeline status
 * - ATOS intelligence insights
 * - Recent activity across all modules
 * 
 * Design principle: High data density, low cognitive load.
 * Every element answers a specific question the user might have.
 */

'use client';

import { useEffect } from 'react';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { PropertyPipeline } from '@/components/dashboard/property-pipeline';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { dashboardMetrics, properties, atosInsights, recentActivity } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';

export default function DashboardPage() {
  const setContext = useAtosStore(s => s.setContext);

  // Set ATOS context to dashboard when this page is active
  useEffect(() => {
    setContext('dashboard');
  }, [setContext]);

  return (
    <div className="space-y-6">
      {/* Welcome banner — personalized greeting with quick action */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good afternoon, Marcus</h1>
            <p className="text-slate-300 mt-1 text-sm">
              You have <span className="text-amber-400 font-semibold">2 critical items</span> and{' '}
              <span className="text-emerald-400 font-semibold">1 high-value opportunity</span> requiring attention.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-slate-400">Feb 9, 2026</span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <MetricsGrid metrics={dashboardMetrics} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left column — Pipeline + Activity */}
        <div className="lg:col-span-3 space-y-6">
          <PropertyPipeline properties={properties} />
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Right column — ATOS Insights */}
        <div className="lg:col-span-2">
          <InsightsPanel insights={atosInsights} />
        </div>
      </div>
    </div>
  );
}
