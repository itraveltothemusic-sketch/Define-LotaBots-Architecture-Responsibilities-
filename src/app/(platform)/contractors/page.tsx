/**
 * Contractor Execution Module — Contractor listing page.
 * 
 * Displays all contractors with their verification status,
 * specialties, ratings, and active assignments. The compliance
 * tracking is front-and-center because it's a legal requirement,
 * not an afterthought.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn, formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DataTable } from '@/components/ui/data-table';
import { contractors, assignments } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import { HardHat, Plus, Filter, Star, ShieldCheck, ShieldAlert, ClipboardCheck } from 'lucide-react';
import type { Contractor } from '@/types';

const contractorStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending:   { label: 'Pending',   color: 'text-amber-700',   bgColor: 'bg-amber-100' },
  verified:  { label: 'Verified',  color: 'text-blue-700',    bgColor: 'bg-blue-100' },
  active:    { label: 'Active',    color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  suspended: { label: 'Suspended', color: 'text-red-700',     bgColor: 'bg-red-100' },
  inactive:  { label: 'Inactive',  color: 'text-slate-700',   bgColor: 'bg-slate-100' },
};

export default function ContractorsPage() {
  const router = useRouter();
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('contractors');
  }, [setContext]);

  const activeContractors = contractors.filter(c => c.status === 'active').length;
  const pendingVerification = contractors.filter(c => c.status === 'pending').length;
  const totalActiveAssignments = assignments.filter(a => ['in-progress', 'accepted'].includes(a.status)).length;

  const columns = [
    {
      key: 'company',
      header: 'Contractor',
      render: (c: Contractor) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold',
            c.insuranceVerified ? 'bg-emerald-500' : 'bg-amber-500'
          )}>
            {c.companyName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{c.companyName}</p>
            <p className="text-xs text-slate-500">{c.contactName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'specialties',
      header: 'Specialties',
      className: 'hidden lg:table-cell',
      render: (c: Contractor) => (
        <div className="flex flex-wrap gap-1">
          {c.specialties.slice(0, 2).map(s => (
            <span key={s} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {s}
            </span>
          ))}
          {c.specialties.length > 2 && (
            <span className="text-[10px] text-slate-400">+{c.specialties.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'insurance',
      header: 'Insurance',
      className: 'hidden md:table-cell',
      render: (c: Contractor) => (
        <div className="flex items-center gap-1.5">
          {c.insuranceVerified ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Verified</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">Pending</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      className: 'hidden md:table-cell',
      render: (c: Contractor) => (
        c.rating ? (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-slate-700">{c.rating}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No ratings</span>
        )
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      className: 'text-center hidden md:table-cell',
      render: (c: Contractor) => (
        <div className="text-center">
          <span className="text-sm font-medium text-slate-900">{c.completedProjects}</span>
          <span className="text-xs text-slate-400 ml-1">completed</span>
        </div>
      ),
    },
    {
      key: 'active',
      header: 'Active',
      className: 'text-center',
      render: (c: Contractor) => (
        <span className={cn(
          'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold',
          c.activeAssignments > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'
        )}>
          {c.activeAssignments}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Contractor) => {
        const config = contractorStatusConfig[c.status];
        return config ? (
          <StatusBadge label={config.label} color={config.color} bgColor={config.bgColor} />
        ) : null;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Contractors</h1>
            <p className="text-sm text-slate-500">{contractors.length} contractors · {activeContractors} active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-sm">
            <Plus className="w-4 h-4" />
            Add Contractor
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Active Contractors</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{activeContractors}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Pending Verification</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingVerification}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Active Assignments</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalActiveAssignments}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Avg Compliance</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">95.5%</p>
        </div>
      </div>

      {/* Contractor table */}
      <DataTable
        columns={columns}
        data={contractors}
        keyExtractor={c => c.id}
        onRowClick={c => router.push(ROUTES.contractorDetail(c.id))}
        emptyMessage="No contractors found."
      />

      {/* Active Assignments Section */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Active Assignments</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {assignments.filter(a => a.status !== 'completed').map(a => (
            <div key={a.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.contractorName}</p>
                  <p className="text-xs text-slate-500">{a.propertyName} · {a.status.replace(/-/g, ' ')}</p>
                </div>
                <span className="text-sm font-medium text-slate-700 tabular-nums">{formatCurrency(a.estimatedCost)}</span>
              </div>
              <p className="text-xs text-slate-600 mb-2 line-clamp-1">{a.scope}</p>
              <ProgressBar value={a.progressPercent} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
