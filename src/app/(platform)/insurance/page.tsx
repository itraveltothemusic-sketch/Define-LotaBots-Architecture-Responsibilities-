/**
 * Insurance Intelligence Module — Claims listing page.
 * 
 * Tracks all insurance claims through their full lifecycle.
 * Key intelligence features:
 * - Scope discrepancy detection (highlighted prominently)
 * - Carrier interaction logs
 * - Amount comparisons (claimed vs approved vs paid)
 * - Status-based workflow tracking
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { CLAIM_STATUS_CONFIG, ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { insuranceClaims } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import { Shield, Plus, Filter, AlertTriangle, DollarSign, CheckCircle2 } from 'lucide-react';
import type { InsuranceClaim } from '@/types';

export default function InsurancePage() {
  const router = useRouter();
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('insurance');
  }, [setContext]);

  // Calculate summary metrics
  const totalClaimed = insuranceClaims.reduce((sum, c) => sum + c.amountClaimed, 0);
  const totalApproved = insuranceClaims.reduce((sum, c) => sum + (c.amountApproved || 0), 0);
  const totalPaid = insuranceClaims.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
  const withDiscrepancies = insuranceClaims.filter(c => c.scopeDiscrepancy && c.scopeDiscrepancy > 10).length;

  const columns = [
    {
      key: 'claim',
      header: 'Claim',
      render: (c: InsuranceClaim) => (
        <div>
          <p className="text-sm font-semibold text-slate-900">{c.claimNumber || 'Draft'}</p>
          <p className="text-xs text-slate-500 mt-0.5">{c.propertyName}</p>
        </div>
      ),
    },
    {
      key: 'carrier',
      header: 'Carrier',
      className: 'hidden md:table-cell',
      render: (c: InsuranceClaim) => (
        <span className="text-sm text-slate-600">{c.carrier}</span>
      ),
    },
    {
      key: 'claimed',
      header: 'Claimed',
      className: 'text-right',
      render: (c: InsuranceClaim) => (
        <span className="text-sm font-medium text-slate-700 tabular-nums">
          {formatCurrency(c.amountClaimed)}
        </span>
      ),
    },
    {
      key: 'approved',
      header: 'Approved',
      className: 'text-right hidden md:table-cell',
      render: (c: InsuranceClaim) => (
        <span className={cn('text-sm font-medium tabular-nums', c.amountApproved ? 'text-emerald-600' : 'text-slate-400')}>
          {c.amountApproved ? formatCurrency(c.amountApproved) : '—'}
        </span>
      ),
    },
    {
      key: 'discrepancy',
      header: 'Discrepancy',
      className: 'hidden lg:table-cell',
      render: (c: InsuranceClaim) => {
        if (!c.scopeDiscrepancy) return <span className="text-xs text-slate-400">—</span>;
        const isHigh = c.scopeDiscrepancy > 10;
        return (
          <div className="flex items-center gap-1">
            {isHigh && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            <span className={cn('text-sm font-medium', isHigh ? 'text-amber-600' : 'text-slate-600')}>
              {c.scopeDiscrepancy}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: InsuranceClaim) => {
        const config = CLAIM_STATUS_CONFIG[c.status];
        return config ? (
          <StatusBadge label={config.label} color={config.color} bgColor={config.bgColor} />
        ) : (
          <span className="text-sm text-slate-500">{c.status}</span>
        );
      },
    },
    {
      key: 'filed',
      header: 'Filed',
      className: 'hidden lg:table-cell',
      render: (c: InsuranceClaim) => (
        <span className="text-xs text-slate-500">
          {c.filedDate ? formatDate(c.filedDate) : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Insurance Claims</h1>
            <p className="text-sm text-slate-500">{insuranceClaims.length} claims across all properties</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            File Claim
          </button>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Total Claimed</span>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-nums">{formatCurrency(totalClaimed)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500">Total Approved</span>
          </div>
          <p className="text-xl font-bold text-emerald-600 tabular-nums">{formatCurrency(totalApproved)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500">Total Paid</span>
          </div>
          <p className="text-xl font-bold text-blue-600 tabular-nums">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500">Scope Discrepancies</span>
          </div>
          <p className="text-xl font-bold text-amber-600 tabular-nums">{withDiscrepancies}</p>
          <p className="text-xs text-slate-500 mt-0.5">{withDiscrepancies > 0 ? 'Requires supplemental claims' : 'None detected'}</p>
        </div>
      </div>

      {/* Claims table */}
      <DataTable
        columns={columns}
        data={insuranceClaims}
        keyExtractor={c => c.id}
        onRowClick={c => router.push(ROUTES.insuranceDetail(c.id))}
        emptyMessage="No insurance claims found."
      />
    </div>
  );
}
