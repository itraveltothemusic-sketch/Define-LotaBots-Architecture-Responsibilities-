/**
 * Equity Outcome Detail Page.
 * 
 * Deep-dive into a single equity outcome showing the complete
 * evidence chain from damage to verified equity gain.
 */

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { equityOutcomes } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export default function EquityDetailPage() {
  const params = useParams();
  const equityId = params.id as string;
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('equity', equityId, 'equity');
  }, [setContext, equityId]);

  const outcome = equityOutcomes.find(e => e.id === equityId);

  if (!outcome) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-slate-900">Equity outcome not found</p>
        <Link href={ROUTES.equity} className="text-blue-600 hover:underline mt-2 text-sm">
          ← Back to Equity
        </Link>
      </div>
    );
  }

  const netBenefit = outcome.insurancePayout - outcome.repairCost;

  return (
    <div className="space-y-6">
      <Link
        href={ROUTES.equity}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equity Outcomes
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{outcome.propertyName}</h1>
            <p className="text-emerald-100 mt-1">{outcome.propertyAddress}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <ArrowUpRight className="w-6 h-6" />
              <span className="text-4xl font-bold">+{formatCurrency(outcome.equityGain)}</span>
            </div>
            <p className="text-emerald-200 mt-1 text-lg font-semibold">
              {formatPercent(outcome.equityGainPercent)} equity gain
            </p>
          </div>
        </div>

        {/* Value comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
          <div>
            <p className="text-sm opacity-70">Value Before</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(outcome.valueBefore)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Value After</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(outcome.valueAfter)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Insurance Payout</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(outcome.insurancePayout)}</p>
          </div>
          <div>
            <p className="text-sm opacity-70">Repair Cost</p>
            <p className="text-2xl font-bold mt-1">
              {outcome.repairCost > 0 ? formatCurrency(outcome.repairCost) : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Financial Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Financial Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Property Value Increase</span>
              <span className="text-sm font-bold text-emerald-600">+{formatCurrency(outcome.valueAfter - outcome.valueBefore)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Insurance Payout</span>
              <span className="text-sm font-bold text-blue-600">{formatCurrency(outcome.insurancePayout)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Total Repair Cost</span>
              <span className="text-sm font-bold text-orange-600">
                {outcome.repairCost > 0 ? `-${formatCurrency(outcome.repairCost)}` : 'Pending'}
              </span>
            </div>
            {outcome.repairCost > 0 && (
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Net Insurance Benefit</span>
                <span className={cn('text-sm font-bold', netBenefit >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                  {netBenefit >= 0 ? '+' : ''}{formatCurrency(netBenefit)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-3 bg-emerald-50 rounded-lg px-4">
              <span className="text-sm font-bold text-emerald-900">Net Equity Gain</span>
              <span className="text-lg font-bold text-emerald-600">+{formatCurrency(outcome.equityGain)}</span>
            </div>
          </div>
        </div>

        {/* Narrative & Verification */}
        <div className="space-y-6">
          {outcome.narrative && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Equity Gain Narrative</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{outcome.narrative}</p>
              {outcome.status === 'verified' && outcome.verifiedBy && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified by {outcome.verifiedBy} on {outcome.verifiedAt ? formatDate(outcome.verifiedAt) : 'N/A'}</span>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Evidence Chain</h3>
            <p className="text-sm text-slate-500">
              This equity outcome is supported by the complete documentation chain including
              inspection reports, insurance claim records, contractor scope execution documentation,
              and independent valuation assessments.
            </p>
            <Link
              href={ROUTES.propertyDetail(outcome.propertyId)}
              className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:underline font-medium"
            >
              <Building2 className="w-4 h-4" />
              View Full Property Case File →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
