/**
 * Intelligence Page — Deep analytics and cross-module intelligence.
 * 
 * This goes beyond the dashboard summary to provide:
 * - Portfolio-wide risk assessment
 * - Cross-module correlation insights
 * - Historical performance trends
 * - ATOS deep analysis results
 * - Carrier performance benchmarks
 * 
 * This is the page that makes the platform feel like having
 * a forensic analyst on staff 24/7.
 */

'use client';

import { useEffect } from 'react';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { useAtosStore } from '@/stores/atos-store';
import { InsightCard } from '@/components/ui/insight-card';
import {
  properties,
  insuranceClaims,
  assignments,
  equityOutcomes,
  atosInsights,
} from '@/lib/mock-data';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Shield,
  BarChart3,
  Target,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function IntelligencePage() {
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('intelligence');
  }, [setContext]);

  // Cross-module analytics
  const riskProperties = properties.filter(p =>
    ['inspection', 'disputed'].includes(p.status)
  );
  const staleClaims = insuranceClaims.filter(c =>
    ['under-review', 'additional-info-requested'].includes(c.status)
  );
  const avgComplianceScore = assignments
    .filter(a => a.complianceScore)
    .reduce((sum, a) => sum + (a.complianceScore || 0), 0) /
    assignments.filter(a => a.complianceScore).length || 0;

  const portfolioValue = properties.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
  const totalEquityGain = equityOutcomes.reduce((sum, e) => sum + e.equityGain, 0);
  const totalClaimedAmount = insuranceClaims.reduce((sum, c) => sum + c.amountClaimed, 0);
  const totalApprovedAmount = insuranceClaims.reduce((sum, c) => sum + (c.amountApproved || 0), 0);

  const carrierPerformance = [
    {
      carrier: 'National Property Insurance',
      claims: 2,
      avgApprovalRate: 91,
      avgProcessingDays: 42,
      avgDiscrepancy: 13,
    },
    {
      carrier: 'Southwest Commercial Mutual',
      claims: 1,
      avgApprovalRate: 0,
      avgProcessingDays: 78,
      avgDiscrepancy: 0,
    },
    {
      carrier: 'Metropolitan Underwriters',
      claims: 1,
      avgApprovalRate: 0,
      avgProcessingDays: 0,
      avgDiscrepancy: 0,
    },
    {
      carrier: 'Allied Property Group',
      claims: 1,
      avgApprovalRate: 94.4,
      avgProcessingDays: 95,
      avgDiscrepancy: 5.5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Intelligence Deep Dive</h1>
          <p className="text-sm text-slate-500">Cross-module analytics and forensic intelligence</p>
        </div>
      </div>

      {/* Portfolio Health Score */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Portfolio Health Assessment</h2>
          <span className="text-xs font-medium text-slate-500">Updated 2 hours ago</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border-4 border-emerald-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-700">78</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-2">Overall Score</p>
            <p className="text-xs text-slate-500">out of 100</p>
          </div>
          <div className="text-center">
            <div className={cn(
              'w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center',
              riskProperties.length > 0 ? 'bg-amber-50 border-amber-400' : 'bg-emerald-50 border-emerald-400'
            )}>
              <span className={cn('text-2xl font-bold', riskProperties.length > 0 ? 'text-amber-700' : 'text-emerald-700')}>
                {riskProperties.length}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-2">Risk Properties</p>
            <p className="text-xs text-slate-500">requiring attention</p>
          </div>
          <div className="text-center">
            <div className={cn(
              'w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center',
              staleClaims.length > 0 ? 'bg-orange-50 border-orange-400' : 'bg-emerald-50 border-emerald-400'
            )}>
              <span className={cn('text-2xl font-bold', staleClaims.length > 0 ? 'text-orange-700' : 'text-emerald-700')}>
                {staleClaims.length}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-2">Stale Claims</p>
            <p className="text-xs text-slate-500">awaiting carrier action</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-700">{avgComplianceScore.toFixed(0)}%</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-2">Compliance</p>
            <p className="text-xs text-slate-500">contractor average</p>
          </div>
        </div>
      </div>

      {/* Financial Intelligence */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Financial Overview
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total Portfolio Value', value: formatCurrency(portfolioValue), color: 'text-slate-900' },
              { label: 'Total Insurance Claimed', value: formatCurrency(totalClaimedAmount), color: 'text-blue-600' },
              { label: 'Total Insurance Approved', value: formatCurrency(totalApprovedAmount), color: 'text-emerald-600' },
              { label: 'Approval Rate', value: totalClaimedAmount > 0 ? formatPercent((totalApprovedAmount / totalClaimedAmount) * 100) : 'N/A', color: 'text-slate-900' },
              { label: 'Total Equity Gained', value: formatCurrency(totalEquityGain), color: 'text-emerald-600' },
              { label: 'Equity as % of Portfolio', value: portfolioValue > 0 ? formatPercent((totalEquityGain / portfolioValue) * 100) : 'N/A', color: 'text-violet-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={cn('text-sm font-bold tabular-nums', item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-600" />
            Carrier Performance Benchmarks
          </h3>
          <div className="space-y-4">
            {carrierPerformance.map((carrier, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{carrier.carrier}</span>
                  <span className="text-xs text-slate-500">{carrier.claims} claim{carrier.claims !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className={cn('text-sm font-bold', carrier.avgApprovalRate > 85 ? 'text-emerald-600' : carrier.avgApprovalRate > 0 ? 'text-amber-600' : 'text-slate-400')}>
                      {carrier.avgApprovalRate > 0 ? `${carrier.avgApprovalRate}%` : 'Pending'}
                    </p>
                    <p className="text-[10px] text-slate-500">Approval Rate</p>
                  </div>
                  <div>
                    <p className={cn('text-sm font-bold', carrier.avgProcessingDays > 60 ? 'text-amber-600' : carrier.avgProcessingDays > 0 ? 'text-slate-700' : 'text-slate-400')}>
                      {carrier.avgProcessingDays > 0 ? `${carrier.avgProcessingDays}d` : 'N/A'}
                    </p>
                    <p className="text-[10px] text-slate-500">Avg Processing</p>
                  </div>
                  <div>
                    <p className={cn('text-sm font-bold', carrier.avgDiscrepancy > 10 ? 'text-red-600' : carrier.avgDiscrepancy > 0 ? 'text-slate-700' : 'text-slate-400')}>
                      {carrier.avgDiscrepancy > 0 ? `${carrier.avgDiscrepancy}%` : 'N/A'}
                    </p>
                    <p className="text-[10px] text-slate-500">Scope Gap</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          Pipeline Flow Analysis
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { stage: 'Intake', count: 0, color: 'bg-slate-200' },
            { stage: 'Inspection', count: 1, color: 'bg-blue-400' },
            { stage: 'Claim Filed', count: 1, color: 'bg-indigo-400' },
            { stage: 'Under Review', count: 1, color: 'bg-amber-400' },
            { stage: 'Approved', count: 1, color: 'bg-emerald-400' },
            { stage: 'In Repair', count: 1, color: 'bg-orange-400' },
            { stage: 'Verification', count: 0, color: 'bg-purple-400' },
            { stage: 'Complete', count: 1, color: 'bg-green-500' },
          ].map((stage, i, arr) => (
            <div key={stage.stage} className="flex items-center gap-2 flex-shrink-0">
              <div className={cn(
                'px-4 py-3 rounded-lg text-center min-w-[100px]',
                stage.count > 0 ? 'bg-white border-2 border-slate-200' : 'bg-slate-50 border border-slate-100'
              )}>
                <div className={cn('w-3 h-3 rounded-full mx-auto mb-1.5', stage.color)} />
                <p className="text-lg font-bold text-slate-900">{stage.count}</p>
                <p className="text-[10px] text-slate-500 whitespace-nowrap">{stage.stage}</p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <strong>ATOS Analysis:</strong> Pipeline flow is healthy with no bottlenecks. 
          The Riverside Industrial property (inspection stage) has the highest urgency — 
          the severity 9/10 finding with potential pre-existing conditions requires immediate structural assessment 
          to prevent claim eligibility issues.
        </div>
      </div>

      {/* Active ATOS Insights */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-600" />
            Active Intelligence Findings
          </h3>
          <span className="text-xs text-slate-500">{atosInsights.filter(i => !i.dismissed).length} active</span>
        </div>
        <div className="space-y-3">
          {atosInsights
            .filter(i => !i.dismissed)
            .sort((a, b) => {
              const order = { critical: 0, warning: 1, opportunity: 2, info: 3 };
              return order[a.severity] - order[b.severity];
            })
            .map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-bold text-red-900">Critical Risks</h4>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-red-800">
              <strong>Riverside Industrial</strong> — Pre-existing foundation issues may void storm damage claim. Engineering assessment urgently needed.
            </li>
            <li className="text-sm text-red-800">
              <strong>Oakmont scope gap</strong> — $45K in documented damage excluded from carrier scope. Supplemental claim window closing.
            </li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold text-amber-900">Watch Items</h4>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-amber-800">
              <strong>Apex Roofing insurance</strong> — GL policy expires March 1. 2 active projects affected.
            </li>
            <li className="text-sm text-amber-800">
              <strong>Meridian Tower adjuster</strong> — No adjuster assigned after 32 days. Follow up with Metropolitan Underwriters.
            </li>
          </ul>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-900">Opportunities</h4>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-emerald-800">
              <strong>Meridian Tower</strong> — Potential 15-22% equity gain ($1.8M-$2.7M) with strategic material upgrades.
            </li>
            <li className="text-sm text-emerald-800">
              <strong>Summit Ridge</strong> — Full roof + HVAC replacement positions for 14.5% equity gain ($900K).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
