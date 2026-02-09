/**
 * Equity Outcome Module — The endgame page.
 * 
 * This is where the platform proves its value: showing how
 * forensic documentation + insurance intelligence + proper execution
 * = verified equity gains.
 * 
 * Key visualizations:
 * - Before/after valuations
 * - Insurance payout vs repair cost deltas
 * - Net equity gain with supporting narratives
 * - Portfolio-wide equity summary
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { equityOutcomes } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import { TrendingUp, ArrowUpRight, BarChart3, CheckCircle2 } from 'lucide-react';

const equityStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  calculating: { label: 'Calculating', color: 'text-amber-700',   bgColor: 'bg-amber-100' },
  draft:       { label: 'Draft',       color: 'text-blue-700',    bgColor: 'bg-blue-100' },
  verified:    { label: 'Verified',    color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  published:   { label: 'Published',   color: 'text-green-700',   bgColor: 'bg-green-100' },
};

export default function EquityPage() {
  const router = useRouter();
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('equity');
  }, [setContext]);

  // Portfolio-wide calculations
  const totalEquityGain = equityOutcomes.reduce((sum, e) => sum + e.equityGain, 0);
  const totalInsurancePayout = equityOutcomes.reduce((sum, e) => sum + e.insurancePayout, 0);
  const totalRepairCost = equityOutcomes.reduce((sum, e) => sum + e.repairCost, 0);
  const verifiedGains = equityOutcomes.filter(e => e.status === 'verified').reduce((sum, e) => sum + e.equityGain, 0);
  const avgGainPercent = equityOutcomes.reduce((sum, e) => sum + e.equityGainPercent, 0) / equityOutcomes.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Equity Outcomes</h1>
            <p className="text-sm text-slate-500">{equityOutcomes.length} properties tracked</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm">
          <BarChart3 className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold opacity-90">Portfolio Equity Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-4">
          <div>
            <p className="text-sm opacity-70">Total Equity Gain</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{formatCurrency(totalEquityGain)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Verified Gains</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{formatCurrency(verifiedGains)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Avg Gain %</p>
            <p className="text-3xl font-bold mt-1">{formatPercent(avgGainPercent)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Insurance Payouts</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{formatCurrency(totalInsurancePayout)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Repair Investment</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{formatCurrency(totalRepairCost)}</p>
          </div>
        </div>
      </div>

      {/* Individual Equity Outcomes */}
      <div className="space-y-4">
        {equityOutcomes.map(outcome => {
          const statusCfg = equityStatusConfig[outcome.status];

          return (
            <div
              key={outcome.id}
              onClick={() => router.push(ROUTES.equityDetail(outcome.id))}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{outcome.propertyName}</h3>
                    {statusCfg && (
                      <StatusBadge label={statusCfg.label} color={statusCfg.color} bgColor={statusCfg.bgColor} />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{outcome.propertyAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600 tabular-nums">
                    +{formatCurrency(outcome.equityGain)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600">
                      {formatPercent(outcome.equityGainPercent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Valuation comparison */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Value Before</p>
                  <p className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">
                    {formatCurrency(outcome.valueBefore)}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-600">Value After</p>
                  <p className="text-sm font-bold text-emerald-700 tabular-nums mt-0.5">
                    {formatCurrency(outcome.valueAfter)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Insurance Payout</p>
                  <p className="text-sm font-bold text-blue-700 tabular-nums mt-0.5">
                    {formatCurrency(outcome.insurancePayout)}
                  </p>
                </div>
                <div className={cn('rounded-lg p-3', outcome.repairCost > 0 ? 'bg-orange-50' : 'bg-slate-50')}>
                  <p className={cn('text-xs', outcome.repairCost > 0 ? 'text-orange-600' : 'text-slate-500')}>
                    Repair Cost
                  </p>
                  <p className={cn('text-sm font-bold tabular-nums mt-0.5', outcome.repairCost > 0 ? 'text-orange-700' : 'text-slate-400')}>
                    {outcome.repairCost > 0 ? formatCurrency(outcome.repairCost) : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Narrative */}
              {outcome.narrative && (
                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-emerald-400">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Equity Gain Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{outcome.narrative}</p>
                </div>
              )}

              {/* Verification */}
              {outcome.status === 'verified' && outcome.verifiedBy && (
                <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified by {outcome.verifiedBy} on {outcome.verifiedAt ? new Date(outcome.verifiedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
